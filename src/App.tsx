/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import React from 'react';
import { AuthProvider, useAuth } from './hooks/useAuth';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Deviations from './pages/Deviations';
import ChangeControl from './pages/ChangeControl';
import CAPA from './pages/CAPA';
import { ShieldAlert, AlertCircle, MoreHorizontal } from 'lucide-react';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium animate-pulse">Initializing Security Protocols...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Layout>{children}</Layout>;
}

function Login() {
  const { signIn, error, clearError } = useAuth();
  const [isIframe] = React.useState(window.self !== window.top);

  return (
    <div className="h-screen w-screen flex flex-col lg:flex-row bg-white overflow-hidden">
      <div className="hidden lg:flex flex-1 bg-indigo-600 p-20 flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
           <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-white rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2"></div>
           <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-white rounded-full blur-[100px] translate-x-1/2 translate-y-1/2"></div>
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 text-white mb-12">
            <ShieldAlert size={40} />
            <h1 className="text-3xl font-black tracking-tight">Nexus QMS</h1>
          </div>
          <h2 className="text-5xl font-bold text-white leading-tight mb-6">
            Digitize Quality.<br />
            Ensure Compliance.
          </h2>
          <p className="text-indigo-100 text-lg max-w-md font-medium opacity-80">
            A secure, scalable platform for Deviation Management, Change Control, and CAPA tracking designed for high-stakes industries.
          </p>
        </div>
        
        <div className="relative z-10 flex gap-12">
           <div>
              <p className="text-white font-bold text-2xl">100%</p>
              <p className="text-indigo-200 text-sm font-medium">Audit Ready</p>
           </div>
           <div>
              <p className="text-white font-bold text-2xl">40%</p>
              <p className="text-indigo-200 text-sm font-medium">Faster Approvals</p>
           </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 bg-gray-50/30">
        <div className="w-full max-w-md space-y-8 bg-white p-10 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100">
          <div className="text-center">
            <div className="lg:hidden flex items-center justify-center gap-2 text-indigo-600 mb-6">
              <ShieldAlert size={32} />
              <h1 className="text-2xl font-bold tracking-tight">Nexus QMS</h1>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">Sign In</h3>
            <p className="text-gray-500 mt-2 font-medium">Access your quality management portal</p>
          </div>

          <div className="space-y-4">
            {error && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                <AlertCircle size={20} className="text-red-500 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-red-700 font-medium leading-relaxed">{error}</p>
                  <button 
                    onClick={clearError}
                    className="text-[10px] font-bold text-red-400 uppercase tracking-widest mt-2 hover:text-red-600"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            )}

            {isIframe && (
              <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-start gap-3">
                <ShieldAlert size={20} className="text-indigo-500 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-indigo-700 font-medium leading-relaxed">
                    Having trouble logging in? Popups are sometimes blocked inside the editor iframe.
                  </p>
                  <a 
                    href={window.location.href} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-[10px] font-bold text-indigo-600 uppercase tracking-widest mt-2 hover:text-indigo-800"
                  >
                    Open in New Tab
                    <MoreHorizontal size={14} />
                  </a>
                </div>
              </div>
            )}

            <button 
              onClick={() => signIn()}
              className="w-full flex items-center justify-center gap-3 py-4 border-2 border-gray-100 rounded-2xl font-bold text-gray-700 hover:bg-gray-50 hover:border-indigo-100 transition-all active:scale-[0.98]"
            >
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-6 h-6" alt="Google" />
              Sign in with Google
            </button>
          </div>

          <p className="text-center text-xs text-gray-400 font-medium px-8">
            By signing in, you agree to the Terms of Service and Privacy Policy for your organization.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/deviations" element={<ProtectedRoute><Deviations /></ProtectedRoute>} />
          <Route path="/change-control" element={<ProtectedRoute><ChangeControl /></ProtectedRoute>} />
          <Route path="/capa" element={<ProtectedRoute><CAPA /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

