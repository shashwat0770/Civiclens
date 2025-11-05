-- Add address fields to complaints table
ALTER TABLE complaints 
  ADD COLUMN address TEXT,
  ADD COLUMN city TEXT,
  ADD COLUMN state TEXT,
  ADD COLUMN pincode TEXT;

-- Make location coordinates nullable since we're using address instead
ALTER TABLE complaints 
  ALTER COLUMN location_lat DROP NOT NULL,
  ALTER COLUMN location_lng DROP NOT NULL;