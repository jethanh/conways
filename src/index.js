import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { Button, ButtonToolbar, Dropdown, DropdownButton } from 'react-bootstrap';


class Box extends React.Component {
	selectBox = () => {
		this.props.selectBox(this.props.row, this.props.col);
	}

	render() {
		return (
			<div
				className={this.props.boxClass}
				id={this.props.id}
				onClick={this.selectBox}
			/>
		);
	}
}

class Grid extends React.Component {
	render() {
		const width = (this.props.cols * 14);
		var rowsArr = [];

		var boxClass = "";
		for (var i = 0; i < this.props.rows; i++) {
			for (var j = 0; j < this.props.cols; j++) {
				let boxId = i + "_" + j;

				boxClass = this.props.gridFull[i][j] ? "box on" : "box off";
				rowsArr.push(
					<Box
						boxClass={boxClass}
						key={boxId}
						boxId={boxId}
						row={i}
						col={j}
						selectBox={this.props.selectBox}
					/>
				);
			}
		}

		return (
			<div className="grid" style={{width: width}}>
				{rowsArr}
			</div>
		);
	}
}

class Buttons extends React.Component {

  handleSelect = (e) => {
    this.props.gridSize(e);
  }


  render() {
    return (
      <div className="btnz">
        <ButtonToolbar>
        <div className="btns">
          <Button className="btn" onClick={this.props.startButton}>
            Start
          </Button>
          <Button className="btn" onClick={this.props.pauseButton}>
            Pause
          </Button>
          <Button className="btn" onClick={this.props.clear}>
            Clear
          </Button>
          <Button className="btn" onClick={this.props.seed}>
            Random
          </Button>
          <Button className="btn" onClick={this.props.slow}>
            Slower
          </Button>
          <Button className="btn" onClick={this.props.fast}>
            Faster
          </Button>
          <DropdownButton 
            title="Grid Size"
            id="size-menu"
            onSelect={this.handleSelect}
            >
              <Dropdown.Item eventKey="1">20x10</Dropdown.Item>
              <Dropdown.Item eventKey="2">50x30</Dropdown.Item>
              <Dropdown.Item eventKey="3">70x50</Dropdown.Item>
            </DropdownButton>
          </div>

        </ButtonToolbar>
      </div>
    )
  }
}

class Main extends React.Component {
	constructor() {
		super();
		this.speed = 100;
		this.rows = 30;
		this.cols = 50;

		this.state = {
			generation: 0,
      gridFull: Array(this.rows).fill().map(() => Array(this.cols).fill(false)),
      running: false,
		}
  }
  
  selectBox = (row, col) => {
    if (this.state.running == false) {    
      let gridCopy = arrayClone(this.state.gridFull);
      gridCopy[row][col] = !gridCopy[row][col];
      this.setState({
        gridFull: gridCopy
      })}
  }

  seed = () => {
    let gridCopy = arrayClone(this.state.gridFull);
    for (let i = 0; i < this.rows; i++){
      for (let j = 0; j < this.cols; j++){
        if (Math.floor(Math.random() * 4) === 1) {
          gridCopy[i][j] = true;
        } 

        if (gridCopy[i][j] = true) {
          if (Math.floor(Math.random() * 2) === 1) {
            gridCopy[i][j] = false;
          } 
        }
      }
    }
    this.setState({
      gridFull: gridCopy
    })
  }

  startButton = () => {
    clearInterval(this.intervalId)
    this.intervalId = setInterval(this.start, this.speed);
  }

  pauseButton = () => {
    clearInterval(this.intervalId)
    this.setState({
      running: false
    })
  }

  slow = () => {
    this.speed += 10;
    this.startButton();
}

  fast = () => {
    if (this.speed == 50){
      this.speed += 0;
      this.startButton();
    } else {
      this.speed -= 10
      this.startButton();
    }
  }

  clear = () => {
    var grid = Array(this.rows).fill().map(() => Array(this.cols).fill(false));
    this.setState({
      gridFull: grid,
      generation: 0
    });
  }

  gridSize = (size) => {
    switch (size) {
      case "1":
        this.cols = 20;
        this.rows = 10;
      break;
      case "2":
        this.cols = 50;
        this.rows = 30;
      break;
      default:
        this.cols = 70;
        this.rows = 50;
    }
    this.clear();
  }

  start = () => {
		let g = this.state.gridFull;
		let gg = arrayClone(this.state.gridFull);

		for (let i = 0; i < this.rows; i++) {
		  for (let j = 0; j < this.cols; j++) {
		    let count = 0;
		    if (i > 0) if (g[i - 1][j]) count++;
		    if (i > 0 && j > 0) if (g[i - 1][j - 1]) count++;
		    if (i > 0 && j < this.cols - 1) if (g[i - 1][j + 1]) count++;
		    if (j < this.cols - 1) if (g[i][j + 1]) count++;
		    if (j > 0) if (g[i][j - 1]) count++;
		    if (i < this.rows - 1) if (g[i + 1][j]) count++;
		    if (i < this.rows - 1 && j > 0) if (g[i + 1][j - 1]) count++;
		    if (i < this.rows - 1 && j < this.cols - 1) if (g[i + 1][j + 1]) count++;
		    if (g[i][j] && (count < 2 || count > 3)) gg[i][j] = false;
		    if (!g[i][j] && count === 3) gg[i][j] = true;
		  }
		}
		this.setState({
		  gridFull: gg,
      generation: this.state.generation + 1,
      running: true
		});

	}

  componentDidMount() {
    this.seed();
    this.startButton();

  }
  
  render() {
    return (
      <div className="main">
        <div class="center">
        <Grid 
          gridFull={this.state.gridFull}
          rows={this.rows}
          cols={this.cols}
          selectBox={this.selectBox}
        />
        <h2>Generation: {this.state.generation}</h2>
        <h2>Speed: {this.speed}ms</h2>
        </div>
        <Buttons 
          startButton={this.startButton}
          pauseButton={this.pauseButton}
          clear={this.clear}
          seed={this.seed}
          slow={this.slow}
          fast={this.fast}
          gridSize={this.gridSize}
        />
      </div>
    )
  }
}

function arrayClone(arr) {
  return JSON.parse(JSON.stringify(arr));
}

ReactDOM.render(
    <Main />,
  document.getElementById('root')
);

