import { supabase as defaultSupabase } from "@/lib/supabase";
import type { SupabaseClient } from '@supabase/supabase-js';

interface ClauseResult {
  clause_type: string;
  clause_status: 'standard' | 'non-standard' | 'red_flag' | 'missing';
  rationale: string;
  recommendation: string;
  source_document: string;
  confidence_score: number;
}

export async function saveReviewResults(userId: string, analysisResult: any, supabase: SupabaseClient) {
  console.log('[saveReviewResults] Saving analysis for user:', userId);
  console.log('[saveReviewResults] Analysis result structure:', {
    hasClauses: !!analysisResult.clauses,
    clauseCount: analysisResult.clauses?.length || 0,
    hasSummary: !!analysisResult.summary
  });

  try {
    // Clear existing results for this user
    await supabase
      .from('review_results')
      .delete()
      .eq('user_id', userId);

    await supabase
      .from('review_summary')
      .delete()
      .eq('user_id', userId);

    console.log('[saveReviewResults] Cleared existing results');

    // Save clauses to review_results table
    if (analysisResult.clauses && analysisResult.clauses.length > 0) {
      // Try inserting with contract_excerpt first, fallback if it fails
      let clauseInserts = analysisResult.clauses.map((clause: any) => ({
        user_id: userId,
        clause_type: clause.clause_type || 'Unknown',
        clause_status: clause.clause_status || 'unknown',
        rationale: clause.rationale || '',
        recommendation: clause.recommendation || '',
        source_document: clause.source_document || 'unknown',
        confidence_score: Number(clause.confidence_score) || 0.5,
        contract_excerpt: clause.contract_excerpt || null,
        created_at: new Date().toISOString()
      }));

      console.log('[saveReviewResults] About to insert clauses:', clauseInserts.length);
      console.log('[saveReviewResults] Sample clause insert:', JSON.stringify(clauseInserts[0], null, 2));
      
      let { error: clauseError } = await supabase
        .from('review_results')
        .insert(clauseInserts);
      
      console.log('[saveReviewResults] Insert result - error:', clauseError);

      // If error mentions contract_excerpt, try without it
      if (clauseError && (
        clauseError.message.includes('contract_excerpt') || 
        clauseError.message.includes('schema cache') ||
        clauseError.code === '42703' // PostgreSQL column doesn't exist error
      )) {
        console.warn('[saveReviewResults] contract_excerpt column issue detected, retrying without it');
        
        // Recreate inserts without contract_excerpt
        clauseInserts = analysisResult.clauses.map((clause: any) => ({
          user_id: userId,
          clause_type: clause.clause_type || 'Unknown',
          clause_status: clause.clause_status || 'unknown',
          rationale: clause.rationale || '',
          recommendation: clause.recommendation || '',
          source_document: clause.source_document || 'unknown',
          confidence_score: Number(clause.confidence_score) || 0.5,
          created_at: new Date().toISOString()
        }));

        const { error: retryError } = await supabase
          .from('review_results')
          .insert(clauseInserts);

        if (retryError) {
          console.error('[saveReviewResults] Error saving clauses (retry):', retryError);
          throw retryError;
        }

        console.log(`[saveReviewResults] Successfully saved ${clauseInserts.length} clauses (without contract_excerpt)`);
      } else if (clauseError) {
        console.error('[saveReviewResults] Error saving clauses:', clauseError);
        throw clauseError;
      } else {
        console.log(`[saveReviewResults] Successfully saved ${clauseInserts.length} clauses (with contract_excerpt)`);
      }
    }

    // Save summary to review_summary table
    if (analysisResult.summary) {
      const summaryInsert = {
        user_id: userId,
        strengths: analysisResult.summary.strengths || [],
        opportunities: analysisResult.summary.opportunities || [],
        alignment_rating: analysisResult.summary.alignment_rating || 'unknown',
        alignment_explanation: analysisResult.summary.alignment_explanation || '',
        confidence_score: Number(analysisResult.summary.confidence_score) || 0.5,
        recommendation: analysisResult.summary.recommendation || '',
        negotiation_priorities: analysisResult.summary.negotiation_priorities || [],
        created_at: new Date().toISOString()
      };

      console.log('[saveReviewResults] About to insert summary:', JSON.stringify(summaryInsert, null, 2));
      
      const { error: summaryError } = await supabase
        .from('review_summary')
        .insert([summaryInsert]);
      
      console.log('[saveReviewResults] Summary insert result - error:', summaryError);

      if (summaryError) {
        console.error('[saveReviewResults] Error saving summary:', summaryError);
        throw summaryError;
      }

      console.log('[saveReviewResults] Successfully saved summary');
    }

    // Save prebrief to review_prebrief table
    if (analysisResult.prebrief) {
      const prebriefInsert = {
        user_id: userId,
        summary: analysisResult.prebrief,
        generated_at: new Date().toISOString(),
      };
      // Upsert: if a prebrief exists for this user, update it; otherwise, insert
      const { error: prebriefError } = await supabase
        .from('review_prebrief')
        .upsert([prebriefInsert], { onConflict: 'user_id' });
      if (prebriefError) {
        console.error('[saveReviewResults] Error saving prebrief:', prebriefError);
        throw prebriefError;
      }
      console.log('[saveReviewResults] Successfully saved prebrief');
    }

    console.log('[saveReviewResults] All data saved successfully');

  } catch (error) {
    console.error('[saveReviewResults] Caught error:', error);
    try {
      console.error('[saveReviewResults] Error JSON:', JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
    } catch (jsonError) {
      console.error('[saveReviewResults] Could not serialize error to JSON:', jsonError);
    }
    console.error('[saveReviewResults] Error type:', typeof error);
    console.error('[saveReviewResults] Error constructor:', error?.constructor?.name);
    console.error('[saveReviewResults] Error message:', error instanceof Error ? error.message : 'No message');
    console.error('[saveReviewResults] Error stack:', error instanceof Error ? error.stack : 'No stack');
    
    // Create a proper error with context
    const contextualError = new Error(`Database save failed: ${error instanceof Error ? error.message : String(error)}`);
    contextualError.cause = error;
    throw contextualError;
  }
} 