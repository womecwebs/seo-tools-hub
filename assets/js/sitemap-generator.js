document.addEventListener("DOMContentLoaded", function () {
  const generateBtn = document.getElementById("generateBtn");
  const copyBtn = document.getElementById("copyBtn");
  const downloadBtn = document.getElementById("downloadBtn");

  generateBtn.addEventListener("click", generateSitemap);
  copyBtn.addEventListener("click", copySitemap);
  downloadBtn.addEventListener("click", downloadSitemap);
});

function generateSitemap() {
  const urlsText = document.getElementById("urlsInput").value.trim();
  const changeFreq = document.getElementById("changeFreq").value;
  const priority = document.getElementById("priority").value;
  const lastModInput = document.getElementById("lastMod").value;

  if (!urlsText) {
    alert("Please enter at least one URL.");
    return;
  }

  const urls = urlsText
    .split("\n")
    .map((url) => url.trim())
    .filter((url) => url !== "");

  const lastMod = lastModInput
    ? lastModInput
    : new Date().toISOString().split("T")[0];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  urls.forEach((url) => {
    xml += `  <url>\n`;
    xml += `    <loc>${url}</loc>\n`;
    xml += `    <lastmod>${lastMod}</lastmod>\n`;
    xml += `    <changefreq>${changeFreq}</changefreq>\n`;
    xml += `    <priority>${priority}</priority>\n`;
    xml += `  </url>\n`;
  });

  xml += `</urlset>`;

  document.getElementById("sitemapOutput").textContent = xml;
  document.getElementById("urlCount").textContent = urls.length;
  document.getElementById("resultSection").classList.remove("hidden");
}

function copySitemap() {
  const text = document.getElementById("sitemapOutput").textContent;
  navigator.clipboard.writeText(text);

  const toast = document.getElementById("toast");
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2000);
}

function downloadSitemap() {
  const text = document.getElementById("sitemapOutput").textContent;
  const blob = new Blob([text], { type: "application/xml" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "sitemap.xml";
  a.click();

  URL.revokeObjectURL(url);
}
