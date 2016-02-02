
/*SETUP CODE*/
//exercises();

var cycleCode= 0;
var gameArea= document.getElementById("gameArea");
var gaCtx= gameArea.getContext("2d");
var selShipIndex= -1;
document.addEventListener( 'keyup', processUserInput);
gameArea.addEventListener( 'mousemove', processMouseMove);
gameArea.addEventListener( 'click', processMouseClick)

/*ARRAYS*/
var shipList= [];//contains the ships
var munitionList= [];//contains the weapons
//var orderList= [];//contains orders
var player= 1;

/*STARTER CODE*/
setupBoard();
setTimeout(drawBoard, 100);
testingMethod();

cycleCode= "Unselected";
/*END FIRST-TIME CODE*/

function setupBoard(){

  var v1= new vector(300, 300);
  shipList.push(new ship(1, v1, new vector(22, 12), 1, 1));

}


function drawBoard(){
  gaCtx.fillStyle= "black";
  gaCtx.fillRect(0, 0, 1200, 800);
  for(i= 0; i< shipList.length; i++){
    shipList[i].draw();
    //console.log("current ship:"+i)
  }
  // testingMethod();
}

function processUserInput(e){

  var kcd= e.keyCode;

  console.log("keyup logged: "+kcd);

  switch(cycleCode){
    case "Unselected":
      if (kcd== 13){
        endTurnSequence();
      }
      break;
    case "Selected":
      if (kcd== 27){
        cycleCode= "Unselected";
        shipList[selShipIndex].toggleSelect();
        selShipIndex= -1;
      }
  }

  drawBoard();
}

function processMouseMove(e){

  var m= new vector(e.clientX, e.clientY);

  var tempShip= isNearShip(m);
  if(tempShip> -1){
    shipList[tempShip].showMouseover();
  }

  switch (cycleCode) {
    case "Selected":
      var shipLoc= shipList[selShipIndex].pos;
      drawBoard();
      gaCtx.beginPath();
      gaCtx.strokeStyle= "green";
      gaCtx.moveTo(shipLoc.x, shipLoc.y);
      gaCtx.lineTo(m.x, m.y);
      gaCtx.stroke();
      //console.log("trying to draw a new path");
      break;
    case "Unselected":

    default:

  }

}

function processMouseClick(e){

  var m= new vector(e.clientX, e.clientY);

  switch (cycleCode) {
    case "Unselected"://this is the default state
      var tempShip= isNearShip(m);
      if(tempShip> -1){
        // if(tempShip== selShipIndex){cycleCode= "Unselected";}
        cycleCode= "Selected";
        selShipIndex= tempShip;
        shipList[tempShip].toggleSelect();
        //ABOVE FUNCTION WILL NEED TO ITERATE OVER PROGRESSIVELY SMALLER PARTS OF THE shipList
      }
      break;
    case "WepSelected"://this happens when a ship has been chosen to fire its weapons

      break;
    case "Selected"://this happens when a ship has been selected, but nothing else
      var tempShip= isNearShip(m);
      if(tempShip== selShipIndex){//This runs to deselect the previously selected ship
        cycleCode= "Unselected";
        selShipIndex= -1;
        shipList[tempShip].toggleSelect();
      }else{//runs if no ship is near

      }
    case "NoPlayerControl":
    default:
  }

  drawBoard();

}

function endTurnSequence(){
  cycleCode= "NoPlayerControl";
  /*MOVES WEAPONS*/
 for(i= 0; i<munitionList.length; i++){
   munitionList[i].move();
 }

 /*ENGAGE SHIP ORDERS*/
 //engages ship's weapons orders
 for(i= 0; i< shipList.length; i++){
   shipList[i].fire();
   console.log("NCC "+i+" firing her main guns!");//THIS IS TRIGGERING EVERY TIME. BUG?
 }

 //engages ship's thrust orders, and then moves it
 for(i= 0; i< shipList.length; i++){
   shipList[i].thrust();
   shipList[i].move();
   console.log("NCC "+i+" in motion");
 }

 drawBoard();

 iteratePlayer();
 cycleCode= "Unselected"

}

function ship(tempTeam, tempPos, tempMoment, tempHull, tempWep){//this is the method for ships
  // if(!((tempPos instanceof vector) && (tempMove instanceof vector)))return;//contructors: vector, vector, int, int

  this.team= tempTeam;
  this.pos= tempPos;
  this.momentum= tempMoment;
  this.hull= tempHull;
  this.weapon= tempWep;
  this.moveOrder= null;
  this.wepOrder= null;
  this.isSelected= false;
  // this.isMouesddOver= false;

  this.draw= function(){//draws the vessel at its current location
    gaCtx.beginPath();//draws the movement vector. PLACEHOLDER
    gaCtx.strokeStyle= "white";
    gaCtx.moveTo(this.pos.x, this.pos.y);
    gaCtx.lineTo(this.pos.x+this.momentum.x, this.pos.y+this.momentum.y);
    //gaCtx.closePath();
    // gaCtx.stroke();

    gaCtx.fillStyle= "white";
    gaCtx.fillRect(this.pos.x, this.pos.y, 10, 10);//draws the box representing the hull. PLACEHOLDER
    gaCtx.stroke();

    // if(this.isMouesddOver){//INCOMPLETE
    //
    //   // gaCtx.stroke();
    // }

    this.showMouseover= function(){
      console.log("I should draw my mouseover!");
    }

    if(this.isSelected){//creates a box to indicate selection
      gaCtx.beginPath();
      gaCtx.strokeStyle= "red";
      // gaCtx.lineWidth= "1";
      gaCtx.rect(this.pos.x, this.pos.y, 10, 10);//draws a selector around the ship. PLACEHOLDER
      gaCtx.stroke();
    }

    gaCtx.stroke();

  }

  this.drawTootlip= function(){//draws a tooltip just below the vessel indicating its status

  }

  this.fire= function(){//implements the ship's firing order, if it exists

  }

  this.thrust= function(){//implements the ship's thrust order
    if(typeof this.moveOrder !== 'undefined')return;
    if(this.moveOrder.target instanceof vector){
      this.momentum.add(this.moveOrder);
    }


  }

  this.move= function(){//moves the ship in accordance with its momentum
    this.pos.add(this.momentum);
  }

  this.toggleSelect= function(){//toggles "isSelected"
    if(this.isSelected== false) this.isSelected= true;
    else this.isSelected= false;
  }

}

function weapon(tempPos, tempType){
  this.pos= tempPos;
  this.type= tempType;

  this.draw= function(){

  }

  this.move= function(){

  }
}

function isNearShip(loc, distance, shipIndex){//This still needs to be able to find closest, rather than first, ship
  if(!(loc instanceof vector)) return;

  var d;
  if(distance== null || isNaN(distance))d= 10;
  else d= distance;

  if(shipIndex != null){
    //UNFINISHED: should check proximity of a particular vessel
  }else{//UNFINISHED: this should check for the nearest vessel within d
    for(var i= 0; i<shipList.length; i++){
      var distVect= subVects(shipList[i].pos, loc);
      if(distVect.magnitude()<d){
        return i;
      }
    }
  }
  return -1;
}

function order(tempTgt){//these store directions for ships to execute on their turn
  this.target= tempTgt;//may be a vector (for kinetic weps) or a vessel (for lasers)
  //INCOMPLETE
}

function vector(tempX, tempY){//This specifies a vector
  this.x= tempX;
  this.y= tempY;

  this.add = function(altVect){//Adds the vectors and updates this one with the results
    if(!(altVect instanceof vector))return;
    this.x += altVect.x;
    this.y += altVect.y;
  }

  this.subtract= function(altVect){//subs the vectors and updates this one with the results.
    if(!(altVect instanceof vector))return;
    this.x -= altVect.y;
    this.y -= altVect.y;
  }

  this.print= function(){//returns the vector in (x, y) form
    return "("+this.x+", "+this.y+")";
  }

  this.magnitude= function(){//returns the hypotenuse of the vector
    return Math.sqrt(this.x*this.x + this.y*this.y);
  }
}

function addVects(v1, v2){//returns the sum of two vectors in a new vector
  if(!((v1 instanceof vector) || (v2 instanceof vector)))return;
  newX= v1.x+v2.x;
  newY= v2.y+v2.y;
  return new vector(newX, newY);
}

function subVects(v1, v2){//returns the difference of two vectors in a new vector
  if(!((v1 instanceof vector) || (v2 instanceof vector)))return;
  newX= v1.x-v2.x;
  newY= v2.y-v2.y;
  return new vector(newX, newY);
}

function iteratePlayer(){
  if(player==1){
    player= 2;
  }
  else if(player== 2){
    player= 1;
  }
  else{
    player= 1;
  }
}

function testingMethod(){
  var v1= new vector(300, 300);
  var v2= new vector(100, 75);
  console.log(subVects(v1, v2));
}

function exercises(){
  for(var i= 0; i<7; i++){
    var str= "#";
    for(var j= 0; j<i; j++){
      str = str+"#";
    }
    console.log(str);
  }

  for(var i= 0; i<100; i++){
    var words= ""
    if(i%3== 0)words+= "Fizz";
    if(i%5== 0)words+= "Buzz";
    if(words.length>0)console.log(words);
    else console.log(i);
  }

  var gridsize= 8;
  for(var i= 0; i<gridsize; i++){
    var tempWords= ""
    for(var j= 0; j<gridsize; j++){
      if((j+i)%2== 0)tempWords+=" ";
      else tempWords+="#";
    }
    console.log(tempWords);
  }
}
