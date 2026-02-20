// meta-description.js
function generateMeta() {
  const title = document.getElementById("titleInput").value.trim();
  const keywords = document.getElementById("keywordInput").value.trim();
  const description = document.getElementById("descriptionInput").value.trim();

  if (!title || !description) {
    // nicer in-page alert
    showToast("Please fill in title and description", 2200);
    return;
  }

  let meta = description;
  if (keywords) {
    meta += ` Learn more about ${keywords}.`;
  }

  // keep within 160 char limit (very conservative)
  if (meta.length > 160) {
    meta = meta.substring(0, 157) + "...";
  }

  document.getElementById("previewTitle").innerText = title;
  document.getElementById("metaOutput").innerText = meta;
  document.getElementById("charCount").innerText = meta.length;

  // reveal result
  document.getElementById("resultSection").classList.remove("hidden");
  window.scrollTo({
    top: document.getElementById("resultSection").offsetTop - 20,
    behavior: "smooth",
  });
}

function updateCharColor(length) {
  const charElement = document.getElementById("charCount");

  charElement.classList.remove("char-good", "char-warning", "char-bad");

  if (length <= 140) {
    charElement.classList.add("char-warning");
  } else if (length <= 160) {
    charElement.classList.add("char-good");
  } else {
    charElement.classList.add("char-bad");
  }
}

function copyMeta() {
  const metaText = document.getElementById("metaOutput").innerText;
  navigator.clipboard
    .writeText(metaText)
    .then(() => {
      showToast("Meta copied to clipboard");
    })
    .catch(() => {
      showToast("Copy failed — please copy manually");
    });
}

/* small toast utility */
function showToast(message = "Done", ms = 1600) {
  const t = document.getElementById("toast");
  if (!t) return;
  t.innerText = message;
  t.classList.add("show");
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove("show"), ms);
}

/* attach events */
document.addEventListener("DOMContentLoaded", () => {
  const gen = document.getElementById("generateBtn");
  if (gen) gen.addEventListener("click", generateMeta);

  const copy = document.getElementById("copyBtn");
  if (copy) copy.addEventListener("click", copyMeta);

  // live char update (optional) - keep lightweight
  const desc = document.getElementById("descriptionInput");
  if (desc) {
    desc.addEventListener("input", () => {
      const sample = desc.value.trim();
      const length = sample.length;
      const charEl = document.getElementById("charCount");
      if (charEl) charEl.innerText = length;
      updateCharColor(length);
    });
  }
});
