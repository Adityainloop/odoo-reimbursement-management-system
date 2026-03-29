document.addEventListener("DOMContentLoaded", () => {
  let currentStep = 1;

  const steps = document.querySelectorAll(".step-panel");
  const pills = document.querySelectorAll(".step-pill");
  const nextBtn = byId("nextBtn");
  const prevBtn = byId("prevBtn");
  const countrySelect = byId("country");
  const currencyDisplay = byId("currencyDisplay");

  function renderStep() {
    steps.forEach((step, i) =>
      step.classList.toggle("active", i + 1 === currentStep),
    );
    pills.forEach((pill, i) =>
      pill.classList.toggle("active", i + 1 === currentStep),
    );
    prevBtn.style.display = currentStep === 1 ? "none" : "inline-block";
    nextBtn.textContent = currentStep === 3 ? "Finish" : "Next";
  }

  nextBtn?.addEventListener("click", () => {
    if (currentStep < 3) {
      currentStep++;
      renderStep();
    } else {
      showToast("Registration demo completed!", "success");
      window.location.href = "login.html";
    }
  });

  prevBtn?.addEventListener("click", () => {
    if (currentStep > 1) {
      currentStep--;
      renderStep();
    }
  });

  async function loadCountries() {
    try {
      const res = await fetch(
        "https://restcountries.com/v3.1/all?fields=name,currencies",
      );
      const data = await res.json();
      const sorted = data.sort((a, b) =>
        a.name.common.localeCompare(b.name.common),
      );

      sorted.forEach((country) => {
        const option = document.createElement("option");
        option.value = country.name.common;
        option.dataset.currency = country.currencies
          ? Object.keys(country.currencies)[0]
          : "N/A";
        option.textContent = country.name.common;
        countrySelect.appendChild(option);
      });
    } catch {
      showToast("Could not load countries API. Using demo mode.", "warning");
    }
  }

  countrySelect?.addEventListener("change", () => {
    const selected = countrySelect.options[countrySelect.selectedIndex];
    currencyDisplay.textContent = selected.dataset.currency || "N/A";
  });

  renderStep();
  loadCountries();
});
