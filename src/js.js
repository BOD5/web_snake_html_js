'use strict';

let size = 15;
let border = 0;
let played = false;
let pause = false;

let scoreC = Object;

const types = [
  {
    name: 'free',
    color: 'gray'
  },
  {
    name: 'apple',
    color: 'Red'
  },
  {
    name: 'snake',
    color: 'green'
  },
  {
    name: 'border',
    color: 'navy'
  },
];

const Block = (coord, size, type) => {
  const newBlock = {
    coord: coord,
    size: size,
    type: type,
  }
  return newBlock;
}

const paint = (canv, block) => {
  const ctx = canv.getContext("2d");
  // if(block.type.name === 'apple') { 
  //     ctx.fillStyle = block.type.color;       
  //     ctx.arc(block.coord.x + block.size / 2, block.coord.y + block.size / 2, block.size / 2, 0, 2 * Math.PI);
  // } else 
  {
      ctx.fillStyle = block.type.color;
      ctx.fillRect(block.coord.x, block.coord.y, block.size - border, block.size - border);
  }
}

const apple = (map) => {
  const freeP = setFree(map);
  const pos = Math.floor(Math.random() * (freeP.length));
  map[freeP[pos].col][freeP[pos].row].type.name = 'apple';
  return {x: freeP[pos].col, y:freeP[pos].row};
};

const mapN = (col, row) => {
  let newMap = Array(+col).fill().map((_, i) => (
    Array(+row).fill()));
  for(let i = 0; i < col; i+=1) {
    for(let j = 0; j < row; j+=1) {
      newMap[i][j] = Block({ x: i*size, y: j*size }, size, {...types[0]});
    }
  }
  return newMap;
}

const setBorder = (map) => {
  for(let i = 0; i < map.length; i+=1) {
    map[i][0].type.name = 'border';    
    map[i][map[0].length - 1].type.name = 'border';
  }
  for(let i = 0; i < map[0].length; i+=1) {
    map[0][i].type.name = 'border';
    map[map.length - 1][i].type.name = 'border';
  }
}

const setFree = (map) => {
  let freeArr = new Array();
  let k = 0;
  for(let i = 0; i < map.length; i+=1) {
    for(let j = 0; j < map[0].length; j+=1) {
      if (map[i][j].type.name === 'free') {
        freeArr[k] = { col: i, row: j };
        k+=1;
      }
    }
  }
  return freeArr;
}

const setDirection = (snake, newDirection) => {
  if (newDirection) {
    if (snake.direction === 'up' && newDirection === 'down') {
      return;
    } else if (snake.direction === 'right' && newDirection === 'left') {
      return;
    } else if (snake.direction === 'left' && newDirection === 'right') {
      return;
    } else if (snake.direction === 'down' && newDirection === 'up') {
      return;
    }
    snake.direction = newDirection;
  }
}

const SnakeConstructor = (map, direction, length, startPoint) => {
  let newSnake = {
    direction: direction,
    segments: [],
  }
  for (let i = 0; i < length; i+=1){
    map[startPoint.x - i][startPoint.y].type.name = 'snake';
    newSnake.segments[i] = { x: startPoint.x - i, y: startPoint.y };
  }
  return newSnake; 
}

const move = (map, snake) =>{
  let x = snake.segments[0].x;
  let y = snake.segments[0].y;
  let tempX;
  let tempY;
  switch(snake.direction) {
    case 'right':
      snake.segments[0].x = x + 1;
      map[x + 1][y].type.name = 'snake';
    break;
    case 'down':
      snake.segments[0].y = y + 1;
      map[x][y + 1].type.name = 'snake';
    break;
    case 'left':
      snake.segments[0].x = x - 1;
      map[x - 1][y].type.name = 'snake';
    break;
    case 'up':
      snake.segments[0].y = y - 1;
      map[x][y - 1].type.name = 'snake';
    break;
  }
  for(let i = 1; i < snake.segments.length; i+=1) {
    tempX = snake.segments[i].x;
    tempY = snake.segments[i].y;
    snake.segments[i].x = x;
    snake.segments[i].y = y;
    x = tempX;
    y = tempY;
  }
  map[x][y].type.name = 'free';
  collision(map, snake);
}

const stopGame = () => {
  played = false;
  alert("you died");
}

const collision = (map, snake) => {
  if (map[snake.segments[0].x][snake.segments[0].y].type.color === types[1].color) {
    snake.segments.push({
      x: snake.segments[snake.segments.length - 1].x - (snake.segments[snake.segments.length - 2].x - snake.segments[snake.segments.length - 1].x),
      y: snake.segments[snake.segments.length - 1].y - (snake.segments[snake.segments.length - 2].y - snake.segments[snake.segments.length - 1].y),
    });
    scoreC.value = parseInt(scoreC.value,10) + 10;
    apple(map);
    return;
  } else
  if (!(map[snake.segments[0].x][snake.segments[0].y].type.color === types[0].color)) {
    stopGame();
  }
}

const render = (canv, map) => {
  for(let i = 0; i < map.length; i+=1) {
    for(let j = 0; j < map[0].length; j+=1) {
        let type = types.find(elem => elem.name === map[i][j].type.name);
        if (!(map[i][j].type.color === type.color)) {
          map[i][j].type.color = type.color;
        }
      paint(canv, map[i][j]);
    }
  }
}

const getParams = (canv, height, width, sizeP, sizeB, score) => {
  size = sizeP;
  border = sizeB;
  scoreC = score;
  console.log(' - :192 -> score', scoreC); // eslint-disable-line no-console
  canv.height = height;
  canv.width = width;
}

const gameLoop = (canv, map, snake) => {
  
}

const game = (canv) => {
  scoreC.value = 0;
  const sCol = Math.floor(canv.width / size);
  const sRow = Math.floor(canv.height / size);
  let map = mapN(sCol, sRow);
  setBorder(map);
  pause = false;
  played = (played)? false: true;
  let snake = SnakeConstructor(map, 'right', 4, { x: 5, y: 5 });
  const ap = apple(map);
  render(canv, map);
  const play = () => {    
    addEventListener("keydown", listner);
        function listner(event) {
          if (event.keyCode === 32) {
            if(!pause) {
              pause = true;
            }
            else {
              pause = false;
            }
          }
        const directions = {
          37: 'left',
          38: 'up',
          39: 'right',
          40: 'down'
        };  
        setDirection(snake, directions[event.keyCode])      
    }
    if (played && !pause) {
      move(map, snake);
      render(canv, map);
    } else {
      if (!pause)
        clearInterval(intervalId);
    }
    
  }
  let intervalId = setInterval(play, 150);
}