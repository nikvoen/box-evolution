import React from 'react';
import './box.css';
import {BoxProps} from '../../assets/GameContext'

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
        onDragStart(id, position);
    };

    const handleTouchStart = (): void => {
        onDragStart(id, position);
    };

    return (
        <div className={"outer"}>
            <div className="box"
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
        </div>
    );
};

export default Box;
