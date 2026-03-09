"use client";

import { useEffect, useState } from "react";
import { Search, Heart, Flame, MessageCircle, Eye, Home, Star, Users, Bookmark, Plus, LayoutGrid, Zap, Settings2, Youtube, Send, Loader2 } from 'lucide-react';
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import Image from "next/image";
import { Logo } from "@/components/Logo";
import { useAuth } from "@/hooks/useAuth";

interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail_url: string;
  created_at: string;
  user_id: string;
  author?: {
    full_name: string;
    username: string;
    avatar_url: string;
  };
}

export default function Dashboard() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, profile, signOut, setModalOpen } = useAuth();

  useEffect(() => {
    async function fetchCourses() {
      try {
        const { data, error } = await supabase
          .from("courses")
          .select(`
            *,
            author:profiles (
              full_name,
              username,
              avatar_url
            )
          `)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setCourses(data as unknown as Course[] || []);
      } catch (err) {
        console.error("Error fetching courses:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchCourses();
  }, []);

  return (
    <>
      <div className="max-w-[1440px] mx-auto min-h-screen flex flex-col antialiased">
        <header className="h-20 flex items-center justify-between px-8 bg-background sticky top-0 border-b border-border/50 z-[100] ">
          <div className="flex items-center">
            <Logo className="h-10" />
          </div>
          <div className="flex-1 max-w-[600px] mx-8 relative flex items-center">
            <Search className="absolute left-4 text-text-muted" size={20} />
            <input
              type="text"
              placeholder="Qidirmoq"
              className="w-full h-12 bg-surface border border-border rounded-xl pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
          <div className="flex gap-4 items-center">
            <Link href="/upload">
              <button className="h-12 px-6 rounded-xl font-semibold text-sm cursor-pointer flex items-center gap-2 bg-surface border border-border text-foreground hover:bg-neutral-100 transition-colors">
                Yaratish <Plus size={18} />
              </button>
            </Link>

            {user ? (
              <div className="flex items-center gap-4">
                <Link href="/settings" className="flex items-center gap-4 group">
                  <div className="flex flex-col items-end">
                    <span className="text-xs font-bold text-foreground overflow-hidden text-ellipsis max-w-[150px] group-hover:text-primary transition-colors">
                      {profile?.full_name || profile?.username || user.email}
                    </span>
                    <span className="text-[10px] font-bold text-text-muted group-hover:text-primary transition-colors uppercase tracking-wider">
                      Sozlamalar
                    </span>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold overflow-hidden shadow-sm group-hover:border-primary/50 group-hover:shadow-md transition-all">
                    {profile?.avatar_url ? (
                      <Image src={profile.avatar_url} alt="Profile" width={40} height={40} className="w-full h-full object-cover" />
                    ) : (
                      (profile?.full_name?.[0] || user.email?.[0] || 'U').toUpperCase()
                    )}
                  </div>
                </Link>
                <button
                  onClick={() => signOut()}
                  className="text-[10px] font-bold text-text-muted hover:text-primary transition-colors uppercase tracking-wider border border-border/50 rounded-lg px-3 h-8 hover:border-primary/30 hover:bg-surface"
                >
                  Chiqish
                </button>
              </div>
            ) : (
              <button
                onClick={() => setModalOpen(true)}
                className="h-12 px-8 rounded-xl font-bold text-sm cursor-pointer flex items-center gap-2 bg-primary border-none text-white hover:bg-blue-700 transition-all shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98]"
              >
                Kirish
              </button>
            )}
          </div>
        </header>

        <div className="grid grid-cols-[260px_1fr_320px] gap-8 px-8 py-8">
          <aside className="sticky top-[112px] h-[calc(100vh-140px)] flex flex-col">
            <nav className="mb-auto">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-4 px-4 py-3 rounded-xl bg-surface text-foreground shadow-sm font-bold cursor-pointer transition-all">
                  <Home size={22} className="text-primary text-[#0672ec] color-[#0672ec]" />
                  <span>Bosh sahifa</span>
                </div>
                <div className="flex items-center gap-4 px-4 py-3 rounded-xl text-text-muted font-semibold cursor-pointer hover:bg-surface/50 hover:text-foreground transition-all">
                  <Star size={22} className="text-primary text-[#0672ec] color-[#0672ec]" />
                  <span>Reyting</span>
                </div>
                <div className="flex items-center gap-4 px-4 py-3 rounded-xl text-text-muted font-semibold cursor-pointer hover:bg-surface/50 hover:text-foreground transition-all">
                  <Users size={22} className="text-primary text-[#0672ec] color-[#0672ec]" />
                  <span>Do'stlaringiz</span>
                </div>
                <div className="flex items-center gap-4 px-4 py-3 rounded-xl text-text-muted font-semibold cursor-pointer hover:bg-surface/50 hover:text-foreground transition-all">
                  <Bookmark size={22} className="text-primary text-[#0672ec] color-[#0672ec]" />
                  <span>Saqlanganlar</span>
                </div>
              </div>
            </nav>
            <div className="pt-8 border-t border-border/50">
              <div className="flex flex-wrap gap-x-4 gap-y-2 mb-6">
                <a href="#" className="text-xs text-text-muted font-medium hover:text-primary transition-colors">Loyiha haqida</a>
                <a href="#" className="text-xs text-text-muted font-medium hover:text-primary transition-colors">Reklama</a>
                <a href="#" className="text-xs text-text-muted font-medium hover:text-primary transition-colors">Qoidalar</a>
                <a href="#" className="text-xs text-text-muted font-medium hover:text-primary transition-colors">Qo'llab-quvvatlash</a>
              </div>
              <div className="flex gap-4 text-text-muted mb-6">
                <Youtube size={20} className="cursor-pointer hover:text-red-500 transition-colors" />
                <Send size={20} className="cursor-pointer hover:text-blue-400 transition-colors" />
              </div>
              <p className="text-xs text-text-muted/60 leading-relaxed tabular-nums">© 2023-2026<br />Barcha huquqlar himoyalangan</p>
            </div>
          </aside>

          <main className="relative">
            <div className="grid grid-cols-2 gap-6">
              {loading ? (
                <div className="col-span-full flex flex-col items-center justify-center py-24 text-text-muted gap-4">
                  <Loader2 className="w-10 h-10 animate-spin text-primary" />
                  <p className="font-medium">Kurslar yuklanmoqda...</p>
                </div>
              ) : courses.length === 0 ? (
                <div className="col-span-full flex flex-col items-center justify-center py-24 text-text-muted gap-6 border-2 border-dashed border-border rounded-3xl bg-surface/30">
                  <Youtube className="w-16 h-16 opacity-10" />
                  <div className="text-center">
                    <p className="text-lg font-bold text-foreground mb-2">Hozircha kurslar yo'q</p>
                    <p className="text-sm">Birinchisini yaratishga tayyormisiz?</p>
                  </div>
                  <Link href="/upload">
                    <button className="h-12 px-8 rounded-xl font-bold text-sm cursor-pointer flex items-center gap-2 bg-primary text-white hover:bg-blue-700 transition-all">Kurs yaratish</button>
                  </Link>
                </div>
              ) : (
                courses
                  .filter(course => !course.id.startsWith("http"))
                  .map((course, idx) => (
                    <Link
                      href={`/course/${course.id}`}
                      key={course.id}
                      className="block outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-3xl"
                    >
                      <article className="bg-surface rounded-3xl overflow-hidden p-4 shadow-sm border border-border/50 hover:border-primary/50 hover:shadow-md transition-all h-full flex flex-col group">
                        <div className="w-full aspect-video rounded-2xl relative overflow-hidden mb-4 bg-background">
                          <Image
                            src={course.thumbnail_url}
                            alt={course.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            priority={idx < 4}
                          />
                          <div className="absolute top-3 left-3 z-10 bg-white shadow-sm px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider text-primary">Kurs</div>
                        </div>
                        <div className="px-1 flex-grow flex flex-col">
                          <h2 className="text-lg font-bold leading-tight mb-2 text-foreground line-clamp-2 group-hover:text-primary transition-colors">{course.title}</h2>
                          <p className="text-sm text-text-muted leading-relaxed mb-4 line-clamp-2">{course.description}</p>

                          <div className="flex items-center gap-2 mb-4 mt-auto">
                            <div className="w-6 h-6 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-[10px] font-bold text-primary overflow-hidden">
                              {course.author?.avatar_url ? (
                                <Image src={course.author.avatar_url} alt="Author" width={24} height={24} className="w-full h-full object-cover" />
                              ) : (
                                (course.author?.full_name?.[0] || "U").toUpperCase()
                              )}
                            </div>
                            <span className="text-xs font-bold text-foreground truncate">
                              {course.author?.full_name || course.author?.username || "Muallif"}
                            </span>
                          </div>

                          <div className="flex items-center pt-4 border-t border-border/30">
                            <span className="text-[11px] font-bold text-text-muted/60 uppercase tracking-tight">{new Date(course.created_at).toLocaleDateString()}</span>
                            <div className="flex items-center gap-1 text-text-muted/60 text-[11px] font-bold ml-auto">
                              <Eye size={12} className="opacity-50" /> <span>0</span>
                            </div>
                          </div>
                        </div>
                      </article>
                    </Link>
                  ))
              )}
            </div>


          </main>

          <aside className="flex flex-col gap-6">
            <div className="bg-surface rounded-3xl p-6 shadow-sm border border-border/50">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-black tracking-tight">Top Mualliflar</h3>
                <a href="#" className="text-[11px] font-bold text-primary uppercase tracking-wider hover:underline">Hammasi</a>
              </div>
              <div className="flex flex-col gap-4">
                {[
                  { name: "wave", sub: "@wave-studio · Studio", color: "#2563EB" },
                  { name: "Pink: kreativnoe atele", sub: "@pink_atelier · Studio", color: "#000" },
                  { name: "duo sapiens*", sub: "@duosapiens · Studio", color: "#FFD700" },
                  { name: "Yandeks Praktikum", sub: "@practicum · Maktab", color: "#000", verified: true },
                  { name: "Darya Tyutikova", sub: "@DAR.T · O'qtuvchi", color: "#B8860B" }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 group cursor-pointer">
                    <div className="w-10 h-10 rounded-xl flex-shrink-0 shadow-sm transition-transform group-hover:scale-105" style={{ backgroundColor: item.color }}></div>
                    <div className="flex-1 flex flex-col min-w-0">
                      <span className="text-sm font-bold truncate text-foreground group-hover:text-primary transition-colors">
                        {item.name} {item.verified && <span className="text-primary ml-1">✓</span>}
                      </span>
                      <span className="text-[11px] text-text-muted font-medium truncate">{item.sub}</span>
                    </div>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black ${i === 0 ? 'bg-[#FFD700] text-white' :
                      i === 1 ? 'bg-[#C0C0C0] text-white' :
                        i === 2 ? 'bg-[#CD7F32] text-white' :
                          'bg-background text-text-muted border border-border/50'
                      }`}>
                      {i + 1}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
