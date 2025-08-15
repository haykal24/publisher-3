-- Create settings table for application configuration
CREATE TABLE public.settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key TEXT NOT NULL UNIQUE,
  setting_value JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Create policies for settings access
CREATE POLICY "Enable read access for all users" 
ON public.settings 
FOR SELECT 
USING (true);

CREATE POLICY "Enable insert access for all users" 
ON public.settings 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Enable update access for all users" 
ON public.settings 
FOR UPDATE 
USING (true);

CREATE POLICY "Enable delete access for all users" 
ON public.settings 
FOR DELETE 
USING (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_settings_updated_at
BEFORE UPDATE ON public.settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default settings
INSERT INTO public.settings (setting_key, setting_value) VALUES
('publishers', '["Renebook", "Turos Pustaka", "Reneluv", "Renekids", "Milestone"]'),
('publishing_targets', '{
  "2024": {"annual": 120, "monthly": {"Jan": 10, "Feb": 10, "Mar": 10, "Apr": 10, "Mei": 10, "Jun": 10, "Jul": 10, "Agu": 10, "Sep": 10, "Okt": 10, "Nov": 10, "Des": 10}},
  "2025": {"annual": 150, "monthly": {"Jan": 12, "Feb": 12, "Mar": 12, "Apr": 12, "Mei": 13, "Jun": 13, "Jul": 13, "Agu": 13, "Sep": 13, "Okt": 13, "Nov": 13, "Des": 13}}
}'),
('acquisition_targets', '{
  "2024": {"annual": 200, "monthly": {"Jan": 17, "Feb": 17, "Mar": 17, "Apr": 17, "Mei": 17, "Jun": 17, "Jul": 17, "Agu": 17, "Sep": 17, "Okt": 17, "Nov": 17, "Des": 16}},
  "2025": {"annual": 250, "monthly": {"Jan": 21, "Feb": 21, "Mar": 21, "Apr": 21, "Mei": 21, "Jun": 21, "Jul": 21, "Agu": 21, "Sep": 21, "Okt": 21, "Nov": 21, "Des": 20}}
}'),
('notification_settings', '{"email": true, "push": false, "deadline_alerts": true, "task_reminders": true}'),
('appearance_settings', '{"theme": "light", "language": "id"}');