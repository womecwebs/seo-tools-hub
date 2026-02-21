document.addEventListener("DOMContentLoaded", () => {
  const generateBtn = document.getElementById("generateOutline");
  const output = document.getElementById("outlineOutput");
  const resultBlock = document.getElementById("outlineResult");

  generateBtn.addEventListener("click", () => {
    const keyword = document.getElementById("keyword").value.trim();
    const intent = document.getElementById("intent").value;
    const depth = document.getElementById("depth").value;

    if (!keyword) {
      alert("Please enter a target keyword");
      return;
    }

    const outline = buildOutline(keyword, intent, depth);
    output.innerText = outline;
    resultBlock.classList.remove("hidden");
  });

  document.getElementById("copyOutline").addEventListener("click", () => {
    navigator.clipboard.writeText(output.innerText);
    alert("Copied");
  });

  document.getElementById("downloadOutline").addEventListener("click", () => {
    const blob = new Blob([output.innerText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "seo-outline.txt";
    a.click();
    URL.revokeObjectURL(url);
  });
});

function buildOutline(keyword, intent, depth) {
  let wordTarget = depth === "advanced" ? "2000–2500" : "1000–1500";

  let outline = `
SEO CONTENT OUTLINE
===================

Target Keyword: ${keyword}
Search Intent: ${intent}
Recommended Word Count: ${wordTarget}

META TITLE:
${keyword} – Complete Guide (${new Date().getFullYear()})

META DESCRIPTION:
Discover everything about ${keyword}. Expert insights, tips, FAQs and actionable strategies.

--------------------------------------------------

H1: ${keyword}

INTRODUCTION
- Define ${keyword}
- Explain why it matters
- Preview what reader will learn

H2: What is ${keyword}?
- Clear definition
- Background context
- Who it is for

H2: Why is ${keyword} Important?
- Benefits
- Key advantages
- Real-world applications

H2: How to Approach ${keyword}
H3: Step 1
H3: Step 2
H3: Step 3

H2: Common Mistakes to Avoid
- Beginner errors
- Expert pitfalls

H2: Tools & Resources for ${keyword}
- Recommended tools
- Internal linking opportunities

H2: FAQs about ${keyword}
H3: What is ${keyword}?
H3: Is ${keyword} worth it?
H3: How long does ${keyword} take?
H3: Is ${keyword} beginner friendly?

H2: Final Thoughts
- Summary
- CTA
`;

  if (intent === "commercial" || intent === "transactional") {
    outline += `
BONUS SECTION (Commercial Intent)
---------------------------------
H2: Best ${keyword} Options
H2: Pricing Breakdown
H2: Comparison Table
H2: Where to Buy
`;
  }

  if (intent === "comparison") {
    outline += `
BONUS SECTION (Comparison)
--------------------------
H2: ${keyword} vs Alternative
H2: Pros and Cons
H2: Which One Should You Choose?
`;
  }

  return outline;
}
