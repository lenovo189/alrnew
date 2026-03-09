"use client";

import { useEffect, useState, use } from "react";
import { supabase } from "@/lib/supabase";
import { ChevronLeft, Play, Clock, BookOpen, Loader2, ArrowLeft, LayoutGrid } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Logo } from "@/components/Logo";
import { isYouTubeUrl, getYouTubeEmbedUrl } from "@/lib/videoUtils";

interface Course {
    id: string;
    title: string;
    description: string;
    thumbnail_url: string;
    created_at: string;
}

interface Lesson {
    id: string;
    title: string;
    video_url: string;
    order: number;
}

export default function CoursePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [course, setCourse] = useState<Course | null>(null);
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchCourseData() {
            try {
                // Fetch course details
                const { data: courseData, error: courseError } = await supabase
                    .from("courses")
                    .select("*")
                    .eq("id", id)
                    .single();

                if (courseError) throw courseError;
                setCourse(courseData);

                // Fetch lessons
                const { data: lessonsData, error: lessonsError } = await supabase
                    .from("lessons")
                    .select("*")
                    .eq("course_id", id)
                    .order("order", { ascending: true });

                if (lessonsError) throw lessonsError;
                setLessons(lessonsData || []);
                if (lessonsData && lessonsData.length > 0) {
                    setActiveLesson(lessonsData[0]);
                }
            } catch (err) {
                console.error("Error fetching course data:", err);
            } finally {
                setLoading(false);
            }
        }

        if (id && !id.startsWith("http")) {
            fetchCourseData();
        } else {
            console.warn("Invalid or missing course ID:", id);
            setLoading(false);
        }
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center text-white">
                <Loader2 className="w-12 h-12 animate-spin text-blue-500 mb-4" />
                <p className="text-neutral-400">Kurs ma'lumotlari yuklanmoqda...</p>
            </div>
        );
    }

    if (!course) {
        return (
            <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center text-white">
                <p className="text-xl font-semibold mb-4">Kurs topilmadi</p>
                <Link href="/dashboard" className="text-blue-400 hover:underline flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" /> Dashboardga qaytish
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground font-inter antialiased flex flex-col">
            {/* Header / Navigation */}
            <nav className="border-b border-border/50 bg-background/80 backdrop-blur-md sticky top-0 z-50 h-20 shadow-sm">
                <div className="max-w-[1440px] mx-auto px-8 h-full flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        <Logo className="h-10" />
                        <Link href="/dashboard" className="flex items-center gap-3 text-text-muted hover:text-primary transition-all group">
                            <div className="w-8 h-8 rounded-lg bg-surface border border-border/50 flex items-center justify-center group-hover:border-primary/30 transition-all">
                                <ChevronLeft className="w-4 h-4" />
                            </div>
                            <span className="font-bold text-xs">Dashboardga qaytish</span>
                        </Link>
                    </div>
                    <div className="text-base font-black text-foreground truncate max-w-[400px]">
                        {course.title}
                    </div>
                    <div className="w-40 flex justify-end">
                        <div className="px-4 py-2 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-full">
                            Kurs Ma'lumotlari
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-[1440px] mx-auto px-8 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8 w-full">
                {/* Video Player Section */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="aspect-video bg-black rounded-3xl overflow-hidden border border-border shadow-md relative group">
                        {activeLesson ? (
                            isYouTubeUrl(activeLesson.video_url) ? (
                                <iframe
                                    key={activeLesson.video_url}
                                    src={getYouTubeEmbedUrl(activeLesson.video_url) || ""}
                                    className="w-full h-full border-0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            ) : (
                                <video
                                    key={activeLesson.video_url}
                                    src={activeLesson.video_url}
                                    controls
                                    className="w-full h-full"
                                    onLoadStart={() => console.log("Loading:", activeLesson.video_url)}
                                    onCanPlay={() => console.log("Can play!")}
                                    onError={(e) => {
                                        const v = e.target as HTMLVideoElement;
                                        console.error("Error code:", v.error?.code, v.error?.message);
                                    }}
                                />
                            )
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-neutral-800/10">
                                <Play className="w-24 h-24 fill-current" />
                            </div>
                        )}
                    </div>

                    <div className="space-y-6">
                        <h1 className="text-3xl font-black tracking-tight text-foreground leading-tight px-2">
                            {activeLesson?.title || course.title}
                        </h1>
                        <div className="p-8 bg-surface rounded-3xl border border-border/50 shadow-sm">
                            <h3 className="text-lg font-black mb-4 flex items-center gap-3">
                                <div className="p-2 bg-primary/10 rounded-lg">
                                    <BookOpen className="w-5 h-5 text-primary" />
                                </div>
                                Kurs Tavsifi
                            </h3>
                            <p className="text-text-muted leading-relaxed text-base font-medium">
                                {course.description}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Playlist / Lesson List Section */}
                <div className="space-y-8">
                    <div className="bg-surface border border-border/50 rounded-3xl overflow-hidden shadow-sm flex flex-col h-[750px] relative">
                        <div className="p-6 border-b border-border/30 flex items-center justify-between bg-surface sticky top-0 z-10">
                            <h2 className="font-black text-lg flex items-center gap-3">
                                <div className="p-2 bg-primary/10 rounded-lg">
                                    <LayoutGrid className="w-5 h-5 text-primary" />
                                </div>
                                Mundarija
                            </h2>
                            <span className="text-[10px] font-black px-3 py-1.5 bg-background border border-border/50 rounded-full text-text-muted uppercase tracking-widest tabular-nums">
                                {lessons.length} qism
                            </span>
                        </div>

                        <div className="divide-y divide-border/20 overflow-y-auto flex-grow custom-scrollbar">
                            {lessons.map((lesson, idx) => (
                                <button
                                    key={lesson.id}
                                    onClick={() => setActiveLesson(lesson)}
                                    className={`w-full p-6 flex items-start gap-5 text-left relative group transition-all ${activeLesson?.id === lesson.id
                                        ? "bg-primary/[0.03]"
                                        : "hover:bg-background/40"
                                        }`}
                                >
                                    {activeLesson?.id === lesson.id && (
                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-full" />
                                    )}
                                    <div className={`mt-1 flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs transition-all ${activeLesson?.id === lesson.id
                                        ? "bg-primary text-white shadow-sm"
                                        : "bg-background border border-border/50 text-text-muted group-hover:border-primary/30"
                                        }`}>
                                        {idx + 1}
                                    </div>
                                    <div className="space-y-1.5 flex-grow">
                                        <div className={`font-bold text-sm leading-snug line-clamp-2 transition-colors ${activeLesson?.id === lesson.id ? 'text-primary' : 'text-foreground group-hover:text-primary'}`}>
                                            {lesson.title}
                                        </div>
                                        <div className="flex items-center gap-2 text-[11px] font-bold text-text-muted opacity-60">
                                            <Clock className="w-3.5 h-3.5" />
                                            <span className="uppercase tracking-tight">Video dars</span>
                                        </div>
                                    </div>
                                    {activeLesson?.id === lesson.id && (
                                        <div className="flex-shrink-0 mt-3">
                                            <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                                                <Play className="w-2.5 h-2.5 fill-white text-white ml-0.5" />
                                            </div>
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Instructor Widget */}
                    <div className="bg-surface border border-border/50 p-8 rounded-3xl shadow-sm space-y-6">
                        <h3 className="font-black text-lg tracking-tight">Muallif</h3>
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-blue-700 flex items-center justify-center font-black text-2xl text-white shadow-md">
                                L
                            </div>
                            <div>
                                <div className="text-base font-black text-foreground">Learnifiy School</div>
                                <div className="text-[11px] font-bold text-text-muted uppercase tracking-wider">Premium o'qituvchi</div>
                            </div>
                        </div>
                        <button className="w-full py-4 bg-background border border-border/50 hover:border-primary/30 hover:bg-neutral-50 text-text-muted hover:text-primary rounded-xl font-bold text-sm transition-all shadow-sm">
                            Profilni ko'rish
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}
