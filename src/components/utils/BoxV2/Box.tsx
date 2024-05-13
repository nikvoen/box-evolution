import React, { useState, useEffect } from 'react';

interface Props {
    level: number;
    balancePerSecond: number;
    balancePerHour: number;
}

const Box: React.FC<Props> = ({ level, balancePerSecond, balancePerHour }) => {
    const [balance, setBalance] = useState(0);

    useEffect(() => {
        const secondInterval = setInterval(() => {
            setBalance(prevBalance => prevBalance + balancePerSecond);
        }, 1000);

        const hourInterval = setInterval(() => {
            setBalance(prevBalance => prevBalance + balancePerHour); // Convert balancePerHour to balance per second
        }, 3600000);

        return () => {
            clearInterval(secondInterval);
            clearInterval(hourInterval);
        };
    }, [balancePerSecond, balancePerHour]);

    return (
        <div style={{
            width: '150px',
            height: '150px',
            backgroundColor: 'blueviolet',
            color: 'white',
            textAlign: 'center'
        }}>
            <p>Level: {level}</p>
            <p>Balance: {balance}</p>
            <p>sec: {balancePerSecond}</p>
            <p>hour: {balancePerHour}</p>
        </div>
    );
};


export default Box;
