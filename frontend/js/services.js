const BASE_URL = "https://interior-website-bwn1.onrender.com";

document.querySelectorAll(".service-card img").forEach((img) => {
  const category = img.dataset.category || img.dataset.cat;
  console.log("Fetching:", `${BASE_URL}/api/gallery/${category}`);

  fetch(`${BASE_URL}/api/gallery/${category}`)
    .then((res) => res.json())
    .then((data) => {
      if (data.length > 0) {
        img.src = data[0];
      }
    })
    .catch((err) => console.log(err));
});
