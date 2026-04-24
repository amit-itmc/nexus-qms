import React, { useState } from 'react';
import { 
  X, 
  Lightbulb, 
  GitBranch, 
  HelpCircle, 
  ChevronRight, 
  CheckCircle2,
  BrainCircuit,
  MessageSquare,
  Wand2,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Deviation } from '../types';
import { geminiService } from '../services/geminiService';
import { cn } from '../lib/utils';

interface RCAModalProps {
  deviation: Deviation;
  onClose: () => void;
  onSave: (rcaData: any, rootCause: string) => void;
}

export default function RCAModal({ deviation, onClose, onSave }: RCAModalProps) {
  const [activeTab, setActiveTab] = useState<'5whys' | 'fishbone'>('5whys');
  const [fiveWhys, setFiveWhys] = useState<{why: string, answer: string}[]>(
    deviation.rcaData?.type === '5whys' ? deviation.rcaData.data : 
    [
      { why: 'Why did the deviation occur?', answer: '' },
      { why: 'Why did that happen?', answer: '' },
      { why: 'Why was that the case?', answer: '' },
      { why: 'Why did this system/process fail?', answer: '' },
      { why: 'Why was the root cause allowed to exist?', answer: '' },
    ]
  );
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<{cause: string, investigationStep: string}[]>([]);

  const handleGetAiSuggestions = async () => {
    setIsAiLoading(true);
    try {
      const res = await geminiService.suggestRCA(deviation.title, deviation.description);
      setSuggestions(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleAi5Whys = async () => {
    setIsAiLoading(true);
    try {
      const res = await geminiService.generate5Whys(deviation.title, deviation.description);
      setFiveWhys(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleSave = () => {
    const rootCause = activeTab === '5whys' ? fiveWhys[fiveWhys.length - 1].answer : 'Fishbone Analysis';
    onSave({ type: activeTab, data: activeTab === '5whys' ? fiveWhys : {} }, rootCause);
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
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative bg-white w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
              <BrainCircuit size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Root Cause Analysis</h3>
              <p className="text-sm text-gray-500 font-medium">Deviation: {deviation.title}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={24} className="text-gray-400" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 lg:px-12 flex flex-col lg:flex-row gap-12">
          {/* Main Content */}
          <div className="flex-1 space-y-8">
            <div className="flex bg-gray-100 p-1 rounded-xl w-fit">
              <button 
                onClick={() => setActiveTab('5whys')}
                className={cn(
                  "px-6 py-2 rounded-lg text-sm font-bold transition-all",
                  activeTab === '5whys' ? "bg-white text-indigo-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
                )}
              >
                5 Whys Template
              </button>
              <button 
                onClick={() => setActiveTab('fishbone')}
                className={cn(
                  "px-6 py-2 rounded-lg text-sm font-bold transition-all",
                  activeTab === 'fishbone' ? "bg-white text-indigo-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
                )}
              >
                Fishbone (Ishikawa)
              </button>
            </div>

            {activeTab === '5whys' ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-gray-900 flex items-center gap-2">
                    5 Whys Methodology
                    <HelpCircle size={16} className="text-gray-300" />
                  </h4>
                  <button 
                    onClick={handleAi5Whys}
                    disabled={isAiLoading}
                    className="text-xs font-bold text-indigo-600 flex items-center gap-1.5 hover:text-indigo-700 transition-colors bg-indigo-50 px-3 py-1.5 rounded-lg disabled:opacity-50"
                  >
                    {isAiLoading ? <Loader2 size={14} className="animate-spin" /> : <Wand2 size={14} />}
                    Auto-Fill (AI)
                  </button>
                </div>
                {fiveWhys.map((item, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full border-2 border-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-600 bg-white">
                        {index + 1}
                      </div>
                      {index < fourWhys.length && <div className="w-0.5 flex-1 bg-indigo-50 my-1"></div>}
                    </div>
                    <div className="flex-1 pb-4">
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{item.why}</label>
                      <textarea 
                        className="w-full bg-gray-50 border-none rounded-xl p-4 text-sm focus:ring-2 focus:ring-indigo-500/20 transition-all resize-none"
                        placeholder="Enter answer..."
                        rows={2}
                        value={item.answer}
                        onChange={(e) => {
                          const newWhys = [...fiveWhys];
                          newWhys[index].answer = e.target.value;
                          setFiveWhys(newWhys);
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                 <GitBranch size={48} className="mx-auto text-gray-200 mb-4" />
                 <h4 className="font-bold text-gray-900">Fishbone Template Coming Soon</h4>
                 <p className="text-xs text-gray-500 mt-2 max-w-xs mx-auto">Visualize impact categories: Personnel, Equipment, Material, Methods, Environment, and Management.</p>
              </div>
            )}
          </div>

          {/* AI Panel */}
          <aside className="lg:w-80 space-y-6">
            <div className="bg-indigo-600 p-6 rounded-3xl text-white shadow-xl shadow-indigo-100">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h4 className="text-lg font-bold">Investigation Copilot</h4>
                  <p className="text-xs text-indigo-100/70 font-medium">Powered by Gemini AI</p>
                </div>
                <Wand2 size={24} className="text-indigo-200" />
              </div>
              
              <button 
                onClick={handleGetAiSuggestions}
                disabled={isAiLoading}
                className="w-full flex items-center justify-center gap-2 py-3 bg-white text-indigo-600 rounded-xl font-bold text-sm hover:bg-gray-50 transition-all active:scale-[0.98] disabled:opacity-50"
              >
                {isAiLoading ? <Loader2 size={18} className="animate-spin" /> : <Lightbulb size={18} />}
                Suggest Root Causes
              </button>
            </div>

            <AnimatePresence mode="wait">
              {suggestions.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-4"
                >
                  <h5 className="text-xs font-bold text-gray-400 uppercase tracking-widest px-2">Smart Suggestions</h5>
                  {suggestions.map((s, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="p-4 bg-white border border-gray-100 rounded-2xl space-y-2 hover:border-indigo-200 transition-colors cursor-pointer group"
                      onClick={() => {
                        // Actionable suggestion use
                        if (activeTab === '5whys') {
                          const newWhys = [...fiveWhys];
                          newWhys[0].answer = s.cause;
                          setFiveWhys(newWhys);
                        }
                      }}
                    >
                      <p className="text-xs font-bold text-gray-900 group-hover:text-indigo-600">{s.cause}</p>
                      <div className="flex gap-2">
                        <ChevronRight size={14} className="text-indigo-400 mt-0.5 shrink-0" />
                        <p className="text-[10px] text-gray-500 font-medium leading-relaxed">{s.investigationStep}</p>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </aside>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3 sticky bottom-0 z-10">
          <button 
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-100 transition-all"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            className="px-8 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 shadow-sm shadow-indigo-100 active:scale-95 transition-all flex items-center gap-2"
          >
            <CheckCircle2 size={18} />
            Save Analysis
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// Helper for index check logic in 5 whys line
const fourWhys = [0, 1, 2, 3];
