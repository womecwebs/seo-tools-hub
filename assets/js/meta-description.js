function generateMeta() {
  const title = document.getElementById("titleInput").value.trim();
  const keywords = document.getElementById("keywordInput").value.trim();
  const description = document.getElementById("descriptionInput").value.trim();

  if (!title || !description) {
    alert("Please fill in at least the title and description.");
    return;
  }

  let meta = `${description}`;

  if (keywords) {
    meta += ` Discover more about ${keywords}.`;
  }

  if (meta.length > 160) {
    meta = meta.substring(0, 157) + "...";
  }

  document.getElementById("metaOutput").innerText = meta;
  document.getElementById("charCount").innerText = meta.length;
  document.getElementById("resultSection").classList.remove("hidden");
}
