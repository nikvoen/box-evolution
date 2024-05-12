import React, { useState, useEffect } from 'react';
import { v4 as uuid } from 'uuid';
import Box from "../../utils/Box/Box.tsx";
import './boxes.css';

interface Square {
    id: string;
    position: { x: number; y: number };
    level: number;
}

interface Props {
    userLevel: number;
    onLevelChange: (newLevel: number) => void;
}

export const Boxes: React.FC<Props> = ({ userLevel, onLevelChange }) => {

    const initialSquares: Square[] = [
        { id: uuid(), position: { x: 50, y: 150 }, level: 1 },
        { id: uuid(), position: { x: 150, y: 150 }, level: 1 },
        { id: uuid(), position: { x: 250, y: 150 }, level: 2 },
        { id: uuid(), position: { x: 50, y: 250 }, level: 3 },
        { id: uuid(), position: { x: 150, y: 250 }, level: 4 },
        { id: uuid(), position: { x: 250, y: 250 }, level: 5 },
    ];

    const [squares, setSquares] = useState<Square[]>(initialSquares);
    const [draggingSquareId, setDraggingSquareId] = useState<string | null>(null);
    const [intersectedSquare, setIntersectedSquare] = useState<Square | null>(null);

    useEffect(() => {
        const handleLevelChange = (level: number) => {
            const newLevel = userLevel + level;
            onLevelChange(newLevel);
        };
        const handleMouseMove = (e: MouseEvent) => {
            moveSquare(e.clientX, e.clientY);
        };
        const handleMouseUp = () => {
            endDrag();
        };

        const handleTouchMove = (e: TouchEvent) => {
            e.preventDefault();
            const { clientX, clientY } = e.touches[0];
            moveSquare(clientX, clientY);
        };
        const handleEnd = () => {
            endDrag();
        };

        const moveSquare = (clientX: number, clientY: number) => {
            if (draggingSquareId !== null) {
                const updatedSquares = squares.map((square) =>
                    square.id === draggingSquareId
                        ? {
                            ...square,
                            position: {
                                x: clientX,
                                y: clientY,
                            },
                        }
                        : square
                );
                setSquares(updatedSquares);

                const draggingSquare = squares.find(
                    (square) => square.id === draggingSquareId
                );
                const intersected = squares.find((square) => {
                    if (square.id !== draggingSquareId && square.level === draggingSquare!.level) {
                        return (
                            Math.abs(square.position.x - draggingSquare!.position.x) < 50 &&
                            Math.abs(square.position.y - draggingSquare!.position.y) < 50
                        );
                    }
                    return false;
                });
                setIntersectedSquare(intersected || null);
            }
        };

        const endDrag = () => {
            if (draggingSquareId !== null) {
                if (intersectedSquare) {
                    handleLevelChange(intersectedSquare.level);
                    const newSquare = {
                        id: uuid(),
                        position: {
                            x: (squares[0].position.x + intersectedSquare.position.x) / 2,
                            y: (squares[0].position.y + intersectedSquare.position.y) / 2,
                        },
                        level: intersectedSquare.level + 1,
                    };

                    const updatedSquares = squares.filter(
                        (square) =>
                            square.id !== intersectedSquare.id &&
                            square.id !== draggingSquareId &&
                            square.id !== intersectedSquare.id
                    );
                    setSquares([...updatedSquares, newSquare]);
                }
                setDraggingSquareId(null);
                setIntersectedSquare(null);
            }
        };

        document.addEventListener('touchmove', handleTouchMove, { passive: false });
        document.addEventListener('touchend', handleEnd);
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);


        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            document.removeEventListener('touchmove', handleTouchMove);
            document.removeEventListener('touchend', handleEnd);
        };
    }, [draggingSquareId, squares, intersectedSquare, userLevel, onLevelChange]);

    const handleDragStart = (squareId: string) => {
        setDraggingSquareId(squareId);
    };

    return (
        <div className="main-container">
            {squares.map((square) => (
                <Box
                    key={square.id}
                    id={square.id}
                    position={square.position}
                    level={square.level}
                    onDragStart={handleDragStart}
                />
            ))}
        </div>
    );
};

export default Boxes;

