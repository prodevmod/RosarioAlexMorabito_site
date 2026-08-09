window.addEventListener('mousemove', (e) => {
    // This updates the global --x and --y variables on the body tag dynamically
    document.body.style.setProperty('--x', `${e.clientX}px`);
    document.body.style.setProperty('--y', `${e.clientY}px`);
});

const titles = [
    "Full-Stack Developer in Training",
    "Software Developer",
    "Robotics & Electronics Engineer",
    "Robotics Enthusiast",
    "Cybersecurity Learner",
    "Open Source Contributor",
    "Future Computer Scientist",
    "Problem Solver",
    "Coffee Powered ",
    "Caffeine Dependent",
    "Spidey Fan ",
    "Running Addict ",
    "STEM Enthusiast",
    "Proffesion Bug Googler",
    "Linux Enjoyer",
    "Competitive Programmer",
    "Physics Explorer",
    "Always Learning",
    "Building Cool Stuff",
    "Debugging Since Yesterday",
    "Professional Bug Creator ",
    "Powered by Curiosity",
    "MIT Aspirant",
    "Future Robotics Researcher",
    "Keyboard Warrior",
    "Sleep Is Optional"
];

const radioText = document.getElementById("radioText");

let current = 0;

function changeTitle() {
    radioText.style.animation = "none";
    radioText.offsetHeight;

    radioText.textContent = titles[current];

    radioText.style.animation = "slideIn .5s ease";

    current = (current + 1) % titles.length;
}

changeTitle();

setInterval(changeTitle, 2500);