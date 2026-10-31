/* =========================================================
   SCRIPT PRINCIPAL · Alba Agudo
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* ---------------------------------------------------------
     1. LÓGICA DEL DESPLEGABLE (Portada)
     --------------------------------------------------------- */
  const dropdown = document.getElementById("dropdownProyectos");
  const dropdownToggle = document.getElementById("dropdownToggle");
  if (dropdown && dropdownToggle) {
    // Abrir/cerrar al hacer clic en el botón
    dropdownToggle.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation(); // Evita que el clic se propague al document
      const isOpen = dropdown.classList.toggle("is-open");
      dropdownToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    // Cerrar si se hace clic fuera del menú
    document.addEventListener("click", (e) => {
      if (!dropdown.contains(e.target)) {
        dropdown.classList.remove("is-open");
        dropdownToggle.setAttribute("aria-expanded", "false");
      }
    });

    // Cerrar si se pulsa la tecla Escape
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && dropdown.classList.contains("is-open")) {
        dropdown.classList.remove("is-open");
        dropdownToggle.setAttribute("aria-expanded", "false");
      }
    });

    // Cerrar el menú al hacer clic en una opción (para que se vea limpio)
    const dropdownItems = dropdown.querySelectorAll(".dropdown-item");
    dropdownItems.forEach((item) => {
      item.addEventListener("click", () => {
        dropdown.classList.remove("is-open");
        dropdownToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------------------------------------------------------
     2. ANIMACIONES AL HACER SCROLL (Reveal)
     --------------------------------------------------------- */
  const reveals = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target); // Solo anima una vez
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -50px 0px" }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    // Fallback para navegadores antiguos
    reveals.forEach((el) => el.classList.add("is-visible"));
  }

  /* ---------------------------------------------------------
     3. BOTÓN VOLVER ARRIBA
     --------------------------------------------------------- */
  const backToTop = document.getElementById("backToTop");
  
  if (backToTop) {
    const onScrollTop = () => {
      if (window.scrollY > 600) backToTop.classList.add("visible");
      else backToTop.classList.remove("visible");
    };
    
    window.addEventListener("scroll", onScrollTop, { passive: true });
    onScrollTop(); // Ejecutar al cargar por si ya estamos abajo

    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---------------------------------------------------------
     4. AÑO DINÁMICO EN EL FOOTER
     --------------------------------------------------------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------------------------------------------------------
     5. FORMULARIO DE CONTACTO (Validación)
     --------------------------------------------------------- */
  const form = document.getElementById("contactForm");
  const status = document.getElementById("formStatus");

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      status.textContent = "";
      status.className = "form__status";

      // Validación básica de campos requeridos
      const required = form.querySelectorAll("[required]");
      let valid = true;

      required.forEach((field) => {
        field.classList.remove("error");
        if (!field.value.trim()) {
          valid = false;
          field.classList.add("error");
        }
      });

      // Validación específica del email
      const email = form.querySelector("#email");
      if (email && email.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
        valid = false;
        email.classList.add("error");
      }

      if (!valid) {
        status.textContent = "Por favor, revisa los campos marcados.";
        status.classList.add("is-error");
        return;
      }

           // Envío real a Formspree
      status.textContent = "Enviando…";
      status.classList.add("is-loading");

      fetch("https://formspree.io/f/xyeenzdy", {
        method: "POST",
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      })
      .then((response) => {
        if (response.ok) {
          status.textContent = "¡Gracias! Te responderé en 24–48 h.";
          status.className = "form__status is-success";
          form.reset();
        } else {
          status.textContent = "Hubo un problema. Inténtalo de nuevo.";
          status.className = "form__status is-error";
        }
      })
      .catch(() => {
        status.textContent = "Error de conexión. Inténtalo más tarde.";
        status.className = "form__status is-error";
      });
    })

    // Quitar el estado de error al escribir
    form.querySelectorAll("input, textarea, select").forEach((field) => {
      field.addEventListener("input", () => {
        field.classList.remove("error");
      });
    });
  }

});