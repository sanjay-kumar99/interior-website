const BASE_URL = "https://interior-backend.onrender.com";

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
