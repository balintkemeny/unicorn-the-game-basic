//Create and define Canvas
const canvas = document.querySelector('canvas')
canvas.width = 800
canvas.height = 400

const context = canvas.getContext('2d')

//Load assets
const sprite = new Image()
sprite.src = './assets/sprite.png'

const unicornSprite = new Image()
unicornSprite.src = './assets/unicorn2c.png'

const treeSprite = new Image()
treeSprite.src = './assets/treesprite1.png'

const groundImage = new Image()
groundImage.src = './assets/ground3b.png'

const bgImage = new Image()
bgImage.src = './assets/background.png'

const sound = new Audio()
sound.src = './assets/music.mp3'
sound.loop = true
sound.play()

//Define game variables
const groundHeight = 30
const ground = canvas.height - groundHeight
const srcTreeSize = {
  x: 75,
  y: 104,
  scale: 0.9
}
const treeSize = {
  x: srcTreeSize.x * srcTreeSize.scale,
  y: srcTreeSize.y * srcTreeSize.scale,
  verticalBias: 5
}
const unicornSize = {
  x: 64,
  y: 50,
  verticalBias: 5
}

const jumpVelocity = 20
const collisionAllowance = 5

let score = 0
let treeAcceleration = 5
let spawnStage = 10
let unicorn = {
  x: 50,
  y: 0,
  vy: 0,
  costume: 0
}
let trees = []

//Define game controller functions
function jump() {
  if (unicorn.y == 0) {
    unicorn.vy = jumpVelocity
  }
}

document.onkeydown = jump

function changeCostume() {
  unicorn.costume = (unicorn.costume + 1) % 4
}

function createTree() {
  //let costume = Math.trunc(Math.random() * 3)
  let costume = 0
  let tree = {
    x: canvas.width,
    costume: costume
  }
  trees.push(tree)
  let spawnTime = Math.trunc(Math.random() * spawnStage * 150) + (spawnStage * 75)
  setTimeout(createTree, spawnTime) 
}

function draw() {
  context.clearRect(0, 0, canvas.width, canvas.height)
  //context.drawImage(sprite, unicorn.costume * 46, 0, 46, 46, unicorn.x, ground - unicorn.y, 46, 46)
  context.drawImage(bgImage, 0, 0)
  context.drawImage(groundImage, 0, ground)
  context.drawImage(unicornSprite, unicorn.costume * unicornSize.x, 0, unicornSize.x, unicornSize.y, 
                    unicorn.x, ground - (unicornSize.y + unicorn.y) + unicornSize.verticalBias, unicornSize.x, unicornSize.y)
  context.strokeStyle = 'black'
  context.font = '18px Arial'
  //context.fillText(Math.trunc(score / (1000 / 60)), 10, 30)
  context.fillText(score, 10, 30)
  trees.forEach(drawTree)
}

function drawTree(tree) {
  context.drawImage(treeSprite, tree.costume * srcTreeSize.x, 0, srcTreeSize.x, srcTreeSize.y,
                    tree.x, ground - treeSize.y + treeSize.verticalBias, treeSize.x, treeSize.y)
}

function moveTree(tree) {
  tree.x -= treeAcceleration
}

function isCollidingWithTree(tree) {
  if (unicorn.x < tree.x && unicorn.x + unicornSize.x > tree.x + collisionAllowance && unicorn.y < treeSize.y - collisionAllowance) {
    return true
  }
  if (unicorn.x > tree.x && unicorn.x < tree.x + treeSize.x / 2 && unicorn.y < treeSize.y - collisionAllowance) {
    return true
  }
  return false
}

//Main game loop
function loop() {
  score += 1
  if (score % 1000 === 0) {
    treeAcceleration += 2
    if (spawnStage > 5) {
      spawnStage--
    }
  }
  unicorn.y += unicorn.vy
  unicorn.vy -= 1
  if (unicorn.y <= 0) {
    unicorn.y = 0
    unicorn.vy = 0
  }
  if (unicorn.y > 0) {
    unicorn.costume = 2
  }
  trees.forEach(moveTree)
  if (trees.some(isCollidingWithTree)) {
    unicorn = {
      x: 50,
      y: 0,
      vy: 0,
      costume: 0
    }
    treeAcceleration = 5
    spawnStage = 10
    trees = []
    score = 0
    alert('Game over')
  }
  draw()
}

setInterval(loop, 1000 / 60)
setInterval(changeCostume, 100)
setTimeout(createTree, 1000)