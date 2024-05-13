import './service.css';
import { useState} from "react";
import Store from "../Store/Store.tsx";
import Boxes from "../Boxes/Boxes.tsx";
import { v4 as uuid } from 'uuid';

export interface Square {
    id: string;
    position: { x: number; y: number };
    level: number;
}

const Service = () => {
    const initialSquares: Square[] = [
        { id: uuid(), position: { x: 50, y: 150 }, level: 1 },
        { id: uuid(), position: { x: 150, y: 150 }, level: 1 },
        { id: uuid(), position: { x: 250, y: 150 }, level: 2 },
        { id: uuid(), position: { x: 50, y: 250 }, level: 3 },
        { id: uuid(), position: { x: 150, y: 250 }, level: 4 },
        { id: uuid(), position: { x: 250, y: 250 }, level: 5 },
    ];

    const [userSquares, setSquares] = useState<Square[]>(initialSquares);
    const [userLevel, setLevel] = useState(0);
    const [userBalance, setBalance] = useState(0);
    const [buttonChange, setButtonChange] = useState(true);

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
