let minesweeperHeight=500
let minesweeperWidth=500
let minesweeperTopLeft=[50,50]
  let gridwidth;
let gridheight;
let bombs;
let grid=[];
let bombPrecedence=[]
let gameStatus=""
let game_finished = false;
let finalTime=0
let initialTime=0
let actions=0
let flags=0
let mode="Reveal"
let diffTextSize=0
let diff="Easy"
let xpoint
let ypoint
let xwidth
let yheight
let noCanvasWidth=180;


class cell{
    constructor(y,x,contents){
      this.x=x
      this.y=y
      this.revealed= false
      this.contents=contents
      this.flagged=false
    }
  flag(){
    if (this.revealed==false){
    if(this.flagged){
      this.flagged=false
      flags=flags-1
    }
    else{
      this.flagged=true
      flags=flags+1
    }
    
    }
  }
  reveal() {
    if(this.flagged==false){
    this.revealed=true
    if(this.contents=="0"){
      revealNeighbours(grid,this.y,this.x,gridwidth,gridheight)
    }
      if(checkForWin(grid)){
        noLoop()
        document.getElementById("vConsole").innerHTML="YOU WIN! YOUR TIME: "+(millis()/1000).toFixed(2)+" seconds"
        console.log("YOU WIN!")
        gameStatus="You Win!"
        game_finished=true
        finalTime=((millis()-initialTime)/1000).toFixed(2)
        
      }
    if(this.contents=="Bomb"&& !game_finished){
      noLoop()
      game_finished=true
      console.log("GAME OVER")
      gameStatus="Game Over!"
      if(actions>0){
      finalTime=((millis()-initialTime)/1000).toFixed(2)
      }
      else if(actions==0){
        finalTime=0.00
      }
    }
  }
  }
  setContents(newContents){
    this.contents=newContents
  }
}
function changeMode(){
  if (mode=="Reveal"){
    mode="Flag"
  }
  else if(mode=="Flag"){
mode="Reveal"
  }
}
function revealNeighbours(grid,row,col,gridwidth,gridheight){
  for (let neighbour of generateNeighbours(row,col,gridwidth,gridheight)){
       if(neighbour.revealed==false)
         neighbour.reveal()
       }
}
function * generateNeighbours(row,col,gridwidth,gridheight){
  
  for(let y=row-1;y<row+2;y++){
    for(let x=col-1;x<col+2;x++){
      //console.log(yOff+row,xOff+col,grid.length,grid[row].length)
       if (!(x==col && y==row)&& y>=0 &&y<gridheight&& x>=0&&x<gridwidth){
         yield grid[y][x]
       }
      
    }
  }
}
function generateBombOrder(gridwidth, gridheight){
  let bombOrder=[]
  for(let row=0;row<gridheight;row++){
    for(let col=0;col<gridwidth;col++){
      bombOrder.push([row,col])
      shuffle(bombOrder,true)
      
    }
  }
  return bombOrder
  
}

function drawOutLines(gridwidth,gridheight){
  for(horiz=1;horiz<gridheight;horiz++){
    line(minesweeperTopLeft[0],minesweeperHeight/gridheight*horiz+minesweeperTopLeft[1],minesweeperWidth+minesweeperTopLeft[0],minesweeperHeight/gridheight*horiz+minesweeperTopLeft[1])
    
  }
  for(vertic=1;vertic<gridwidth;vertic++){
    line(minesweeperWidth/gridwidth*vertic+minesweeperTopLeft[0],0+minesweeperTopLeft[1],minesweeperWidth/gridwidth*vertic+minesweeperTopLeft[0],minesweeperHeight+minesweeperTopLeft[1])
  }
 
}
function genNumbers(grid,gridwidth,gridheight){
  for(row=0;row<gridheight;row++){
    for(col=0;col<gridwidth;col++){
      if(grid[row][col].contents!="Bomb"){
        let bombCount=0
        for(let neighbour of generateNeighbours(row,col,gridwidth,gridheight)){
          
          if(neighbour.contents=="Bomb"){
            bombCount+=1
          }
         
          
        }
        grid[row][col].setContents(bombCount)
      }
    }
  }
  return grid
}
function drawgrid(grid,gridwidth,gridheight){
  
  drawOutLines(gridwidth,gridheight)
  
  for(row=0;row<grid.length;row++){
    for(col=0;col<grid[row].length;col++){
      if(grid[row][col].revealed&&grid[row][col].contents!="Bomb"){
      text(grid[row][col].contents,(minesweeperWidth/gridwidth*col)+(minesweeperWidth/gridwidth/2)+minesweeperTopLeft[0],(minesweeperHeight/gridheight*row)+(minesweeperHeight/gridheight/2)+minesweeperTopLeft[1])
  }
      else if(grid[row][col].revealed&&grid[row][col].contents=="Bomb"){
        
            xpoint=minesweeperWidth/gridwidth*col+minesweeperTopLeft[0]
             ypoint=minesweeperHeight/gridheight*row+minesweeperTopLeft[1]
        xwidth=minesweeperWidth/gridwidth
        yheight=minesweeperHeight/gridheight
        rectMode(CORNERS)
  strokeWeight(1)
        colorMode(RGB)
  rectMode(CENTER)
  
  //inexact rect
  fill(220)
  rect(xpoint+xwidth/2,ypoint+yheight/16*6,xwidth/16,yheight/4)
        
  fill(10)
  ellipse(xpoint+xwidth/2,ypoint+yheight/16*11,xwidth/2,yheight/2)
  
fill(255,140,0)
        
        strokeWeight(0)
        ellipse(xpoint+xwidth/2,ypoint+yheight/16*3,yheight/32*6)
        
        beginShape()
        vertex(xpoint+xwidth/2,ypoint+yheight/32)
        vertex((xpoint+xwidth/2)-(yheight/32*3),ypoint+yheight/16*3)
         vertex((xpoint+xwidth/2)+(yheight/32*3),ypoint+yheight/16*3)
        endShape()
        strokeWeight(2)
        fill(0)
      }
     else if(grid[row][col].flagged){
        xpoint=minesweeperWidth/gridwidth*col+minesweeperTopLeft[0]
             ypoint=minesweeperHeight/gridheight*row+minesweeperTopLeft[1]
        xwidth=minesweeperWidth/gridwidth
        yheight=minesweeperHeight/gridheight
       rectMode(CENTER)
       strokeWeight(1)
       fill(0)
       rect(xpoint+xwidth/8*3,ypoint+yheight/2,xwidth/16,yheight/4*3)
       fill(255,0,0)
       strokeWeight(0)
       beginShape()
       vertex((xpoint+xwidth/8*3)+xwidth/32,ypoint+yheight/8)
       vertex((xpoint+xwidth/8*3)+xwidth/32,ypoint+yheight/2)
       vertex((xpoint+xwidth/8*5)+xwidth/32,ypoint+yheight/16*5)
       endShape()
       rectMode(CORNER)
       strokeWeight(2)
       fill(0)
     }
        
     // else{text("",(minesweeperWidth/gridwidth*col)+(minesweeperWidth/gridwidth/2),(minesweeperHeight/gridheight*row)+(minesweeperHeight/gridheight/2))}
    }
  }
}
function populateGrid(grid,gridwidth,gridheight,bombs,bombPlaceOrder){
  for (row=0;row<gridheight;row++){
    grid.push([])
    for(col=0;col<gridwidth;col++){
      grid[row].push(new cell(row,col,"empty"))
    }
  }
  for(let bomb=0;bomb<bombs;bomb++){
    grid[bombPlaceOrder[bomb][0]][bombPlaceOrder[bomb][1]].setContents("Bomb")
  }
  
  grid=genNumbers(grid,gridwidth,gridheight)
  return grid
}
function windowResized(){
  resizeCanvas(windowWidth-noCanvasWidth,windowHeight)
}
function Restart(){
 

 grid=[];
 bombPrecedence=[]
gameStatus=""
 game_finished = false;
 finalTime=0
 initialTime=0
 actions=0
 flags=0
 mode="Reveal"
 diffTextSize=0
 
  
  if (diff=="Easy"){
    diffTextSize=15
    gridheight=9
    gridwidth=9
    bombs=10
  }
  else if(diff=="Hard"){
    diffTextSize=10
    gridwidth=16
    gridheight=16
    bombs=40
  }
  textSize(15)
  strokeWeight(2)
  textAlign(CENTER,CENTER)
  bombPrecedence=generateBombOrder(gridwidth,gridheight)
  grid= populateGrid(grid,gridwidth,gridheight,bombs,bombPrecedence)
  
  bombPrecedence=bombPrecedence.slice(bombs)
  
 
 
 loop()
}
function setup() {

  let canvas=createCanvas(windowWidth-noCanvasWidth,windowHeight);
  
  canvas.position(0,0)
   
    let modeButton=createButton("Toggle Mode (Touchscreen only)")
  modeButton.position(minesweeperWidth+minesweeperTopLeft[0]+100,minesweeperTopLeft[1]+minesweeperHeight/4)
  modeButton.touchStarted(changeMode)
  let restartButton=createButton("Restart Game(R)")
  restartButton.position(minesweeperWidth+minesweeperTopLeft[0]+100,minesweeperTopLeft[1]+minesweeperHeight/2)
  restartButton.mousePressed(Restart)
  restartButton.touchStarted(Restart)
  let easyButton=createButton("Easy")
  easyButton.position(10,10)
  easyButton.mousePressed(diffEasy)
  easyButton.touchStarted(diffEasy)
  hardButton=createButton("Hard")
  hardButton.position(65,10)
  hardButton.mousePressed(diffHard)
  hardButton.touchStarted(diffHard)



  Restart()
 
}

function diffHard(){
  if(diff!="Hard"){
    diff="Hard"
    Restart()
  }
}
function diffEasy(){
  if(diff!="Easy"){
    diff="Easy"
    Restart()
  }
}
function draw() {
  
  
  background(255);
  rectMode(CORNER)
  fill(255)
  rect(minesweeperTopLeft[0],minesweeperTopLeft[1],minesweeperWidth,+minesweeperHeight)
  fill(0)
  textSize(diffTextSize)
  drawgrid(grid,gridwidth,gridheight)
   textSize(15)
  if(game_finished==false&&actions>0){
  text(((millis()-initialTime)/1000).toFixed(2),minesweeperTopLeft[0]+minesweeperWidth+50,minesweeperHeight/2+minesweeperTopLeft[1])
  }
  else if(game_finished==false&&actions==0){
    text("0.00",minesweeperTopLeft[0]+minesweeperWidth+50,minesweeperHeight/2+minesweeperTopLeft[1])
  }
 else{
   
    text(finalTime,minesweeperTopLeft[0]+minesweeperWidth+50,minesweeperHeight/2+minesweeperTopLeft[1])
  }
  text("TOTAL MINES: "+bombs.toString()+"\nFLAGS PLACED: "+flags.toString(),minesweeperWidth/2+minesweeperTopLeft[0],30+minesweeperHeight+minesweeperTopLeft[1])
  text(gameStatus,minesweeperTopLeft[0]+minesweeperWidth/2,minesweeperTopLeft[1]+minesweeperHeight+80)
  textAlign(LEFT)
  text("Current mode: "+mode,minesweeperWidth+minesweeperTopLeft[0]+100,minesweeperTopLeft[1]+minesweeperHeight/4+50)
  textAlign(CENTER)
  rectMode(RADIUS)
 text("Click the 'How To Play' link on the right hand side to learn how the game works and what the controls are.",minesweeperWidth+minesweeperTopLeft[0]+100,minesweeperTopLeft[1]+minesweeperHeight/2+50,125,250)
  rectMode(CORNER)
  textAlign(LEFT,CENTER)
  text("Current difficulty: "+diff,120,22)
  textAlign(CENTER,CENTER)
}
function checkForWin(grid){
  won=true
  for(row=0;row<grid.length;row++){
    for(col=0;col<grid[row].length;col++){
      if(grid[row][col].contents!="Bomb" && grid[row][col].revealed==false){
        return false
      }
    }
  }
  return true
}
function mousePressed(){
  let w=minesweeperWidth;
  let h= minesweeperHeight;
  if(mouseButton===LEFT){
  for (let row = 0; row < gridheight; row++) {
      for (let col = 0; col < gridwidth; col++) {
        if (mouseX > (w / gridwidth * col+minesweeperTopLeft[0]) && mouseX < (w / gridwidth * (col + 1)+minesweeperTopLeft[0]) && mouseY > (h / gridheight * row+minesweeperTopLeft[1]) && mouseY < (h / gridheight * (row + 1)+minesweeperTopLeft[1])){ 
          if(grid[row][col].revealed==false){
            grid[row][col].reveal()
            actions+=1
            if(actions==1){
              initialTime=millis()
            }
          }
        }
    }
  }   
  } 
  if(mouseButton===CENTER){
     for (let row = 0; row < gridheight; row++) {
      for (let col = 0; col < gridwidth; col++) {
        if (mouseX > (w / gridwidth * col+minesweeperTopLeft[0]) && mouseX < (w / gridwidth * (col + 1)+minesweeperTopLeft[0]) && mouseY > (h / gridheight * row+minesweeperTopLeft[1]) && mouseY < (h / gridheight * (row + 1)+minesweeperTopLeft[1])){ 
          grid[row][col].flag()
          actions+=1
          if(actions==1){
            initialTime=millis()
          
          }
          }
        }
    }
    return false
  } 
  
}
function keyPressed(){
  let w=minesweeperWidth;
  let h= minesweeperHeight;
  if(keyCode===82){
    Restart()
  }
  else if (keyCode===32){
    
        for (let row = 0; row < gridheight; row++) {
      for (let col = 0; col < gridwidth; col++) {
        if (mouseX > (w / gridwidth * col+minesweeperTopLeft[0]) && mouseX < (w / gridwidth * (col + 1)+minesweeperTopLeft[0]) && mouseY > (h / gridheight * row+minesweeperTopLeft[1]) && mouseY < (h / gridheight * (row + 1)+minesweeperTopLeft[1])){ 
          grid[row][col].flag()
          actions+=1
          if(actions==1){
            initialTime=millis()
          
          }
          }
        }
    }
    
  
  }
}
function touchStarted(){
  let w=minesweeperWidth;
  let h= minesweeperHeight;
  
  if(mode=="Reveal"){
     for (let row = 0; row < gridheight; row++) {
      for (let col = 0; col < gridwidth; col++) {
        if (mouseX > (w / gridwidth * col+minesweeperTopLeft[0]) && mouseX < (w / gridwidth * (col + 1)+minesweeperTopLeft[0]) && mouseY > (h / gridheight * row+minesweeperTopLeft[1]) && mouseY < (h / gridheight * (row + 1)+minesweeperTopLeft[1])){ 
          if(grid[row][col].revealed==false){
            grid[row][col].reveal()
            actions+=1
            if(actions==1){
              initialTime=millis()
            }
          }
        }
    }
  }
  }
  else if(mode=="Flag"){
    for (let row = 0; row < gridheight; row++) {
      for (let col = 0; col < gridwidth; col++) {
        if (mouseX > (w / gridwidth * col+minesweeperTopLeft[0]) && mouseX < (w / gridwidth * (col + 1)+minesweeperTopLeft[0]) && mouseY > (h / gridheight * row+minesweeperTopLeft[1]) && mouseY < (h / gridheight * (row + 1)+minesweeperTopLeft[1])){ 
          grid[row][col].flag()
          actions+=1
          if(actions==1){
            initialTime=millis()
          
          }
          }
        }
    }
    
  }
  return false
}
