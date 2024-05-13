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
    userSquares: Square[];
    userLevel: number;
    userBalance: number;
    onSquareChange: (newSquares: Square[]) => void;
    onLevelChange: (newLevel: number) => void;
    onBalanceChange: (newBalance: number) => void;
}

export const Boxes: React.FC<Props> = ({ userSquares, userLevel, userBalance, onSquareChange, onLevelChange, onBalanceChange }) =>     {
    const [draggingSquareId, setDraggingSquareId] = useState<string | null>(null);
    const [intersectedSquare, setIntersectedSquare] = useState<Square | null>(null);

    useEffect(() => {
        const squareChange = (newSquare: Square[]) => {
            onSquareChange(newSquare);
        };
        const levelChange = (level: number) => {
            onLevelChange(userLevel + level);
        };
        const balanceChange = (value: number) => {
            onBalanceChange(userBalance + value);
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
                                x: Math.min(Math.max(clientX, 0), 375-50),
                                y: Math.min(Math.max(clientY, 0), 555-50),
                            },
                        }
                        : square
                );
                squareChange(updatedSquares);

                const draggingSquare = userSquares.find(
                    (square) => square.id === draggingSquareId
                );
                const intersected = userSquares.find((square) => {
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
                    levelChange(intersectedSquare.level);
                    balanceChange(100);

                    const newSquare = {
                        id: uuid(),
                        position: {
                            x: (userSquares[0].position.x + intersectedSquare.position.x) / 2,
                            y: (userSquares[0].position.y + intersectedSquare.position.y) / 2,
                        },
                        level: intersectedSquare.level + 1,
                    };

                    const updatedSquares = userSquares.filter(
                        (square) =>
                            square.id !== intersectedSquare.id &&
                            square.id !== draggingSquareId &&
                            square.id !== intersectedSquare.id
                    );
                    squareChange([...updatedSquares, newSquare]);
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
        onBalanceChange,
        userBalance,
        onSquareChange]);

    const handleDragStart = (squareId: string) => {
        setDraggingSquareId(squareId);
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
