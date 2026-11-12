(() => {
  const form = document.getElementById("builderForm");
  const resultPanel = document.getElementById("resultPanel");
  const output = document.getElementById("generatedLink");
  const resultMessage = document.getElementById("resultMessage");
  const STORAGE_KEY = "undanganMadura.savedEvents.v2";
  let currentConfig = null;
  const get = (name) => form.elements.namedItem(name);
  const val = (name) => (get(name)?.value || "").trim();
  const DEFAULT_TEXTS = (typeof DEFAULT_INVITATION !== "undefined" && DEFAULT_INVITATION.texts) ? DEFAULT_INVITATION.texts : {};

  const TEXT_GROUPS = [
    {title:"Sampul dan navigasi", fields:[
      ["coverEyebrow","Tulisan kecil sampul"],["coverSalutation","Salam pembuka Arab"],["guestFallback","Nama tamu bawaan jika tautan tanpa nama"],["coverRecipientPrefix","Awalan nama tamu"],["coverRecipientSuffix","Tulisan di bawah nama tamu"],["openButton","Teks tombol buka undangan"],["coverFootnote","Kalimat kecil sampul"],["navBrand","Nama pada navigasi"],["musicButton","Tombol musik"],["musicOffButton","Tombol saat musik aktif"]]},
    {title:"Bagian pembuka dan mempelai", fields:[
      ["heroBlessing","Doa di bagian pembuka"],["heroEyebrow","Judul kecil pembuka"],["photoPlaceholderTitle","Tulisan jika foto belum dipasang"],["photoPlaceholderNote","Petunjuk foto"],["introParagraph","Paragraf pengantar"],["coupleEyebrow","Judul kecil bagian mempelai"],["coupleTitle","Judul bagian mempelai"],["groomLabel","Label mempelai pria"],["brideLabel","Label mempelai wanita"],["quranQuote","Kutipan ayat"],["quranSource","Sumber kutipan"]]},
    {title:"Acara dan lokasi", fields:[
      ["eventsEyebrow","Judul kecil bagian acara"],["eventsTitle","Judul bagian acara"],["akadEyebrow","Label kecil akad"],["akadTitle","Nama acara akad"],["receptionEyebrow","Label kecil resepsi"],["receptionTitle","Nama acara resepsi"],["arrivalEyebrow","Judul jam kehadiran"],["arrivalDescription","Keterangan jam kehadiran"],["venueEyebrow","Judul lokasi"],["mapsButton","Teks tombol Google Maps"]]},
    {title:"Hitung mundur dan hadiah", fields:[
      ["countdownEyebrow","Judul kecil hitung mundur"],["countdownTitle","Judul hitung mundur"],["countdownDays","Label hari"],["countdownHours","Label jam"],["countdownMinutes","Label menit"],["countdownSeconds","Label detik"],["giftEyebrow","Judul kecil hadiah"],["giftTitle","Judul hadiah"],["giftIntro","Keterangan hadiah/rekening"],["accountHolderPrefix","Awalan nama pemilik rekening"],["copyAccountButton","Teks tombol salin rekening"],["copyMissingMessage","Pesan jika rekening kosong"],["copySuccessMessage","Pesan setelah nomor disalin"],["copyFailedMessage","Pesan jika salin otomatis gagal"],["musicMissingMessage","Pesan jika musik belum diatur"],["musicErrorMessage","Pesan jika musik gagal diputar"]]},
    {title:"Konfirmasi kehadiran (RSVP)", fields:[
      ["rsvpEyebrow","Judul kecil RSVP"],["rsvpTitle","Judul RSVP"],["rsvpNameLabel","Label nama tamu"],["rsvpNamePlaceholder","Contoh/placeholder nama"],["rsvpAttendanceLabel","Label konfirmasi"],["rsvpAttendOption","Pilihan hadir"],["rsvpAbsentOption","Pilihan tidak hadir"],["rsvpGuestCountLabel","Label jumlah tamu"],["rsvpArrivalLabel","Label jam kedatangan"],["rsvpMessageLabel","Label ucapan dan doa"],["rsvpMessagePlaceholder","Placeholder ucapan"],["rsvpSubmitButton","Teks tombol kirim"],["rsvpNote","Keterangan di bawah formulir"],["whatsappMissingMessage","Pesan jika WhatsApp panitia kosong"],["rsvpWhatsappIntro","Kalimat pembuka pesan WhatsApp"],["rsvpWhatsappName","Label nama pada pesan WhatsApp"],["rsvpWhatsappAttendance","Label status kehadiran pada pesan WhatsApp"],["rsvpWhatsappGuestCount","Label jumlah tamu pada pesan WhatsApp"],["rsvpWhatsappArrival","Label perkiraan kedatangan pada pesan WhatsApp"],["rsvpWhatsappMessage","Label ucapan pada pesan WhatsApp"],["rsvpWhatsappThanks","Kalimat penutup pesan WhatsApp"]]},
    {title:"Penutup undangan", fields:[
      ["footerBlessing","Doa penutup Arab"],["footerMessage","Paragraf penutup"],["footerThanks","Ucapan terima kasih"]]}
  ];

  function renderTextEditor() {
    const host = document.getElementById("textEditor");
    TEXT_GROUPS.forEach((group, groupIndex) => {
      const details = document.createElement("details");
      details.open = groupIndex === 0;
      const summary = document.createElement("summary");
      summary.textContent = group.title;
      details.appendChild(summary);
      const grid = document.createElement("div");
      grid.className = "form-grid";
      group.fields.forEach(([key,label]) => {
        const wrap = document.createElement("label");
        wrap.textContent = label;
        const field = (key === "introParagraph" || key === "quranQuote" || key === "giftIntro" || key === "arrivalDescription" || key === "rsvpNote" || key === "footerMessage" || key === "rsvpWhatsappIntro") ? document.createElement("textarea") : document.createElement("input");
        field.name = `text_${key}`;
        field.value = DEFAULT_TEXTS[key] || "";
        if (field.tagName === "TEXTAREA") field.rows = 3;
        else field.type = "text";
        wrap.appendChild(field);
        grid.appendChild(wrap);
      });
      details.appendChild(grid);
      host.appendChild(details);
    });
  }
  renderTextEditor();
  if (get("arrivalSlotsRows")) get("arrivalSlotsRows").value = (DEFAULT_INVITATION.arrivalSlots || []).join("\n");
  if (get("guestCountRows")) get("guestCountRows").value = (DEFAULT_INVITATION.guestCountOptions || ["1","2","3","4","5"]).join("\n");

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(`${dateString}T12:00:00+07:00`);
    return new Intl.DateTimeFormat("id-ID", { weekday:"long", day:"numeric", month:"long", year:"numeric", timeZone:"Asia/Jakarta" }).format(date);
  };
  const formatTime = (time) => time ? `${time.slice(0,2)}.${time.slice(3,5)} WIB` : "";
  const safePhone = (phone) => phone.replace(/\D/g, "");

  function collectConfig() {
    const eventDate = val("eventDate");
    const akadTimeInput = val("akadTimeInput") || "08:00";
    const dateLabel = formatDate(eventDate) || "Hari, tanggal pernikahan";
    const dateISO = `${eventDate}T${akadTimeInput}:00+07:00`;
    const texts = {};
    TEXT_GROUPS.forEach(group => group.fields.forEach(([key]) => { texts[key] = val(`text_${key}`); }));
    return {
      groom:val("groom"), bride:val("bride"), groomParents:val("groomParents"), brideParents:val("brideParents"),
      dateLabel, dateISO, akadDate:dateLabel, akadTime:formatTime(akadTimeInput), receptionDate:dateLabel,
      receptionTime:val("receptionTimeInput"), guestArrival:formatTime(val("guestArrivalInput")),
      venue:val("venue"), mapsUrl:val("mapsUrl") || "https://maps.google.com/", whatsappNumber:safePhone(val("whatsappNumber")),
      bankName:val("bankName"), accountNumber:val("accountNumber"), accountHolder:val("accountHolder"),
      heroImage:val("heroImage"), musicFile:val("musicFile"), texts,
      arrivalSlots:val("arrivalSlotsRows").split(/\r?\n/).map(s=>s.trim()).filter(Boolean),
      guestCountOptions:val("guestCountRows").split(/\r?\n/).map(s=>s.trim()).filter(Boolean)
    };
  }
  function buildLink(config,guest="") {
    const url = new URL("./index.html",window.location.href);
    url.searchParams.set("data",JSON.stringify(config));
    if(guest) url.searchParams.set("to",guest);
    return url.href;
  }
  function readSaved(){try{const x=JSON.parse(localStorage.getItem(STORAGE_KEY)||"[]");return Array.isArray(x)?x:[];}catch(_){return[];}}
  function refreshSavedList(){
    const select=document.getElementById("savedList"),saved=readSaved();
    select.innerHTML='<option value="">Pilih data undangan tersimpan</option>';
    saved.forEach((item,index)=>{const o=document.createElement("option");o.value=String(index);o.textContent=`${item.title} · ${item.savedAt}`;select.appendChild(o);});
  }
  function fillForm(c){
    const v={groom:c.groom,bride:c.bride,groomParents:c.groomParents,brideParents:c.brideParents,
      eventDate:(c.dateISO||"").slice(0,10),akadTimeInput:(c.dateISO||"").slice(11,16)||"08:00",
      receptionTimeInput:c.receptionTime,guestArrivalInput:(c.guestArrival||"10.00").replace(" WIB","").replace(".",":"),
      venue:c.venue,mapsUrl:c.mapsUrl,whatsappNumber:c.whatsappNumber,bankName:c.bankName,accountNumber:c.accountNumber,
      accountHolder:c.accountHolder,heroImage:c.heroImage,musicFile:c.musicFile,
      arrivalSlotsRows:(c.arrivalSlots||[]).join("\n"),guestCountRows:(c.guestCountOptions||[]).join("\n")};
    Object.entries(v).forEach(([k,value])=>{if(get(k))get(k).value=value||"";});
    TEXT_GROUPS.forEach(g=>g.fields.forEach(([key])=>{if(get(`text_${key}`))get(`text_${key}`).value=(c.texts&&c.texts[key]!==undefined)?c.texts[key]:(DEFAULT_TEXTS[key]||"");}));
  }
  form.addEventListener("submit",e=>{
    e.preventDefault();if(!form.reportValidity())return;
    currentConfig=collectConfig();output.value=buildLink(currentConfig,val("guestName"));resultPanel.hidden=false;
    resultMessage.textContent="Tautan berhasil dibuat. Ubah nama tamu lalu buat tautan lagi untuk penerima lainnya.";
    resultPanel.scrollIntoView({behavior:"smooth",block:"center"});
  });
  document.getElementById("copyLink").addEventListener("click",async()=>{
    if(!output.value)return;
    try{await navigator.clipboard.writeText(output.value);resultMessage.textContent="Tautan berhasil disalin. Silakan bagikan melalui WhatsApp.";}
    catch(_){output.focus();output.select();resultMessage.textContent="Tautan dipilih. Tekan Ctrl+C untuk menyalin.";}
  });
  document.getElementById("openPreview").addEventListener("click",()=>{if(output.value)window.open(output.value,"_blank","noopener,noreferrer");});
  document.getElementById("downloadData").addEventListener("click",()=>{
    if(!currentConfig)return;
    const blob=new Blob([JSON.stringify(currentConfig,null,2)],{type:"application/json"}),url=URL.createObjectURL(blob),a=document.createElement("a");
    a.href=url;a.download=`data-undangan-${slug(currentConfig.groom)}-${slug(currentConfig.bride)}.json`;a.click();URL.revokeObjectURL(url);
  });
  document.getElementById("saveDraft").addEventListener("click",()=>{
    if(!form.reportValidity())return;
    const c=collectConfig(),saved=readSaved(),title=`${c.groom} & ${c.bride}`,entry={title,config:c,savedAt:new Date().toLocaleString("id-ID")};
    const existing=saved.findIndex(x=>x.title===title);if(existing>=0)saved[existing]=entry;else saved.push(entry);
    try{localStorage.setItem(STORAGE_KEY,JSON.stringify(saved));refreshSavedList();resultMessage.textContent=`Data ${title} disimpan pada browser ini.`;resultPanel.hidden=false;}
    catch(_){alert("Penyimpanan browser penuh atau tidak tersedia. Unduh data JSON sebagai cadangan.");}
  });
  document.getElementById("loadDraft").addEventListener("click",()=>{
    const i=Number(document.getElementById("savedList").value),s=readSaved();if(!Number.isInteger(i)||!s[i])return alert("Pilih data undangan terlebih dahulu.");
    fillForm(s[i].config);resultMessage.textContent=`Data ${s[i].title} dimuat.`;resultPanel.hidden=false;
  });
  document.getElementById("deleteDraft").addEventListener("click",()=>{
    const select=document.getElementById("savedList"),i=Number(select.value),s=readSaved();if(!Number.isInteger(i)||!s[i])return alert("Pilih data undangan yang akan dihapus.");
    s.splice(i,1);localStorage.setItem(STORAGE_KEY,JSON.stringify(s));refreshSavedList();resultMessage.textContent="Data undangan dihapus dari penyimpanan browser ini.";
  });
  function slug(v){return(v||"undangan").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").slice(0,35)||"undangan";}
  refreshSavedList();
})();
