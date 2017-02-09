;(function(){
  const ctx = document.getElementById("canvas").getContext("2d");
  class Random{
    static get(init,final){
      return Math.floor(Math.random() * final) + init;
    }
  }

  class Food{
    constructor(x,y){
      this.x = x;
      this.y = y;
      this.width = 10;
      this.height = 10;
    }

    draw(){
      ctx.fillRect(this.x,this.y,this.width,this.height);
    }
    static generate(){
        const x = Random.get(0,600);
        const y = Random.get(0,400);     
        return new Food(x,y);
    }
  }
  class Square{
    constructor(x,y){
      this.width = 10
      this.height = 10
      this.speed = 10
      this.x = x
      this.y = y
      this.backSquare = null
    }

    copy(){
      if(this.hasBack()){
        this.backSquare.copy() 
        
        this.backSquare.x = this.x
        this.backSquare.y = this.y 

      }    
    }

    right(){
      this.copy()
      this.x += this.speed    
    }

    left(){
      this.copy()
      this.x -= this.speed    
    }

    up(){
      this.copy()
      this.y -= this.speed
    }

    down(){
      this.copy()
      this.y += this.speed
    }

    addNew(){
      if(this.hasBack()){
        this.backSquare.addNew()
      }else{
        console.log("X es:" + this.x)
        this.backSquare = new Square(this.x - (this.width+5),this.y)
      }
    }

    hasBack(){
      return this.backSquare !== null
    }
    draw(){
      ctx.fillRect(this.x,this.y,this.width,this.height)
      if(this.hasBack()) this.backSquare.draw()
    }

    hit(square,imSecond=false){
      if(square === null && !this.hasBack()) return false
      if(square === null) return this.backSquare.hit(this,true)
      if(imSecond && !this.hasBack()) return false
      if(imSecond) return this.backSquare.hit(square)
      
      
      
      if(this.hasBack()) return snakeHit(square,this) || this.backSquare.hit(square)
      
      return snakeHit(square,this)    
    }

    hitBorder()
    {
       return this.x>480 || this.x<10 || this.y>280 || this.y<0
    }

  }
  class Snake{
    constructor(){
      this.mainSquare = new Square(0,0)
      this.eat()
      this.eat()
      this.horizontalDirection = "right"
      this.verticalDirection = ""
    }

    right(){
      this.clear()
      this.horizontalDirection = "right"
    }

    left(){
      if(this.horizontalDirection == "right")
        return;
      this.clear()
      this.horizontalDirection = "left"
    }

    up(){
      this.clear()
      this.verticalDirection = "up"
    }

    down(){
      this.clear()
      this.verticalDirection = "down"
    }

    eat(){
      this.mainSquare.addNew()
    }

    clear(){
      this.verticalDirection = ""
      this.horizontalDirection = ""
    }

    move(){
      if(this.horizontalDirection == "right"){
        this.mainSquare.right()
      }else if(this.horizontalDirection == "left"){
        this.mainSquare.left()
      }else if(this.verticalDirection == "down"){
        this.mainSquare.down()
      }else if(this.verticalDirection == "up"){
        this.mainSquare.up()
      }
    }
    draw(){
      this.mainSquare.draw()
    }
    alive(){
      return !this.mainSquare.hit(null) && !this.mainSquare.hitBorder()
    }
  }
  
  const snake = new Snake()
  
  let foods = []
  var allowHorizontalMov = true;
  var allowVerticalMov = true;
  
  window.addEventListener("keydown",(ev)=>{
    // 39 right
    // 37 left
    // 38 up
    // 40 down
    ev.preventDefault()
    if(ev.keyCode == 37 && allowHorizontalMov==true)
    {
      console.log("presione hacia la izq")
      allowHorizontalMov=false;
      allowVerticalMov=true;
      snake.left()
    }
    if(ev.keyCode == 38 && allowVerticalMov == true)
    { 
      allowHorizontalMov=true;
      allowVerticalMov=false;
      snake.up()
    }
    if(ev.keyCode == 39 && allowHorizontalMov==true )
    { 
      allowHorizontalMov=false;
      allowVerticalMov=true;
      snake.right()  
    }  
    if(ev.keyCode == 40 && allowVerticalMov == true) 
    {
      allowHorizontalMov=true;
      allowVerticalMov=false;
      snake.down()
    }
    return false
  })
  
  setInterval(()=>{
    const food = Food.generate()
    foods.push(food)
    setTimeout(()=>{
      removeFromFoods(food)
    },10000)
  },1000) //Velocidad comida de la serpiente(5000)
  
  
  
  const gameInterval = setInterval(()=>{
    snake.move()
    ctx.clearRect(0,0,800,600)
    drawFood()
    snake.draw()
    if(!snake.alive()) window.clearInterval(gameInterval)
  },100) //Velocidad movimiento de la serpiente
  
  
  function drawFood(){
    for(var food_index in foods){
      const food = foods[food_index]
      if(validFood(food)){
        food.draw()
        didCollide(food)  
      } 
    }
  }
  function validFood(food){
    return typeof food != "undefined"
  }
  function didCollide(food){
    if(validFood(food) && hit(food,snake.mainSquare) ){
      snake.eat()
      removeFromFoods(food)
    }
  }
  
  function removeFromFoods(food){
    foods = foods.filter(function(f){
      return f != food
    })
    
  }
  function snakeHit(a,b){
    return a.x == b.x && b.y == a.y;
  }
  function hit(a,b){
    var hit = false;
    //Colisiones horizontales
    if(b.x + b.width >= a.x && b.x < a.x + a.width)
    {
      //Colisiones verticales
      if(b.y + b.height >= a.y && b.y < a.y + a.height)
        hit = true;
    }
    //Colisión de a con b
    if(b.x <= a.x && b.x + b.width >= a.x + a.width)
    {
      if(b.y <= a.y && b.y + b.height >= a.y + a.height)
        hit = true;
    }
    //Colisión b con a
    if(a.x <= b.x && a.x + a.width >= b.x + b.width)
    {
      if(a.y <= b.y && a.y + a.height >= b.y + b.height)
        hit = true;
    }
    return hit;
  }
  
})()


var head = document.getElementById("head");
var theBody = document.getElementById("theBody");
var theSpan= document.createElement("span");
theBody.appendChild(theSpan);
theSpan.addEventListener("keydown", rightMov(theSpan,60));
//theBody.appendChild(head.cloneNode(true));
function rightMov(span , coord)
{
  console.log("Entré");
  span.style.left= (coord-5)+"px";
}
//head.style.background= "black";
