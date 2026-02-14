const BASE_URL = "https://interior-website-bwn1.onrender.com/api/gallery";

const modalImage = document.getElementById("modalImage");
const imageModal = new bootstrap.Modal(document.getElementById("imageModal"));
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

let currentIndex = 0;
let allImages = [];
// ✅ Get category from URL query (?cat=...)
function getCategoryFromURL() {
  const params = new URLSearchParams(window.location.search);
  const cat = params.get("cat");
  return cat ? cat.toLowerCase() : null; // normalize to lowercase
}

async function loadGallery() {
  const selectedCategory = getCategoryFromURL();
  const groups = document.querySelectorAll(".gallery-group");

  for (const group of groups) {
    const category = group.dataset.category;

    // ✅ If a category is selected, only load that one
    if (selectedCategory && category !== selectedCategory) {
      group.style.display = "none";
      continue;
    }

    try {
      const res = await fetch(`${BASE_URL}/${category}`);
      const data = await res.json();

      data.forEach((imgUrl) => {
        const img = document.createElement("img");
        img.src = imgUrl;
        img.className = "img-fluid mb-3 gallery-img";
        group.appendChild(img);

        allImages.push(img);

        img.addEventListener("click", () => {
          currentIndex = allImages.indexOf(img);
          showImage();
          imageModal.show();
        });
      });
    } catch (err) {
      console.error("Gallery error:", category, err);
    }
  }
}
function showImage() {
  modalImage.src = allImages[currentIndex].src;
}

// Prev/Next buttons
prevBtn.addEventListener("click", () => {
  currentIndex = (currentIndex - 1 + allImages.length) % allImages.length;
  showImage();
});

nextBtn.addEventListener("click", () => {
  currentIndex = (currentIndex + 1) % allImages.length;
  showImage();
});

// Keyboard navigation
document.addEventListener("keydown", (e) => {
  if (document.getElementById("imageModal").classList.contains("show")) {
    if (e.key === "ArrowLeft") {
      currentIndex = (currentIndex - 1 + allImages.length) % allImages.length;
      showImage();
    } else if (e.key === "ArrowRight") {
      currentIndex = (currentIndex + 1) % allImages.length;
      showImage();
    }
  }
});

window.addEventListener("DOMContentLoaded", loadGallery);
