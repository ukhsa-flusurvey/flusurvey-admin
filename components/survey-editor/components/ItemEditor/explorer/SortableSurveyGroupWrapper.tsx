'use client';

import React, { useEffect } from 'react';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, KeyboardSensor, MeasuringStrategy, MouseSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import { createPortal } from 'react-dom';
import { LucideIcon } from 'lucide-react';

interface SortableSurveyGroupWrapperProps {
    sortableID: string;

    items: Array<{
        id: string;
        icon: LucideIcon;
        isActive: boolean;
        className?: string;
    }>;
    children: React.ReactNode;
    dragOverlayItem: React.ReactNode | null;
    onDraggedIdChange: (id: string | null) => void;
    onReorder: (activeIndex: number, overIndex: number) => void;
}

const activationConstraint = {
    distance: 5,
};


const SortableSurveyGroupWrapper: React.FC<SortableSurveyGroupWrapperProps> = ({
    onDraggedIdChange,
    ...props
}) => {
    const [draggedId, setDraggedId] = React.useState<string | null>(null);
    const draggedItem = draggedId ? props.items.find(item => item.id === draggedId) : null;

    const [isMounted, setIsMounted] = React.useState(false);
    useEffect(() => {
        setIsMounted(true);
    }, []);



    const sensors = useSensors(
        useSensor(TouchSensor, {
            activationConstraint
        }),
        useSensor(MouseSensor, {
            activationConstraint
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    useEffect(() => {
        onDraggedIdChange(draggedId);
    }, [draggedId, onDraggedIdChange]);

    const handleDragStart = (event: DragStartEvent) => {
        const id = event.active.id as string;
        if (id) {
            setDraggedId(id);
        }
    }


    const handleDragEnd = (event: DragEndEvent) => {
        setDraggedId(null);
        const { active, over } = event;
        if (!over) {
            return;
        }

        if (active.id !== over.id) {
            const activeIndex = active.data.current?.sortable.index;
            const overIndex = over.data.current?.sortable.index || 0;
            props.onReorder(activeIndex, overIndex);
        }
    }

    if (!isMounted) {
        return null;
    }

    return (

        <DndContext
            sensors={sensors}
            //collisionDetection={closestCenter}
            measuring={{
                droppable: {
                    strategy: MeasuringStrategy.Always,
                },
            }}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            id={`${props.sortableID}`}

        >
            <SortableContext
                id={props.sortableID}
                items={[...props.items]}
                strategy={verticalListSortingStrategy}
            >
                {props.children}
            </SortableContext>
            {createPortal(
                <DragOverlay wrapperElement='ul'>
                    {(draggedId && draggedItem) ?
                        props.dragOverlayItem
                        : null}
                </DragOverlay>, document.body)}
        </DndContext>
    );
};

export default SortableSurveyGroupWrapper;
