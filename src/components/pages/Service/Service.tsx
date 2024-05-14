import './service.css';
import {useEffect, useState} from "react";
import Store from "../Store/Store.tsx";
import Boxes from "../Boxes/Boxes.tsx";
import { v4 as uuid } from 'uuid';

export interface Square {
    id: string;
    position: { x: number; y: number };
    level: number;
}

const BalanceRates: Record<number, { perSecond: number; perHour: number }> = {
    1: { perSecond: 1, perHour: 10 },
    2: { perSecond: 2, perHour: 11 },
    3: { perSecond: 3, perHour: 12 },
    4: { perSecond: 4, perHour: 15 },
    5: { perSecond: 5, perHour: 20 },
    6: { perSecond: 6, perHour: 40 },
};

const Service = () => {
    const initialSquares: Square[] = [
        { id: uuid(), position: { x: 15, y: 150 }, level: 1 },
        { id: uuid(), position: { x: 140, y: 150 }, level: 1 },
        { id: uuid(), position: { x: 260, y: 150 }, level: 2 },
        { id: uuid(), position: { x: 15, y: 300 }, level: 3 },
        { id: uuid(), position: { x: 140, y: 300 }, level: 4 },
        { id: uuid(), position: { x: 260, y: 300 }, level: 5 },
    ];

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
                                        userBalance={userBalance}
                                        onSquareChange={squaresChange}
                                        onLevelChange={levelChange}
                                        onBalanceChange={balanceChange}/>}
                {!buttonChange && <Store userSquares={userSquares}
                                         userLevel={userLevel}
                                         userBalance={userBalance}
                                         onSquareChange={squaresChange}
                                         onBalanceChange={balanceChange}/>}
            </div>
            <div className="controls">
            <button onClick={handleStoreClick}>Store</button>
                <button onClick={handleHomeClick}>Home</button>
            </div>
        </div>
    );
}

export default Service;
