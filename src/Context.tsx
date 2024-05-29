import React, {createContext, useEffect, useState} from "react";
import data from "./data.json";

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
    buyRatio: number;
}

export interface BoxProps {
    item: box;
    touchStart: (e: React.TouchEvent<HTMLDivElement>, item: box) => void;
    touchMove: (e: React.TouchEvent<HTMLDivElement>) => void;
    touchEnd: (e: React.TouchEvent<HTMLDivElement>) => void;
    mouseDown: (e: React.MouseEvent<HTMLDivElement>, item: box) => void;
    mouseUp: (e: React.MouseEvent<HTMLDivElement>, item: box) => void;
}

export interface GameContextType {
    click: number;
    setClick: React.Dispatch<React.SetStateAction<number>>;
    userData: user;
    changeLevel: (value: number) => void;
    changeBalance: (newBalance: number) => void;
    draggable: box;
    setDraggable: React.Dispatch<React.SetStateAction<box>>;
    cards: box[];
    setCards: React.Dispatch<React.SetStateAction<box[]>>;
}

export interface GameProviderProps {
    children: React.ReactNode;
}

export const GameContext = createContext<GameContextType>({} as GameContextType);

export const Context: React.FC<GameProviderProps> = ({ children }) => {
    const [click, setClick] = useState(0);
    const [draggable, setDraggable] = useState<box>({
        id: '',
        level: 0,
        gridColumnStart: 0,
        gridColumnEnd: 0,
        gridRowStart: 0,
        gridRowEnd: 0,
    });
    const [userData, setUserData] = useState(data.userData);
    const [cards, setCards] = useState(data.cards);

    const changeLevel = (value: number) => {
        setUserData(prevUserData => ({ ...prevUserData, level: prevUserData.level + value }));
    };

    const changeBalance = (newBalance: number) => {
        setUserData(prevUserData => ({ ...prevUserData, balance: newBalance }));
    };

    //const changeBuyRatio = (newRatio: number) => {
    //    setUserData(prevUserData => ({ ...prevUserData, buyRatio: newRatio }));
    //};

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
        <GameContext.Provider value={{ userData, changeLevel, changeBalance, draggable, setDraggable, cards, setCards, click, setClick }}>
            {children}
        </GameContext.Provider>
    );
};
