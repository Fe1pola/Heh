var TitleBgIMG;
var TitleButton, TitleButtonA;
var GameBg1, GameBg2, GameBgIMG;
var jet, jetIMG;
var shot, shotGroup, enemyShot1, enemyShot2, enemyShotGroup;
var enemy, enemyIMG1, enemyIMG2, enemyIMG3, enemyGroup, enemySpriteFactor, enemyPositionFactor;
var enemyCount = 0;
var score = 0;
var HP = 3, HPS1, HPS2, HPS3, HPIMG;
var cat, catIMG;
var blackBg;
var lego, core, i = 0, bubble;
//var audioElement;

var gameState = "title";

/*
Decidi não adicionar músicas, já que não sei alterar o volume,
então iria estourar o tímpano de todos
*/

//load images
function preload(){
  TitleBgIMG = loadImage("res/Title Bg.png")
  TitleButtonA = loadAnimation("res/Title Button A1.png", "res/Title Button A2.png", "res/Title Button A3.png");
  GameBgIMG = loadImage("res/GameBg.png");
  jetIMG = loadImage("res/Jet.png");
  enemyIMG1 = loadImage("res/enemy.png");
  enemyIMG2 = loadImage("res/enemy2.png");
  enemyIMG3 = loadImage("res/enemy3.png");
  HPIMG = loadImage("res/heartPoint.png");
  catIMG = loadImage("res/this-cat-knows-what-you-did.png");
  bubble = loadSound("res/bubble sound.mp3");
  core = loadSound("res/Core-falando-Não.mp3");
  lego = loadSound("res/Lego-Brick-breaking.mp3");
}

//setup
function setup() {
  createCanvas(windowWidth, windowHeight);
  if(gameState == "title"){
  TitleButton = createSprite((windowWidth/2) + 10, (windowHeight/2) + 100, 20, 20);
  TitleButton.addAnimation("yippie", TitleButtonA);
}
  GameBg1 = createSprite(windowWidth/2, windowHeight, 20, 20);
  GameBg1.addImage(GameBgIMG);
  GameBg1.visible = false;
  GameBg2 = createSprite(windowWidth/2, GameBg1.y - 2660, 20, 20);
  GameBg2.addImage(GameBgIMG);
  GameBg2.visible = false;

  jet = createSprite(windowWidth/2, windowHeight - 50, 53, 72);
  jet.addImage(jetIMG);
  jet.visible= false;

  blackBg = createSprite(windowWidth/2, windowHeight/2, windowWidth, windowHeight);
  blackBg.shapeColor = "black";
  blackBg.visible = false;

  HPS1 = createSprite(windowWidth - windowWidth + 25, windowHeight - 30, 44, 44);
  HPS2 = createSprite(HPS1.x + 49, windowHeight - 30, 44, 44);
  HPS3 = createSprite(HPS2.x + 49, windowHeight - 30, 44, 44);
  HPS1.addImage(HPIMG);
  HPS2.addImage(HPIMG);
  HPS3.addImage(HPIMG);
  HPS1.visible = false;
  HPS2.visible = false;
  HPS3.visible = false;

  shotGroup = new Group();
  enemyGroup = new Group();
  enemyShotGroup = new Group();
  /*audioElement = document.createElement('audio');
  audioElement.setAttribute('src', 'res/Core-falando-Não.mp3');*/
}

//loop
function draw() {
  if(gameState == "title"){
  background(TitleBgIMG);  
  }

  //transition title > running
  if(mousePressedOver(TitleButton) && gameState == "title"){
    gameState = "running"
    TitleButton.visible = false;
    GameBg1.visible = true;
    GameBg2.visible = true;
  }

  //running background
  if(GameBg1.y - 1330 >= windowHeight){
    GameBg1.y = GameBg2.y - 2660;
  }
  if(GameBg2.y - 1330 >= windowHeight){
    GameBg2.y = GameBg1.y - 2660;
  }

  //gameState running
  if(gameState == "running"){
    controls();
    shooting();
    enemys();
    enemyShooting();
    gettingHit()
    GameBg1.velocityY = 3;
    GameBg2.velocityY = 3;
    jet.visible = true;

    //didn't work ¯⁠\⁠⁠(⁠ツ⁠)⁠⁠/⁠¯
    /*
    for(var i = 0; i < HP; i++){
      HPS = createSprite( windowWidth - windowWidth + 25 + (49 * i), windowHeight - 30, 44, 44);
      HPS.addImage(HPIMG);
    }*/
    HPS1.visible = true;
    HPS2.visible = true;
    HPS3.visible = true;

    if(HP == 2){
      HPS3.visible = false;
    }
    if(HP == 1){
      HPS3.visible = false;
      HPS2.visible = false;
    }
  }

  //gameState over
  if(HP <= 0){
    gameState = "over";
    HPS1.destroy();
    HPS2.destroy();
    HPS3.destroy();
    //não tá funcionando 😭
    /*audioElement.addEventListener('load', function(){
      this.currentTime = 0;
      this.play();
    }, true);*/
  }
  if(gameState == "over"){
    jet.destroy();
    shotGroup.destroyEach();
    enemyGroup.destroyEach();
    enemyShotGroup.destroyEach();
    GameBg1.velocityY = 0;
    GameBg2.velocityY = 0;
    cat = createSprite(windowWidth/2, windowHeight/2, 512, 512);
    cat.addImage(catIMG);
    blackBg.visible = true;
  }

  //console.log(HP);
  drawSprites();
  if(gameState == "running" || gameState == "over"){
    textSize(30);
    text("Score: " +score, 0/windowWidth + 10, 0/windowHeight + 30);
  }
}


function controls(){
  if(gameState == "running"){
    jet.visible = true;
    //controls
    if(keyDown("A")){
      jet.x -= 8;
    }
    if(keyDown("D")){
      jet.x += 8;
    }
    if(keyDown("W")){
      jet.y -= 4;
    }
    if(keyDown("S")){
      jet.y += 4;
    }

    //out of bounds
    if(jet.x > windowWidth - 36){
      jet.x = windowWidth - 36;
    }
    if(jet.x < windowWidth - windowWidth + 36){
      jet.x = windowWidth - windowWidth +36
    }
    if(jet.y > windowHeight - 36){
      jet.y = windowHeight - 36;
    }
    if(jet.y < windowHeight - windowHeight + 36){
      jet.y = windowHeight - windowHeight +36
    }
  }
}

function shooting(){
  //1
  if(frameCount%10 == 0 && gameState == "running"){
    shot = createSprite(jet.x, (jet.y) - 40, 10, 20);
    shotGroup.add(shot);
    shot.shapeColor = "yellow";
    shot.velocityY = -20;
    shot.lifetime = 120;
  }
}

function enemys(){
  if(frameCount%15 == 0 && gameState == "running"){
    enemySpriteFactor = Math.round(random(1, 3));
    enemyPositionFactor = Math.round(random(1, 8));
    enemy = createSprite(windowWidth*2,  100, 30, 30)
    enemyCount += 1;
    enemyGroup.add(enemy);
    enemy.lifetime = 200;
    enemy.velocityY = 5;
    switch(enemySpriteFactor){
      case 1: enemy.addImage(enemyIMG1);
      break;

      case 2: enemy.addImage(enemyIMG2);
      break;

      case 3: enemy.addImage(enemyIMG3);
      break;
    }
    switch(enemyPositionFactor){
      case 1: enemy.x = windowWidth/2 -200;
      break;

      case 2: enemy.x = windowWidth/2 -100;
      break;

      case 3: enemy.x = windowWidth/2;
      break;

      case 4: enemy.x = windowWidth/2 + 100;
      break;

      case 5: enemy.x = windowWidth/2 +200;
      break;

      case 6: enemy.x = windowWidth/2 + 300;
      break;

      case 7: enemy.x = windowWidth/2 + 400;
      break;

      case 8: enemy.x = windowWidth/2 + 500;
      break;
      
    }
  }
  if(enemyCount >= 1){
    firstgrademurder();
  }
}

function enemyShooting(){
  if(frameCount%30 == 0 && gameState == "running" && frameCount < 1000){
    createEnemyShootingSprite(-2, 3, 2, 3);
  }

  if(frameCount%20 == 0 && gameState == "running" && frameCount > 1000 && frameCount < 2000){
    createEnemyShootingSprite(-4, 6, 4, 6);
  }

  if(frameCount%2 == 0 && gameState == "running" && frameCount >= 2000){
    createEnemyShootingSprite(-5, 7, 5, 7);
  }

}

//IMPORTATE
//IMPORTATÍSSIMO SEU BURRO
function firstgrademurder(){
  shotGroup.overlap(enemyGroup, function(shotF, enemyF){
    enemyF.remove();
    shotF.remove();
    score += 15;
    bubble.play();
  });
}

function gettingHit(){
  jet.overlap(enemyGroup, function(jetF, enemyF){
    enemyF.remove();
    HP -= 1;
    lego.play();
  });
  jet.overlap(enemyShotGroup, function(jetF, shotFF){
    shotFF.remove();
    HP -= 1;
    lego.play();
  });
}

function createEnemyShootingSprite(ES1X, ES1Y, ES2X, ES2Y){
  enemyShot1 = createSprite(enemy.x, enemy.y, shot.width, shot.height)
  enemyShot2 = createSprite(enemy.x, enemy.y, shot.width, shot.height)
  enemyShotGroup.add(enemyShot1);
  enemyShotGroup.add(enemyShot2);
  enemyShot1.shapeColor = "red";
  enemyShot2.shapeColor = "red";
  enemyShot1.lifetime = 200;
  enemyShot2.lifetime = 200;
  enemyShot1.velocityX = ES1X;
  enemyShot1.velocityY = ES1Y;
  enemyShot2.velocityX = ES2X;
  enemyShot2.velocityY = ES2Y;
}

