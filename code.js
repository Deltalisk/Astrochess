
/*SETUP CODE*/
//exercises();

var cycleCode= "NoPlayerControl";
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

var cycleCode= "Unselected";
console.log("cycleCode: "+cycleCode);
/*END FIRST-TIME CODE*/

function setupBoard(){

  shipList.push(new ship(1, new vector(250, 300), new vector(50, 30), 1, "Kinetic"));
  shipList.push(new ship(2, new vector(150, 150), new vector(50, 30), 2, "Dust"));

}


function drawBoard(){
  gaCtx.fillStyle= "black";
  gaCtx.fillRect(0, 0, 1200, 800);
  // for(i= 0; i< shipList.length; i++){
  //   shipList[i].draw();
  //   //console.log("current ship:"+i)
  // }
  shipList.forEach(selfDraw);
  munitionList.forEach(selfDraw);
}

function processUserInput(e){

  var kcd= e.keyCode;

  console.log("keyup logged: "+kcd);

  if (kcd== 27){//esc
    cycleCode= "Unselected";
    shipList[selShipIndex].toggleSelect();
    selShipIndex= -1;
  }

  switch(cycleCode){
    case "Unselected":
      if (kcd== 13){
        endTurnSequence();
      }
      break;
    case "Selected":
      if (kcd== 77){//m
        cycleCode= "Moving";
      }
      else if (kcd== 87){//w
        cycleCode= "Aiming";
      }
  }

  drawBoard();
}

function processMouseMove(e){

  var m= new vector(e.clientX, e.clientY+document.body.scrollTop);

  var tempShip= isNearShip(m);
  if(tempShip> -1){
    shipList[tempShip].showMouseover();
  }

  switch (cycleCode) {
    case "Selected"://runs if a ship is selected
    //   var shipLoc= shipList[selShipIndex].pos;
    //
    //   //console.log(shipList[selShipIndex].maxThrust+", "+subVects(m, shipList[selShipIndex].pos).magnitude())
    //   if(shipList[selShipIndex].maxThrust<subVects(m, shipList[selShipIndex].pos).magnitude()
    // || shipList[selShipIndex].hasMoved)break;//This needs to be prettyfied with the resize function.
    //
    //   drawBoard();
    //   shipList[selShipIndex].showMouseover();
    //   gaCtx.beginPath();
    //   gaCtx.strokeStyle= "green";
    //   gaCtx.moveTo(shipLoc.x, shipLoc.y);
    //   gaCtx.lineTo(m.x, m.y);
    //   gaCtx.stroke();//draws the new thrust vector
    //   gaCtx.beginPath();
    //   gaCtx.strokeStyle= "white";
    //   gaCtx.moveTo(shipLoc.x, shipLoc.y);
    //   gaCtx.lineTo(m.x+shipList[selShipIndex].momentum.x, m.y+shipList[selShipIndex].momentum.y);
    //   gaCtx.stroke();//draws the total thrust vector
      break;
    case "Moving"://runs if a ship is going to thrust
    var shipLoc= shipList[selShipIndex].pos;

    //console.log(shipList[selShipIndex].maxThrust+", "+subVects(m, shipList[selShipIndex].pos).magnitude())
    if(shipList[selShipIndex].maxThrust<subVects(m, shipList[selShipIndex].pos).magnitude()
      || shipList[selShipIndex].hasMoved)break;//This needs to be prettyfied with the resize function.

      drawBoard();
      shipList[selShipIndex].showMouseover();
      gaCtx.beginPath();
      gaCtx.strokeStyle= "green";
      gaCtx.moveTo(shipLoc.x, shipLoc.y);
      gaCtx.lineTo(m.x, m.y);
      gaCtx.stroke();//draws the new thrust vector
      gaCtx.beginPath();
      gaCtx.strokeStyle= "white";
      gaCtx.moveTo(shipLoc.x, shipLoc.y);
      gaCtx.lineTo(m.x+shipList[selShipIndex].momentum.x, m.y+shipList[selShipIndex].momentum.y);
      gaCtx.stroke();//draws the total thrust vector
      break;
    case "Aiming"://runs if have selected ship and trying to shoot a thing
      var shipLoc= shipList[selShipIndex].pos;

    //console.log(shipList[selShipIndex].maxThrust+", "+subVects(m, shipList[selShipIndex].pos).magnitude())
    if(shipList[selShipIndex].maxFireDist<subVects(m, shipList[selShipIndex].pos).magnitude()
      || shipList[selShipIndex].hasFired)break;//This needs to be prettyfied with the resize function.

      drawBoard();
      shipList[selShipIndex].showMouseover();
      gaCtx.beginPath();
      gaCtx.strokeStyle= "green";
      gaCtx.moveTo(shipLoc.x, shipLoc.y);
      gaCtx.lineTo(m.x, m.y);
      gaCtx.stroke();//draws the new thrust vector
      gaCtx.beginPath();
      gaCtx.strokeStyle= "white";
      gaCtx.moveTo(shipLoc.x, shipLoc.y);
      gaCtx.lineTo(m.x+shipList[selShipIndex].momentum.x, m.y+shipList[selShipIndex].momentum.y);
      gaCtx.stroke();//draws the total thrust vector
      break;
    case "Unselected":

    default:

  }

}

function processMouseClick(e){

  var m= new vector(e.clientX, e.clientY+document.body.scrollTop);
  console.log("cycleCode: "+cycleCode);

  switch (cycleCode) {
    case "Unselected"://this is the default state
      var tempShip= isNearShip(m);
      console.log("mouse at "+m.print());
      if(tempShip> -1 && shipList[tempShip].team== player){
        // if(tempShip== selShipIndex){cycleCode= "Unselected";}
        cycleCode= "Selected";
        selShipIndex= tempShip;
        shipList[tempShip].toggleSelect();
        //ABOVE FUNCTION WILL NEED TO ITERATE OVER PROGRESSIVELY SMALLER PARTS OF THE shipList
      }
      break;
    case "Aiming"://this happens when a ship has been chosen to fire its weapons
      if(shipList[selShipIndex].maxFireDist<subVects(m, shipList[selShipIndex].pos).magnitude())break;
      shipList[selShipIndex].fire(subVects(m, shipList[selShipIndex].pos));
      cycleCode= "Unselected";
      shipList[selShipIndex].toggleSelect();
      selShipIndex= -1;
      break;
    case "Moving":
      if(shipList[selShipIndex].maxThrust<subVects(m, shipList[selShipIndex].pos).magnitude())break;
      shipList[selShipIndex].changeMove(subVects(m, shipList[selShipIndex].pos));
      cycleCode= "Unselected";
      shipList[selShipIndex].toggleSelect();
      selShipIndex= -1;
      break;
    case "Selected"://this happens when a ship has been selected, but nothing else
      var tempShip= isNearShip(m);
      if(tempShip== selShipIndex){//This runs to deselect the previously selected ship
        cycleCode= "Unselected";
        selShipIndex= -1;
        shipList[tempShip].toggleSelect();
      }else if(tempShip== -1){//run this case if no ship is clicked. This implements a move order
        if(shipList[selShipIndex].maxThrust<subVects(m, shipList[selShipIndex].pos).magnitude())break;
        shipList[selShipIndex].changeMove(subVects(m, shipList[selShipIndex].pos));
        cycleCode= "Unselected";
        shipList[selShipIndex].toggleSelect();
        selShipIndex= -1;
      }else{//runs if a different ship is clicked. Implements an attack order

      }
      break;
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

 /*CHECKS FOR WEAPON IMPACTS*/
 for(i= 0; i<munitionList.length; i++){
   for(j= 0; j<shipList.length; j++){
    //  console.log("Checking for impact events on NCC "+j);
    //  console.log("weapon "+i+" relative to NCC "+j+": "+subVects(shipList[j].pos, munitionList[i].pos).magnitude());
     if(subVects(shipList[j].pos, munitionList[i].pos).magnitude()<10){
       shipList[j].health-= munitionList[i].baseDamage;//this will also take into account velocity eventually
       //munitionList[i].momentum.add()//this should alter the weapon's momentum based on the ship's
      //  console.log("Registering an impact event on NCC "+j);
     }
   }
 }

 /*ENGAGE SHIP ORDERS*/
 //engages ship's weapons orders
 // for(i= 0; i< shipList.length; i++){
 //   shipList[i].fire();
 //   console.log("NCC "+i+" firing her main guns!");//THIS IS TRIGGERING EVERY TIME. BUG?
 // }

 //engages ship's thrust orders, and then moves it
 for(i= 0; i< shipList.length; i++){
   if(shipList[i].team== player)shipList[i].move();
 }

 //Checks for ships and weapons that have le5ft the battlespace and won't return
 cleanBoard();

 drawBoard();

 iteratePlayer();
 console.log("Now Player "+player+"'s turn.");
 cycleCode= "Unselected"

}

function ship(tempTeam, tempPos, tempMoment, tempHull, tempWep){//this is the method for ships
  // if(!((tempPos instanceof vector) && (tempMove instanceof vector)))return;//contructors: vector, vector, int, int

  this.team= tempTeam;
  this.pos= tempPos;
  this.momentum= tempMoment;
  this.hull= tempHull;
    this.maxThrust= 100-15*this.hull;//eventually this should get a lookup. balance TBD.
    this.maxHealth= 80+20*this.hull;//more balance TBD.
  this.weapon= tempWep;
    this.maxFireDist= 200;//eventually gets a lookup. balance TBD
  // this.moveOrder= null;
  // this.wepOrder= null;
  this.isSelected= false;
  this.hasMoved= false;
  this.hasFired= false;
  this.health= this.maxHealth;
  // this.isMouesddOver= false;

  this.draw= function(){//draws the vessel at its current location
    gaCtx.beginPath();//draws the movement vector. PLACEHOLDER
    gaCtx.strokeStyle= "white";
    gaCtx.moveTo(this.pos.x, this.pos.y);
    gaCtx.lineTo(this.pos.x+this.momentum.x, this.pos.y+this.momentum.y);
    //gaCtx.closePath();
    gaCtx.stroke();

    if(this.team== 1)gaCtx.fillStyle= "blue";
    else if(this.team== 2)gaCtx.fillStyle= "gray";
    else gaCtx.fillStyle= "white";
    gaCtx.beginPath();
    gaCtx.arc(this.pos.x, this.pos.y, 10, 0, 2*Math.PI);
    gaCtx.fill();

    if(this.isSelected){//creates a box to indicate selection
      gaCtx.strokeStyle= "green";
      // gaCtx.strokeStyle= "3px";
      gaCtx.beginPath();
      gaCtx.arc(this.pos.x, this.pos.y, 10, 0, 2*Math.PI);
      gaCtx.stroke();
    }

    gaCtx.beginPath();
    switch(cycleCode){
      case("Moving"):
        gaCtx.strokeStyle= "green";
        //gaCtx.fillStyle= ???
        gaCtx.arc(this.pos.x, this.pos.y, this.maxThrust, 0, 2*Math.PI);
        gaCtx.stroke();
        break;
      case("Aiming"):
        gaCtx.strokeStyle= "green";
        //gaCtx.fillStyle= ???
        gaCtx.arc(this.pos.x, this.pos.y, this.maxFireDist, 0, 2*Math.PI);
        gaCtx.stroke();
        break;
    }

    if(this.health<=0)gaCtx.strokeText("CONNECTION LOST", this.pos.x, this.pos.y);
    gaCtx.stroke();
    console.log("Health: "+this.health+"/"+this.maxHealth);
  }


  this.showMouseover= function(){
    //console.log("cycleCode: "+cycleCode);
    if(this.health>0){
      gaCtx.textAlign= "center";
      gaCtx.font= "Courier New, Courier, monospace";//ought to get the right font and color to apply.
      gaCtx.font= "20px green";
      gaCtx.strokeText("NCC 1", this.pos.x, this.pos.y+25);//this ought to indicate hull size and number
      //gaCtx.stroke();
      gaCtx.font= "10px";
      gaCtx.strokeText("Hull: "+this.health+"/"+this.maxHealth, this.pos.x, this.pos.y+40);
      gaCtx.strokeText("Wep: "+this.weapon, this.pos.x, this.pos.y+55);
    }
  }

  // this.drawTootlip= function(){//draws a tooltip just below the vessel indicating its status
  //
  // }

  this.fire= function(target){//implements the ship's firing order, if it exists
    //if(target instanceof vector)var tgtVect=
    console.log("Attempting to fire");
    if(!this.hasFired && this.health>0){
      switch(this.weapon){//performs weapon actions based upon, well obviously, the weapon
        case "Dust":
          for(var i= 0; i<10; i++){
            munitionList.push(new weapon(new vector(this.pos),
            addVects(this.momentum, new vector(target.x-15+Math.random()*30, target.y-15+Math.random()*30), this.weapon)));
          }
        break;
        case "Kinetic":
          // munitionList.push(new weapon(new vector(this.pos), addVects(this.momentum, target), this.weapon));
        case "Bomb":
          munitionList.push(new weapon(new vector(this.pos), addVects(this.momentum, target), this.weapon));
        break;
        case "Fighters":
        case "Bombers":
        break;
        case "Lasers":
          if(target instanceof ship){
            target.health-= this.baseDamage;
          }
        break;
      }
  }


  }

  this.thrust= function(){//implements the ship's thrust order
    // if(typeof this.moveOrder !== 'undefined')return;
    // if(this.moveOrder.target instanceof vector){
    //   this.momentum.add(this.moveOrder);
    // }
  }

  this.changeMove= function(newMove){//this should eventually implement sanity-checking
    if(newMove instanceof vector && this.hasMoved== false && this.health> 0){
      this.momentum.add(newMove);
      this.hasMoved= true;
    }
  }

  this.move= function(){//moves the ship in accordance with its momentum
    console.log("Ship momentum: "+this.momentum.print());
    this.pos.add(this.momentum);
    this.hasMoved= false;
  }

  this.toggleSelect= function(){//toggles "isSelected"
    if(this.isSelected== false) this.isSelected= true;
    else this.isSelected= false;
  }

}

function weapon(tempPos, tempMoment, tempType){

  this.pos= tempPos;
  this.momentum= tempMoment;
  this.wepType= tempType;
  var tmpDmg= 10;//WepType Damage Lookup
  if(this.wepType== "Kinetic")tmpDmg= 45;
  else if (this.wepType== "Dust")tmpDmg= 5;
  // else if (this.wepType== "Bomb")tmpDmg//This should be a function damaging all nearby ships
  else tmpDmg= 10;
  this.baseDamage= tmpDmg;//this should get a lookup from wepType eventually
  // console.log("New weapon");

  this.draw= function(){
    //console.log("drawing a "+this.wepType+" device at ("+this.pos.x+", "+this.pos.y+").");
    gaCtx.beginPath();//draws the movement vector. PLACEHOLDER
    gaCtx.strokeStyle= "white";
    gaCtx.moveTo(this.pos.x, this.pos.y);
    gaCtx.lineTo(this.pos.x+this.momentum.x, this.pos.y+this.momentum.y);
    //gaCtx.closePath();
    gaCtx.stroke();
    gaCtx.beginPath();
    //gaCtx.moveTo(this.pos.x, this.pos.y);
    gaCtx.arc(this.pos.x+this.momentum.x, this.pos.y+this.momentum.y, 10, 0, 2*Math.PI);
    gaCtx.stroke();
    gaCtx.font= "Courier New, Courier, monospace";//ought to get the right font and color to apply.
    gaCtx.font= "20px green";
    //gaCtx.beginPath();
    switch(this.wepType){
      case "Kinetic":
        gaCtx.strokeText("K", this.pos.x, this.pos.y);
        break;
      case "Dust":
        gaCtx.strokeText("d", this.pos.x, this.pos.y);
        break;
      case "Bomb":
        gaCtx.strokeText("B", this.pos.x, this.pos.y);
        break;
    }
  }

  this.move= function(){
    // console.log("Wep momentum: "+this.momentum.print());
    this.pos.add(this.momentum);
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
      if(distVect.magnitude()<d || -distVect.magnitude()>d){//there's a bug here in the selection system. I need to fix it.
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
  if(tempX instanceof vector && tempY== null){
    this.x= tempX.x;
    this.y= tempX.y;
  }else{
    this.x= tempX;
    this.y= tempY;
  }

  this.add = function(altVect){//Adds the vectors and updates this one with the results
    if(!(altVect instanceof vector))return;
    this.x += altVect.x;
    this.y += altVect.y;
  }

  this.subtract= function(altVect){//subs the vectors and updates this one with the results.
    if(!(altVect instanceof vector))return;
    this.x -= altVect.x;
    this.y -= altVect.y;
  }

  this.print= function(){//returns the vector in (x, y) form
    return "("+this.x+", "+this.y+")";
  }

  this.magnitude= function(){//returns the hypotenuse of the vector
    return Math.sqrt(this.x*this.x + this.y*this.y);
  }

  this.resize= function(newMag){//modifies the vector to have the new magnitude. Normalizable via passing 1.
    this.x= this.x/this.magnitude();
    this.x= this.x*newMag;
    this.y= this.y/this.magnitude();
    this.y= this.y*newMag;
  }
}

function addVects(v1, v2){//returns the sum of two vectors in a new vector
  if(!((v1 instanceof vector) || (v2 instanceof vector)))return;
  newX= v1.x+v2.x;
  newY= v1.y+v2.y;
  return new vector(newX, newY);
}

function subVects(v1, v2){//returns the difference of two vectors in a new vector
  if(!((v1 instanceof vector) || (v2 instanceof vector)))return;
  newX= v1.x-v2.x;
  newY= v1.y-v2.y;
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

function cleanBoard(){//stub

}

function selfDraw(thing){
  thing.draw();
}

function testingMethod(){

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

//cd '..\..\School Docs\2015-2016\Advanced Programming\Astrochess'
//git add -A
//git commit -m ""
//git push origin master
