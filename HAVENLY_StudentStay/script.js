const residences = [
  {
    id: "1",
    name: "The Ivy Residence",
    environment: "female",
    location: "Near campus",
    price: 12000,
    deposit: 5000,
    room: "Shared room",
    description: "A welcoming student residence with furnished rooms and shared study spaces.",
    amenities: ["Wi-Fi", "Study area", "Laundry facilities", "Shared kitchen"],
    services: ["Water", "Security", "Common-area cleaning"]
  },
  {
    id: "2",
    name: "Maple Student Homes",
    environment: "male",
    location: "Near campus",
    price: 11000,
    deposit: 4000,
    room: "Shared room",
    description: "Practical student accommodation with essential facilities and communal spaces.",
    amenities: ["Wi-Fi", "Study desks", "Laundry area", "Kitchen"],
    services: ["Water", "Security", "Waste collection"]
  },
  {
    id: "3",
    name: "The Haven Apartments",
    environment: "mixed",
    location: "Near campus",
    price: 15000,
    deposit: 6000,
    room: "Single room",
    description: "Student apartments with private rooms and shared communal facilities.",
    amenities: ["Wi-Fi", "Private room", "Study lounge", "Laundry facilities"],
    services: ["Water", "Security", "Common-area cleaning"]
  },
  {
    id: "4",
    name: "Willow Court",
    environment: "female",
    location: "Town centre",
    price: 13500,
    deposit: 5000,
    room: "Single room",
    description: "A student residence offering private rooms and shared facilities.",
    amenities: ["Wi-Fi", "Study room", "Kitchen", "Laundry facilities"],
    services: ["Water", "Security"]
  },
  {
    id: "5",
    name: "Campus Point Living",
    environment: "male",
    location: "Town centre",
    price: 12500,
    deposit: 4500,
    room: "Single room",
    description: "Convenient student living with furnished rooms and shared study areas.",
    amenities: ["Wi-Fi", "Study area", "Kitchen", "Laundry facilities"],
    services: ["Water", "Security", "Waste collection"]
  },
  {
    id: "6",
    name: "Greenview Student Suites",
    environment: "mixed",
    location: "Near campus",
    price: 16000,
    deposit: 6000,
    room: "Single room",
    description: "A modern student living option with shared facilities and furnished rooms.",
    amenities: ["Wi-Fi", "Study lounge", "Kitchen", "Laundry facilities"],
    services: ["Water", "Security", "Common-area cleaning"]
  }
];

const money = amount =>
  `KSh ${Number(amount).toLocaleString("en-KE")}`;

const params = new URLSearchParams(window.location.search);
const environment = params.get("environment");
const residenceId = params.get("id");

function getResidence(id) {
  return residences.find(residence => residence.id === id);
}

// LISTINGS PAGE
const listingContainer = document.getElementById("listing-container");

if (listingContainer) {
  const validEnvironments = ["female", "male", "mixed"];
  const selectedEnvironment = validEnvironments.includes(environment)
    ? environment
    : null;

  const titles = {
    female: "Female-only accommodation",
    male: "Male-only accommodation",
    mixed: "Mixed-environment accommodation"
  };

  const heading = document.getElementById("listing-heading");
  const description = document.getElementById("listing-description");
  const noResults = document.getElementById("no-results");

  if (!selectedEnvironment) {
    heading.textContent = "Choose an accommodation environment";
    description.textContent = "Select a category to browse available residences.";
    listingContainer.innerHTML =
      '<a class="btn" href="environment.html">Choose environment</a>';
  } else {
    heading.textContent = titles[selectedEnvironment];
    description.textContent = "Select a residence to view its full details.";

    const matchingResidences = residences.filter(
      residence => residence.environment === selectedEnvironment
    );

    noResults.hidden = matchingResidences.length > 0;

    listingContainer.innerHTML = matchingResidences.map(residence => `
      <a class="listing-card" href="residence.html?id=${residence.id}">
        <div class="listing-image">
          <span>${residence.name}</span>
        </div>
        <div class="listing-info">
          <p class="eyebrow">${residence.environment.toUpperCase()} ONLY / MIXED</p>
          <h2>${residence.name}</h2>
          <p>${residence.location} · ${residence.room}</p>
          <strong>${money(residence.price)} <small>/ month</small></strong>
          <span class="card-link">View details →</span>
        </div>
      </a>
    `).join("");
  }
}

// RESIDENCE DETAILS PAGE
const residenceContent = document.getElementById("residence-content");

if (residenceContent) {
  const residence = getResidence(residenceId);

  if (!residence) {
    residenceContent.innerHTML = `
      <h1>Residence not found</h1>
      <p>Please return to the accommodation listings.</p>
      <a class="btn" href="environment.html">Browse residences</a>
    `;
  } else {
    residenceContent.innerHTML = `
      <div class="detail-banner">
        <p class="eyebrow">HAVENLY RESIDENCE</p>
        <h1>${residence.name}</h1>
        <p>${residence.location} · ${residence.room}</p>
      </div>

      <div class="detail-layout">
        <section>
          <h2>About this residence</h2>
          <p>${residence.description}</p>

          <h2>Amenities</h2>
          <ul>${residence.amenities.map(item => `<li>${item}</li>`).join("")}</ul>

          <h2>Services included</h2>
          <ul>${residence.services.map(item => `<li>${item}</li>`).join("")}</ul>
        </section>

        <aside class="price-panel">
          <p class="eyebrow">MONTHLY PRICE</p>
          <h2>${money(residence.price)}</h2>
          <p>Security deposit: ${money(residence.deposit)}</p>
          <p>Room type: ${residence.room}</p>
          <button class="btn" id="download-price">Download price list</button>
          <a class="btn btn-secondary" href="booking.html?id=${residence.id}">
            Make an enquiry
          </a>
        </aside>
      </div>
    `;

    document.getElementById("download-price").addEventListener("click", () => {
      const rows = [
        ["Residence", residence.name],
        ["Location", residence.location],
        ["Environment", residence.environment],
        ["Room type", residence.room],
        ["Monthly price", residence.price],
        ["Security deposit", residence.deposit],
        ["Amenities", residence.amenities.join(", ")],
        ["Services", residence.services.join(", ")]
      ];

      const csv = rows.map(row =>
        row.map(value => `"${String(value).replaceAll('"', '""')}"`).join(",")
      ).join("\n");

      const file = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(file);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${residence.name.replaceAll(" ", "_")}_price_list.csv`;
      link.click();
      URL.revokeObjectURL(url);
    });
  }
}

// BOOKING ENQUIRY PAGE
const bookingForm = document.getElementById("booking-form");

if (bookingForm) {
  const residence = getResidence(residenceId);
  const nameElement = document.getElementById("booking-residence-name");
  const backLink = document.getElementById("back-to-residence");

  if (!residence) {
    nameElement.textContent = "Residence not found. Please browse the listings again.";
    bookingForm.hidden = true;
  } else {
    nameElement.textContent =
      `Enquiry for ${residence.name} — ${money(residence.price)} per month.`;

    backLink.href = `residence.html?id=${residence.id}`;

    bookingForm.addEventListener("submit", event => {
      event.preventDefault();

      const formData = new FormData(bookingForm);
      const studentName = formData.get("studentName");

      document.getElementById("form-feedback").textContent =
        `Thank you, ${studentName}. This demo has recorded your enquiry on this page, but has not sent it to a residence.`;

      bookingForm.reset();
    });
  }
}