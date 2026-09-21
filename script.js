const claw = document.getElementById("claw");

const leftBtn = document.getElementById("leftBtn");
const rightBtn = document.getElementById("rightBtn");
const dropBtn = document.getElementById("dropBtn");

const scoreDisplay = document.getElementById("score");

let clawX = 225;
let score = 0;

const minX = 20;
const maxX = 430;

let moving = false;


/* =========================
   MOVE LEFT
========================= */

function moveLeft() {

    if (moving) return;

    clawX -= 20;

    if (clawX < minX) {
        clawX = minX;
    }

    claw.style.left = clawX + "px";
}


/* =========================
   MOVE RIGHT
========================= */

function moveRight() {

    if (moving) return;

    clawX += 20;

    if (clawX > maxX) {
        clawX = maxX;
    }

    claw.style.left = clawX + "px";
}


/* =========================
   DROP CLAW
========================= */

function dropClaw() {

    if (moving) return;

    moving = true;

    // Move claw down
    claw.style.transition = "top 1s ease";

    claw.style.top = "300px";


    // Wait for claw to reach bottom
    setTimeout(() => {

        // Move claw back up
        claw.style.top = "0px";


        setTimeout(() => {

            score++;

            scoreDisplay.textContent = "Score: " + score;

            moving = false;

            claw.style.transition = "left 0.15s linear, top 1s ease";

        }, 1000);

    }, 1000);
}


/* =========================
   BUTTON EVENTS
========================= */

leftBtn.addEventListener("click", moveLeft);

rightBtn.addEventListener("click", moveRight);

dropBtn.addEventListener("click", dropClaw);


/* =========================
   KEYBOARD CONTROLS
========================= */

document.addEventListener("keydown", (event) => {

    if (event.key === "ArrowLeft") {
        moveLeft();
    }

    if (event.key === "ArrowRight") {
        moveRight();
    }

    if (event.code === "Space") {
        event.preventDefault();

        dropClaw();
    }

});