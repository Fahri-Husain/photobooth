const texts = [
  "Share your photos and don’t forget to tag us @fahrihusainnn!",
  "Follow us on instagram @fahrihusainnn ✨",
];

const links = [
  null,
  "https://instagram.com/fahrihusainnn", // link untuk kalimat kedua
  null,
];

let index = 0;
const topText = document.getElementById("topText");

function changeText() {
  topText.classList.add("fade");

  setTimeout(() => {
    index = (index + 1) % texts.length;
    topText.textContent = texts[index];

    // kalau kalimat punya link → bisa diklik
    if (links[index]) {
      topText.style.cursor = "pointer";
      topText.onclick = () => window.open(links[index], "_blank");
    } else {
      topText.style.cursor = "default";
      topText.onclick = null;
    }

    topText.classList.remove("fade");
  }, 1200);
}

setInterval(changeText, 5000);
