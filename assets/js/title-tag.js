// title-tag.js - generates multiple title tag variations and handles copy/preview

function showToast(message = "Done", ms = 1500) {
  const t = document.getElementById("toast");
  if (!t) return;
  t.innerText = message;
  t.classList.add("show");
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove("show"), ms);
}

function updateTitleCharColor(length) {
  const charEl = document.getElementById("charCount");
  if (!charEl) return;
  charEl.classList.remove("char-good", "char-warning", "char-bad");

  if (length < 45) {
    charEl.classList.add("char-warning");
  } else if (length <= 60) {
    charEl.classList.add("char-good");
  } else {
    charEl.classList.add("char-bad");
  }
}

function generateVariations(topic, keyword, brand, includeYear, count) {
  const year = new Date().getFullYear();
  const powerWords = [
    "Best",
    "Top",
    "Ultimate",
    "Complete",
    "Essential",
    "Proven",
  ];
  const templates = [
    // templates using keyword and topic and brand
    (k, t, b) => `${k} — ${t}${b ? " | " + b : ""}`,
    (k, t, b) => `${k}: ${t}${b ? " | " + b : ""}`,
    (k, t, b) => `${t} — ${k}${b ? " | " + b : ""}`,
    (k, t, b) =>
      `${powerWords[Math.floor(Math.random() * powerWords.length)]} ${k} for ${t}${b ? " | " + b : ""}`,
    (k, t, b) => `${t} | ${k}${b ? " • " + b : ""}`,
    (k, t, b) => `${k} (${year} Guide)${b ? " | " + b : ""}`,
  ];

  const out = new Set();
  // seed with some deterministic ones first
  for (let i = 0; i < templates.length && out.size < count; i++) {
    let title = templates[i](keyword, topic, brand);
    if (includeYear && !title.includes(String(year))) {
      title = `${title} ${year}`;
    }
    out.add(title.trim());
  }

  // if still need more, add powered variations
  while (out.size < count) {
    const p = templates[Math.floor(Math.random() * templates.length)];
    let t = p(keyword, topic, brand);
    if (includeYear && !t.includes(String(year))) t = `${t} ${year}`;
    out.add(t.trim());
  }

  return Array.from(out).slice(0, count);
}

// create DOM element for a variation row
function createVariationRow(text, index) {
  const wrapper = document.createElement("div");
  wrapper.className = "variation";

  const left = document.createElement("div");
  left.className = "title-text";
  left.innerText = text;

  const right = document.createElement("div");
  right.style.display = "flex";
  right.style.gap = "8px";
  right.style.alignItems = "center";

  const len = document.createElement("small");
  len.innerText = `${text.length} chars`;
  // color it
  if (text.length <= 60 && text.length >= 45) {
    len.className = "char-good";
  } else if (text.length < 45) {
    len.className = "char-warning";
  } else {
    len.className = "char-bad";
  }

  const copyBtn = document.createElement("button");
  copyBtn.className = "btn-dark";
  copyBtn.style.padding = "6px 10px";
  copyBtn.style.fontSize = "13px";
  copyBtn.innerText = "Copy";
  copyBtn.addEventListener("click", () => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        showToast("Title copied");
      })
      .catch(() => {
        showToast("Copy failed — copy manually");
      });
  });

  const selectBtn = document.createElement("button");
  selectBtn.className = "btn-dark";
  selectBtn.style.padding = "6px 10px";
  selectBtn.style.fontSize = "13px";
  selectBtn.style.background = "rgba(255,255,255,0.06)";
  selectBtn.style.color = "#fff";
  selectBtn.innerText = "Use";
  selectBtn.addEventListener("click", () => {
    // set preview and char count
    document.getElementById("previewTitle").innerText = text;
    document.getElementById("charCount").innerText = text.length;
    updateTitleCharColor(text.length);
    document.getElementById("resultBlock").style.display = "block";
    // scroll to preview
    window.scrollTo({
      top: document.getElementById("previewTitle").offsetTop - 80,
      behavior: "smooth",
    });
  });

  right.appendChild(len);
  right.appendChild(copyBtn);
  right.appendChild(selectBtn);

  wrapper.appendChild(left);
  wrapper.appendChild(right);
  return wrapper;
}

document.addEventListener("DOMContentLoaded", () => {
  const gen = document.getElementById("generateTitleBtn");
  const copySelected = document.getElementById("copySelectedBtn");
  const variationsList = document.getElementById("variationsList");

  gen &&
    gen.addEventListener("click", () => {
      const topic = document.getElementById("topicInput").value.trim();
      const keyword = document.getElementById("keywordInput").value.trim();
      const brand = document.getElementById("brandInput").value.trim();
      const includeYear = document.getElementById("includeYear").checked;
      const count = parseInt(
        document.getElementById("variationsCount").value || "3",
        10,
      );

      if (!topic || !keyword) {
        showToast("Please fill Topic and Main Keyword", 1800);
        return;
      }

      // generate
      const variations = generateVariations(
        topic,
        keyword,
        brand,
        includeYear,
        count,
      );

      // empty list
      variationsList.innerHTML = "";
      variations.forEach((t, i) => {
        const row = createVariationRow(t, i);
        variationsList.appendChild(row);
      });

      // default preview = first one
      const first = variations[0];
      document.getElementById("previewTitle").innerText = first;
      document.getElementById("charCount").innerText = first.length;
      updateTitleCharColor(first.length);

      document.getElementById("resultBlock").style.display = "block";
      // smooth scroll
      window.scrollTo({
        top: document.getElementById("resultBlock").offsetTop - 20,
        behavior: "smooth",
      });
    });

  // copy selected: copy text currently in previewTitle
  copySelected &&
    copySelected.addEventListener("click", () => {
      const txt = document.getElementById("previewTitle").innerText;
      if (!txt) {
        showToast("No title to copy");
        return;
      }
      navigator.clipboard
        .writeText(txt)
        .then(() => showToast("Title copied to clipboard"))
        .catch(() => showToast("Copy failed"));
    });
});
