/* ============================================================
   ESMOKE — site interactions
   ============================================================ */
(function () {
  "use strict";

  /* ---------- age gate (persisted) ---------- */
  var gate = document.getElementById("agegate");
  try {
    if (localStorage.getItem("esmoke_age_ok") === "1") {
      gate.classList.add("hidden");
    } else {
      document.body.classList.add("locked");
    }
  } catch (e) {}

  window.ageConfirm = function () {
    gate.classList.add("hidden");
    document.body.classList.remove("locked");
    try { localStorage.setItem("esmoke_age_ok", "1"); } catch (e) {}
  };
  window.ageDeny = function () {
    var d = document.getElementById("deny");
    if (d) d.style.display = "block";
  };

  /* ---------- sticky header ---------- */
  var header = document.getElementById("header");
  var onScroll = function () { header.classList.toggle("scrolled", window.scrollY > 30); };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- mobile drawer ---------- */
  var drawer = document.getElementById("drawer");
  window.openDrawer = function () { drawer.classList.add("open"); document.body.classList.add("locked"); };
  window.closeDrawer = function () { drawer.classList.remove("open"); if (gate.classList.contains("hidden")) document.body.classList.remove("locked"); };
  if (drawer) {
    drawer.querySelector(".drawer__scrim").addEventListener("click", window.closeDrawer);
    drawer.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", window.closeDrawer); });
  }

  /* ---------- product filters ---------- */
  var chips = document.querySelectorAll(".chip");
  var cards = document.querySelectorAll(".card[data-cat]");
  chips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      chips.forEach(function (c) { c.classList.remove("active"); });
      chip.classList.add("active");
      var f = chip.getAttribute("data-filter");
      cards.forEach(function (card) {
        var show = f === "all" || card.getAttribute("data-cat") === f;
        card.classList.toggle("hide", !show);
      });
    });
  });

  /* ---------- rewards dashboard ---------- */
  var dashTabs = document.querySelectorAll(".dash__tabs button");
  dashTabs.forEach(function (btn) {
    btn.addEventListener("click", function () {
      dashTabs.forEach(function (b) { b.classList.remove("active"); });
      btn.classList.add("active");
      var t = btn.getAttribute("data-tab");
      document.querySelectorAll(".dash__panel").forEach(function (p) {
        p.classList.toggle("active", p.getAttribute("data-tab") === t);
      });
    });
  });

  // redeem demo
  var balanceEl = document.getElementById("dashBalance");
  var barEl = document.getElementById("dashBar");
  var nextEl = document.getElementById("dashNext");
  var balance = 240;
  function renderBalance() {
    if (balanceEl) balanceEl.textContent = balance;
    var pct = Math.min(100, Math.round((balance % 100) / 100 * 100));
    if (balance >= 300) pct = 100;
    if (barEl) barEl.style.width = (balance >= 300 ? 100 : (balance / 300 * 100)) + "%";
    var toNext = balance >= 300 ? 0 : (balance < 100 ? 100 - balance : balance < 200 ? 200 - balance : 300 - balance);
    if (nextEl) nextEl.textContent = toNext === 0 ? "Top tier unlocked" : toNext + " pts to next reward";
    document.querySelectorAll(".redeem button[data-cost]").forEach(function (b) {
      b.disabled = balance < parseInt(b.getAttribute("data-cost"), 10);
    });
  }
  document.querySelectorAll(".redeem button[data-cost]").forEach(function (b) {
    b.addEventListener("click", function () {
      var cost = parseInt(b.getAttribute("data-cost"), 10);
      if (balance < cost) return;
      balance -= cost;
      b.textContent = "Redeemed ✓";
      b.disabled = true;
      renderBalance();
      setTimeout(function () { b.textContent = "Redeem"; renderBalance(); }, 2200);
    });
  });
  renderBalance();

  /* ---------- notify form ---------- */
  window.notifySubmit = function (e) {
    e.preventDefault();
    var form = e.target;
    var input = form.querySelector("input");
    if (input && input.value.indexOf("@") > 0) {
      form.classList.add("done");
      input.value = "";
      input.placeholder = "You're on the list!";
    }
    return false;
  };

  /* ---------- store locator ---------- */
  var STORES = {
    raleigh: {
      city: "Raleigh", addr: "8201 Rowlock Way, Ste 114<br>Raleigh, NC",
      phone: "(919) 803-5726", tel: "+19198035726",
      hours: [["Mon – Sat", "7am – 12am"], ["Sun", "9am – 11pm"]],
      maps: "https://www.google.com/maps/search/?api=1&query=ESMOKE%208201%20Rowlock%20Way%20Ste%20114%20Raleigh%20NC",
      ig: "https://www.instagram.com/esmoke_raleigh/", x: 60, y: 38
    },
    graham: {
      city: "Graham", addr: "212 S Main St<br>Graham, NC",
      phone: "(336) 270-4888", tel: "+13362704888",
      open247: true, drivethru: true,
      hours: [["Every day", "Open 24 hours"]],
      maps: "https://www.google.com/maps/search/?api=1&query=ESMOKE%20212%20S%20Main%20St%20Graham%20NC",
      ig: "https://www.instagram.com/esmoke_graham/", x: 48, y: 34
    },
    durham: {
      city: "Durham", addr: "3205 University Dr<br>Durham, NC",
      phone: "(984) 888-0189", tel: "+19848880189",
      hours: [["Mon – Thu", "8am – 11pm"], ["Fri – Sat", "8am – 12am"], ["Sun", "9am – 11pm"]],
      maps: "https://www.google.com/maps/search/?api=1&query=ESMOKE%203205%20University%20Dr%20Durham%20NC",
      ig: "https://www.instagram.com/esmokedurham/", x: 50, y: 40
    },
    hendersonville: {
      city: "Hendersonville", addr: "168 Highlands Square Dr<br>Hendersonville, NC",
      phone: "(828) 513-1000", tel: "+18285131000",
      hours: [["Mon – Thu", "7am – 11pm"], ["Fri – Sat", "7am – 12am"], ["Sun", "9am – 10pm"]],
      maps: "https://www.google.com/maps/search/?api=1&query=ESMOKE%20168%20Highlands%20Square%20Dr%20Hendersonville%20NC",
      x: 18, y: 46
    },
    southport: {
      city: "Southport", addr: "1671 N Howe St<br>Southport, NC",
      phone: "(910) 477-9020", tel: "+19104779020",
      hours: [["Every day", "9am – 11pm"]],
      maps: "https://www.google.com/maps/search/?api=1&query=ESMOKE%201671%20N%20Howe%20St%20Southport%20NC",
      x: 70, y: 64
    },
    winston: {
      city: "Winston-Salem", addr: "4842 Country Club Rd<br>Winston-Salem, NC",
      phone: "(336) 293-6167", tel: "+13362936167",
      hours: [["Mon – Thu", "7am – 11pm"], ["Fri – Sat", "7am – 12am"], ["Sun", "9am – 11pm"]],
      maps: "https://www.google.com/maps/search/?api=1&query=ESMOKE%204842%20Country%20Club%20Rd%20Winston-Salem%20NC",
      ig: "https://www.instagram.com/esmoke_winston/", x: 40, y: 36
    }
  };

  var detailEl = document.getElementById("locDetail");
  function selectStore(key) {
    var s = STORES[key];
    if (!s || !detailEl) return;
    document.querySelectorAll(".loc-item").forEach(function (el) {
      el.classList.toggle("active", el.getAttribute("data-store") === key);
    });
    var hoursRows = s.hours.map(function (h) {
      return '<div class="row"><span class="d">' + h[0] + '</span><span class="t">' + h[1] + '</span></div>';
    }).join("");
    var badges = "";
    if (s.open247) badges += '<span class="badge247">Open 24 / 7</span>';
    if (s.drivethru) badges += '<span class="loc-item open" style="border:1px solid var(--neon-line);border-radius:999px;padding:.3em .8em;">Drive-thru</span>';
    var igLink = s.ig ? '<a class="btn btn--ghost" style="padding:.7em 1.2em;font-size:.8rem;" target="_blank" rel="noopener" href="' + s.ig + '">Instagram ↗</a>' : "";
    detailEl.innerHTML =
      '<div class="loc-map"><span class="pin" style="left:' + s.x + '%;top:' + s.y + '%"></span><span class="maptag">interactive map — drop store pin</span></div>' +
      '<div class="loc-info">' +
        '<h3>' + s.city + '</h3>' +
        '<address>' + s.addr + '</address>' +
        (badges ? '<div style="display:flex;gap:.5rem;flex-wrap:wrap;margin-bottom:1.1rem;">' + badges + '</div>' : '') +
        '<div class="hours">' + hoursRows + '</div>' +
        '<div class="loc-actions">' +
          '<a class="phone" href="tel:' + s.tel + '">' + s.phone + '</a>' +
          '<a class="btn" style="padding:.7em 1.2em;font-size:.8rem;" target="_blank" rel="noopener" href="' + s.maps + '">Directions →</a>' +
          igLink +
        '</div>' +
      '</div>';
  }
  document.querySelectorAll(".loc-item").forEach(function (el) {
    el.addEventListener("click", function () { selectStore(el.getAttribute("data-store")); });
  });
  selectStore("raleigh");

  /* ---------- product brand modals ---------- */
  var BRANDS = {
    "Juice / Salt Nic": {
      blurb: "Freebase e-liquid and nic salts — every flavor lane and every nic level, stocked deep.",
      groups: [
        { label: "E-Liquid (Freebase)", items: ["Naked 100","Jam Monster","Candy King","Coastal Clouds","Juice Head","Cloud Nurdz","Vapetasia","Twist","Sad Boy","Custard Monster","Lemonade Monster","Tobacco Monster","Juice Monster","BSX","The Milk","The Juice","MRKT PLCE"] },
        { label: "Salt Nic", items: ["Pod Juice","Lost Mary","Raz","Pachamama","Mr. Freeze","Fume","Air Factory","The Finest","Bad Salt","Vapetasia","Cloud Nurdz","Sad Boy","Fruit Monster","Jam Monster","Juice Monster","Lemonade Monster","Juice Head","The Milk"] }
      ]
    }
  };

  var bModal = document.getElementById("brandModal");
  var bTitle = document.getElementById("brandTitle");
  var bBlurb = document.getElementById("brandBlurb");
  var bBody = document.getElementById("brandBody");

  function openBrands(name) {
    var data = BRANDS[name];
    if (!data || !bModal) return;
    bTitle.textContent = name;
    bBlurb.textContent = data.blurb || "";
    bBody.innerHTML = data.groups.map(function (g) {
      var chips = g.items.map(function (it) { return "<span>" + it + "</span>"; }).join("");
      return '<div class="brand-group"><div class="bg-label">' + g.label + ' · ' + g.items.length + ' brands</div><div class="brand-chips">' + chips + '</div></div>';
    }).join("");
    bModal.classList.add("open");
    document.body.classList.add("locked");
  }
  window.closeBrands = function () {
    if (!bModal) return;
    bModal.classList.remove("open");
    if (gate.classList.contains("hidden")) document.body.classList.remove("locked");
  };
  if (bModal) {
    bModal.querySelector(".modal__scrim").addEventListener("click", window.closeBrands);
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") window.closeBrands(); });
  }
  document.querySelectorAll(".card").forEach(function (card) {
    var h3 = card.querySelector("h3");
    if (!h3) return;
    var name = h3.textContent.trim();
    if (BRANDS[name]) {
      card.classList.add("has-brands");
      if (!card.querySelector(".card-more")) {
        var cue = document.createElement("span");
        cue.className = "card-more";
        cue.textContent = "View brands →";
        card.appendChild(cue);
      }
      card.addEventListener("click", function () { openBrands(name); });
    }
  });

  /* ---------- reveal on scroll ---------- */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll(".reveal:not(.in)").forEach(function (el) { io.observe(el); });
})();
