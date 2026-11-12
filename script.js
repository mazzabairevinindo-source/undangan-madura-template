(async () => {
  const $ = (id) => document.getElementById(id);
  const params = new URLSearchParams(location.search);
  const hashParams = new URLSearchParams(location.hash.replace(/^#/, ""));

  function decodeBase64Url(value) {
    const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized + "=".repeat((4 - normalized.length % 4) % 4);
    const binary = atob(padded);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return bytes;
  }

  async function readPayload() {
    const payload = hashParams.get("p");
    if (payload) {
      const bytes = decodeBase64Url(payload);
      if (hashParams.get("z") === "1" && typeof DecompressionStream === "function") {
        const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream("gzip"));
        return JSON.parse(await new Response(stream).text());
      }
      return JSON.parse(new TextDecoder().decode(bytes));
    }
    // Kompatibilitas dengan tautan versi V4-V6 yang memakai ?data=JSON.
    const raw = params.get("data");
    return raw ? JSON.parse(raw) : {};
  }

  async function getData() {
    let data = {};
    try {
      data = await readPayload();
    } catch (err) {
      console.error("Data undangan pada tautan tidak dapat dibaca.", err);
      document.body.insertAdjacentHTML("afterbegin", '<p style="padding:12px;background:#fff0e8;color:#7b1d24;text-align:center">Data undangan tidak terbaca. Minta tautan terbaru dari penyelenggara.</p>');
    }
    if (!data || typeof data !== "object" || Array.isArray(data)) data = {};
    const safe = {};
    const stringKeys = [
      "groom","bride","groomParents","brideParents","eventMode","dateLabel","dateISO",
      "akadDateISO","receptionDateISO","akadDate","akadTime","receptionDate","receptionTime",
      "guestArrival","venueName","venue","mapsUrl","whatsappNumber","heroImage","musicFile"
    ];
    stringKeys.forEach(k => {
      if (typeof data[k] === "string") {
        const max = k === "heroImage" ? 120000 : (k === "musicFile" ? 90000 : 4000);
        safe[k] = data[k].slice(0, max);
      }
    });
    if (data.texts && typeof data.texts === "object" && !Array.isArray(data.texts)) {
      safe.texts = {};
      Object.keys(DEFAULT_INVITATION.texts).forEach(k => {
        if (typeof data.texts[k] === "string") safe.texts[k] = data.texts[k].slice(0, 5000);
      });
    }
    ["arrivalSlots","guestCountOptions"].forEach(k => {
      if (Array.isArray(data[k])) safe[k] = data[k].filter(v => typeof v === "string").slice(0, 20).map(v => v.slice(0, 100));
    });
    if (Array.isArray(data.bankAccounts)) {
      safe.bankAccounts = data.bankAccounts
        .filter(x => x && typeof x === "object" && typeof x.provider === "string")
        .slice(0, 12)
        .map(x => ({
          provider: String(x.provider).slice(0, 40),
          accountNumber: String(x.accountNumber || "").slice(0, 80),
          accountHolder: String(x.accountHolder || "").slice(0, 120)
        }));
    }
    return {...DEFAULT_INVITATION, ...safe, texts: {...DEFAULT_INVITATION.texts, ...(safe.texts || {})}};
  }

  const data = await getData();
  const TEXT = data.texts || {};
  const guestName = hashParams.get("to") || params.get("to") || TEXT.guestFallback || "Tamu Undangan";
  const set = (id, value) => { const el = $(id); if (el) el.textContent = value ?? ""; };

  document.querySelectorAll("[data-copy]").forEach(el => {
    const key = el.dataset.copy;
    if (Object.prototype.hasOwnProperty.call(TEXT, key)) el.textContent = TEXT[key];
  });
  document.querySelectorAll("[data-placeholder]").forEach(el => {
    const key = el.dataset.placeholder;
    if (Object.prototype.hasOwnProperty.call(TEXT, key)) el.placeholder = TEXT[key];
  });

  set("guestName", guestName);
  set("posterGuest", guestName);
  set("coverNames", `${data.groom}\n&\n${data.bride}`);
  set("coverDate", data.dateLabel);
  set("posterNames", `${data.groom} & ${data.bride}`);
  set("posterDate", data.dateLabel);
  set("groomName", data.groom);
  set("brideName", data.bride);
  set("groomParents", data.groomParents);
  set("brideParents", data.brideParents);
  set("groomInitial", (data.groom || "P").trim().charAt(0).toUpperCase());
  set("brideInitial", (data.bride || "W").trim().charAt(0).toUpperCase());
  set("akadDate", data.akadDate || data.dateLabel);
  set("akadTime", data.akadTime);
  set("receptionDate", data.receptionDate || data.dateLabel);
  set("receptionTime", data.receptionTime);
  set("guestArrival", data.guestArrival);
  set("venueName", data.venueName || "Lokasi Acara");
  set("venueAddress", data.venue);
  set("footerNames", `${data.groom} & ${data.bride}`);
  document.title = `Undangan ${data.groom} & ${data.bride}`;

  const posterImg = $("heroPhoto");
  const posterPlaceholder = $("posterPlaceholder");
  const imageValue = data.heroImage || "";
  if (posterImg && imageValue) {
    posterImg.src = imageValue;
    posterImg.alt = `Foto ${data.groom} dan ${data.bride}`;
    posterImg.hidden = false;
    posterImg.onerror = () => {
      posterImg.hidden = true;
      posterPlaceholder.hidden = false;
    };
    posterPlaceholder.hidden = true;
  } else {
    posterImg.hidden = true;
    posterPlaceholder.hidden = false;
  }

  const audio = $("backgroundMusic");
  if (audio && data.musicFile) audio.src = data.musicFile;

  const akadCard = $("akadCard");
  if (data.eventMode === "resepsi_saja" && akadCard) akadCard.hidden = true;

  const eventDate = new Date(data.dateISO || DEFAULT_INVITATION.dateISO).getTime();
  function updateCountdown() {
    const diff = Math.max(0, (Number.isFinite(eventDate) ? eventDate : Date.now()) - Date.now());
    set("days", String(Math.floor(diff / 86400000)).padStart(2,"0"));
    set("hours", String(Math.floor(diff / 3600000) % 24).padStart(2,"0"));
    set("minutes", String(Math.floor(diff / 60000) % 60).padStart(2,"0"));
    set("seconds", String(Math.floor(diff / 1000) % 60).padStart(2,"0"));
  }
  updateCountdown();
  window.setInterval(updateCountdown, 1000);

  const mapFrame = $("mapFrame");
  const addressQuery = [data.venueName, data.venue].filter(Boolean).join(" ");
  if (mapFrame) mapFrame.src = `https://www.google.com/maps?q=${encodeURIComponent(addressQuery || "Madura, Indonesia")}&output=embed`;
  const mapLink = $("mapsLink");
  if (mapLink) {
    try {
      const u = new URL(data.mapsUrl || "https://maps.google.com/", location.href);
      mapLink.href = ["https:","http:"].includes(u.protocol) ? u.href : "https://maps.google.com/";
    } catch (_) {
      mapLink.href = "https://maps.google.com/";
    }
  }

  const fillSelect = (id, values) => {
    const select = $(id);
    if (!select) return;
    select.replaceChildren();
    (values || []).forEach(value => {
      const opt = document.createElement("option");
      opt.value = value;
      opt.textContent = value;
      select.appendChild(opt);
    });
  };
  fillSelect("arrivalTime", (data.arrivalSlots && data.arrivalSlots.length) ? data.arrivalSlots : DEFAULT_INVITATION.arrivalSlots);
  fillSelect("guestCount", (data.guestCountOptions && data.guestCountOptions.length) ? data.guestCountOptions : DEFAULT_INVITATION.guestCountOptions);

  // One active account card at a time; only accounts completed in admin appear.
  const PROVIDERS = {
    "DANA": {label:"DANA", kind:"DOMPET DIGITAL", short:"DANA", color:"#087fce", text:"#ffffff"},
    "OVO": {label:"OVO", kind:"DOMPET DIGITAL", short:"OVO", color:"#4b238c", text:"#ffffff"},
    "GOPAY": {label:"GoPay", kind:"DOMPET DIGITAL", short:"GoPay", color:"#00a5e5", text:"#ffffff"},
    "SHOPEEPAY": {label:"ShopeePay", kind:"DOMPET DIGITAL", short:"ShopeePay", color:"#ee4d2d", text:"#ffffff"},
    "LINKAJA": {label:"LinkAja", kind:"DOMPET DIGITAL", short:"LinkAja", color:"#e21d2b", text:"#ffffff"},
    "BRI": {label:"BRI", kind:"BANK", short:"BRI", color:"#07529a", text:"#ffffff"},
    "BCA": {label:"BCA", kind:"BANK", short:"BCA", color:"#0876bd", text:"#ffffff"},
    "BNI": {label:"BNI", kind:"BANK", short:"BNI", color:"#ed7c24", text:"#ffffff"},
    "MANDIRI": {label:"Mandiri", kind:"BANK", short:"Mandiri", color:"#173d78", text:"#ffffff"},
    "BSI": {label:"BSI", kind:"BANK", short:"BSI", color:"#16845b", text:"#ffffff"},
    "BTN": {label:"BTN", kind:"BANK", short:"BTN", color:"#12549a", text:"#ffffff"},
    "CIMB": {label:"CIMB Niaga", kind:"BANK", short:"CIMB", color:"#c71d31", text:"#ffffff"},
    "PERMATA": {label:"PermataBank", kind:"BANK", short:"PERMATA", color:"#194b8a", text:"#ffffff"},
    "DANAMON": {label:"Danamon", kind:"BANK", short:"DANAMON", color:"#ed3038", text:"#ffffff"},
    "JATIM": {label:"Bank Jatim", kind:"BANK", short:"JATIM", color:"#164f90", text:"#ffffff"}
  };
  const accounts = (data.bankAccounts || []).filter(a => a && a.provider && a.accountNumber);
  const picker = $("bankPicker");
  const bankCard = $("bankCard");
  const copyButton = $("copyAccount");
  let activeAccount = null;

  function showAccount(account, button) {
    activeAccount = account;
    const meta = PROVIDERS[account.provider] || {label:account.provider,kind:"BANK",short:account.provider,color:"#51121b",text:"#fff"};
    set("bankCardType", meta.kind);
    set("bankLogo", meta.short);
    $("bankLogo").style.background = meta.color;
    $("bankLogo").style.color = meta.text;
    set("accountNumber", account.accountNumber);
    set("accountHolder", `${TEXT.accountHolderPrefix || "Atas nama"}: ${account.accountHolder || "-"}`);
    if (button) {
      picker.querySelectorAll("button").forEach(b => b.classList.toggle("active", b === button));
    }
    bankCard.style.setProperty("--bank-color", meta.color);
    bankCard.hidden = false;
  }

  if (accounts.length && picker && bankCard) {
    $("giftSection").hidden = false;
    picker.replaceChildren();
    accounts.forEach((account, index) => {
      const meta = PROVIDERS[account.provider] || {label:account.provider,short:account.provider,color:"#51121b",text:"#fff"};
      const button = document.createElement("button");
      button.type = "button";
      button.className = "bank-pick";
      const logo = document.createElement("span");
      logo.className = "bank-pick-logo";
      logo.textContent = meta.short;
      const label = document.createElement("span");
      label.textContent = meta.label;
      button.append(logo, label);
      button.addEventListener("click", () => showAccount(account, button));
      picker.appendChild(button);
      if (index === 0) showAccount(account, button);
    });
  }

  copyButton?.addEventListener("click", async () => {
    if (!activeAccount) return;
    try {
      await navigator.clipboard.writeText(activeAccount.accountNumber);
      set("copyNotice", TEXT.copySuccessMessage || "Nomor berhasil disalin.");
    } catch (_) {
      const tmp = document.createElement("textarea");
      tmp.value = activeAccount.accountNumber;
      document.body.appendChild(tmp); tmp.select();
      const ok = document.execCommand("copy");
      tmp.remove();
      set("copyNotice", ok ? (TEXT.copySuccessMessage || "Nomor berhasil disalin.") : (TEXT.copyFailedMessage || "Salin nomor secara manual."));
    }
  });

  const cover = $("cover");
  const invitation = $("invitation");
  const revealItems = document.querySelectorAll(".reveal");
  const observer = ("IntersectionObserver" in window)
    ? new IntersectionObserver(entries => entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      }), {threshold:0.12})
    : null;

  $("openInvitation").addEventListener("click", async () => {
    cover.classList.add("cover-opening");
    window.setTimeout(() => {
      cover.hidden = true;
      invitation.classList.remove("hidden");
      document.body.classList.add("invitation-open");
      revealItems.forEach(item => {
        if (observer) observer.observe(item);
        else item.classList.add("is-visible");
      });
      window.scrollTo({top:0,behavior:"smooth"});
    }, 700);
    if (audio && audio.src) {
      try { await audio.play(); } catch (_) { /* Browser may require the music button. */ }
    }
  });

  $("musicToggle").addEventListener("click", async () => {
    if (!audio || !audio.src) {
      alert(TEXT.musicMissingMessage || "Musik belum ditambahkan.");
      return;
    }
    const label = $("musicToggle").querySelector("[data-copy]");
    if (audio.paused) {
      try {
        await audio.play();
        if (label) label.textContent = TEXT.musicOffButton || "Matikan";
      } catch (_) {
        alert(TEXT.musicErrorMessage || "Musik belum dapat diputar.");
      }
    } else {
      audio.pause();
      if (label) label.textContent = TEXT.musicButton || "Musik";
    }
  });

  const arrival = $("arrivalTime");
  const attendance = $("attendance");
  function updateArrivalEnabled() {
    if (!arrival || !attendance) return;
    arrival.disabled = attendance.value !== "Hadir";
  }
  attendance?.addEventListener("change", updateArrivalEnabled);
  updateArrivalEnabled();

  $("rsvpForm").addEventListener("submit", event => {
    event.preventDefault();
    const phone = (data.whatsappNumber || "").replace(/\D/g, "");
    if (!phone) {
      alert(TEXT.whatsappMissingMessage || "Nomor WhatsApp panitia belum diisi.");
      return;
    }
    const status = attendance.value;
    const intro = (TEXT.rsvpWhatsappIntro || "Konfirmasi undangan {groom} & {bride}.")
      .replaceAll("{groom}", data.groom || "").replaceAll("{bride}", data.bride || "");
    const lines = [
      intro,
      `${TEXT.rsvpWhatsappName || "Nama"}: ${$("rsvpName").value.trim()}`,
      `${TEXT.rsvpWhatsappAttendance || "Kehadiran"}: ${status}`,
      `${TEXT.rsvpWhatsappGuestCount || "Jumlah tamu"}: ${$("guestCount").value}`,
      `${TEXT.rsvpWhatsappArrival || "Perkiraan kedatangan"}: ${status === "Hadir" ? arrival.value : "-"}`,
      `${TEXT.rsvpWhatsappMessage || "Ucapan"}: ${$("message").value.trim() || "-"}`,
      TEXT.rsvpWhatsappThanks || "Terima kasih."
    ];
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(lines.join("\n"))}`, "_blank", "noopener,noreferrer");
  });
})();
