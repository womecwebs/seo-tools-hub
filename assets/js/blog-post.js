// blog-post.js
document.addEventListener("DOMContentLoaded", () => {
  // 1. Read time
  const content = document.getElementById("postContent");
  if (content) {
    const words = content.innerText.trim().split(/\s+/).length;
    const minutes = Math.max(1, Math.round(words / 200));
    document.getElementById("readTime").innerText = `${minutes} min read`;
  }

  // 2. Table of contents (H2/H3)
  const toc = document.getElementById("toc");
  if (toc && content) {
    const headings = content.querySelectorAll("h2, h3");
    if (headings.length) {
      const ul = document.createElement("ul");
      ul.style.listStyle = "none";
      ul.style.paddingLeft = "0";
      headings.forEach((h) => {
        if (!h.id)
          h.id = h.innerText
            .toLowerCase()
            .replace(/[^\w]+/g, "-")
            .replace(/^-|-$/g, "");
        const li = document.createElement("li");
        li.style.marginBottom = "6px";
        li.innerHTML = `<a href="#${h.id}" style="color:var(--primary)">${h.tagName === "H2" ? "" : "↳ "}${h.innerText}</a>`;
        ul.appendChild(li);
      });
      toc.appendChild(ul);
    }
  }

  // 3. FAQ JSON-LD generation
  const faqList = document.getElementById("faqList");
  if (faqList) {
    const items = [];
    faqList.querySelectorAll(".faq-item").forEach((it) => {
      const q = it.querySelector(".faq-question")?.innerText || "";
      const a = it.querySelector(".faq-answer")?.innerText || "";
      if (q && a)
        items.push({
          "@type": "Question",
          name: q.trim(),
          acceptedAnswer: { "@type": "Answer", text: a.trim() },
        });
    });
    if (items.length) {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.text = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: items,
      });
      document.head.appendChild(script);
    }
  }

  // 4. TOC toggle
  const toggle = document.querySelector(".toc-toggle");
  const tocContent = document.querySelector(".toc-content");
  const icon = document.querySelector(".toc-icon");

  if (toggle && tocContent) {
    toggle.addEventListener("click", function () {
      tocContent.classList.toggle("open");

      if (icon) {
        icon.textContent = tocContent.classList.contains("open") ? "−" : "+";
      }
    });
  }
});
