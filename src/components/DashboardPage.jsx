import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Award, Map, Navigation, Heart, Clock, DollarSign, Filter, Sparkles, ArrowRight } from 'lucide-react';
import { useAuth } from '../App';

const StatCard = ({ icon: Icon, label, value, trend, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="glass p-6 rounded-2xl"
  >
    <div className="flex items-center justify-between mb-4">
      <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
        <Icon className="text-emerald-500" size={24} />
      </div>
      {trend && (
        <span className="text-xs font-bold text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full">
          +{trend}%
        </span>
      )}
    </div>
    <div className="text-2xl font-bold mb-1">{value}</div>
    <div className="text-sm text-text-secondary">{label}</div>
  </motion.div>
);

const DashboardPage = () => {
  const { user, bookings } = useAuth();
  
  const stats = [
    { icon: Map, label: 'Total Trips', value: bookings.length.toString(), trend: '0', delay: 0.1 },
    { icon: Navigation, label: 'Miles Traveled', value: (bookings.length * 450).toLocaleString(), trend: '0', delay: 0.2 },
    { icon: Award, label: 'Gems Found', value: (bookings.length * 2).toString(), trend: '0', delay: 0.3 },
    { icon: Heart, label: 'Favorites', value: '45', delay: 0.4 },
  ];

  // Map bookings to the display format
  const recentTrips = bookings.length > 0 ? bookings.map(b => ({
    title: b.title,
    location: b.location,
    date: new Date(b.timestamp).toLocaleDateString(),
    rating: b.rating,
    cost: b.price
  })).reverse() : [
    { title: 'Silent Valley', location: 'Kerala, India', date: '2 days ago', rating: 4.9, cost: '$240' },
    { title: 'The Tiger\'s Nest', location: 'Paro, Bhutan', date: '1 week ago', rating: 5.0, cost: '$450' },
    { title: 'Azure Coast', location: 'Gokarna, India', date: '3 weeks ago', rating: 4.7, cost: '$180' },
  ];

  return (
    <div className="container mx-auto pt-12">
      <div className="mb-10 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">Welcome Back, {user?.name || 'Explorer'}! 👋</h1>
          <p className="text-text-secondary">Your travel journey at a glance.</p>
        </div>
        <button className="btn-primary">
          <Sparkles size={18} />
          Plan New Adventure
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, i) => (
          <StatCard key={i} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Recent Adventures</h2>
            <button className="text-emerald-400 text-sm font-semibold hover:underline">View All</button>
          </div>
          
          <div className="space-y-4">
            {recentTrips.map((trip, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="glass p-5 rounded-2xl flex items-center gap-6 group cursor-pointer hover:bg-white/5 transition-colors"
              >
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shrink-0">
                  <Map className="text-black" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-lg truncate group-hover:text-emerald-400 transition-colors">{trip.title}</h3>
                  <p className="text-sm text-text-secondary truncate">{trip.location} • {trip.date}</p>
                </div>
                <div className="text-right hidden sm:block">
                  <div className="font-bold">{trip.cost}</div>
                  <div className="text-xs text-emerald-500 font-bold">★ {trip.rating}</div>
                </div>
                <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:border-emerald-500 transition-colors">
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* AI Recommendations Side Panel */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Smart Insights</h2>
          <div className="glass p-6 rounded-3xl border-emerald-500/30 bg-emerald-500/5">
            <div className="flex items-center gap-2 mb-4 text-emerald-400">
              <Sparkles size={20} />
              <span className="font-bold">Next Recommendation</span>
            </div>
            <p className="text-sm text-text-secondary leading-relaxed mb-6">
              Based on your love for mountainous regions and quiet escapes, you might enjoy the Himalayas this autumn.
            </p>
            <div className="bg-black/40 rounded-2xl p-4 border border-white/5 mb-6">
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider mb-2">
                <span className="text-text-secondary">Match Probability</span>
                <span className="text-emerald-400">92%</span>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '92%' }}
                  transition={{ delay: 1, duration: 1.5 }}
                  className="h-full bg-emerald-500"
                />
              </div>
            </div>
            <button className="w-full py-3 rounded-xl bg-emerald-500 text-black font-bold hover:bg-emerald-400 transition-all flex items-center justify-center gap-2">
              Explore Now
            </button>
          </div>

          <div className="glass p-6 rounded-3xl">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <Clock size={18} className="text-emerald-400" />
              Travel Time
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-text-secondary">Planning</span>
                <span className="font-semibold text-emerald-400">24.5 hrs</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-text-secondary">On the Road</span>
                <span className="font-semibold text-emerald-400">156 hrs</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
