      // Flip cards — hover on pointer devices, click on touch
      document.querySelectorAll(".interest-card").forEach((card) => {
        card.addEventListener("click", () => {
          if (!window.matchMedia("(hover: hover)").matches) {
            card.classList.toggle("flipped");
          }
        });
      });

      const searchInput = document.getElementById("search");
      if (searchInput) {
        const cards = document.querySelectorAll(".card");
        const filterBtns = document.querySelectorAll(".filter-btn");
        const emptyState = document.getElementById("empty");
        let activeFilter = "all";

        function updateVisibility() {
          const query = searchInput.value.toLowerCase().trim();
          let visible = 0;
          cards.forEach((card) => {
            const block = card.dataset.block;
            const type = card.dataset.type;
            const text = card
              .querySelector(".question")
              .textContent.toLowerCase();
            const matchesFilter =
              activeFilter === "all" ||
              block === activeFilter ||
              type === activeFilter;
            const matchesSearch = query === "" || text.includes(query);
            if (matchesFilter && matchesSearch) {
              card.classList.remove("hidden");
              visible++;
            } else card.classList.add("hidden");
          });
          document.querySelectorAll(".block-section").forEach((s) => {
            s.style.display =
              s.querySelectorAll(".card:not(.hidden)").length === 0
                ? "none"
                : "flex";
          });
          emptyState.style.display = visible === 0 ? "block" : "none";
        }

        filterBtns.forEach((btn) => {
          btn.addEventListener("click", () => {
            filterBtns.forEach((b) => b.classList.remove("active"));
            btn.classList.add("active");
            activeFilter = btn.dataset.filter;
            updateVisibility();
          });
        });

        searchInput.addEventListener("input", updateVisibility);
        updateVisibility();
      }

      // Contact form
      const contactForm = document.getElementById("contact-form");
      const formSuccess = document.getElementById("form-success");
      if (contactForm) {
        contactForm.addEventListener("submit", async (e) => {
          e.preventDefault();
          const data = new FormData(contactForm);
          const res = await fetch(contactForm.action, {
            method: "POST",
            body: data,
            headers: { Accept: "application/json" },
          });
          if (res.ok) {
            contactForm.reset();
            formSuccess.style.display = "block";
          }
        });
      }

      // Hamburger menu
      const hamburger = document.getElementById("hamburger");
      const navLinks = document.getElementById("nav-links");
      hamburger.addEventListener("click", () => {
        hamburger.classList.toggle("open");
        navLinks.classList.toggle("open");
      });
      navLinks.querySelectorAll("a").forEach((a) => {
        a.addEventListener("click", () => {
          hamburger.classList.remove("open");
          navLinks.classList.remove("open");
        });
      });

      // Auto-calculate QA experience years from March 2022
      const qaYears = Math.floor(
        (new Date() - new Date("2022-03-01")) / (365.25 * 24 * 60 * 60 * 1000),
      );
      const expBadge = document.getElementById("exp-badge");
      if (expBadge) {
        expBadge.dataset.es = qaYears + "+ años en QA";
        expBadge.dataset.en = qaYears + "+ years in QA";
        expBadge.textContent = qaYears + "+ años en QA";
      }

      // Language toggle
      const storedLang = localStorage.getItem("lang");
      const browserLang = (navigator.language || "es")
        .toLowerCase()
        .startsWith("es")
        ? "es"
        : "en";
      let lang = storedLang || browserLang;
      const langBtn = document.getElementById("lang-btn");

      function applyLang() {
        langBtn.textContent = lang === "es" ? "EN" : "ES";
        if (lang === "en") document.body.classList.add("en");
        else document.body.classList.remove("en");

        document.querySelectorAll("[data-es]").forEach((el) => {
          const text = el.dataset[lang];
          if (text) el.textContent = text;
        });

        const searchEl = document.getElementById("search");
        if (searchEl)
          searchEl.placeholder = lang === "en" ? "Search..." : "Buscar...";

        const successEl = document.getElementById("form-success");
        if (successEl)
          successEl.textContent =
            lang === "en"
              ? "Message sent! I'll get back to you soon."
              : "¡Mensaje enviado! Te respondo pronto.";

        const badgeSpan = document.querySelector(
          ".footer-badge span:last-child",
        );
        if (badgeSpan)
          badgeSpan.textContent =
            lang === "en" ? "Open to work" : "Disponible para trabajar";
        const copyBtn = document.querySelector("#copy-email-btn span");
        if (copyBtn)
          copyBtn.textContent = lang === "en" ? "Copy email" : "Copiar email";
      }

      applyLang();

      langBtn.addEventListener("click", () => {
        lang = lang === "es" ? "en" : "es";
        localStorage.setItem("lang", lang);
        applyLang();
      });

      // Scroll to top
      const scrollBtn = document.getElementById("scroll-top");
      window.addEventListener("scroll", () => {
        scrollBtn.classList.toggle("visible", window.scrollY > 400);
      });
      scrollBtn.addEventListener("click", () =>
        window.scrollTo({ top: 0, behavior: "smooth" }),
      );

      // Reveal on scroll
      (function () {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
              }
            });
          },
          { threshold: 0.08, rootMargin: "0px 0px -40px 0px" },
        );
        document.querySelectorAll("section .container").forEach((el) => {
          el.classList.add("reveal");
          observer.observe(el);
        });
      })();

      // Custom cursor (desktop only)
      if (window.matchMedia("(hover: hover)").matches) {
        const cursorDot = document.createElement("div");
        cursorDot.className = "cursor-dot";
        document.body.appendChild(cursorDot);
        document.addEventListener("mousemove", (e) => {
          cursorDot.style.left = e.clientX + "px";
          cursorDot.style.top = e.clientY + "px";
          cursorDot.classList.add("visible");
        });
        document.addEventListener("mouseleave", () =>
          cursorDot.classList.remove("visible"),
        );
        document
          .querySelectorAll(
            "a, button, .interest-card, .stack-card, .testi-card, .project-card, .manifesto-card",
          )
          .forEach((el) => {
            el.addEventListener("mouseenter", () =>
              cursorDot.classList.add("expanded"),
            );
            el.addEventListener("mouseleave", () =>
              cursorDot.classList.remove("expanded"),
            );
          });
      }

      // Copy email
      const copyEmailBtn = document.getElementById("copy-email-btn");
      const copyToast = document.getElementById("copy-toast");
      copyEmailBtn.addEventListener("click", () => {
        navigator.clipboard.writeText("micaaelajara@gmail.com").then(() => {
          copyToast.classList.add("show");
          setTimeout(() => copyToast.classList.remove("show"), 2000);
        });
      });

      // Confetti
      function fireConfetti(cx, cy) {
        const canvas = document.createElement("canvas");
        canvas.style.cssText =
          "position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9998;";
        document.body.appendChild(canvas);
        const ctx = canvas.getContext("2d");
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        const colors = [
          "#7c3aed",
          "#f0c0c0",
          "#f5d080",
          "#8ec0e8",
          "#b0dca0",
          "#f0a0b0",
        ];
        const startX = cx ?? canvas.width / 2;
        const startY = cy ?? canvas.height * 0.35;
        const particles = Array.from({ length: 90 }, () => ({
          x: startX,
          y: startY,
          vx: (Math.random() - 0.5) * 12,
          vy: Math.random() * -10 - 3,
          w: Math.random() * 10 + 5,
          h: Math.random() * 6 + 3,
          color: colors[Math.floor(Math.random() * colors.length)],
          rot: Math.random() * Math.PI * 2,
          vr: (Math.random() - 0.5) * 0.2,
          gravity: 0.28,
          opacity: 1,
        }));
        let frame = 0;
        function draw() {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          frame++;
          let alive = false;
          particles.forEach((p) => {
            p.vy += p.gravity;
            p.x += p.vx;
            p.y += p.vy;
            p.rot += p.vr;
            p.opacity = Math.max(0, 1 - frame / 110);
            if (p.opacity > 0) alive = true;
            ctx.save();
            ctx.globalAlpha = p.opacity;
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rot);
            ctx.fillStyle = p.color;
            ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
            ctx.restore();
          });
          if (alive) requestAnimationFrame(draw);
          else canvas.remove();
        }
        requestAnimationFrame(draw);
      }

      // Confetti on CV download
      const cvBtn = document.querySelector('a[href="pdf/cv-micaela-jara.pdf"]');
      if (cvBtn) {
        cvBtn.addEventListener("click", () => {
          const r = cvBtn.getBoundingClientRect();
          fireConfetti(r.left + r.width / 2, r.top);
        });
      }

      // Konami code
      (function () {
        const seq = [
          "ArrowUp",
          "ArrowUp",
          "ArrowDown",
          "ArrowDown",
          "ArrowLeft",
          "ArrowRight",
          "ArrowLeft",
          "ArrowRight",
          "b",
          "a",
        ];
        let idx = 0;
        document.addEventListener("keydown", (e) => {
          idx = e.key === seq[idx] ? idx + 1 : e.key === seq[0] ? 1 : 0;
          if (idx === seq.length) {
            idx = 0;
            fireConfetti();
            const t = document.getElementById("copy-toast");
            const prev = t.textContent;
            t.textContent = "All tests passed ✓";
            t.classList.add("show");
            setTimeout(() => {
              t.classList.remove("show");
              setTimeout(() => (t.textContent = prev), 300);
            }, 3000);
          }
        });
      })();
