import './App.css'
import { v4 as uuid } from 'uuid';
import React, {useContext, useState} from "react";
import {Context, GameContext, BoxProps, box} from './Context.tsx';

const Box: React.FC<BoxProps> = ({ item, onDragStart, onDragLeave, onDragEnd, onDragOver, onDrop }) => {
    return (
        <div
            key={item.id}
            onDragStart={(e) => onDragStart(e, item)}
            onDragLeave={(e) => onDragLeave(e)}
            onDragEnd={(e) => onDragEnd(e)}
            onDragOver={(e) => onDragOver(e, item)}
            onDrop={(e) => onDrop(e, item)}
            draggable={true}
            className={"box"}
        >
            {item.level}
        </div>
    );
};

const DragAndDrop: React.FC = () => {
    const { changeLevel, draggable, setDraggable, cards, setCards } = useContext(GameContext);

    const dragStart = (e: React.DragEvent<HTMLDivElement>, item: box) => {
        e.dataTransfer.setData('cardId', item.id);
        setDraggable({id: item.id, level: item.level});
        e.currentTarget.style.backgroundColor = 'gray';
        e.currentTarget.style.opacity = '0';
    };

    const dragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.currentTarget.style.backgroundColor = 'lightblue';
        e.currentTarget.style.border = '3px solid #ffffff';
        e.currentTarget.style.width = '100px';
        e.currentTarget.style.height = '100px';
    };

    const dragEnd = (e: React.DragEvent<HTMLDivElement>) => {
        e.currentTarget.style.backgroundColor = 'lightblue';
        e.currentTarget.style.opacity = '1';
    };

    const dragOver = (e: React.DragEvent<HTMLDivElement>, item: box) => {
        e.preventDefault();
        e.currentTarget.style.border = '3px solid #2980b9';

        if ((draggable.level === item.level) && (draggable.id !== item.id)) {
            e.currentTarget.style.backgroundColor = 'aquamarine';
            e.currentTarget.style.width = '115px';
            e.currentTarget.style.height = '115px';
        } else {
            e.currentTarget.style.backgroundColor = 'lightcoral';
        }
    };

    const drop = (e: React.DragEvent<HTMLDivElement>, targetCard: box) => {
        e.preventDefault();

        if ((draggable.level === targetCard.level) && (draggable.id !== targetCard.id)) {
            targetCard.level++;
            changeLevel(draggable.level);
            const remainingCards = cards.filter(item => item.id !== draggable.id);
            setCards(remainingCards);
        }

        e.currentTarget.style.backgroundColor = 'lightblue';
        e.currentTarget.style.border = '3px solid #ffffff';
        e.currentTarget.style.width = '100px';
        e.currentTarget.style.height = '100px';
    };

    return (
            <div className="grid-container">
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

const Shop: React.FC = () => {
    const { userData, setUserData, cards, setCards } = useContext(GameContext);

    const handleBuy = (cost: number, boxLevel: number) => {
        const maxLevelToBuy = userData.level - 2;
        if (boxLevel <= maxLevelToBuy) {
            if (userData.balance >= cost) {
                const newBalance = userData.balance - cost;
                setUserData({ level: userData.level, balance: newBalance });

                if (cards.length <= 5) {
                    const newCard: box = { id: uuid(), level: boxLevel };
                    setCards([...cards, newCard]);
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
                        <button className={"menu-button"} onClick={() => setShowStore(false)}>Close</button>
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
