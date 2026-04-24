import React, { useEffect, useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { qmsService } from '../services/qmsService';
import { Deviation, ChangeControl, CAPA } from '../types';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

interface StatCardProps {
  title: string;
  value: number;
  icon: any;
  color: string;
  trend?: string;
  trendUp?: boolean;
}

function StatCard({ title, value, icon: Icon, color, trend, trendUp }: StatCardProps) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className={cn("p-3 rounded-xl", color)}>
          <Icon className="text-white" size={24} />
        </div>
        {trend && (
          <div className={cn(
            "flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full",
            trendUp ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
          )}>
            {trend}
            {trendUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          </div>
        )}
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
      </div>
    </div>
  );
}

import { cn } from '../lib/utils';
import { useAuth } from '../hooks/useAuth';
import { Database, Loader2 } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const [deviations, setDeviations] = useState<Deviation[]>([]);
  const [capas, setCapas] = useState<CAPA[]>([]);
  const [isSeeding, setIsSeeding] = useState(false);

  useEffect(() => {
    const unsubDev = qmsService.subscribeToDeviations(setDeviations);
    const unsubCapa = qmsService.subscribeToCAPAs(setCapas);
    return () => {
      unsubDev();
      unsubCapa();
    };
  }, []);

  const handleSeedData = async () => {
    if (!user) return;
    setIsSeeding(true);
    try {
      await qmsService.seedData(user.uid);
      alert('System populated with audit-ready dummy data.');
    } catch (err) {
      console.error(err);
      alert('Failed to seed data.');
    } finally {
      setIsSeeding(false);
    }
  };

  const openDeviations = deviations.filter(d => d.status !== 'Closed').length;
  const overdueCapas = capas.filter(c => c.status !== 'Closed' && c.dueDate?.toDate() < new Date()).length;
  const closedMonthly = 12; // Mock for now

  const statusData = [
    { name: 'Open', value: deviations.filter(d => d.status === 'Open').length },
    { name: 'Investigation', value: deviations.filter(d => d.status === 'Investigation').length },
    { name: 'QA Review', value: deviations.filter(d => d.status === 'QA Review').length },
    { name: 'Closed', value: deviations.filter(d => d.status === 'Closed').length },
  ].filter(d => d.value > 0);

  const trendData = [
    { name: 'Jan', value: 4 },
    { name: 'Feb', value: 7 },
    { name: 'Mar', value: 5 },
    { name: 'Apr', value: 8 },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Executive Overview</h2>
          <p className="text-gray-500 mt-2 font-medium">Real-time performance analytics and compliance KPIs.</p>
        </div>
        <button 
          onClick={handleSeedData}
          disabled={isSeeding}
          className="flex items-center gap-2 px-5 py-2.5 bg-white border-2 border-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-50 hover:border-indigo-100 hover:text-indigo-600 transition-all active:scale-95 disabled:opacity-50"
        >
          {isSeeding ? <Loader2 size={18} className="animate-spin" /> : <Database size={18} />}
          Seed System Data
        </button>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Open Deviations" 
          value={openDeviations} 
          icon={AlertCircle} 
          color="bg-amber-500"
          trend="+12%"
          trendUp={false}
        />
        <StatCard 
          title="CAPA Compliance" 
          value={94} 
          icon={CheckCircle2} 
          color="bg-indigo-600"
          trend="+2.4%"
          trendUp={true}
        />
        <StatCard 
          title="Overdue Tasks" 
          value={overdueCapas} 
          icon={Clock} 
          color="bg-rose-500"
          trend="-4%"
          trendUp={true}
        />
        <StatCard 
          title="Avg. Closure Time" 
          value={4.2} 
          icon={TrendingUp} 
          color="bg-emerald-500"
          trend="Days"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h4 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            Deviation Status Distribution
          </h4>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData.length > 0 ? statusData : [{ name: 'No Data', value: 1 }]}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '12px', 
                    border: 'none', 
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' 
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            {statusData.map((item, index) => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                <span className="text-sm font-medium text-gray-600">{item.name}</span>
                <span className="text-sm font-bold text-gray-900 ml-auto">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h4 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            Monthly Quality Trends
          </h4>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#6B7280', fontSize: 12 }} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#6B7280', fontSize: 12 }} 
                />
                <Tooltip 
                  cursor={{ fill: '#F3F4F6' }}
                  contentStyle={{ 
                    borderRadius: '12px', 
                    border: 'none', 
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' 
                  }} 
                />
                <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
