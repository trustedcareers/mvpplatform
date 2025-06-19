import { supabase as defaultSupabase } from "@/lib/supabase";
import { buildContractAnalysisPrompt } from "./prompts/buildContractAnalysisPrompt";
import { parseReviewResults } from "./parseReviewResults";
import { saveReviewResults } from "./saveReviewResults";
import OpenAI from "openai";
import type { SupabaseClient } from '@supabase/supabase-js';
import pdfParse from "pdf-parse";
import knowledgeBase from "@/lib/contractKnowledgeBase.json";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function analyzeContract(userId: string, supabaseClient?: SupabaseClient) {
  console.log('[analyzeContract] Starting analysis for user:', userId);
  
  // Use provided client or default
  const supabase = supabaseClient || defaultSupabase;
  
  try {

  // 1. Fetch user context
  const { data: userContext, error: userError } = await supabase
    .from("user_context")
    .select("*")
    .eq("user_id", userId)
    .single();
  
  console.log('[analyzeContract] User context:', userContext);
  console.log('[analyzeContract] User context error:', userError);
  
  let contextToUse = userContext;
  
  if (userError || !userContext) {
    console.log('[analyzeContract] No user context found, creating default...');
    // Create default user context
    const { data: newContext, error: createError } = await supabase
      .from("user_context")
      .insert({
        user_id: userId,
        role_title: 'Software Engineer',
        level: 'senior',
        industry: 'Technology',
        situation: 'exploring',
        target_comp_base: 150000,
        target_comp_total: 200000,
        priorities: ['comp', 'growth'],
        confidence_rating: 4
      })
      .select()
      .single();
    
    if (createError || !newContext) {
      console.error('[analyzeContract] Failed to create user context:', createError);
      throw new Error("Failed to create user context");
    }
    
    console.log('[analyzeContract] Created new user context:', newContext);
    contextToUse = newContext;
  }

  // After fetching user context:
  const template = getRoleTemplate(contextToUse.role_title, contextToUse.level);
  if (template) {
    console.log(`[analyzeContract] Role template loaded from JSON knowledge base: ${contextToUse.role_title} (${contextToUse.level})`);
  } else {
    console.log(`[analyzeContract] No template found in JSON for ${contextToUse.role_title} (${contextToUse.level}), will use GPT-4o/public prompt for expected clauses.`);
    // Here you would call GPT-4o or fallback logic
  }

  // 2. Fetch uploaded documents
  const { data: docs, error: docsError } = await supabase
    .from("contract_documents")
    .select("*")
    .eq("user_id", userId);
  
  console.log('[analyzeContract] Documents found:', docs?.length || 0);
  if (docsError || !docs) throw new Error("No documents found");

  // 3. Extract document content from actual files
  let contractText = "";
  for (const doc of docs) {
    console.log('[analyzeContract] Processing document:', doc.filename, 'URL:', doc.file_url);
    
    if (doc.text_content) {
      // If text content already exists, use it
      contractText += `\n---\nDocument: ${doc.filename}\n${doc.text_content}`;
      console.log('[analyzeContract] Using existing text content for:', doc.filename);
    } else {
      // Extract text from the actual file
      try {
        const extractedText = await extractTextFromFile(doc.file_url, doc.file_type);
        contractText += `\n---\nDocument: ${doc.filename}\n${extractedText}`;
        console.log('[analyzeContract] Extracted text from:', doc.filename, 'Length:', extractedText.length);
        
        // Save extracted text back to database for future use
        await supabase
          .from('contract_documents')
          .update({ text_content: extractedText })
          .eq('id', doc.id);
          
      } catch (extractError) {
        console.warn('[analyzeContract] Failed to extract text from:', doc.filename, extractError);
        // Fallback to simulated content
        const simulatedContent = getSimulatedContent(doc.file_type, doc.filename);
        contractText += `\n---\nDocument: ${doc.filename} (simulated content - extraction failed)\n${simulatedContent}`;
      }
    }
  }

  // 4. Build the OpenAI prompt using the utility with user context
  const prompt = buildContractAnalysisPrompt(
    [{ filename: 'contract', content: contractText }], 
    contextToUse
  );
  console.log('[analyzeContract] Prompt built, length:', prompt.length);

  // 5. Call OpenAI with fallback
  let gptOutput = "";
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are a helpful contract analysis assistant." },
        { role: "user", content: prompt }
      ],
      temperature: 0.3,
    });
    gptOutput = completion.choices[0]?.message?.content || "[]";
    console.log('[analyzeContract] OpenAI response received, length:', gptOutput.length);
    console.log('[analyzeContract] Raw GPT output:', gptOutput);
  } catch (openaiError) {
    console.warn('[analyzeContract] OpenAI failed, using mock data:', openaiError);
    // Fallback mock data for testing
    gptOutput = `{
      "clauses": [
        {
          "clause_type": "Non-Compete",
          "clause_status": "red_flag",
          "rationale": "12-month duration exceeds industry norms for senior engineers",
          "recommendation": "Negotiate down to 6 months or add geographic limitations",
          "source_document": "${docs[0]?.filename || 'unknown'}",
          "confidence_score": 0.85
        },
        {
          "clause_type": "Equity Vesting",
          "clause_status": "standard",
          "rationale": "4-year vesting with 1-year cliff is industry standard",
          "recommendation": "No changes needed",
          "source_document": "${docs[0]?.filename || 'unknown'}",
          "confidence_score": 0.95
        }
      ],
      "summary": {
        "strengths": ["Competitive equity package", "Standard vesting terms"],
        "opportunities": ["Negotiate non-compete duration", "Clarify severance terms"],
        "alignment_rating": "partially_aligned",
        "alignment_explanation": "The offer meets most compensation targets but has concerning restrictive covenants",
        "confidence_score": 0.8,
        "recommendation": "Accept with negotiations on non-compete terms",
        "negotiation_priorities": ["Reduce non-compete duration", "Add geographic limitations", "Clarify severance package"]
      }
    }`;
  }

  // 6. Parse the JSON into clause objects using utility
  const analysisResult = parseReviewResults(gptOutput);
  console.log('[analyzeContract] Parsed result:', {
    clauseCount: analysisResult.clauses?.length || 0,
    hasSummary: !!analysisResult.summary
  });

  // 7. Save to review_results using utility - pass supabase client
  try {
    console.log('[analyzeContract] About to save results to database...');
    await saveReviewResults(userId, analysisResult, supabase);
    console.log('[analyzeContract] Saved to database');
  } catch (saveError) {
    console.error('[analyzeContract] Error saving to database:', saveError);
    console.error('[analyzeContract] Error type:', typeof saveError);
    console.error('[analyzeContract] Error details:', JSON.stringify(saveError, null, 2));
    
    let errorMessage = 'Unknown error';
    if (saveError instanceof Error) {
      errorMessage = saveError.message;
    } else if (typeof saveError === 'object' && saveError !== null) {
      errorMessage = JSON.stringify(saveError);
    } else {
      errorMessage = String(saveError);
    }
    
    throw new Error(`Failed to save analysis results: ${errorMessage}`);
  }

  // 8. Log to prompt_logs with enhanced fields
  await supabase.from("prompt_logs").insert({
    user_id: userId,
    input_excerpt: contractText.substring(0, 500) + (contractText.length > 500 ? "..." : ""),
    output_excerpt: gptOutput.substring(0, 500) + (gptOutput.length > 500 ? "..." : ""),
    prompt_type: "contract_analysis",
    created_at: new Date().toISOString(),
  });

  console.log('[analyzeContract] Analysis complete, returning result');
  return analysisResult;
  
  } catch (error) {
    console.error('[analyzeContract] Error during analysis:', error);
    console.error('[analyzeContract] Error type:', typeof error);
    console.error('[analyzeContract] Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    throw error;
  }
}

async function extractTextFromFile(fileUrl: string, fileType: string): Promise<string> {
  console.log('[extractTextFromFile] Extracting from:', fileUrl, 'Type:', fileType);
  
  try {
    // Fetch the file from the URL
    const response = await fetch(fileUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch file: ${response.status} ${response.statusText}`);
    }
    
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Check file type and extract accordingly
    if (fileType === 'application/pdf' || fileUrl.toLowerCase().endsWith('.pdf')) {
      console.log('[extractTextFromFile] Processing PDF, size:', buffer.length);
      const pdfData = await pdfParse(buffer);
      return pdfData.text;
    } else if (fileType?.includes('text') || fileUrl.toLowerCase().endsWith('.txt')) {
      // Plain text file
      return buffer.toString('utf-8');
    } else {
      throw new Error(`Unsupported file type: ${fileType}`);
    }
  } catch (error) {
    console.error('[extractTextFromFile] Error:', error);
    throw error;
  }
}

function getSimulatedContent(fileType: string, filename: string): string {
  switch (fileType) {
    case 'offer':
      return `EMPLOYMENT OFFER LETTER

Dear Candidate,

We are pleased to offer you the position of Senior Software Engineer at TechCorp Inc.

COMPENSATION:
- Base Salary: $150,000 annually
- Equity: 0.1% of company stock, vesting over 4 years with 1-year cliff
- Bonus: Up to 10% of base salary based on performance

TERMS:
- Non-compete period: 12 months after termination
- Confidentiality agreement: Indefinite
- Severance: 2 weeks pay if terminated without cause
- Vacation: 15 days annually

This offer is contingent upon successful completion of background check.

Sincerely,
HR Department`;

    case 'jd':
      return `JOB DESCRIPTION - Senior Software Engineer

Responsibilities:
- Develop and maintain web applications
- Collaborate with cross-functional teams
- Mentor junior developers

Requirements:
- 5+ years of software development experience
- Experience with React, Node.js, and databases
- Strong communication skills

Benefits:
- Competitive salary and equity
- Health insurance and 401k
- Flexible work arrangements`;

    default:
      return `[Document content for ${filename} - text extraction not yet implemented]`;
  }
}

function getRoleTemplate(roleTitle: string, level: string) {
  return knowledgeBase.find(
    (entry) =>
      entry.role_title.toLowerCase() === roleTitle.toLowerCase() &&
      entry.level.toLowerCase() === level.toLowerCase()
  );
} 