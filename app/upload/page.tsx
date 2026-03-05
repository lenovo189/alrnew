"use client";

import { useState } from "react";
import { UploadButton, UploadDropzone } from "@/lib/uploadthing";
import { supabase } from "@/lib/supabase";
import { Plus, Trash2, Video, Image as ImageIcon, Loader2, Youtube, Link as LinkIcon } from "lucide-react";
import { isYouTubeUrl } from "@/lib/videoUtils";

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
                .insert([{ title, description, thumbnail_url: thumbnailUrl }])
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
        <div className="min-h-screen bg-neutral-950 text-white p-8">
            <div className="max-w-4xl mx-auto space-y-12">
                <header className="space-y-4">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                        Upload New Course
                    </h1>
                    <p className="text-neutral-400">Create a premium learning experience by adding a course with multiple video parts.</p>
                </header>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Internal Course Details */}
                    <section className="bg-neutral-900/50 border border-neutral-800 p-8 rounded-2xl space-y-6 backdrop-blur-sm">
                        <h2 className="text-xl font-semibold flex items-center gap-2">
                            <span className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center text-sm font-bold">1</span>
                            Course Basics
                        </h2>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-neutral-400">Course Title</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full bg-black border border-neutral-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                    placeholder="Enter a catchy title..."
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-neutral-400">Description</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows={4}
                                    className="w-full bg-black border border-neutral-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                    placeholder="What is this course about?"
                                />
                            </div>
                        </div>
                    </section>

                    {/* Thumbnail Section */}
                    <section className="bg-neutral-900/50 border border-neutral-800 p-8 rounded-2xl space-y-6 backdrop-blur-sm">
                        <h2 className="text-xl font-semibold flex items-center gap-2">
                            <span className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center text-sm font-bold">2</span>
                            Visuals
                        </h2>

                        <div className="space-y-4">
                            <label className="text-sm font-medium text-neutral-400">Course Thumbnail</label>
                            {thumbnailUrl ? (
                                <div className="relative group rounded-xl overflow-hidden border border-neutral-800 aspect-video max-w-md">
                                    <img src={thumbnailUrl} alt="Thumbnail preview" className="object-cover w-full h-full" />
                                    <button
                                        onClick={() => setThumbnailUrl("")}
                                        className="absolute top-2 right-2 p-2 bg-red-600 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
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
                                    className="border-dashed border-2 border-neutral-800 bg-neutral-900/30 ut-label:text-blue-400 ut-button:bg-blue-600 ut-button:ut-readying:bg-blue-500/50"
                                />
                            )}
                        </div>
                    </section>

                    {/* Lessons Section */}
                    <section className="bg-neutral-900/50 border border-neutral-800 p-8 rounded-2xl space-y-6 backdrop-blur-sm">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-semibold flex items-center gap-2">
                                <span className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-sm font-bold">3</span>
                                Course Parts (Videos)
                            </h2>
                            <button
                                type="button"
                                onClick={addLesson}
                                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors text-sm font-medium"
                            >
                                <Plus className="w-4 h-4" /> Add Part
                            </button>
                        </div>

                        <div className="space-y-6">
                            {lessons.map((lesson, index) => (
                                <div key={index} className="p-6 bg-black border border-neutral-800 rounded-xl space-y-4 relative">
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Part {index + 1}</span>
                                        {lessons.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeLesson(index)}
                                                className="text-neutral-500 hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-medium text-neutral-400">Part Title</label>
                                            <input
                                                type="text"
                                                value={lesson.title}
                                                onChange={(e) => updateLesson(index, "title", e.target.value)}
                                                className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all text-sm"
                                                placeholder="e.g. Introduction to Next.js"
                                            />
                                        </div>

                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <label className="text-xs font-medium text-neutral-400">Video Content</label>
                                                <div className="flex bg-neutral-900 p-1 rounded-lg border border-neutral-800">
                                                    <button
                                                        type="button"
                                                        onClick={() => updateLesson(index, "videoUrl", "")}
                                                        className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all flex items-center gap-1 ${!isYouTubeUrl(lesson.videoUrl) ? 'bg-blue-600 text-white' : 'text-neutral-400 hover:text-white'}`}
                                                    >
                                                        <Video className="w-3 h-3" /> Upload
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => updateLesson(index, "videoUrl", "youtube:")}
                                                        className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all flex items-center gap-1 ${isYouTubeUrl(lesson.videoUrl) || lesson.videoUrl.startsWith('youtube:') ? 'bg-red-600 text-white' : 'text-neutral-400 hover:text-white'}`}
                                                    >
                                                        <Youtube className="w-3 h-3" /> YouTube
                                                    </button>
                                                </div>
                                            </div>

                                            {lesson.videoUrl && !lesson.videoUrl.startsWith('youtube:') ? (
                                                <div className="flex items-center gap-3 p-3 bg-neutral-900 rounded-xl border border-emerald-500/30">
                                                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                                                        <Video className="w-4 h-4 text-emerald-400" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-xs font-medium text-neutral-200 truncate">Video Uploaded</p>
                                                        <p className="text-[10px] text-neutral-500 truncate">{lesson.videoUrl}</p>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => updateLesson(index, "videoUrl", "")}
                                                        className="p-2 text-neutral-500 hover:text-red-500 transition-colors"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ) : (isYouTubeUrl(lesson.videoUrl) || lesson.videoUrl.startsWith('youtube:')) ? (
                                                <div className="space-y-2">
                                                    <div className="relative">
                                                        <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                                                        <input
                                                            type="text"
                                                            value={lesson.videoUrl.startsWith('youtube:') ? "" : lesson.videoUrl}
                                                            onChange={(e) => updateLesson(index, "videoUrl", e.target.value)}
                                                            className="w-full bg-neutral-900 border border-neutral-800 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-1 focus:ring-red-500 transition-all text-sm"
                                                            placeholder="Paste YouTube video link..."
                                                        />
                                                    </div>
                                                    {isYouTubeUrl(lesson.videoUrl) && (
                                                        <p className="text-[10px] text-emerald-400 flex items-center gap-1">
                                                            <div className="w-1 h-1 rounded-full bg-emerald-400" /> Valid YouTube link detected
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
                                                    className="ut-button:bg-neutral-800 ut-button:text-sm ut-button:h-12 ut-button:w-full ut-button:rounded-xl hover:ut-button:bg-neutral-700"
                                                />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Submit */}
                    <div className="flex flex-col items-center gap-4 pt-4">
                        <button
                            disabled={loading}
                            className="w-full max-w-xs py-4 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 rounded-xl font-bold text-lg transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Publish Course"}
                        </button>
                        {message && (
                            <p className={`text-sm ${message.includes("Error") ? "text-red-400" : "text-emerald-400"}`}>
                                {message}
                            </p>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}
