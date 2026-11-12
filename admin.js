(() => {
  "use strict";
  const form = document.getElementById("builderForm");
  const $ = id => document.getElementById(id);
  const get = name => form.elements.namedItem(name);
  const value = name => (get(name)?.value || "").trim();
  const STORAGE_KEY = "undanganMadura.v6.drafts";
  let currentConfig = null;
  let currentPreviewUrl = "";

  const BANKS = [
    ["BRI","Bank BRI"],["BCA","Bank BCA"],["BNI","Bank BNI"],["MANDIRI","Bank Mandiri"],
    ["BSI","Bank Syariah Indonesia"],["BTN","Bank BTN"],["CIMB","CIMB Niaga"],
    ["PERMATA","PermataBank"],["DANAMON","Bank Danamon"],["JATIM","Bank Jatim"],
    ["DANA","DANA"],["OVO","OVO"],["GOPAY","GoPay"],["SHOPEEPAY","ShopeePay"],["LINKAJA","LinkAja"]
  ];

  const TEXT_GROUPS = [
    {title:"Sampul dan navigasi",fields:[
      ["coverEyebrow","Tulisan kecil sampul"],["coverSalutation","Salam Arab sampul"],["coverRecipientPrefix","Awalan nama tamu"],["coverRecipientSuffix","Tulisan bawah nama tamu"],["openButton","Teks tombol buka"],["coverFootnote","Kalimat kecil sampul"],["navBrand","Nama navigasi"],["musicButton","Tombol musik"],["musicOffButton","Tombol saat musik aktif"]]},
    {title:"Foto pembuka dan pengantar",fields:[
      ["heroTopline","Tulisan kecil pada foto pasangan"],["heroDateLabel","Label tanggal pada foto pasangan"],["photoPlaceholderTitle","Tulisan jika foto belum dipilih"],["photoPlaceholderNote","Keterangan jika foto belum dipilih"],["introSalutation","Salam pengantar"],["heroBlessing","Doa pembuka Arab"],["introParagraph","Paragraf pengantar"]]},
    {title:"Profil kedua mempelai",fields:[
      ["coupleEyebrow","Tulisan kecil profil"],["coupleTitle","Judul profil"],["groomLabel","Label mempelai pria"],["brideLabel","Label mempelai wanita"],["quranQuote","Kutipan ayat"],["quranSource","Sumber kutipan"]]},
    {title:"Acara dan lokasi",fields:[
      ["eventsEyebrow","Tulisan kecil acara"],["eventsTitle","Judul rangkaian acara"],["akadEyebrow","Label kecil akad"],["akadTitle","Nama acara akad"],["receptionEyebrow","Label kecil resepsi"],["receptionTitle","Nama acara resepsi"],["arrivalEyebrow","Judul jam kehadiran"],["arrivalDescription","Keterangan jam kehadiran"],["venueEyebrow","Judul lokasi"],["venueAddressLabel","Label alamat"],["mapsButton","Teks tombol Google Maps"]]},
    {title:"Hitung mundur dan hadiah",fields:[
      ["countdownEyebrow","Tulisan kecil countdown"],["countdownTitle","Judul countdown"],["countdownDays","Label hari"],["countdownHours","Label jam"],["countdownMinutes","Label menit"],["countdownSeconds","Label detik"],["giftEyebrow","Tulisan kecil hadiah"],["giftTitle","Judul hadiah"],["giftIntro","Keterangan hadiah"],["accountHolderPrefix","Awalan nama pemilik"],["accountNumberLabel","Label nomor rekening"],["copyAccountButton","Teks tombol salin"],["copyMissingMessage","Pesan rekening kosong"],["copySuccessMessage","Pesan setelah disalin"],["copyFailedMessage","Pesan jika gagal menyalin"]]},
    {title:"Konfirmasi kehadiran",fields:[
      ["rsvpEyebrow","Tulisan kecil RSVP"],["rsvpTitle","Judul RSVP"],["rsvpNameLabel","Label nama"],["rsvpNamePlaceholder","Placeholder nama"],["rsvpAttendanceLabel","Label kehadiran"],["rsvpAttendOption","Pilihan hadir"],["rsvpAbsentOption","Pilihan tidak hadir"],["rsvpGuestCountLabel","Label jumlah tamu"],["rsvpArrivalLabel","Label jam kedatangan"],["rsvpMessageLabel","Label ucapan"],["rsvpMessagePlaceholder","Placeholder ucapan"],["rsvpSubmitButton","Teks tombol kirim"],["rsvpNote","Keterangan RSVP"],["whatsappMissingMessage","Pesan jika nomor WhatsApp kosong"],["rsvpWhatsappIntro","Kalimat awal WhatsApp"],["rsvpWhatsappName","Label nama WhatsApp"],["rsvpWhatsappAttendance","Label status WhatsApp"],["rsvpWhatsappGuestCount","Label jumlah tamu WhatsApp"],["rsvpWhatsappArrival","Label jam kedatangan WhatsApp"],["rsvpWhatsappMessage","Label ucapan WhatsApp"],["rsvpWhatsappThanks","Penutup pesan WhatsApp"]]},
    {title:"Penutup",fields:[
      ["footerBlessing","Doa penutup Arab"],["footerMessage","Kalimat penutup"],["footerThanks","Ucapan terima kasih"]]},
    {title:"Pesan sistem",fields:[
      ["guestFallback","Nama tamu jika tidak dicantumkan"],["musicMissingMessage","Pesan musik belum tersedia"],["musicErrorMessage","Pesan musik gagal diputar"]]}
  ];

  function renderTextFields() {
    const host = $("textEditor");
    TEXT_GROUPS.forEach((group, index) => {
      const details = document.createElement("details");
      details.open = index === 0;
      const summary = document.createElement("summary");
      summary.textContent = group.title;
      details.appendChild(summary);
      const grid = document.createElement("div");
      grid.className = "form-grid text-grid";
      group.fields.forEach(([key,label]) => {
        const wrap = document.createElement("label");
        wrap.textContent = label;
        const multiline = /Paragraph|Quote|Intro|Message|Thanks|Note|Description|Blessing|Salutation|Footnote|Keterangan|Kalimat|doa|Arab|Penutup/i.test(key + " " + label);
        const field = document.createElement(multiline ? "textarea" : "input");
        field.name = `text_${key}`;
        field.value = DEFAULT_INVITATION.texts[key] || "";
        if (multiline) field.rows = 3;
        field.type = "text";
        wrap.appendChild(field);
        grid.appendChild(wrap);
      });
      details.appendChild(grid);
      host.appendChild(details);
    });
  }
  renderTextFields();

  function addBankRow(account={provider:"BRI",accountNumber:"",accountHolder:""}) {
    const host = $("bankAccountList");
    const row = document.createElement("div");
    row.className = "bank-account-row";
    const providerLabel = document.createElement("label");
    providerLabel.textContent = "Pilih bank / e-wallet";
    const select = document.createElement("select");
    select.className = "bank-provider";
    BANKS.forEach(([id,label]) => {
      const o = document.createElement("option");
      o.value = id; o.textContent = label;
      select.appendChild(o);
    });
    select.value = BANKS.some(b=>b[0]===account.provider) ? account.provider : "BRI";
    providerLabel.appendChild(select);
    const numberLabel = document.createElement("label");
    numberLabel.textContent = "Nomor rekening / akun";
    const number = document.createElement("input");
    number.className = "bank-number"; number.placeholder = "Masukkan nomor rekening"; number.inputMode = "numeric"; number.value = account.accountNumber || "";
    numberLabel.appendChild(number);
    const holderLabel = document.createElement("label");
    holderLabel.textContent = "Nama pemilik";
    const holder = document.createElement("input");
    holder.className = "bank-holder"; holder.placeholder = "Nama sesuai rekening"; holder.value = account.accountHolder || "";
    holderLabel.appendChild(holder);
    const remove = document.createElement("button");
    remove.type = "button"; remove.className = "danger remove-bank"; remove.textContent = "Hapus";
    remove.addEventListener("click", () => row.remove());
    row.append(providerLabel, numberLabel, holderLabel, remove);
    host.appendChild(row);
  }
  $("addBankAccount").addEventListener("click", () => addBankRow());

  async function compressPhoto(file) {
    if (!file || !file.type.startsWith("image/")) throw new Error("File bukan gambar.");
    if (file.size > 12 * 1024 * 1024) throw new Error("Ukuran foto lebih dari 12 MB.");
    const objectUrl = URL.createObjectURL(file);
    const preview = $("photoPreview");
    preview.src = objectUrl;
    preview.hidden = false;
    if (currentPreviewUrl) URL.revokeObjectURL(currentPreviewUrl);
    currentPreviewUrl = objectUrl;

    let bitmap;
    if (window.createImageBitmap) {
      bitmap = await createImageBitmap(file);
    } else {
      bitmap = await new Promise((resolve,reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = objectUrl;
      });
    }
    let maxSide = 900;
    const qualities = [0.72,0.62,0.54,0.46,0.40,0.34];
    let result = "";
    for (let attempt=0; attempt<9; attempt++) {
      const scale = Math.min(1,maxSide/Math.max(bitmap.width,bitmap.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1,Math.round(bitmap.width*scale));
      canvas.height = Math.max(1,Math.round(bitmap.height*scale));
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#ffffff"; ctx.fillRect(0,0,canvas.width,canvas.height);
      ctx.drawImage(bitmap,0,0,canvas.width,canvas.height);
      for (const q of qualities) {
        result = canvas.toDataURL("image/jpeg",q);
        if (result.length <= 95000) break;
      }
      if (result.length <= 95000) break;
      maxSide = Math.round(maxSide*0.82);
    }
    bitmap.close?.();
    if (!result || result.length > 115000) throw new Error("Foto terlalu besar setelah diperkecil. Pilih foto lain atau potong terlebih dahulu.");
    $("photoStatus").textContent = `Foto dipilih: ${file.name}. Ukuran tautan foto sekitar ${Math.round(result.length/1024)} KB.`;
    return result;
  }

  function readAsDataUrl(file) {
    return new Promise((resolve,reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
  }

  $("photoPicker").addEventListener("change", async () => {
    const file = $("photoPicker").files?.[0];
    if (!file) return;
    try {
      get("heroImage").value = await compressPhoto(file);
      $("photoStatus").textContent += " Pratinjau di atas menggunakan file pilihan dari perangkat.";
    } catch (error) {
      get("heroImage").value = "";
      $("photoPreview").hidden = true;
      $("photoStatus").textContent = error.message || "Foto tidak dapat diproses.";
      alert($("photoStatus").textContent);
    }
  });

  $("musicPicker").addEventListener("change", async () => {
    const file = $("musicPicker").files?.[0];
    if (!file) return;
    if (file.size > 95 * 1024) {
      alert("Agar tautan tidak terlalu panjang, pilih musik pendek maksimal 95 KB atau kosongkan musik.");
      $("musicPicker").value = "";
      return;
    }
    try {
      get("musicFile").value = await readAsDataUrl(file);
      $("musicStatus").textContent = `Musik dipilih: ${file.name} (${Math.round(file.size/1024)} KB).`;
    } catch (_) {
      $("musicStatus").textContent = "File musik tidak dapat dibaca.";
    }
  });

  function dateLabel(dateString) {
    if (!dateString) return "";
    return new Intl.DateTimeFormat("id-ID",{weekday:"long",day:"numeric",month:"long",year:"numeric",timeZone:"Asia/Jakarta"})
      .format(new Date(`${dateString}T12:00:00+07:00`));
  }
  const formatTime = t => t ? `${t.slice(0,2)}.${t.slice(3,5)} WIB` : "";
  const cleanPhone = v => (v || "").replace(/\D/g,"");

  function collectConfig() {
    const mode = value("eventMode") || "akad_resepsi";
    const receptionDateStr = value("receptionDateInput");
    const akadDateStr = value("akadDateInput") || receptionDateStr;
    const mainDate = mode === "resepsi_saja" ? receptionDateStr : (akadDateStr || receptionDateStr);
    const timeForCountdown = mode === "resepsi_saja" ? (value("guestArrivalInput") || "10:00") : (value("akadTimeInput") || "08:00");
    const texts = {};
    TEXT_GROUPS.forEach(group => group.fields.forEach(([key]) => { texts[key] = value(`text_${key}`); }));
    const accounts = [...$("bankAccountList").querySelectorAll(".bank-account-row")].map(row => ({
      provider: row.querySelector(".bank-provider").value,
      accountNumber: row.querySelector(".bank-number").value.trim(),
      accountHolder: row.querySelector(".bank-holder").value.trim()
    })).filter(a => a.accountNumber);
    return {
      groom:value("groom"), bride:value("bride"), groomParents:value("groomParents"), brideParents:value("brideParents"),
      eventMode:mode,
      dateLabel:dateLabel(mainDate) || "Hari, tanggal pernikahan",
      dateISO:`${mainDate}T${timeForCountdown}:00+07:00`,
      akadDate:dateLabel(akadDateStr) || dateLabel(mainDate),
      akadTime:formatTime(value("akadTimeInput") || "08:00"),
      receptionDate:dateLabel(receptionDateStr) || dateLabel(mainDate),
      receptionTime:value("receptionTimeInput"),
      guestArrival:formatTime(value("guestArrivalInput")),
      venueName:value("venueName"), venue:value("venue"),
      mapsUrl:value("mapsUrl") || "https://maps.google.com/",
      whatsappNumber:cleanPhone(value("whatsappNumber")),
      heroImage:value("heroImage"), musicFile:value("musicFile"),
      bankAccounts:accounts, texts,
      arrivalSlots:value("arrivalSlotsRows").split(/\r?\n/).map(s=>s.trim()).filter(Boolean),
      guestCountOptions:value("guestCountRows").split(/\r?\n/).map(s=>s.trim()).filter(Boolean)
    };
  }

  function makeLink(config, guestName="") {
    const url = new URL("./index.html",location.href);
    url.searchParams.set("data",JSON.stringify(config));
    if (guestName) url.searchParams.set("to",guestName);
    return url.href;
  }

  function drafts() {
    try { const x=JSON.parse(localStorage.getItem(STORAGE_KEY)||"[]"); return Array.isArray(x)?x:[]; }
    catch (_) { return []; }
  }
  function refreshDrafts() {
    const select=$("savedList"), list=drafts();
    select.replaceChildren(new Option("Pilih draf tersimpan",""));
    list.forEach((entry,i)=>select.add(new Option(`${entry.title} • ${entry.savedAt}`,String(i))));
  }

  function fillForm(config) {
    const values = {
      groom:config.groom, bride:config.bride, groomParents:config.groomParents, brideParents:config.brideParents,
      eventMode:config.eventMode || "akad_resepsi",
      akadDateInput:(config.akadDate && config.akadDate.length===10)?config.akadDate:(config.dateISO||"").slice(0,10),
      receptionDateInput:(config.receptionDate && config.receptionDate.length===10)?config.receptionDate:(config.dateISO||"").slice(0,10),
      akadTimeInput:(config.akadTime||"08.00").replace(" WIB","").replace(".",":"),
      receptionTimeInput:config.receptionTime,
      guestArrivalInput:(config.guestArrival||"10.00").replace(" WIB","").replace(".",":"),
      venueName:config.venueName, venue:config.venue, mapsUrl:config.mapsUrl, whatsappNumber:config.whatsappNumber,
      heroImage:config.heroImage, musicFile:config.musicFile,
      arrivalSlotsRows:(config.arrivalSlots||[]).join("\n"),
      guestCountRows:(config.guestCountOptions||[]).join("\n")
    };
    Object.entries(values).forEach(([k,v]) => { if(get(k)) get(k).value=v||""; });
    $("bankAccountList").replaceChildren();
    (config.bankAccounts||[]).forEach(account=>addBankRow(account));
    if(config.heroImage){$("photoPreview").src=config.heroImage;$("photoPreview").hidden=false;$("photoStatus").textContent="Pratinjau foto dari data draf.";}
    TEXT_GROUPS.forEach(group=>group.fields.forEach(([key])=>{if(get(`text_${key}`))get(`text_${key}`).value=(config.texts && config.texts[key]!==undefined)?config.texts[key]:(DEFAULT_INVITATION.texts[key]||"");}));
  }

  function slug(v) {
    return (v||"undangan").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").slice(0,35)||"undangan";
  }
  function saveAsJson(config) {
    const blob = new Blob([JSON.stringify(config,null,2)],{type:"application/json"});
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href=url; link.download=`data-undangan-${slug(config.groom)}-${slug(config.bride)}.json`;
    link.click(); URL.revokeObjectURL(url);
  }

  form.addEventListener("submit", event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    currentConfig = collectConfig();
    const guest = value("guestName");
    const link = makeLink(currentConfig,guest);
    $("generatedLink").value=link;
    $("resultPanel").hidden=false;
    const sizeKb = Math.round(new Blob([link]).size/1024);
    $("resultMessage").textContent = `Tautan berhasil dibuat (${sizeKb} KB). Simpan tautan ini; data pasangan sudah ikut di dalamnya.`;
    if (link.length>180000) $("resultMessage").textContent += " Perhatian: tautan sangat panjang. Kurangi ukuran foto atau hilangkan musik agar lebih mudah dibagikan.";
    $("resultPanel").scrollIntoView({behavior:"smooth",block:"center"});
  });

  $("copyLink").addEventListener("click",async()=>{
    if(!$("generatedLink").value)return;
    try { await navigator.clipboard.writeText($("generatedLink").value); $("resultMessage").textContent="Tautan berhasil disalin. Bagikan melalui WhatsApp."; }
    catch (_) { $("generatedLink").focus();$("generatedLink").select();$("resultMessage").textContent="Tautan dipilih. Tekan Ctrl+C untuk menyalin."; }
  });
  $("openPreview").addEventListener("click",()=>{if($("generatedLink").value)window.open($("generatedLink").value,"_blank","noopener,noreferrer");});
  $("downloadData").addEventListener("click",()=>{if(currentConfig)saveAsJson(currentConfig);});
  $("saveDraft").addEventListener("click",()=>{
    if(!form.reportValidity())return;
    const config=collectConfig();
    const title=`${config.groom} & ${config.bride}`;
    const list=drafts();
    const entry={title,config,savedAt:new Date().toLocaleString("id-ID")};
    const index=list.findIndex(x=>x.title===title);
    if(index>=0)list[index]=entry;else list.push(entry);
    try {localStorage.setItem(STORAGE_KEY,JSON.stringify(list));refreshDrafts();$("resultMessage").textContent=`Draf ${title} disimpan di perangkat ini.`;$("resultPanel").hidden=false;}
    catch (_) {alert("Penyimpanan browser penuh. Unduh JSON sebagai cadangan.");}
  });
  $("loadDraft").addEventListener("click",()=>{
    const index=Number($("savedList").value),list=drafts();
    if(!Number.isInteger(index)||!list[index])return alert("Pilih draf terlebih dahulu.");
    fillForm(list[index].config);
    $("resultMessage").textContent=`Draf ${list[index].title} dimuat.`;
    $("resultPanel").hidden=false;
  });
  $("deleteDraft").addEventListener("click",()=>{
    const index=Number($("savedList").value),list=drafts();
    if(!Number.isInteger(index)||!list[index])return alert("Pilih draf yang akan dihapus.");
    list.splice(index,1);
    localStorage.setItem(STORAGE_KEY,JSON.stringify(list));
    refreshDrafts();
  });

  $("eventMode").addEventListener("change",()=>{
    const onlyReception=$("eventMode").value==="resepsi_saja";
    $("akadDateWrap").hidden=onlyReception;
    $("akadTimeWrap").hidden=onlyReception;
  });
  $("eventMode").dispatchEvent(new Event("change"));
  $("addBankAccount").click();
  refreshDrafts();
})();
