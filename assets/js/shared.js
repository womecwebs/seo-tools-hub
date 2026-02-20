function loadLayout() {
  const header = `
  <header class="bg-indigo-600 text-white">
    <div class="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
      <a href="/" class="text-xl font-bold">SEO Tools Hub</a>
      <nav class="space-x-6 text-sm">
        <a href="/" class="hover:underline">Home</a>
        <a href="/tools/meta-description.html" class="hover:underline">Meta Tool</a>
      </nav>
    </div>
  </header>
  `;

  const footer = `
  <footer class="bg-gray-100 mt-12">
    <div class="max-w-6xl mx-auto px-6 py-6 text-sm text-gray-600 text-center">
      © 2026 SEO Tools Hub. Built for developers & marketers.
    </div>
  </footer>
  `;

  document.getElementById("site-header").innerHTML = header;
  document.getElementById("site-footer").innerHTML = footer;
}

document.addEventListener("DOMContentLoaded", loadLayout);
