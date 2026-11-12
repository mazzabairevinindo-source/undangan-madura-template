const $ = (id) => document.getElementById(id);
const params = new URLSearchParams(window.location.search);
const guest = params.get("to") || "Tamu Undangan";

$("guestName").textContent = guest;
$("coverNames").innerHTML = `${INVITATION.groom} <em>&</em> ${INVITATION.bride}`;
$("heroNames").innerHTML = `${INVITATION.groom} <em>&</em> ${INVITATION.bride}`;
$("heroDate").textContent = INVITATION.dateLabel;
$("coverDate").textContent = INVITATION.dateLabel;
$("groomName").textContent = INVITATION.groom;
$("brideName").textContent = INVITATION.bride;
$("groomParents").textContent = INVITATION.groomParents;
$("brideParents").textContent = INVITATION.brideParents;
$("groomInitial").textContent = (INVITATION.groom.trim()[0] || "P").toUpperCase();
$("brideInitial").textContent = (INVITATION.bride.trim()[0] || "W").toUpperCase();
$("akadDate").textContent = INVITATION.akadDate;
$("akadTime").textContent = INVITATION.akadTime;
$("receptionDate").textContent = INVITATION.receptionDate;
$("receptionTime").textContent = INVITATION.receptionTime;
$("guestArrival").textContent = INVITATION.guestArrival;
$("venue").textContent = INVITATION.venue;
$("mapsLink").href = INVITATION.mapsUrl;
$("footerNames").textContent = `${INVITATION.groom} & ${INVITATION.bride}`;
$("bankName").textContent = INVITATION.bankName || "Nama Bank";
$("accountNumber").textContent = INVITATION.accountNumber || "Nomor rekening belum diisi";
$("accountHolder").textContent = INVITATION.accountHolder ? `Atas nama: ${INVITATION.accountHolder}` : "";
document.title = `Undangan ${INVITATION.groom} & ${INVITATION.bride}`;

if (INVITATION.heroImage) {
  $("heroPhoto").style.backgroundImage = `url("${INVITATION.heroImage}")`;
  $("heroPhoto").classList.add("has-image");
  $("heroPhoto").innerHTML = "";
}
if (INVITATION.musicFile) $("backgroundMusic").src = INVITATION.musicFile;

$("openInvitation").addEventListener("click", async () => {
  $("cover").classList.add("cover-close");
  window.setTimeout(() => {
    $("cover").classList.add("hidden");
    $("invitation").classList.remove("hidden");
    document.body.classList.add("invitation-open");
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    window.scrollTo({top: 0, behavior: "smooth"});
  }, 650);
  if (INVITATION.musicFile) {
    try { await $("backgroundMusic").play(); $("musicToggle").innerHTML = "<span>♫</span> Matikan"; } catch (_) {}
  }
});

$("musicToggle").addEventListener("click", async () => {
  const audio = $("backgroundMusic");
  if (!audio.src) { alert("Tambahkan file musik pada config.js terlebih dahulu."); return; }
  if (audio.paused) { await audio.play(); $("musicToggle").innerHTML = "<span>♫</span> Matikan"; }
  else { audio.pause(); $("musicToggle").innerHTML = "<span>♫</span> Musik"; }
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    }
  });
}, {threshold: 0.12});

function updateCountdown() {
  const diff = new Date(INVITATION.dateISO).getTime() - Date.now();
  const safe = Math.max(0, diff);
  $("days").textContent = String(Math.floor(safe / 86400000)).padStart(2,"0");
  $("hours").textContent = String(Math.floor(safe / 3600000) % 24).padStart(2,"0");
  $("minutes").textContent = String(Math.floor(safe / 60000) % 60).padStart(2,"0");
  $("seconds").textContent = String(Math.floor(safe / 1000) % 60).padStart(2,"0");
}
updateCountdown();
setInterval(updateCountdown, 1000);

$("copyAccount").addEventListener("click", async () => {
  const number = (INVITATION.accountNumber || "").trim();
  if (!number || number === "Isi Nomor Rekening") { $("copyNotice").textContent = "Nomor rekening belum diatur."; return; }
  try { await navigator.clipboard.writeText(number); $("copyNotice").textContent = "Nomor rekening berhasil disalin."; }
  catch (_) { $("copyNotice").textContent = "Silakan salin nomor rekening secara manual."; }
});

$("rsvpForm").addEventListener("submit", (event) => {
  event.preventDefault();
  if (!INVITATION.whatsappNumber) { alert("Nomor WhatsApp penyelenggara belum diisi pada config.js."); return; }
  const name = $("rsvpName").value.trim();
  const attendance = $("attendance").value;
  const count = $("guestCount").value;
  const arrival = $("arrivalTime").value;
  const message = $("message").value.trim();
  const lines = [
    `Assalamu'alaikum, konfirmasi undangan ${INVITATION.groom} & ${INVITATION.bride}.`,
    `Nama: ${name}`, `Kehadiran: ${attendance}`, `Jumlah tamu: ${count}`,
    `Perkiraan kedatangan: ${attendance === "Hadir" ? arrival : "-"}`,
    `Ucapan: ${message || "-"}`, "Terima kasih."
  ];
  window.open(`https://wa.me/${INVITATION.whatsappNumber}?text=${encodeURIComponent(lines.join("\n"))}`, "_blank", "noopener");
});
