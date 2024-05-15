import './service.css';
import {useEffect, useState} from "react";
import Store from "../Store/Store.tsx";
import Boxes from "../Boxes/Boxes.tsx";
import { Square, BalanceRates, initialSquares } from '../../assets/GameContext';

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

export default Service;
