import React, { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { Search, Filter, Phone, Mail, Building, Calendar, ChevronDown, ChevronUp, LayoutGrid, List } from 'lucide-react';
import { KanbanBoard } from '../../components/Admin/Kanban/KanbanBoard';

export function LeadsList() {
    const [leads, setLeads] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [expandedLead, setExpandedLead] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<'board' | 'list'>('board');

    useEffect(() => {
        fetchLeads();
    }, []);

    const fetchLeads = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;
            const data = await api.getLeads(token);
            setLeads(data || []);
        } catch (error) {
            console.error('Error fetching leads:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredLeads = leads.filter(lead => {
        const matchesSearch =
            lead.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            lead.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            lead.company?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const toggleExpand = (id: string) => {
        setExpandedLead(expandedLead === id ? null : id);
    };

    const updateStatus = async (id: string, newStatus: string) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;
            await api.updateLeadStatus(id, newStatus, token);

            // Optimistic update
            setLeads(leads.map(lead =>
                lead.id === id ? { ...lead, status: newStatus } : lead
            ));
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Erro ao atualizar status');
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'new': return 'bg-blue-100 text-blue-800';
            case 'contacted': return 'bg-yellow-100 text-yellow-800';
            case 'qualified': return 'bg-orange-100 text-orange-800';
            case 'closed': return 'bg-green-100 text-green-800';
            case 'lost': return 'bg-red-100 text-red-800';
            default: return 'bg-slate-100 text-slate-800';
        }
    };

    const getStatusLabel = (status: string) => {
        const labels: any = {
            new: 'Novo',
            contacted: 'Contatado',
            qualified: 'Qualificado',
            closed: 'Fechado',
            lost: 'Perdido',
            all: 'Todos'
        };
        return labels[status] || status;
    };


    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Gerenciar Leads</h2>
                    <p className="text-slate-500">{filteredLeads.length} leads encontrados</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder="Buscar por nome, email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 w-full sm:w-64"
                        />
                    </div>

                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="pl-10 pr-8 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 appearance-none bg-white w-full sm:w-auto"
                        >
                            <option value="all">Todos os Status</option>
                            <option value="new">Novos</option>
                            <option value="contacted">Contatados</option>
                            <option value="qualified">Qualificados</option>
                            <option value="closed">Fechados</option>
                            <option value="lost">Perdidos</option>
                        </select>
                    </div>

                    <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
                        <button
                            onClick={() => setViewMode('board')}
                            className={`p-1.5 rounded-md transition-all ${viewMode === 'board' ? 'bg-white shadow-sm text-orange-600' : 'text-slate-500 hover:text-slate-700'}`}
                            title="Visualização em Board"
                        >
                            <LayoutGrid size={18} />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-orange-600' : 'text-slate-500 hover:text-slate-700'}`}
                            title="Visualização em Lista"
                        >
                            <List size={18} />
                        </button>
                    </div>
                </div>
            </div>

            {viewMode === 'board' ? (
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 overflow-hidden">
                    {loading ? (
                        <div className="p-12 text-center text-slate-500">Carregando leads no board...</div>
                    ) : filteredLeads.length === 0 ? (
                        <div className="p-12 text-center text-slate-500">Nenhum lead encontrado para este filtro.</div>
                    ) : (
                        <KanbanBoard leads={filteredLeads} onStatusChange={updateStatus} />
                    )}
                </div>
            ) : (
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    {loading ? (
                        <div className="p-12 text-center text-slate-500">Carregando leads...</div>
                    ) : filteredLeads.length === 0 ? (
                        <div className="p-12 text-center text-slate-500">Nenhum lead encontrado.</div>
                    ) : (
                        <div className="divide-y divide-slate-100">
                            {filteredLeads.map((lead) => (
                            <div key={lead.id} className="hover:bg-slate-50 transition-colors">
                                <div
                                    className="p-6 cursor-pointer"
                                    onClick={() => toggleExpand(lead.id)}
                                >
                                    <div className="flex flex-col md:flex-row justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="font-bold text-slate-900">{lead.name || 'Sem nome'}</h3>
                                                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${getStatusColor(lead.status)}`}>
                                                    {getStatusLabel(lead.status)}
                                                </span>
                                            </div>
                                            <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                                                {lead.email && (
                                                    <div className="flex items-center gap-1.5">
                                                        <Mail size={16} />
                                                        {lead.email}
                                                    </div>
                                                )}
                                                {lead.phone && (
                                                    <div className="flex items-center gap-1.5">
                                                        <Phone size={16} />
                                                        {lead.phone}
                                                    </div>
                                                )}
                                                {lead.company && (
                                                    <div className="flex items-center gap-1.5">
                                                        <Building size={16} />
                                                        {lead.company}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 text-sm text-slate-500">
                                            <div className="flex items-center gap-1.5">
                                                <Calendar size={16} />
                                                {new Date(lead.created_at).toLocaleDateString('pt-BR')}
                                            </div>
                                            {expandedLead === lead.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                        </div>
                                    </div>
                                </div>

                                {expandedLead === lead.id && (
                                    <div className="px-6 pb-6 bg-slate-50 border-t border-slate-100">
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
                                            <div>
                                                <h4 className="font-bold text-slate-900 mb-4">Atualizar Status</h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {['new', 'contacted', 'qualified', 'closed', 'lost'].map((status) => (
                                                        <button
                                                            key={status}
                                                            onClick={() => updateStatus(lead.id, status)}
                                                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${lead.status === status
                                                                    ? 'bg-slate-900 text-white'
                                                                    : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
                                                                }`}
                                                        >
                                                            {getStatusLabel(status)}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            <div>
                                                <h4 className="font-bold text-slate-900 mb-4">Dados do Quiz</h4>
                                                <div className="bg-white p-4 rounded-lg border border-slate-200 text-sm space-y-2">
                                                    {lead.quiz_results ? (
                                                        Object.entries(lead.quiz_results).map(([key, value]: any) => (
                                                            <div key={key} className="grid grid-cols-3 gap-2">
                                                                <span className="font-medium text-slate-500 col-span-1">{key}:</span>
                                                                <span className="text-slate-900 col-span-2">{String(value)}</span>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <p className="text-slate-500 italic">Nenhum dado de quiz disponível.</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
