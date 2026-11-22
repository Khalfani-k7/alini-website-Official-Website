// Shared mobile navigation.
const menuButton = document.querySelector(".menu");
const navigation = document.querySelector("#navigation");
function closeMenu() {
  navigation?.classList.remove("open");
  menuButton?.setAttribute("aria-expanded", "false");
}
menuButton?.addEventListener("click", () => {
  const isOpen = navigation.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(isOpen));
});
navigation?.addEventListener("click", (event) => {
  if (event.target.closest("a")) closeMenu();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && navigation?.classList.contains("open")) {
    closeMenu();
    menuButton.focus();
  }
});
document.querySelector("#year").textContent = new Date().getFullYear();
// Progressive enhancement: all engagements remain visible without JavaScript.
const filters = document.querySelectorAll("[data-filter]");
const engagements = document.querySelectorAll("[data-category]");
filters.forEach((button) =>
  button.addEventListener("click", () => {
    const selected = button.dataset.filter;
    filters.forEach((filter) =>
      filter.setAttribute("aria-pressed", String(filter === button)),
    );
    let count = 0;
    engagements.forEach((item) => {
      item.hidden = selected !== "All" && item.dataset.category !== selected;
      if (!item.hidden) count++;
    });
    document.querySelector("#filter-status").textContent =
      `${count} engagements shown`;
  }),
);

// Contact form: opens WhatsApp or email with the message prefilled.
const enquiryForm = document.querySelector("#enquiry-form");
if (enquiryForm) {
  const compose = () => {
    const d = new FormData(enquiryForm);
    const lines = [
      `Hello Alini Investment, my name is ${d.get("name")}.`,
      `Interested in: ${d.get("interest")}`,
      "",
      d.get("message"),
      "",
      `Email: ${d.get("email")}`,
    ];
    if (d.get("phone")) lines.push(`Phone: ${d.get("phone")}`);
    return { text: lines.join("\n"), interest: d.get("interest") };
  };
  enquiryForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!enquiryForm.reportValidity()) return;
    window.open(
      "https://wa.me/2349058996646?text=" + encodeURIComponent(compose().text),
      "_blank",
      "noopener",
    );
  });
  enquiryForm.querySelector("[data-email]")?.addEventListener("click", () => {
    if (!enquiryForm.reportValidity()) return;
    const { text, interest } = compose();
    location.href =
      "mailto:alininvestment@gmail.com?subject=" +
      encodeURIComponent("Enquiry: " + interest) +
      "&body=" +
      encodeURIComponent(text);
  });
}

// Gentle scroll-reveal; skipped for visitors who prefer reduced motion.
if (
  "IntersectionObserver" in window &&
  !matchMedia("(prefers-reduced-motion: reduce)").matches
) {
  document.documentElement.classList.add("js");
  const targets = document.querySelectorAll(
    ".section-heading, .service-grid article, .story-grid article, .team-card, .content-card, .stats-strip div, .teaser-card, .offices > div",
  );
  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((en) => {
        if (en.isIntersecting) {
          en.target.classList.add("in");
          io.unobserve(en.target);
        }
      }),
    { threshold: 0.12 },
  );
  Array.from(targets).filter((el) => !el.closest("dialog")).forEach((el) => {
    el.classList.add("reveal");
    io.observe(el);
  });
}

// Team profile dialogs: open, close (X, Esc, backdrop) and lock page scroll.
document.querySelectorAll("[data-open]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const dlg = document.getElementById(btn.dataset.open);
    if (!dlg?.showModal) return;
    dlg.showModal();
    dlg.scrollTop = 0;
    document.body.classList.add("dialog-open");
  });
});
document.querySelectorAll(".profile-dialog").forEach((dlg) => {
  dlg.querySelector(".dialog-close")?.addEventListener("click", () => dlg.close());
  dlg.addEventListener("click", (e) => {
    if (e.target === dlg) dlg.close();
  });
  dlg.addEventListener("close", () => document.body.classList.remove("dialog-open"));
});
