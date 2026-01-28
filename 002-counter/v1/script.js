let counter = document.getElementById("counter");

let decreaseCounter = document.getElementById("decrease");
let reset = document.getElementById("reset");
let increaseCounter = document.getElementById("increase");

decreaseCounter.addEventListener("click", () => {
    if (Number(counter.textContent) === 0) {
        return;
    }
    counter.textContent = Number(counter.textContent) - 1;
})

increaseCounter.addEventListener("click", () => {
    counter.textContent = Number(counter.textContent) + 1;
})

reset.addEventListener("click", () => {
    counter.textContent = 0;
})
