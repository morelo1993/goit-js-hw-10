import axios from "axios";
import SlimSelect from "slim-select";

const apiKey = "live_8f7HcE85T9A8ydMcwBJGGJ7TLMAQGRIGse0JWmD4jZBiRr0SquNWrvTdT1UPUZMp";

axios.defaults.headers.common["x-api-key"] = apiKey;

const breedSelect = document.querySelector(".breed-select");
const loader = document.querySelector(".loader");
const error = document.querySelector(".error");
const catInfo = document.querySelector(".cat-info");

loader.style.display = "block";
breedSelect.style.display = "none";
error.style.display = "none";
catInfo.style.display = "none";

axios.get("https://api.thecatapi.com/v1/breeds")
  .then(response => {
    const breeds = response.data;
    loader.style.display = "none";
    breedSelect.style.display = "block";

    breeds.forEach(breed => {
      const option = document.createElement("option");
      option.value = breed.id;
      option.text = breed.name;
      breedSelect.appendChild(option);
    });

    new SlimSelect({
      select: ".breed-select",
      showSearch: false,
      placeholder: "Select a breed",
    });
  })
  .catch(error => {
    loader.style.display = "none";
    error.style.display = "block";
  });

breedSelect.addEventListener("change", event => {
  const breedId = event.target.value;
  loader.style.display = "block";
  catInfo.style.display = "none";

  axios.get(`https://api.thecatapi.com/v1/images/search?breed_ids=${breedId}`)
    .then(response => {
      const cat = response.data[0];
      loader.style.display = "none";
      catInfo.style.display = "block";
      catInfo.innerHTML = `
        <h2 class="cat-name">${cat.breeds[0].name}</h2>
        <p class="cat-description">${cat.breeds[0].description}</p>
        <p class="cat-temperament">Temperament: ${cat.breeds[0].temperament}</p>
        <img class="cat-image" src="${cat.url}" alt="Cat Image" />
      `;
    })
    .catch(error => {
      loader.style.display = "none";
      error.style.display = "block";
    });
});
