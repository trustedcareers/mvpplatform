interface ClauseResult {
  clause_type: string;
  clause_status: 'standard' | 'non-standard' | 'red_flag' | 'missing';
  rationale: string;
  recommendation: string;
  source_document: string;
  confidence_score: number;
}

export function parseReviewResults(gptOutput: string) {
  try {
    console.log('[parseReviewResults] Parsing GPT output, length:', gptOutput.length);
    
    // Parse the JSON response
    const parsed = JSON.parse(gptOutput);
    
    // Handle new format with clauses and summary
    if (parsed.clauses && Array.isArray(parsed.clauses)) {
      console.log('[parseReviewResults] New format detected with clauses and summary');
      return {
        clauses: parsed.clauses,
        summary: parsed.summary || null
      };
    }
    
    // Handle legacy format (array of clauses only)
    if (Array.isArray(parsed)) {
      console.log('[parseReviewResults] Legacy format detected (array only)');
      return {
        clauses: parsed,
        summary: null
      };
    }
    
    // Fallback
    console.warn('[parseReviewResults] Unexpected format, treating as clauses array');
    return {
      clauses: Array.isArray(parsed) ? parsed : [parsed],
      summary: null
    };
    
  } catch (parseError) {
    console.error('[parseReviewResults] JSON parse error:', parseError);
    console.log('[parseReviewResults] Raw output:', gptOutput);
    
    // Return empty result on parse error
    return {
      clauses: [],
      summary: null
    };
  }
} 