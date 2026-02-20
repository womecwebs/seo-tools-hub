function generateMeta() {
  const title = document.getElementById("titleInput").value;
  const keywords = document.getElementById("keywordInput").value;
  const description = document.getElementById("descriptionInput").value;

  if (!title || !description) {
    alert("Please fill in at least the title and description.");
    return;
  }

  const meta = `${title} - ${description}. Learn more about ${keywords}.`;

  document.getElementById("metaOutput").innerText = meta;
  document.getElementById("charCount").innerText = meta.length;

  document.getElementById("resultSection").classList.remove("hidden");
}
