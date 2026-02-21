// schema-builder.js
// Renders forms per schema type, generates JSON-LD, validates, copy & download.

document.addEventListener("DOMContentLoaded", () => {
  const typeSelect = document.getElementById("schemaType");
  const formArea = document.getElementById("formArea");
  const generateBtn = document.getElementById("generateBtn");
  const validateBtn = document.getElementById("validateBtn");
  const copyBtn = document.getElementById("copyJsonBtn");
  const downloadBtn = document.getElementById("downloadJsonBtn");

  // initial render
  renderForm(typeSelect.value);

  // Live validation while typing
  document.addEventListener("input", (e) => {
    if (document.getElementById("resultBlock").classList.contains("hidden"))
      return;

    clearTimeout(window._liveTimer);
    window._liveTimer = setTimeout(() => {
      validateSchema();
    }, 500);
  });

  typeSelect.addEventListener("change", () => renderForm(typeSelect.value));
  generateBtn.addEventListener("click", () => {
    const type = typeSelect.value;
    const json = buildJsonLd(type);
    if (json) {
      showJson(json);
      showToast("JSON-LD generated");
    }
  });

  validateBtn.addEventListener("click", validateSchema);

  document.getElementById("googleTestBtn").addEventListener("click", () => {
    window.open("https://search.google.com/test/rich-results", "_blank");
  });

  document.getElementById("schemaOrgBtn").addEventListener("click", () => {
    window.open("https://validator.schema.org/", "_blank");
  });

  copyBtn.addEventListener("click", () => {
    const t = document.getElementById("jsonOutput").innerText;
    if (!t) {
      showToast("Nothing to copy");
      return;
    }
    navigator.clipboard.writeText(t).then(() => showToast("Copied JSON-LD"));
  });

  downloadBtn.addEventListener("click", () => {
    const t = document.getElementById("jsonOutput").innerText;
    if (!t) {
      showToast("Nothing to download");
      return;
    }
    const blob = new Blob([t], { type: "application/ld+json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "schema.jsonld";
    a.click();
    URL.revokeObjectURL(url);
  });
});

// render dynamic form area based on type
function renderForm(type) {
  const area = document.getElementById("formArea");
  area.innerHTML = ""; // clear

  // small helper to create labeled input
  function inputHtml(id, label, placeholder = "") {
    return `<div>
      <label class="text-muted" style="display:block;margin-bottom:6px">${label}</label>
      <input id="${id}" class="input-dark" placeholder="${placeholder}" />
    </div>`;
  }

  // shared fields
  let html = "";
  html += inputHtml("name", "Name / Title", "Example: How to bake sourdough");
  html += inputHtml("url", "URL", "https://example.com/page");
  html += `<div>
    <label class="text-muted" style="display:block;margin-bottom:6px">Description</label>
    <textarea id="description" class="textarea-dark" rows="3" placeholder="Short description"></textarea>
  </div>`;

  // type specific
  if (type === "Article") {
    html += inputHtml("author", "Author", "Name");
    html += `<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
      <input id="datePublished" class="input-dark" type="date" />
      <input id="image" class="input-dark" placeholder="Image URL (https://...)" />
    </div>`;
  } else if (type === "Product") {
    html += inputHtml("image", "Image URL", "https://example.com/image.jpg");
    html += `<div style="display:grid;grid-template-columns:1fr 1fr; gap:12px">
      <input id="price" class="input-dark" placeholder="Price (e.g. 49.99)" />
      <input id="currency" class="input-dark" placeholder="Currency (e.g. USD)" />
    </div>`;
    html += inputHtml("availability", "Availability", "InStock / OutOfStock");
  } else if (type === "LocalBusiness") {
    html += inputHtml("telephone", "Telephone", "+1-555-555-5555");
    html += inputHtml("address", "Address", "Street, City, Country");
    html += `<div style="display:grid;grid-template-columns:1fr 1fr; gap:12px">
      <input id="latitude" class="input-dark" placeholder="Latitude" />
      <input id="longitude" class="input-dark" placeholder="Longitude" />
    </div>`;
  } else if (type === "Organization") {
    html += inputHtml("logo", "Logo URL", "https://example.com/logo.png");
    html += inputHtml(
      "sameAs",
      "SameAs (social profile)",
      "https://twitter.com/yourhandle",
    );
  } else if (type === "Person") {
    html += inputHtml("jobTitle", "Job Title", "e.g. Author, Founder");
    html += inputHtml("image", "Image URL", "https://example.com/photo.jpg");
  } else if (type === "FAQPage") {
    // dynamic FAQ editor
    html += `<div id="faqEditor">
      <div id="faqList"></div>
      <div style="display:flex; gap:10px; margin-top:8px">
        <input id="faqQ" class="input-dark" placeholder="Question" />
        <input id="faqA" class="input-dark" placeholder="Answer" />
        <button id="addFaqBtn" class="btn-dark" style="padding:8px 10px">Add</button>
      </div>
      <div class="text-muted" style="margin-top:8px">Add multiple question/answer pairs for FAQ schema.</div>
    </div>`;
  } else if (type === "HowTo") {
    html += `<div id="howtoEditor">
      <div id="howtoSteps"></div>
      <div style="display:flex; gap:8px; margin-top:8px">
        <input id="stepName" class="input-dark" placeholder="Step title" />
        <input id="stepText" class="input-dark" placeholder="Step text" />
        <button id="addStepBtn" class="btn-dark" style="padding:8px 10px">Add</button>
      </div>
      <div class="text-muted" style="margin-top:8px">Add steps to build a HowTo schema.</div>
    </div>`;
  }

  area.innerHTML = html;

  // attach dynamic handlers for FAQ and HowTo editors
  if (type === "FAQPage") attachFaqHandlers();
  if (type === "HowTo") attachHowToHandlers();
}

// FAQ handlers
function attachFaqHandlers() {
  const faqList = document.getElementById("faqList");
  const addBtn = document.getElementById("addFaqBtn");
  addBtn.addEventListener("click", () => {
    const q = document.getElementById("faqQ").value.trim();
    const a = document.getElementById("faqA").value.trim();
    if (!q || !a) {
      showToast("Add question and answer");
      return;
    }
    const idx = Date.now();
    const row = document.createElement("div");
    row.className = "variation";
    row.id = "faq_" + idx;
    row.innerHTML = `<div style="flex:1"><strong style="color:#e6eefc">${escapeHtml(q)}</strong><div style="color:rgba(255,255,255,0.7);margin-top:6px">${escapeHtml(a)}</div></div>
      <div style="display:flex;gap:8px;align-items:center">
        <button class="btn-dark" style="padding:6px 8px" onclick="removeFaq('${"faq_" + idx}')">Remove</button>
      </div>`;
    faqList.appendChild(row);
    document.getElementById("faqQ").value = "";
    document.getElementById("faqA").value = "";
  });
}

function removeFaq(id) {
  const el = document.getElementById(id);
  if (el) el.remove();
}

// HowTo handlers
function attachHowToHandlers() {
  const steps = document.getElementById("howtoSteps");
  const addBtn = document.getElementById("addStepBtn");
  addBtn.addEventListener("click", () => {
    const name = document.getElementById("stepName").value.trim();
    const text = document.getElementById("stepText").value.trim();
    if (!name || !text) {
      showToast("Add step title and text");
      return;
    }
    const idx = Date.now();
    const row = document.createElement("div");
    row.className = "variation";
    row.id = "step_" + idx;
    row.innerHTML = `<div style="flex:1"><strong style="color:#e6eefc">${escapeHtml(name)}</strong><div style="color:rgba(255,255,255,0.7);margin-top:6px">${escapeHtml(text)}</div></div>
      <div style="display:flex;gap:8px;align-items:center">
        <button class="btn-dark" style="padding:6px 8px" onclick="removeStep('${"step_" + idx}')">Remove</button>
      </div>`;
    steps.appendChild(row);
    document.getElementById("stepName").value = "";
    document.getElementById("stepText").value = "";
  });
}

function removeStep(id) {
  const el = document.getElementById(id);
  if (el) el.remove();
}

// build JSON-LD object based on type
function buildJsonLd(type) {
  try {
    // base fields
    const name = getValue("name");
    const url = getValue("url");
    const description = getValue("description");

    if (!name || !url) {
      showToast("Please add at least Name and URL");
      return null;
    }

    const ctx = { "@context": "https://schema.org" };
    let obj = { "@context": "https://schema.org", "@type": type };

    if (name) obj.name = name;
    if (description) obj.description = description;
    if (url) obj.url = url;

    if (type === "Article") {
      const author = getValue("author");
      const datePublished = getValue("datePublished");
      const image = getValue("image");
      if (author) obj.author = { "@type": "Person", name: author };
      if (datePublished) obj.datePublished = datePublished;
      if (image) obj.image = image;
    } else if (type === "Product") {
      const image = getValue("image");
      const price = getValue("price");
      const currency = getValue("currency") || "USD";
      const availability = getValue("availability") || "InStock";
      if (image) obj.image = image;
      obj.offers = {
        "@type": "Offer",
        price: price || "",
        priceCurrency: currency,
        availability: `https://schema.org/${availability}`,
      };
    } else if (type === "LocalBusiness") {
      const telephone = getValue("telephone");
      const address = getValue("address");
      const lat = getValue("latitude"),
        lon = getValue("longitude");
      if (telephone) obj.telephone = telephone;
      if (address)
        obj.address = { "@type": "PostalAddress", streetAddress: address };
      if (lat && lon)
        obj.geo = {
          "@type": "GeoCoordinates",
          latitude: parseFloat(lat),
          longitude: parseFloat(lon),
        };
    } else if (type === "Organization") {
      const logo = getValue("logo");
      const sameAs = getValue("sameAs");
      if (logo) obj.logo = logo;
      if (sameAs)
        obj.sameAs = Array.from(sameAs.split(","))
          .map((s) => s.trim())
          .filter(Boolean);
    } else if (type === "Person") {
      const job = getValue("jobTitle");
      const image = getValue("image");
      if (job) obj.jobTitle = job;
      if (image) obj.image = image;
    } else if (type === "FAQPage") {
      // collect faq pairs
      const faqList = document.querySelectorAll("#faqList .variation");
      const mainEntity = [];
      faqList.forEach((el) => {
        const q = el.querySelector("strong")?.innerText || "";
        const a = el.querySelector("div div")?.innerText || "";
        if (q && a) {
          mainEntity.push({
            "@type": "Question",
            name: q,
            acceptedAnswer: { "@type": "Answer", text: a },
          });
        }
      });
      if (mainEntity.length === 0) {
        showToast("Add at least one FAQ item");
        return null;
      }
      obj["mainEntity"] = mainEntity;
      obj["@type"] = "FAQPage";
    } else if (type === "HowTo") {
      const stepEls = document.querySelectorAll("#howtoSteps .variation");
      if (stepEls.length === 0) {
        showToast("Add at least one step");
        return null;
      }
      obj["@type"] = "HowTo";
      obj.step = Array.from(stepEls).map((el, idx) => {
        const title =
          el.querySelector("strong")?.innerText || `Step ${idx + 1}`;
        const text = el.querySelector("div div")?.innerText || "";
        return {
          "@type": "HowToStep",
          name: title,
          text: text,
        };
      });
    }

    return obj;
  } catch (e) {
    showToast("Error building JSON-LD: " + e.message);
    return null;
  }
}

// helpers
function getValue(id) {
  const el = document.getElementById(id);
  if (!el) return "";
  return (el.value || "").trim();
}

function showJson(obj) {
  const pretty = JSON.stringify(obj, null, 2);
  document.getElementById("jsonOutput").innerText = pretty;
  document.getElementById("resultBlock").classList.remove("hidden");
  setValidation(false, "Not validated");
}

function setValidation(ok, msg) {
  const state = document.getElementById("validationStatus");
  if (!state) return;

  state.innerText = "Validation: " + msg;
  state.className = "validation-status " + (ok ? "success" : "neutral");
}

function escapeHtml(s) {
  return (s || "").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
}

// small toast function (reuses site toast)
function showToast(message = "Done", ms = 1500) {
  const t = document.getElementById("toast");
  if (!t) return;
  t.innerText = message;
  t.classList.add("show");
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove("show"), ms);
}

function validateSchema() {
  const jsonText = document.getElementById("jsonOutput").innerText;
  const status = document.getElementById("validationStatus");
  const messages = document.getElementById("validationMessages");

  messages.innerHTML = "";

  if (!jsonText) {
    status.innerText = "Validation: No schema generated";
    status.className = "validation-status error";
    addMessage("❌ Please generate JSON-LD first.");
    return;
  }

  let parsed;

  // 1️⃣ JSON syntax validation
  try {
    parsed = JSON.parse(jsonText);
    addMessage("✅ JSON format is valid");
  } catch (error) {
    status.innerText = "Validation: Invalid JSON format";
    status.className = "validation-status error";
    addMessage("❌ JSON syntax error: " + error.message);
    return;
  }

  // 2️⃣ Required root properties
  if (!parsed["@context"] || !parsed["@type"]) {
    status.innerText = "Validation: Missing required properties";
    status.className = "validation-status error";
    addMessage("❌ Missing @context or @type");
    return;
  }

  addMessage("✅ Contains @context and @type");

  // 3️⃣ Type-based validation
  const type = parsed["@type"];

  const requiredFields = {
    FAQPage: ["mainEntity"],
    Article: ["author", "datePublished"],
    Product: ["name", "offers"],
    Organization: ["name", "url"],
    LocalBusiness: ["name", "address"],
    Person: ["name"],
    HowTo: ["step"],
  };

  let hasError = false;

  if (requiredFields[type]) {
    requiredFields[type].forEach((field) => {
      if (!parsed[field]) {
        addMessage("⚠ Missing recommended field: " + field);
        hasError = true;
      } else {
        addMessage("✅ " + field + " is present");
      }
    });
  }

  if (hasError) {
    status.innerText = "Validation: Completed with warnings";
    status.className = "validation-status neutral";
  } else {
    status.innerText = "Validation: Passed basic checks";
    status.className = "validation-status success";
  }
}
