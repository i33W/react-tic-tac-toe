import { useState, Fragment } from "react";
import "./App.css";

function Square({ value, onSquareClick, win }) {
  return (
    <button
      className="square"
      onClick={onSquareClick}
      style={win ? { background: "#ff0" } : null}
    >
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  const boardRow = Array(3)
    .fill(0)
    .map((val, idx) =>
      Array(3)
        .fill(0)
        .map((val2, idx2) => idx * 3 + idx2)
    );

  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) return;

    const nextSquares = squares.slice();
    if (xIsNext) nextSquares[i] = "X";
    else nextSquares[i] = "O";
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) status = "Winner: " + squares[winner[0]];
  else if (squares.indexOf(null) === -1) status = "Being a draw";
  else status = "Next player: " + (xIsNext ? "X" : "O");

  return (
    <Fragment>
      <div className="status">{status}</div>

      {boardRow.map((val) => {
        return (
          <div className="board-row" key={val}>
            {val.map((val2) => {
              return (
                <Square
                  win={winner && winner.indexOf(val2) !== -1}
                  key={val2}
                  value={squares[val2]}
                  onSquareClick={() => handleClick(val2)}
                />
              );
            })}
          </div>
        );
      })}
    </Fragment>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];
  const [isASC, setIsASC] = useState(true);

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    let points;

    if (move === 0) {
      description = "Go to game start";
      points = "";
    } else {
      let index = history[move]
        .map((v, i) => {
          if (history[move - 1][i] !== v) return i;
          else return null;
        })
        .reduce((prev, cur) => prev || cur);
      let x = Math.floor(index / 3);
      let y = (index - 3 * x) % 3;
      points = `(${x}, ${y})`;
      if (move === currentMove) {
        description = "You are at move #" + move;
      } else {
        description = "Go to move #" + move;
      }
    }

    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
        {"   "}
        {points}
      </li>
    );
  });
  function onOrderChangeHandler() {
    setIsASC(!isASC);
  }

  return (
    <div className="game">
      <div className="game-board">
        <button type="button" onClick={onOrderChangeHandler}>
          {!isASC ? "ASC" : "DESC"}
        </button>
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{isASC ? moves : moves.reverse()}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [a, b, c];
    }
  }
  return null;
}
