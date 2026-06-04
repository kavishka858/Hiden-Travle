import React, { useState, useEffect, createContext, useContext, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { Compass, Map as MapIcon, Calendar, User, Search, Menu, X, ArrowRight, Heart, Star, Leaf, Users, Sparkles, Settings, Palette, Save, RefreshCw, Filter, Clock, DollarSign, ArrowLeft, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { hiddenTrails } from './data/mockData';
import DashboardPage from './components/DashboardPage';
import VideoBackground from './components/VideoBackground';
import TrailImage from './components/TrailImage';
import BuddyFinderPage from './components/BuddyFinderPage';
// --- Theme Context for Color Caching ---
const ThemeContext = createContext();
const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const cached = localStorage.getItem('hidden-trails-user');
    return cached ? JSON.parse(cached) : null;
  });
  const [bookings, setBookings] = useState(() => {
    const cached = localStorage.getItem('hidden-trails-bookings');
    return cached ? JSON.parse(cached) : [];
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('hidden-trails-user', JSON.stringify(userData));
    setIsModalOpen(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('hidden-trails-user');
  };

  const addBooking = (bookingData) => {
    const newBookings = [...bookings, { ...bookingData, id: Date.now(), timestamp: new Date().toISOString() }];
    setBookings(newBookings);
    localStorage.setItem('hidden-trails-bookings', JSON.stringify(newBookings));
    return true;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isModalOpen, setIsModalOpen, bookings, addBooking }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

const defaultTheme = {
  primary: '#2ECC71',
  secondary: '#F1C40F',
  background: '#0A0A0B',
  card: 'rgba(26, 26, 28, 0.8)',
  text: '#FFFFFF',
  textSecondary: '#A0A0A0',
  glass: 'rgba(255, 255, 255, 0.1)',
  gradient: 'linear-gradient(135deg, #2ECC71 0%, #27AE60 100%)'
};

const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const cached = localStorage.getItem('hidden-trails-theme');
    return cached ? JSON.parse(cached) : defaultTheme;
  });

  const updateTheme = (newTheme) => {
    const updated = { ...theme, ...newTheme };
    setTheme(updated);
    localStorage.setItem('hidden-trails-theme', JSON.stringify(updated));
    
    // Update CSS custom properties
    Object.entries(updated).forEach(([key, value]) => {
      document.documentElement.style.setProperty(`--${key}`, value);
    });
  };

  const resetTheme = () => {
    setTheme(defaultTheme);
    localStorage.removeItem('hidden-trails-theme');
    Object.entries(defaultTheme).forEach(([key, value]) => {
      document.documentElement.style.setProperty(`--${key}`, value);
    });
  };

  useEffect(() => {
    // Apply theme on mount
    Object.entries(theme).forEach(([key, value]) => {
      document.documentElement.style.setProperty(`--${key}`, value);
    });
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, updateTheme, resetTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

const useTheme = () => useContext(ThemeContext);
// --- Shared Components ---

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout, setIsModalOpen } = useAuth();

  return (
    <nav className="glass sticky top-6 z-50 mx-auto mt-6 w-[95%] max-w-7xl rounded-2xl px-6 py-4">
      <div className="flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-700">
            <Compass className="text-black" />
          </div>
          <span className="text-xl font-bold tracking-tight">HIDDEN TRAILS</span>
        </Link>
        
        <div className="hidden items-center gap-8 md:flex">
          <Link to="/explore" className="text-sm font-medium transition-colors hover:text-emerald-400">Explore</Link>
          <Link to="/planner" className="text-sm font-medium transition-colors hover:text-emerald-400">Trip Planner</Link>
          <Link to="/buddy" className="text-sm font-medium transition-colors hover:text-emerald-400">Buddy Finder</Link>
          <Link to="/dashboard" className="text-sm font-medium transition-colors hover:text-emerald-400">
            <TrendingUp size={16} className="inline mr-1" />
            Dashboard
          </Link>
          <Link to="/settings" className="text-sm font-medium transition-colors hover:text-emerald-400">
            <Settings size={16} className="inline mr-1" />
            Settings
          </Link>
          
          {user ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 glass px-3 py-1.5 rounded-xl border-emerald-500/20">
                <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-[10px] font-bold text-black">
                  {user.name.charAt(0)}
                </div>
                <span className="text-xs font-semibold">{user.name}</span>
              </div>
              <button onClick={logout} className="text-xs font-bold text-red-400 hover:text-red-300 transition-colors">
                Log Out
              </button>
            </div>
          ) : (
            <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
              <User size={18} />
              Sign In
            </button>
          )}
        </div>

        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 flex flex-col gap-4 overflow-hidden md:hidden"
          >
            <Link to="/explore" className="py-2 text-lg">Explore</Link>
            <Link to="/planner" className="py-2 text-lg">Trip Planner</Link>
            <Link to="/buddy" className="py-2 text-lg">Buddy Finder</Link>
            <Link to="/dashboard" className="py-2 text-lg flex items-center gap-2">
              <TrendingUp size={20} />
              Dashboard
            </Link>
            <Link to="/settings" className="py-2 text-lg flex items-center gap-2">
              <Settings size={20} />
              Settings
            </Link>
            {user ? (
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3 glass p-3 rounded-xl border-emerald-500/20">
                  <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center font-bold text-black">
                    {user.name.charAt(0)}
                  </div>
                  <span className="font-semibold">{user.name}</span>
                </div>
                <button onClick={logout} className="btn-primary bg-red-500 hover:bg-red-400 justify-center">Sign Out</button>
              </div>
            ) : (
              <button className="btn-primary justify-center" onClick={() => {
                setIsModalOpen(true);
                setIsOpen(false);
              }}>Sign In</button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Footer = () => (
  <footer className="mt-24 border-t border-white/5 py-12">
    <div className="container mx-auto grid grid-cols-1 gap-12 md:grid-cols-4">
      <div className="col-span-1 md:col-span-2">
        <div className="flex items-center gap-2">
          <Compass className="text-emerald-500" />
          <span className="text-xl font-bold tracking-tight">HIDDEN TRAILS</span>
        </div>
        <p className="mt-4 max-w-xs text-sm text-text-secondary">
          Discover travel beyond the crowd. We focus on authentic experiences, local culture, and sustainable tourism for the conscious explorer.
        </p>
      </div>
      <div>
        <h4 className="mb-4 font-semibold">Platform</h4>
        <ul className="space-y-2 text-sm text-text-secondary">
          <li><Link to="/explore">Explore Gems</Link></li>
          <li><Link to="/planner">Smart Planner</Link></li>
          <li><Link to="/buddy">Find Buddy</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="mb-4 font-semibold">Community</h4>
        <ul className="space-y-2 text-sm text-text-secondary">
          <li><a href="#">Eco-Ethics</a></li>
          <li><a href="#">Support Locals</a></li>
          <li><a href="#">Review Rules</a></li>
        </ul>
      </div>
    </div>
    <div className="container mx-auto mt-12 text-center text-xs text-text-secondary">
      © 2026 Hidden Trails. Designed for a sustainable future.
    </div>
  </footer>
);

// --- Pages ---

const HomePage = () => {
  const { user, addBooking, setIsModalOpen } = useAuth();
  const navigate = useNavigate();
  const [showWelcome, setShowWelcome] = useState(() => !localStorage.getItem('has-seen-welcome'));

  useEffect(() => {
    document.body.classList.add('home-video-bg');
    return () => document.body.classList.remove('home-video-bg');
  }, []);

  return (
    <div className="animate-fade-in relative">
      <VideoBackground src="/hero-background.mp4" overlayOpacity={0.3} />

      {/* Welcome Modal */}
      <AnimatePresence>
        {showWelcome && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
            onClick={() => {
              setShowWelcome(false);
              localStorage.setItem('has-seen-welcome', 'true');
            }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="glass max-w-md mx-4 p-8 rounded-3xl text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <Compass size={32} className="text-emerald-500" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Welcome to Hidden Trails! 🌍</h2>
              <p className="text-text-secondary mb-6 leading-relaxed">
                Discover authentic travel experiences off the beaten path. Our AI helps you find perfect adventures tailored to your preferences.
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => {
                    setShowWelcome(false);
                    localStorage.setItem('has-seen-welcome', 'true');
                  }}
                  className="btn-primary"
                >
                  Get Started
                </button>
                <button
                  onClick={() => {
                    setShowWelcome(false);
                    localStorage.setItem('has-seen-welcome', 'true');
                  }}
                  className="glass px-6 py-3 rounded-xl"
                >
                  Skip Tour
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 container mx-auto pt-12">
        {/* Hero Section */}
        <section className="relative overflow-hidden rounded-[32px] min-h-[480px] p-8 md:p-24">
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="absolute inset-0 h-full w-full object-cover"
            aria-hidden
          >
            <source src="/hero-background.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 rounded-[32px] bg-gradient-to-r from-black/80 via-black/45 to-black/20" />
          <div className="relative z-10 max-w-2xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-4 inline-flex items-center gap-2 rounded-full bg-emerald-500/20 px-4 py-2 text-sm font-bold text-emerald-400"
            >
              <Sparkles size={16} />
              AI-Powered Travel
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl md:text-6xl font-bold leading-tight mb-6"
            >
              Find Your <span className="text-emerald-400">Perfect</span> Adventure
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-lg text-white/80 mb-8 leading-relaxed"
            >
              Skip tourist traps. Let our smart recommendations guide you to authentic, sustainable travel experiences that match your style.
            </motion.p>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link to="/explore" className="btn-primary text-center">
                <Search size={20} />
                Start Exploring
              </Link>
              <Link to="/planner" className="glass flex items-center justify-center gap-2 rounded-lg px-6 py-4 text-sm font-semibold transition-all hover:bg-white/10">
                <Calendar size={20} />
                Plan a Trip
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold mb-8 text-center">What would you like to do?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              whileHover={{ y: -5 }}
              className="glass p-6 rounded-2xl text-center group cursor-pointer"
              onClick={() => navigate('/explore')}
            >
              <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-emerald-500/20 flex items-center justify-center group-hover:bg-emerald-500/30 transition-colors">
                <Search size={24} className="text-emerald-500" />
              </div>
              <h3 className="text-lg font-bold mb-2">Explore Destinations</h3>
              <p className="text-sm text-text-secondary">Browse hidden gems with smart filters and AI recommendations</p>
            </motion.div>
 
            <motion.div
              whileHover={{ y: -5 }}
              className="glass p-6 rounded-2xl text-center group cursor-pointer"
              onClick={() => navigate('/planner')}
            >
              <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-emerald-500/20 flex items-center justify-center group-hover:bg-emerald-500/30 transition-colors">
                <Calendar size={24} className="text-emerald-500" />
              </div>
              <h3 className="text-lg font-bold mb-2">Plan Your Trip</h3>
              <p className="text-sm text-text-secondary">Get AI-curated itineraries based on your preferences</p>
            </motion.div>
 
            <motion.div
              whileHover={{ y: -5 }}
              className="glass p-6 rounded-2xl text-center group cursor-pointer"
              onClick={() => navigate('/settings')}
            >
              <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-emerald-500/20 flex items-center justify-center group-hover:bg-emerald-500/30 transition-colors">
                <Palette size={24} className="text-emerald-500" />
              </div>
              <h3 className="text-lg font-bold mb-2">Customize Theme</h3>
              <p className="text-sm text-text-secondary">Personalize your experience with custom colors</p>
            </motion.div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="mt-16 grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            { icon: <MapIcon className="text-emerald-500" />, label: 'Hidden Locations', value: '500+', desc: 'Curated destinations' },
            { icon: <Leaf className="text-emerald-500" />, label: 'Eco-Friendly', value: '100%', desc: 'Sustainable focus' },
            { icon: <Users className="text-emerald-500" />, label: 'Local Guides', value: '250+', desc: 'Expert connections' },
            { icon: <Star className="text-emerald-500" />, label: 'Happy Travelers', value: '4.9/5', desc: 'Average rating' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass flex flex-col items-center justify-center rounded-2xl py-6 text-center"
            >
              {stat.icon}
              <div className="mt-2 text-2xl font-bold">{stat.value}</div>
              <div className="text-xs font-bold uppercase tracking-wider text-emerald-400">{stat.label}</div>
              <div className="text-xs text-text-secondary mt-1">{stat.desc}</div>
            </motion.div>
          ))}
        </section>

        {/* Smart Recommendations Section */}
        <section className="mt-24">
          <div className="mb-12 flex items-end justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="text-emerald-500" size={20} />
                <h2 className="text-3xl font-bold">AI-Powered Recommendations</h2>
              </div>
              <p className="text-text-secondary">Personalized suggestions based on trending destinations and your interests.</p>
            </div>
            <Link to="/explore" className="text-sm font-semibold text-emerald-400 hover:underline flex items-center gap-2">
              View all destinations
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {hiddenTrails.slice(0, 4).map((trail, i) => (
              <motion.div
                key={trail.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass group overflow-hidden rounded-2xl cursor-pointer"
                onClick={() => navigate('/explore')}
              >
                <div className="relative h-48 overflow-hidden">
                  <TrailImage trailId={trail.id} src={trail.image} alt={trail.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute top-3 right-3 rounded-full bg-black/50 p-1.5 backdrop-blur-md">
                    <Heart size={16} className="text-white hover:text-red-500 cursor-pointer transition-colors" />
                  </div>
                  <div className="absolute top-3 left-3 rounded-full bg-emerald-500/90 px-2 py-1 text-[10px] font-bold text-black backdrop-blur-md">
                    {Math.floor(Math.random() * 30) + 70}% Match
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-1 text-xs text-emerald-500 font-bold mb-1">
                    <Star size={12} fill="currentColor" /> {trail.rating}
                  </div>
                  <h3 className="text-lg font-bold line-clamp-1">{trail.title}</h3>
                  <p className="text-xs text-text-secondary mb-2">{trail.location}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold">{trail.price}</span>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!user) {
                          setIsModalOpen(true);
                          return;
                        }
                        addBooking(trail);
                        alert(`Booked ${trail.title}! View it in your Dashboard.`);
                      }}
                      className="text-emerald-400 text-xs font-semibold hover:underline"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

const ExplorePage = () => {
  const { user, addBooking, setIsModalOpen } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [selectedPrice, setSelectedPrice] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [favorites, setFavorites] = useState(new Set());

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Get all unique tags
  const allTags = useMemo(() => {
    const tags = new Set();
    hiddenTrails.forEach(trail => trail.tags.forEach(tag => tags.add(tag)));
    return Array.from(tags);
  }, []);

  // Smart suggestions based on query
  const suggestions = useMemo(() => {
    if (!debouncedQuery) return [];
    const query = debouncedQuery.toLowerCase();
    const matches = [];
    
    hiddenTrails.forEach(trail => {
      if (trail.title.toLowerCase().includes(query)) matches.push({ type: 'title', text: trail.title, trail });
      if (trail.location.toLowerCase().includes(query)) matches.push({ type: 'location', text: trail.location, trail });
      if (trail.description.toLowerCase().includes(query)) matches.push({ type: 'description', text: trail.description.slice(0, 50) + '...', trail });
      trail.tags.forEach(tag => {
        if (tag.toLowerCase().includes(query)) matches.push({ type: 'tag', text: tag, trail });
      });
    });
    
    return matches.slice(0, 5);
  }, [debouncedQuery]);

  // Filtered trails with smart logic
  const filteredTrails = useMemo(() => {
    let filtered = hiddenTrails;

    // Text search
    if (debouncedQuery) {
      const query = debouncedQuery.toLowerCase();
      filtered = filtered.filter(trail =>
        trail.title.toLowerCase().includes(query) ||
        trail.location.toLowerCase().includes(query) ||
        trail.description.toLowerCase().includes(query) ||
        trail.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Price filter
    if (selectedPrice) {
      filtered = filtered.filter(trail => trail.price === selectedPrice);
    }

    // Tag filters
    if (selectedTags.length > 0) {
      filtered = filtered.filter(trail =>
        selectedTags.every(tag => trail.tags.includes(tag))
      );
    }

    // Smart boost: prioritize highly rated trails and favorites
    return filtered.sort((a, b) => {
      const aScore = (favorites.has(a.id) ? 2 : 0) + a.rating;
      const bScore = (favorites.has(b.id) ? 2 : 0) + b.rating;
      return bScore - aScore;
    });
  }, [debouncedQuery, selectedPrice, selectedTags, favorites]);

  const toggleTag = (tag) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const toggleFavorite = (trailId) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(trailId)) {
        newFavorites.delete(trailId);
      } else {
        newFavorites.add(trailId);
      }
      return newFavorites;
    });
  };

  return (
    <div className="container mx-auto pt-12">
      <div className="flex flex-col gap-8 md:flex-row">
        <div className="w-full md:w-64">
          <div className="flex items-center gap-2 mb-6">
            <Filter className="text-emerald-500" size={24} />
            <h2 className="text-2xl font-bold">Find Your Perfect Trip</h2>
          </div>
          <div className="glass space-y-6 rounded-2xl p-6">
            <div className="bg-emerald-500/10 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Search size={16} className="text-emerald-500" />
                <span className="text-sm font-semibold text-emerald-400">Smart Search</span>
              </div>
              <p className="text-xs text-text-secondary mb-3">Search by destination, activity, or keywords</p>
              <div className="relative">
                <Search className="absolute top-1/2 left-3 -translate-y-1/2 text-text-secondary" size={16} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  className="w-full rounded-lg bg-black/20 py-3 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-emerald-500/50"
                  placeholder="Try 'beach', 'mountain', or 'Bhutan'..."
                />
              </div>
              {showSuggestions && suggestions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-full left-0 right-0 z-10 mt-1 glass rounded-lg overflow-hidden"
                >
                  {suggestions.map((suggestion, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setSearchQuery(suggestion.text);
                        setShowSuggestions(false);
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-white/5 transition-colors"
                    >
                      <div className="text-sm font-medium">{suggestion.text}</div>
                      <div className="text-xs text-text-secondary capitalize">{suggestion.type} • {suggestion.trail.title}</div>
                    </button>
                  ))}
                </motion.div>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm font-semibold">Budget Level</span>
                <span className="text-xs text-text-secondary">(per person)</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: '$', label: 'Budget', desc: '< $100' },
                  { value: '$$', label: 'Standard', desc: '$100-300' },
                  { value: '$$$', label: 'Premium', desc: '$300-500' },
                  { value: '$$$$', label: 'Luxury', desc: '> $500' }
                ].map(price => (
                  <button
                    key={price.value}
                    onClick={() => setSelectedPrice(selectedPrice === price.value ? '' : price.value)}
                    className={`rounded-lg border p-3 text-left transition-all ${
                      selectedPrice === price.value
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                        : 'border-white/10 hover:border-emerald-500'
                    }`}
                  >
                    <div className="font-semibold text-sm">{price.label}</div>
                    <div className="text-xs text-text-secondary">{price.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm font-semibold">Experience Types</span>
                <span className="text-xs text-text-secondary">(select multiple)</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {allTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`rounded-full px-3 py-2 text-xs font-medium transition-colors ${
                      selectedTags.includes(tag)
                        ? 'bg-emerald-500 text-black'
                        : 'bg-white/10 hover:bg-emerald-500/20'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {(selectedPrice || selectedTags.length > 0 || searchQuery) && (
              <div className="border-t border-white/10 pt-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold">Active Filters</span>
                  <button
                    onClick={() => {
                      setSelectedPrice('');
                      setSelectedTags([]);
                      setSearchQuery('');
                    }}
                    className="text-xs text-emerald-400 hover:text-emerald-300"
                  >
                    Clear all
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {searchQuery && (
                    <span className="bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-full text-xs">
                      Search: "{searchQuery}"
                    </span>
                  )}
                  {selectedPrice && (
                    <span className="bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-full text-xs">
                      Budget: {selectedPrice}
                    </span>
                  )}
                  {selectedTags.map(tag => (
                    <span key={tag} className="bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-full text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Explore Hidden Gems</h1>
              <p className="text-text-secondary">
                {filteredTrails.length} {filteredTrails.length === 1 ? 'trail' : 'trails'} found
                {favorites.size > 0 && ` • ${favorites.size} favorited`}
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-text-secondary">
              <Sparkles size={16} />
              Smart recommendations active
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {filteredTrails.map((trail) => (
              <motion.div
                key={trail.id}
                whileHover={{ y: -5 }}
                className="glass overflow-hidden rounded-2xl"
              >
                <div className="relative">
                  <TrailImage trailId={trail.id} src={trail.image} alt={trail.title} className="h-48 w-full object-cover" />
                  <button
                    onClick={() => toggleFavorite(trail.id)}
                    className="absolute top-4 right-4 rounded-full bg-black/50 p-2 backdrop-blur-md transition-colors hover:bg-red-500/50"
                  >
                    <Heart
                      size={20}
                      className={favorites.has(trail.id) ? 'text-red-500 fill-current' : 'text-white'}
                    />
                  </button>
                  <div className="absolute bottom-4 left-4 flex gap-2">
                    {trail.tags.slice(0, 2).map(tag => (
                      <span key={tag} className="rounded-full bg-emerald-500/20 px-3 py-1 text-[10px] font-bold text-emerald-400 backdrop-blur-md uppercase tracking-wider">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-1 text-xs text-emerald-500 font-bold mb-2">
                    <Star size={14} fill="currentColor" /> {trail.rating}
                    {favorites.has(trail.id) && <span className="ml-2 text-red-500">♥ Favorited</span>}
                  </div>
                  <h3 className="text-xl font-bold">{trail.title}</h3>
                  <p className="text-sm text-text-secondary mt-1">{trail.location}</p>
                  <p className="mt-3 text-sm text-text-secondary line-clamp-2">{trail.description}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="font-bold">{trail.price}</span>
                      <div className="flex gap-1">
                        {trail.features.slice(0, 2).map(feature => (
                          <span key={feature} className="text-xs bg-white/5 px-2 py-1 rounded-full">
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                    <button 
                      onClick={() => {
                        if (!user) {
                          setIsModalOpen(true);
                          return;
                        }
                        addBooking(trail);
                        alert(`Booked ${trail.title}! View it in your Dashboard.`);
                      }}
                      className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500 text-black transition-all hover:bg-emerald-400"
                    >
                      <ArrowRight size={20} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredTrails.length === 0 && (
            <div className="text-center py-12">
              <Search size={48} className="mx-auto text-text-secondary mb-4" />
              <h3 className="text-xl font-bold mb-2">No trails found</h3>
              <p className="text-text-secondary">Try adjusting your filters or search terms</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const PlannerPage = () => {
  const { user, addBooking, setIsModalOpen } = useAuth();
  const [step, setStep] = useState(1);
  const [selectedType, setSelectedType] = useState('');
  const [duration, setDuration] = useState(7);
  const [budget, setBudget] = useState('');
  const [preferences, setPreferences] = useState([]);
  const [generatedItinerary, setGeneratedItinerary] = useState(null);

  const tripTypes = [
    { name: 'Mountain Trek', icon: <Leaf size={20} />, description: 'Challenging hikes and breathtaking views' },
    { name: 'Coastal Secret', icon: <MapIcon size={20} />, description: 'Hidden beaches and marine adventures' },
    { name: 'Cultural Immersion', icon: <Users size={20} />, description: 'Local traditions and authentic experiences' },
    { name: 'Wildlife Safari', icon: <Star size={20} />, description: 'Animal encounters and conservation' }
  ];

  const preferenceOptions = [
    'Eco-friendly', 'Adventure', 'Relaxation', 'Photography', 'Food & Culture', 'Solo Travel', 'Group Activities'
  ];

  const generateSmartItinerary = () => {
    // Smart matching algorithm
    const matchingTrails = hiddenTrails.filter(trail => {
      const typeMatch = selectedType === 'Mountain Trek' && trail.tags.includes('Culture') ||
                       selectedType === 'Coastal Secret' && trail.tags.includes('Coastal') ||
                       selectedType === 'Cultural Immersion' && trail.tags.includes('Culture') ||
                       selectedType === 'Wildlife Safari' && trail.tags.includes('Wildlife');
      
      const budgetMatch = trail.price === budget;
      const preferenceMatch = preferences.length === 0 || 
                             preferences.some(pref => trail.tags.some(tag => 
                               tag.toLowerCase().includes(pref.toLowerCase().split(' ')[0])));
      
      return typeMatch || budgetMatch || preferenceMatch;
    });

    const selectedTrail = matchingTrails.length > 0 ? matchingTrails[0] : hiddenTrails[0];
    
    setGeneratedItinerary({
      ...selectedTrail,
      duration: duration,
      customizations: preferences,
      aiScore: Math.floor(Math.random() * 20) + 80 // Simulated AI confidence score
    });
  };

  useEffect(() => {
    if (step === 3 && !generatedItinerary) {
      generateSmartItinerary();
    }
  }, [step]);

  return (
    <div className="container mx-auto flex min-h-[70vh] items-center justify-center pt-12">
      <div className="glass w-full max-w-2xl rounded-[32px] p-8 md:p-12">
        <div className="flex items-center gap-4 text-text-secondary mb-8">
          <span className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold ${step >= 1 ? 'bg-emerald-500 text-black' : 'bg-white/10'}`}>1</span>
          <div className={`h-[1px] flex-1 ${step >= 2 ? 'bg-emerald-500' : 'bg-white/10'}`}></div>
          <span className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold ${step >= 2 ? 'bg-emerald-500 text-black' : 'bg-white/10'}`}>2</span>
          <div className={`h-[1px] flex-1 ${step >= 3 ? 'bg-emerald-500' : 'bg-white/10'}`}></div>
          <span className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold ${step >= 3 ? 'bg-emerald-500 text-black' : 'bg-white/10'}`}>3</span>
        </div>
        
        {step === 1 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="mt-12">
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <Compass size={32} className="text-emerald-500" />
              </div>
              <h2 className="text-3xl font-bold mb-2">What type of adventure are you seeking?</h2>
              <p className="text-text-secondary">Choose the experience that excites you most</p>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {tripTypes.map(type => (
                <motion.button
                  key={type.name}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedType(type.name)}
                  className={`glass rounded-xl p-6 text-left transition-all hover:border-emerald-500 ${
                    selectedType === type.name ? 'border-emerald-500 bg-emerald-500/10' : ''
                  }`}
                >
                  <div className={`h-12 w-12 rounded-lg mb-4 flex items-center justify-center ${
                    selectedType === type.name ? 'bg-emerald-500 text-black' : 'bg-emerald-500/10 text-emerald-500'
                  }`}>
                    {type.icon}
                  </div>
                  <div className="font-bold text-lg mb-2">{type.name}</div>
                  <div className="text-sm text-text-secondary leading-relaxed">{type.description}</div>
                </motion.button>
              ))}
            </div>
            <div className="mt-8 p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center mt-0.5">
                  <span className="text-blue-400 text-xs">ℹ</span>
                </div>
                <div>
                  <div className="text-sm font-semibold text-blue-400 mb-1">Pro tip</div>
                  <div className="text-sm text-text-secondary">You can change your preferences later if you want to explore different options.</div>
                </div>
              </div>
            </div>
            <button
              onClick={() => selectedType && setStep(2)}
              disabled={!selectedType}
              className="btn-primary mt-8 w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue with {selectedType || 'your choice'}
              <ArrowRight size={20} className="ml-2" />
            </button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="mt-12">
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <Calendar size={32} className="text-emerald-500" />
              </div>
              <h2 className="text-3xl font-bold mb-2">Tell us about your trip preferences</h2>
              <p className="text-text-secondary">Help us create the perfect itinerary for you</p>
            </div>
            <div className="space-y-8">
              <div className="glass rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Clock size={20} className="text-emerald-500" />
                  <span className="text-lg font-semibold">Trip Duration</span>
                </div>
                <p className="text-sm text-text-secondary mb-4">How many days would you like to travel?</p>
                <div className="space-y-4">
                  <input
                    type="range"
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="w-full accent-emerald-500"
                    min="3"
                    max="21"
                    step="1"
                  />
                  <div className="flex justify-between text-sm">
                    <span className="text-emerald-500 font-semibold">{duration} days</span>
                    <span className="text-text-secondary">3-21 days available</span>
                  </div>
                </div>
              </div>

              <div className="glass rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <DollarSign size={20} className="text-emerald-500" />
                  <span className="text-lg font-semibold">Budget Range</span>
                </div>
                <p className="text-sm text-text-secondary mb-4">What's your preferred spending level per person?</p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: '$', label: 'Budget Friendly', desc: 'Under $100/day', icon: '💰' },
                    { value: '$$', label: 'Moderate', desc: '$100-200/day', icon: '💎' },
                    { value: '$$$', label: 'Comfortable', desc: '$200-400/day', icon: '🏨' },
                    { value: '$$$$', label: 'Luxury', desc: '$400+/day', icon: '✨' }
                  ].map(b => (
                    <button
                      key={b.value}
                      onClick={() => setBudget(b.value)}
                      className={`p-4 rounded-lg border text-left transition-all ${
                        budget === b.value ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400' : 'border-white/10 hover:border-emerald-500'
                      }`}
                    >
                      <div className="text-2xl mb-2">{b.icon}</div>
                      <div className="font-semibold text-sm mb-1">{b.label}</div>
                      <div className="text-xs text-text-secondary">{b.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="glass rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Heart size={20} className="text-emerald-500" />
                  <span className="text-lg font-semibold">Your Interests</span>
                </div>
                <p className="text-sm text-text-secondary mb-4">What activities excite you? (Select all that apply)</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {preferenceOptions.map(pref => (
                    <button
                      key={pref}
                      onClick={() => setPreferences(prev =>
                        prev.includes(pref)
                          ? prev.filter(p => p !== pref)
                          : [...prev, pref]
                      )}
                      className={`p-3 rounded-lg border text-left transition-all ${
                        preferences.includes(pref)
                          ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                          : 'border-white/10 hover:border-emerald-500'
                      }`}
                    >
                      <div className="font-medium text-sm">{pref}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-4 mt-8">
              <button onClick={() => setStep(1)} className="glass flex-1 py-4 rounded-xl font-bold flex items-center justify-center gap-2">
                <ArrowLeft size={20} />
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={!budget}
                className="btn-primary flex-[2] justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Generate My Perfect Trip
                <Sparkles size={20} className="ml-2" />
              </button>
            </div>
          </motion.div>
        )}

        {step === 3 && generatedItinerary && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="mt-12 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/20">
              <Sparkles size={40} className="text-emerald-500" />
            </div>
            <h2 className="mt-6 text-3xl font-bold">AI-Curated Itinerary Ready!</h2>
            <p className="text-text-secondary mt-2">
              Our algorithm found a {generatedItinerary.aiScore}% match for your preferences.
            </p>
            <div className="mt-8 glass rounded-2xl p-6 text-left">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="text-xl font-bold">{generatedItinerary.title}</h4>
                  <span className="text-xs text-emerald-400 italic">AI-recommended for you</span>
                </div>
                <div className="text-right">
                  <div className="text-sm text-emerald-500 font-bold">{generatedItinerary.aiScore}% Match</div>
                  <div className="text-xs text-text-secondary">AI Confidence</div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="text-xs text-text-secondary uppercase tracking-wider">Duration</div>
                  <div className="font-semibold">{generatedItinerary.duration} Days</div>
                </div>
                <div>
                  <div className="text-xs text-text-secondary uppercase tracking-wider">Budget</div>
                  <div className="font-semibold">{generatedItinerary.price}</div>
                </div>
              </div>

              <div className="mb-4">
                <div className="text-xs text-text-secondary uppercase tracking-wider mb-2">Your Preferences</div>
                <div className="flex flex-wrap gap-1">
                  {generatedItinerary.customizations.map(pref => (
                    <span key={pref} className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-full">
                      {pref}
                    </span>
                  ))}
                </div>
              </div>

              <ul className="space-y-2 text-sm text-text-secondary">
                {generatedItinerary.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex gap-4 mt-8">
              <button onClick={() => setStep(2)} className="glass flex-1 py-4 rounded-xl font-bold">Refine</button>
              <button 
                onClick={() => {
                  if (!user) {
                    setIsModalOpen(true);
                    return;
                  }
                  addBooking(generatedItinerary);
                  alert('Adventure Booked! You can view it in your Dashboard.');
                }}
                className="btn-primary flex-[2] justify-center"
              >
                Book This Adventure
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

const SettingsPage = () => {
  const { theme, updateTheme, resetTheme } = useTheme();
  const [tempTheme, setTempTheme] = useState(theme);
  const [saved, setSaved] = useState(false);

  const presetThemes = [
    {
      name: 'Emerald Forest',
      colors: {
        primary: '#2ECC71',
        secondary: '#F1C40F',
        background: '#0A0A0B',
        card: 'rgba(26, 26, 28, 0.8)',
        text: '#FFFFFF',
        textSecondary: '#A0A0A0',
        glass: 'rgba(255, 255, 255, 0.1)',
        gradient: 'linear-gradient(135deg, #2ECC71 0%, #27AE60 100%)'
      }
    },
    {
      name: 'Ocean Blue',
      colors: {
        primary: '#3498DB',
        secondary: '#E74C3C',
        background: '#0F1419',
        card: 'rgba(20, 29, 38, 0.8)',
        text: '#FFFFFF',
        textSecondary: '#AAB8C2',
        glass: 'rgba(255, 255, 255, 0.08)',
        gradient: 'linear-gradient(135deg, #3498DB 0%, #2980B9 100%)'
      }
    },
    {
      name: 'Sunset Orange',
      colors: {
        primary: '#E67E22',
        secondary: '#9B59B6',
        background: '#1A0F0A',
        card: 'rgba(38, 26, 20, 0.8)',
        text: '#FFFFFF',
        textSecondary: '#D5B8A3',
        glass: 'rgba(255, 255, 255, 0.1)',
        gradient: 'linear-gradient(135deg, #E67E22 0%, #D35400 100%)'
      }
    },
    {
      name: 'Midnight Purple',
      colors: {
        primary: '#9B59B6',
        secondary: '#F39C12',
        background: '#0F0A1A',
        card: 'rgba(26, 20, 38, 0.8)',
        text: '#FFFFFF',
        textSecondary: '#B8A3D5',
        glass: 'rgba(255, 255, 255, 0.1)',
        gradient: 'linear-gradient(135deg, #9B59B6 0%, #8E44AD 100%)'
      }
    }
  ];

  const handleSave = () => {
    updateTheme(tempTheme);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const applyPreset = (preset) => {
    setTempTheme(preset.colors);
  };

  return (
    <div className="container mx-auto pt-12">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Palette className="text-emerald-500" size={32} />
          <h1 className="text-4xl font-bold">Theme Studio</h1>
        </div>
        <p className="text-text-secondary">Customize your experience with cached color themes</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Preset Themes */}
        <div className="lg:col-span-1">
          <h2 className="text-2xl font-bold mb-6">Preset Themes</h2>
          <div className="space-y-4">
            {presetThemes.map((preset) => (
              <motion.button
                key={preset.name}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => applyPreset(preset)}
                className="w-full glass rounded-xl p-4 text-left hover:border-emerald-500 transition-all"
                style={{
                  background: `linear-gradient(135deg, ${preset.colors.primary}20 0%, ${preset.colors.secondary}10 100%)`,
                  borderColor: preset.colors.primary + '40'
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">{preset.name}</h3>
                  <div className="flex gap-1">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: preset.colors.primary }}
                    ></div>
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: preset.colors.secondary }}
                    ></div>
                  </div>
                </div>
                <p className="text-xs text-text-secondary">Click to preview</p>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Custom Color Picker */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Custom Colors</h2>
            <div className="flex gap-3">
              <button
                onClick={resetTheme}
                className="glass px-4 py-2 rounded-lg text-sm hover:border-red-500 transition-colors"
              >
                <RefreshCw size={16} className="inline mr-2" />
                Reset
              </button>
              <button
                onClick={handleSave}
                className="btn-primary"
              >
                <Save size={16} className="inline mr-2" />
                {saved ? 'Saved!' : 'Save Theme'}
              </button>
            </div>
          </div>

          <div className="glass rounded-2xl p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Primary Color */}
              <div>
                <label className="block text-sm font-semibold mb-3">Primary Color</label>
                <div className="flex gap-3">
                  <input
                    type="color"
                    value={tempTheme.primary}
                    onChange={(e) => setTempTheme(prev => ({ ...prev, primary: e.target.value }))}
                    className="w-12 h-10 rounded-lg border-2 border-white/20 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={tempTheme.primary}
                    onChange={(e) => setTempTheme(prev => ({ ...prev, primary: e.target.value }))}
                    className="flex-1 glass px-3 py-2 rounded-lg text-sm"
                    placeholder="#2ECC71"
                  />
                </div>
              </div>

              {/* Secondary Color */}
              <div>
                <label className="block text-sm font-semibold mb-3">Secondary Color</label>
                <div className="flex gap-3">
                  <input
                    type="color"
                    value={tempTheme.secondary}
                    onChange={(e) => setTempTheme(prev => ({ ...prev, secondary: e.target.value }))}
                    className="w-12 h-10 rounded-lg border-2 border-white/20 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={tempTheme.secondary}
                    onChange={(e) => setTempTheme(prev => ({ ...prev, secondary: e.target.value }))}
                    className="flex-1 glass px-3 py-2 rounded-lg text-sm"
                    placeholder="#F1C40F"
                  />
                </div>
              </div>

              {/* Background */}
              <div>
                <label className="block text-sm font-semibold mb-3">Background</label>
                <div className="flex gap-3">
                  <input
                    type="color"
                    value={tempTheme.background}
                    onChange={(e) => setTempTheme(prev => ({ ...prev, background: e.target.value }))}
                    className="w-12 h-10 rounded-lg border-2 border-white/20 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={tempTheme.background}
                    onChange={(e) => setTempTheme(prev => ({ ...prev, background: e.target.value }))}
                    className="flex-1 glass px-3 py-2 rounded-lg text-sm"
                    placeholder="#0A0A0B"
                  />
                </div>
              </div>

              {/* Card Background */}
              <div>
                <label className="block text-sm font-semibold mb-3">Card Background</label>
                <input
                  type="text"
                  value={tempTheme.card}
                  onChange={(e) => setTempTheme(prev => ({ ...prev, card: e.target.value }))}
                  className="w-full glass px-3 py-2 rounded-lg text-sm"
                  placeholder="rgba(26, 26, 28, 0.8)"
                />
              </div>

              {/* Text Colors */}
              <div>
                <label className="block text-sm font-semibold mb-3">Primary Text</label>
                <div className="flex gap-3">
                  <input
                    type="color"
                    value={tempTheme.text}
                    onChange={(e) => setTempTheme(prev => ({ ...prev, text: e.target.value }))}
                    className="w-12 h-10 rounded-lg border-2 border-white/20 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={tempTheme.text}
                    onChange={(e) => setTempTheme(prev => ({ ...prev, text: e.target.value }))}
                    className="flex-1 glass px-3 py-2 rounded-lg text-sm"
                    placeholder="#FFFFFF"
                  />
                </div>
              </div>

              {/* Secondary Text */}
              <div>
                <label className="block text-sm font-semibold mb-3">Secondary Text</label>
                <div className="flex gap-3">
                  <input
                    type="color"
                    value={tempTheme.textSecondary}
                    onChange={(e) => setTempTheme(prev => ({ ...prev, textSecondary: e.target.value }))}
                    className="w-12 h-10 rounded-lg border-2 border-white/20 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={tempTheme.textSecondary}
                    onChange={(e) => setTempTheme(prev => ({ ...prev, textSecondary: e.target.value }))}
                    className="flex-1 glass px-3 py-2 rounded-lg text-sm"
                    placeholder="#A0A0A0"
                  />
                </div>
              </div>
            </div>

            {/* Preview Section */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">Live Preview</h3>
              <div 
                className="rounded-xl p-6 border"
                style={{
                  backgroundColor: tempTheme.card,
                  borderColor: tempTheme.glass,
                  color: tempTheme.text
                }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div 
                    className="w-8 h-8 rounded-lg"
                    style={{ backgroundColor: tempTheme.primary }}
                  ></div>
                  <h4 className="font-bold">Sample Card</h4>
                </div>
                <p style={{ color: tempTheme.textSecondary }} className="text-sm mb-4">
                  This is how your theme will look across the app.
                </p>
                <button 
                  className="px-4 py-2 rounded-lg text-sm font-semibold"
                  style={{
                    backgroundColor: tempTheme.primary,
                    color: tempTheme.text
                  }}
                >
                  Sample Button
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AuthModal = () => {
  const { isModalOpen, setIsModalOpen, login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (!isModalOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate login
    login({ name: email.split('@')[0] || 'Explorer', email });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="glass w-full max-w-md rounded-3xl p-8 relative"
      >
        <button 
          onClick={() => setIsModalOpen(false)}
          className="absolute top-4 right-4 text-text-secondary hover:text-white transition-colors"
        >
          <X size={24} />
        </button>

        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-emerald-500/20 flex items-center justify-center">
            <User size={32} className="text-emerald-500" />
          </div>
          <h2 className="text-2xl font-bold">Welcome Back</h2>
          <p className="text-text-secondary">Sign in to sync your adventures</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Email Address</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="explorer@hiddentrails.com"
              className="w-full glass px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/50"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full glass px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/50"
            />
          </div>
          <button type="submit" className="btn-primary w-full justify-center py-4 text-lg mt-4">
            Sign In
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-text-secondary">
          Don't have an account? <button className="text-emerald-400 font-bold hover:underline">Create One</button>
        </div>
      </motion.div>
    </div>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="relative min-h-screen text-white">
            <Navbar />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/explore" element={<ExplorePage />} />
              <Route path="/planner" element={<PlannerPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/buddy" element={<BuddyFinderPage />} />
            </Routes>
            <Footer />
            <AuthModal />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
