-- Create courses table
CREATE TABLE IF NOT EXISTS courses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    thumbnail_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create lessons table (course parts)
CREATE TABLE IF NOT EXISTS lessons (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    video_url TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read courses
CREATE POLICY "Allow public read" ON courses FOR SELECT USING (true);

-- Allow anyone to insert courses (for testing - you should limit this to authenticated users in production)
CREATE POLICY "Allow public insert" ON courses FOR INSERT WITH CHECK (true);

-- Allow anyone to read lessons
CREATE POLICY "Allow public read" ON lessons FOR SELECT USING (true);

-- Allow anyone to insert lessons
CREATE POLICY "Allow public insert" ON lessons FOR INSERT WITH CHECK (true);
