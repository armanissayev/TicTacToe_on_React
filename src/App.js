// import logo from './logo.svg';
import './App.css';
import './index.css';
import { useState, useEffect } from 'react';
import { SpeedInsights } from "@vercel/speed-insights/react"

let order = 0;

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function whoStartsFirst(playerMove, setPlayerMove) {
    let x = getRandomInt(2);
    setPlayerMove(x);
    if (x === 0) {
        order = 1;
    } else {
        order = 0;
    }
}

function finished(matrix) {
    for (let i = 0; i < 3; i ++) {
        for (let j = 0; j < 3; j ++) {
            if (matrix[i][j] === ' ') {
                return false;
            }
        }
    }
    return true;
}

function Square({makePlayerMove, playerMove, value, i, j}) {
    let rownum = "row" + i;
    let colnum = "col" + j;
    let Class = "square " + rownum + " " + colnum;
    if (value === ' ') {
        Class += " empty-square";
        return (
            <div className = {Class} onClick = {(e) => makePlayerMove(i, j, (playerMove === 0 ? 'X' : 'O'))}> {value} </div>
        );
    } else {
        return (
            <div className = {Class} > {value} </div>
        );
    }
    
}

function Board({matrix, makePlayerMove, playerMove}) {
    let squares = [];
    for (let i = 0; i < 3; i ++) {
        for (let j = 0; j < 3; j ++) {
            let number = i * 3 + j;
            squares.push(<Square key={number} makePlayerMove = {makePlayerMove} playerMove = {playerMove} value = {matrix[i][j]} i = {i} j = {j} />);
        }
    }
    return (
        <div className = "Board">
            <div className="board-row">
                {squares.slice(0, 3)}
            </div>
            <div className="board-row">
                {squares.slice(3, 6)}
            </div>
            <div className="board-row">
                {squares.slice(6)}
            </div>
        </div>
    );
}

function playerWon({matrix, playerMove}) {
    let playerChar = 'X';
    if (playerMove === 1) {
        playerChar = 'O';
    }

    for (let i = 0; i < 3; i ++) {
        if (matrix[i][0] === playerChar && matrix[i][1] === playerChar && matrix[i][2] === playerChar) {
            return true;
        }
    }
    for (let j = 0; j < 3; j ++) {
        if (matrix[0][j] === playerChar && matrix[1][j] === playerChar && matrix[2][j] === playerChar) {
            return true;
        }
    }
    if (matrix[0][0] === playerChar && matrix[1][1] === playerChar && matrix[2][2] === playerChar) {
        return true;
    }
    if (matrix[2][0] === playerChar && matrix[1][1] === playerChar && matrix[0][2] === playerChar) {
        return true;
    }
    return false;
}

function botWon({matrix, playerMove}) {
    let playerChar = 'O';
    if (playerMove === 1) {
        playerChar = 'X';
    }

    for (let i = 0; i < 3; i ++) {
        if (matrix[i][0] === playerChar && matrix[i][1] === playerChar && matrix[i][2] === playerChar) {
            return true;
        }
    }
    for (let j = 0; j < 3; j ++) {
        if (matrix[0][j] === playerChar && matrix[1][j] === playerChar && matrix[2][j] === playerChar) {
            return true;
        }
    }
    if (matrix[0][0] === playerChar && matrix[1][1] === playerChar && matrix[2][2] === playerChar) {
        return true;
    }
    if (matrix[2][0] === playerChar && matrix[1][1] === playerChar && matrix[0][2] === playerChar) {
        return true;
    }
    return false;
}

function Messages({matrix, playerMove, gameStatus}) {

    let message = "";
    if (gameStatus === 1) {
        message = "Let's start the game!";
    } else if (gameStatus === 2) {
        message = "Make your move!";
    } else if (gameStatus === 3) {
        if (playerWon({matrix, playerMove})) {
            message = "You won the game!\nLet's do it again!";
        } else if (botWon({matrix, playerMove})) {
            message = "You lost it :(\nBut it's never late to come back!";
        } else {
            message = "It's a tie! Let's play again to see who is stronger!";
        }
    }

    return (
        <div className = 'message'>{message}</div>
    );
}

function Buttons({gameStatus, startGame}) {
    if (gameStatus === 1) {
        return (
            <div className = "button">
                <button onClick = {startGame}>Start</button>
            </div>
        );
    } else if (gameStatus === 3) {
        return (
            <div className = "button"> 
                <button onClick = {startGame}>Restart</button> 
            </div>
        );
    }
    return null;
}

function App() {

    const [matrix, setMatrix] = useState([
        [' ', ' ', ' '],
        [' ', ' ', ' '],
        [' ', ' ', ' ']
      ]);
    const [playerMove,  setPlayerMove] = useState(0);   
    const [gameStatus, setGameStatus] = useState(0);  
    
    if (gameStatus === 0) {
        whoStartsFirst(playerMove, setPlayerMove);
        setGameStatus(1);
        return;
    }

    let makeBotMove = () => {
        if (gameStatus !== 2 || playerWon({matrix, playerMove}) || finished(matrix)) {
            return;
        }
        let i = getRandomInt(3), j = getRandomInt(3);
        while (matrix[i][j] !== ' ') {
            i = getRandomInt(3); 
            j = getRandomInt(3);
        }
        let updatedMatrix = [...matrix];
        updatedMatrix[i][j] = (playerMove === 0 ? 'O' : 'X');
        setMatrix(updatedMatrix);
        return;
    }

    let startGame = () => {
        let clearedMatrix = [
            [' ', ' ', ' '],
            [' ', ' ', ' '],
            [' ', ' ', ' ']
        ];
        setMatrix(clearedMatrix);
        whoStartsFirst(playerMove, setPlayerMove);
        setGameStatus(2);
        return;
    }

    let makePlayerMove = (i, j, value) => {
        if (gameStatus !== 2 || order === 0 || botWon({matrix, playerMove})) {
            return;
        }
        let updatedMatrix = [...matrix];
        updatedMatrix[i][j] = value;
        setMatrix(updatedMatrix);
        order = 0;
        return;
    }

    if (gameStatus === 2 && playerWon({matrix, playerMove})) {
        setGameStatus(3);
        return;
    } else if (gameStatus === 2 && botWon({matrix, playerMove})) {
        setGameStatus(3);
        return;
    } else if (gameStatus === 2 && finished(matrix) === true) {
        setGameStatus(3);
        return;
    }
    // ok = 1 - ok;
    if (gameStatus === 2 && order === 0) {
        order = 1;
        makeBotMove();
        return;
    }
    return (
        <>
            <SpeedInsights/>
            <Board matrix = {matrix} makePlayerMove = {makePlayerMove} playerMove = {playerMove}/>
            <Messages matrix = {matrix} playerMove = {playerMove} gameStatus = {gameStatus} />
            <Buttons gameStatus = {gameStatus} startGame = {startGame} />
        </>
    );
}

export default App;
