import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Search,
  MapPin,
  Calendar,
  Filter,
  MessageCircle,
  Sparkles,
  UserPlus,
} from 'lucide-react';
import { travelBuddies } from '../data/mockData';
import { useAuth } from '../App';

const BuddyFinderPage = () => {
  const { user, setIsModalOpen } = useAuth();
  const [search, setSearch] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('');
  const [connected, setConnected] = useState(new Set());

  const allStyles = useMemo(() => {
    const styles = new Set();
    travelBuddies.forEach((b) => b.style.forEach((s) => styles.add(s)));
    return Array.from(styles).sort();
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return travelBuddies.filter((buddy) => {
      const matchesSearch =
        !q ||
        buddy.name.toLowerCase().includes(q) ||
        buddy.destination.toLowerCase().includes(q) ||
        buddy.bio.toLowerCase().includes(q);
      const matchesStyle = !selectedStyle || buddy.style.includes(selectedStyle);
      return matchesSearch && matchesStyle;
    });
  }, [search, selectedStyle]);

  const handleConnect = (buddyId, buddyName) => {
    if (!user) {
      setIsModalOpen(true);
      return;
    }
    setConnected((prev) => new Set(prev).add(buddyId));
    alert(`Request sent to ${buddyName}! They'll be notified in the app.`);
  };

  return (
    <div className="container mx-auto pt-12 pb-16">
      <div className="mb-10">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-emerald-500/20 px-4 py-2 text-sm font-bold text-emerald-400">
          <Users size={16} />
          Travel together
        </div>
        <h1 className="text-4xl font-bold mb-2">Buddy Finder</h1>
        <p className="max-w-2xl text-text-secondary">
          Match with explorers heading to the same hidden trails. Filter by destination and travel style, then connect safely.
        </p>
      </div>

      <div className="mb-10 grid grid-cols-1 gap-8 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <div className="glass space-y-6 rounded-2xl p-6 sticky top-28">
            <div className="flex items-center gap-2">
              <Filter className="text-emerald-500" size={20} />
              <h2 className="font-bold">Find a match</h2>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">Destination</label>
              <div className="relative">
                <Search className="absolute top-1/2 left-3 -translate-y-1/2 text-text-secondary" size={16} />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Bhutan, Portugal, Sapa..."
                  className="w-full rounded-lg bg-black/20 py-3 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
              </div>
            </div>

            <div>
              <label className="mb-3 block text-sm font-semibold">Travel style</label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedStyle('')}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                    !selectedStyle ? 'bg-emerald-500 text-black' : 'bg-white/10 hover:bg-emerald-500/20'
                  }`}
                >
                  All
                </button>
                {allStyles.map((style) => (
                  <button
                    key={style}
                    onClick={() => setSelectedStyle(selectedStyle === style ? '' : style)}
                    className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                      selectedStyle === style
                        ? 'bg-emerald-500 text-black'
                        : 'bg-white/10 hover:bg-emerald-500/20'
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-4 text-sm text-text-secondary">
              <Sparkles size={16} className="mb-2 text-emerald-400" />
              {filtered.length} {filtered.length === 1 ? 'traveler' : 'travelers'} match your filters
            </div>
          </div>
        </div>

        <div className="lg:col-span-3">
          {!user && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass mb-6 flex flex-col items-start justify-between gap-4 rounded-2xl border border-emerald-500/20 p-6 sm:flex-row sm:items-center"
            >
              <div>
                <h3 className="font-bold">Sign in to connect</h3>
                <p className="text-sm text-text-secondary">Create a profile so buddies can see your trip plans.</p>
              </div>
              <button className="btn-primary shrink-0" onClick={() => setIsModalOpen(true)}>
                <UserPlus size={18} />
                Sign In
              </button>
            </motion.div>
          )}

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {filtered.map((buddy, i) => (
              <motion.article
                key={buddy.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass overflow-hidden rounded-2xl"
              >
                <div className="p-6">
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-sm font-bold text-black">
                        {buddy.avatar}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold">{buddy.name}</h3>
                        <p className="text-xs text-text-secondary">{buddy.trips} trips completed</p>
                      </div>
                    </div>
                    <span className="rounded-full bg-emerald-500/20 px-2.5 py-1 text-xs font-bold text-emerald-400">
                      {buddy.match}% match
                    </span>
                  </div>

                  <div className="mb-3 flex items-center gap-2 text-sm">
                    <MapPin size={14} className="shrink-0 text-emerald-500" />
                    <span>{buddy.destination}</span>
                  </div>
                  <div className="mb-4 flex items-center gap-2 text-sm text-text-secondary">
                    <Calendar size={14} className="shrink-0" />
                    <span>{buddy.dates}</span>
                  </div>

                  <p className="mb-4 text-sm leading-relaxed text-text-secondary">{buddy.bio}</p>

                  <div className="mb-5 flex flex-wrap gap-2">
                    {buddy.style.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-400"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={() => handleConnect(buddy.id, buddy.name)}
                    disabled={connected.has(buddy.id)}
                    className={`flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold transition-all ${
                      connected.has(buddy.id)
                        ? 'bg-white/10 text-emerald-400 cursor-default'
                        : 'bg-emerald-500 text-black hover:bg-emerald-400'
                    }`}
                  >
                    <MessageCircle size={18} />
                    {connected.has(buddy.id) ? 'Request Sent' : 'Connect'}
                  </button>
                </div>
              </motion.article>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="glass rounded-2xl py-16 text-center">
              <Users size={48} className="mx-auto mb-4 text-text-secondary" />
              <h3 className="text-xl font-bold mb-2">No buddies found</h3>
              <p className="text-text-secondary">Try a different destination or travel style.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BuddyFinderPage;
