(async () => {
"use strict";
const $ = id => document.getElementById(id);
const fragment = new URLSearchParams(location.hash.replace(/^#/,""));
const query = new URLSearchParams(location.search);
const APP_BASE = new URL(".", document.currentScript.src);
let recipientFromRecord = "";

function getPathSlug() {
  const basePath = APP_BASE.pathname.endsWith("/") ? APP_BASE.pathname : `${APP_BASE.pathname}/`;
  if (!location.pathname.startsWith(basePath)) return "";
  let remainder = location.pathname.slice(basePath.length).replace(/^\/+|\/+$/g, "");
  try { remainder = decodeURIComponent(remainder); } catch (_) {}
  if (!remainder || ["index.html", "admin.html", "404.html"].includes(remainder)) return "";
  return remainder.split("/")[0];
}

function decodeBase64Url(token) {
  const normalized=String(token||"").replace(/-/g,"+").replace(/_/g,"/");
  const padded=normalized+"=".repeat((4-normalized.length%4)%4);
  const binary=atob(padded);
  const bytes=new Uint8Array(binary.length);
  for(let i=0;i<binary.length;i++)bytes[i]=binary.charCodeAt(i);
  return bytes;
}
async function readPayload() {
  const token=fragment.get("p");
  if(token) {
    const bytes=decodeBase64Url(token);
    if(fragment.get("z")==="1") {
      if(typeof DecompressionStream!=="function") throw new Error("Browser ini belum mendukung pembukaan tautan terkompresi. Coba Chrome atau Edge versi terbaru.");
      const stream=new Blob([bytes]).stream().pipeThrough(new DecompressionStream("gzip"));
      const text=await new Response(stream).text();
      return JSON.parse(text);
    }
    return JSON.parse(new TextDecoder().decode(bytes));
  }
  const old=query.get("data");
  if(old)return JSON.parse(old);

  // Pretty permalink: GitHub Pages routes unknown slug paths through the root 404.html.
  const slug = getPathSlug();
  if (slug) {
    const response = await fetch(new URL(`data/${encodeURIComponent(slug)}.json`, APP_BASE), {cache:"no-store"});
    if (!response.ok) {
      throw new Error(`File data/${slug}.json belum ditemukan. Unggah Data JSON ke folder data di repository GitHub.`);
    }
    const record = await response.json();
    if (record && record.invitation && typeof record.invitation === "object") {
      recipientFromRecord = typeof record.recipientName === "string" ? record.recipientName : "";
      return record.invitation;
    }
    // Backward compatibility for a plain invitation JSON file.
    recipientFromRecord = record && typeof record.recipientName === "string" ? record.recipientName : "";
    return record || {};
  }
  return {};
}
function mergeData(raw) {
  const data=(raw && typeof raw==="object" && !Array.isArray(raw))?raw:{};
  const result={...DEFAULT_INVITATION,...data};
  result.texts={...DEFAULT_INVITATION.texts,...(data.texts && typeof data.texts==="object"?data.texts:{})};
  result.bankAccounts=Array.isArray(data.bankAccounts)?data.bankAccounts.filter(a=>a && a.provider && a.accountNumber).slice(0,12):[];
  result.arrivalSlots=Array.isArray(data.arrivalSlots)&&data.arrivalSlots.length?data.arrivalSlots:DEFAULT_INVITATION.arrivalSlots;
  result.guestCountOptions=Array.isArray(data.guestCountOptions)&&data.guestCountOptions.length?data.guestCountOptions:DEFAULT_INVITATION.guestCountOptions;
  return result;
}
let invitationData;
try {
  invitationData=mergeData(await readPayload());
} catch(error) {
  console.error(error);
  invitationData=mergeData({});
  const warning=document.createElement("div");
  warning.className="link-warning";
  warning.textContent=error && error.message ? error.message : "Data undangan pada tautan tidak dapat dibaca. Mohon minta tautan terbaru dari penyelenggara.";
  document.body.prepend(warning);
}
const d=invitationData, T=d.texts;
const guestName=recipientFromRecord || fragment.get("to") || query.get("to") || T.guestFallback || "Tamu Undangan";
const put=(id,value)=>{const el=$(id);if(el)el.textContent=value==null?"":String(value);};
document.querySelectorAll("[data-text]").forEach(el=>{
  const key=el.dataset.text;
  if(Object.prototype.hasOwnProperty.call(T,key))el.textContent=T[key];
});
document.querySelectorAll("[data-placeholder]").forEach(el=>{
  const key=el.dataset.placeholder;
  if(Object.prototype.hasOwnProperty.call(T,key))el.placeholder=T[key];
});
put("coverGuest",guestName);
put("coverNames",`${d.groom || "Nama Mempelai Pria"}\n&\n${d.bride || "Nama Mempelai Wanita"}`);
put("coverDate",d.dateLabel || "");
put("photoNames",`${d.groom || ""} & ${d.bride || ""}`);
put("photoDate",d.dateLabel || "");
put("groomName",d.groom || "Nama Mempelai Pria");
put("brideName",d.bride || "Nama Mempelai Wanita");
put("groomParents",d.groomParents || "");
put("brideParents",d.brideParents || "");
put("groomMonogram",(d.groom || "P").trim().charAt(0).toUpperCase());
put("brideMonogram",(d.bride || "W").trim().charAt(0).toUpperCase());
put("akadDate",d.akadDate || "");
put("akadTime",d.akadTime || "");
put("receptionDate",d.receptionDate || "");
put("receptionTime",d.receptionTime || "");
put("guestArrival",d.guestArrival || "");
put("venueName",d.venueName || "Lokasi Acara");
put("venueAddress",d.venue || "");
put("footerNames",`${d.groom || ""} & ${d.bride || ""}`);
document.title=`Undangan ${d.groom || ""} & ${d.bride || ""}`;

function setPhoto(imgId,monogramId,dataUrl,alt) {
  const img=$(imgId),monogram=$(monogramId);
  if(!img||!monogram)return;
  if(dataUrl) {
    img.onload=()=>{img.hidden=false;monogram.hidden=true;};
    img.onerror=()=>{img.hidden=true;monogram.hidden=false;put("photoError",T.photoErrorText);};
    img.src=dataUrl;
    img.hidden=false;
    monogram.hidden=true;
  } else {
    img.removeAttribute("src");
    img.hidden=true;monogram.hidden=false;
  }
  img.alt=alt;
}
const couplePhoto=$("couplePhoto");
if(d.heroImage) {
  couplePhoto.onload=()=>{couplePhoto.hidden=false;$("photoFallback").hidden=true;};
  couplePhoto.onerror=()=>{couplePhoto.hidden=true;$("photoFallback").hidden=false;};
  couplePhoto.src=d.heroImage;
} else {
  couplePhoto.hidden=true;
  $("photoFallback").hidden=false;
}
setPhoto("groomPhoto","groomMonogram",d.groomImage,`Foto ${d.groom || "mempelai pria"}`);
setPhoto("bridePhoto","brideMonogram",d.brideImage,`Foto ${d.bride || "mempelai wanita"}`);

if(d.eventMode==="resepsi_saja")$("akadCard").hidden=true;
if(d.eventMode==="akad_saja")$("receptionCard").hidden=true;

const eventDateString=d.dateISO || "";
const eventDate=eventDateString?new Date(eventDateString).getTime():NaN;
function updateCountdown() {
  if(!Number.isFinite(eventDate)) {
    ["days","hours","minutes","seconds"].forEach(id=>put(id,"--"));
    return;
  }
  const diff=Math.max(0,eventDate-Date.now());
  put("days",String(Math.floor(diff/86400000)).padStart(2,"0"));
  put("hours",String(Math.floor(diff/3600000)%24).padStart(2,"0"));
  put("minutes",String(Math.floor(diff/60000)%60).padStart(2,"0"));
  put("seconds",String(Math.floor(diff/1000)%60).padStart(2,"0"));
}
updateCountdown();
window.setInterval(updateCountdown,1000);

// Embed the map from the entered street/address only. If the venue title is included
// in Google's search query, Google can resolve a different saved place/POI name.
const venueNameText=String(d.venueName || "").trim();
const venueAddressText=String(d.venue || "").trim();
const mapAddressQuery=venueAddressText || venueNameText;
const mapFrame=$("mapFrame");
const mapVenueTag=$("mapVenueTag");
if(mapVenueTag) {
  mapVenueTag.textContent=venueNameText || venueAddressText || "Lokasi Acara";
  mapVenueTag.hidden=!(venueNameText || venueAddressText);
  mapVenueTag.title=venueNameText || venueAddressText || "Lokasi Acara";
}
if(mapAddressQuery) {
  mapFrame.src=`https://www.google.com/maps?q=${encodeURIComponent(mapAddressQuery)}&output=embed`;
} else {
  mapFrame.src="https://www.google.com/maps?q=Madura,Indonesia&output=embed";
}
let mapUrl="https://maps.google.com/";
try {
  const custom=new URL(d.mapsUrl || "",location.href);
  if(d.mapsUrl && ["https:","http:"].includes(custom.protocol))mapUrl=custom.href;
  else if(mapAddressQuery)mapUrl=`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent([venueNameText,venueAddressText].filter(Boolean).join(", "))}`;
} catch(_) {
  if(mapAddressQuery)mapUrl=`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent([venueNameText,venueAddressText].filter(Boolean).join(", "))}`;
}
$("mapsLink").href=mapUrl;

function fillOptions(selectId,items) {
  const select=$(selectId);select.replaceChildren();
  items.forEach(item=>{
    const option=document.createElement("option");
    option.value=String(item);option.textContent=String(item);select.appendChild(option);
  });
}
fillOptions("rsvpTime",d.arrivalSlots);
fillOptions("rsvpCount",d.guestCountOptions);
const statusSelect=$("rsvpStatus"),timeSelect=$("rsvpTime");
function setRsvpTimeState(){timeSelect.disabled=statusSelect.value!=="Hadir";}
statusSelect.addEventListener("change",setRsvpTimeState);
setRsvpTimeState();

const PROVIDERS={
 BRI:{name:"Bank BRI",mark:"BRI",color:"#07529a",type:"BANK"},
 BCA:{name:"Bank BCA",mark:"BCA",color:"#0876bd",type:"BANK"},
 BNI:{name:"Bank BNI",mark:"BNI",color:"#ed7c24",type:"BANK"},
 MANDIRI:{name:"Bank Mandiri",mark:"Mandiri",color:"#173d78",type:"BANK"},
 BSI:{name:"Bank Syariah Indonesia",mark:"BSI",color:"#16845b",type:"BANK"},
 BTN:{name:"Bank BTN",mark:"BTN",color:"#12549a",type:"BANK"},
 CIMB:{name:"CIMB Niaga",mark:"CIMB",color:"#c71d31",type:"BANK"},
 PERMATA:{name:"PermataBank",mark:"PERMATA",color:"#194b8a",type:"BANK"},
 DANAMON:{name:"Bank Danamon",mark:"DANAMON",color:"#ed3038",type:"BANK"},
 JATIM:{name:"Bank Jatim",mark:"JATIM",color:"#164f90",type:"BANK"},
 DANA:{name:"DANA",mark:"DANA",color:"#087fce",type:"E-WALLET"},
 OVO:{name:"OVO",mark:"OVO",color:"#4b238c",type:"E-WALLET"},
 GOPAY:{name:"GoPay",mark:"GoPay",color:"#00a5e5",type:"E-WALLET"},
 SHOPEEPAY:{name:"ShopeePay",mark:"ShopeePay",color:"#ee4d2d",type:"E-WALLET"},
 LINKAJA:{name:"LinkAja",mark:"LinkAja",color:"#e21d2b",type:"E-WALLET"}
};
const paymentChoices=$("paymentChoices"),paymentCard=$("paymentCard");
let selectedPayment=null;
function showPayment(account,button) {
  selectedPayment=account;
  const meta=PROVIDERS[account.provider]||{name:account.provider,mark:account.provider,color:"#4b101b",type:"BANK"};
  put("paymentType",meta.type);
  put("paymentLogo",meta.mark);
  $("paymentLogo").style.backgroundColor=meta.color;
  put("paymentNumber",account.accountNumber);
  put("paymentOwner",`${T.accountHolderPrefix || "Atas nama"}: ${account.accountHolder || "-"}`);
  paymentCard.style.setProperty("--payment-color",meta.color);
  paymentCard.hidden=false;
  paymentChoices.querySelectorAll("button").forEach(btn=>btn.classList.toggle("active",btn===button));
}
if(d.bankAccounts.length) {
  $("giftSection").hidden=false;
  d.bankAccounts.forEach((account,index)=>{
    const meta=PROVIDERS[account.provider]||{name:account.provider,mark:account.provider,color:"#4b101b"};
    const btn=document.createElement("button");
    btn.type="button";btn.className="payment-choice";
    const mark=document.createElement("span");mark.className="payment-choice-mark";mark.textContent=meta.mark;mark.style.backgroundColor=meta.color;
    const label=document.createElement("span");label.textContent=meta.name;
    btn.append(mark,label);
    btn.addEventListener("click",()=>showPayment(account,btn));
    paymentChoices.appendChild(btn);
    if(index===0)showPayment(account,btn);
  });
}
$("copyPayment").addEventListener("click",async()=>{
  if(!selectedPayment)return;
  const text=selectedPayment.accountNumber;
  try {
    await navigator.clipboard.writeText(text);
    put("paymentNotice",T.accountCopySuccess || "Nomor berhasil disalin.");
  } catch(_) {
    const temp=document.createElement("textarea");temp.value=text;document.body.appendChild(temp);temp.select();
    const success=document.execCommand("copy");temp.remove();
    put("paymentNotice",success?(T.accountCopySuccess||"Nomor berhasil disalin."):(T.accountCopyFail||"Silakan salin manual."));
  }
});

const audio=$("backgroundMusic");
if(d.musicFile)audio.src=d.musicFile;
$("musicToggle").addEventListener("click",async()=>{
  if(!audio.src){alert(T.noMusicText || "Musik belum ditambahkan.");return;}
  const span=$("musicToggle").querySelector("span");
  if(audio.paused) {
    try {await audio.play();if(span)span.textContent=T.musicStop||"Matikan Musik";}
    catch(_){alert("Browser menunggu izin putar musik. Tekan tombol Musik kembali.");}
  } else {
    audio.pause();if(span)span.textContent=T.musicButton||"Musik";
  }
});

const cover=$("cover"),invitation=$("invitation");
let opened=false;
$("openInvitation").addEventListener("click",async()=>{
  if(opened)return;opened=true;
  cover.classList.add("cover-exit");
  window.setTimeout(()=>{
    cover.hidden=true;
    invitation.classList.remove("hidden");
    document.body.classList.add("invite-opened");
    revealAll();
    window.scrollTo({top:0,behavior:"smooth"});
  },620);
  if(audio.src) {
    try {await audio.play();const span=$("musicToggle").querySelector("span");if(span)span.textContent=T.musicStop||"Matikan Musik";}
    catch(_){}
  }
});
function revealAll() {
  const items=document.querySelectorAll(".reveal");
  if(!("IntersectionObserver" in window)){items.forEach(el=>el.classList.add("visible"));return;}
  const observer=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){entry.target.classList.add("visible");observer.unobserve(entry.target);}
    });
  },{threshold:0.08});
  items.forEach(el=>observer.observe(el));
}

$("rsvpForm").addEventListener("submit",event=>{
  event.preventDefault();
  const phone=String(d.whatsappNumber||"").replace(/\D/g,"");
  if(!phone){alert(T.rsvpMissingPhone || "Nomor WhatsApp panitia belum diisi.");return;}
  const intro=(T.whatsappIntro||"Konfirmasi undangan {groom} & {bride}.").replaceAll("{groom}",d.groom||"").replaceAll("{bride}",d.bride||"");
  const lines=[
    intro,
    `${T.whatsappName||"Nama"}: ${$("rsvpName").value.trim()}`,
    `${T.whatsappStatus||"Kehadiran"}: ${statusSelect.value}`,
    `${T.whatsappCount||"Jumlah tamu"}: ${$("rsvpCount").value}`,
    `${T.whatsappTime||"Perkiraan kedatangan"}: ${statusSelect.value==="Hadir"?timeSelect.value:"-"}`,
    `${T.whatsappMessage||"Ucapan"}: ${$("rsvpMessage").value.trim()||"-"}`,
    T.whatsappThanks||"Terima kasih."
  ];
  const waUrl=`https://wa.me/${phone}?text=${encodeURIComponent(lines.join("\n"))}`;
  window.open(waUrl,"_blank","noopener,noreferrer");
});
})();