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

// ===== Lightbox =====
function openLightbox(src) {
  const lightbox = document.getElementById("lightbox");
  const content = document.getElementById("lightboxContent");

  content.innerHTML = `<img src="${src}" style="max-width:90%;max-height:90%">`;

  lightbox.style.display = "flex";
}

document.getElementById("closeLightbox").onclick = () => {
  document.getElementById("lightbox").style.display = "none";
};
