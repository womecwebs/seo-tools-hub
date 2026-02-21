// Tool Switching
const toolButtons = document.querySelectorAll(".tool-btn");
const faqGroups = document.querySelectorAll(".faq-group");
const searchInput = document.getElementById("faqSearch");
const noResults = document.getElementById("noResults");

toolButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    toolButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    const tool = btn.getAttribute("data-tool");

    faqGroups.forEach((group) => {
      if (group.getAttribute("data-tool") === tool) {
        group.classList.remove("hidden");
      } else {
        group.classList.add("hidden");
      }
    });

    searchInput.value = "";
    resetFAQVisibility();
    generateFAQSchema(tool);
  });
});

// Accordion
document.addEventListener("click", function (e) {
  if (e.target.closest(".faq-question")) {
    const question = e.target.closest(".faq-question");
    const answer = question.nextElementSibling;
    const toggle = question.querySelector(".faq-toggle");

    if (answer.style.display === "block") {
      answer.style.display = "none";
      toggle.textContent = "+";
    } else {
      answer.style.display = "block";
      toggle.textContent = "−";
    }
  }
});

// Search Filter
searchInput.addEventListener("input", function () {
  const term = this.value.toLowerCase();
  let found = false;

  document.querySelectorAll(".faq-item").forEach((item) => {
    const text = item.innerText.toLowerCase();
    if (text.includes(term)) {
      item.style.display = "block";
      found = true;
    } else {
      item.style.display = "none";
    }
  });

  noResults.style.display = found ? "none" : "block";
});

// Reset visibility
function resetFAQVisibility() {
  document.querySelectorAll(".faq-item").forEach((item) => {
    item.style.display = "block";
  });
  noResults.style.display = "none";
}

// Dynamic FAQ Schema
function generateFAQSchema(tool) {
  const activeGroup = document.querySelector(`.faq-group[data-tool="${tool}"]`);
  const items = [];

  activeGroup.querySelectorAll(".faq-item").forEach((item) => {
    if (item.style.display !== "none") {
      const question = item
        .querySelector(".faq-question")
        .innerText.replace("+", "")
        .replace("−", "");
      const answer = item.querySelector(".faq-answer").innerText;

      items.push({
        "@type": "Question",
        name: question.trim(),
        acceptedAnswer: {
          "@type": "Answer",
          text: answer.trim(),
        },
      });
    }
  });

  const oldSchema = document.getElementById("faq-schema");
  if (oldSchema) oldSchema.remove();

  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items,
  };

  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.id = "faq-schema";
  script.text = JSON.stringify(schema);

  document.head.appendChild(script);
}

generateFAQSchema("meta");
