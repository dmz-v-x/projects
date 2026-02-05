const jokeEl = document.getElementById("joke");
const button = document.getElementById("getJoke");

async function fetchJoke() {
    jokeEl.style.opacity = "0.5";
    jokeEl.textContent = "Loading joke...";

    try {
        const response = await fetch("https://icanhazdadjoke.com/", {
            headers: {
                Accept: "application/json"
            }
        });

        const data = await response.json();
        jokeEl.textContent = data.joke;
    } catch (error) {
        jokeEl.textContent = "Failed to fetch joke 😢";
    } finally {
        jokeEl.style.opacity = "1";
    }
}

button.addEventListener("click", fetchJoke);
