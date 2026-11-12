/* Renderer undangan: data pasangan dan seluruh teks dapat dikirim melalui parameter ?data=. */
const $ = (id) => document.getElementById(id);
const params = new URLSearchParams(window.location.search);
function readInvitationData() {
  const allowed = ["groom","bride","groomParents","brideParents","dateLabel","dateISO","akadDate","akadTime","receptionDate","receptionTime","guestArrival","venue","mapsUrl","whatsappNumber","bankName","accountNumber","accountHolder","heroImage","musicFile"];
  const incoming = {};
  try {
    const raw=params.get("data"), parsed=raw?JSON.parse(raw):{};
    if(parsed && typeof parsed === "object" && !Array.isArray(parsed)){
      allowed.forEach(k=>{if(typeof parsed[k]==="string")incoming[k]=parsed[k].slice(0,4000);});
      if(parsed.texts && typeof parsed.texts==="object" && !Array.isArray(parsed.texts)){
        incoming.texts={};Object.entries(DEFAULT_INVITATION.texts||{}).forEach(([k])=>{if(typeof parsed.texts[k]==="string")incoming.texts[k]=parsed.texts[k].slice(0,5000);});
      }
      ["arrivalSlots","guestCountOptions"].forEach(k=>{if(Array.isArray(parsed[k]))incoming[k]=parsed[k].filter(v=>typeof v==="string").slice(0,20).map(v=>v.slice(0,100));});
    }
  } catch(e){console.warn("Data undangan tidak dapat dibaca; menggunakan data dasar.",e);}
  return {...DEFAULT_INVITATION,...incoming,texts:{...(DEFAULT_INVITATION.texts||{}),...(incoming.texts||{})}};
}
const INVITATION=readInvitationData(), TEXT=INVITATION.texts||{};
const guestName=params.get("to")||((DEFAULT_INVITATION.texts||{}).guestFallback||"Tamu Undangan");
function setText(id,value){const el=$(id);if(el)el.textContent=value||"";}
function applyEditableTexts(){
  document.querySelectorAll("[data-copy]").forEach(el=>{const key=el.dataset.copy;if(Object.prototype.hasOwnProperty.call(TEXT,key))el.textContent=TEXT[key];});
  document.querySelectorAll("[data-placeholder]").forEach(el=>{const key=el.dataset.placeholder;if(Object.prototype.hasOwnProperty.call(TEXT,key))el.setAttribute("placeholder",TEXT[key]);});
}
function safeUrl(value,fallback="#"){
  if(!value)return fallback;
  try{const u=new URL(value,window.location.href);return ["https:","http:"].includes(u.protocol)?u.href:fallback;}catch(_){return fallback;}
}
applyEditableTexts();
setText("guestName",guestName);
setText("coverNames",`${INVITATION.groom}\n&\n${INVITATION.bride}`);
setText("coverDate",INVITATION.dateLabel);
setText("heroNames",`${INVITATION.groom} & ${INVITATION.bride}`);
setText("heroDate",INVITATION.dateLabel);
setText("groomName",INVITATION.groom);setText("brideName",INVITATION.bride);
setText("groomParents",INVITATION.groomParents);setText("brideParents",INVITATION.brideParents);
setText("groomInitial",(INVITATION.groom.trim()[0]||"P").toUpperCase());setText("brideInitial",(INVITATION.bride.trim()[0]||"W").toUpperCase());
setText("akadDate",INVITATION.akadDate);setText("akadTime",INVITATION.akadTime);
setText("receptionDate",INVITATION.receptionDate);setText("receptionTime",INVITATION.receptionTime);
setText("guestArrival",INVITATION.guestArrival);setText("venue",INVITATION.venue);
setText("footerNames",`${INVITATION.groom} & ${INVITATION.bride}`);
setText("bankName",INVITATION.bankName);setText("accountNumber",INVITATION.accountNumber||"");
setText("accountHolder",INVITATION.accountHolder?`${TEXT.accountHolderPrefix||"Atas nama:"} ${INVITATION.accountHolder}`:"");
document.title=`Undangan ${INVITATION.groom} & ${INVITATION.bride}`;
const mapsLink=$("mapsLink");if(mapsLink)mapsLink.href=safeUrl(INVITATION.mapsUrl);
const heroPhoto=$("heroPhoto");
if(heroPhoto&&INVITATION.heroImage){const img=document.createElement("img");img.src=safeUrl(INVITATION.heroImage,"");img.alt=`Foto ${INVITATION.groom} dan ${INVITATION.bride}`;img.loading="eager";img.onerror=()=>{heroPhoto.classList.remove("has-image");heroPhoto.innerHTML=`<span class="photo-placeholder"><b>✿</b> ${TEXT.photoPlaceholderTitle||"Foto Kedua Mempelai"}</span>`;};if(img.src){heroPhoto.replaceChildren(img);heroPhoto.classList.add("has-image");}}
const audio=$("backgroundMusic");if(audio&&INVITATION.musicFile)audio.src=safeUrl(INVITATION.musicFile,"");
const fillOptions=(select,values)=>{if(!select)return;select.replaceChildren();(values||[]).forEach(v=>{const o=document.createElement("option");o.value=v;o.textContent=v;select.appendChild(o);});};
fillOptions($("arrivalTime"),INVITATION.arrivalSlots||[]);fillOptions($("guestCount"),INVITATION.guestCountOptions||["1","2","3","4","5"]);
const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add("is-visible");observer.unobserve(entry.target);}}),{threshold:.12});
$("openInvitation").addEventListener("click",async()=>{
  const cover=$("cover");cover.classList.add("cover-close");
  window.setTimeout(()=>{cover.classList.add("hidden");$("invitation").classList.remove("hidden");document.body.classList.add("invitation-open");document.querySelectorAll(".reveal").forEach(el=>observer.observe(el));window.scrollTo({top:0,behavior:"smooth"});},650);
  if(audio&&audio.src){try{await audio.play();const s=$("musicToggle").querySelector("[data-copy]");if(s)s.textContent=TEXT.musicOffButton||"Matikan";}catch(_){}}
});
$("musicToggle").addEventListener("click",async()=>{
  if(!audio||!audio.src){alert(TEXT.musicMissingMessage||"Tambahkan alamat file musik melalui Pembuat Undangan terlebih dahulu.");return;}
  const s=$("musicToggle").querySelector("[data-copy]");
  if(audio.paused){try{await audio.play();if(s)s.textContent=TEXT.musicOffButton||"Matikan";}catch(_){alert(TEXT.musicErrorMessage||"Musik belum dapat diputar. Periksa alamat file audio.");}}
  else{audio.pause();if(s)s.textContent=TEXT.musicButton||"Musik";}
});
function updateCountdown(){const t=new Date(INVITATION.dateISO).getTime(),diff=Number.isFinite(t)?Math.max(0,t-Date.now()):0;setText("days",String(Math.floor(diff/86400000)).padStart(2,"0"));setText("hours",String(Math.floor(diff/3600000)%24).padStart(2,"0"));setText("minutes",String(Math.floor(diff/60000)%60).padStart(2,"0"));setText("seconds",String(Math.floor(diff/1000)%60).padStart(2,"0"));}
updateCountdown();window.setInterval(updateCountdown,1000);
$("copyAccount").addEventListener("click",async()=>{const n=(INVITATION.accountNumber||"").trim();if(!n){setText("copyNotice",TEXT.copyMissingMessage||"Nomor rekening belum diatur.");return;}try{await navigator.clipboard.writeText(n);setText("copyNotice",TEXT.copySuccessMessage||"Nomor rekening berhasil disalin.");}catch(_){setText("copyNotice",TEXT.copyFailedMessage||"Silakan salin nomor rekening secara manual.");}});
const attendance=$("attendance"),arrivalField=$("arrivalTime");
if(attendance&&arrivalField){const update=()=>{arrivalField.disabled=attendance.value!=="Hadir";arrivalField.closest("label").classList.toggle("field-muted",arrivalField.disabled);};attendance.addEventListener("change",update);update();}
$("rsvpForm").addEventListener("submit",event=>{
  event.preventDefault();const phone=(INVITATION.whatsappNumber||"").replace(/\D/g,"");if(!phone){alert(TEXT.whatsappMissingMessage||"Nomor WhatsApp panitia belum diisi melalui Pembuat Undangan.");return;}
  const status=attendance.value, t=TEXT;
  const intro=(t.rsvpWhatsappIntro||"Konfirmasi undangan {groom} & {bride}.").replaceAll("{groom}",INVITATION.groom).replaceAll("{bride}",INVITATION.bride);
  const lines=[intro,`${t.rsvpWhatsappName||"Nama"}: ${$("rsvpName").value.trim()}`,`${t.rsvpWhatsappAttendance||"Kehadiran"}: ${status}`,`${t.rsvpWhatsappGuestCount||"Jumlah tamu"}: ${$("guestCount").value}`,`${t.rsvpWhatsappArrival||"Perkiraan kedatangan"}: ${status==="Hadir"?arrivalField.value:"-"}`,`${t.rsvpWhatsappMessage||"Ucapan"}: ${$("message").value.trim()||"-"}`,t.rsvpWhatsappThanks||"Terima kasih."];
  window.open(`https://wa.me/${phone}?text=${encodeURIComponent(lines.join("\n"))}`,"_blank","noopener,noreferrer");
});
