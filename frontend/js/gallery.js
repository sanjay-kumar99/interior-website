const BASE_URL = "https://interior-website-bwn1.onrender.com/api/gallery";

async function loadGallery() {
  const groups = document.querySelectorAll(".gallery-group");

  for (const group of groups) {
    const category = group.dataset.category || group.dataset.cat;
    console.log("Fetching gallery:", `${BASE_URL}/${category}`);

    try {
      const res = await fetch(`${BASE_URL}/${category}`);
      const images = await res.json();

      group.innerHTML = `<h2>${category}</h2>`;

      images.forEach((imgUrl) => {
        const img = document.createElement("img");
        img.src = imgUrl;
        img.className = "gallery-img";
        group.appendChild(img);
      });
    } catch (err) {
      console.error("Gallery error:", category, err);
    }
  }
}

window.addEventListener("DOMContentLoaded", loadGallery);

const lightbox = document.getElementById("lightbox");
const lightboxContent = document.getElementById("lightboxContent");
const closeBtn = document.getElementById("closeLightbox");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");

let currentIndex = 0;
let images = [];

document.querySelectorAll(".gallery-group img").forEach((img, index) => {
  images.push(img.src);
  img.addEventListener("click", () => {
    currentIndex = index;
    openLightbox();
  });
});

function openLightbox() {
  lightbox.style.display = "block";
  showImage(currentIndex);
}

function showImage(index) {
  lightboxContent.innerHTML = `<img src="${images[index]}" alt="gallery image">`;
}

closeBtn.addEventListener("click", () => {
  lightbox.style.display = "none";
});

prevBtn.addEventListener("click", () => {
  currentIndex = (currentIndex - 1 + images.length) % images.length;
  showImage(currentIndex);
});

nextBtn.addEventListener("click", () => {
  currentIndex = (currentIndex + 1) % images.length;
  showImage(currentIndex);
});
// ✅ Keyboard navigation
document.addEventListener("keydown", (e) => {
  if (lightbox.style.display === "block") {
    if (e.key === "ArrowLeft") {
      currentIndex = (currentIndex - 1 + images.length) % images.length;
      showImage(currentIndex);
    } else if (e.key === "ArrowRight") {
      currentIndex = (currentIndex + 1) % images.length;
      showImage(currentIndex);
    } else if (e.key === "Escape") {
      lightbox.style.display = "none";
    }
  }
});
