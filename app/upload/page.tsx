"use client";

import { useState } from "react";
import { UploadButton, UploadDropzone } from "@/lib/uploadthing";
import { supabase } from "@/lib/supabase";
import { Plus, Trash2, Video, Image as ImageIcon, Loader2, Youtube, Link as LinkIcon } from "lucide-react";
import { isYouTubeUrl } from "@/lib/videoUtils";
import { Logo } from "@/components/Logo";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

interface Lesson {
    title: string;
    videoUrl: string;
}

export default function UploadPage() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [thumbnailUrl, setThumbnailUrl] = useState("");
    const [lessons, setLessons] = useState<Lesson[]>([{ title: "", videoUrl: "" }]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const { user, loading: authLoading, setModalOpen } = useAuth();

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-background p-8 text-center space-y-8">
                <Logo className="mb-8" />
                <div className="space-y-4 max-w-md">
                    <h1 className="text-3xl font-black tracking-tight">Kirish ruxsat etilmagan</h1>
                    <p className="text-text-muted font-medium">Kurs yaratish uchun tizimga kirishingiz kerak. Iltimos, hisobingizga kiring yoki ro'yxatdan o'ting.</p>
                </div>
                <button
                    onClick={() => setModalOpen(true)}
                    className="h-14 px-10 rounded-2xl bg-primary text-white font-black text-lg shadow-xl shadow-primary/20 hover:scale-[1.05] transition-all active:scale-[0.95]"
                >
                    Kirish / Ro'yxatdan o'tish
                </button>
                <Link href="/dashboard" className="text-sm font-bold text-text-muted hover:text-primary transition-colors underline">
                    Bosh sahifaga qaytish
                </Link>
            </div>
        );
    }

    const addLesson = () => {
        setLessons([...lessons, { title: "", videoUrl: "" }]);
    };

    const removeLesson = (index: number) => {
        setLessons(lessons.filter((_, i) => i !== index));
    };

    const updateLesson = (index: number, field: keyof Lesson, value: string) => {
        setLessons(prev => prev.map((lesson, i) =>
            i === index ? { ...lesson, [field]: value } : lesson
        ));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        console.log("Submitting form...", { title, thumbnailUrl, lessons });

        if (!title || !thumbnailUrl || lessons.some(l => !l.title || !l.videoUrl)) {
            console.warn("Validation failed:", {
                missingTitle: !title,
                missingThumbnail: !thumbnailUrl,
                invalidLessons: lessons.map((l, i) => ({
                    index: i,
                    missingTitle: !l.title,
                    missingVideo: !l.videoUrl
                }))
            });
            setMessage("Please fill all fields and upload all files.");
            setLoading(false);
            return;
        }

        try {
            // 1. Insert Course
            const { data: course, error: courseError } = await supabase
                .from("courses")
                .insert([{ title, description, thumbnail_url: thumbnailUrl, user_id: user.id }])
                .select()
                .single();

            if (courseError) throw courseError;

            // 2. Insert Lessons
            const lessonsToInsert = lessons.map((lesson, index) => ({
                course_id: course.id,
                title: lesson.title,
                video_url: lesson.videoUrl,
                order: index + 1,
            }));

            const { error: lessonsError } = await supabase
                .from("lessons")
                .insert(lessonsToInsert);

            if (lessonsError) throw lessonsError;

            setMessage("Course uploaded successfully!");
            setTitle("");
            setDescription("");
            setThumbnailUrl("");
            setLessons([{ title: "", videoUrl: "" }]);
        } catch (error: any) {
            console.error(error);
            setMessage(`Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground font-inter antialiased">
            <div className="max-w-4xl mx-auto px-8 py-12 space-y-12">
                <header className="space-y-6 text-center">
                    <Logo className="justify-center mb-8" />
                    <h1 className="text-4xl font-black tracking-tight text-foreground">
                        Yangi Kurs Yaratish
                    </h1>
                    <p className="text-text-muted font-medium max-w-2xl mx-auto">Kurs ma'lumotlarini kiriting va video darslarni yuklang. Bizning platformamizda eng yaxshi ta'lim tajribasini yarating.</p>
                </header>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Course Basics */}
                    <section className="bg-surface border border-border/50 p-8 rounded-3xl space-y-8 shadow-sm">
                        <h2 className="text-xl font-black flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-sm font-black">1</div>
                            Asosiy Ma'lumotlar
                        </h2>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-text-muted px-1">Kurs nomi</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full bg-background border border-border rounded-xl px-4 py-3.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-text-muted/40"
                                    placeholder="Masalan: Next.js yordamida zamonaviy veb-ilovalar..."
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-text-muted px-1">Tavsif</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows={4}
                                    className="w-full bg-background border border-border rounded-xl px-4 py-3.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-text-muted/40 resize-none"
                                    placeholder="Kurs haqida qisqacha ma'lumot bering..."
                                />
                            </div>
                        </div>
                    </section>

                    {/* Thumbnail Section */}
                    <section className="bg-surface border border-border/50 p-8 rounded-3xl space-y-8 shadow-sm">
                        <h2 className="text-xl font-black flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center text-sm font-black">2</div>
                            Vizual Ko'rinish
                        </h2>

                        <div className="space-y-4">
                            <label className="text-xs font-black uppercase tracking-widest text-text-muted px-1">Kurs Muqovasi (Thumbnail)</label>
                            {thumbnailUrl ? (
                                <div className="relative group rounded-2xl overflow-hidden border border-border aspect-video max-w-md shadow-sm">
                                    <img src={thumbnailUrl} alt="Thumbnail preview" className="object-cover w-full h-full" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <button
                                            type="button"
                                            onClick={() => setThumbnailUrl("")}
                                            className="p-3 bg-red-600 text-white rounded-xl shadow-lg hover:scale-105 transition-transform"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <UploadDropzone
                                    endpoint="thumbnailUploader"
                                    onClientUploadComplete={(res) => {
                                        setThumbnailUrl(res[0].url);
                                    }}
                                    onUploadError={(error: Error) => {
                                        alert(`ERROR! ${error.message}`);
                                    }}
                                    className="border-dashed border-2 border-border bg-background ut-label:text-primary ut-button:bg-primary ut-button:rounded-xl ut-button:font-bold ut-button:text-sm hover:bg-neutral-50 transition-colors"
                                />
                            )}
                        </div>
                    </section>

                    {/* Lessons Section */}
                    <section className="bg-surface border border-border/50 p-8 rounded-3xl space-y-8 shadow-sm">
                        <div className="flex justify-between items-center px-1">
                            <h2 className="text-xl font-black flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-green-500/10 text-green-600 flex items-center justify-center text-sm font-black">3</div>
                                Video Darslar
                            </h2>
                            <button
                                type="button"
                                onClick={addLesson}
                                className="flex items-center gap-2 px-4 py-2 bg-primary text-white hover:bg-blue-700 rounded-xl transition-all shadow-sm font-bold text-xs"
                            >
                                <Plus className="w-4 h-4" /> Dars Qo'shish
                            </button>
                        </div>

                        <div className="space-y-6">
                            {lessons.map((lesson, index) => (
                                <div key={index} className="p-1 rounded-2xl border border-border/30 bg-background/50">
                                    <div className="p-6 space-y-6">
                                        <div className="flex justify-between items-center border-b border-border/20 pb-4">
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] font-black text-white bg-text-muted/40 px-2 py-0.5 rounded-md uppercase tracking-widest">QISM {index + 1}</span>
                                            </div>
                                            {lessons.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeLesson(index)}
                                                    className="p-2 text-text-muted/40 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-text-muted px-1">Dars Sarlavhasi</label>
                                                <input
                                                    type="text"
                                                    value={lesson.title}
                                                    onChange={(e) => updateLesson(index, "title", e.target.value)}
                                                    className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                                    placeholder="Masalan: Kirish qismi..."
                                                />
                                            </div>

                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between px-1">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-text-muted">Video Kontent</label>
                                                    <div className="flex bg-surface p-1 rounded-xl border border-border shadow-sm">
                                                        <button
                                                            type="button"
                                                            onClick={() => updateLesson(index, "videoUrl", "")}
                                                            className={`px-3 py-1.5 text-[10px] font-black rounded-lg transition-all flex items-center gap-1.5 uppercase tracking-tight ${!isYouTubeUrl(lesson.videoUrl) ? 'bg-primary text-white shadow-sm' : 'text-text-muted hover:text-foreground'}`}
                                                        >
                                                            <Video className="w-3.5 h-3.5" /> Yuklash
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => updateLesson(index, "videoUrl", "youtube:")}
                                                            className={`px-3 py-1.5 text-[10px] font-black rounded-lg transition-all flex items-center gap-1.5 uppercase tracking-tight ${isYouTubeUrl(lesson.videoUrl) || lesson.videoUrl.startsWith('youtube:') ? 'bg-red-600 text-white shadow-sm' : 'text-text-muted hover:text-foreground'}`}
                                                        >
                                                            <Youtube className="w-3.5 h-3.5" /> YouTube
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="pt-1">
                                                    {lesson.videoUrl && !lesson.videoUrl.startsWith('youtube:') ? (
                                                        <div className="flex items-center gap-4 p-4 bg-primary/[0.03] rounded-xl border border-primary/20 shadow-sm transition-all group">
                                                            <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center shrink-0">
                                                                <Video className="w-5 h-5" />
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-xs font-black text-foreground truncate uppercase tracking-tighter">Video Yuklandi</p>
                                                                <p className="text-[10px] text-text-muted truncate font-medium">{lesson.videoUrl}</p>
                                                            </div>
                                                            <button
                                                                type="button"
                                                                onClick={() => updateLesson(index, "videoUrl", "")}
                                                                className="p-2 text-text-muted/30 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    ) : (isYouTubeUrl(lesson.videoUrl) || lesson.videoUrl.startsWith('youtube:')) ? (
                                                        <div className="space-y-3">
                                                            <div className="relative group">
                                                                <LinkIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted/40 group-focus-within:text-red-500 transition-colors" />
                                                                <input
                                                                    type="text"
                                                                    value={lesson.videoUrl.startsWith('youtube:') ? "" : lesson.videoUrl}
                                                                    onChange={(e) => updateLesson(index, "videoUrl", e.target.value)}
                                                                    className="w-full bg-surface border border-border rounded-xl pl-11 pr-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-red-500/10 focus:border-red-500 transition-all placeholder:text-text-muted/30"
                                                                    placeholder="YouTube linkini kiriting..."
                                                                />
                                                            </div>
                                                            {isYouTubeUrl(lesson.videoUrl) && (
                                                                <p className="text-[10px] font-black text-green-600 flex items-center gap-2 px-1 uppercase tracking-widest">
                                                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" /> To'g'ri YouTube linki
                                                                </p>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <UploadButton
                                                            endpoint="courseVideoUploader"
                                                            onClientUploadComplete={(res) => {
                                                                updateLesson(index, "videoUrl", res[0].url);
                                                            }}
                                                            onUploadError={(error: Error) => {
                                                                alert(`ERROR! ${error.message}`);
                                                            }}
                                                            className="ut-button:bg-surface ut-button:text-foreground ut-button:border ut-button:border-border ut-button:text-xs ut-button:font-black ut-button:uppercase ut-button:tracking-widest ut-button:h-12 ut-button:w-full ut-button:rounded-xl hover:ut-button:bg-neutral-50 ut-allowed-content:hidden"
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Submit */}
                    <div className="flex flex-col items-center gap-4 pt-10">
                        <button
                            disabled={loading}
                            className="w-full max-w-sm h-16 bg-primary text-white hover:bg-blue-700 rounded-2xl font-black text-lg transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
                        >
                            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Kursni Chop Etish"}
                        </button>
                        {message && (
                            <div className={`px-6 py-3 rounded-xl border text-sm font-bold ${message.includes("Error") ? "bg-red-50 border-red-100 text-red-600" : "bg-green-50 border-green-100 text-green-600"}`}>
                                {message}
                            </div>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}
