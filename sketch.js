// Julian Kandlhofer, Mar 2018
// SNAKE, A copy of the classic snake game

const scl = 25;
let snake;

// Coordinates of the food
let apple;

// Nuber of cells in x and y direction
let x_cells;
let y_cells;

let pauseButton;
let startButton;

// DOM elements
let resetBtn;

// Snake class 
class Snake {
  constructor() {
    this.reset();
  }

  // Draw snake to the screen
  draw() {
    noStroke();
    fill(255);
    rect(this.pos.x * scl, this.pos.y * scl, scl, scl);

    this.tail.forEach(el => {
      noStroke();
      fill(255,255,0);
      rect(el.x * scl, el.y * scl, scl, scl);
  
    });
  }



  // Set direction of the snake
  move(x,y) {
    if(this.tail.length>0)
    {
      if(x === 1 && this.dir.x === -1) {
        x = -1;
      }
      else if(x === -1 && this.dir.x === 1) {
        x = 1;
      }
      else if(y === 1 && this.dir.y === -1) {
        y = -1;
      }
      else if(y === -1 && this.dir.y === 1) {
        y = 1;
      }
    }
    
    this.dir.x = x;
    this.dir.y = y;
  }


  // Check if the snake has collided with the boders or itself
  checkCollision() {
    let coll = false;
    if(
        this.pos.x < 0 ||
        this.pos.x >= x_cells ||
        this.pos.y < 0 ||
        this.pos.y >= y_cells
      )
    {
      coll = true;
    }

    this.tail.forEach(t => {
      if(t.equals(this.pos))
      {
        coll = true;
      }
    });

    return coll;
  }

  // Update Position of rhe snake
  update() {

    // The snake has a tail or has just eaten
    if(this.tail.length>0 || this.hasEaten) {
      // If it hasnt eaten remove the last element
      // When it has, just keep it to increase the length
      if(!this.hasEaten) {
        this.tail.pop();
      }
      this.hasEaten = false;

      // Add the current position of the snake to the beginning
      this.tail.unshift(createVector(this.pos.x, this.pos.y));
    }
    
    // Move the current position
    this.pos.x += this.dir.x;
    this.pos.y += this.dir.y;
  }
  
  // Check if the head is in the same location as the fruit
  eat(fruit) {
    if(dist(fruit.x,fruit.y, this.pos.x, this.pos.y) < 1) {
      this.hasEaten = true;
      return true;
    } else {
      return false;
    }
  }

  // Returns tail length as score
  getScore() {
    return this.tail.length;
  }

  // Resets the snake
  reset() {
    // Position of the head of the snake
    this.pos = createVector(x_cells/2, y_cells/2);
    // Direction the head is moving in
    this.dir = createVector(0,1);
    // Stores location of all the tail cells
    this.tail = [];

    // Stores if the snake has just eaten a fruit
    // in the next draw cycle the snake will be lengthend and this will be reset
    this.hasEaten = false;
  }
  
}

// Setup function, runs once
function setup() {
  let cnv = createCanvas(600, 600);
  cnv.parent('canvasContainer');
  frameRate(10);

  x_cells = Math.floor(width/scl);
  y_cells = Math.floor(height/scl);

  resetBtn = document.getElementById('resetButton');
  resetBtn.addEventListener('click', resetGame);

  updateHS();

  fill(255);
  noStroke();
  snake = new Snake();
  apple = newFoodPos();
}

// Draw loop
function draw() {
  background(51);

  // LOGIC
  if (snake.eat(apple)) {
    apple = newFoodPos();
  }
  snake.update();
  if(snake.checkCollision()) {
    gameOver();
  }

  document.getElementById('score').innerHTML = 'Score: ' + snake.getScore();


  ///// DRAWING
  // APPLE
  fill(255,0,0);
  noStroke();
  rect(apple.x * scl ,apple.y * scl, scl, scl);
  // SNAKE
  snake.draw();
}


// Generate a new position for the food
function newFoodPos() {
  return createVector(Math.floor(random(0,x_cells)),Math.floor(random(0,y_cells)));
}



// Handle keyboard input
function keyPressed() {
  switch(keyCode)
  {
    case UP_ARROW:
      setTimeout(() => {
        snake.move(0,-1);
      }, 0); 
      break;
      
    case DOWN_ARROW:
      setTimeout(() => {
        snake.move(0,1);
      }, 0); 
      break;
      
    case LEFT_ARROW:
      setTimeout(() => {
        snake.move(-1,0);
      }, 0); 
      break;
      
    case RIGHT_ARROW:
      setTimeout(() => {
        snake.move(1,0);
      }, 0); 
      break;
  }
}

// Called when gameover
function gameOver() {
  noLoop();
  background(255,0,0,150);

  let currScore = snake.getScore();
  updateHS(currScore);
}

// Restarts the game after gameover
function resetGame() {
  snake.reset();
  apple = newFoodPos();
  loop();
}


// Updates Highscore display
function updateHS(score) {
  // Load last hs from local storage
  let hs = localStorage.getItem('highscore');
  if(hs) {
    if( hs < score){
      localStorage.setItem('highscore', score);
      hs = score;
    }
    document.getElementById('highscore').innerHTML = hs;
  }
  else {
    document.getElementById('highscore').innerHTML = '0';
    localStorage.setItem('highscore', '0');
  }
}