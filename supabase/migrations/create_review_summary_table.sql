-- Create review_summary table for storing personalized contract analysis summaries
CREATE TABLE IF NOT EXISTS review_summary (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  strengths TEXT[] NOT NULL DEFAULT '{}',
  opportunities TEXT[] NOT NULL DEFAULT '{}',
  alignment_rating TEXT NOT NULL CHECK (alignment_rating IN ('aligned', 'partially_aligned', 'misaligned', 'unknown')),
  alignment_explanation TEXT NOT NULL DEFAULT '',
  confidence_score NUMERIC(3,2) NOT NULL DEFAULT 0.5 CHECK (confidence_score >= 0.0 AND confidence_score <= 1.0),
  recommendation TEXT NOT NULL DEFAULT '',
  negotiation_priorities TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create index on user_id for faster queries
CREATE INDEX IF NOT EXISTS idx_review_summary_user_id ON review_summary(user_id);

-- Create index on created_at for ordering
CREATE INDEX IF NOT EXISTS idx_review_summary_created_at ON review_summary(created_at DESC);

-- Enable RLS
ALTER TABLE review_summary ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own review summaries" ON review_summary
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own review summaries" ON review_summary
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own review summaries" ON review_summary
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own review summaries" ON review_summary
  FOR DELETE USING (auth.uid() = user_id);

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_review_summary_updated_at 
  BEFORE UPDATE ON review_summary 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Update existing review_results table to include contract_excerpt if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'review_results' 
                 AND column_name = 'contract_excerpt') THEN
    ALTER TABLE review_results ADD COLUMN contract_excerpt TEXT;
  END IF;
END $$; 