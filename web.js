(() => {
  const header = document.querySelector(".top");
  const toggle = document.querySelector(".menu-btn");
  const menu = document.querySelector(".menu");
  const year = document.getElementById("year");

  if (year) year.textContent = String(new Date().getFullYear());

  const setOpen = (open) => {
    if (!toggle || !menu) return;
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    menu.classList.toggle("open", open);
  };

  if (toggle && menu) {
    toggle.addEventListener("click", () => {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });
    menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setOpen(false)));
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") setOpen(false);
    });
  }

  const onScroll = () => {
    if (header) header.classList.toggle("scrolled", window.scrollY > 8);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  initBackground();
  initChatbot();
})();

function initBackground() {
  const canvas = document.getElementById("bg-canvas");
  if (!canvas) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) return;

  const ctx = canvas.getContext("2d", { alpha: true });
  if (!ctx) return;

  const pointer = { x: null, y: null, active: false };
  let nodes = [];
  let width = 0;
  let height = 0;
  let dpr = 1;
  let raf = 0;

  const resize = () => {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const count = Math.max(36, Math.min(90, Math.floor((width * height) / 17000)));
    nodes = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.42,
      vy: (Math.random() - 0.5) * 0.42,
      r: 1.2 + Math.random() * 2.1,
      pulse: Math.random() * Math.PI * 2,
      warm: Math.random() > 0.82,
    }));
  };

  const draw = (t) => {
    ctx.clearRect(0, 0, width, height);

    // Soft atmospheric washes so the field reads as an active skill showcase.
    const washA = ctx.createRadialGradient(
      width * 0.8,
      height * 0.05,
      20,
      width * 0.8,
      height * 0.05,
      Math.max(width, height) * 0.6
    );
    washA.addColorStop(0, "rgba(45, 212, 191, 0.14)");
    washA.addColorStop(1, "rgba(7, 9, 12, 0)");
    ctx.fillStyle = washA;
    ctx.fillRect(0, 0, width, height);

    const washB = ctx.createRadialGradient(
      width * 0.12,
      height * 0.75,
      10,
      width * 0.12,
      height * 0.75,
      Math.max(width, height) * 0.45
    );
    washB.addColorStop(0, "rgba(231, 194, 125, 0.06)");
    washB.addColorStop(1, "rgba(7, 9, 12, 0)");
    ctx.fillStyle = washB;
    ctx.fillRect(0, 0, width, height);

    const linkDist = Math.min(170, Math.max(110, width * 0.125));

    for (let i = 0; i < nodes.length; i += 1) {
      const a = nodes[i];
      a.pulse += 0.014;
      a.x += a.vx;
      a.y += a.vy;

      if (pointer.active && pointer.x != null) {
        const dx = pointer.x - a.x;
        const dy = pointer.y - a.y;
        const dist = Math.hypot(dx, dy) || 1;
        if (dist < 220) {
          a.vx += (dx / dist) * 0.018;
          a.vy += (dy / dist) * 0.018;
        }
      }

      a.vx *= 0.99;
      a.vy *= 0.99;
      const speed = Math.hypot(a.vx, a.vy);
      if (speed > 1.05) {
        a.vx = (a.vx / speed) * 1.05;
        a.vy = (a.vy / speed) * 1.05;
      }

      if (a.x < -20) a.x = width + 20;
      if (a.x > width + 20) a.x = -20;
      if (a.y < -20) a.y = height + 20;
      if (a.y > height + 20) a.y = -20;

      for (let j = i + 1; j < nodes.length; j += 1) {
        const b = nodes[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.hypot(dx, dy);
        if (dist < linkDist) {
          const alpha = (1 - dist / linkDist) * 0.34;
          ctx.strokeStyle = a.warm || b.warm
            ? `rgba(231, 194, 125, ${alpha * 0.7})`
            : `rgba(94, 234, 212, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }

      const glow = 0.4 + Math.sin(a.pulse + t * 0.0012) * 0.2;
      ctx.beginPath();
      ctx.fillStyle = a.warm
        ? `rgba(231, 194, 125, ${0.28 + glow * 0.3})`
        : `rgba(94, 234, 212, ${0.42 + glow * 0.4})`;
      ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2);
      ctx.fill();
    }

    if (pointer.active && pointer.x != null) {
      const ring = ctx.createRadialGradient(pointer.x, pointer.y, 0, pointer.x, pointer.y, 110);
      ring.addColorStop(0, "rgba(94, 234, 212, 0.16)");
      ring.addColorStop(1, "rgba(94, 234, 212, 0)");
      ctx.fillStyle = ring;
      ctx.beginPath();
      ctx.arc(pointer.x, pointer.y, 110, 0, Math.PI * 2);
      ctx.fill();
    }

    raf = requestAnimationFrame(draw);
  };

  const setPointer = (x, y, active) => {
    pointer.x = x;
    pointer.y = y;
    pointer.active = active;
  };

  window.addEventListener(
    "pointermove",
    (e) => setPointer(e.clientX, e.clientY, true),
    { passive: true }
  );
  window.addEventListener("pointerleave", () => setPointer(null, null, false), { passive: true });
  window.addEventListener(
    "pointerdown",
    (e) => setPointer(e.clientX, e.clientY, true),
    { passive: true }
  );
  window.addEventListener("resize", resize, { passive: true });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      cancelAnimationFrame(raf);
      raf = 0;
    } else if (!raf) {
      raf = requestAnimationFrame(draw);
    }
  });

  resize();
  raf = requestAnimationFrame(draw);
}

function initChatbot() {
  const root = document.querySelector("[data-chatbot]");
  if (!root) return;

  const panel = root.querySelector("[data-chat-panel]");
  const messages = root.querySelector("[data-chat-messages]");
  const chips = root.querySelector("[data-chat-chips]");
  const openBtn = root.querySelector("[data-chat-toggle]");
  const closeBtn = root.querySelector("[data-chat-close]");
  if (!panel || !messages || !chips || !openBtn) return;

  const guides = [
    {
      id: "who",
      label: "Who is Pyae?",
      answer:
        "Pyae Sone Chan Thar Aung is a Junior Software Engineer and Computer Science student in Davao City. He builds full-stack products, computer vision, IoT, and multimodal AI — with a focus on systems investors and hiring managers can understand quickly.",
    },
    {
      id: "open",
      label: "Is he open to work?",
      answer:
        "Yes. He’s open to software engineering opportunities — especially roles where he can ship product, sensing systems, or applied AI with clear real-world impact.",
    },
    {
      id: "wicare",
      label: "What is WiCare?",
      answer:
        "WiCare is his flagship project: privacy-aware human presence sensing over Wi-Fi CSI, with a FastAPI backend and Next.js console. It shows the full stack from hardware signal → model → operational UI. Live demo is available on request.",
    },
    {
      id: "projects",
      label: "Top projects?",
      answer:
        "Highlights include WiCare, a Vision-Language Model effort, Scheduly (conflict-free scheduler), award-winning facial recognition + SmartPlant IoT, ERIO, ML SkinSyn, the UIC CCS Alumni Portal, and EcoGuard.",
    },
    {
      id: "skills",
      label: "Tech stack?",
      answer:
        "Languages: Java, Python, JavaScript/TypeScript, Dart, SQL, C++ (Arduino). Software: Next.js/React, Flutter, FastAPI, Node APIs, MySQL. AI & systems: VLMs, computer vision, applied ML, IoT, Raspberry Pi, realtime UIs.",
    },
    {
      id: "leadership",
      label: "Leadership?",
      answer:
        "He leads as President of the UIC Global Leaders Club, works with International Linkages & Affairs, moderates student mobility programs, and has ASEAN youth experience including SMEs development in Surabaya and ASEAN–EU cooperation advocacy.",
    },
    {
      id: "awards",
      label: "Awards?",
      answer:
        "CCS Research Forum 2025: Best Project Leader, Best Presenter, and Best in Innovation. SmartPlant and Face Recognition also earned innovation/presentation recognition. ASEAN Youth Volunteer Programme 2024: best group presentation.",
    },
    {
      id: "contact",
      label: "How to contact?",
      answer:
        'Email <a href="mailto:pyaesonechantharaung25@gmail.com">pyaesonechantharaung25@gmail.com</a>, connect on <a href="https://www.linkedin.com/in/pyae-sone-chan-thar-aung/" target="_blank" rel="noopener noreferrer">LinkedIn</a>, or see code on <a href="https://github.com/Pyae-Sone-Chan-Thar-Aung" target="_blank" rel="noopener noreferrer">GitHub</a>. Resume is available from the nav.',
    },
  ];

  const welcome =
    "Hi — I can answer quick guided questions about Pyae’s work, skills, leadership, and how to reach him. Pick a question below.";

  const addMessage = (text, role) => {
    const el = document.createElement("div");
    el.className = `chat-msg ${role}`;
    el.innerHTML = text;
    messages.appendChild(el);
    messages.scrollTop = messages.scrollHeight;
  };

  const renderChips = () => {
    chips.innerHTML = "";
    guides.forEach((guide) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "chatbot__chip";
      btn.textContent = guide.label;
      btn.addEventListener("click", () => ask(guide));
      chips.appendChild(btn);
    });
  };

  const ask = (guide) => {
    addMessage(guide.label, "user");
    window.setTimeout(() => addMessage(guide.answer, "bot"), 180);
  };

  const setPanel = (open) => {
    panel.hidden = !open;
    openBtn.setAttribute("aria-expanded", open ? "true" : "false");
    if (open && !messages.childElementCount) {
      addMessage(welcome, "bot");
      renderChips();
    }
    if (open) {
      messages.scrollTop = messages.scrollHeight;
    }
  };

  openBtn.addEventListener("click", () => {
    setPanel(panel.hidden);
  });
  closeBtn?.addEventListener("click", () => setPanel(false));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setPanel(false);
  });
}
