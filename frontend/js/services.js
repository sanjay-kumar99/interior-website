const BASE_URL = "http://localhost:5000";

document.querySelectorAll(".service-card img").forEach(img => {
  const category = img.dataset.cat;

  fetch(`${BASE_URL}/api/gallery/${category}`)
    .then(res => res.json())
    .then(data => {
      if (data.length > 0) {
        img.src = data[0];
      }
    })
    .catch(err => console.log(err));
});
