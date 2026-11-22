/* GLANS · losse figuurtjes
   - Op elke vieze scène zitten losse beestjes (PNG/WebP met doorzichtige achtergrond) die wiebelen.
   - Komt de veeg, dan worden ze één voor één meegeveegd (op het moment dat de veeg hen raakt).
   - Daarna springt er een schoon sterretje tevoorschijn, in de kleur van het product.
   - Een sterretje loopt mee langs de stippellijn en wisselt van kleur per product. */
const ROOMS = {
  badkamer: { sprite: "bacterie", star: "ster-turquoise", at: [[57, 24, 13, -8], [67, 50, 15, 6], [80, 32, 11, 12], [73, 76, 13, -4]] },
  raam:     { sprite: "stofmonster", star: "ster-geel", at: [[37, 24, 10, -6], [51, 42, 11, 8], [43, 64, 9, -10], [62, 28, 10, 4], [58, 64, 8, 0]] },
  bank:     { sprite: "vlekmonster", star: "ster-rood", at: [[54, 50, 17, 0]] },
  vloer:    { sprite: "stofmonster", star: "ster-groen", at: [] },
};
const WIPE = 2.6; // seconden, gelijk aan de veeg in de css
const src = (n) => `media/mascot/${n}.webp`;

/* Scène met video: speel af zodra de stap in beeld komt (de pagina zet dan "done"), daarna "✓ Schoon" + sterretje bij het product. */
function videoScene(scene) {
  const v = scene.querySelector(".vid");
  scene.classList.add("has-video");
  const host = scene.closest(".step");
  /* Pas starten als de video bijna helemaal in beeld is, en dan nog 2 seconden wachten:
     zo lees je eerst rustig de titel en mis je het begin niet. */
  let timer = 0, played = false;
  const reset = () => { clearTimeout(timer); v.pause(); v.currentTime = 0; scene.classList.remove("playing", "ended"); host && host.classList.remove("cleaned"); played = false; };
  const play = () => {
    v.currentTime = 0; v.playbackRate = 1.15; scene.classList.remove("ended"); scene.classList.add("playing");
    v.play().catch(() => { scene.classList.add("ended"); host && host.classList.add("cleaned"); });
    played = true;
  };
  v.addEventListener("ended", () => { scene.classList.remove("playing"); scene.classList.add("ended"); host && host.classList.add("cleaned"); });
  new IntersectionObserver((es) => es.forEach((e) => {
    if (e.intersectionRatio >= 0.6) { if (!played) { clearTimeout(timer); timer = setTimeout(play, 500); } }
    else if (e.intersectionRatio < 0.2) reset();
    else clearTimeout(timer);
  }), { threshold: [0, 0.2, 0.6, 1] }).observe(scene);
  // opnieuw afspelen
  const again = document.createElement("button");
  again.type = "button"; again.className = "again"; again.textContent = "↻ Nog een keer";
  again.addEventListener("click", play);
  scene.append(again);
  const prod = host?.querySelector(".product, .pickcard");
  const room = Object.keys(ROOMS).find((r) => v.dataset.src.includes(r));
  if (prod && room && !prod.querySelector(".prod-star")) {
    const ps = document.createElement("div");
    ps.className = "prod-star";
    ps.innerHTML = `<img src="${src(ROOMS[room].star)}" alt="">`;
    prod.append(ps);
  }
}

function dress(scene) {
  if (scene.querySelector(".vid")) return videoScene(scene);
  const img = scene.querySelector("img");
  const room = Object.keys(ROOMS).find((r) => img && img.getAttribute("src").includes(r));
  if (!room || scene.querySelector(".crit-layer")) return;
  const cfg = ROOMS[room];
  const layer = document.createElement("div");
  layer.className = "crit-layer";
  cfg.at.forEach(([x, y, w, r], i) => {
    const c = document.createElement("div");
    c.className = "crit";
    c.style.cssText = `left:${x}%;top:${y}%;width:${w}%;--r:${r}deg;--bd:${(i * 0.37) % 1.2}s;--sd:${((x / 100) * WIPE * 0.85).toFixed(2)}s`;
    c.innerHTML = `<img src="${src(cfg.sprite)}" alt="">`;
    layer.append(c);
  });
  // (geen sterretje meer ín de foto's: de beestjes verdwijnen, de kamer is gewoon schoon)
  scene.append(layer);
  // veeg start → beestjes weg; veeg klaar → sterretje erbij
  const host = scene.closest(".step"); // alleen de stap krijgt "cleaned", nooit de scène zelf (anders reageert hij op zichzelf)
  let state = null;
  const watch = () => {
    const wiping = scene.classList.contains("done") || scene.classList.contains("wipe");
    if (wiping === state) return;
    state = wiping;
    layer.classList.toggle("swept", wiping);
    clearTimeout(scene._st);
    if (wiping) scene._st = setTimeout(() => { layer.classList.add("cleaned"); host && host.classList.add("cleaned"); }, WIPE * 1000);
    else { layer.classList.remove("cleaned"); host && host.classList.remove("cleaned"); }
  };
  new MutationObserver(watch).observe(scene, { attributes: true, attributeFilter: ["class"] });
  watch();
  // sterretje bij het product
  const prod = scene.closest(".step")?.querySelector(".product");
  if (prod && !prod.querySelector(".prod-star")) {
    const ps = document.createElement("div");
    ps.className = "prod-star";
    ps.innerHTML = `<img src="${src(cfg.star)}" alt="">`;
    prod.append(ps);
  }
}
document.querySelectorAll(".scene, .show .slide").forEach(dress);

/* meeloper langs de stippellijn */
const steps = document.querySelector(".steps");
if (steps) {
  const walker = document.createElement("div");
  walker.className = "walker";
  walker.innerHTML = `<img src="${src("ster-turquoise")}" alt="">`;
  steps.append(walker);
  const list = [...steps.querySelectorAll(".step")];
  const stars = ["ster-turquoise", "ster-geel", "ster-rood", "ster-groen"];
  let last = 0;
  const move = () => {
    const r = steps.getBoundingClientRect();
    const y = Math.max(0, Math.min(r.height - 70, innerHeight * 0.5 - r.top));
    walker.style.top = y + "px";
    let idx = 0;
    list.forEach((s, i) => { if (s.getBoundingClientRect().top < innerHeight * 0.5) idx = i; });
    if (idx !== last) {
      last = idx;
      const im = walker.querySelector("img");
      im.src = src(stars[idx] || stars[0]);
      im.classList.remove("swap"); void im.offsetWidth; im.classList.add("swap");
    }
  };
  addEventListener("scroll", move, { passive: true });
  addEventListener("resize", move);
  move();
}
