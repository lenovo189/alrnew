import { Search, Heart, Flame, MessageCircle, Eye, Home, Star, Users, Bookmark, Plus, LayoutGrid, Zap, Settings2, Youtube, Send } from 'lucide-react';
import './styles.css';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Learnifiy - Dashboard',
};

export default function Dashboard() {
  const cards = [
    {
      title: "24 ta yangi reliz yanvar va fevral oylari uchun",
      author: "Screen Gallery",
      description: "Har hafta biz Screen Gallery-ga yangi ilovalarni qo'shamiz. 2026-yil boshidan...",
      meta: "Maqola · 12 soat avval",
      image: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=800&q=80",
      reactions: { heart: 2, fire: 1, comment: 2, bookmark: 1, view: 332 }
    },
    {
      title: "Jamoaning foydali rivojlanishi",
      author: "Delimobil",
      description: "Salom! Men Kolya Dimovman, dizayn bo'limini boshqaraman...",
      meta: "Maqola · 13 soat avval",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80",
      reactions: { heart: 1, fire: 3, comment: 4, view: 460 }
    },
    {
      title: "Zanjirli reaksiya: qanday qilib bitta mexanika millionlab mijozlarni Alfa xizmatlari bilan bog'ladi...",
      author: "REB8T DIGITAL STUDIO",
      description: "Hammaga salom! REB8T — raqamli aloqa kanallarida...",
      meta: "Keys · 14 soat avval",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
      reactions: { heart: 3, fire: 1, comment: 1, bookmark: 5, view: 435 }
    },
    {
      title: "Nima uchun muvaffaqiyatsiz bo'lish foydali",
      author: "Dasha Kupsova",
      description: "Autsayder ko'proq o'zi bilmagan narsalarga rozi bo'ladi. Qachonki yirik xalqaro brend so'rasa...",
      meta: "Maqola · o'tgan kuni",
      image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80",
      reactions: { heart: 2, view: 579 }
    }
  ];

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
            <button className="btn-create">Yaratish <Plus size={18} /></button>
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
              {cards.map((card, idx) => (
                <article key={idx} className="post-card">
                  <div className="post-image" style={{ backgroundImage: `url(${card.image})` }}>
                    <div className="post-badge">Maqola</div>
                  </div>
                  <div className="post-content">
                    <div className="post-author-row">
                      <div className="author-avatar" style={{ backgroundColor: ['#FF5733', '#33FF57', '#3357FF', '#F333FF'][idx % 4] }}></div>
                      <div className="author-details">
                        <span className="author-name">{card.author}</span>
                        <span className="post-meta">{card.meta}</span>
                      </div>
                      <button className="btn-follow">Obuna bo'lish</button>
                    </div>
                    <h2 className="post-title">{card.title}</h2>
                    <p className="post-excerpt">{card.description}</p>
                    <div className="post-footer">
                      <div className="post-stats">
                        <div className="stat-item"><Heart size={16} /> <span>{card.reactions.heart}</span></div>
                        <div className="stat-item"><Flame size={16} /> <span>{card.reactions.fire}</span></div>
                        <div className="stat-item"><MessageCircle size={16} /></div>
                      </div>
                      <div className="stat-item views"><Eye size={16} /> <span>{card.reactions.view}</span></div>
                    </div>
                  </div>
                </article>
              ))}
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
