import React, { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { KanbanColumn } from './KanbanColumn';
import { KanbanCard } from './KanbanCard';

const COLUMNS = [
  { id: 'new', title: 'Novos' },
  { id: 'contacted', title: 'Contatados' },
  { id: 'qualified', title: 'Qualificados' },
  { id: 'closed', title: 'Fechados (Ganho)' },
  { id: 'lost', title: 'Perdidos' }
];

interface KanbanBoardProps {
  leads: any[];
  onStatusChange: (leadId: string, newStatus: string) => Promise<void>;
}

export function KanbanBoard({ leads, onStatusChange }: KanbanBoardProps) {
  const [activeLead, setActiveLead] = useState<any | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const lead = active.data.current?.lead;
    if (lead) {
      setActiveLead(lead);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveLead(null);

    if (!over) return;

    const leadId = String(active.id);
    let newStatus = '';

    // If dropped over a column
    if (over.data.current?.type === 'Column') {
      newStatus = over.id as string;
    } 
    // If dropped over another card
    else if (over.data.current?.type === 'Card') {
      const targetLeadId = over.id;
      const targetLead = leads.find(l => l.id === targetLeadId);
      if (targetLead) {
        newStatus = targetLead.status;
      }
    }

    const currentLead = leads.find(l => l.id === leadId);
    
    if (newStatus && currentLead && currentLead.status !== newStatus) {
      // Optimistic update should be handled by the parent
      await onStatusChange(leadId, newStatus);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-6 overflow-x-auto pb-4 h-[calc(100vh-280px)] min-h-[500px]">
        {COLUMNS.map((col) => {
          const columnLeads = leads.filter(l => (l.status || 'new') === col.id);
          return (
            <KanbanColumn
              key={col.id}
              id={col.id}
              title={col.title}
              leads={columnLeads}
            />
          );
        })}
      </div>

      <DragOverlay>
        {activeLead ? <KanbanCard lead={activeLead} /> : null}
      </DragOverlay>
    </DndContext>
  );
}
