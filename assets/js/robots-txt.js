function showToast(message = "Done", ms = 1500) {
  const t = document.getElementById("toast");
  if (!t) return;
  t.innerText = message;
  t.classList.add("show");
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove("show"), ms);
}

function generateRobots() {
  const domain = document.getElementById("domainInput").value.trim();
  const blockAdmin = document.getElementById("blockAdmin").checked;
  const blockParams = document.getElementById("blockParams").checked;
  const allowAll = document.getElementById("allowAll").checked;

  if (!domain) {
    showToast("Enter your domain first");
    return;
  }

  let content = "";

  if (allowAll) {
    content += "User-agent: *\n";
  }

  content += "Allow: /\n";

  if (blockAdmin) {
    content += "Disallow: /wp-admin/\n";
  }

  if (blockParams) {
    content += "Disallow: /*?\n";
  }

  content += "\nSitemap: https://" + domain + "/sitemap.xml";

  document.getElementById("robotsOutput").innerText = content;
  document.getElementById("robotsResult").style.display = "block";
}

function copyRobots() {
  const text = document.getElementById("robotsOutput").innerText;
  navigator.clipboard
    .writeText(text)
    .then(() => showToast("robots.txt copied"))
    .catch(() => showToast("Copy failed"));
}

document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("generateRobotsBtn")
    .addEventListener("click", generateRobots);

  document
    .getElementById("copyRobotsBtn")
    .addEventListener("click", copyRobots);
});
