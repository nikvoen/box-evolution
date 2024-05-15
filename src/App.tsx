import React, {useEffect, useState} from "react";
import { Square, BoxProps, BoxesProps, StoreProps, BalanceRates, initialSquares } from './GameContext';
import { v4 as uuid } from 'uuid';
import './App.css'

const Box: React.FC<BoxProps> = ({ id, position, level, onDragStart }) => {
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

const Boxes: React.FC<BoxesProps> = ({ userSquares, userLevel, onSquareChange, onLevelChange }) => {
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
        <div >
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

const Store: React.FC<StoreProps> = ({ userLevel, userBalance, userSquares, onSquareChange, onBalanceChange }) => {
    const addSquare = (
        position: { x: number; y: number },
        level: number,
        onSquareChange: (newSquares: Square[]) => void
    ) => {
        const newSquare: Square = {
            id: uuid(),
            position,
            level
        };
        const updatedSquares = [...userSquares, newSquare];
        onSquareChange(updatedSquares);
    };

    const handleBuy = (cost: number, boxLevel: number) => {
        const maxLevelToBuy = userLevel - 2;
        if (boxLevel <= maxLevelToBuy) {
            if (userBalance >= cost) {
                const newBalance = userBalance - cost;
                onBalanceChange(newBalance);
                addSquare({ x: 15, y: 450 }, boxLevel, onSquareChange);
            } else {
                alert("Not enough coins!");
            }
        } else {
            alert("You cannot buy this box yet!");
        }
    };

    return (
        <div className="store">
            <p>Box lv.1: 100 coins <button onClick={() => handleBuy(100, 1)}>Buy</button></p>
            <p>Box lv.2: 100 coins <button onClick={() => handleBuy(100, 2)}>Buy</button></p>
            <p>Box lv.3: 100 coins <button onClick={() => handleBuy(100, 3)}>Buy</button></p>
            <p>Box lv.4: 100 coins <button onClick={() => handleBuy(100, 4)}>Buy</button></p>
            <p>Box lv.5: 100 coins <button onClick={() => handleBuy(100, 5)}>Buy</button></p>
            <p>Box lv.6: 100 coins <button onClick={() => handleBuy(100, 6)}>Buy</button></p>
        </div>
    );
}

const Service = () => {
    const [userSquares, setSquares] = useState<Square[]>(initialSquares);
    const [userLevel, setLevel] = useState(0);
    const [userBalance, setBalance] = useState(0);
    const [buttonChange, setButtonChange] = useState(true);

    useEffect(() => {
        const updateBalance = () => {
            let totalBalance = userBalance;
            userSquares.forEach((square) => {
                const rate = BalanceRates[square.level];
                totalBalance += rate.perSecond;
            });
            setBalance(totalBalance);
        };

        const intervalId = setInterval(() => {
            updateBalance();
        }, 1000);

        const hourlyIntervalId = setInterval(() => {
            userSquares.forEach((square) => {
                const rate = BalanceRates[square.level];
                setBalance((prevBalance) => prevBalance + rate.perHour);
            });
        }, 3600000);

        return () => {
            clearInterval(intervalId);
            clearInterval(hourlyIntervalId);
        };
    }, [userBalance, userSquares]);

    const squaresChange = (newSquares: Square[]) => {
        setSquares(newSquares);
    };
    const levelChange = (newLevel: number) => {
        setLevel(newLevel);
    };
    const balanceChange = (newBalance: number) => {
        setBalance(newBalance);
    };

    const handleStoreClick = () => {
        setButtonChange(false);
    };
    const handleHomeClick = () => {
        setButtonChange(true);
    };

    return (
        <div className="container">
            <div className="content">
                <div className="score">Level: {userLevel}</div>
                <div className="score">Balance: {userBalance}</div>
                {buttonChange && <Boxes userSquares={userSquares}
                                        userLevel={userLevel}
                                        onSquareChange={squaresChange}
                                        onLevelChange={levelChange} />}
                {!buttonChange && <Store userSquares={userSquares}
                                         userLevel={userLevel}
                                         userBalance={userBalance}
                                         onSquareChange={squaresChange}
                                         onBalanceChange={balanceChange} />}
            </div>
            <div className="controls">
                <button onClick={handleStoreClick}>Store</button>
                <button onClick={handleHomeClick}>Home</button>
            </div>
        </div>
    );
}

function App() {
    return (
        <div className="App">
            <Service />
        </div>
    );
}

export default App
