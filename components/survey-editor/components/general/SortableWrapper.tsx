'use client';

import React, { useEffect } from 'react';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, MeasuringStrategy, MouseSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import { createPortal } from 'react-dom';


interface SortableWrapperProps {
    sortableID: string;
    items: Array<{
        id: string;
    }>;
    children: React.ReactNode;
    dragOverlayItem: React.ReactNode | null;
    onDraggedIdChange: (id: string | null) => void;
    onReorder: (activeIndex: number, overIndex: number) => void;
}

const activationConstraint = {
    distance: 5,
};


const SortableWrapper: React.FC<SortableWrapperProps> = ({
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

export default SortableWrapper;
