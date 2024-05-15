import React, { useState, useEffect } from 'react';
import { v4 as uuid } from 'uuid';
import Box from "../../utils/Box/Box.tsx";
import './boxes.css';
import { Square, BoxesProps } from '../../assets/GameContext'

export const Boxes: React.FC<BoxesProps> = ({ userSquares, userLevel, onSquareChange, onLevelChange }) => {
    const [draggingSquareId, setDraggingSquareId] = useState<string | null>(null);
    const [draggingSquarePos, setDraggingSquarePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
    const [intersectedSquare, setIntersectedSquare] = useState<Square | null>(null);

    useEffect(() => {
        const levelChange = (level: number) => {
            onLevelChange(userLevel + level);
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
                const updatedSquares = userSquares.map((square) =>
                    square.id === draggingSquareId
                        ? {
                            ...square,
                            position: {
                                x: Math.min(Math.max(clientX - 50, 5), 375-105),
                                y: Math.min(Math.max(clientY - 50, 80), 555-105),
                            },
                        }
                        : square
                );
                onSquareChange(updatedSquares);

                const draggingSquare = userSquares.find(
                    (square) => square.id === draggingSquareId
                );
                const intersected = userSquares.find((square) => {
                    if (square.id !== draggingSquareId && square.level === draggingSquare!.level) {
                        return (
                            Math.abs(square.position.x - draggingSquare!.position.x) <= 100 &&
                            Math.abs(square.position.y - draggingSquare!.position.y) <= 100
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
                    levelChange(intersectedSquare.level);

                    const newSquare = {
                        id: uuid(),
                        position: {
                            x: intersectedSquare.position.x,
                            y: intersectedSquare.position.y,
                        },
                        level: intersectedSquare.level + 1,
                    };

                    const updatedSquares = userSquares.filter(
                        (square) =>
                            square.id !== intersectedSquare.id &&
                            square.id !== draggingSquareId &&
                            square.id !== intersectedSquare.id
                    );
                    onSquareChange([...updatedSquares, newSquare]);
                } else {
                    const updatedSquares = userSquares.map((square) =>
                        square.id === draggingSquareId
                            ? {
                                ...square,
                                position: {
                                    x: draggingSquarePos.x,
                                    y: draggingSquarePos.y,
                                },
                            }
                            : square
                    );
                    onSquareChange(updatedSquares);
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
    }, [draggingSquareId,
        userSquares,
        intersectedSquare,
        userLevel,
        onLevelChange,
        onSquareChange,
        draggingSquarePos.x, draggingSquarePos.y]);

    const handleDragStart = (squareId: string, pos: { x: number; y: number }) => {
        setDraggingSquareId(squareId);
        setDraggingSquarePos(pos);
    };

    return (
        <div className="main-container">
            {userSquares.map((square) => (
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
