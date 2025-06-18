-- Add contract_excerpt column to review_results table
ALTER TABLE review_results 
ADD COLUMN IF NOT EXISTS contract_excerpt TEXT;

-- Add comment to describe the column
COMMENT ON COLUMN review_results.contract_excerpt IS 'Excerpt from the contract that relates to this clause analysis'; 