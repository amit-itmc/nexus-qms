import React, { useEffect, useState } from 'react';
import { Plus, Search, Filter, MoreHorizontal, RefreshCw, AlertCircle, User } from 'lucide-react';
import { qmsService } from '../services/qmsService';
import { ChangeControl } from '../types';
import { cn } from '../lib/utils';
import { format } from 'date-fns';

export default function ChangeControls() {
  const [items, setItems] = useState<ChangeControl[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const unsub = qmsService.subscribeToChangeControls(setItems);
    return () => unsub();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Closed': return 'bg-emerald-100 text-emerald-700';
      case 'Approved': return 'bg-blue-100 text-blue-700';
      case 'In Review': return 'bg-purple-100 text-purple-700';
      case 'Impact Assessment': return 'bg-amber-100 text-amber-700';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const filtered = items.filter(d => 
    d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Change Control</h2>
          <p className="text-gray-500 text-sm font-medium">Manage and approve planned changes.</p>
        </div>
        <button 
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-all shadow-sm active:scale-95"
        >
          <Plus size={20} />
          Initiate Change
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-50 bg-gray-50/50 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search changes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">ID & Title</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Date Created</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length > 0 ? filtered.map((d) => (
                <tr key={d.id} className="hover:bg-gray-50/50 transition-colors cursor-pointer group">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-indigo-600 mb-0.5">CC-{d.id.slice(0, 8).toUpperCase()}</span>
                      <span className="text-sm font-bold text-gray-900 line-clamp-1">{d.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-medium text-gray-600">{d.type}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn("px-2.5 py-0.5 rounded-full text-[11px] font-bold", getStatusColor(d.status))}>
                      {d.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-medium text-gray-500">
                      {d.createdAt?.toDate ? format(d.createdAt.toDate(), 'MMM dd, yyyy') : 'N/A'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-gray-400 hover:text-gray-900 opacity-0 group-hover:opacity-100 transition-all">
                      <MoreHorizontal size={18} />
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    <RefreshCw className="mx-auto mb-2 opacity-20" size={48} />
                    <p className="font-medium">No change controls found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
