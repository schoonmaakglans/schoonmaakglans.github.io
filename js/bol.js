/* GLANS · instellingen voor de bol-links
   1. Meld je gratis aan bij het bol partnerprogramma: https://partner.bol.com
   2. Vul hieronder je site-ID in bij `partnerId`. Dan worden alle knoppen affiliate-links.
      Controleer het linkformaat in je partnerdashboard (Links maken → Productlink).
   3. Zolang `partnerId` leeg is, gaan de knoppen gewoon naar bol (zonder commissie).
   Gegevens nagekeken op bol op 18 nov 2026. Prijzen en reviews veranderen: check ze af en toe. */
export const BOL = {
  partnerId: "1561362",
  name: "glans",
  links: {
    // Kärcher SC 3 EasyFix · 4,4 ★ uit 225 reviews · € 144,99 · verkoop door bol · 22 nov 2026
    karcher: "https://www.bol.com/nl/nl/p/karcher-sc-3-easyfix-stoomreiniger-inclusief-vloerreinigingsset-easyfix-opwarmtijd-30-sec-ontkalkingspatroon-1-900-w-gebruiksoppervlakte-75-m-reservoir-1-l-microvezeldoeken/9200000087364212/",
    // GoScrub Cleaning King V2 · 4,4 ★ uit 436 reviews · € 59,95 · verkoper Vesto (8,6)
    goscrub: "https://www.bol.com/nl/nl/p/goscrub-cleaning-king/9300000161267460/",
    // Motionflow Elektrische Raamwisser 2.0 · 4,3 ★ uit 374 reviews · € 37,99 · verkoper Qumax Brands (8,6)
    raamwisser: "https://www.bol.com/nl/nl/p/motionflow-elektrische-raamwisser-2-0/9300000145719579/",
    // Motionflow Tapijtreiniger PRO · 4,6 ★ uit 772 reviews · € 139,99 (adviesprijs € 159,99) · verkoper Qumax Brands (8,6)
    motionflow: "https://www.bol.com/nl/nl/p/motionflow-tapijtreiniger-pro-verwarmingsfunctie-en-zelfreinigend-vlekkenreiniger-inclusief-schoonmaakmiddel-reinigingsmachine-voor-bank-vloer-auto-en-tapijt-zetelreiniger-zwart/9300000237469688/",
    // Dreame L10s Ultra Gen 3 Set · 4,6 ★ uit 236 reviews · € 329 (adviesprijs € 499) · verkoop door bol · 22 nov 2026
    robot: "https://www.bol.com/nl/nl/p/dreame-l10s-ultra-gen-3-set-robotstofzuiger-met-dweil-25-000-pa-zuigkracht-automatische-leeg-zelfreinigende-dweilfunctie-custom-clean-technologie-slimme-zijborstels/9300000241760156/",
    // Dyson V10 Fluffy Cyclone · 4,4 ★ uit 347 reviews · € 279 (adviesprijs € 449) · verkoop door bol · 22 nov 2026
    dyson: "https://www.bol.com/nl/nl/p/dyson-cyclone-v10-fluffy-steelstofzuiger-draadloze-stofzuiger-nikkel-koper/9300000306271331/",
  },
};

const wrap = (url) =>
  BOL.partnerId
    ? `https://partner.bol.com/click/click?p=2&t=url&s=${encodeURIComponent(BOL.partnerId)}&f=TXL&url=${encodeURIComponent(url)}&name=${encodeURIComponent(BOL.name)}`
    : url;

document.querySelectorAll("[data-bol]").forEach((a) => {
  const url = BOL.links[a.dataset.bol];
  if (!url) return;
  a.href = wrap(url);
  a.target = "_blank";
  a.rel = "sponsored nofollow noopener";
});

const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && e.target.classList.add("in")), { threshold: 0.15 });
document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
