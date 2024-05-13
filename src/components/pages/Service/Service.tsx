import './service.css';
import { useState} from "react";
import Store from "../Store/Store.tsx";
import Boxes from "../Boxes/Boxes.tsx";

export const Service = () => {
    const [userLevel, setLevel] = useState(0);
    const [userBalance, setBalance] = useState(0);
    const [buttonChange, setButtonChange] = useState(true);

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
                {buttonChange && <Boxes userLevel={userLevel}
                                        userBalance={userBalance}
                                        onLevelChange={levelChange}
                                        onBalanceChange={balanceChange}/>}
                {!buttonChange && <Store userLevel={userLevel}
                                         userBalance={userBalance}
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
