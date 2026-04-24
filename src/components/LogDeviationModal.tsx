import React, { useState } from 'react';
import { X, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { qmsService } from '../services/qmsService';
import { useAuth } from '../hooks/useAuth';
import { DeviationCategory } from '../types';

interface LogDeviationModalProps {
  onClose: () => void;
}

export default function LogDeviationModal({ onClose }: LogDeviationModalProps) {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<DeviationCategory>('Minor');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsLoading(true);
    try {
      await qmsService.createDeviation({
        title,
        description,
        category,
        status: 'Open',
        createdBy: user.uid,
        attachments: [],
        slaDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
      });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl p-8"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-900">Log New Deviation</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase">Title</label>
            <input 
              required
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
              placeholder="Brief summary of the event"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase">Description</label>
            <textarea 
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all min-h-[120px] resize-none"
              placeholder="Detailed description of what occurred..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase">Category</label>
            <div className="grid grid-cols-3 gap-3">
              {(['Minor', 'Major', 'Critical'] as const).map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`py-2 text-xs font-bold rounded-lg border-2 transition-all ${
                    category === cat 
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700' 
                      : 'border-gray-100 bg-gray-50 text-gray-400 hover:border-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {isLoading ? 'Processing...' : 'Register Deviation'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
