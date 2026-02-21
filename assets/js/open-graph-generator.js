document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("generateBtn").addEventListener("click", generateOG);
  document.getElementById("copyBtn").addEventListener("click", copyTags);
});

function generateOG() {
  const title = document.getElementById("ogTitle").value.trim();
  const desc = document.getElementById("ogDesc").value.trim();
  const url = document.getElementById("ogUrl").value.trim();
  const image = document.getElementById("ogImage").value.trim();
  const type = document.getElementById("ogType").value;
  const twitter = document.getElementById("twitterCard").checked;

  if (!title || !url) {
    alert("Title and URL are required.");
    return;
  }

  let tags = `
<meta property="og:title" content="${title}" />
<meta property="og:description" content="${desc}" />
<meta property="og:url" content="${url}" />
<meta property="og:type" content="${type}" />
<meta property="og:image" content="${image}" />
`;

  if (twitter) {
    tags += `
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${title}" />
<meta name="twitter:description" content="${desc}" />
<meta name="twitter:image" content="${image}" />
`;
  }

  document.getElementById("metaOutput").textContent = tags.trim();
  document.getElementById("previewTitle").textContent = title;
  document.getElementById("previewDesc").textContent = desc;
  document.getElementById("previewUrl").textContent = url;
  document.getElementById("previewImage").src = image;

  document.getElementById("previewSection").classList.remove("hidden");
}

function copyTags() {
  const text = document.getElementById("metaOutput").textContent;
  navigator.clipboard.writeText(text);

  const toast = document.getElementById("toast");
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2000);
}
