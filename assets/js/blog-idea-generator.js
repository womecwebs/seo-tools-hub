const generateBtn = document.getElementById("generateBtn");
const resultSection = document.getElementById("resultSection");
const ideasContainer = document.getElementById("ideasContainer");
const toast = document.getElementById("toast");

generateBtn.addEventListener("click", generateIdeas);
document.getElementById("copyAllBtn").addEventListener("click", copyAll);

function generateIdeas() {
  const keyword = document.getElementById("keywordInput").value.trim();
  const niche = document.getElementById("nicheInput").value.trim();
  const audience = document.getElementById("audienceInput").value.trim();
  const goal = document.getElementById("goalInput").value;

  if (!keyword) return;

  const templates = [
    `How to Use ${keyword} in ${niche} (Complete Guide for ${audience})`,
    `Best ${keyword} Tools for ${audience}`,
    `${keyword} vs Alternatives: Which One Wins?`,
    `Is ${keyword} Worth It in 2026?`,
    `10 ${keyword} Mistakes Beginners Make`,
    `Advanced ${keyword} Strategies That Actually Work`,
    `${keyword} Case Study: Real Results`,
    `${keyword} Trends in 2026 (Data & Insights)`,
  ];

  ideasContainer.innerHTML = "";

  templates.forEach((title) => {
    const intent = detectIntent(title);
    const monetization = monetizationStrategy(goal);

    const div = document.createElement("div");
    div.className = "variation";

    div.innerHTML = `
      <div class="title-text">${title}</div>
      <small>${intent} | ${monetization}</small>
    `;

    ideasContainer.appendChild(div);
  });

  resultSection.classList.remove("hidden");
}

function detectIntent(title) {
  if (/how|guide/i.test(title)) return "Informational";
  if (/best|vs/i.test(title)) return "Commercial";
  if (/worth/i.test(title)) return "Transactional";
  return "Informational";
}

function monetizationStrategy(goal) {
  switch (goal) {
    case "affiliate":
      return "Affiliate Angle";
    case "leads":
      return "Lead Magnet Opportunity";
    case "authority":
      return "Authority Builder";
    default:
      return "Ad Revenue Optimized";
  }
}

function copyAll() {
  const titles = [...document.querySelectorAll(".title-text")]
    .map((el) => el.innerText)
    .join("\n");

  navigator.clipboard.writeText(titles);

  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2000);
}
