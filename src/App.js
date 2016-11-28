import React from 'react';
import ReactDOM from 'react-dom'


function Square(props) {    
  const className = props.winner ? "square winning-square" : "square";
  return (      
    <button className={className} onClick={() => props.onClick()}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {    

  renderSquare(i) {    
    let winner = false;
    if(this.props.winners) {
      winner = this.props.winners.indexOf(i) != -1 ? true : false
      console.log('foo');
      console.log(winner);
    } 
    return <Square 
      value={this.props.squares[i]} 
      onClick={() => this.props.onClick(i)}
      winner={winner}
       />;        
      }
  

  render() {
    return (
      <div>
        {[0, 3, 6].map(row => 
          <div className="board-row">
            {[0, 1, 2].map(col => (this.renderSquare(row + col)))}
          </div>
        )}
      </div>
    );
  }
}

class Game extends React.Component {  
  constructor() {
    super();
    this.coords = new Map([
      [0,"0,0"],
      [1,"0,1"],
      [2,"0,2"],
      [3,"1,0"],
      [4,"1,1"],
      [5,"1,2"],
      [6,"2,0"],
      [7,"2,1"],
      [8,"2,2"] 
    ]);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        locations: Array(9).fill(null)
      }],
      xIsNext: true,
      stepNumber: 0,
      isSortOrderAsc: true,
      winners : []
    };
  }


  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const isSortOrderAsc = this.state.isSortOrderAsc;
    const winners = this.state.winners;    
    const moves = history.map((step, move) => {
      const styleType = move === this.state.stepNumber ?
        'move-list-selected' :
        'move-list'
      const desc = move ?
        `Move #  ${move} ${current.locations[move]}` :
        'Game start';
      return (
        <li key={move} className={styleType} >
          <a href="#" onClick={() => this.jumpTo(move)}>{desc}</a>
        </li>
      );
    });
  
    let status;
    let lines;
    if (winner) {      
      status = 'Winner: ' + winner.player      
      lines = winner.lines;
    } else {
      const status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }   
    // console.log(lines)     ;
    return (
      <div>
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}        
            winners={lines}    
          />
        </div>
        <div className="control-panel">        
          <button onClick={(state) => this.flipSortOrder(state)}>Toggle Sort order {isSortOrderAsc ? 'asc' : 'desc'}</button>                                
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{isSortOrderAsc ? moves : moves.slice(0).reverse()}</ol>                    
        </div>                  
      </div>
    );
  }

  flipSortOrder() {    
      const isSortOrderAsc = this.state.isSortOrderAsc;
      this.setState({
        isSortOrderAsc: !isSortOrderAsc
      });
  }

  handleClick(i) {
    const history = this.state.history;
    const current = history[history.length - 1];    
    const squares = current.squares.slice();
    const locations = current.locations.slice();
    const step = history.length;
    const foo = calculateWinner(squares);    
    if (foo || squares[i]) {
      this.setState({
        winners: foo.lines
      });
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';    
    locations[step] = this.coords.get(i);
    this.setState({
      history: history.concat([{
        squares: squares,
        locations: locations       
      }]),
      xIsNext: !this.state.xIsNext,
      stepNumber: step,
      winningSquares: []
    });    
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) ? false : true,
    });
  }

}

// ========================================
ReactDOM.render(
  <Game />,
  document.getElementById('container')
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
      return {
        player: squares[a],
        lines: lines[i]
      }
    }
  }
  return null;
}
