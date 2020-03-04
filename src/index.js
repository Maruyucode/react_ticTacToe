import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { useSelector, useDispatch } from 'react-redux';
import './index.css';


/*
 *   redux
 */

// Game のコンストラクター部分のthis.stateに対応
let initState = {
    history: [{
        squares: Array(9).fill(null),
    }],
    stepNumber: 0,
    xIsNext: true,
};

// ACTION
const qlick_square = (index) => {
    return {
        type: 'QLICK_SQUARE',
        index,
    }
}

// REDUCER

const clickReducer = (state = initState, action) => {

    switch (action.type) {

        case 'QLICK_SQUARE':
            // handleClickイベントが起きた時の処理？
            const history = state.history.slice(0, state.stepNumber + 1);
            const current = history[history.length - 1];
            const squares = current.squares.slice();
            if (calculateWinner(squares) || squares[action.index]) {
                return;
            }
            squares[action.index] = state.xIsNext ? 'X' : 'O';
            return {
                history: history.concat([{
                    squares: squares,
                }]),
                stepNumber: history.length,
                xIsNext: !state.xIsNext,
            }
        
        default:
            return state;
    }
}

// STORE
let store = createStore(
    clickReducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);


// // handleClick()でdsispatch を実行
// // store.subscribe(() => console.log('test'));
// store.subscribe(() => console.log(store.getState()));

// // DISPATCH
// store.dispatch(qlick_square(/* index */));


// =====================================================


function Square(props) {
    return (
        <button
            className="square"
            onClick={props.onClick}
        >
            {props.value}
        </button>
    );
}

class Board extends React.Component {

    renderSquare(i) {
        return (
            <Square
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />
        );
    }

    render() {
        return (
            <div>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
        );
    }
}

// ここで store が使えるようになる
class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
            }],
            stepNumber: 0,
            xIsNext: true,
        };
    }

    // redux storeを使うための準備
    // const reduxobj = useSelector(state => state.history.stepNumber);
    // ? useSelectorで値がとれない、、

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

    // QLICK_SQUAREのstate変更がおこるトリガーはここ
    handleClick(i) {
        // store.subscribe(() => console.log('test'));
        store.subscribe(() => console.log(store.getState()));
        // DISPATCH
        store.dispatch(qlick_square(i));

        // 

        // const history = this.state.history.slice(0,this.state.stepNumber + 1);
        // const current = history[history.length - 1];
        // const squares = current.squares.slice();
        // if (calculateWinner(squares) || squares[i]) {
        //     return;
        // }
        // squares[i] = this.state.xIsNext ? 'X' : 'O';
        // this.setState({
        //     history: history.concat([{
        //         squares: squares,
        //     }]),
        //     stepNumber: history.length,
        //     xIsNext: !this.state.xIsNext,
        // });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        const moves = history.map((step, move) => {
            // 0はfalse
            const desc = move ?
                'Go to move #' + move :
                'Go to game start';
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            )
        });

        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        } else {
            status = 'Next player: ' + ((this.state.xIsNext) ? 'X' : 'O');
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
                <div>
                    {this.reduxobj}
                </div>
            </div>
        );
    }
}


// ========================================

ReactDOM.render(
    // Gameコンポーネントのなかで store の値を利用できるようになる
    // <Game store={store} />,
    <Provider>
        <Game store={store} />
    </Provider>,
    document.getElementById('root')
);


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
            return squares[a];  // 勝者 X or O がかえってくる
        }
    }
    return null;
}


