function loadLayout() {
  const header = `
    <header class="navbar">
      <div class="nav-container">
        <a href="/" style="font-weight:700;color:white;text-decoration:none;">
          SEO Tools Hub
        </a>

        <nav class="nav-links">
          <a href="/">Home</a>
          <a href="/blog-posts/blogs.html">Blogs</a>
          <a href="/" class="nav-cta">All Tools</a>
        </nav>
      </div>
    </header>
  `;

  const footer = `
    <footer class="footer">
      © ${new Date().getFullYear()} SEO Tools Hub • Built for marketers & developers
    </footer>
  `;

  const headerContainer = document.getElementById("site-header");
  const footerContainer = document.getElementById("site-footer");

  if (headerContainer) headerContainer.innerHTML = header;
  if (footerContainer) footerContainer.innerHTML = footer;

  // highlight active link
  const links = document.querySelectorAll(".nav-links a");
  const path = location.pathname.replace(/\/$/, "");

  links.forEach((link) => {
    if (link.getAttribute("href") === path) {
      link.style.color = "white";
      link.style.fontWeight = "600";
    }
  });
}

function createParticles() {
  const container = document.getElementById("particles");
  if (!container) return;

  const qty = 60;
  const rand = (min, max) => Math.random() * (max - min) + min;

  for (let i = 0; i < qty; i++) {
    const p = document.createElement("span");
    p.className = "particle";
    p.style.left = rand(0, 100) + "%";
    p.style.animationDuration = rand(10, 18) + "s";
    p.style.opacity = rand(0.2, 0.8);
    p.style.width = p.style.height = rand(4, 8) + "px";
    container.appendChild(p);
  }
}

document.addEventListener("DOMContentLoaded", function () {
  loadLayout();
  createParticles();
});
