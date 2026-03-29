let lastScrollTop = 0;
const navbar = document.getElementById("navbar");

window.addEventListener("scroll", () => {
    let currentScroll = window.pageYOffset;

    if (currentScroll > lastScrollTop) {
        navbar.style.top = "-60px"
    } else {
        navbar.style.top = "0px";
    }

    lastScrollTop = currentScroll;
});
