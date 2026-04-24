import React, { useEffect, useState } from 'react';
import { Plus, Search, Filter, MoreHorizontal, AlertCircle, FileText, User, BrainCircuit, Sparkles } from 'lucide-react';
import { qmsService } from '../services/qmsService';
import { Deviation } from '../types';
import { cn } from '../lib/utils';
import { format } from 'date-fns';
import RCAModal from '../components/RCAModal';
import RcaAssistModal from '../components/RcaAssistModal';
import LogDeviationModal from '../components/LogDeviationModal';
import { AnimatePresence } from 'motion/react';

export default function Deviations() {
  const [deviations, setDeviations] = useState<Deviation[]>([]);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [isAssistModalOpen, setIsAssistModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDeviation, setSelectedDeviation] = useState<Deviation | null>(null);

  useEffect(() => {
    const unsub = qmsService.subscribeToDeviations(setDeviations);
    return () => unsub();
  }, []);

  const handleSaveRCA = async (rcaData: any, rootCause: string) => {
    if (selectedDeviation) {
      await qmsService.updateDeviation(selectedDeviation.id, {
        rcaData,
        rootCause,
        status: 'Investigation'
      });
      setSelectedDeviation(null);
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Critical': return 'bg-red-100 text-red-700 border-red-200';
      case 'Major': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Minor': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusColor = (status: string | undefined) => {
    switch (status) {
      case 'Closed': return 'bg-emerald-100 text-emerald-700';
      case 'QA Review': return 'bg-purple-100 text-purple-700';
      case 'Investigation': return 'bg-indigo-100 text-indigo-700';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const filteredDeviations = deviations.filter(d => 
    d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Deviation Management</h2>
          <p className="text-gray-500 text-sm font-medium">Track and investigate unplanned events.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setIsAssistModalOpen(true)}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-xl font-bold hover:bg-indigo-100 transition-all active:scale-95 group"
          >
            <Sparkles size={18} className="group-hover:rotate-12 transition-transform" />
            AI RCA Assist
          </button>
          <button 
            onClick={() => setIsLogModalOpen(true)}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 active:scale-95"
          >
            <Plus size={20} />
            Log Deviation
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-50 bg-gray-50/50 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by ID or title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-white transition-all">
            <Filter size={16} />
            Filters
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">ID & Title</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredDeviations.length > 0 ? filteredDeviations.map((d) => (
                <tr key={d.id} className="hover:bg-gray-50/50 transition-colors cursor-pointer group">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-xs font-black text-indigo-600 mb-0.5">DEV-{d.id.slice(0, 8).toUpperCase()}</span>
                      <span className="text-sm font-bold text-gray-900 line-clamp-1">{d.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn("px-2.5 py-0.5 rounded-full text-[11px] font-bold border", getCategoryColor(d.category))}>
                      {d.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                       <div className={cn("w-1.5 h-1.5 rounded-full", getStatusColor(d.status).split(' ')[0].replace('bg-', 'bg-').replace('100', '500') === 'bg-gray-500' ? 'bg-gray-400' : 'bg-current')}></div>
                       <span className="text-xs font-bold text-gray-700">{d.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                       <button 
                         onClick={(e) => {
                           e.stopPropagation();
                           setSelectedDeviation(d);
                         }}
                         className="p-2 text-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all flex items-center gap-1.5 text-xs font-bold"
                         title="Perform RCA"
                       >
                         <BrainCircuit size={16} />
                         RCA
                       </button>
                       <button className="p-2 text-gray-400 hover:text-gray-900 opacity-0 group-hover:opacity-100 transition-all">
                        <MoreHorizontal size={18} />
                       </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    <AlertCircle className="mx-auto mb-2 opacity-20" size={48} />
                    <p className="font-medium">No deviations found</p>
                    <p className="text-xs mt-1">Log a new deviation to get started.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {isLogModalOpen && <LogDeviationModal onClose={() => setIsLogModalOpen(false)} />}
        {isAssistModalOpen && <RcaAssistModal deviations={deviations} onClose={() => setIsAssistModalOpen(false)} />}
        {selectedDeviation && (
          <RCAModal 
            deviation={selectedDeviation} 
            onClose={() => setSelectedDeviation(null)}
            onSave={handleSaveRCA}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
