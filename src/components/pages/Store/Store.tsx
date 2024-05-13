import React from 'react';
import './store.css';

interface StoreProps {
    userLevel: number;
    userBalance: number;
    onBalanceChange: (newBalance: number) => void;
}

const Store: React.FC<StoreProps> = ({ userLevel, userBalance, onBalanceChange }) => {

    const handleBuy = (cost: number, boxLevel: number) => {
        const maxLevelToBuy = userLevel - 2;
        if (boxLevel <= maxLevelToBuy) {
            if (userBalance >= cost) {
                const newBalance = userBalance - cost;
                onBalanceChange(newBalance);
            } else {
                alert("Not enough coins!");
            }
        } else {
            alert("You cannot buy this box yet!");
        }
    };

    return (
        <div className="">
            <p>Box lv.1: 100 coins <button onClick={() => handleBuy(100, 1)}>Buy</button></p>
            <p>Box lv.2: 100 coins <button onClick={() => handleBuy(100, 2)}>Buy</button></p>
            <p>Box lv.3: 100 coins <button onClick={() => handleBuy(100, 3)}>Buy</button></p>
            <p>Box lv.4: 100 coins <button onClick={() => handleBuy(100, 4)}>Buy</button></p>
            <p>Box lv.5: 100 coins <button onClick={() => handleBuy(100, 5)}>Buy</button></p>
            <p>Box lv.6: 100 coins <button onClick={() => handleBuy(100, 6)}>Buy</button></p>
        </div>
    );
}

export default Store;
