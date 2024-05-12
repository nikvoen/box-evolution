import './menu.css';
import Boxes from "../Boxes/Boxes.tsx";
import {useState} from "react";

export const Menu = () => {
    const [userLevel, setUserLevel] = useState(0);

    const handleLevelChange = (newLevel: number) => {
        setUserLevel(newLevel);
    };

    return (
        <div className="container">
            <div className="content">
                <div className="score">Уровень: {userLevel}</div>
                <Boxes userLevel={userLevel} onLevelChange={handleLevelChange} />
            </div>
            <div className="controls">
            <button>Store</button>
                <button>Home</button>
            </div>
        </div>
    );
}

export default Menu;
