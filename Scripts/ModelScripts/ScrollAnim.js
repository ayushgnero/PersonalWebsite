document.addEventListener("DOMContentLoaded", function () {
    const boxes = document.querySelectorAll(".box");
    const navlinks = document.querySelectorAll(".navlink");
    const canvas = document.getElementById("canvas");
    let currentIndex = 0;
    navlinks[0].style.opacity = 1;
    navlinks[0].style.transition = "opacity 1s";

    function updateOpacity() {
        boxes.forEach((box, index) => {
            if (index === currentIndex) {
                // Apply the animation to the current box
                box.style.animation = "taadaa 1s ease";
                box.style.opacity = 1;
                box.style.transform = "translate3d(0, 0, 0)";
                navlinks[index].style.opacity = 1;
                navlinks[index].style.transition = "opacity 1s";
            } else {
                // Remove the animation from other boxes
                box.style.animation = "none";
                box.style.opacity = 0;
                box.style.transform = "translate3d(0, 5%, 0)";
                navlinks[index].style.opacity = 0.5;
            }
        });

        if (currentIndex === 0) {
            canvas.style.opacity = 1;
            canvas.style.transition = "opacity 0.5";
        } else {
            canvas.style.opacity = 0.3;
            canvas.style.transition = "opacity 0.5s";
        }
    }

    navlinks.forEach((navlink, index) => {
        navlink.addEventListener("click", () => {
            currentIndex = index;
            updateOpacity();
        });
    });


    document.addEventListener("keydown", function (event) {
        if (event.key === "ArrowDown") {
            currentIndex = Math.min(currentIndex + 1, boxes.length - 1);
            updateOpacity();
        } else if (event.key === "ArrowUp") {
            currentIndex = Math.max(currentIndex - 1, 0);
            updateOpacity();
        }
    });

    let startY = 0;
    let endY = 0;

    document.addEventListener("touchstart", function (event) {
        startY = event.touches[0].clientY;
    });

    document.addEventListener("touchmove", function (event) {
        endY = event.touches[0].clientY;
    });

    document.addEventListener("touchend", function () {
        if (startY < endY) {
            // Scrolled down
            currentIndex = Math.min(currentIndex + 1, boxes.length - 1);
            updateOpacity();
        } else if (startY > endY) {
            // Scrolled up
            currentIndex = Math.max(currentIndex - 1, 0);
            updateOpacity();
        }
    });
    document.addEventListener("wheel", function (event) {
        if (event.deltaY > 0) {
            // Scrolled down
            currentIndex = Math.min(currentIndex + 1, boxes.length - 1);
            updateOpacity();
        } else if (event.deltaY < 0) {
            // Scrolled up
            currentIndex = Math.max(currentIndex - 1, 0);
            updateOpacity();
        }
    });
    // Initialize opacity for the first box
    updateOpacity();
});
