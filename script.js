const $ = (id) => document.getElementById(id);
const params = new URLSearchParams(window.location.search);
const guest = params.get("to") || "Tamu Undangan";

$("guestName").textContent = guest;
$("coverNames").innerHTML = `${INVITATION.groom}<br><span>&</span><br>${INVITATION.bride}`;
$("heroNames").innerHTML = `${INVITATION.groom} <span>&</span> ${INVITATION.bride}`;
$("heroDate").textContent = INVITATION.dateLabel;
$("groomName").textContent = INVITATION.groom;
$("brideName").textContent = INVITATION.bride;
$("groomParents").textContent = INVITATION.groomParents;
$("brideParents").textContent = INVITATION.brideParents;
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
$("copyAccount").addEventListener("click", async () => {
  const number = INVITATION.accountNumber || "";
  if (!number || number === "0000000000") {
    $("copyNotice").textContent = "Nomor rekening belum diatur.";
    return;
  }
  try {
    await navigator.clipboard.writeText(number);
    $("copyNotice").textContent = "Nomor rekening berhasil disalin.";
  } catch (_) {
    $("copyNotice").textContent = "Silakan salin nomor rekening secara manual.";
  }
});
document.title = `Undangan ${INVITATION.groom} & ${INVITATION.bride}`;

if (INVITATION.heroImage) {
  $("heroPhoto").style.backgroundImage = `url("${INVITATION.heroImage}")`;
  $("heroPhoto").classList.add("has-image");
  $("heroPhoto").innerHTML = "";
}
if (INVITATION.musicFile) $("backgroundMusic").src = INVITATION.musicFile;

$("openInvitation").addEventListener("click", async () => {
  $("cover").classList.add("closed");
  $("invitation").classList.remove("hidden");
  if (INVITATION.musicFile) {
    try { await $("backgroundMusic").play(); $("musicToggle").textContent = "♫ Matikan"; } catch (_) {}
  }
});
$("musicToggle").addEventListener("click", async () => {
  const audio = $("backgroundMusic");
  if (!audio.src) return alert("Tambahkan file musik pada config.js terlebih dahulu.");
  if (audio.paused) { await audio.play(); $("musicToggle").textContent = "♫ Matikan"; }
  else { audio.pause(); $("musicToggle").textContent = "♫ Putar"; }
});

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

$("rsvpForm").addEventListener("submit", (event) => {
  event.preventDefault();
  if (!INVITATION.whatsappNumber) {
    alert("Nomor WhatsApp penyelenggara belum diisi pada config.js.");
    return;
  }
  const name = $("rsvpName").value.trim();
  const attendance = $("attendance").value;
  const count = $("guestCount").value;
  const arrival = $("arrivalTime").value;
  const message = $("message").value.trim();
  const body = `Assalamu'alaikum, konfirmasi undangan ${INVITATION.groom} & ${INVITATION.bride}.%0A%0ANama: ${name}%0AKehadiran: ${attendance}%0AJumlah tamu: ${count}%0APerkiraan kedatangan: ${attendance === "Hadir" ? arrival : "-"}%0AUcapan: ${message || "-"}%0A%0ATerima kasih.`;
  window.open(`https://wa.me/${INVITATION.whatsappNumber}?text=${body}`, "_blank");
});