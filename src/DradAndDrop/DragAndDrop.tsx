import React, { useState } from 'react';
import './dnd.css';
import { v4 as uuid } from 'uuid';

interface box {
    id: string;
    level: number;
}

interface BoxProps {
    item: box;
    onDragStart: (e: React.DragEvent<HTMLDivElement>, item: box) => void;
    onDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
    onDragEnd: (e: React.DragEvent<HTMLDivElement>) => void;
    onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
    onDrop: (e: React.DragEvent<HTMLDivElement>, targetCard: box) => void;
}

const Box: React.FC<BoxProps> = ({ item, onDragStart, onDragLeave, onDragEnd, onDragOver, onDrop }) => {
    return (
        <div
            key={item.id}
            onDragStart={(e) => onDragStart(e, item)}
            onDrop={(e) => onDrop(e, item)}
            onDragOver={(e) => onDragOver(e)}
            onDragEnd={(e) => onDragEnd(e)}
            onDragLeave={(e) => onDragLeave(e)}
            draggable={true}
            className={"box"}
        >
            {item.level}
        </div>
    );
};

const DragAndDrop: React.FC = () => {
    const [draggable, setDraggable] = useState<box>({ id: '', level: 0 });
    const [cards, setCards] = useState<box[]>([
        { id: uuid(), level: 1 },
        { id: uuid(), level: 1 },
        { id: uuid(), level: 2 },
        { id: uuid(), level: 3 },
        { id: uuid(), level: 4 },
        { id: uuid(), level: 5 }
    ]);

    const dragStart = (e: React.DragEvent<HTMLDivElement>, item: box) => {
        e.dataTransfer.setData('cardId', item.id);
        setDraggable({id: item.id, level: item.level});
        e.currentTarget.style.backgroundColor = 'gray';
        e.currentTarget.style.opacity = '0';
    };

    const dragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.currentTarget.style.backgroundColor = 'lightblue';
        e.currentTarget.style.border = '3px solid #ffffff';
    };

    const dragEnd = (e: React.DragEvent<HTMLDivElement>) => {
        e.currentTarget.style.backgroundColor = 'lightblue';
        e.currentTarget.style.opacity = '1';
    };

    const dragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.currentTarget.style.backgroundColor = 'lightgray';
        e.currentTarget.style.border = '3px solid #2980b9';
    };

    const drop = (e: React.DragEvent<HTMLDivElement>, targetCard: box) => {
        e.preventDefault();

        if ((draggable.level === targetCard.level) && (draggable.id !== targetCard.id)) {
            targetCard.level++;
            const remainingCards = cards.filter(item => item.id !== draggable.id);
            setCards(remainingCards);
        }

        e.currentTarget.style.backgroundColor = 'lightblue';
        e.currentTarget.style.border = '3px solid #ffffff';
    };

    return (
        <div>
            {cards.map(item => (
                <Box
                    key={item.id}
                    item={item}
                    onDragStart={dragStart}
                    onDragLeave={dragLeave}
                    onDragEnd={dragEnd}
                    onDragOver={dragOver}
                    onDrop={drop}
                />
            ))}
        </div>
    );
};

export default DragAndDrop;
