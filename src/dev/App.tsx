import React, { useRef, useState } from 'react';
import '../App.css';

const App = () => {
    const [activeSquare, setActiveSquare] = useState<number | null>(null);
    const squareRefs = [useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null)];

    const start = (index: number) => (event: React.TouchEvent<HTMLDivElement> | React.MouseEvent<HTMLDivElement>) => {
        setActiveSquare(index);
        console.log(`Touch Start on square ${index + 1}!`);
        console.log('Event type:', event.type);
    };

    const moveTouch = (event: React.TouchEvent<HTMLDivElement>) => {
        console.log('Event type:', event.type);
        if (activeSquare !== null) {
            const moving = squareRefs[activeSquare].current;
            if (!moving) return;

            const touch = event.changedTouches[0];
            moving.style.position = 'fixed';
            moving.style.left = `${touch.clientX - moving.clientWidth / 2}px`;
            moving.style.top = `${touch.clientY - moving.clientHeight / 2}px`;

            const allSquares = squareRefs.map(ref => ref.current);
            allSquares.forEach((square, index) => {
                if (square && index !== activeSquare) {
                    const targetRect = square.getBoundingClientRect();
                    if (
                        touch.clientX > targetRect.left &&
                        touch.clientX < targetRect.right &&
                        touch.clientY > targetRect.top &&
                        touch.clientY < targetRect.bottom
                    ) {
                        square.style.backgroundColor = 'yellow';
                    } else {
                        square.style.backgroundColor = 'lightgray';
                    }
                }
            });
        }
    };

    const moveMouse = (event: React.MouseEvent<HTMLDivElement>) => {
        console.log('Event type:', event.type);
        if (activeSquare !== null) {
            const moving = squareRefs[activeSquare].current;
            if (!moving) return;

            moving.style.position = 'fixed';
            moving.style.left = `${event.clientX - moving.clientWidth / 2}px`;
            moving.style.top = `${event.clientY - moving.clientHeight / 2}px`;

            const allSquares = squareRefs.map(ref => ref.current);
            allSquares.forEach((square, index) => {
                if (square && index !== activeSquare) {
                    const targetRect = square.getBoundingClientRect();
                    if (
                        event.clientX > targetRect.left &&
                        event.clientX < targetRect.right &&
                        event.clientY > targetRect.top &&
                        event.clientY < targetRect.bottom
                    ) {
                        square.style.backgroundColor = 'yellow';
                    } else {
                        square.style.backgroundColor = 'lightgray';
                    }
                }
            });
        }
    };

    const finish = () => {
        setActiveSquare(null);
        const allSquares = squareRefs.map(ref => ref.current);
        allSquares.forEach(square => {
            if (square) {
                square.style.position = 'static';
                square.style.backgroundColor = 'lightgray';
            }
        });
    };

    return (
        <div className="App">
            <div className="Shaded" ref={squareRefs[0]} onTouchStart={start(0)} onTouchMove={moveTouch} onTouchEnd={finish} onMouseDown={start(0)} onMouseMove={moveMouse} onMouseUp={finish}>1</div>
            <div className="Shaded" ref={squareRefs[1]} onTouchStart={start(1)} onTouchMove={moveTouch} onTouchEnd={finish} onMouseDown={start(1)} onMouseMove={moveMouse} onMouseUp={finish}>2</div>
        </div>
    );
};

export default App;
