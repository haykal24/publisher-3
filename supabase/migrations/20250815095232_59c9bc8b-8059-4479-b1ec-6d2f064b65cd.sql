-- Create books table
CREATE TABLE public.books (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  author TEXT,
  pic TEXT NOT NULL,
  publisher TEXT NOT NULL CHECK (publisher IN ('Renebook', 'Turos Pustaka', 'Reneluv', 'Renekids', 'Milestone')),
  progress INTEGER NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  completed_tasks INTEGER NOT NULL DEFAULT 0,
  total_tasks INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'Not Started' CHECK (status IN ('Not Started', 'In Progress', 'Done')),
  deadline DATE NOT NULL,
  days_left INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create tasks table
CREATE TABLE public.tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  book_id UUID REFERENCES public.books(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  pic TEXT NOT NULL,
  deadline DATE NOT NULL,
  days_left INTEGER,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'Not Started' CHECK (status IN ('Not Started', 'In Progress', 'Done')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create manuscripts table
CREATE TABLE public.manuscripts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  date_received DATE NOT NULL,
  genre TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Baru Masuk' CHECK (status IN ('Baru Masuk', 'Review', 'Diterima', 'Ditolak', 'Terbit')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create team_members table
CREATE TABLE public.team_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL CHECK (role IN ('Manajer', 'Produksi', 'Renebook', 'Turos Pustaka', 'Reneluv', 'Renekids', 'Milestone')),
  avatar TEXT NOT NULL,
  password TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create targets table
CREATE TABLE public.targets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  year INTEGER NOT NULL UNIQUE,
  annual_target INTEGER NOT NULL,
  monthly_targets JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create calendar_events table
CREATE TABLE public.calendar_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  date DATE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('deadline', 'milestone')),
  status TEXT NOT NULL CHECK (status IN ('in-progress', 'completed', 'near-deadline')),
  book_id UUID REFERENCES public.books(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.manuscripts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.targets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calendar_events ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (allowing access for all users for now - you may want to add authentication later)
CREATE POLICY "Enable read access for all users" ON public.books FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON public.books FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON public.books FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON public.books FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON public.tasks FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON public.tasks FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON public.tasks FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON public.tasks FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON public.manuscripts FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON public.manuscripts FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON public.manuscripts FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON public.manuscripts FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON public.team_members FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON public.team_members FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON public.team_members FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON public.team_members FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON public.targets FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON public.targets FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON public.targets FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON public.targets FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON public.calendar_events FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON public.calendar_events FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON public.calendar_events FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON public.calendar_events FOR DELETE USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_books_updated_at
  BEFORE UPDATE ON public.books
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at
  BEFORE UPDATE ON public.tasks
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_manuscripts_updated_at
  BEFORE UPDATE ON public.manuscripts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_team_members_updated_at
  BEFORE UPDATE ON public.team_members
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_targets_updated_at
  BEFORE UPDATE ON public.targets
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_calendar_events_updated_at
  BEFORE UPDATE ON public.calendar_events
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to calculate days left
CREATE OR REPLACE FUNCTION public.calculate_days_left()
RETURNS TRIGGER AS $$
BEGIN
  NEW.days_left = (NEW.deadline - CURRENT_DATE);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to auto-calculate days_left
CREATE TRIGGER calculate_books_days_left
  BEFORE INSERT OR UPDATE ON public.books
  FOR EACH ROW
  EXECUTE FUNCTION public.calculate_days_left();

CREATE TRIGGER calculate_tasks_days_left
  BEFORE INSERT OR UPDATE ON public.tasks
  FOR EACH ROW
  EXECUTE FUNCTION public.calculate_days_left();