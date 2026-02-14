const BASE_URL = "https://interior-website-bwn1.onrender.com";

// 🔹 Load service images dynamically
async function loadHomeServices() {
  const imgs = document.querySelectorAll(".service-img");

  for (const img of imgs) {
    const category = img.dataset.category || img.dataset.cat;
    console.log("Fetching:", `${BASE_URL}/api/gallery/${category}`);

    try {
      const res = await fetch(`${BASE_URL}/api/gallery/${category}`);
      const data = await res.json();

      if (Array.isArray(data) && data.length > 0) {
        img.src = data[0];
      } else {
        console.log("No images for:", category);
      }
    } catch (err) {
      console.error("Error:", category, err);
    }
  }
}

window.addEventListener("DOMContentLoaded", loadHomeServices);

// 🔥 Counter animation on scroll (Happy Clients)
document.addEventListener("DOMContentLoaded", () => {
  const statsSection = document.querySelector("#stats");

  if (!statsSection) {
    console.log("No stats section found, skipping counter animation.");
    return; // 👈 अब observer कभी null पर call नहीं होगा
  }

  const counters = document.querySelectorAll(".counter");
  let started = false;

  const runCounter = () => {
    counters.forEach((counter) => {
      const target = +counter.dataset.target;
      let count = 0;
      const step = target / 80;

      const update = () => {
        count += step;
        if (count < target) {
          counter.innerText = Math.ceil(count);
          requestAnimationFrame(update);
        } else {
          counter.innerText = target.toLocaleString();
        }
      };
      update();
    });
  };

  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting && !started) {
        runCounter();
        started = true;
      }
    },
    { threshold: 0.5 },
  );

  observer.observe(statsSection);
});
// 🔹 Testimonials Auto Slider
document.addEventListener("DOMContentLoaded", () => {
  const testimonials = document.querySelectorAll(".testimonial");

  if (testimonials.length === 0) return;

  let index = 0;

  // ensure only first visible
  testimonials.forEach((t, i) => {
    t.style.display = i === 0 ? "block" : "none";
  });

  setInterval(() => {
    testimonials[index].style.display = "none";

    index = (index + 1) % testimonials.length;

    testimonials[index].style.display = "block";
  }, 4000); // change every 4 sec
});

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

document.getElementById("contactForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = {
    name: e.target.name.value,
    phone: e.target.phone.value,
    email: e.target.email.value,
    message: e.target.message.value,
  };

  const messageBox = document.getElementById("formMessage");
  messageBox.innerHTML = ""; // clear previous

  try {
    const response = await fetch(`${BASE_URL}/api/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      messageBox.innerHTML =
        '<div class="alert alert-danger">❌ Failed to send message. Please try again.</div>';
      return;
    }

    const result = await response.json();
    messageBox.innerHTML =
      '<div class="alert alert-success">✅ ' + result.message + "</div>";
    e.target.reset(); // clear form after success
  } catch (err) {
    console.error(err);
    messageBox.innerHTML =
      '<div class="alert alert-danger">⚠️ Something went wrong. Please try again later.</div>';
  }
});
