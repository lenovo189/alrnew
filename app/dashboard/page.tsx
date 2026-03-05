"use client";

import { useEffect, useState } from "react";
import { Search, Heart, Flame, MessageCircle, Eye, Home, Star, Users, Bookmark, Plus, LayoutGrid, Zap, Settings2, Youtube, Send, Loader2 } from 'lucide-react';
import './styles.css';
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import Image from "next/image";

interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail_url: string;
  created_at: string;
  // author and reactions are placeholder for now as they aren't in the schema yet
}

export default function Dashboard() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCourses() {
      try {
        const { data, error } = await supabase
          .from("courses")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;
        console.log("Fetched courses:", data);
        setCourses(data || []);
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
      <div className="dashboard-container">
        <header className="navbar">
          <div className="navbar-logo">
            <div className="logo-svg">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="40" height="40" rx="12" fill="#2563EB" />
                <path d="M12 28C12 21.3726 17.3726 16 24 16H28V24C28 26.2091 26.2091 28 24 28H12Z" fill="white" />
                <path d="M16 12C16 14.2091 14.2091 16 12 16C9.79086 16 8 14.2091 8 12C8 9.79086 9.79086 8 12 8C14.2091 8 16 9.79086 16 12Z" fill="white" />
              </svg>
            </div>
          </div>
          <div className="navbar-search">
            <Search className="search-icon" size={20} />
            <input type="text" placeholder="Qidirmoq" />
          </div>
          <div className="navbar-actions">
            <Link href="/upload">
              <button className="btn-create">Yaratish <Plus size={18} /></button>
            </Link>
            <button className="btn-login">Kirish</button>
          </div>
        </header>

        <div className="layout-body">
          <aside className="sidebar-l">
            <nav className="side-nav">
              <div className="nav-group">
                <div className="nav-item active">
                  <Home size={22} className="nav-icon" />
                  <span>Bosh sahifa</span>
                </div>
                <div className="nav-item">
                  <Star size={22} className="nav-icon" />
                  <span>Reyting</span>
                </div>
                <div className="nav-item">
                  <Users size={22} className="nav-icon" />
                  <span>Do'stlaringiz</span>
                </div>
                <div className="nav-item">
                  <Bookmark size={22} className="nav-icon" />
                  <span>Saqlanganlar</span>
                </div>
              </div>
            </nav>
            <div className="sidebar-bottom">
              <div className="footer-links">
                <a href="#">Loyiha haqida</a>
                <a href="#">Reklama</a>
                <a href="#">Qoidalar</a>
                <a href="#">Qo'llab-quvvatlash</a>
              </div>
              <div className="social-icons">
                <Youtube size={20} />
                <Send size={20} />
              </div>
              <p className="copyright">© 2023-2026<br />Barcha huquqlar himoyalangan</p>
            </div>
          </aside>

          <main className="content-area">
            <div className="feed-grid">
              {loading ? (
                <div className="col-span-full flex flex-col items-center justify-center py-20 text-neutral-500 gap-4">
                  <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
                  <p>Kurslar yuklanmoqda...</p>
                </div>
              ) : courses.length === 0 ? (
                <div className="col-span-full flex flex-col items-center justify-center py-20 text-neutral-500 gap-4 border-2 border-dashed border-neutral-800 rounded-3xl">
                  <Youtube className="w-12 h-12 opacity-20" />
                  <p>Hozircha kurslar yo'q. Birinchisini yaratasizmi?</p>
                  <Link href="/upload">
                    <button className="btn-create">Kurs yaratish</button>
                  </Link>
                </div>
              ) : (
                courses
                  .filter(course => !course.id.startsWith("http")) // Filter out broken records
                  .map((course, idx) => (
                    <Link
                      href={`/course/${course.id}`}
                      key={course.id}
                      className="block outline-none focus:ring-2 focus:ring-blue-500 rounded-3xl"
                    >
                      <article className="post-card hover:border-blue-500/50 transition-all cursor-pointer h-full overflow-hidden flex flex-col">
                        <div className="post-image-container relative w-full aspect-video">
                          <Image
                            src={course.thumbnail_url}
                            alt={course.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            priority={idx < 4}
                          />
                          <div className="post-badge absolute top-3 left-3 z-10">Kurs</div>
                        </div>
                        <div className="post-content flex-grow">
                          <h2 className="post-title">{course.title}</h2>
                          <p className="post-excerpt">{course.description}</p>
                          <div className="post-card-footer">
                            <span className="post-date">{new Date(course.created_at).toLocaleDateString()}</span>
                            <div className="stat-item views ml-auto"><Eye size={14} className="opacity-50" /> <span>0</span></div>
                          </div>
                        </div>
                      </article>
                    </Link>
                  ))
              )}
            </div>

            <div className="floating-toggle">
              <div className="toggle-item active"><Flame size={18} /> Ommabop</div>
              <div className="toggle-item"><Zap size={18} /> Yangilar</div>
              <div className="toggle-item"><LayoutGrid size={18} /> Mening lentam</div>
              <div className="toggle-settings"><Settings2 size={18} /></div>
            </div>
          </main>

          <aside className="sidebar-r">
            <div className="widget ranking-widget">
              <div className="widget-header">
                <h3>Reyting</h3>
                <a href="#" className="see-all">Hammasi &gt;</a>
              </div>
              <div className="ranking-list">
                {[
                  { name: "wave", sub: "@wave-studio · Studio", color: "#2563EB" },
                  { name: "Pink: kreativnoe atele", sub: "@pink_atelier · Studio", color: "#000" },
                  { name: "duo sapiens*", sub: "@duosapiens · Studio", color: "#FFD700" },
                  { name: "Yandeks Praktikum", sub: "@practicum · Maktab", color: "#000", verified: true },
                  { name: "Darya Tyutikova", sub: "@DAR.T · O'qtuvchi", color: "#B8860B" }
                ].map((item, i) => (
                  <div key={i} className="ranking-item">
                    <div className="rank-avatar" style={{ backgroundColor: item.color }}></div>
                    <div className="rank-info">
                      <span className="rank-name">{item.name} {item.verified && <span className="verified">✓</span>}</span>
                      <span className="rank-sub">{item.sub}</span>
                    </div>
                    <div className="rank-num">{i + 1}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="widget ad-widget">
              <div className="ad-badge">Reklama</div>
              <div className="ad-header">
                <span className="ad-title">screen<b>-</b>o<b>-</b>teka</span>
              </div>
              <div className="ad-grid">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="ad-grid-item" style={{ backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#6366F1', '#111827'][i] }}></div>
                ))}
              </div>
              <p className="ad-text">Rossiya va MDHdagi eng yirik patternlar to'plami sizning dunyoqarashingiz uchun</p>
              <button className="btn-ad-catalog">Ilovalar katalogi</button>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
