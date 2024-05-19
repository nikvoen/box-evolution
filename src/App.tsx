import './App.css'
import { v4 as uuid } from 'uuid';
import React, {useContext, useEffect, useState} from "react";
import {Context, GameContext, BoxProps, box} from './Context.tsx';

const Box: React.FC<BoxProps> = ({ item, touchStart, touchMove, touchEnd, mouseUp, mouseDown }) => {
    return (
        <div
            key={item.id}
            onTouchStart={(e) => touchStart(e, item)}
            onTouchMove={(e) => touchMove(e, item)}
            onTouchEnd={(e) => touchEnd(e, item)}

            onMouseDown={(e) => mouseDown(e, item)}
            onMouseUp={(e) => mouseUp(e, item)}

            className={"box"}
            style={{
                gridColumnStart: item.gridColumnStart,
                gridColumnEnd: item.gridColumnEnd,
                gridRowStart: item.gridRowStart,
                gridRowEnd: item.gridRowEnd,
            }}
            data-id={item.id}
            data-level={item.level}
        >
            {item.level}
        </div>
    );
};

const DragAndDrop: React.FC = () => {
    const { changeLevel, draggable, setDraggable, cards, setCards, click, setClick } = useContext(GameContext);

    const isTouched = (event: React.TouchEvent<HTMLDivElement>, targetRect: DOMRect) => {
        const touch = event.changedTouches[0];
        return (
            touch.clientX > targetRect.left &&
            touch.clientX < targetRect.right &&
            touch.clientY > targetRect.top &&
            touch.clientY < targetRect.bottom
        );
    };

    const isClicked = (event: React.MouseEvent<HTMLDivElement>, targetRect: DOMRect) => {
        return (
            event.clientX > targetRect.left &&
            event.clientX < targetRect.right &&
            event.clientY > targetRect.top &&
            event.clientY < targetRect.bottom
        );
    };

    const touchStart = (e: React.TouchEvent<HTMLDivElement>, item: box) => {
        const moving = e.currentTarget;
        moving.classList.add('selected');

        setDraggable({
            id: item.id,
            level: item.level,
            gridColumnStart: item.gridColumnStart,
            gridColumnEnd: item.gridColumnEnd,
            gridRowStart: item.gridRowStart,
            gridRowEnd: item.gridRowEnd,
        });
    };

    const touchMove = (e: React.TouchEvent<HTMLDivElement>) => {
        const moving = e.currentTarget;
        const touch = e.changedTouches[0];

        moving.style.position = 'fixed';
        moving.style.left = String(touch.clientX - moving.clientWidth / 2) + 'px';
        moving.style.top = String(touch.clientY - moving.clientHeight / 2) + 'px';

        document.querySelectorAll('.box').forEach((box) => {
            const boxId = box.getAttribute('data-id');
            const boxLevel = box.getAttribute('data-level');
            const boxRect = box.getBoundingClientRect();

            if (boxId !== draggable.id && isTouched(e, boxRect)) {
                if (boxLevel === String(draggable.level)) {
                    box.classList.add('green');
                } else {
                    box.classList.add('red');
                }
            } else {
                box.classList.remove('green');
                box.classList.remove('red');
            }
        });
    };

    const touchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
        const moving = e.currentTarget;
        moving.style.position = 'static';
        moving.classList.remove('selected');

        document.querySelectorAll('.box').forEach((box) => {
            box.classList.remove('green');
            box.classList.remove('red');
        });

        document.querySelectorAll('.box').forEach((box) => {
            const boxId = box.getAttribute('data-id');
            const boxLevel = box.getAttribute('data-level');
            const boxRect = box.getBoundingClientRect();

            if (boxId !== draggable.id && isTouched(e, boxRect)) {
                if (boxLevel === String(draggable.level)) {
                    changeLevel(draggable.level);
                    const updatedCards = cards.map(card => {
                        if (card.id === boxId) {
                            return { ...card, level: draggable.level + 1 };
                        }
                        return card;
                    }).filter(item => item.id !== draggable.id);
                    setCards(updatedCards);
                }
            }
        });
    };

    const mouseDown = (e: React.MouseEvent<HTMLDivElement>, item: box) => {
        setClick(1);
        e.preventDefault();
        const moving = e.currentTarget;
        moving.classList.add('selected');

        setDraggable({
            id: item.id,
            level: item.level,
            gridColumnStart: item.gridColumnStart,
            gridColumnEnd: item.gridColumnEnd,
            gridRowStart: item.gridRowStart,
            gridRowEnd: item.gridRowEnd,
        });
    };



    const mouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
        setClick(0);
        const moving = e.currentTarget;
        moving.classList.remove('selected');
        moving.style.position = 'static';

        document.querySelectorAll('.box').forEach((box) => {
            box.classList.remove('green');
            box.classList.remove('red');
        });

        document.querySelectorAll('.box').forEach((box) => {
            const boxId = box.getAttribute('data-id');
            const boxLevel = box.getAttribute('data-level');
            const boxRect = box.getBoundingClientRect();

            if (boxId !== draggable.id && isClicked(e, boxRect)) {
                if (boxLevel === String(draggable.level)) {
                    changeLevel(draggable.level);
                    const updatedCards = cards.map(card => {
                        if (card.id === boxId) {
                            return { ...card, level: draggable.level + 1 };
                        }
                        return card;
                    }).filter(item => item.id !== draggable.id);
                    setCards(updatedCards);
                }
            }
        });
    };

    useEffect(() => {
        const mouseMove = (e: MouseEvent) => {
            if (click && draggable.id) {
                const moving = document.querySelector(`.box[data-id='${draggable.id}']`) as HTMLDivElement;
                if (moving) {
                    moving.style.position = 'fixed';
                    moving.style.left = String(e.clientX - moving.clientWidth / 2) + 'px';
                    moving.style.top = String(e.clientY - moving.clientHeight / 2) + 'px';

                    document.querySelectorAll('.box').forEach((box) => {
                        const boxId = box.getAttribute('data-id');
                        const boxLevel = box.getAttribute('data-level');
                        const boxRect = box.getBoundingClientRect();

                        if (boxId !== draggable.id && isClicked(e as unknown as React.MouseEvent<HTMLDivElement>, boxRect)) {
                            if (boxLevel === String(draggable.level)) {
                                box.classList.add('green');
                            } else {
                                box.classList.add('red');
                            }
                        } else {
                            box.classList.remove('green');
                            box.classList.remove('red');
                        }
                    });
                }
            }
        };

        document.addEventListener('mousemove', mouseMove);
        return () => {
            document.removeEventListener('mousemove', mouseMove);
        };
    }, [click, draggable]);

    return (
        <div className="grid-container">
            {cards.map(item => (
                <Box
                    key={item.id}
                    item={item}
                    touchStart={touchStart}
                    touchMove={touchMove}
                    touchEnd={touchEnd}
                    mouseUp={mouseUp}
                    mouseDown={mouseDown}
                />
            ))}
        </div>
    );
};

const Shop: React.FC = () => {
    const { userData, setUserData, cards, setCards } = useContext(GameContext);

    const handleBuy = (cost: number, boxLevel: number) => {
        const maxLevelToBuy = userData.level - 2;
        if (boxLevel <= maxLevelToBuy) {
            if (userData.balance >= cost) {
                const newBalance = userData.balance - cost;
                setUserData({ level: userData.level, balance: newBalance });

                if (cards.length <= 5) {
                    const findEmptyCell = (): { gridColumn: number; gridRow: number } | null => {
                        const sortedCards = [...cards];
                        sortedCards.sort((a, b) => {
                            if (a.gridRowStart === b.gridRowStart) {
                                return a.gridColumnStart - b.gridColumnStart;
                            }
                            return a.gridRowStart - b.gridRowStart;
                        });

                        for (let row = 1; row <= 2; row++) {
                            for (let column = 1; column <= 3; column++) {
                                const cellOccupied = sortedCards.some(card => {
                                    return (
                                        card.gridColumnStart <= column &&
                                        card.gridColumnEnd > column &&
                                        card.gridRowStart <= row &&
                                        card.gridRowEnd > row
                                    );
                                });
                                if (!cellOccupied) {
                                    return { gridColumn: column, gridRow: row };
                                }
                            }
                        }
                        return null;
                    };

                    const newCardPosition = findEmptyCell();
                    if (newCardPosition) {
                        const newCard: box = {
                            id: uuid(),
                            level: boxLevel,
                            gridColumnStart: newCardPosition.gridColumn,
                            gridColumnEnd: newCardPosition.gridColumn + 1,
                            gridRowStart: newCardPosition.gridRow,
                            gridRowEnd: newCardPosition.gridRow + 1,
                        };
                        setCards([...cards, newCard]);
                    }
                } else {
                    alert("Too many boxes!");
                }
            } else {
                alert("Not enough coins!");
            }
        } else {
            alert("You cannot buy this box yet!");
        }
    };

    const [showStore, setShowStore] = useState(false);

    return (
        <div className={"store"}>
            <button className={"menu-button"} onClick={() => setShowStore(true)}>Store</button>
            {showStore && (
                <div className="store-container">
                    <div className="store-window">
                        <p className={"text"}>Balance: {userData.balance}</p>
                        <p className={"text"}>Level: {userData.level}</p>
                        <div className="store-item">
                            <span className="price">Box lv.1: 100 coins</span>{" "}
                            <button onClick={() => handleBuy(100, 1)}>Buy</button>
                        </div>
                        <div className="store-item">
                            <span className="price">Box lv.2: 100 coins</span>{" "}
                            <button onClick={() => handleBuy(100, 2)}>Buy</button>
                        </div>
                        <div className="store-item">
                            <span className="price">Box lv.3: 100 coins</span>{" "}
                            <button onClick={() => handleBuy(100, 3)}>Buy</button>
                        </div>
                        <div className="store-item">
                            <span className="price">Box lv.4: 100 coins</span>{" "}
                            <button onClick={() => handleBuy(100, 4)}>Buy</button>
                        </div>
                        <div className="store-item">
                            <span className="price">Box lv.5: 100 coins</span>{" "}
                            <button onClick={() => handleBuy(100, 5)}>Buy</button>
                        </div>
                        <div className="store-item">
                            <span className="price">Box lv.6: 100 coins</span>{" "}
                            <button onClick={() => handleBuy(100, 6)}>Buy</button>
                        </div>
                        <button className={"menu-button"} onClick={() => setShowStore(false)}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

function App() {
    return (
        <div className={"App"}>
            <Context>
                <DragAndDrop/>
                <Shop/>
            </Context>
        </div>
    );
}

export default App
