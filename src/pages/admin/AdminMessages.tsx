import { useEffect, useState } from 'react';
import { Trash2, Mail, MailOpen, Reply, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { AdminHeader, AdminCard } from '@/components/admin/AdminUI';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import type { Message } from '@/types';

export function AdminMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [selected, setSelected] = useState<Message | null>(null);

  useEffect(() => { loadMessages(); }, []);

  const loadMessages = async () => {
    const { data } = await supabase.from('messages').select('*').order('created_at', { ascending: false });
    setMessages((data ?? []) as Message[]);
    setLoading(false);
  };

  const toggleRead = async (msg: Message) => {
    await supabase.from('messages').update({ is_read: !msg.is_read }).eq('id', msg.id);
    loadMessages();
    if (selected?.id === msg.id) setSelected({ ...msg, is_read: !msg.is_read });
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await supabase.from('messages').delete().eq('id', deleteId);
    setDeleteId(null);
    if (selected?.id === deleteId) setSelected(null);
    loadMessages();
  };

  const unreadCount = messages.filter((m) => !m.is_read).length;

  if (loading) return <div className="flex items-center justify-center py-12"><div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div>
      <AdminHeader title="Contact Messages" subtitle={`${messages.length} messages${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`} />

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="space-y-3">
          {messages.length === 0 && <p className="text-center text-gray-500 py-8">No messages yet.</p>}
          {messages.map((msg) => (
            <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <AdminCard
                className={`p-4 cursor-pointer hover:border-blue-400/30 transition-all ${selected?.id === msg.id ? 'border-blue-400/50' : ''} ${!msg.is_read ? 'bg-blue-500/5' : ''}`}
              >
                <div onClick={() => { setSelected(msg); if (!msg.is_read) toggleRead(msg); }}>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      {msg.is_read ? <MailOpen className="w-4 h-4 text-gray-500" /> : <Mail className="w-4 h-4 text-blue-400" />}
                      <span className="text-white font-medium text-sm">{msg.name}</span>
                    </div>
                    <span className="text-gray-500 text-xs">{new Date(msg.created_at).toLocaleDateString()}</span>
                  </div>
                  <p className="text-gray-400 text-xs mb-1">{msg.email}</p>
                  <p className="text-gray-500 text-sm line-clamp-2">{msg.message}</p>
                </div>
                <div className="flex gap-2 mt-3 justify-end">
                  <button onClick={() => toggleRead(msg)} className="text-gray-400 hover:text-white text-xs px-2 py-1 rounded-lg hover:bg-white/5">
                    {msg.is_read ? 'Mark unread' : 'Mark read'}
                  </button>
                  <a href={`mailto:${msg.email}`} className="text-gray-400 hover:text-white p-1.5 rounded-lg hover:bg-white/5">
                    <Reply className="w-4 h-4" />
                  </a>
                  <button onClick={() => setDeleteId(msg.id)} className="text-red-400 hover:text-red-300 p-1.5 rounded-lg hover:bg-red-500/10">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </AdminCard>
            </motion.div>
          ))}
        </div>

        {selected && (
          <AdminCard className="p-6 h-fit sticky top-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold">Message Details</h3>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-white text-sm">Close</button>
            </div>
            <div className="space-y-3">
              <div><span className="text-gray-500 text-xs">From</span><p className="text-white text-sm">{selected.name}</p></div>
              <div><span className="text-gray-500 text-xs">Email</span><p className="text-gray-300 text-sm">{selected.email}</p></div>
              {selected.phone && <div><span className="text-gray-500 text-xs">Phone</span><p className="text-gray-300 text-sm">{selected.phone}</p></div>}
              <div><span className="text-gray-500 text-xs">Date</span><p className="text-gray-300 text-sm">{new Date(selected.created_at).toLocaleString()}</p></div>
              <div>
                <span className="text-gray-500 text-xs">Message</span>
                <p className="text-gray-200 text-sm mt-1 leading-relaxed bg-white/5 rounded-xl p-4 border border-white/10">{selected.message}</p>
              </div>
              <a href={`mailto:${selected.email}`} className="block">
                <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-400 text-gray-950 font-medium rounded-xl text-sm">
                  <Reply className="w-4 h-4" /> Reply via Email
                </button>
              </a>
            </div>
          </AdminCard>
        )}
      </div>

      <ConfirmDialog open={!!deleteId} title="Delete Message" message="Are you sure you want to delete this message?" onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />
    </div>
  );
}
