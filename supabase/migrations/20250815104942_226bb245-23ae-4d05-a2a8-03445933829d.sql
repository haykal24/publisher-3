-- Update targets table to have proper indexes and ensure data integrity
CREATE INDEX IF NOT EXISTS idx_targets_year ON targets(year);

-- Insert default targets for current year if not exists
INSERT INTO targets (year, annual_target, monthly_targets)
SELECT 
  EXTRACT(YEAR FROM CURRENT_DATE)::integer as year,
  0 as annual_target,
  jsonb_build_object(
    'Januari', 0, 'Februari', 0, 'Maret', 0, 'April', 0,
    'Mei', 0, 'Juni', 0, 'Juli', 0, 'Agustus', 0,
    'September', 0, 'Oktober', 0, 'November', 0, 'Desember', 0
  ) as monthly_targets
WHERE NOT EXISTS (
  SELECT 1 FROM targets WHERE year = EXTRACT(YEAR FROM CURRENT_DATE)::integer
);