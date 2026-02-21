document.addEventListener("DOMContentLoaded", () => {
  const generateBtn = document.getElementById("generateAlt");
  const output = document.getElementById("altOutput");
  const resultBlock = document.getElementById("altResult");

  generateBtn.addEventListener("click", () => {
    const desc = document.getElementById("imageDesc").value.trim();
    const keyword = document.getElementById("targetKeyword").value.trim();
    const purpose = document.getElementById("imagePurpose").value;

    if (!desc) {
      alert("Please describe the image.");
      return;
    }

    const altText = buildAltText(desc, keyword, purpose);
    output.innerText = altText;
    resultBlock.classList.remove("hidden");
  });

  document.getElementById("copyAlt").addEventListener("click", () => {
    navigator.clipboard.writeText(output.innerText);
    alert("Copied");
  });

  document.getElementById("downloadAlt").addEventListener("click", () => {
    const blob = new Blob([output.innerText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "image-alt-text.txt";
    a.click();
    URL.revokeObjectURL(url);
  });
});

function buildAltText(desc, keyword, purpose) {
  if (purpose === "decorative") {
    return `
Recommended Alt Text:
""  (Leave empty for decorative images)

Why?
Decorative images should use empty alt attributes for accessibility best practices.
`;
  }

  let variations = [];

  let base = desc;

  if (keyword) {
    base += ` related to ${keyword}`;
  }

  // Keep it under ~125 characters
  let clean = base.length > 125 ? base.substring(0, 122) + "..." : base;

  variations.push("1️⃣ SEO Optimized:\n" + clean);

  variations.push(
    "2️⃣ Accessibility Focused:\n" +
      desc +
      (keyword ? ` showing ${keyword}` : ""),
  );

  if (purpose === "product") {
    variations.push(
      "3️⃣ Product Style:\n" +
        desc +
        (keyword ? ` – ${keyword} product image` : " product image"),
    );
  }

  if (purpose === "hero") {
    variations.push(
      "3️⃣ Hero Image Style:\n" +
        desc +
        (keyword ? ` representing ${keyword}` : ""),
    );
  }

  variations.push(`
Character Count (SEO best practice: under 125 characters):
${clean.length} characters`);

  return variations.join("\n\n------------------------\n\n");
}
