import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Users, Clock, CheckCircle, XCircle } from 'lucide-react';

export function Dashboard() {
    const [stats, setStats] = useState({
        total: 0,
        new: 0,
        contacted: 0,
        qualified: 0,
        closed: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const { data, error } = await supabase
                .from('leads')
                .select('status');

            if (error) throw error;

            const newStats = data.reduce((acc: any, curr: any) => {
                acc.total++;
                acc[curr.status] = (acc[curr.status] || 0) + 1;
                return acc;
            }, { total: 0, new: 0, contacted: 0, qualified: 0, closed: 0 });

            setStats(newStats);
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const StatCard = ({ title, value, icon: Icon, color }: any) => (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
                    <h3 className="text-3xl font-bold text-slate-900">{value}</h3>
                </div>
                <div className={`p-3 rounded-xl ${color}`}>
                    <Icon size={24} className="text-white" />
                </div>
            </div>
        </div>
    );

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-slate-900">Dashboard</h2>
                <p className="text-slate-500">Visão geral dos seus leads e performance.</p>
            </div>

            {loading ? (
                <div className="text-center py-12">Carregando dados...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        title="Total de Leads"
                        value={stats.total}
                        icon={Users}
                        color="bg-slate-900"
                    />
                    <StatCard
                        title="Novos (Não Tratados)"
                        value={stats.new || 0}
                        icon={Clock}
                        color="bg-blue-500"
                    />
                    <StatCard
                        title="Em Negociação"
                        value={(stats.contacted || 0) + (stats.qualified || 0)}
                        icon={CheckCircle}
                        color="bg-orange-500"
                    />
                    <StatCard
                        title="Fechados"
                        value={stats.closed || 0}
                        icon={Users}
                        color="bg-green-500"
                    />
                </div>
            )}
        </div>
    );
}
