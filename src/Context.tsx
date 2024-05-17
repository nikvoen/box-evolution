import React, {createContext, useEffect, useState} from "react";
import {v4 as uuid} from "uuid";

export interface GridPosition {
    gridColumnStart: number;
    gridColumnEnd: number;
    gridRowStart: number;
    gridRowEnd: number;
}

export interface box extends GridPosition {
    id: string;
    level: number;
}

export interface user {
    level: number;
    balance: number;
}

export interface BoxProps {
    item: box;
    onDragStart: (e: React.DragEvent<HTMLDivElement>, item: box) => void;
    onDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
    onDragEnd: (e: React.DragEvent<HTMLDivElement>) => void;
    onDragOver: (e: React.DragEvent<HTMLDivElement>, targetCard: box) => void;
    onDrop: (e: React.DragEvent<HTMLDivElement>, targetCard: box) => void;
}

export interface GameContextType {
    userData: user;
    changeLevel: (newLevel: number) => void;
    draggable: box;
    setDraggable: React.Dispatch<React.SetStateAction<box>>;
    setUserData: React.Dispatch<React.SetStateAction<user>>;
    cards: box[];
    setCards: React.Dispatch<React.SetStateAction<box[]>>;
}

export interface GameProviderProps {
    children: React.ReactNode;
}

export const GameContext = createContext<GameContextType>({} as GameContextType);

export const Context: React.FC<GameProviderProps> = ({ children }) => {
    const [userData, setUserData] = useState<user>({ level: 0, balance: 1000 });
    const [draggable, setDraggable] = useState<box>({
        id: '',
        level: 0,
        gridColumnStart: 0,
        gridColumnEnd: 0,
        gridRowStart: 0,
        gridRowEnd: 0,
    });
    const [cards, setCards] = useState<box[]>([
        { id: uuid(), level: 1, gridColumnStart: 1, gridColumnEnd: 2, gridRowStart: 1, gridRowEnd: 2 },
        { id: uuid(), level: 1, gridColumnStart: 2, gridColumnEnd: 3, gridRowStart: 1, gridRowEnd: 2 },
        { id: uuid(), level: 2, gridColumnStart: 3, gridColumnEnd: 4, gridRowStart: 1, gridRowEnd: 2 },
        { id: uuid(), level: 3, gridColumnStart: 1, gridColumnEnd: 2, gridRowStart: 2, gridRowEnd: 3 },
        { id: uuid(), level: 4, gridColumnStart: 2, gridColumnEnd: 3, gridRowStart: 2, gridRowEnd: 3 },
        { id: uuid(), level: 5, gridColumnStart: 3, gridColumnEnd: 4, gridRowStart: 2, gridRowEnd: 3 },
    ]);


    const changeLevel = (newLevel: number) => {
        setUserData(prevUserData => ({ ...prevUserData, level: prevUserData.level + newLevel }));
    };

    useEffect(() => {
        const perSec = [1, 2, 3, 4, 5, 6, 7];
        const perHour = [10, 20, 30, 40, 50, 60, 70];
        const everySecond = setInterval(() => {
            let newBalance = 0;
            cards.forEach(card => {
                newBalance += perSec[card.level - 1];
            });
            setUserData(prevUserData => ({
                ...prevUserData,
                balance: prevUserData.balance + newBalance
            }));
        }, 1000);
        const everyHour = setInterval(() => {
            let newBalance = 0;
            cards.forEach(card => {
                newBalance += perHour[card.level - 1];
            });
            setUserData(prevUserData => ({
                ...prevUserData,
                balance: prevUserData.balance + newBalance
            }));
        }, 3600000);

        return () => {
            clearInterval(everySecond);
            clearInterval(everyHour);
        }
    }, [cards]);

    return (
        <GameContext.Provider value={{ userData, setUserData, changeLevel, draggable, setDraggable, cards, setCards }}>
            {children}
        </GameContext.Provider>
    );
};
