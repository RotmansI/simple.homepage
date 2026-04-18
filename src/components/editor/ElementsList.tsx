"use client";

import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { 
  ChevronRight, Trash2, GripVertical, Type as TypeIcon, 
  FileText, MousePointer, ImageIcon, Minus 
} from 'lucide-react';

// פונקציית עזר לאייקונים - מוגדרת כאן מקומית כדי למנוע שגיאות Build
const getElementIcon = (type: string, size = 12) => {
  switch (type) {
    case 'heading':   return <TypeIcon size={size} />;
    case 'paragraph': return <FileText size={size} />;
    case 'button':    return <MousePointer size={size} />;
    case 'image':     return <ImageIcon size={size} />;
    case 'spacer':    return <Minus size={size} />;
    default:          return <Minus size={size} />;
  }
};

// תיקון עבור Next.js Strict Mode
const StrictModeDroppable = ({ children, ...props }: any) => {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    const animation = requestAnimationFrame(() => setEnabled(true));
    return () => {
      cancelAnimationFrame(animation);
      setEnabled(false);
    };
  }, []);
  if (!enabled) return null;
  return <Droppable {...props}>{children}</Droppable>;
};

interface ElementsListProps {
  elements: any[];
  selectedId: string;
  selectedFlexElementId: string | null;
  setSelectedFlexElementId: (id: string | null) => void;
  updateSectionContent: (id: string, content: any) => void;
}

export const ElementsList = ({ 
  elements, selectedId, selectedFlexElementId, setSelectedFlexElementId, updateSectionContent 
}: ElementsListProps) => {

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(elements);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    updateSectionContent(selectedId, { elements: items });
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <StrictModeDroppable droppableId="elements">
        {(provided: any) => (
          <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
            {elements.map((el, idx) => {
              const isSelected = selectedFlexElementId === el.id;
              return (
                <Draggable key={el.id} draggableId={el.id} index={idx}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`group p-3 bg-white rounded-xl border transition-all flex items-center justify-between shadow-sm 
                        ${isSelected ? 'border-brand-indigo ring-2 ring-brand-indigo/10' : 'border-brand-lavender hover:border-brand-indigo/50'} 
                        ${snapshot.isDragging ? 'shadow-xl scale-[1.02] border-brand-indigo z-50 bg-white' : ''}`}
                    >
                      <div className="flex items-center gap-3 overflow-hidden text-start">
                        {/* ידית גרירה */}
                        <div {...provided.dragHandleProps} className="text-brand-slate/30 hover:text-brand-indigo cursor-grab active:cursor-grabbing p-1">
                          <GripVertical size={14} />
                        </div>
                        
                        <div className="w-6 h-6 bg-brand-pearl rounded flex items-center justify-center text-brand-indigo flex-shrink-0">
                          {getElementIcon(el.type, 10)}
                        </div>
                        
                        <div className="flex flex-col text-start overflow-hidden">
                          <span className="text-[10px] font-black uppercase text-brand-midnight leading-none mb-0.5">{el.type}</span>
                          {el.text && <span className="text-[8px] opacity-40 truncate max-w-[100px] italic leading-tight">"{el.text}"</span>}
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <button 
                          onClick={() => setSelectedFlexElementId(el.id)} 
                          className={`p-1.5 rounded-md transition-all ${isSelected ? 'bg-brand-indigo text-white' : 'text-brand-indigo hover:bg-brand-indigo/10'}`}
                        >
                          <ChevronRight size={14} className={isSelected ? 'rotate-90' : ''}/>
                        </button>
                        <button 
                          onClick={() => updateSectionContent(selectedId, { elements: elements.filter((item: any) => item.id !== el.id) })} 
                          className="p-1.5 text-brand-coral hover:bg-brand-coral/10 rounded-md transition-all"
                        >
                          <Trash2 size={14}/>
                        </button>
                      </div>
                    </div>
                  )}
                </Draggable>
              );
            })}
            {provided.placeholder}
          </div>
        )}
      </StrictModeDroppable>
    </DragDropContext>
  );
};