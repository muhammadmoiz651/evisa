document.addEventListener("DOMContentLoaded", () => {
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll("section");

  // Hide all sections initially
  sections.forEach(section => section.style.display = "none");

  const savedSection = localStorage.getItem("activeSection") || "dashboard";

  // Show the saved section
  document.getElementById(savedSection).style.display = "block";
  document.querySelector(`.nav-link[data-section="${savedSection}"]`)?.classList.add("active");

  // Click event
  navLinks.forEach(link => {
    link.addEventListener("click", function (e) {
      e.preventDefault();

      // Hide all sections
      sections.forEach(section => section.style.display = "none");

      // Remove active classes
      navLinks.forEach(link => link.classList.remove("active"));

      const target = this.getAttribute("data-section");

      // Show selected section
      document.getElementById(target).style.display = "block";
      this.classList.add("active");

      // Save to localStorage
      localStorage.setItem("activeSection", target);
    });
  });
});
