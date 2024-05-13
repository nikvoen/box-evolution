import { v4 as uuid } from 'uuid';

export interface Square {
    id: string;
    position: { x: number; y: number };
    level: number;
}

export const initialSquares: Square[] = [
    { id: uuid(), position: { x: 50, y: 150 }, level: 1 },
    { id: uuid(), position: { x: 150, y: 150 }, level: 1 },
    { id: uuid(), position: { x: 250, y: 150 }, level: 2 },
    { id: uuid(), position: { x: 50, y: 250 }, level: 3 },
    { id: uuid(), position: { x: 150, y: 250 }, level: 4 },
    { id: uuid(), position: { x: 250, y: 250 }, level: 5 },
];
