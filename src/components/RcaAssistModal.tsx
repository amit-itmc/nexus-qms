import React, { useState } from 'react';
import { X, Search, BrainCircuit, Wand2, Loader2, Sparkles, AlertCircle, ChevronRight, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Deviation } from '../types';
import { geminiService } from '../services/geminiService';
import { cn } from '../lib/utils';

interface RcaAssistModalProps {
  deviations: Deviation[];
  onClose: () => void;
}

export default function RcaAssistModal({ deviations, onClose }: RcaAssistModalProps) {
  const [selectedDevId, setSelectedDevId] = useState<string>('');
  const [customTitle, setCustomTitle] = useState('');
  const [customDesc, setCustomDesc] = useState('');
  const [suggestions, setSuggestions] = useState<{cause: string, investigationStep: string}[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const selectedDev = deviations.find(d => d.id === selectedDevId);
  const title = selectedDev ? selectedDev.title : customTitle;
  const desc = selectedDev ? selectedDev.description : customDesc;

  const handleSuggest = async () => {
    if (!title || !desc) return;
    setIsLoading(true);
    try {
      const res = await geminiService.suggestRCA(title, desc);
      setSuggestions(res);
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
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
        onClick={onClose}
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 30 }}
        className="relative bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col border border-white/20"
      >
        <div className="p-8 pb-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
              <BrainCircuit size={28} />
            </div>
            <div>
              <h3 className="text-2xl font-black text-gray-900 tracking-tight">AI RCA Assist</h3>
              <p className="text-sm text-gray-500 font-bold uppercase tracking-widest">Smart Investigation</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={24} className="text-gray-400" />
          </button>
        </div>

        <div className="p-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">Select Event to Analyze</label>
              <select 
                value={selectedDevId}
                onChange={(e) => setSelectedDevId(e.target.value)}
                className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-4 py-3 text-sm font-medium focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none appearance-none"
              >
                <option value="">-- Select a Deviation --</option>
                {deviations.map(d => (
                  <option key={d.id} value={d.id}>{d.title}</option>
                ))}
                <option value="custom">Manual Entry...</option>
              </select>
            </div>

            {selectedDevId === 'custom' && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                className="space-y-4 overflow-hidden"
              >
                <input 
                  type="text" 
                  placeholder="Deviation Title"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-4 py-3 text-sm font-medium focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none"
                />
                <textarea 
                  placeholder="Describe the event details..."
                  value={customDesc}
                  onChange={(e) => setCustomDesc(e.target.value)}
                  className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-4 py-3 text-sm font-medium focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none min-h-[100px] resize-none"
                />
              </motion.div>
            )}

            <button 
              onClick={handleSuggest}
              disabled={isLoading || (!selectedDevId && (!customTitle || !customDesc))}
              className="w-full flex items-center justify-center gap-3 py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm hover:bg-indigo-700 shadow-xl shadow-indigo-100 active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale"
            >
              {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Sparkles size={20} />}
              Generate AI Insights
            </button>
          </div>

          <AnimatePresence mode="wait">
            {suggestions.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4 border-t border-gray-100 pt-6"
              >
                <div className="flex items-center gap-2 px-1">
                  <Wand2 size={16} className="text-indigo-500" />
                  <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">Investigation Suggestions</h4>
                </div>
                <div className="grid gap-3">
                  {suggestions.map((s, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="p-5 bg-gradient-to-br from-indigo-50/50 to-white border border-indigo-100/50 rounded-3xl group hover:border-indigo-300 transition-all"
                    >
                      <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 shrink-0 group-hover:scale-110 transition-transform">
                          <Check size={16} className="font-bold" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900 group-hover:text-indigo-700 transition-colors">{s.cause}</p>
                          <div className="flex gap-2 items-start mt-2">
                            <ChevronRight size={14} className="text-indigo-400 mt-0.5 shrink-0" />
                            <p className="text-xs text-gray-500 font-medium leading-relaxed">{s.investigationStep}</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
            {!isLoading && suggestions.length === 0 && (
              <div className="py-12 text-center">
                 <AlertCircle size={40} className="mx-auto text-gray-100 mb-3" />
                 <p className="text-sm font-bold text-gray-300 uppercase tracking-widest">Awaiting Input</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
