"use client";

import { useEffect, useState, use } from "react";
import { supabase } from "@/lib/supabase";
import { ChevronLeft, Play, Clock, BookOpen, Loader2, ArrowLeft, LayoutGrid } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
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
        <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] font-sans antialiased">
            {/* Header / Navigation */}
            <nav className="border-b border-[#E6E8EC]/50 bg-white/80 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-8 h-20 flex items-center justify-between">
                    <Link href="/dashboard" className="flex items-center gap-3 text-neutral-500 hover:text-[var(--primary)] transition-all group">
                        <div className="w-10 h-10 rounded-xl bg-[#F0F4F9] flex items-center justify-center group-hover:scale-105 transition-transform">
                            <ChevronLeft className="w-5 h-5" />
                        </div>
                        <span className="font-semibold text-sm">Dashboardga qaytish</span>
                    </Link>
                    <div className="text-base font-bold text-neutral-800 truncate max-w-[400px]">
                        {course.title}
                    </div>
                    <div className="w-40 flex justify-end">
                        <div className="px-4 py-2 bg-[var(--primary)]/10 text-[var(--primary)] text-xs font-bold rounded-full">
                            Kurs Ma'lumotlari
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto p-8 grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Video Player Section */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="aspect-video bg-black rounded-[40px] overflow-hidden border border-[#E6E8EC] shadow-2xl shadow-blue-500/5 relative group">
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

                    <div className="space-y-6 px-4">
                        <h1 className="text-4xl font-extrabold tracking-tight text-neutral-900">
                            {activeLesson?.title || course.title}
                        </h1>
                        <div className="p-8 bg-white rounded-[32px] border border-[#E6E8EC] shadow-sm">
                            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                <BookOpen className="w-5 h-5 text-[var(--primary)]" />
                                Kurs Tavsifi
                            </h3>
                            <p className="text-[#6F767E] leading-relaxed text-base">
                                {course.description}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Playlist / Lesson List Section */}
                <div className="space-y-8">
                    <div className="bg-white border border-[#E6E8EC] rounded-[40px] overflow-hidden shadow-sm flex flex-col h-[750px]">
                        <div className="p-8 border-b border-[#F4F4F4] flex items-center justify-between bg-white relative z-10">
                            <h2 className="font-extrabold text-xl flex items-center gap-3">
                                <div className="p-2 bg-blue-500/10 rounded-lg">
                                    <LayoutGrid className="w-5 h-5 text-blue-600" />
                                </div>
                                Mundarija
                            </h2>
                            <span className="text-[10px] font-black px-3 py-1.5 bg-[#F0F4F9] rounded-full text-[#9A9FA5] uppercase tracking-widest">
                                {lessons.length} qism
                            </span>
                        </div>

                        <div className="divide-y divide-[#F4F4F4] overflow-y-auto flex-grow custom-scrollbar">
                            {lessons.map((lesson, idx) => (
                                <button
                                    key={lesson.id}
                                    onClick={() => setActiveLesson(lesson)}
                                    className={`w-full p-6 flex items-start gap-5 transition-all text-left relative group ${activeLesson?.id === lesson.id
                                        ? "bg-[var(--primary)]/[0.03] text-[var(--primary)]"
                                        : "hover:bg-[#F0F4F9]/40 text-[#6F767E]"
                                        }`}
                                >
                                    {activeLesson?.id === lesson.id && (
                                        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[var(--primary)] rounded-r-full" />
                                    )}
                                    <div className={`mt-1 flex-shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm transition-colors ${activeLesson?.id === lesson.id
                                        ? "bg-[var(--primary)] text-white shadow-lg shadow-blue-500/20"
                                        : "bg-[#F0F4F9] text-[#9A9FA5] group-hover:bg-[#E6E8EC]"
                                        }`}>
                                        {idx + 1}
                                    </div>
                                    <div className="space-y-1.5 flex-grow">
                                        <div className={`font-bold text-sm leading-snug line-clamp-2 ${activeLesson?.id === lesson.id ? 'text-neutral-900' : ''}`}>
                                            {lesson.title}
                                        </div>
                                        <div className="flex items-center gap-2 text-[11px] font-semibold opacity-60">
                                            <Clock className="w-3.5 h-3.5" />
                                            <span>Video dars</span>
                                        </div>
                                    </div>
                                    {activeLesson?.id === lesson.id && (
                                        <div className="flex-shrink-0 mt-3">
                                            <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                                                <Play className="w-2.5 h-2.5 fill-white text-white ml-0.5" />
                                            </div>
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Instructor Widget */}
                    <div className="bg-white border border-[#E6E8EC] p-8 rounded-[40px] shadow-sm space-y-6">
                        <h3 className="font-extrabold text-lg">Muallif</h3>
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-black text-xl text-white shadow-lg shadow-blue-500/20">
                                L
                            </div>
                            <div>
                                <div className="text-base font-extrabold text-neutral-900">Learnifiy School</div>
                                <div className="text-xs font-semibold text-neutral-400">Premium o'qituvchi</div>
                            </div>
                        </div>
                        <button className="w-full py-4 bg-[#F0F4F9] hover:bg-[#E6E8EC] text-neutral-600 rounded-2xl font-bold text-sm transition-all">
                            Profilni ko'rish
                        </button>
                    </div>
                </div>
            </main>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #E6E8EC;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #CED2D9;
                }
            `}</style>
        </div>
    );
}
