/* ==========================================================================
   FRANOVA — interactions
   Sections: data, blueprint renderer, theme, starfield, header, nav,
             hero slideshow, scroll reveal, card tilt, cursor glow, form
   ========================================================================== */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var isCoarsePointer = window.matchMedia("(hover: none), (pointer: coarse)").matches;

  /* ------------------------------------------------------------------ */
  /* Shared blueprint car mark (reused across hero + collection cards)   */
  /* A single silhouette rendered as a technical line drawing — the      */
  /* site's signature device. Category is carried by name/specs/icon,    */
  /* not by redrawing the car, so every model reads as one continuous    */
  /* "house style."                                                      */
  /* ------------------------------------------------------------------ */
  var CAR_PATH =
    "M18,118 C18,104 30,90 52,86 L86,64 C108,47 138,36 172,33 L226,30 " +
    "C258,29 282,38 302,54 L328,68 C349,74 364,84 372,99 L372,118 " +
    "L339,118 C338,101 324,89 308,89 C292,89 279,101 277,118 " +
    "L141,118 C140,101 126,89 110,89 C94,89 81,101 79,118 Z";

  var HOOD_LINE = "M86,64 C112,72 150,74 190,72";
  var CABIN_LINE = "M172,33 L184,64 M226,30 L246,64";

  function blueprintSVG(nodePositions) {
    nodePositions = nodePositions || [
      [110, 89], [308, 89], [200, 31]
    ];
    var nodes = nodePositions
      .map(function (p) {
        return '<circle class="node" cx="' + p[0] + '" cy="' + p[1] + '" r="3.4"></circle>';
      })
      .join("");
    return (
      '<svg class="blueprint-svg" viewBox="0 0 392 140" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Blueprint rendering of a FRANOVA vehicle silhouette">' +
      '<path class="car-fill" d="' + CAR_PATH + '"></path>' +
      '<path class="car-path" d="' + CAR_PATH + '"></path>' +
      '<path class="car-path" d="' + HOOD_LINE + '" stroke-width="0.9" opacity="0.6"></path>' +
      '<path class="car-path" d="' + CABIN_LINE + '" stroke-width="0.9" opacity="0.6"></path>' +
      '<circle class="car-path" cx="110" cy="118" r="19"></circle>' +
      '<circle class="car-path" cx="308" cy="118" r="19"></circle>' +
      nodes +
      "</svg>"
    );
  }

  /* ------------------------------------------------------------------ */
  /* Model data                                                          */
  /* ------------------------------------------------------------------ */
  var MODELS = [
    {
      name: "Franova Nova",
      cls: "Electric Hypercar",
      tag: "Flagship",
      zero60: "1.9s",
      top: "210 mph",
      power: "1,340 hp",
      desc: "The car the house is named for. Quad-motor, structural battery, and a launch that arrives before you've finished bracing for it."
    },
    {
      name: "Franova Solace",
      cls: "Hypercar",
      tag: "Limited",
      zero60: "2.4s",
      top: "217 mph",
      power: "1,020 hp",
      desc: "A naturally-aspirated V12 re-engineered for one purpose: the sound and the speed, in that order."
    },
    {
      name: "Franova Meridian",
      cls: "Grand Tourer",
      tag: "Signature",
      zero60: "3.1s",
      top: "199 mph",
      power: "640 hp",
      desc: "Effortless across a continent, ruthless on a circuit. The daily-driver hypercar, rebuilt from the road up."
    },
    {
      name: "Franova Ironclad",
      cls: "American Muscle",
      tag: "Heritage",
      zero60: "2.9s",
      top: "194 mph",
      power: "755 hp",
      desc: "A supercharged V8 with a chassis finally worthy of it. Loud on purpose, precise by design."
    },
    {
      name: "Franova Apex",
      cls: "Executive Sport Sedan",
      tag: "Everyday",
      zero60: "3.6s",
      top: "180 mph",
      power: "523 hp",
      desc: "A boardroom-to-back-road sedan with rear-biased all-wheel drive and a cabin built for both."
    },
    {
      name: "Franova Zenith",
      cls: "Super SUV",
      tag: "Family",
      zero60: "3.3s",
      top: "190 mph",
      power: "690 hp",
      desc: "Three rows of luggage, one row of lap times. Air suspension tuned for gravel roads and apexes alike."
    }
  ];

  /* ------------------------------------------------------------------ */
  /* Render: model grid                                                  */
  /* ------------------------------------------------------------------ */
  var modelGrid = document.getElementById("modelGrid");
  var modelSelect = document.getElementById("modelInterest");

  MODELS.forEach(function (m, i) {
    var card = document.createElement("article");
    card.className = "model-card reveal";
    card.innerHTML =
      '<div class="model-card-top">' +
        '<span class="model-tag">' + m.tag + "</span>" +
        '<span class="model-index">0' + (i + 1) + " / 0" + MODELS.length + "</span>" +
      "</div>" +
      '<h3 class="model-name">' + m.name + "</h3>" +
      '<p class="model-class">' + m.cls + "</p>" +
      '<div class="blueprint-wrap">' + blueprintSVG() + "</div>" +
      '<div class="spec-row">' +
        '<div class="spec"><div class="spec-value">' + m.zero60 + '</div><div class="spec-label">0&ndash;60 mph</div></div>' +
        '<div class="spec"><div class="spec-value">' + m.top + '</div><div class="spec-label">Top Speed</div></div>' +
        '<div class="spec"><div class="spec-value">' + m.power + '</div><div class="spec-label">Power</div></div>' +
      "</div>" +
      '<p class="model-desc">' + m.desc + "</p>" +
      '<a class="model-cta" href="#inquire" data-model="' + m.name + '">' +
        "<span>Configure</span>" +
        '<svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg>' +
      "</a>";
    modelGrid.appendChild(card);

    var opt = document.createElement("option");
    opt.value = m.name;
    opt.textContent = m.name + " — " + m.cls;
    modelSelect.appendChild(opt);
  });

  // Clicking "Configure" preselects the model in the inquiry form.
  modelGrid.addEventListener("click", function (e) {
    var link = e.target.closest(".model-cta");
    if (!link) return;
    var name = link.getAttribute("data-model");
    if (modelSelect && name) modelSelect.value = name;
  });

  /* ------------------------------------------------------------------ */
  /* Render: hero slideshow                                              */
  /* ------------------------------------------------------------------ */
  var heroSlidesEl = document.getElementById("heroSlides");
  var dotsEl = document.getElementById("slideDots");
  var HERO_SET = [MODELS[0], MODELS[1], MODELS[2], MODELS[3]];

  HERO_SET.forEach(function (m, i) {
    var slide = document.createElement("div");
    slide.className = "hero-slide" + (i === 0 ? " is-active" : "");
    slide.setAttribute("role", "group");
    slide.setAttribute("aria-roledescription", "slide");
    slide.setAttribute("aria-label", (i + 1) + " of " + HERO_SET.length + ": " + m.name);
    slide.innerHTML =
      blueprintSVG() +
      '<div class="hero-slide-caption">' + m.cls + '<strong>' + m.name + "</strong></div>";
    heroSlidesEl.appendChild(slide);

    var dot = document.createElement("button");
    dot.className = "slide-dot" + (i === 0 ? " is-active" : "");
    dot.type = "button";
    dot.setAttribute("role", "tab");
    dot.setAttribute("aria-label", "Show " + m.name);
    dot.setAttribute("data-index", i);
    dotsEl.appendChild(dot);
  });

  var slides = Array.prototype.slice.call(heroSlidesEl.querySelectorAll(".hero-slide"));
  var dots = Array.prototype.slice.call(dotsEl.querySelectorAll(".slide-dot"));
  var current = 0;
  var AUTOPLAY_MS = 5200;
  var timer = null;

  function goTo(index) {
    index = (index + slides.length) % slides.length;
    slides[current].classList.remove("is-active");
    dots[current].classList.remove("is-active");
    current = index;
    slides[current].classList.add("is-active");
    dots[current].classList.add("is-active");
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  function startAutoplay() {
    if (reduceMotion) return;
    stopAutoplay();
    timer = setInterval(next, AUTOPLAY_MS);
  }
  function stopAutoplay() {
    if (timer) clearInterval(timer);
    timer = null;
  }

  document.getElementById("slideNext").addEventListener("click", function () { next(); startAutoplay(); });
  document.getElementById("slidePrev").addEventListener("click", function () { prev(); startAutoplay(); });
  dotsEl.addEventListener("click", function (e) {
    var dot = e.target.closest(".slide-dot");
    if (!dot) return;
    goTo(parseInt(dot.getAttribute("data-index"), 10));
    startAutoplay();
  });

  var heroStage = document.getElementById("heroStage");
  heroStage.addEventListener("mouseenter", stopAutoplay);
  heroStage.addEventListener("mouseleave", startAutoplay);
  heroStage.addEventListener("focusin", stopAutoplay);
  heroStage.addEventListener("focusout", startAutoplay);

  // Touch swipe
  (function () {
    var startX = null;
    heroSlidesEl.addEventListener("touchstart", function (e) {
      startX = e.touches[0].clientX;
      stopAutoplay();
    }, { passive: true });
    heroSlidesEl.addEventListener("touchend", function (e) {
      if (startX === null) return;
      var dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 40) { dx < 0 ? next() : prev(); }
      startX = null;
      startAutoplay();
    }, { passive: true });
  })();

  startAutoplay();

  /* ------------------------------------------------------------------ */
  /* Theme toggle (persisted)                                            */
  /* ------------------------------------------------------------------ */
  var root = document.documentElement;
  var themeToggle = document.getElementById("themeToggle");
  var STORAGE_KEY = "franova-theme";

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    themeToggle.setAttribute("aria-pressed", theme === "light" ? "true" : "false");
    try { localStorage.setItem(STORAGE_KEY, theme); } catch (e) {}
  }

  (function initTheme() {
    var stored = null;
    try { stored = localStorage.getItem(STORAGE_KEY); } catch (e) {}
    if (stored === "light" || stored === "dark") {
      applyTheme(stored);
    } else {
      var prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
      applyTheme(prefersLight ? "light" : "dark");
    }
  })();

  themeToggle.addEventListener("click", function () {
    var next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
    applyTheme(next);
  });

  /* ------------------------------------------------------------------ */
  /* Starfield (ambient, dark mode only — CSS hides it in light mode)    */
  /* ------------------------------------------------------------------ */
  (function starfield() {
    var field = document.getElementById("starfield");
    var count = window.innerWidth < 640 ? 40 : 90;
    var frag = document.createDocumentFragment();
    for (var i = 0; i < count; i++) {
      var s = document.createElement("span");
      s.className = "star";
      s.style.left = Math.random() * 100 + "%";
      s.style.top = Math.random() * 100 + "%";
      s.style.setProperty("--tw-dur", (3 + Math.random() * 5).toFixed(2) + "s");
      s.style.setProperty("--tw-delay", (Math.random() * 6).toFixed(2) + "s");
      s.style.setProperty("--dr-dur", (30 + Math.random() * 40).toFixed(0) + "s");
      s.style.setProperty("--tw-max", (0.4 + Math.random() * 0.6).toFixed(2));
      frag.appendChild(s);
    }
    field.appendChild(frag);
  })();

  /* ------------------------------------------------------------------ */
  /* Sticky header condense on scroll                                    */
  /* ------------------------------------------------------------------ */
  var header = document.getElementById("siteHeader");
  var lastY = window.scrollY;
  function onScroll() {
    header.classList.toggle("is-condensed", window.scrollY > 40);
    lastY = window.scrollY;
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ------------------------------------------------------------------ */
  /* Mobile nav toggle                                                    */
  /* ------------------------------------------------------------------ */
  var navToggle = document.getElementById("navToggle");
  var primaryNav = document.getElementById("primaryNav");
  navToggle.addEventListener("click", function () {
    var isOpen = primaryNav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    navToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
  });
  primaryNav.addEventListener("click", function (e) {
    if (e.target.matches(".nav-link")) {
      primaryNav.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });

  /* ------------------------------------------------------------------ */
  /* Scroll reveal (IntersectionObserver)                                 */
  /* ------------------------------------------------------------------ */
  var revealEls = document.querySelectorAll(".reveal, .model-card");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18, rootMargin: "0px 0px -60px 0px" }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ------------------------------------------------------------------ */
  /* 3D tilt on model cards (desktop / fine pointer only)                 */
  /* ------------------------------------------------------------------ */
  if (!isCoarsePointer && !reduceMotion) {
    document.addEventListener("mousemove", function (e) {
      var card = e.target.closest ? e.target.closest(".model-card") : null;
      if (!card) return;
      var r = card.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width;
      var py = (e.clientY - r.top) / r.height;
      var rx = (0.5 - py) * 10;
      var ry = (px - 0.5) * 12;
      card.style.transform = "translateY(-4px) rotateX(" + rx.toFixed(2) + "deg) rotateY(" + ry.toFixed(2) + "deg)";
      card.style.setProperty("--mx", (px * 100).toFixed(1) + "%");
      card.style.setProperty("--my", (py * 100).toFixed(1) + "%");
    });
    document.addEventListener("mouseout", function (e) {
      var card = e.target.closest ? e.target.closest(".model-card") : null;
      if (!card) return;
      var toEl = e.relatedTarget;
      if (toEl && card.contains(toEl)) return;
      card.style.transform = "";
    });
  }

  /* ------------------------------------------------------------------ */
  /* Ambient cursor glow (desktop only)                                   */
  /* ------------------------------------------------------------------ */
  if (!isCoarsePointer && !reduceMotion) {
    var glow = document.getElementById("cursorGlow");
    var glowActive = false;
    window.addEventListener("mousemove", function (e) {
      glow.style.transform = "translate(" + e.clientX + "px, " + e.clientY + "px) translate(-50%,-50%)";
      if (!glowActive) { glow.classList.add("is-active"); glowActive = true; }
    });
    document.addEventListener("mouseleave", function () {
      glow.classList.remove("is-active");
      glowActive = false;
    });
  }

  /* ------------------------------------------------------------------ */
  /* Inquiry form (front-end only — no backend wired up)                  */
  /* ------------------------------------------------------------------ */
  var form = document.getElementById("inquireForm");
  var status = document.getElementById("formStatus");
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!form.checkValidity()) {
      status.textContent = "Please fill in your name and a valid email address.";
      status.classList.add("is-visible");
      return;
    }
    var name = document.getElementById("fullName").value.trim();
    status.textContent = "Thank you, " + name.split(" ")[0] + " — a FRANOVA advisor will be in touch shortly.";
    status.classList.add("is-visible");
    form.reset();
  });

  /* ------------------------------------------------------------------ */
  /* Footer year                                                          */
  /* ------------------------------------------------------------------ */
  document.getElementById("year").textContent = new Date().getFullYear();
})();
