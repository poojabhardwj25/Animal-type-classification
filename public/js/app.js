// Camera & Canvas setup
let video, canvas, ctx;
document.addEventListener("DOMContentLoaded", function () {
  video = document.getElementById("video");
  canvas = document.getElementById("canvas");
  if (canvas) ctx = canvas.getContext("2d");

  // Dashboard cards
  const animalCards = document.getElementById("animalCards");
  if (animalCards) displayAnimals(); // keep for frontend display (optional)


  //Login
const loginForm = document.getElementById("loginForm");
if(loginForm){
  loginForm.addEventListener("submit", async function(e){
    e.preventDefault();
    const username = document.getElementById("username").value;

    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username })  // send username only
    });

    if(res.redirected){
      window.location.href = res.url; // redirect to dashboard
    } else {
      const text = await res.text();
      document.getElementById("loginMessage").innerText = text;
    }
  });
}



  // Breed database cards
  const breedCards = document.getElementById("breedCards");
  if (breedCards) displayBreeds(); // keep for frontend display (optional)
});

// BREEDS demo (can later be fetched from server)
const BREEDS = [
  { name: "Gir", region: "Gujarat", notes: "Convex forehead, high milk yield" },
  { name: "Sahiwal", region: "Punjab/Haryana/Rajasthan", notes: "Reddish-brown, heat tolerant" },
  { name: "Murrah", region: "Haryana/Punjab/UP", notes: "Black, high-yield buffalo" },
  { name: "Tharparkar", region: "Rajasthan", notes: "White-grey dual-purpose" },
  { name: "Red Sindhi", region: "Sindh/Pakistan", notes: "High milk yield, reddish coat" }
];

// Camera Functions
function startCamera() {
  navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => { video.srcObject = stream; video.play(); })
    .catch(err => console.error("Camera error:", err));
}

function captureImage() {
  if (!ctx) return;
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
}

function uploadFile() {
  const file = document.getElementById("fileInput").files[0];
  if (!file) return alert("Select an image first.");
  const reader = new FileReader();
  reader.onload = function (e) {
    const img = new Image();
    img.onload = function () {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

// Breed Recognition Functions
function analyzeImage() {
  const breeds = BREEDS.map(b => b.name)
    .sort(() => 0.5 - Math.random())
    .slice(0, 3);

  const carousel = document.getElementById("breedCarousel");
  if (!carousel) return;
  carousel.innerHTML = "";

  breeds.forEach(b => {
    const card = document.createElement("div");
    card.className = "carousel-card";
    card.innerHTML = `<h4>${b}</h4>
                      <button onclick="confirmBreed('${b}')">Confirm</button>`;
    carousel.appendChild(card);
  });
}

function confirmBreed(breed) {
  // Set breed value in registration form if exists
  const breedInput = document.getElementById("breed");
  if (breedInput) breedInput.value = breed;

  alert("Breed confirmed: " + breed);
  window.location.href = "/registration"; // redirect to registration page
}

// Dashboard Display Functions (frontend only)
function displayAnimals() {
  const container = document.getElementById("animalCards");
  if (!container) return;

  const records = []; // temporarily empty, backend will fetch real data
  document.getElementById("totalAnimals").innerText = records.length;
  container.innerHTML = "";

  records.forEach(r => {
    const card = document.createElement("div");
    card.className = "animal-card";
    card.innerHTML = `<h4>${r.breed} (${r.species})</h4>
                      <p>Owner: ${r.ownerName}</p>
                      <p>ID: ${r.animalId}</p>`;
    container.appendChild(card);
  });
}

function filterAnimals() {
  const val = document.getElementById("searchAnimals").value.toLowerCase();
  const container = document.getElementById("animalCards");
  if (!container) return;

  const records = []; // backend data
  const filtered = records.filter(r =>
    r.breed.toLowerCase().includes(val) ||
    r.ownerName.toLowerCase().includes(val) ||
    r.animalId.toLowerCase().includes(val)
  );

  container.innerHTML = "";
  filtered.forEach(r => {
    const card = document.createElement("div");
    card.className = "animal-card";
    card.innerHTML = `<h4>${r.breed} (${r.species})</h4>
                      <p>Owner: ${r.ownerName}</p>
                      <p>ID: ${r.animalId}</p>`;
    container.appendChild(card);
  });
}

// Breed DB Display
function displayBreeds() {
  const container = document.getElementById("breedCards");
  if (!container) return;

  container.innerHTML = "";
  BREEDS.forEach(b => {
    const card = document.createElement("div");
    card.className = "animal-card";
    card.innerHTML = `<h4>${b.name}</h4><p>${b.region}</p><p>${b.notes}</p>`;
    container.appendChild(card);
  });
}

function filterBreeds() {
  const val = document.getElementById("searchBreeds").value.toLowerCase();
  const container = document.getElementById("breedCards");
  if (!container) return;

  container.innerHTML = "";
  BREEDS.filter(b => b.name.toLowerCase().includes(val))
    .forEach(b => {
      const card = document.createElement("div");
      card.className = "animal-card";
      card.innerHTML = `<h4>${b.name}</h4><p>${b.region}</p><p>${b.notes}</p>`;
      container.appendChild(card);
    });
}

// Logout
function logout() {
  window.location.href = "/login";
}