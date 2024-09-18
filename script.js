// Récupération de l'élément HTML5 <main>
const main = document.querySelector(".main__content");

// Création de l'élément HTML5 <section> et ajout dans le DOM
const container = document.createElement("section");
container.setAttribute("class", "container");
main.appendChild(container);

// Création de l'élément HTML5 <h2> et ajout dans le DOM
const title = document.createElement("h2");
title.textContent = "Le casse-briques";
container.appendChild(title);

// Création de l'élément HTML5 <canvas> et ajout dans le DOM
const canvas = document.createElement("canvas");
canvas.setAttribute("width", "600");
canvas.setAttribute("height", "400");
container.appendChild(canvas);

// Création de l'élément HTML5 <div> et ajout dans le DOM
const score = document.createElement("div");
score.setAttribute("class", "score");
container.appendChild(score);

// Création de l'élément HTML5 <span> et ajout dans le DOM
const scoreTitle = document.createElement("span");
scoreTitle.textContent = "Score : ";
score.appendChild(scoreTitle);

// Création de l'élément HTML5 <span> et ajout dans le DOM
const scoreResult = document.createElement("span");
// Création de la variable result
let result = 0;
scoreResult.textContent = result;
score.appendChild(scoreResult);

// Création des constantes
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;
const ctx = canvas.getContext("2d");

const ballRadius = 10;
const barHeight = 10;
const barWidth = 67.5;
const columnNumber = 8;
const rowNumber = 8;
const brickHeight = 10;
const brickWidth = 67.5;

// Création des variables
let x = canvasWidth / 2;
let y = canvasHeight - 8;
let barX = (canvasWidth - barWidth) / 2;
let end = false;
let speedX = 5;
let speedY = -2;

// Tableau contenant les briques
const brickArray = [];

// boucle for qui va parcourir le nombre de ligne
for (let i = 0; i < rowNumber; i++) {
  brickArray[i] = [];

  // Boucle for qui va parcourir le nombre de colonne
  for (let j = 0; j < columnNumber; j++) {
    brickArray[i][j] = {
      x: 0,
      y: 0,
      statut: 1,
    };
  }
}

//Déclaration de la fonction drawBall qui va permettre de dessiner la balle
const drawBall = () => {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = "#f6b60d";
  ctx.fill();
  ctx.closePath();
};

//Déclaration de la fonction drawBar qui va permetttre de dessiner la barre qui bouge
const drawBar = () => {
  ctx.beginPath();
  ctx.rect(barX, canvasHeight - barHeight - 2, barWidth, barHeight);
  ctx.fillStyle = "#f6b60d";
  ctx.fill();
  ctx.closePath();
};

// Déclaration de la fonction drawBricks qui va permettre de dessiner les briques
const drawBricks = () => {
  // Boucle for qui va parcourir le nombre de ligne
  for (let i = 0; i < rowNumber; i++) {
    // Boucle for qui va parcourir le nombre de colonne
    for (let j = 0; j < columnNumber; j++) {
      if (brickArray[i][j].statut === 1) {
        let brickX = j * (brickWidth + 5) + 12;
        let brickY = i * (brickHeight + 2) + 10;

        brickArray[i][j].x = brickX;
        brickArray[i][j].y = brickY;

        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = "#514644";
        ctx.fill();
        ctx.closePath();
      }
    }
  }
};

// Déclaration de la fonction rebound qui va permettre le rebond de la balle
const rebound = () => {
  //Si la balle touche le côté droit OU le côté gauche
  if (x + speedX > canvasWidth - ballRadius || x + speedX < ballRadius) {
    speedX = -speedX;
  }

  // Si la balle touche le plafond
  if (y + speedY < ballRadius) {
    speedY = -speedY;
  }

  // Si on touche le sol
  if (y + speedY > canvasHeight - ballRadius) {
    // On rebondit si on touche la barre
    if (x > barX && x < barX + barWidth) {
      speedX = speedX + 0.1;
      speedY = speedY + 0.1;
      speedY = -speedY;
    } else {
      // On perd si on dépasse la barre
      end = true;

      score.innerHTML = `
           <p> Désolé, vous avez perdu ! <br>
            Cliquez sur le casse-briques pour recommencer.</p>
            `;
    }
  }

  x += speedX;
  y += speedY;
};

// Déclaration de la fonction collision
const collision = () => {
  // Boucle for qui va parcourir le nombre de ligne
  for (let i = 0; i < rowNumber; i++) {
    // Boucle for qui va parcourir le nombre de colonne
    for (let j = 0; j < columnNumber; j++) {
      let b = brickArray[i][j];

      if (b.statut === 1) {
        if (
          x > b.x &&
          x < b.x + brickWidth &&
          y > b.y &&
          y < b.y + brickHeight
        ) {
          speedY = -speedY;

          b.statut = 0;

          result += 1;

          scoreResult.textContent = result;

          if (result === columnNumber * rowNumber) {
            score.innerHTML = `
                        <p>Félicitations, vous avez gagné !!! <br>
                        Cliquez sur le casse-briques pour recommencer </p>`;
            end = true;
          }
        }
      }
    }
  }
};

// Ecoute de l'événement "mousemove" pour la barre
document.addEventListener("mousemove", (e) => {
  let posXBar = e.clientX - canvas.offsetLeft;

  if (posXBar > 12 && posXBar < canvasWidth - 12) {
    barX = posXBar - barWidth / 2;
  }
});

// Ecoute de l'événemrnt "click" sur le canvas
canvas.addEventListener("click", () => {
  // condition if ...
  if (end === true) {
    end = false;
    // Recommencer le jeu
    document.location.reload();
  }
});

// Déclaration de la fonction breakBrickGame qui contient la logique du jeu
const breakBrickGame = () => {
  if (end === false) {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    // Appel des fonctions
    drawBall();
    drawBar();
    drawBricks();
    rebound();
    collision();
    // La méthode window.requestAnimationFrame() indique au navigateur qu'on souhaite exécuter une animation et demande que celui-ci exécute une fonction spécifique de mise à jour de l'animation, avant le prochain rafraîchissement à l'écran du navigateur. Cette méthode prend comme argument une fonction de rappel qui sera appelée avant le rafraîchissement du navigateur.
    requestAnimationFrame(breakBrickGame);
  }
};

// Appel de la fonction breakBrickGame()
breakBrickGame();
