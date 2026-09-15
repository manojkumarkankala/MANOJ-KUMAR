import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FolderGit2, Code, Wrench, MessageSquare, GraduationCap, TrendingUp } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { AdminHeader, AdminCard } from '@/components/admin/AdminUI';

interface Stats {
  projects: number;
  skills: number;
  services: number;
  messages: number;
  education: number;
  unreadMessages: number;
}

export function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    projects: 0,
    skills: 0,
    services: 0,
    messages: 0,
    education: 0,
    unreadMessages: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      const [projects, skills, services, messages, education, unread] = await Promise.all([
        supabase.from('projects').select('*', { count: 'exact', head: true }),
        supabase.from('skills').select('*', { count: 'exact', head: true }),
        supabase.from('services').select('*', { count: 'exact', head: true }),
        supabase.from('messages').select('*', { count: 'exact', head: true }),
        supabase.from('education').select('*', { count: 'exact', head: true }),
        supabase.from('messages').select('*', { count: 'exact', head: true }).eq('is_read', false),
      ]);

      setStats({
        projects: projects.count ?? 0,
        skills: skills.count ?? 0,
        services: services.count ?? 0,
        messages: messages.count ?? 0,
        education: education.count ?? 0,
        unreadMessages: unread.count ?? 0,
      });
      setLoading(false);
    }
    loadStats();
  }, []);

  const cards = [
    { label: 'Total Projects', value: stats.projects, icon: FolderGit2, link: '/admin/projects', color: 'from-blue-500 to-cyan-400' },
    { label: 'Total Skills', value: stats.skills, icon: Code, link: '/admin/skills', color: 'from-green-500 to-emerald-400' },
    { label: 'Total Services', value: stats.services, icon: Wrench, link: '/admin/services', color: 'from-orange-500 to-yellow-400' },
    { label: 'Total Messages', value: stats.messages, icon: MessageSquare, link: '/admin/messages', color: 'from-pink-500 to-rose-400', badge: stats.unreadMessages > 0 ? `${stats.unreadMessages} new` : undefined },
    { label: 'Education Items', value: stats.education, icon: GraduationCap, link: '/admin/education', color: 'from-violet-500 to-purple-400' },
  ];

  return (
    <div>
      <AdminHeader title="Dashboard" subtitle="Overview of your portfolio" />

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {cards.map((card) => {
              const Icon = card.icon;
              return (
                <Link key={card.label} to={card.link}>
                  <AdminCard className="p-5 hover:border-blue-400/30 transition-all group cursor-pointer">
                    <div className="flex items-center justify-between mb-3">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center text-gray-950`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      {card.badge && (
                        <span className="text-xs px-2 py-0.5 bg-red-500/20 text-red-300 rounded-full">{card.badge}</span>
                      )}
                    </div>
                    <div className="text-3xl font-bold text-white mb-1">{card.value}</div>
                    <div className="text-gray-400 text-sm">{card.label}</div>
                  </AdminCard>
                </Link>
              );
            })}
          </div>

          <AdminCard className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-blue-400" />
              <h3 className="text-white font-semibold">Quick Actions</h3>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <Link to="/admin/projects" className="px-4 py-3 bg-white/5 rounded-xl text-gray-300 text-sm hover:text-white hover:bg-white/10 transition-all text-center">
                Add Project
              </Link>
              <Link to="/admin/skills" className="px-4 py-3 bg-white/5 rounded-xl text-gray-300 text-sm hover:text-white hover:bg-white/10 transition-all text-center">
                Add Skill
              </Link>
              <Link to="/admin/profile" className="px-4 py-3 bg-white/5 rounded-xl text-gray-300 text-sm hover:text-white hover:bg-white/10 transition-all text-center">
                Edit Profile
              </Link>
              <Link to="/admin/settings" className="px-4 py-3 bg-white/5 rounded-xl text-gray-300 text-sm hover:text-white hover:bg-white/10 transition-all text-center">
                Site Settings
              </Link>
            </div>
          </AdminCard>
        </>
      )}
    </div>
  );
}
