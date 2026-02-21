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
      <div class="container">
        <div
          style="
            display: flex;
            flex-wrap: wrap;
            gap: 30px;
            align-items: flex-start;
            justify-content: space-between;
          "
        >
          <div>
            <strong style="color: white">SEO Tools Hub</strong>
            <p class="text-muted" style="max-width: 420px">
              Free professional tools to help publishers, agencies and
              developers optimize content for search engines and answer engines.
            </p>
          </div>

          <div style="display: flex; gap: 28px; flex-wrap: wrap">
            <div class="footer-content">
              <h3 style="color: white; font-size: 15px; margin-bottom: 8px">
                Tools
              </h3>
              <ul style="list-style: none; padding: 0; line-height: 1.9">
                <li>
                  <a href="/tools/robots-txt-generator.html"
                    >Robots.txt Generator</a
                  >
                </li>
                <li>
                  <a href="/tools/meta-description.html"
                    >Meta Description Generator</a
                  >
                </li>
                <li>
                  <a href="/tools/schema-generator.html">Schema Generator</a>
                </li>
                <li>
                  <a href="/tools/sitemap-generator.html">Sitemap Generator</a>
                </li>
                <li>
                  <a href="/tools/open-graph-generator.html"
                    >Open Graph Meta Tag Generator</a
                  >
                </li>
                <li>
                  <a href="/tools/title-tag.html">Title Tag Optimizer</a>
                </li>
                <li>
                  <a href="/tools/image-alt-text-generator.html"
                    >Image Alt Text Generator</a
                  >
                </li>
                <li>
                  <a href="/tools/seo-content-outline.html"
                    >SEO Content Outline Generator</a
                  >
                </li>
                <li>
                  <a href="/tools/blog-idea-generator.html"
                    >Free Blog Idea Generator</a
                  >
                </li>
                <li>
                  <a href="/tools/url-slug-generator.html"
                    >URL Slug Generator</a
                  >
                </li>
              </ul>
            </div>

            <div class="footer-content">
              <h3 style="color: white; font-size: 15px; margin-bottom: 8px">
                Company
              </h3>
              <ul style="list-style: none; padding: 0; line-height: 1.9">
                <li><a href="/">Home</a></li>
                <li><a href="/pages/about.html">About</a></li>
                <li><a href="/blog/">Blog</a></li>
                <li><a href="/pages/contact.html">Contact</a></li>
              </ul>
            </div>

            <div class="footer-content">
              <h3 style="color: white; font-size: 15px; margin-bottom: 8px">
                Legal
              </h3>
              <ul style="list-style: none; padding: 0; line-height: 1.9">
                <li><a href="/pages/privacy-policy.html">Privacy Policy</a></li>
                <li><a href="/pages/terms-of-service.html">Terms</a></li>
                <li><a href="/pages/disclaimer.html">Disclaimer</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div
          style="
            margin-top: 28px;
            text-align: center;
            color: #9ca3af;
            font-size: 14px;
          "
        >      
      © ${new Date().getFullYear()} SEO Tools Hub • Built for marketers, publishers & developers
      </div>
      </div>
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
