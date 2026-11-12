(() => {
"use strict";
const form = document.getElementById("builderForm");
const $ = id => document.getElementById(id);
const field = name => form.elements.namedItem(name);
const val = name => {
  const el = field(name);
  return el ? String(el.value || "").trim() : "";
};
const STORAGE_KEY = "maduraWedding.v8.drafts";

const PROVIDERS = [
  {id:"BRI",name:"Bank BRI",mark:"BRI",color:"#07529a",type:"BANK"},
  {id:"BCA",name:"Bank BCA",mark:"BCA",color:"#0876bd",type:"BANK"},
  {id:"BNI",name:"Bank BNI",mark:"BNI",color:"#ed7c24",type:"BANK"},
  {id:"MANDIRI",name:"Bank Mandiri",mark:"Mandiri",color:"#173d78",type:"BANK"},
  {id:"BSI",name:"Bank Syariah Indonesia",mark:"BSI",color:"#16845b",type:"BANK"},
  {id:"BTN",name:"Bank BTN",mark:"BTN",color:"#12549a",type:"BANK"},
  {id:"CIMB",name:"CIMB Niaga",mark:"CIMB",color:"#c71d31",type:"BANK"},
  {id:"PERMATA",name:"PermataBank",mark:"PERMATA",color:"#194b8a",type:"BANK"},
  {id:"DANAMON",name:"Bank Danamon",mark:"DANAMON",color:"#ed3038",type:"BANK"},
  {id:"JATIM",name:"Bank Jatim",mark:"JATIM",color:"#164f90",type:"BANK"},
  {id:"DANA",name:"DANA",mark:"DANA",color:"#087fce",type:"E-WALLET"},
  {id:"OVO",name:"OVO",mark:"OVO",color:"#4b238c",type:"E-WALLET"},
  {id:"GOPAY",name:"GoPay",mark:"GoPay",color:"#00a5e5",type:"E-WALLET"},
  {id:"SHOPEEPAY",name:"ShopeePay",mark:"ShopeePay",color:"#ee4d2d",type:"E-WALLET"},
  {id:"LINKAJA",name:"LinkAja",mark:"LinkAja",color:"#e21d2b",type:"E-WALLET"}
];

const TEXT_GROUPS = [
 {title:"Sampul dan navigasi",fields:[
  ["brand","Nama merek undangan"],["coverEyebrow","Judul kecil sampul"],["coverBismillah","Teks Arab sampul (Bismillah)"],["coverRecipient","Awalan nama tamu"],["coverPlace","Tulisan di bawah nama tamu"],["openButton","Teks tombol buka undangan"],["coverFooter","Kalimat penutup sampul"],["musicButton","Tombol musik"],["musicStop","Tombol saat musik menyala"]
 ]},
 {title:"Foto pembuka dan pengantar",fields:[
  ["afterOpenEyebrow","Judul kecil di foto mempelai"],["afterOpenCaption","Keterangan pada foto mempelai"],["introArabic","Teks Arab bagian pengantar"],["introSalam","Salam pembuka"],["introText","Paragraf pengantar"],["noPhotoText","Tulisan jika foto belum dipilih"]
 ]},
 {title:"Profil kedua mempelai",fields:[
  ["coupleEyebrow","Tulisan kecil profil"],["coupleTitle","Judul profil"],["groomLabel","Label mempelai pria"],["brideLabel","Label mempelai wanita"],["quoteText","Kutipan ayat"],["quoteSource","Sumber kutipan"]
 ]},
 {title:"Acara dan lokasi",fields:[
  ["eventEyebrow","Tulisan kecil acara"],["eventTitle","Judul rangkaian acara"],["akadTitle","Nama acara akad"],["receptionTitle","Nama acara resepsi"],["arrivalTitle","Judul waktu kehadiran"],["arrivalText","Keterangan waktu kehadiran"],["venueTitle","Judul lokasi"],["venueAddressLabel","Label alamat"],["mapsButton","Teks tombol Google Maps"]
 ]},
 {title:"Hitung mundur dan hadiah",fields:[
  ["countdownEyebrow","Tulisan kecil countdown"],["countdownTitle","Judul countdown"],["daysLabel","Label hari"],["hoursLabel","Label jam"],["minutesLabel","Label menit"],["secondsLabel","Label detik"],["giftEyebrow","Tulisan kecil hadiah"],["giftTitle","Judul hadiah"],["giftText","Keterangan hadiah"],["accountHolderPrefix","Awalan nama pemilik rekening"],["accountCopyButton","Teks tombol salin rekening"],["accountCopySuccess","Pesan berhasil disalin"],["accountCopyFail","Pesan gagal menyalin"]
 ]},
 {title:"Konfirmasi kehadiran",fields:[
  ["rsvpEyebrow","Tulisan kecil RSVP"],["rsvpTitle","Judul RSVP"],["rsvpNameLabel","Label nama"],["rsvpNamePlaceholder","Placeholder nama"],["rsvpStatusLabel","Label status kehadiran"],["rsvpYes","Pilihan hadir"],["rsvpNo","Pilihan tidak hadir"],["rsvpCountLabel","Label jumlah tamu"],["rsvpTimeLabel","Label jam kedatangan"],["rsvpMessageLabel","Label ucapan"],["rsvpMessagePlaceholder","Placeholder ucapan"],["rsvpSendButton","Teks tombol kirim"],["rsvpNote","Keterangan RSVP"],["rsvpMissingPhone","Pesan jika nomor panitia kosong"],["whatsappIntro","Kalimat pembuka WhatsApp"],["whatsappName","Label nama WhatsApp"],["whatsappStatus","Label status WhatsApp"],["whatsappCount","Label jumlah tamu WhatsApp"],["whatsappTime","Label jam WhatsApp"],["whatsappMessage","Label ucapan WhatsApp"],["whatsappThanks","Penutup pesan WhatsApp"]
 ]},
 {title:"Penutup dan pesan sistem",fields:[
  ["footerBlessing","Doa penutup"],["footerText","Kalimat penutup"],["footerThanks","Ucapan terima kasih"],["guestFallback","Nama tamu jika tidak dicantumkan"],["noMusicText","Pesan musik belum tersedia"],["photoErrorText","Pesan jika foto gagal tampil"],["createValidationText","Pesan validasi data"]
 ]}
];

function renderTextEditor() {
  const host = $("textEditor");
  TEXT_GROUPS.forEach((group,index) => {
    const details = document.createElement("details");
    details.className = "text-group";
    if (index === 0) details.open = true;
    const summary = document.createElement("summary");
    summary.textContent = group.title;
    details.appendChild(summary);
    const grid = document.createElement("div");
    grid.className = "text-field-grid";
    group.fields.forEach(([key,label]) => {
      const wrap = document.createElement("label");
      wrap.className = "text-field";
      const title = document.createElement("span");
      title.textContent = label;
      const multiline = ["introText","quoteText","arrivalText","giftText","rsvpNote","whatsappIntro","footerText","footerThanks","coverFooter","createValidationText"].includes(key);
      const control = document.createElement(multiline ? "textarea" : "input");
      control.name = `text_${key}`;
      control.value = (DEFAULT_INVITATION.texts && DEFAULT_INVITATION.texts[key]) || "";
      if (multiline) control.rows = 3;
      else control.type = "text";
      wrap.append(title,control);
      grid.appendChild(wrap);
    });
    details.appendChild(grid);
    host.appendChild(details);
  });
}
renderTextEditor();

function providerMeta(id) {
  return PROVIDERS.find(p => p.id === id) || PROVIDERS[0];
}
function addPaymentRow(existing={}) {
  const host = $("paymentRows");
  const row = document.createElement("div");
  row.className = "payment-row";
  row.dataset.provider = PROVIDERS.some(p => p.id === existing.provider) ? existing.provider : "BRI";

  const top = document.createElement("div");
  top.className = "payment-row-top";
  const rowTitle = document.createElement("strong");
  rowTitle.textContent = "Metode pembayaran";
  const remove = document.createElement("button");
  remove.type = "button";
  remove.className = "remove-payment";
  remove.textContent = "Hapus metode";
  remove.addEventListener("click", () => row.remove());
  top.append(rowTitle,remove);

  const providerGrid = document.createElement("div");
  providerGrid.className = "provider-grid";
  PROVIDERS.forEach(provider => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "provider-choice";
    btn.dataset.provider = provider.id;
    const mark = document.createElement("span");
    mark.className = "provider-mark";
    mark.textContent = provider.mark;
    mark.style.backgroundColor = provider.color;
    const label = document.createElement("span");
    label.className = "provider-label";
    label.textContent = provider.name;
    btn.append(mark,label);
    btn.addEventListener("click",() => {
      row.dataset.provider = provider.id;
      providerGrid.querySelectorAll(".provider-choice").forEach(b => b.classList.toggle("selected", b === btn));
      typeLabel.textContent = provider.type === "E-WALLET" ? "Nomor e-wallet" : "Nomor rekening";
      numberInput.placeholder = provider.type === "E-WALLET" ? "Nomor akun e-wallet" : "Nomor rekening bank";
    });
    if (provider.id === row.dataset.provider) btn.classList.add("selected");
    providerGrid.appendChild(btn);
  });

  const fieldGrid = document.createElement("div");
  fieldGrid.className = "payment-field-grid";
  const numberWrap = document.createElement("label");
  const typeLabel = document.createElement("span");
  typeLabel.textContent = providerMeta(row.dataset.provider).type === "E-WALLET" ? "Nomor e-wallet" : "Nomor rekening";
  const numberInput = document.createElement("input");
  numberInput.className = "payment-number";
  numberInput.type = "text";
  numberInput.inputMode = "numeric";
  numberInput.placeholder = "Nomor rekening / akun";
  numberInput.value = existing.accountNumber || "";
  numberWrap.append(typeLabel,numberInput);
  const ownerWrap = document.createElement("label");
  const ownerLabel = document.createElement("span");
  ownerLabel.textContent = "Nama pemilik";
  const ownerInput = document.createElement("input");
  ownerInput.className = "payment-owner";
  ownerInput.type = "text";
  ownerInput.placeholder = "Nama sesuai rekening";
  ownerInput.value = existing.accountHolder || "";
  ownerWrap.append(ownerLabel,ownerInput);
  fieldGrid.append(numberWrap,ownerWrap);
  row.append(top,providerGrid,fieldGrid);
  host.appendChild(row);
}
$("addPayment").addEventListener("click",() => addPaymentRow());
addPaymentRow();

function setPreview(previewId,statusId,dataUrl,status) {
  const preview = $(previewId);
  if (!dataUrl) {
    preview.removeAttribute("src");
    preview.hidden = true;
    $(statusId).textContent = status || "Belum ada foto.";
    return;
  }
  preview.onload = () => { preview.hidden = false; };
  preview.onerror = () => { preview.hidden = true; $(statusId).textContent = "Pratinjau tidak dapat dibuka. Pilih file lain."; };
  preview.src = dataUrl;
  preview.hidden = false;
  $(statusId).textContent = status || "Foto siap digunakan.";
}

function loadImageForCanvas(file) {
  return new Promise((resolve,reject) => {
    const objectUrl = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Gambar tidak dapat dibaca. Coba simpan ulang sebagai JPG atau PNG."));
    };
    image.src = objectUrl;
  });
}

async function compressImage(file) {
  if (!file || !file.type.startsWith("image/")) throw new Error("Pilih file gambar JPG, PNG, atau WebP.");
  if (file.size > 15 * 1024 * 1024) throw new Error("Foto melebihi 15 MB. Pilih foto yang lebih kecil.");
  let source;
  let width,height,draw;
  if ("createImageBitmap" in window) {
    try {
      source = await createImageBitmap(file);
      width = source.width; height = source.height;
      draw = (ctx,w,h) => ctx.drawImage(source,0,0,w,h);
    } catch (_) {}
  }
  if (!source) {
    source = await loadImageForCanvas(file);
    width = source.naturalWidth || source.width;
    height = source.naturalHeight || source.height;
    draw = (ctx,w,h) => ctx.drawImage(source,0,0,w,h);
  }
  const qualities = [0.72,0.62,0.52,0.43,0.35];
  let result = "";
  let maxSide = 820;
  for (let attempt=0; attempt<9; attempt++) {
    const scale = Math.min(1,maxSide/Math.max(width,height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1,Math.round(width*scale));
    canvas.height = Math.max(1,Math.round(height*scale));
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Browser tidak mendukung pemrosesan foto.");
    ctx.fillStyle="#fff"; ctx.fillRect(0,0,canvas.width,canvas.height);
    draw(ctx,canvas.width,canvas.height);
    for (const quality of qualities) {
      result = canvas.toDataURL("image/jpeg",quality);
      if (result.length <= 52000) break;
    }
    if (result.length <= 52000) break;
    maxSide = Math.round(maxSide*0.78);
  }
  if (source.close) source.close();
  if (!result || result.length > 62000) throw new Error("Ukuran foto masih terlalu besar setelah diperkecil. Coba potong atau pilih foto lain.");
  return result;
}
async function readAsDataUrl(file) {
  return await new Promise((resolve,reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("File tidak dapat dibaca."));
    reader.readAsDataURL(file);
  });
}

function bindImagePicker(inputId,hiddenName,previewId,statusId,label) {
  $(inputId).addEventListener("change",async()=>{
    const file=$(inputId).files && $(inputId).files[0];
    if(!file)return;
    $(statusId).textContent="Sedang memperkecil foto…";
    try {
      const dataUrl=await compressImage(file);
      field(hiddenName).value=dataUrl;
      setPreview(previewId,statusId,dataUrl,`${label}: ${file.name} · ${Math.round(dataUrl.length/1024)} KB`);
    } catch(error) {
      field(hiddenName).value="";
      setPreview(previewId,statusId,"",error.message || "Foto gagal diproses.");
      alert(error.message || "Foto gagal diproses.");
    }
  });
}
bindImagePicker("heroFile","heroImage","heroPreview","heroStatus","Foto pasangan");
bindImagePicker("groomFile","groomImage","groomPreview","groomStatus","Foto pria");
bindImagePicker("brideFile","brideImage","bridePreview","brideStatus","Foto wanita");

$("musicFile").addEventListener("change",async()=>{
  const file=$("musicFile").files && $("musicFile").files[0];
  if(!file)return;
  if(file.size > 100*1024) {
    alert("Pilih musik singkat maksimal 100 KB agar tautan undangan tidak terlalu panjang.");
    $("musicFile").value="";
    field("musicData").value="";
    $("musicStatus").textContent="Musik tidak dipilih. Maksimal 100 KB.";
    return;
  }
  try {
    field("musicData").value=await readAsDataUrl(file);
    $("musicStatus").textContent=`Musik dipilih: ${file.name} · ${Math.round(file.size/1024)} KB`;
  } catch(error) {
    field("musicData").value="";
    $("musicStatus").textContent=error.message;
  }
});

function eventMode() {
  const selected=form.querySelector('input[name="eventMode"]:checked');
  return selected ? selected.value : "akad_resepsi";
}
function updateEventMode() {
  const mode=eventMode();
  $("akadFields").hidden = mode === "resepsi_saja";
  $("receptionFields").hidden = mode === "akad_saja";
  const akadDate=field("akadDateInput"), recDate=field("receptionDateInput");
  if (mode === "akad_saja") {
    akadDate.required=true; recDate.required=false;
  } else if (mode === "resepsi_saja") {
    akadDate.required=false; recDate.required=true;
  } else {
    akadDate.required=true; recDate.required=true;
  }
}
form.querySelectorAll('input[name="eventMode"]').forEach(r=>r.addEventListener("change",updateEventMode));
updateEventMode();

function formatDate(dateStr) {
  if(!dateStr)return "";
  const date=new Date(`${dateStr}T12:00:00+07:00`);
  if(Number.isNaN(date.getTime()))return "";
  return new Intl.DateTimeFormat("id-ID",{weekday:"long",day:"numeric",month:"long",year:"numeric",timeZone:"Asia/Jakarta"}).format(date);
}
const formatTime=t=>t?`${t.slice(0,2)}.${t.slice(3,5)} WIB`:"";
const cleanPhone=v=>(v||"").replace(/\D/g,"");

function collectConfig() {
  const mode=eventMode();
  const akadDateISO=val("akadDateInput");
  const receptionDateISO=val("receptionDateInput");
  const targetDate=mode==="resepsi_saja" ? receptionDateISO : akadDateISO;
  const targetTime=mode==="resepsi_saja" ? val("guestArrivalInput") : val("akadTimeInput");
  const texts={};
  TEXT_GROUPS.forEach(group=>group.fields.forEach(([key])=>{
    const input=field(`text_${key}`);
    texts[key]=input ? String(input.value).trim() : (DEFAULT_INVITATION.texts[key] || "");
  }));
  // Preserve every known text key even if a new editor field is added later.
  Object.keys(DEFAULT_INVITATION.texts).forEach(key=>{
    if(texts[key]===undefined)texts[key]=DEFAULT_INVITATION.texts[key];
  });
  const bankAccounts=[...$("paymentRows").querySelectorAll(".payment-row")].map(row=>({
    provider:row.dataset.provider || "BRI",
    accountNumber:row.querySelector(".payment-number").value.trim(),
    accountHolder:row.querySelector(".payment-owner").value.trim()
  })).filter(a=>a.accountNumber);
  const arrivalSlots=val("arrivalSlotsRows").split(/\r?\n/).map(x=>x.trim()).filter(Boolean);
  const guestCountOptions=val("guestCountRows").split(/\r?\n/).map(x=>x.trim()).filter(Boolean);
  return {
    groom:val("groom"),bride:val("bride"),groomParents:val("groomParents"),brideParents:val("brideParents"),
    eventMode:mode,akadDateISO,receptionDateISO,akadDate:formatDate(akadDateISO),receptionDate:formatDate(receptionDateISO),
    akadTime:formatTime(val("akadTimeInput")),receptionTime:val("receptionTimeInput"),
    dateISO:targetDate ? `${targetDate}T${targetTime || "10:00"}:00+07:00` : "",
    dateLabel:formatDate(targetDate),guestArrival:formatTime(val("guestArrivalInput")),
    venueName:val("venueName"),venue:val("venue"),mapsUrl:val("mapsUrl"),
    whatsappNumber:cleanPhone(val("whatsappNumber")),
    heroImage:val("heroImage"),groomImage:val("groomImage"),brideImage:val("brideImage"),musicFile:val("musicData"),
    bankAccounts,texts,arrivalSlots:arrivalSlots.length?arrivalSlots:DEFAULT_INVITATION.arrivalSlots,
    guestCountOptions:guestCountOptions.length?guestCountOptions:DEFAULT_INVITATION.guestCountOptions
  };
}

function bytesToBase64Url(bytes) {
  let binary="";
  const chunk=0x6000;
  for(let i=0;i<bytes.length;i+=chunk)binary+=String.fromCharCode(...bytes.subarray(i,i+chunk));
  return btoa(binary).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/g,"");
}
async function makeInvitationLink(config,guest) {
  const json=JSON.stringify(config);
  const raw=new TextEncoder().encode(json);
  let packed=raw,compressed=false;
  if(typeof CompressionStream==="function") {
    try {
      const stream=new Blob([raw]).stream().pipeThrough(new CompressionStream("gzip"));
      packed=new Uint8Array(await new Response(stream).arrayBuffer());
      compressed=true;
    } catch(_) { packed=raw; compressed=false; }
  }
  const token=bytesToBase64Url(packed);
  const url=new URL("./index.html",location.href);
  const parts=new URLSearchParams();
  parts.set("v","8");parts.set("p",token);parts.set("z",compressed?"1":"0");
  if(guest)parts.set("to",guest);
  url.hash=parts.toString();
  return url.href;
}

function showMessage(text,type="info") {
  const el=$("formMessage");
  el.textContent=text;
  el.className=`form-message ${type}`;
  if(text)el.scrollIntoView({behavior:"smooth",block:"nearest"});
}
function validateBeforeBuild() {
  if(!val("groom"))return {ok:false,field:"groom",message:"Nama mempelai pria belum diisi."};
  if(!val("bride"))return {ok:false,field:"bride",message:"Nama mempelai wanita belum diisi."};
  const mode=eventMode();
  if(mode!=="resepsi_saja" && !val("akadDateInput"))return {ok:false,field:"akadDateInput",message:"Tanggal akad belum dipilih."};
  if(mode!=="akad_saja" && !val("receptionDateInput"))return {ok:false,field:"receptionDateInput",message:"Tanggal resepsi belum dipilih."};
  if(!val("guestArrivalInput"))return {ok:false,field:"guestArrivalInput",message:"Jam tamu diharapkan hadir belum dipilih."};
  return {ok:true};
}
function drafts() {
  try {const value=JSON.parse(localStorage.getItem(STORAGE_KEY)||"[]");return Array.isArray(value)?value:[];}
  catch(_){return [];}
}
function refreshDrafts() {
  const select=$("draftList");select.replaceChildren(new Option("Pilih draf tersimpan",""));
  drafts().forEach((draft,index)=>select.add(new Option(`${draft.title} · ${draft.savedAt}`,String(index))));
}
function saveDraft() {
  const config=collectConfig();
  if(!config.groom && !config.bride)return showMessage("Isi setidaknya salah satu nama sebelum menyimpan draf.","error");
  const title=`${config.groom || "Mempelai"} & ${config.bride || "Mempelai"}`;
  const list=drafts(),entry={title,config,savedAt:new Date().toLocaleString("id-ID")};
  const at=list.findIndex(x=>x.title===title);
  if(at>=0)list[at]=entry;else list.push(entry);
  try {
    localStorage.setItem(STORAGE_KEY,JSON.stringify(list));
    refreshDrafts();showMessage(`Draf ${title} tersimpan di browser/perangkat ini.`,"success");
  } catch(error) {
    showMessage("Penyimpanan browser penuh. Unduh JSON setelah membuat tautan sebagai cadangan.","error");
  }
}
function fillForm(config) {
  const set=(name,value)=>{const el=field(name);if(el && "value" in el)el.value=value ?? "";};
  ["groom","bride","groomParents","brideParents","akadDateISO","receptionDateISO","receptionTime","venueName","venue","mapsUrl","whatsappNumber"].forEach(key=>{
    const map={akadDateISO:"akadDateInput",receptionDateISO:"receptionDateInput"};
    set(map[key]||key,config[key]||"");
  });
  set("akadTimeInput",(config.akadTime||"08.00").replace(" WIB","").replace(".",":"));
  set("guestArrivalInput",(config.guestArrival||"10.00").replace(" WIB","").replace(".",":"));
  const radio=form.querySelector(`input[name="eventMode"][value="${config.eventMode || "akad_resepsi"}"]`);
  if(radio)radio.checked=true;
  updateEventMode();
  set("arrivalSlotsRows",(config.arrivalSlots||DEFAULT_INVITATION.arrivalSlots).join("\n"));
  set("guestCountRows",(config.guestCountOptions||DEFAULT_INVITATION.guestCountOptions).join("\n"));
  set("heroImage",config.heroImage||"");set("groomImage",config.groomImage||"");set("brideImage",config.brideImage||"");set("musicData",config.musicFile||"");
  setPreview("heroPreview","heroStatus",config.heroImage||"","Foto pasangan dari draf.");
  setPreview("groomPreview","groomStatus",config.groomImage||"","Foto mempelai pria dari draf.");
  setPreview("bridePreview","brideStatus",config.brideImage||"","Foto mempelai wanita dari draf.");
  if(config.musicFile)$("musicStatus").textContent="Musik dari draf siap digunakan.";
  else $("musicStatus").textContent="Belum ada musik.";
  $("paymentRows").replaceChildren();
  (config.bankAccounts||[]).forEach(addPaymentRow);
  if(!(config.bankAccounts||[]).length)addPaymentRow();
  TEXT_GROUPS.forEach(group=>group.fields.forEach(([key])=>{
    const el=field(`text_${key}`);
    if(el)el.value=(config.texts && config.texts[key]!==undefined)?config.texts[key]:(DEFAULT_INVITATION.texts[key]||"");
  }));
}
function downloadJson(config) {
  const blob=new Blob([JSON.stringify(config,null,2)],{type:"application/json"});
  const url=URL.createObjectURL(blob);
  const anchor=document.createElement("a");anchor.href=url;
  anchor.download=`undangan-${(config.groom+"-"+config.bride).toLowerCase().replace(/[^a-z0-9]+/g,"-")}.json`;
  document.body.appendChild(anchor);anchor.click();anchor.remove();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
}

form.addEventListener("submit",async event=>{
  event.preventDefault();
  const validation=validateBeforeBuild();
  if(!validation.ok) {
    showMessage(validation.message,"error");
    const control=field(validation.field);
    if(control){control.focus();control.scrollIntoView({behavior:"smooth",block:"center"});}
    return;
  }
  const button=$("makeLink");button.disabled=true;button.textContent="Sedang membuat tautan…";
  try {
    const config=collectConfig();
    const guest=val("guestName");
    const link=await makeInvitationLink(config,guest);
    $("generatedLink").value=link;
    $("resultPanel").hidden=false;
    const size=Math.round(new Blob([link]).size/1024);
    $("linkMessage").textContent=`Tautan berhasil dibuat (${size} KB). Simpan tautan dan unduh cadangan JSON.`;
    if(size>100) $("linkMessage").textContent+=" Catatan: tautan cukup panjang karena memuat foto/musik. Untuk berbagi yang lebih ringan, kurangi media atau host foto secara terpisah.";
    showMessage("Undangan berhasil dibuat. Buka pratinjau untuk memeriksa hasilnya.","success");
    $("resultPanel").scrollIntoView({behavior:"smooth",block:"center"});
    window.__lastInvitationConfig=config;
  } catch(error) {
    showMessage(`Gagal membuat tautan: ${error.message || error}`,"error");
  } finally {
    button.disabled=false;button.textContent="✦ Buat / Perbarui Undangan";
  }
});

$("saveDraft").addEventListener("click",saveDraft);
$("copyLink").addEventListener("click",async()=>{
  const text=$("generatedLink").value;
  if(!text)return showMessage("Buat undangan terlebih dahulu.","error");
  try {await navigator.clipboard.writeText(text);$("linkMessage").textContent="Tautan berhasil disalin.";}
  catch(_) {$("generatedLink").focus();$("generatedLink").select();$("linkMessage").textContent="Tautan sudah dipilih. Tekan Ctrl+C untuk menyalin.";}
});
$("openPreview").addEventListener("click",()=>{
  const link=$("generatedLink").value;
  if(!link)return showMessage("Buat undangan terlebih dahulu.","error");
  window.open(link,"_blank","noopener,noreferrer");
});
$("downloadJson").addEventListener("click",()=>{
  const config=window.__lastInvitationConfig || collectConfig();
  downloadJson(config);
});
$("loadDraft").addEventListener("click",()=>{
  const index=Number($("draftList").value),list=drafts();
  if(!Number.isInteger(index)||!list[index])return showMessage("Pilih draf terlebih dahulu.","error");
  fillForm(list[index].config);showMessage(`Draf ${list[index].title} berhasil dimuat.`,"success");
});
$("deleteDraft").addEventListener("click",()=>{
  const index=Number($("draftList").value),list=drafts();
  if(!Number.isInteger(index)||!list[index])return showMessage("Pilih draf yang akan dihapus.","error");
  list.splice(index,1);localStorage.setItem(STORAGE_KEY,JSON.stringify(list));refreshDrafts();showMessage("Draf berhasil dihapus.","success");
});
$("importJson").addEventListener("change",async()=>{
  const file=$("importJson").files && $("importJson").files[0];if(!file)return;
  try {
    const data=JSON.parse(await file.text());
    fillForm(data);showMessage("Cadangan JSON berhasil dimuat. Periksa lalu buat tautan baru.","success");
  } catch(_) {showMessage("File JSON tidak valid atau rusak.","error");}
});
refreshDrafts();
})();
