import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  BarChart3, 
  AlertCircle, 
  RefreshCw, 
  ShieldCheck, 
  Users, 
  Settings, 
  LogOut,
  Menu,
  X,
  Target,
  FileCheck
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

const navItems = [
  { icon: BarChart3, label: 'Dashboard', path: '/' },
  { icon: AlertCircle, label: 'Deviations', path: '/deviations' },
  { icon: RefreshCw, label: 'Change Control', path: '/change-control' },
  { icon: Target, label: 'CAPA', path: '/capa' },
  { icon: ShieldCheck, label: 'Risk Mgmt', path: '/risks' },
  { icon: FileCheck, label: 'Training', path: '/training' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const { profile, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  return (
    <div className="flex h-screen bg-[#F8F9FA] overflow-hidden">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-[#E9ECEF] transition-all duration-300">
        <div className="p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#212529]">Nexus QMS</h1>
              <p className="text-xs text-[#6C757D] font-medium uppercase tracking-wider">Quality First</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                isActive 
                  ? "bg-indigo-50 text-indigo-700 shadow-sm shadow-indigo-100" 
                  : "text-[#495057] hover:bg-gray-50 hover:text-indigo-600"
              )}
            >
              <item.icon size={20} className={cn("transition-colors", "text-current")} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-[#E9ECEF]">
          <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl">
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-bold">
              {profile?.displayName?.[0] || profile?.email?.[0]?.toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[#212529] truncate">{profile?.displayName || 'User'}</p>
              <p className="text-xs text-[#6C757D] font-medium">{profile?.role}</p>
            </div>
            <button 
              onClick={() => logout()} 
              className="text-gray-400 hover:text-red-500 transition-colors p-1"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Header */}
        <header className="h-16 bg-white border-bottom border-[#E9ECEF] flex items-center justify-between px-6 z-10">
          <button 
            className="lg:hidden p-2 text-gray-500"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu size={24} />
          </button>
          <div className="flex items-center gap-4">
            <div className="relative">
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              <BarChart3 className="text-gray-400 cursor-pointer hover:text-indigo-600 transition-colors" size={20} />
            </div>
          </div>
        </header>

        {/* Content Viewport */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={window.location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
            />
            <motion.aside 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-72 bg-white z-50 lg:hidden flex flex-col"
            >
              <div className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
                    <ShieldCheck size={18} />
                  </div>
                  <h1 className="text-lg font-bold">Nexus QMS</h1>
                </div>
                <button onClick={() => setIsMobileMenuOpen(false)} className="text-gray-400">
                  <X size={24} />
                </button>
              </div>
              <nav className="flex-1 px-4 py-2 space-y-1">
                {navItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={({ isActive }) => cn(
                      "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium",
                      isActive ? "bg-indigo-50 text-indigo-700" : "text-[#495057]"
                    )}
                  >
                    <item.icon size={20} />
                    {item.label}
                  </NavLink>
                ))}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
