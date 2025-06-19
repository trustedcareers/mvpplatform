export function buildContractAnalysisPrompt(
  documents: Array<{ filename: string; content: string }>,
  userContext?: any
) {
  // Extract contract text from documents
  const contractText = documents.map(doc => `Document: ${doc.filename}\n${doc.content}`).join('\n\n---\n\n');
  
  // Use user context if provided, otherwise use defaults
  const role_title = userContext?.role_title || 'Software Engineer';
  const level = userContext?.level || 'senior';
  const priorities = userContext?.priorities || ['compensation', 'growth'];
  const goals = userContext ? `Target base: $${userContext.target_comp_base || 150000}, Target total: $${userContext.target_comp_total || 200000}` : 'Competitive compensation';
  return `
You are an expert employment contract attorney with deep experience in technology and startup employment agreements. Perform a comprehensive analysis of this employment contract.

ANALYSIS FRAMEWORK:
Analyze ALL contract terms present in the document, focusing on these key areas:
1. Compensation (salary, bonuses, equity, benefits)
2. Job role and responsibilities 
3. Employment terms (at-will, duration, probation)
4. Equity and vesting schedules
5. Benefits and perquisites
6. Termination and severance
7. Non-compete and restrictive covenants
8. Confidentiality and IP assignment
9. Working arrangements and policies
10. Legal and governance terms

For each significant term found, classify it as:
- "excellent" - Significantly favors the employee
- "good" - Above market standard
- "standard" - Typical market terms
- "concerning" - Below market or potentially problematic
- "red_flag" - Strongly unfavorable or unusual
- "missing" - Important term not addressed

CANDIDATE CONTEXT (use as guidance, not constraints):
- Role: ${role_title} (${level} level)
- Priorities: ${priorities.join(', ')}
- Compensation targets: ${goals}

CONTRACT CONTENT:
${contractText}

INSTRUCTIONS:
1. Analyze the actual contract terms comprehensively
2. Compare against market standards for this role/level
3. Identify both positive and negative aspects
4. Consider the candidate's priorities but don't limit analysis to them
5. Provide specific, actionable recommendations
6. Include exact quotes or references from the contract when relevant

Return a JSON object with three main sections:

{
  "prebrief": "A 2-4 sentence executive summary of this contract, written in clear, long-form prose. This should provide a high-level overview of the offer, highlight the most important strengths and concerns, and set the context for a reviewer. Example: 'This offer provides a competitive base salary and strong equity package, but the severance terms are below industry standard. The non-compete clause is unusually restrictive and should be negotiated. Overall, the offer aligns with the candidate's goals, but several terms warrant further discussion.'",
  "clauses": [
    {
      "clause_type": "Base Salary",
      "clause_status": "excellent|good|standard|concerning|red_flag|missing",
      "rationale": "Detailed explanation of why this classification was given",
      "recommendation": "Specific actionable advice for the candidate",
      "source_document": "filename",
      "confidence_score": 0.95,
      "contract_excerpt": "Relevant quote from contract"
    }
  ],
  "summary": {
    "strengths": [
      "List of 3-5 key strengths of this offer",
      "Each should be specific and tied to contract terms"
    ],
    "opportunities": [
      "List of 3-5 areas for improvement or negotiation",
      "Each should be actionable and specific"
    ],
    "alignment_rating": "aligned|partially_aligned|misaligned",
    "alignment_explanation": "Detailed explanation of how well this offer aligns with the candidate's stated priorities and goals",
    "confidence_score": 0.85,
    "recommendation": "Clear, personalized recommendation: Should they take it? What should they negotiate? What are the key considerations?",
    "negotiation_priorities": [
      "Top 3-5 items to focus on in negotiations, ranked by importance"
    ]
  }
}

Focus on providing thorough, professional analysis that covers all important aspects of the employment agreement with a personalized summary that directly addresses the candidate's goals and priorities.

Return only valid JSON, no other text.
`.trim();
}
