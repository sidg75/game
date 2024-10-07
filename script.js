const characters = [
    { name: "Goku", image: "images/goku.png", sound: "sounds/goku.mp3" },
    { name: "Luffy", image: "images/luffy.png", sound: "sounds/luffy.mp3" },
    // ... more characters (24 total)
];

const wheel = document.getElementById("wheel");
const tryMyLuckButton = document.getElementById("tryMyLuck");
const popup = document.getElementById("popup");
const characterImage = document.getElementById("characterImage");
const characterSound = document.getElementById("characterSound");
const closePopup = document.getElementById("closePopup");

// Create partitions dynamically
function createPartitions() {
    for (let i = 0; i < 24; i++) {
        const partition = document.createElement("div");
        partition.classList.add("partition");
        partition.style.transform = `rotate(${i * 15}deg)`; // 360 / 24 = 15
        wheel.appendChild(partition);
    }
}

createPartitions(); // Call the function to create partitions

tryMyLuckButton.addEventListener("click", () => {
    const randomIndex = Math.floor(Math.random() * 24);
    const degree = randomIndex * 15 + 3600; // Add 10 full rotations (3600 degrees) for a longer spin

    wheel.style.transition = "transform 3s ease-out";
    wheel.style.transform = `rotate(${degree}deg)`;

    setTimeout(() => {
        const character = characters[randomIndex];
        characterImage.src = character.image;
        characterSound.src = character.sound;
        characterSound.play();
        popup.classList.remove("hidden");
    }, 3000);
});

closePopup.addEventListener("click", () => {
    popup.classList.add("hidden");
    characterSound.pause();
    characterSound.currentTime = 0; // Reset audio
});