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

  document.getElementById("site-header").innerHTML = header;
  document.getElementById("site-footer").innerHTML = footer;

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

document.addEventListener("DOMContentLoaded", loadLayout);
