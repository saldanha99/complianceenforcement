import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Phone, Mail, Building, Clock } from 'lucide-react';

interface KanbanCardProps {
  lead: any;
}

export function KanbanCard({ lead }: KanbanCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: lead.id,
    data: {
      type: 'Card',
      lead,
    },
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="opacity-30 bg-slate-50 border-2 border-dashed border-slate-300 rounded-lg h-[140px] w-full"
      />
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 cursor-grab hover:shadow-md hover:border-orange-300 transition-all active:cursor-grabbing group relative select-none"
    >
      <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 text-slate-400 transition-opacity">
        <div className="w-1 h-1 rounded-full bg-slate-400" />
        <div className="w-1 h-1 rounded-full bg-slate-400" />
        <div className="w-1 h-1 rounded-full bg-slate-400" />
      </div>

      <h4 className="font-bold text-slate-800 text-sm mb-1 truncate pr-6">
        {lead.name || 'Sem nome'}
      </h4>

      {lead.company && (
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-2 truncate">
          <Building size={12} />
          <span className="truncate">{lead.company}</span>
        </div>
      )}

      <div className="flex flex-col gap-1.5 mt-3">
        {lead.phone && (
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <Phone size={12} className="text-slate-400" />
            <span className="truncate">{lead.phone}</span>
          </div>
        )}
        
        {lead.email && !lead.email.includes('sem-email') && (
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <Mail size={12} className="text-slate-400" />
            <span className="truncate">{lead.email}</span>
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center">
        <div className="flex items-center gap-1 text-[10px] text-slate-400 font-medium">
          <Clock size={10} />
          {new Date(lead.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
        </div>
        
        {lead.quiz_results && Object.keys(lead.quiz_results).length > 0 && (
          <span className="bg-orange-50 text-orange-600 text-[10px] font-bold px-2 py-0.5 rounded">
            Quiz
          </span>
        )}
      </div>
    </div>
  );
}
