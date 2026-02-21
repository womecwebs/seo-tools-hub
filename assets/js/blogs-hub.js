const posts = [
  {
    title: "How to Write a High-CTR Meta Description (With Examples)",
    slug: "/blog/how-write-high-ctr-meta-description-with-examples.html",
    date: "2026-02-21",
    excerpt:
      "Step-by-step method to craft meta descriptions that increase CTR. Examples, templates and copy-ready snippets.",
    tags: ["meta", "ctr", "copywriting"],
    featuredTool: "/tools/meta-description.html",
  },

  // add all posts here
];

const perPage = 8;
let page = 1;

function renderPosts(list) {
  const container = document.getElementById("postsList");
  container.innerHTML = "";
  list.forEach((p) => {
    const card = document.createElement("article");
    card.className = "card";
    card.style.padding = "18px";
    card.innerHTML = `
      <h3 style="margin-bottom:6px"><a href="${p.slug}" style="color:inherit;text-decoration:none">${p.title}</a></h3>
      <div style="font-size:13px;color:var(--text-muted);margin-bottom:10px">${p.date} • ${p.tags.join(", ")}</div>
      <p style="color:var(--text-muted);margin-bottom:12px">${p.excerpt}</p>
      <div style="display:flex;gap:8px;align-items:center">
        <a class="card-btn" href="${p.slug}">Read →</a>
        <a class="card-btn" href="${p.featuredTool}" style="background:transparent;color:var(--primary);border:1px solid var(--primary)">Use Tool</a>
      </div>`;
    container.appendChild(card);
  });
}

function paginate(list, p = 1) {
  const start = (p - 1) * perPage;
  return list.slice(start, start + perPage);
}

function renderPagination(total, current = 1) {
  const pages = Math.ceil(total / perPage);
  const el = document.getElementById("postsPagination");
  el.innerHTML = "";
  if (pages <= 1) return;
  for (let i = 1; i <= pages; i++) {
    const b = document.createElement("button");
    b.textContent = i;
    b.style.padding = "8px 12px";
    b.style.borderRadius = "8px";
    b.style.border =
      i === current ? "2px solid var(--primary)" : "1px solid #e5e7eb";
    b.addEventListener("click", () => {
      page = i;
      apply();
    });
    el.appendChild(b);
  }
}

function apply() {
  const q = (document.getElementById("blogSearch")?.value || "")
    .toLowerCase()
    .trim();
  const filtered = posts.filter((p) =>
    (p.title + p.excerpt + p.tags.join(" ")).toLowerCase().includes(q),
  );
  renderPosts(paginate(filtered, page));
  renderPagination(filtered.length, page);
  updateListSchema(filtered);
}

function updateListSchema(list) {
  const schemaTag = document.getElementById("blog-list-schema");
  const schema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "SEO Tools Hub",
    url: "https://seo-aeo-tools.pages.dev/blogs/",
    blogPost: list.slice(0, 50).map((p, idx) => ({
      "@type": "BlogPosting",
      headline: p.title,
      url: "https://seo-aeo-tools.pages.dev/" + p.slug,
      datePublished: p.date,
      description: p.excerpt,
    })),
  };
  schemaTag.textContent = JSON.stringify(schema);
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("blogSearch").addEventListener("input", () => {
    page = 1;
    apply();
  });
  apply();
});
