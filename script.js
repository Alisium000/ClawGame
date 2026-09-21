const claw = document.getElementById("claw");

const leftBtn = document.getElementById("leftBtn");
const rightBtn = document.getElementById("rightBtn");
const dropBtn = document.getElementById("dropBtn");

const scoreDisplay = document.getElementById("score");
const glass = document.querySelector(".glass");
const chute = document.querySelector(".chute");

let clawX = 225;
let score = 0;

const minX = 20;
const maxX = 430;

let moving = false;

function findPrizeUnderClaw(clawHead) {

    const clawRect = clawHead.getBoundingClientRect();
    const prizes = Array.from(document.querySelectorAll(".toy:not(.grabbed):not(.released)"));

    return prizes
        .map((toy) => {
            const toyRect = toy.getBoundingClientRect();
            const overlapsHorizontally =
                clawRect.left < toyRect.right &&
                clawRect.right > toyRect.left;

            return {
                toy,
                toyRect,
                overlapsHorizontally
            };
        })
        .filter(({ toyRect, overlapsHorizontally }) =>
            overlapsHorizontally && toyRect.top >= clawRect.bottom
        )
        .sort((first, second) => {
            if (first.toyRect.top !== second.toyRect.top) {
                return first.toyRect.top - second.toyRect.top;
            }

            return Math.abs(
                first.toyRect.left - clawRect.left
            ) - Math.abs(
                second.toyRect.left - clawRect.left
            );
        })[0];
}

function attachPrize(prize, clawHead, dropDistance) {

    const width = prize.offsetWidth;
    const clawWidth = claw.offsetWidth;

    prize.classList.add("grabbed");
    prize.style.position = "absolute";
    prize.style.left = ((clawWidth - width) / 2) + "px";
    prize.style.top =
        (clawHead.offsetTop + clawHead.offsetHeight + dropDistance) + "px";
    prize.style.transition = "none";

    claw.appendChild(prize);

    prize.offsetWidth;
    prize.style.transition = "top 1s ease";
}

function releasePrize(prize) {

    const prizeRect = prize.getBoundingClientRect();
    const glassRect = glass.getBoundingClientRect();
    const chuteRect = chute.getBoundingClientRect();

    prize.classList.remove("grabbed");
    prize.classList.add("released");
    prize.style.left = (prizeRect.left - glassRect.left) + "px";
    prize.style.top = (prizeRect.top - glassRect.top) + "px";
    prize.style.transform = "none";
    prize.style.transition = "left 0.5s ease, top 0.5s ease";

    glass.appendChild(prize);

    requestAnimationFrame(() => {
        prize.style.left =
            (chuteRect.left - glassRect.left + (chuteRect.width - prizeRect.width) / 2) + "px";
        prize.style.top =
            (chuteRect.top - glassRect.top + (chuteRect.height - prizeRect.height) / 2) + "px";
    });
}


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

    const rope = claw.querySelector(".rope");
    const clawHead = claw.querySelector(".claw-head");
    const target = findPrizeUnderClaw(clawHead);
    const dropDistance = target
        ? Math.max(0, target.toyRect.top - clawHead.getBoundingClientRect().bottom)
        : 300;

    // DROP
    rope.style.height = (90 + dropDistance) + "px";
    clawHead.style.transform = "translateY(" + dropDistance + "px)";

    // Wait at the bottom
    setTimeout(() => {

        if (target) {
            attachPrize(target.toy, clawHead, dropDistance);
        }

        // RETURN
        rope.style.height = "90px";
        clawHead.style.transform = "translateY(0)";

        if (target) {
            target.toy.style.top =
                (clawHead.offsetTop + clawHead.offsetHeight) + "px";
        }

        setTimeout(() => {

            if (target) {
                releasePrize(target.toy);
                score++;
                scoreDisplay.textContent = "Score: " + score;
            }

            moving = false;

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