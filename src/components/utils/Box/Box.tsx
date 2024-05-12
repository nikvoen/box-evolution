import React from 'react';
import './box.css';

interface BoxProps {
    id: string;
    position: { x: number; y: number };
    level: number;
    onDragStart: (id: string) => void;
}

export const Box: React.FC<BoxProps> = ({ id, position, level, onDragStart }) => {
    const getColor = (level: number): string => {
        switch (level) {
            case 1:
                return 'red';
            case 2:
                return 'orange';
            case 3:
                return 'yellow';
            case 4:
                return 'green';
            case 5:
                return 'blue';
            case 6:
                return 'indigo';
            default:
                return 'black';
        }
    };

    const handleMouseDown = (): void => {
        onDragStart(id);
    };

    const handleTouchStart = (): void => {
        onDragStart(id);
    };

    return (
        <div
            className="box"
            style={{
                left: position.x,
                top: position.y,
                backgroundColor: getColor(level),
            }}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
        >
            {level}
        </div>
    );
};

export default Box;
