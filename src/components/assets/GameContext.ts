import {v4 as uuid} from "uuid";

export interface Square {
    id: string;
    position: { x: number; y: number };
    level: number;
}

export interface BoxesProps {
    userSquares: Square[];
    userLevel: number;
    onSquareChange: (newSquares: Square[]) => void;
    onLevelChange: (newLevel: number) => void;
}

export interface StoreProps {
    userSquares: Square[];
    userLevel: number;
    userBalance: number;
    onSquareChange: (newSquares: Square[]) => void;
    onBalanceChange: (newBalance: number) => void;
}

export const BalanceRates: Record<number, { perSecond: number; perHour: number }> = {
    1: { perSecond: 1, perHour: 10 },
    2: { perSecond: 2, perHour: 11 },
    3: { perSecond: 3, perHour: 12 },
    4: { perSecond: 4, perHour: 15 },
    5: { perSecond: 5, perHour: 20 },
    6: { perSecond: 6, perHour: 40 },
};

export const initialSquares: Square[] = [
    { id: uuid(), position: { x: 15, y: 150 }, level: 1 },
    { id: uuid(), position: { x: 140, y: 150 }, level: 1 },
    { id: uuid(), position: { x: 260, y: 150 }, level: 2 },
    { id: uuid(), position: { x: 15, y: 300 }, level: 3 },
    { id: uuid(), position: { x: 140, y: 300 }, level: 4 },
    { id: uuid(), position: { x: 260, y: 300 }, level: 5 },
];