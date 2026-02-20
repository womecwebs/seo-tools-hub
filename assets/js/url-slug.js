function showToast(message = "Done", ms = 1500) {
  const t = document.getElementById("toast");
  if (!t) return;
  t.innerText = message;
  t.classList.add("show");
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove("show"), ms);
}

function generateSlug() {
  let text = document.getElementById("slugInput").value.trim();
  const removeStops = document.getElementById("removeStopWords").checked;

  if (!text) {
    showToast("Enter a title first");
    return;
  }

  const stopWords = [
    "a",
    "an",
    "the",
    "and",
    "or",
    "but",
    "in",
    "on",
    "at",
    "to",
    "for",
    "of",
    "with",
    "by",
  ];

  text = text.toLowerCase();

  // remove special characters
  text = text.replace(/[^a-z0-9\s-]/g, "");

  let words = text.split(/\s+/);

  if (removeStops) {
    words = words.filter((word) => !stopWords.includes(word));
  }

  let slug = words.join("-");

  // remove multiple dashes
  slug = slug.replace(/-+/g, "-");

  // trim to 60 chars
  if (slug.length > 60) {
    slug = slug.substring(0, 60);
  }

  document.getElementById("slugOutput").innerText = slug;
  document.getElementById("slugLength").innerText = slug.length;

  document.getElementById("slugResult").style.display = "block";
}

function copySlug() {
  const slug = document.getElementById("slugOutput").innerText;
  if (!slug) return;

  navigator.clipboard
    .writeText(slug)
    .then(() => showToast("Slug copied"))
    .catch(() => showToast("Copy failed"));
}

document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("generateSlugBtn")
    .addEventListener("click", generateSlug);

  document.getElementById("copySlugBtn").addEventListener("click", copySlug);
});
