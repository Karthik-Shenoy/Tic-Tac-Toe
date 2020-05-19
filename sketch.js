class Spot{
  constructor(i,j,val){
    this.i = i
    this.j = j
    this.value = val
  }
}
let board = [
  ['','',''],
  ['','',''],
  ['','','']
];

let play = ['O', 'X'];
for(let j = 0; j < 3; j++){
    for(let i = 0; i < 3; i++){
      board[i][j] = new Spot(i, j, board[i][j])
    }
}

let ai = 'O'
let player = 'X'

function setup() {
  createCanvas(400,400);
}

function areEqual(a,b,c){
  return (a.value==b.value && b.value==c.value && a.value==c.value && a.value!='')
}

function checkWinner(){
  let winner = null;
  let li = []

  //horizontal
  for(let i = 0; i < 3; i++){
    if(areEqual(board[i][0], board[i][1], board[i][2])){
      winner = board[i][0].value
      li = [winner,0,i,2,i]
    }
  }
  // vertical
  for(let i = 0; i < 3; i++){
    if(areEqual(board[0][i], board[1][i], board[2][i])){
      winner = board[0][i].value
      li = [winner,i,0,i,2]
    }
  }
  //primary diagonal
  if(areEqual(board[0][0], board[1][1], board[2][2])){
    winner = board[0][0].value
    li = [winner,0,0,2,2]
  }
  //secondary diagonal
  if(areEqual(board[2][0], board[1][1], board[0][2])){
    winner = board[2][0].value
    li = [winner,2,0,0,2]
  }
  let openSpots = 0;
  for (let j = 0; j < 3; j++) {
    for (let i = 0; i < 3; i++) {
       if (board[i][j].value == '') {
         openSpots++;
       }
     }
   }
  if(winner == null && openSpots == 0){
    console.log("tie")
    return  ["tie"];
  }
  else{
    return winner, li;
  }

}

function bestMove() {
  // AI to make its turn
  let bestScore = -Infinity;
  let move;
  for (let j = 0; j < 3; j++) {
    for (let i = 0; i < 3; i++) {
      // Is the spot available?
      if (board[i][j].value == '') {
        board[i][j].value = ai;
        let score = minimax(board, 0, false);
        board[i][j].value = '';
        if (score > bestScore) {
          bestScore = score;
          move = { i, j };
        }
      }
    }
  }
  board[move.i][move.j].value = ai;
}

let scores = {
  X: -10,
  O: 10,
  tie: 0
};

function minimax(board, depth, isMaximizing) {
  let result = checkWinner();
  if (result[0] != null) {
    return scores[result[0]];
  }

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let j = 0; j < 3; j++) {
      for (let i = 0; i < 3; i++) {
        // Is the spot available?
        if (board[i][j].value == '') {
          board[i][j].value = ai;
          let score = minimax(board, depth + 1, false);
          board[i][j].value = '';
          bestScore = max(score, bestScore);
        }
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let j = 0; j < 3; j++) {
      for (let i = 0; i < 3; i++) {
        // Is the spot available?
        if (board[i][j].value == '') {
          board[i][j].value = player;
          let score = minimax(board, depth + 1, true);
          board[i][j].value = '';
          bestScore = min(score, bestScore);
        }
      }
    }
    return bestScore;
  }
}

function mouseClicked(){
  j = floor(mouseX/(width/3))
  i = floor(mouseY/(height/3))
  flag = 0
  if(board[j][i].value==""){
  board[j][i].value = player;
  flag = 1
  }
  if(flag){
    bestMove();
  }
}


function draw() {
  background(27);
  let w = width / 3;
  let h = height / 3;
  let x = 0;
  let y = 0;
  //drawing the board lines
  stroke(127)
  line(w, 0, w, height)
  line(2*w, 0, 2*w, height)
  line(0, h, width, h)
  line(0, 2*h, width, 2*h)
  //drawing the board lines

  for(let j = 0; j < 3; j++){
    x = 0
    for(let i = 0; i < 3; i++){
      let spot = board[i][j];
      strokeWeight(4);
      let redu = h/4;

      if(spot.value == play[0]){
        noFill();
        stroke(45,125,45)
        ellipse(x+h/2, y+h/2, h/2);
      }
      else if (spot.value == play[1]){
        stroke(125,45,45)
        line(x+redu, y+redu, x+w-redu, y+h-redu);
        line(x+w-redu , y+redu, x+redu, y+h-redu);
      }
      x+=w;
    }
    y+=h;
  }
  result = checkWinner();

  if(result[0] != null){
    if(result[0] == "O"){
      stroke(45,125,45)
    }
    else if(result[0]=="X"){
        stroke(125,45,45)
    }
     if(result[2]==result[4]){
       line(((2*result[2]+1)*w)/2, 0,((2*result[4]+1)*w)/2,height)
       noLoop();
     }

    else if(result[1]==result[3]){
    line(0, ((2*result[1]+1)*h)/2, width, ((2*result[3]+1)*h)/2)
    noLoop()
    }
    else if(result[1]==result[4] && result[2]==result[2]){
      line(width,0,0, height)
      noLoop()
    }
    else if(result[1]==result[2] && result[3]==result[4]){
      line(0,0,width, height)
      noLoop()
    }
    console.log(result[0])
    output(result[0]);
  }
}
function output(result){
  if(result == "X"){
    createP("YOU WON!!!!!!")
  }
  else if(result == "O"){
    createP("YOU SUCK AT TIC-TAC-TOE")
  }
  else if(result == "tie"){
    createP("YOU ARE LUCKY IT'S A TIE");
  }
}
