import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { KanbanCard } from './KanbanCard';

interface KanbanColumnProps {
  id: string;
  title: string;
  leads: any[];
}

export function KanbanColumn({ id, title, leads }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: String(id),
    data: {
      type: 'Column',
      columnId: String(id),
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'contacted': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'qualified': return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'closed': return 'bg-green-50 text-green-700 border-green-200';
      case 'lost': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="flex flex-col w-[350px] min-w-[350px] shrink-0 bg-slate-100 rounded-xl max-h-full border border-slate-200">
      <div className={`p-4 rounded-t-xl border-b flex items-center justify-between ${getStatusColor(id)}`}>
        <h3 className="font-bold">{title}</h3>
        <span className="bg-white/60 text-current px-2 py-0.5 rounded-full text-xs font-bold shadow-sm">
          {leads.length}
        </span>
      </div>

      <div
        ref={setNodeRef}
        className={`flex-1 overflow-y-auto p-3 flex flex-col gap-3 transition-colors ${
          isOver ? 'bg-slate-200/50' : ''
        }`}
      >
        <SortableContext items={leads.map(l => l.id)} strategy={verticalListSortingStrategy}>
          {leads.map((lead) => (
            <KanbanCard key={lead.id} lead={lead} />
          ))}
        </SortableContext>
        
        {leads.length === 0 && (
          <div className="h-full flex items-center justify-center border-2 border-dashed border-slate-300 rounded-lg py-12 text-slate-400 text-sm">
            Arraste leads para cá
          </div>
        )}
      </div>
    </div>
  );
}
