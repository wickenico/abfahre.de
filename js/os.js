(function () {
  const APPS = [
    { id: "jochen", label: "Jochen", icon: "🕺", href: "/jochen.html" },
    { id: "wolle", label: "Woll-O-Meter", icon: "🎤", href: "/wolle.html" },
    { id: "flappy", label: "FlappyEagle", icon: "🦅", href: "/flappyeagle/index.html" },
    { id: "shop", label: "353 Shop", icon: "🛍️", href: "https://shop353.myspreadshop.de/accessoires?q=D5", external: true },
  ];

  const desktop = document.querySelector(".desktop");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isMobile = () => window.matchMedia("(max-width: 720px)").matches;
  let topZ = 10;

  function el(html) {
    const t = document.createElement("template");
    t.innerHTML = html.trim();
    return t.content.firstElementChild;
  }

  function linkAttrs(app) {
    return app.external ? `href="${app.href}" target="_blank" rel="noopener"` : `href="${app.href}"`;
  }

  /* Icons */

  const icons = el(`
    <nav class="icons" aria-label="Programme">
      ${APPS.map((a) => `<a class="icon" ${linkAttrs(a)}><span class="icon__img" aria-hidden="true">${a.icon}</span>${a.label}</a>`).join("")}
      <button class="icon" type="button" data-open-terminal><span class="icon__img icon__img--mono" aria-hidden="true">&gt;_</span>Terminal</button>
    </nav>`);
  desktop.prepend(icons);

  /* Sticker */

  desktop.append(
    el(`<div class="sticker sticker--353" aria-hidden="true">353</div>`),
    el(`<div class="sticker sticker--hoelle" aria-hidden="true">Hölle<br>Hölle<br>Hölle</div>`),
    el(`<div class="sticker sticker--rakete" aria-hidden="true">
      <svg viewBox="0 0 80 210" width="80" height="210">
        <path class="rakete__flamme" d="M26 168 Q40 214 54 168 Q47 184 40 200 Q33 184 26 168Z" />
        <path class="rakete__flosse" d="M18 118 L2 156 L2 174 L20 162Z M62 118 L78 156 L78 174 L60 162Z" />
        <path class="rakete__rumpf" d="M40 4 C70 30 68 110 62 166 L18 166 C12 110 10 30 40 4Z" />
        <path class="rakete__spitze" d="M40 4 C52 15 59 28 62 40 L18 40 C21 28 28 15 40 4Z" />
        <text x="40" y="104" transform="rotate(-90 40 104)">abfahre.de</text>
      </svg>
    </div>`)
  );

  /* Taskleiste */

  const currentPage = document.body.dataset.page;

  document.body.append(
    el(`
      <div class="taskbar">
        <nav class="taskbar__apps" aria-label="Taskleiste">
          <button class="tb tb--start" type="button" aria-label="Start" title="Start" aria-expanded="false" aria-controls="startmenu">
            <span class="tb__logo" aria-hidden="true"><i></i><i></i><i></i><i></i></span>
          </button>
          ${APPS.map(
            (a) =>
              `<a class="tb" ${linkAttrs(a)} aria-label="${a.label}" title="${a.label}"${a.id === currentPage ? ' aria-current="page"' : ""}><span aria-hidden="true">${a.icon}</span></a>`
          ).join("")}
          <button class="tb" type="button" data-open-terminal data-tb-terminal aria-label="Terminal" title="Terminal"><span class="tb__mono" aria-hidden="true">&gt;_</span></button>
        </nav>
        <div class="taskbar__clock" aria-hidden="true"><span></span><span></span></div>
      </div>`),
    el(`
      <div class="startmenu" id="startmenu" hidden>
        <p class="startmenu__title">Angeheftet</p>
        <div class="startmenu__grid">
          <a class="sm-app" href="/"><span class="sm-app__icon" aria-hidden="true">🏠</span>Desktop</a>
          ${APPS.map((a) => `<a class="sm-app" ${linkAttrs(a)}><span class="sm-app__icon" aria-hidden="true">${a.icon}</span>${a.label}</a>`).join("")}
          <button class="sm-app" type="button" data-open-terminal><span class="sm-app__icon sm-app__icon--mono" aria-hidden="true">&gt;_</span>Terminal</button>
          <a class="sm-app" href="https://github.com/wickenico" target="_blank" rel="noopener"><span class="sm-app__icon" aria-hidden="true">🐙</span>GitHub</a>
        </div>
        <div class="startmenu__foot">
          <span class="startmenu__user"><span class="startmenu__avatar" aria-hidden="true">A</span>abfahre.de</span>
          <button class="startmenu__power" type="button" data-alltag aria-label="Alltag beenden" title="Alltag beenden">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M12 3v8"/><path d="M6.3 6.8a8 8 0 1 0 11.4 0"/></svg>
          </button>
        </div>
      </div>`)
  );

  const [clockTime, clockDate] = document.querySelectorAll(".taskbar__clock span");
  clockTime.textContent = "04:20";
  const tick = () => {
    clockDate.textContent = new Date().toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" });
  };
  tick();
  setInterval(tick, 60000);

  const startBtn = document.querySelector(".tb--start");
  const startMenu = document.getElementById("startmenu");
  const setMenu = (open) => {
    startMenu.hidden = !open;
    startBtn.setAttribute("aria-expanded", String(open));
  };
  startBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    setMenu(startMenu.hidden);
  });
  document.addEventListener("click", (e) => {
    if (!startMenu.hidden && !startMenu.contains(e.target)) setMenu(false);
  });

  /* Fenster */

  function focusWin(win) {
    win.style.zIndex = ++topZ;
  }

  function makeDraggable(target, handle) {
    handle.addEventListener("pointerdown", (e) => {
      if (isMobile() || e.target.closest("button")) return;
      const rect = target.getBoundingClientRect();
      const parent = target.offsetParent.getBoundingClientRect();
      const dx = e.clientX - rect.left;
      const dy = e.clientY - rect.top;
      focusWin(target);
      handle.setPointerCapture(e.pointerId);

      const move = (ev) => {
        const x = Math.min(Math.max(ev.clientX - dx - parent.left, -rect.width + 80), parent.width - 80);
        const y = Math.min(Math.max(ev.clientY - dy - parent.top, 0), parent.height - 40);
        target.style.left = x + "px";
        target.style.top = y + "px";
        target.style.right = "auto";
        target.style.bottom = "auto";
      };
      const up = () => {
        handle.removeEventListener("pointermove", move);
        handle.removeEventListener("pointerup", up);
      };
      handle.addEventListener("pointermove", move);
      handle.addEventListener("pointerup", up);
    });
  }

  function wireWindow(win) {
    const bar = win.querySelector(".win__bar");
    if (bar) makeDraggable(win, bar);
    win.addEventListener("pointerdown", () => focusWin(win));
    const close = win.querySelector(".win__close");
    if (close) {
      close.addEventListener("click", () => {
        if (win.classList.contains("win--app")) location.href = "/";
        else win.hidden = true;
      });
    }
  }

  document.querySelectorAll(".desktop > .win").forEach(wireWindow);
  document.querySelectorAll(".sticker").forEach((s) => makeDraggable(s, s));

  /* Konfetti */

  function confetti() {
    if (reducedMotion) return;
    const canvas = el(`<canvas class="confetti" aria-hidden="true"></canvas>`);
    document.body.append(canvas);
    const ctx = canvas.getContext("2d");
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    const colors = ["#ff1a1a", "#ffffff", "#111111", "#ffd60a"];
    const parts = Array.from({ length: 160 }, () => ({
      x: innerWidth / 2,
      y: innerHeight / 2,
      vx: (Math.random() - 0.5) * 16,
      vy: Math.random() * -16 - 4,
      s: 4 + Math.random() * 6,
      r: Math.random() * Math.PI,
      c: colors[Math.floor(Math.random() * colors.length)],
    }));
    const start = performance.now();
    (function frame(now) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      parts.forEach((p) => {
        p.vy += 0.45;
        p.x += p.vx;
        p.y += p.vy;
        p.r += 0.2;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.r);
        ctx.fillStyle = p.c;
        ctx.fillRect(-p.s / 2, -p.s / 2, p.s, p.s * 0.6);
        ctx.restore();
      });
      if (now - start < 2600) requestAnimationFrame(frame);
      else canvas.remove();
    })(start);
  }

  /* Alltag.exe */

  function showAlltag() {
    if (document.querySelector(".dialog")) return;
    const dialog = el(`
      <div class="win dialog" role="alertdialog" aria-labelledby="alltag-title" aria-describedby="alltag-text">
        <div class="win__bar"><span class="win__title" id="alltag-title">Alltag.exe</span></div>
        <div class="win__body">
          <p class="dialog__text" id="alltag-text"><span class="dialog__icon" aria-hidden="true">!</span><span>Alltag.exe reagiert nicht.</span></p>
          <div class="row">
            <button class="btn" type="button" data-choice="quit">Beenden</button>
            <button class="btn btn--primary" type="button" data-choice="go">Abfahren</button>
          </div>
        </div>
      </div>`);
    document.body.append(dialog);
    focusWin(dialog);
    dialog.style.zIndex = 50;
    dialog.querySelector('[data-choice="go"]').focus();

    const done = () => {
      localStorage.setItem("abfahre-alltag", "beendet");
      dialog.remove();
    };
    dialog.querySelector('[data-choice="go"]').addEventListener("click", () => {
      done();
      confetti();
    });
    dialog.querySelector('[data-choice="quit"]').addEventListener("click", () => {
      dialog.querySelector("#alltag-text span:last-child").textContent = "Alltag wurde beendet. Viel Spaß.";
      dialog.querySelectorAll("button").forEach((b) => (b.disabled = true));
      setTimeout(done, 1400);
    });
  }

  document.querySelectorAll("[data-alltag]").forEach((b) =>
    b.addEventListener("click", () => {
      setMenu(false);
      showAlltag();
    })
  );

  function afterUnlock() {
    if (document.body.dataset.page === "start" && !localStorage.getItem("abfahre-alltag")) {
      setTimeout(showAlltag, 600);
    }
  }

  /* Lockscreen */

  function showLock() {
    const lock = el(`
      <div class="lock" role="dialog" aria-modal="true" aria-label="Gesperrt">
        <div class="lock__glass lock__head">
          <div class="lock__status"><span>abfahre.de</span><span>353 %</span></div>
          <div class="lock__top">
            <p class="lock__time"></p>
            <p class="lock__date"></p>
          </div>
        </div>
        <div class="lock__wall" aria-hidden="true"><span>353</span></div>
        <div class="lock__glass lock__bottom">
          <div class="slider">
            <span class="slider__text" aria-hidden="true">slide to abfahre</span>
            <button class="slider__knob" type="button" aria-label="Entsperren">➜</button>
          </div>
        </div>
      </div>`);
    document.body.append(lock);

    const time = lock.querySelector(".lock__time");
    const date = lock.querySelector(".lock__date");
    time.textContent = "04:20";
    const update = () => {
      date.textContent = new Date().toLocaleDateString("de-DE", { weekday: "long", day: "numeric", month: "long" });
    };
    update();
    const timer = setInterval(update, 60000);

    const slider = lock.querySelector(".slider");
    const knob = lock.querySelector(".slider__knob");
    const text = lock.querySelector(".slider__text");
    knob.focus({ preventScroll: true });

    const sound = new Audio("/sounds/unlock.mp3");
    sound.preload = "auto";

    const unlock = () => {
      sound.play().catch(() => {});
      sessionStorage.setItem("abfahre-unlocked", "1");
      clearInterval(timer);
      lock.classList.add("is-unlocking");
      setTimeout(() => {
        lock.remove();
        afterUnlock();
      }, reducedMotion ? 0 : 550);
    };

    const setX = (x) => {
      knob.style.transform = `translateX(${x}px)`;
      text.style.opacity = String(1 - x / 120);
    };

    knob.addEventListener("pointerdown", (e) => {
      const max = slider.clientWidth - knob.offsetWidth - 10;
      const startX = e.clientX;
      knob.classList.remove("is-snapping");
      knob.setPointerCapture(e.pointerId);

      const move = (ev) => setX(Math.min(Math.max(ev.clientX - startX, 0), max));
      const up = (ev) => {
        knob.removeEventListener("pointermove", move);
        knob.removeEventListener("pointerup", up);
        knob.removeEventListener("pointercancel", up);
        if (ev.type === "pointerup" && ev.clientX - startX >= max * 0.9) {
          setX(max);
          unlock();
        } else {
          knob.classList.add("is-snapping");
          setX(0);
        }
      };
      knob.addEventListener("pointermove", move);
      knob.addEventListener("pointerup", up);
      knob.addEventListener("pointercancel", up);
    });

    knob.addEventListener("click", (e) => {
      if (e.detail === 0) unlock();
    });
  }

  const isDev = ["localhost", "127.0.0.1"].includes(location.hostname);
  if (isDev || (isMobile() && !sessionStorage.getItem("abfahre-unlocked"))) showLock();
  else afterUnlock();

  /* Terminal */

  const terminal = el(`
    <section class="win terminal" aria-label="Terminal" hidden>
      <div class="win__bar"><span class="win__title">terminal — abfahre@party</span><button class="win__close" type="button" aria-label="Terminal schließen">×</button></div>
      <div class="win__body">
        <div class="term__out" aria-live="polite"></div>
        <form class="term__form" autocomplete="off">
          <label class="term__prompt" for="term-input">abfahre $</label>
          <input class="term__input" id="term-input" spellcheck="false" autocapitalize="off">
        </form>
        <div class="term__chips">
          ${["help", "fact", "meme", "jochen", "wolle", "flappy", "sudo abfahre"].map((c) => `<button class="term__chip" type="button">${c}</button>`).join("")}
        </div>
      </div>
    </section>`);
  desktop.append(terminal);
  wireWindow(terminal);

  const terminalTb = document.querySelector("[data-tb-terminal]");
  new MutationObserver(() => terminalTb.classList.toggle("is-running", !terminal.hidden)).observe(terminal, {
    attributes: true,
    attributeFilter: ["hidden"],
  });

  const out = terminal.querySelector(".term__out");
  const input = terminal.querySelector(".term__input");

  function print(text, cls) {
    const p = document.createElement("p");
    if (cls) p.className = cls;
    p.textContent = text;
    out.append(p);
    terminal.querySelector(".win__body").scrollTop = 1e6;
    return p;
  }

  function playSound(src, text) {
    new Audio(src).play().catch(() => print("Ton konnte nicht abgespielt werden.", "err"));
    print(`🔊 ${text}`, "ok");
  }

  function go(href) {
    print(`öffne ${href} …`, "ok");
    setTimeout(() => (location.href = href), 400);
  }

  const COMMANDS = {
    help: () =>
      print(
        "Befehle:\n  fact          unnützes Wissen\n  meme          frisches Meme\n  jochen        Jochen.exe starten\n  wolle         Woll-O-Meter starten\n  flappy        FlappyEagle starten\n  shop          353 Merch\n  clear         aufräumen\n  exit          Terminal schließen\n  sudo abfahre  ?"
      ),
    fact: async () => {
      const line = print("lade …");
      try {
        const data = await (await fetch("https://uselessfacts.jsph.pl/random.json?language=en")).json();
        line.textContent = data.text;
      } catch {
        line.textContent = "fact: Verbindung zum Unsinn fehlgeschlagen";
        line.className = "err";
      }
    },
    meme: async () => {
      const line = print("lade …");
      try {
        const data = await (await fetch("https://meme-api.com/gimme")).json();
        line.textContent = "";
        const a = document.createElement("a");
        a.href = data.postLink || data.url;
        a.target = "_blank";
        a.rel = "noopener";
        a.textContent = `${data.title} (r/${data.subreddit}) ↗`;
        line.append(a);
      } catch {
        line.textContent = "meme: kein Meme gefunden";
        line.className = "err";
      }
    },
    jochen: () => go("/jochen.html"),
    wolle: () => go("/wolle.html"),
    flappy: () => go("/flappyeagle/index.html"),
    shop: () => {
      window.open(APPS[3].href, "_blank", "noopener");
      print("353 Merch geöffnet ↗", "ok");
    },
    clear: () => (out.innerHTML = ""),
    exit: () => (terminal.hidden = true),
    abfahre: () => print("abfahre: Zugriff verweigert. Versuch's mit sudo.", "err"),
    "sudo abfahre": () => {
      print("[sudo] Passwort für abfahre: ********");
      setTimeout(() => {
        print("Alltag gelöscht. Freiheit installiert. Party läuft.", "ok");
        confetti();
      }, 500);
    },
    "sudo yes": () => playSound("/sounds/sudo-yes.mp3", "YES!"),
    "sudo gönne": () => playSound("/sounds/sudo-goenne.mp3", "Gönne!"),
    "rm -rf alltag": () => {
      print("alltag entfernt.", "ok");
      confetti();
    },
    ls: () => print("jochen.exe  woll-o-meter.app  flappyeagle.exe  353_shop.lnk  alltag.exe (beschädigt)"),
    whoami: () => print("jemand, der dringend abfahren muss"),
  };

  function run(raw) {
    const cmd = raw.trim().toLowerCase().replace(/\s+/g, " ");
    if (!cmd) return;
    print(`abfahre $ ${raw.trim()}`, "cmd");
    const fn = COMMANDS[cmd];
    if (fn) fn();
    else print(`abfahre: Befehl nicht gefunden: ${cmd}. Tippe help.`, "err");
  }

  terminal.querySelector(".term__form").addEventListener("submit", (e) => {
    e.preventDefault();
    run(input.value);
    input.value = "";
  });

  terminal.querySelectorAll(".term__chip").forEach((chip) =>
    chip.addEventListener("click", () => {
      run(chip.textContent);
      input.focus({ preventScroll: true });
    })
  );

  function openTerminal() {
    setMenu(false);
    if (terminal.hidden) {
      terminal.hidden = false;
      if (!isMobile()) {
        const w = Math.min(560, desktop.clientWidth - 32);
        terminal.style.left = Math.max(16, (desktop.clientWidth - w) / 2) + "px";
        terminal.style.top = "64px";
      }
      if (!out.childElementCount) print("Abfahre OS 3.5.3 – tippe help oder klick unten auf einen Befehl.");
    }
    focusWin(terminal);
    input.focus({ preventScroll: true });
  }

  document.querySelectorAll("[data-open-terminal]").forEach((b) => b.addEventListener("click", openTerminal));

  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    setMenu(false);
    if (!terminal.hidden) terminal.hidden = true;
  });

  window.AbfahreOS = { confetti };
})();
