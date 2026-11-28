import React, { useEffect, useMemo, useState } from "react";

const MENU = [
  ["Dashboard", "D"], ["Bible", "B"], ["Hymns", "H"], ["Songs", "S"],
  ["Presentations", "P"], ["Service Planner", "SP"],
  ["Templates & 3D", "3D"], ["Lower Thirds", "LT"],
  ["Media Library", "M"], ["Announcements", "A"], ["Countdown", "T"],
  ["Stage Views", "SV"], ["Recording Studio", "REC"],
  ["NDI & OBS", "NDI"], ["Updates", "UP"], ["Settings", "SET"]
];

const BOOKS = [
  "Genesis","Exodus","Leviticus","Numbers","Deuteronomy","Joshua","Judges","Ruth",
  "1 Samuel","2 Samuel","1 Kings","2 Kings","1 Chronicles","2 Chronicles","Ezra",
  "Nehemiah","Esther","Job","Psalms","Proverbs","Ecclesiastes","Song of Solomon",
  "Isaiah","Jeremiah","Lamentations","Ezekiel","Daniel","Hosea","Joel","Amos",
  "Obadiah","Jonah","Micah","Nahum","Habakkuk","Zephaniah","Haggai","Zechariah",
  "Malachi","Matthew","Mark","Luke","John","Acts","Romans","1 Corinthians",
  "2 Corinthians","Galatians","Ephesians","Philippians","Colossians",
  "1 Thessalonians","2 Thessalonians","1 Timothy","2 Timothy","Titus","Philemon",
  "Hebrews","James","1 Peter","2 Peter","1 John","2 John","3 John","Jude","Revelation"
];

const BIBLE_BACKGROUNDS = [
  { id: "bg-01", name: "Sea of Galilee Sunrise", file: "bible-01.jpg" },
  { id: "bg-02", name: "Ancient Olive Grove", file: "bible-02.jpg" },
  { id: "bg-03", name: "Jerusalem at Dusk", file: "bible-03.jpg" },
  { id: "bg-04", name: "Shepherds Green Hills", file: "bible-04.jpg" },
  { id: "bg-05", name: "Judean Desert Path", file: "bible-05.jpg" },
  { id: "bg-06", name: "Garden Stream", file: "bible-06.jpg" },
  { id: "bg-07", name: "Mountains After the Storm", file: "bible-07.jpg" },
  { id: "bg-08", name: "Night Sky over the Sea", file: "bible-08.jpg" },
  { id: "bg-09", name: "Olive Grove Path", file: "bible-09.jpg" },
  { id: "bg-10", name: "Golden Wheat Fields", file: "bible-10.jpg" },
  { id: "bg-11", name: "Mountain Valley Stream", file: "bible-11.jpg" },
  { id: "bg-12", name: "Stone Gateway at Sunrise", file: "bible-12.jpg" },
  { id: "bg-13", name: "Olive Hills – Warm Light", file: "bible-13.jpg" },
  { id: "bg-14", name: "Quiet Night Waters", file: "bible-14.jpg" },
  { id: "bg-15", name: "Golden Valley – Evening", file: "bible-15.jpg" },
];

const FONT_CHOICES = [
  ["Georgia", "Georgia (Classic Scripture)"],
  ["Arial", "Arial (Clean)"],
  ["Times New Roman", "Times New Roman (Traditional)"],
  ["Trebuchet MS", "Trebuchet MS (Modern)"],
  ["Verdana", "Verdana (Easy reading)"],
  ["Palatino Linotype", "Palatino (Elegant)"],
  ["Garamond", "Garamond (Literary)"],
  ["Tahoma", "Tahoma (Simple)"],
  ["Courier New", "Courier New (Monospace)"],
  ["Impact", "Impact (Bold display)"],
];

const CREATOR_CREDIT = "MADE BY UKACHUKWU RICHARD AND JAMES GODSWILL";


const STARTER_HYMNS = [
  {
    id: "pd-amazing-grace", title: "Amazing Grace", category: "traditional",
    author: "John Newton", verses: [
      "Amazing grace! how sweet the sound,\nThat saved a wretch like me!\nI once was lost, but now am found,\nWas blind, but now I see.",
      "'Twas grace that taught my heart to fear,\nAnd grace my fears relieved;\nHow precious did that grace appear\nThe hour I first believed.",
      "Through many dangers, toils and snares,\nI have already come;\n'Tis grace hath brought me safe thus far,\nAnd grace will lead me home.",
      "The Lord has promised good to me,\nHis word my hope secures;\nHe will my shield and portion be,\nAs long as life endures."
    ]
  },
  {
    id: "pd-holy-holy-holy", title: "Holy, Holy, Holy", category: "traditional",
    author: "Reginald Heber", verses: [
      "Holy, holy, holy! Lord God Almighty!\nEarly in the morning our song shall rise to Thee;\nHoly, holy, holy! merciful and mighty!\nGod in three Persons, blessed Trinity!",
      "Holy, holy, holy! all the saints adore Thee,\nCasting down their golden crowns around the glassy sea;\nCherubim and seraphim falling down before Thee,\nWhich wert, and art, and evermore shalt be.",
      "Holy, holy, holy! though the darkness hide Thee,\nThough the eye of sinful man Thy glory may not see;\nOnly Thou art holy; there is none beside Thee,\nPerfect in power, in love, and purity.",
      "Holy, holy, holy! Lord God Almighty!\nAll Thy works shall praise Thy Name, in earth, and sky, and sea;\nHoly, holy, holy! merciful and mighty!\nGod in three Persons, blessed Trinity!"
    ]
  },
  {
    id: "pd-what-a-friend", title: "What a Friend We Have in Jesus", category: "traditional",
    author: "Joseph M. Scriven", verses: [
      "What a friend we have in Jesus,\nAll our sins and griefs to bear!\nWhat a privilege to carry\nEverything to God in prayer!\nO what peace we often forfeit,\nO what needless pain we bear,\nAll because we do not carry\nEverything to God in prayer!",
      "Have we trials and temptations?\nIs there trouble anywhere?\nWe should never be discouraged;\nTake it to the Lord in prayer.\nCan we find a friend so faithful\nWho will all our sorrows share?\nJesus knows our every weakness;\nTake it to the Lord in prayer.",
      "Are we weak and heavy-laden,\nCumbered with a load of care?\nPrecious Savior, still our refuge—\nTake it to the Lord in prayer.\nDo thy friends despise, forsake thee?\nTake it to the Lord in prayer!\nIn His arms He'll take and shield thee;\nThou wilt find a solace there."
    ]
  }
];

function getSavedSongs() {
  try {
    const saved = JSON.parse(localStorage.getItem("cms-songs-v1") || "null");
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

function normalizeBible(raw) {
  const source = raw?.books || raw?.bible || raw;
  if (!source || typeof source !== "object") throw new Error("The Bible JSON has an unexpected format.");
  const entries = Object.entries(source).filter(([, value]) => value && typeof value === "object");
  const aliasNames = {
    GEN:"Genesis", EXO:"Exodus", EXOD:"Exodus", LEV:"Leviticus", NUM:"Numbers",
    DEU:"Deuteronomy", DEUT:"Deuteronomy", JOS:"Joshua", JOSH:"Joshua",
    JDG:"Judges", JUDG:"Judges", RUT:"Ruth", RUTH:"Ruth", "1SA":"1 Samuel",
    "2SA":"2 Samuel", "1KI":"1 Kings", "2KI":"2 Kings", "1CH":"1 Chronicles",
    "2CH":"2 Chronicles", EZR:"Ezra", NEH:"Nehemiah", EST:"Esther", JOB:"Job",
    PSA:"Psalms", PS:"Psalms", PRO:"Proverbs", ECC:"Ecclesiastes", SNG:"Song of Solomon",
    SOS:"Song of Solomon", ISA:"Isaiah", JER:"Jeremiah", LAM:"Lamentations",
    EZK:"Ezekiel", EZE:"Ezekiel", DAN:"Daniel", HOS:"Hosea", JOL:"Joel", JOE:"Joel",
    AMO:"Amos", OBA:"Obadiah", OBD:"Obadiah", JON:"Jonah", MIC:"Micah", NAM:"Nahum",
    HAB:"Habakkuk", ZEP:"Zephaniah", HAG:"Haggai", ZEC:"Zechariah", MAL:"Malachi",
    MAT:"Matthew", MATTHEW:"Matthew", MRK:"Mark", MAR:"Mark", LUK:"Luke", LKE:"Luke",
    JOH:"John", JHN:"John", ACT:"Acts", ROM:"Romans", "1CO":"1 Corinthians",
    "2CO":"2 Corinthians", GAL:"Galatians", EPH:"Ephesians", PHP:"Philippians",
    PHI:"Philippians", COL:"Colossians", "1TH":"1 Thessalonians", "2TH":"2 Thessalonians",
    "1TI":"1 Timothy", "2TI":"2 Timothy", TIT:"Titus", PHM:"Philemon", HEB:"Hebrews",
    JAS:"James", "1PE":"1 Peter", "2PE":"2 Peter", "1JN":"1 John", "2JN":"2 John",
    "3JN":"3 John", JUD:"Jude", REV:"Revelation"
  };
  const result = {};
  entries.forEach(([key, value], index) => {
    const upper = String(key).toUpperCase().replace(/[^A-Z0-9]/g, "");
    const name = aliasNames[upper] || BOOKS[index];
    if (!name || result[name]) return;
    let chapters = [];
    if (Array.isArray(value)) {
      chapters = value.map(ch => Array.isArray(ch) ? ch : (ch && typeof ch === "object" ? Object.values(ch) : []));
    } else {
      chapters = Object.keys(value).sort((a,b) => Number(a)-Number(b)).map(ch => {
        const chapter = value[ch];
        return Array.isArray(chapter) ? chapter : (chapter && typeof chapter === "object" ? Object.keys(chapter).sort((a,b)=>Number(a)-Number(b)).map(v=>chapter[v]) : []);
      });
    }
    result[name] = chapters.map(ch => ch.map(v => {
      if (typeof v === "string") return v;
      if (v && typeof v === "object") return String(v.text || v.verse || v.content || "");
      return String(v ?? "");
    }));
  });
  if (Object.keys(result).length < 60) throw new Error("Only " + Object.keys(result).length + " Bible books were recognised. Check public/data/kjv.json.");
  return result;
}


const MEDIA_DB = "church-media-studio-media";
const MEDIA_STORE = "library";

function openMediaDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(MEDIA_DB, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(MEDIA_STORE)) db.createObjectStore(MEDIA_STORE, { keyPath: "id" });
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function mediaDBRequest(mode, action, value) {
  const db = await openMediaDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(MEDIA_STORE, mode);
    const store = tx.objectStore(MEDIA_STORE);
    const request = action === "getAll" ? store.getAll() : action === "delete" ? store.delete(value) : store.put(value);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
    tx.oncomplete = () => db.close();
    tx.onerror = () => reject(tx.error);
  });
}


function MediaAssetPreview({ item }) {
  const [url, setUrl] = useState("");
  useEffect(() => {
    const next = URL.createObjectURL(item.blob);
    setUrl(next);
    return () => URL.revokeObjectURL(next);
  }, [item]);
  if (!url) return <div className="media-audio-icon">…</div>;
  if (item.type === "Image") return <img src={url} alt={item.name}/>;
  if (item.type === "Video") return <video src={url} controls/>;
  if (item.type === "Audio") return <><div className="media-audio-icon">♫</div><audio src={url} controls/></>;
  return <div className="media-audio-icon">FILE</div>;
}

export default function App() {
  const [active, setActive] = useState("Dashboard");
  const [appVersion, setAppVersion] = useState("Loading…");
  const [updateStatus, setUpdateStatus] = useState("Not checked yet");
  const [updateInfo, setUpdateInfo] = useState(null);
  const [updateProgress, setUpdateProgress] = useState(0);
  const [updateError, setUpdateError] = useState("");
  const [updateBusy, setUpdateBusy] = useState(false);
  const [bible, setBible] = useState(null);
  const [bibleError, setBibleError] = useState("");
  const [book, setBook] = useState("John");
  const [chapter, setChapter] = useState(3);
  const [selectedVerse, setSelectedVerse] = useState(16);
  const [bibleSearch, setBibleSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [songs, setSongs] = useState(getSavedSongs);
  const [watchmanHymns, setWatchmanHymns] = useState([]);
  const [watchmanError, setWatchmanError] = useState("");
  const [songSearch, setSongSearch] = useState("");
  const [songCategory, setSongCategory] = useState("traditional");
  const [selectedSongId, setSelectedSongId] = useState("watchman-1");
  const [stanza, setStanza] = useState(0);
  const [editingSong, setEditingSong] = useState(false);
  const [songTitle, setSongTitle] = useState("");
  const [songAuthor, setSongAuthor] = useState("");
  const [songLyrics, setSongLyrics] = useState("");
  const [hymnNumberJump, setHymnNumberJump] = useState("");
  const [hymnJumpMessage, setHymnJumpMessage] = useState("");
  const [presentations, setPresentations] = useState(() => { try { return JSON.parse(localStorage.getItem("cms-presentations-v1") || "[]"); } catch { return []; } });
  const [selectedPresentationId, setSelectedPresentationId] = useState("");
  const [presentationName, setPresentationName] = useState("");
  const [slideTitle, setSlideTitle] = useState("");
  const [slideText, setSlideText] = useState("");
  const [editingSlideId, setEditingSlideId] = useState("");
  const [announcements, setAnnouncements] = useState(() => { try { return JSON.parse(localStorage.getItem("cms-announcements-v1") || "[]"); } catch { return []; } });
  const [announcementTitle, setAnnouncementTitle] = useState("");
  const [announcementBody, setAnnouncementBody] = useState("");
  const [editingAnnouncementId, setEditingAnnouncementId] = useState("");
  const [liveSlide, setLiveSlide] = useState({ text: "Welcome to Church", reference: "CHURCH MEDIA STUDIO", kind: "Welcome" });
  const [isLive, setIsLive] = useState(false);
  const [transitionToken, setTransitionToken] = useState(0);
  const [lowerThirdEnabled, setLowerThirdEnabled] = useState(true);
  const [lowerThirdMode, setLowerThirdMode] = useState("automatic");
  const [lowerThirdName, setLowerThirdName] = useState("CHURCH MEDIA STUDIO");
  const [lowerThirdTitle, setLowerThirdTitle] = useState("LIVE WORSHIP SERVICE");
  const [lowerThirdStyle, setLowerThirdStyle] = useState("gold");
  const [preacherVideoUrl, setPreacherVideoUrl] = useState("");
  const [preacherVideoName, setPreacherVideoName] = useState("");
  const [chromaKeyEnabled, setChromaKeyEnabled] = useState(true);
  const [chromaThreshold, setChromaThreshold] = useState(65);
  const chromaCanvasRef = React.useRef(null);
  const [animationStyle, setAnimationStyle] = useState("cinematic-3d");
  const [animationDuration, setAnimationDuration] = useState(900);
  const [mediaItems, setMediaItems] = useState([]);
  const [mediaError, setMediaError] = useState("");
  const [countdownMinutes, setCountdownMinutes] = useState(5);
  const [countdownSeconds, setCountdownSeconds] = useState(0);
  const [countdownRunning, setCountdownRunning] = useState(false);
  const [ndiRunning, setNdiRunning] = useState(false);
  const [ndiStatus, setNdiStatus] = useState("NDI is stopped");
  const [ndiError, setNdiError] = useState("");
  const ndiCanvasRef = React.useRef(null);
  const ndiFrameInFlightRef = React.useRef(false);
  const ndiPendingFrameRef = React.useRef(Promise.resolve());
  const backgroundImageRef = React.useRef(null);
  const liveMediaImageRef = React.useRef(null);
  const liveMediaVideoRef = React.useRef(null);

  const [settings, setSettings] = useState(() => {
    try {
      return { fontSize: "medium", fontFamily: "Georgia", scriptureFontSize: 42, backgroundId: "bg-01", showOutput: true, confirmDelete: true, startPage: "Dashboard",
        ...(JSON.parse(localStorage.getItem("cms-settings-v1") || "{}")) };
    } catch {
      return { fontSize: "medium", fontFamily: "Georgia", scriptureFontSize: 42, backgroundId: "bg-01", showOutput: true, confirmDelete: true, startPage: "Dashboard" };
    }
  });

  useEffect(() => {
    window.churchStudio?.getAppInfo?.().then(info => {
      if (info?.version) setAppVersion(info.version);
    }).catch(() => setAppVersion("Unknown"));

    if (!window.churchStudio?.onUpdateStatus) return;
    const unsubscribe = window.churchStudio.onUpdateStatus(message => {
      if (!message) return;
      if (message.type === "checking") {
        setUpdateStatus("Checking GitHub for updates…");
        setUpdateError("");
      } else if (message.type === "available") {
        setUpdateBusy(false);
        setUpdateInfo(message.info || null);
        setUpdateStatus("A new version is available");
        setUpdateProgress(0);
        setUpdateError("");
      } else if (message.type === "not-available") {
        setUpdateBusy(false);
        setUpdateInfo(null);
        setUpdateStatus("You're using the latest version");
        setUpdateProgress(0);
        setUpdateError("");
      } else if (message.type === "progress") {
        setUpdateProgress(Math.max(0, Math.min(100, Math.round(message.percent || 0))));
        setUpdateStatus("Downloading update…");
      } else if (message.type === "downloaded") {
        setUpdateInfo(message.info || updateInfo);
        setUpdateProgress(100);
        setUpdateStatus("Update downloaded — ready to install");
        setUpdateBusy(false);
      } else if (message.type === "error") {
        setUpdateStatus("Update check failed");
        setUpdateError(message.text || "The update service could not be reached.");
        setUpdateBusy(false);
      }
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (active !== "Updates") return;
    setUpdateBusy(true);
    window.churchStudio?.checkForUpdates?.()
      .then(result => {
        if (!result?.ok) {
          setUpdateBusy(false);
          if (result?.error) {
            setUpdateError(result.error);
            setUpdateStatus("Update service unavailable");
          }
        }
      })
      .catch(error => {
        setUpdateBusy(false);
        setUpdateError(error?.message || "Could not check for updates.");
        setUpdateStatus("Update check failed");
      });
  }, [active]);

  useEffect(() => {
    if (!window.churchStudio?.onNdiStatus) return;
    const unsubscribe = window.churchStudio.onNdiStatus((message) => {
      if (message?.type === "status") setNdiStatus(message.text || "NDI status updated");
      if (message?.type === "ready") { setNdiRunning(true); setNdiStatus(message.text || "NDI sender is ready"); setNdiError(""); }
      if (message?.type === "error") { setNdiError(message.text || "NDI sender error"); setNdiRunning(false); }
      if (message?.type === "stopped") {
        setNdiRunning(false);
        setNdiStatus("NDI is stopped");
      }
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const selected = BIBLE_BACKGROUNDS.find(item => item.id === settings.backgroundId) || BIBLE_BACKGROUNDS[0];
    const image = new Image();
    image.onload = () => { backgroundImageRef.current = image; };
    image.onerror = () => { backgroundImageRef.current = null; };
    image.src = `./backgrounds/${selected.file}`;
    return () => { image.onload = null; image.onerror = null; };
  }, [settings.backgroundId]);

  useEffect(() => {
    if (!preacherVideoUrl) return;
    const canvas = chromaCanvasRef.current;
    const context = canvas?.getContext("2d", { willReadFrequently: true });
    if (!canvas || !context) return;
    const video = document.createElement("video");
    video.src = preacherVideoUrl;
    video.muted = true;
    video.loop = true;
    video.autoplay = true;
    video.playsInline = true;
    let frame = 0;
    let active = true;
    const renderKeyedFrame = () => {
      if (!active) return;
      if (video.readyState >= 2 && video.videoWidth > 0) {
        const scale = Math.max(canvas.width / video.videoWidth, canvas.height / video.videoHeight);
        const width = video.videoWidth * scale;
        const height = video.videoHeight * scale;
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(video, (canvas.width - width) / 2, (canvas.height - height) / 2, width, height);
        if (chromaKeyEnabled) {
          const pixels = context.getImageData(0, 0, canvas.width, canvas.height);
          const data = pixels.data;
          for (let i = 0; i < data.length; i += 4) {
            const red = data[i], green = data[i + 1], blue = data[i + 2];
            const dominance = green - Math.max(red, blue);
            if (green > red * 1.12 && green > blue * 1.08 && dominance > chromaThreshold) {
              data[i + 3] = 0;
            } else if (green > red * 1.08 && green > blue * 1.04 && dominance > chromaThreshold * 0.45) {
              const spill = Math.min(1, (dominance - chromaThreshold * 0.45) / Math.max(1, chromaThreshold));
              data[i + 1] = Math.round(green * (1 - spill * 0.48) + Math.max(red, blue) * spill * 0.48);
            }
          }
          context.putImageData(pixels, 0, 0);
        }
      }
      frame = requestAnimationFrame(renderKeyedFrame);
    };
    video.play().then(renderKeyedFrame).catch(() => {});
    return () => {
      active = false;
      cancelAnimationFrame(frame);
      video.pause();
      video.removeAttribute("src");
      video.load();
      URL.revokeObjectURL(preacherVideoUrl);
    };
  }, [preacherVideoUrl, chromaKeyEnabled, chromaThreshold]);

  useEffect(() => {
    if (!ndiRunning) return;
    const canvas = ndiCanvasRef.current;
    if (!canvas || !window.churchStudio?.sendNdiFrame) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    const W = canvas.width, H = canvas.height;
    const draw = async () => {
      if (ndiFrameInFlightRef.current) return;
      const bg = backgroundImageRef.current;
      const liveMedia = liveMediaImageRef.current;
      const liveVideo = liveMediaVideoRef.current;
      const mediaSource = isLive && liveSlide.kind === "Media Video" && liveVideo && liveVideo.readyState >= 2 ? liveVideo : (isLive && liveSlide.kind === "Media" && liveMedia && liveMedia.complete && liveMedia.naturalWidth > 0 ? liveMedia : null);
      const keyedPreacher = isLive && liveSlide.kind === "Preacher Video" ? chromaCanvasRef.current : null;
      if (keyedPreacher) {
        if (bg && bg.complete && bg.naturalWidth > 0) {
          ctx.drawImage(bg, 0, 0, W, H);
          ctx.fillStyle = "rgba(4,6,11,0.28)";
          ctx.fillRect(0, 0, W, H);
        } else {
          ctx.fillStyle = "#080a10";
          ctx.fillRect(0, 0, W, H);
        }
        ctx.drawImage(keyedPreacher, 0, 0, W, H);
      } else if (mediaSource) {
        const sourceW = mediaSource.videoWidth || mediaSource.naturalWidth;
        const sourceH = mediaSource.videoHeight || mediaSource.naturalHeight;
        const scale = Math.max(W / sourceW, H / sourceH);
        const dw = sourceW * scale, dh = sourceH * scale;
        ctx.drawImage(mediaSource, (W - dw) / 2, (H - dh) / 2, dw, dh);
        ctx.fillStyle = "rgba(4, 6, 11, 0.18)";
        ctx.fillRect(0, 0, W, H);
      } else if (bg && bg.complete && bg.naturalWidth > 0) {
        ctx.drawImage(bg, 0, 0, W, H);
        ctx.fillStyle = "rgba(4, 6, 11, 0.58)";
        ctx.fillRect(0, 0, W, H);
      } else {
        const gradient = ctx.createLinearGradient(0, 0, W, H);
        gradient.addColorStop(0, "#080a10");
        gradient.addColorStop(1, "#211b12");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, W, H);
      }
      // Animated gold orbit rings are rendered into the same frame sent to OBS.
      const motionTime = performance.now() / 1000;
      ctx.save();
      ctx.translate(W / 2, H / 2);
      ctx.rotate(motionTime * 0.34);
      ctx.strokeStyle = "rgba(216,183,110,0.20)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(0, 0, 360, 105, -0.24, 0, Math.PI * 2);
      ctx.stroke();
      ctx.rotate(-motionTime * 0.82);
      ctx.strokeStyle = "rgba(255,226,157,0.12)";
      ctx.beginPath();
      ctx.ellipse(0, 0, 290, 78, 0.38, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      ctx.textAlign = "center";
      ctx.fillStyle = "#d8b76e";
      ctx.font = `600 20px "${settings.fontFamily || "Georgia"}"`;
      ctx.fillText(liveSlide.reference || "CHURCH MEDIA STUDIO", W / 2, 95);
      ctx.fillStyle = "#ffffff";
      const raw = String(isLive ? liveSlide.text : "CHURCH MEDIA STUDIO").replace(/\r\n?/g, "\n").trim();
      const paragraphs = raw.split("\n");
      const maxWidth = W - 120;
      const maxHeight = H - 210;
      let fontSize = Math.max(20, Math.min(64, Number(settings.scriptureFontSize) || 42));
      let lines = [];
      // Preserve hymn stanza line breaks and wrap long lines without clipping.
      while (fontSize >= 18) {
        ctx.font = `600 ${fontSize}px "${settings.fontFamily || "Georgia"}"`;
        lines = [];
        for (const paragraph of paragraphs) {
          const words = paragraph.split(/\s+/).filter(Boolean);
          if (!words.length) { lines.push(""); continue; }
          let line = "";
          for (const word of words) {
            const test = line ? line + " " + word : word;
            if (ctx.measureText(test).width > maxWidth && line) {
              lines.push(line);
              line = word;
            } else line = test;
          }
          if (line) lines.push(line);
        }
        const lineHeightTest = Math.round(fontSize * 1.32);
        if (lines.length * lineHeightTest <= maxHeight) break;
        fontSize -= 2;
      }
      ctx.font = `600 ${fontSize}px "${settings.fontFamily || "Georgia"}"`;
      const lineHeight = Math.round(fontSize * 1.32);
      const blockHeight = lines.length * lineHeight;
      const startY = (H - blockHeight) / 2 + lineHeight * 0.78 + 12;
      lines.forEach((value, index) => {
        ctx.fillText(value, W / 2, startY + index * lineHeight, maxWidth);
      });
      ctx.fillStyle = "#a99770";
      ctx.font = `12px "${settings.fontFamily || "Georgia"}"`;
      ctx.fillText(isLive ? "LIVE PROGRAM" : "STANDBY", W / 2, H - 42);
      if (isLive && lowerThirdEnabled) {
        const ltName = lowerThirdMode === "automatic" ? (liveSlide.reference || "LIVE") : lowerThirdName;
        const ltDetail = lowerThirdMode === "automatic" ? String(liveSlide.text || "").replace(/\s+/g, " ").slice(0, 110) : lowerThirdTitle;
        const barY = H - 132;
        const bar = ctx.createLinearGradient(70, barY, W - 70, barY);
        bar.addColorStop(0, "rgba(5,7,12,0.94)");
        bar.addColorStop(0.78, "rgba(5,7,12,0.70)");
        bar.addColorStop(1, "rgba(5,7,12,0.08)");
        ctx.fillStyle = bar;
        ctx.fillRect(70, barY, W - 140, 74);
        ctx.fillStyle = lowerThirdStyle === "white" ? "#ffffff" : lowerThirdStyle === "blue" ? "#4ba5e8" : "#d8b76e";
        ctx.fillRect(70, barY, 5, 74);
        ctx.textAlign = "left";
        ctx.font = "700 20px Manrope";
        ctx.fillText(String(ltName).slice(0, 70), 92, barY + 31, W - 190);
        ctx.fillStyle = "#e5d5b3";
        ctx.font = "14px Manrope";
        ctx.fillText(String(ltDetail), 92, barY + 55, W - 190);
        ctx.textAlign = "center";
      }
      ctx.fillStyle = "rgba(255,255,255,0.72)";
      ctx.font = "10px Arial";
      ctx.fillText(CREATOR_CREDIT, W / 2, H - 16);
      const pixels = ctx.getImageData(0, 0, W, H).data;
      const frame = pixels.buffer.slice(pixels.byteOffset, pixels.byteOffset + pixels.byteLength);
      ndiFrameInFlightRef.current = true;
      const pending = window.churchStudio.sendNdiFrame(frame)
        .then(result => {
          if (result && !result.ok && result.error !== "NDI sender is not ready.") {
            setNdiError(result.error || "NDI frame was not accepted.");
          }
        })
        .catch(error => setNdiError(error?.message || "Could not send NDI frame"))
        .finally(() => { ndiFrameInFlightRef.current = false; });
      ndiPendingFrameRef.current = pending;
      await pending;
    };
    draw();
    const timer = setInterval(draw, 33);
    return () => clearInterval(timer);
  }, [ndiRunning, liveSlide, isLive, settings.fontFamily, settings.scriptureFontSize, settings.backgroundId, lowerThirdEnabled, lowerThirdMode, lowerThirdName, lowerThirdTitle, lowerThirdStyle, preacherVideoUrl, chromaKeyEnabled, chromaThreshold]);

  useEffect(() => {
    localStorage.setItem("cms-settings-v1", JSON.stringify(settings));
  }, [settings]);
  useEffect(() => {
    if (active !== "Media Library") return;
    mediaDBRequest("readonly", "getAll").then(items => setMediaItems(items || []))
      .catch(() => setMediaError("The media library could not be opened in this browser."));
  }, [active]);

  useEffect(() => {
    if (!countdownRunning) return;
    const timer = setInterval(() => {
      setCountdownSeconds(current => {
        if (current > 0) return current - 1;
        if (countdownMinutes > 0) {
          setCountdownMinutes(minutes => Math.max(0, minutes - 1));
          return 59;
        }
        setCountdownRunning(false);
        return 0;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [countdownRunning, countdownMinutes]);

  function updateSetting(key, value) {
    setSettings(prev => ({ ...prev, [key]: value }));
  }

  function resetSettings() {
    const defaults = { fontSize: "medium", fontFamily: "Georgia", scriptureFontSize: 42, backgroundId: "bg-01", showOutput: true, confirmDelete: true, startPage: "Dashboard" };
    setSettings(defaults);
  }

  useEffect(() => {
    let alive = true;
    fetch("./data/watchman-hymns.json")
      .then(response => {
        if (!response.ok) throw new Error("Could not load Watchman hymns (" + response.status + ").");
        return response.json();
      })
      .then(raw => {
        if (!Array.isArray(raw?.hymns)) throw new Error("The Watchman hymn file does not contain a hymns array.");
        const normalized = raw.hymns.map(hymn => ({
          id: "watchman-" + hymn.id,
          number: String(hymn.number ?? hymn.id ?? ""),
          title: String(hymn.title ?? "Untitled hymn"),
          author: String(hymn.author ?? ""),
          category: hymn.category || "Watchman Hymns",
          source: "watchman",
          verses: (Array.isArray(hymn.lyrics) ? hymn.lyrics : []).map(part => String(part.content ?? "")),
          sections: (Array.isArray(hymn.lyrics) ? hymn.lyrics : []).map((part, index) => ({
            type: String(part.type || "verse").toLowerCase() === "chorus" ? "chorus" : "verse",
            verse: part.verse ?? null,
            index
          }))
        }));
        if (alive) { setWatchmanHymns(normalized); setWatchmanError(""); }
      })
      .catch(error => { if (alive) setWatchmanError(error.message + " Check public\\data\\watchman-hymns.json."); });
    return () => { alive = false; };
  }, []);

  useEffect(() => {
    let alive = true;
    fetch("./data/kjv.json")
      .then(r => { if (!r.ok) throw new Error("Could not load public/data/kjv.json (" + r.status + ")."); return r.json(); })
      .then(raw => { if (alive) { setBible(normalizeBible(raw)); setBibleError(""); } })
      .catch(err => { if (alive) setBibleError(err.message + " Confirm the file is in the project's public\\data folder."); });
    return () => { alive = false; };
  }, []);

  useEffect(() => {
    localStorage.setItem("cms-songs-v1", JSON.stringify(songs));
  }, [songs]);
  useEffect(() => { localStorage.setItem("cms-presentations-v1", JSON.stringify(presentations)); }, [presentations]);
  useEffect(() => { localStorage.setItem("cms-announcements-v1", JSON.stringify(announcements)); }, [announcements]);

  const bookNames = useMemo(() => bible ? BOOKS.filter(name => bible[name]) : [], [bible]);
  const chapters = bible?.[book] || [];
  const verses = chapters[chapter - 1] || [];
  const currentText = verses[selectedVerse - 1] || "";

  const filteredSongs = useMemo(() => {
    const source = active === "Hymns"
      ? (songCategory === "traditional" ? [...watchmanHymns, ...songs.filter(song => song.category === "traditional")] : songs.filter(song => song.category === "contemporary"))
      : songs;
    const query = songSearch.trim().toLowerCase();
    return source.filter(song =>
      (String(song.number || "") + " " + song.title + " " + (song.author || "") + " " + (song.verses || []).join(" ")).toLowerCase().includes(query)
    );
  }, [songs, watchmanHymns, songSearch, songCategory, active]);

  const selectedSong = filteredSongs.find(s => s.id === selectedSongId) || filteredSongs[0] || null;

  useEffect(() => {
    if (selectedSong && selectedSong.id !== selectedSongId) setSelectedSongId(selectedSong.id);
  }, [selectedSong, selectedSongId]);

  function sendLive(text, reference, kind, mediaUrl = null) {
    setLiveSlide({ text, reference, kind, mediaUrl });
    setTransitionToken(value => value + 1);
    setIsLive(true);
  }

  useEffect(() => {
    liveMediaImageRef.current = null;
    liveMediaVideoRef.current = null;
    if (!liveSlide.mediaUrl) return;
    if (liveSlide.kind === "Media Video") {
      const video = document.createElement("video");
      video.src = liveSlide.mediaUrl; video.muted = true; video.loop = true; video.autoplay = true; video.playsInline = true;
      liveMediaVideoRef.current = video;
      video.play().catch(() => {});
      return () => { video.pause(); video.removeAttribute("src"); video.load(); liveMediaVideoRef.current = null; URL.revokeObjectURL(liveSlide.mediaUrl); };
    }
    const image = new Image();
    image.onload = () => { liveMediaImageRef.current = image; };
    image.onerror = () => { liveMediaImageRef.current = null; };
    image.src = liveSlide.mediaUrl;
    return () => { image.onload = null; image.onerror = null; URL.revokeObjectURL(liveSlide.mediaUrl); };
  }, [liveSlide.mediaUrl, liveSlide.kind]);

  function jumpToHymnNumber() {
    const number = String(hymnNumberJump).trim().replace(/^0+/, "");
    if (!number) { setHymnJumpMessage("Enter a hymn number first."); return; }
    const library = [...watchmanHymns, ...songs.filter(song => song.category === "traditional")];
    const match = library.find(song => String(song.number || "").replace(/^0+/, "") === number);
    if (!match) { setHymnJumpMessage(`Hymn ${number} was not found in the loaded hymn library.`); return; }
    setSongCategory("traditional"); setSongSearch(""); setSelectedSongId(match.id); setStanza(0); setEditingSong(false); setHymnJumpMessage(`Opened hymn ${number}: ${match.title}`);
  }

  function createPresentation() {
    const title = presentationName.trim();
    if (!title) return;
    const item = { id: "presentation-" + Date.now(), title, slides: [] };
    setPresentations(prev => [item, ...prev]); setSelectedPresentationId(item.id); setPresentationName("");
  }

  const selectedPresentation = presentations.find(item => item.id === selectedPresentationId) || presentations[0] || null;

  function addPresentationSlide() {
    if (!selectedPresentation || !slideText.trim()) return;
    const title = slideTitle.trim() || `Slide ${selectedPresentation.slides.length + 1}`;
    setPresentations(prev => prev.map(item => {
      if (item.id !== selectedPresentation.id) return item;
      if (editingSlideId) return { ...item, slides: item.slides.map(slide => slide.id === editingSlideId ? { ...slide, title, text: slideText.trim() } : slide) };
      return { ...item, slides: [...item.slides, { id: "slide-" + Date.now(), title, text: slideText.trim() }] };
    }));
    setSlideTitle(""); setSlideText(""); setEditingSlideId("");
  }

  function editPresentationSlide(slide) {
    setEditingSlideId(slide.id); setSlideTitle(slide.title); setSlideText(slide.text);
  }

  function movePresentationSlide(slideId, direction) {
    setPresentations(prev => prev.map(item => {
      if (item.id !== selectedPresentation?.id) return item;
      const slides = [...item.slides];
      const index = slides.findIndex(slide => slide.id === slideId);
      const next = index + direction;
      if (index < 0 || next < 0 || next >= slides.length) return item;
      [slides[index], slides[next]] = [slides[next], slides[index]];
      return { ...item, slides };
    }));
  }

  function deletePresentation(id) {
    if (!window.confirm("Delete this presentation and its slides?")) return;
    setPresentations(prev => prev.filter(item => item.id !== id));
    if (selectedPresentationId === id) setSelectedPresentationId("");
  }

  function saveAnnouncement() {
    if (!announcementTitle.trim() || !announcementBody.trim()) return;
    const values = { title: announcementTitle.trim(), body: announcementBody.trim(), updatedAt: new Date().toISOString() };
    setAnnouncements(prev => editingAnnouncementId
      ? prev.map(item => item.id === editingAnnouncementId ? { ...item, ...values } : item)
      : [{ id: "announcement-" + Date.now(), ...values, createdAt: new Date().toISOString() }, ...prev]);
    setAnnouncementTitle(""); setAnnouncementBody(""); setEditingAnnouncementId("");
  }

  function changeBook(nextBook) {
    setBook(nextBook);
    setChapter(1);
    setSelectedVerse(1);
    setSearchResults([]);
  }

  function runBibleSearch() {
    if (!bible || !bibleSearch.trim()) { setSearchResults([]); return; }
    const q = bibleSearch.trim().toLowerCase();
    const found = [];
    for (const [bookName, bookChapters] of Object.entries(bible)) {
      for (let ci = 0; ci < bookChapters.length; ci++) {
        const ch = bookChapters[ci] || [];
        for (let vi = 0; vi < ch.length; vi++) {
          if (String(ch[vi]).toLowerCase().includes(q)) {
            found.push({ book: bookName, chapter: ci + 1, verse: vi + 1, text: ch[vi] });
            if (found.length >= 150) return setSearchResults(found);
          }
        }
      }
    }
    setSearchResults(found);
  }

  function selectSearchResult(item) {
    setBook(item.book); setChapter(item.chapter); setSelectedVerse(item.verse); setSearchResults([]);
    setBibleSearch("");
  }

  function saveSong() {
    const title = songTitle.trim();
    const verseList = songLyrics.split(/\n\s*\n/).map(v => v.trim()).filter(Boolean);
    if (!title || !verseList.length) return;
    const existing = editingSong && selectedSong ? selectedSong : null;
    const item = {
      id: existing?.id || "song-" + Date.now(),
      title, author: songAuthor.trim(), category: songCategory, source: "custom", verses: verseList
    };
    setSongs(prev => existing ? prev.map(s => s.id === existing.id ? item : s) : [item, ...prev]);
    setSelectedSongId(item.id); setStanza(0); setEditingSong(false);
    setSongTitle(""); setSongAuthor(""); setSongLyrics("");
  }

  function startNewSong(category) {
    setSongCategory(category); setEditingSong(true); setSongTitle(""); setSongAuthor(""); setSongLyrics("");
  }

  function startEditSong(song) {
    if (song.source === "watchman") return;
    setSelectedSongId(song.id); setSongCategory(song.category); setEditingSong(true);
    setSongTitle(song.title); setSongAuthor(song.author || ""); setSongLyrics((song.verses || []).join("\n\n"));
  }

  function deleteSong(song) {
    if (song.source === "watchman") return;
    if (settings.confirmDelete && !window.confirm("Delete " + song.title + "?")) return;
    setSongs(prev => prev.filter(s => s.id !== song.id));
    setStanza(0);
  }


  async function addMediaFiles(event) {
    const files = Array.from(event.target.files || []);
    setMediaError("");
    for (const file of files) {
      const type = file.type.startsWith("image/") ? "Image" : file.type.startsWith("video/") ? "Video" : file.type.startsWith("audio/") ? "Audio" : "File";
      const item = { id: "media-" + Date.now() + "-" + Math.random().toString(36).slice(2), name: file.name, type, mime: file.type, size: file.size, addedAt: new Date().toISOString(), blob: file };
      try {
        await mediaDBRequest("readwrite", "put", item);
        setMediaItems(previous => [item, ...previous]);
      } catch {
        setMediaError("Could not save " + file.name + ". The file may be too large or storage may be full.");
      }
    }
    event.target.value = "";
  }

  async function removeMedia(item) {
    if (!window.confirm("Remove " + item.name + " from the media library?")) return;
    try {
      await mediaDBRequest("readwrite", "delete", item.id);
      setMediaItems(previous => previous.filter(entry => entry.id !== item.id));
    } catch {
      setMediaError("Could not remove this media file.");
    }
  }

  async function startNdi() {
    setNdiError("");
    if (!window.churchStudio?.startNdi) {
      setNdiError("NDI bridge is not available. Restart the desktop app after installing this update.");
      return;
    }
    try {
      const result = await window.churchStudio.startNdi();
      if (result?.ok && result.ready) {
        setNdiRunning(true);
        setNdiStatus("NDI sender ready: CHURCH MEDIA STUDIO");
      } else if (result?.ok) {
        setNdiError("NDI sender started but did not confirm readiness. Check the NDI diagnostics.");
      } else {
        setNdiError(result?.error || "NDI sender could not start.");
      }
    } catch (error) {
      setNdiError(error?.message || "NDI sender could not start.");
    }
  }

  async function stopNdi() {
    setNdiRunning(false);
    try {
      // Finish the current frame transfer before closing the native input pipe.
      await ndiPendingFrameRef.current;
      await window.churchStudio?.stopNdi?.();
    } finally {
      setNdiStatus("NDI is stopped");
    }
  }

  function setCountdownFromMinutes(value) {
    const safe = Math.max(0, Math.min(999, Number(value) || 0));
    setCountdownMinutes(safe);
    setCountdownSeconds(0);
    setCountdownRunning(false);
  }

  function resetCountdown() {
    setCountdownRunning(false);
    setCountdownMinutes(5);
    setCountdownSeconds(0);
  }

  function sendCountdownLive() {
    const display = String(countdownMinutes).padStart(2, "0") + ":" + String(countdownSeconds).padStart(2, "0");
    sendLive(display, "SERVICE COUNTDOWN", "Countdown");
  }

  useEffect(() => {
    if (!isLive || liveSlide.kind !== "Countdown") return;
    const display = String(countdownMinutes).padStart(2, "0") + ":" + String(countdownSeconds).padStart(2, "0");
    if (liveSlide.text !== display || liveSlide.reference !== "SERVICE COUNTDOWN") {
      setLiveSlide(previous => ({ ...previous, text: display, reference: "SERVICE COUNTDOWN" }));
    }
  }, [countdownMinutes, countdownSeconds, isLive, liveSlide.kind, liveSlide.text, liveSlide.reference]);

  const activeVerseRef = `${book} ${chapter}:${selectedVerse}`;
  const currentStanza = selectedSong?.verses?.[stanza] || "";

  // While a Bible verse is live, changing the selection updates OBS immediately.
  useEffect(() => {
    if (!isLive || liveSlide.kind !== "Bible" || !currentText) return;
    const reference = activeVerseRef + " · KJV";
    if (liveSlide.text !== currentText || liveSlide.reference !== reference) {
      setLiveSlide({ text: currentText, reference, kind: "Bible" });
    }
  }, [isLive, liveSlide.kind, liveSlide.text, liveSlide.reference, currentText, activeVerseRef]);

  // Keep the currently live hymn/song section synchronized when selecting another hymn or stanza.
  useEffect(() => {
    if (!isLive || liveSlide.kind !== "Song" || !selectedSong || !currentStanza) return;
    const sectionName = selectedSong.sections?.[stanza]?.type === "chorus" ? "Chorus" : "Verse";
    const sectionNumber = selectedSong.sections?.[stanza]?.verse || (stanza + 1);
    const reference = (selectedSong.number ? "Hymn " + selectedSong.number + " · " : "") + selectedSong.title + " · " + sectionName + " " + sectionNumber;
    if (liveSlide.text !== currentStanza || liveSlide.reference !== reference) {
      setLiveSlide({ text: currentStanza, reference, kind: "Song" });
    }
  }, [isLive, liveSlide.kind, liveSlide.text, liveSlide.reference, selectedSong, stanza, currentStanza]);

  // Up/Down navigate Bible verses when the Bible workspace is active.
  useEffect(() => {
    if (active !== "Bible") return;
    const handleBibleKeys = (event) => {
      if (event.altKey || event.ctrlKey || event.metaKey || event.repeat) return;
      const target = event.target;
      const tag = target?.tagName?.toLowerCase();
      if (tag === "input" || tag === "textarea" || tag === "select" || target?.isContentEditable) return;
      if (event.key === "ArrowUp") {
        event.preventDefault();
        setSelectedVerse((value) => Math.max(1, value - 1));
      } else if (event.key === "ArrowDown") {
        event.preventDefault();
        setSelectedVerse((value) => Math.min(verses.length || 1, value + 1));
      }
    };
    window.addEventListener("keydown", handleBibleKeys);
    return () => window.removeEventListener("keydown", handleBibleKeys);
  }, [active, verses.length]);

  return (
    <div className={`app ui-${settings.fontSize}`}>
      <aside className="sidebar">
        <div className="brand"><div className="brand-icon">✦</div><div><strong>CHURCH MEDIA</strong><span>STUDIO PROFESSIONAL</span></div></div>
        <div className="workspace-label">WORKSPACE</div>
        <nav>{MENU.map(([name, icon]) => <button key={name} className={`nav-item ${active === name ? "selected" : ""}`} onClick={() => setActive(name)}><span className="nav-icon">{icon}</span>{name}{name === "NDI & OBS" && <span className="nav-tag">NDI</span>}</button>)}</nav>
        <div className="sidebar-bottom"><div className="status-dot"></div><span>LOCAL STUDIO</span><small>Offline-ready workspace</small></div>
      </aside>

      <main className="main">
        <header className="topbar"><div><div className="eyebrow">CHURCH BROADCASTING WORKSPACE</div><h1>{active}</h1></div><div className="top-actions"><span className="creator-topline">{CREATOR_CREDIT}</span><span className="system-status"><i></i> Local workspace</span><div className="avatar">CM</div></div></header>

        {active === "Dashboard" && <>
          <section className="welcome"><div><div className="eyebrow gold">YOUR CHURCH. YOUR MESSAGE. YOUR STUDIO.</div><h2>Everything you need<br/>to present with excellence.</h2><p>Manage scripture, worship, media and live presentation from one professional workspace.</p><button className="primary-btn" onClick={() => setActive("Bible")}>Open Bible workspace →</button></div><div className="welcome-art"><div className="art-ring"></div><div className="art-cross">✝</div><span>WORSHIP · WORD · MEDIA</span></div></section>
          <div className="section-heading"><div><h3>Studio workspace</h3><p>Choose a tool to get started</p></div><span className="small-label">11 MODULES</span></div>
          <section className="module-grid">{[["▤","Bible","Search all 66 books of the KJV"],["♫","Hymns","Find and present numbered hymns"],["♪","Songs","Manage contemporary worship songs"],["▣","Presentations","Build and control service slides"],["◷","Announcements","Create and display church notices"],["▧","Media Library","Organise images, video and audio"],["◴","Countdown","Prepare a service countdown"],["◎","NDI & OBS","Broadcast the live program to OBS"],["↻","Updates","Check for new versions and improvements"]].map(([icon,name,desc])=><button className="module-card" key={name} onClick={()=>setActive(name)}><span className="module-icon">{icon}</span><strong>{name}</strong><p>{desc}</p><span className="card-arrow">→</span></button>)}</section>
        </>}

        {active === "Updates" && <section className="content-panel">
          <div className="panel-heading">
            <div><h2>Church Media Studio Updates</h2><p>Check for new versions, read what's changed, and install updates from the official release channel.</p></div>
            <span className="small-label">ONLINE UPDATE CENTRE</span>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:16,marginBottom:22}}>
            <div style={{background:"#111722",border:"1px solid #293244",borderRadius:14,padding:20}}>
              <div style={{color:"#a99770",fontSize:11,letterSpacing:1.5,fontWeight:700}}>INSTALLED VERSION</div>
              <div style={{fontSize:30,fontWeight:750,marginTop:8,color:"#fff"}}>v{appVersion}</div>
              <div style={{color:"#9ca8b8",fontSize:13,marginTop:5}}>This version is running on this computer.</div>
            </div>
            <div style={{background:"#111722",border:"1px solid #293244",borderRadius:14,padding:20}}>
              <div style={{color:"#a99770",fontSize:11,letterSpacing:1.5,fontWeight:700}}>UPDATE STATUS</div>
              <div style={{fontSize:19,fontWeight:700,marginTop:13,color:"#fff"}}>{updateStatus}</div>
              <div style={{color:"#9ca8b8",fontSize:13,marginTop:8}}>The rest of the studio remains available offline.</div>
            </div>
          </div>
          {updateInfo && <div style={{background:"#151b24",border:"1px solid #4b4029",borderRadius:14,padding:20,marginBottom:18}}>
            <div className="small-label">NEW RELEASE AVAILABLE</div>
            <h3 style={{fontSize:24,margin:"8px 0",color:"#f0d77a"}}>Version {updateInfo.version || "New version"}</h3>
            <div style={{color:"#d3d9e2",whiteSpace:"pre-wrap",lineHeight:1.65}}>{typeof updateInfo.releaseNotes === "string" ? updateInfo.releaseNotes : Array.isArray(updateInfo.releaseNotes) ? updateInfo.releaseNotes.map(note=>note.note || note).join("\\n") : "A new Church Media Studio release is ready."}</div>
            <div style={{display:"flex",gap:10,flexWrap:"wrap",marginTop:18}}>
              <button className="primary-btn" disabled={updateBusy || updateStatus.includes("Downloading") || updateStatus.includes("downloaded")} onClick={async()=>{
                setUpdateBusy(true); setUpdateError("");
                try { const result = await window.churchStudio?.downloadUpdate?.(); if (!result?.ok) { setUpdateBusy(false); setUpdateError(result?.error || "The update download could not start."); } }
                catch(error) { setUpdateBusy(false); setUpdateError(error?.message || "The update download could not start."); }
              }}>Download update</button>
              <button className="secondary-btn" disabled={!updateStatus.includes("ready to install")} onClick={()=>window.churchStudio?.installUpdate?.()}>Install and restart</button>
            </div>
            {(updateProgress > 0 || updateStatus.includes("Downloading")) && <div style={{marginTop:16}}>
              <div style={{height:8,background:"#293244",borderRadius:10,overflow:"hidden"}}><div style={{height:"100%",width:updateProgress+"%",background:"#d4af37",transition:"width .2s"}}/></div>
              <div style={{fontSize:12,color:"#aeb8c7",marginTop:6}}>{updateProgress}% downloaded</div>
            </div>}
          </div>}
          {updateError && <div className="error-box">{updateError}</div>}
          {!updateInfo && !updateError && <div style={{background:"#10151e",border:"1px solid #293244",borderRadius:14,padding:20,marginBottom:18,color:"#b7c0ce",lineHeight:1.7}}>
            <strong style={{color:"#fff"}}>Release notes will appear here.</strong><br/>
            When a new version is published, this page will show its version number and changes. You can then download and install it.
          </div>}
          <div className="button-row">
            <button className="primary-btn" disabled={updateBusy} onClick={async()=>{
              setUpdateBusy(true); setUpdateError(""); setUpdateStatus("Checking GitHub for updates…");
              try { const result = await window.churchStudio?.checkForUpdates?.(); if (!result?.ok) { setUpdateBusy(false); setUpdateError(result?.error || "Could not check for updates."); } }
              catch(error) { setUpdateBusy(false); setUpdateError(error?.message || "Could not check for updates."); }
            }}>↻ Check for updates</button>
          </div>
          <p className="notice">Internet access is used only by this Updates Centre to contact the release server. Bible, hymns, presentations, media and NDI remain local and offline-ready. Close other running copies before installing an update.</p>
        </section>}

        {active === "Bible" && <section className="content-panel">
          <div className="panel-heading"><div><h2>King James Version Bible</h2><p>Complete offline Scripture library · 66 books</p></div><span className="small-label">{bible ? "KJV READY" : "LOADING KJV"}</span></div>
          {bibleError && <div className="error-box">{bibleError}</div>}
          {!bible && !bibleError && <div className="loading-box">Loading the offline KJV Bible…</div>}
          {bible && <>
            <div className="bible-search-row"><input value={bibleSearch} onChange={e=>setBibleSearch(e.target.value)} onKeyDown={e=>e.key==="Enter"&&runBibleSearch()} placeholder="Search words in the Bible, e.g. faith, love, salvation"/><button className="secondary-btn" onClick={runBibleSearch}>Search Bible</button></div>
            {searchResults.length > 0 && <div className="search-results"><div className="result-heading">{searchResults.length} result(s) · showing up to 150</div>{searchResults.map((r,i)=><button key={i} className="search-result" onClick={()=>selectSearchResult(r)}><strong>{r.book} {r.chapter}:{r.verse}</strong><span>{r.text}</span></button>)}</div>}
            {bibleSearch && searchResults.length===0 && <div className="hint">Press Enter or Search Bible to search all 66 books.</div>}
            <div className="bible-controls">
              <label>Book<select value={book} onChange={e=>changeBook(e.target.value)}>{bookNames.map(n=><option key={n}>{n}</option>)}</select></label>
              <label>Chapter<select value={chapter} onChange={e=>{setChapter(Number(e.target.value));setSelectedVerse(1)}}>{chapters.map((_,i)=><option key={i} value={i+1}>{i+1}</option>)}</select></label>
              <label>Verse<select value={selectedVerse} onChange={e=>setSelectedVerse(Number(e.target.value))}>{verses.map((_,i)=><option key={i} value={i+1}>{i+1}</option>)}</select></label>
            </div>
            <div className="scripture-card" style={{backgroundImage:`linear-gradient(rgba(4,6,11,.58),rgba(4,6,11,.68)),url(./backgrounds/${(BIBLE_BACKGROUNDS.find(item=>item.id===(settings.backgroundId||"bg-01"))||BIBLE_BACKGROUNDS[0]).file})`,backgroundSize:"cover",backgroundPosition:"center"}}><div className="scripture-reference">{activeVerseRef} · KJV</div><div className="scripture-text" style={{fontFamily: settings.fontFamily || "Georgia", fontSize: `${settings.scriptureFontSize || 42}px`}}>{currentText || "Choose a book, chapter and verse."}</div><div className="scripture-actions"><button className="secondary-btn" disabled={selectedVerse<=1} onClick={()=>setSelectedVerse(v=>v-1)}>← Previous verse</button><button className="secondary-btn" disabled={selectedVerse>=verses.length} onClick={()=>setSelectedVerse(v=>v+1)}>Next verse →</button><button className="primary-btn" onClick={()=>sendLive(currentText,activeVerseRef+" · KJV","Bible")}>Send verse to live</button></div></div>
            <div className="chapter-list"><div className="result-heading">Chapter {chapter} · Select a verse</div>{verses.map((text,i)=><button key={i} className={`verse-row ${selectedVerse===i+1?"chosen":""}`} onClick={()=>setSelectedVerse(i+1)}><b>{i+1}</b><span>{text}</span></button>)}</div>
          </>}
        </section>}

        {(active === "Hymns" || active === "Songs") && <section className="content-panel">
          <div className="panel-heading"><div><h2>{active === "Hymns" ? "Hymn Library" : "Contemporary Songs"}</h2><p>{active === "Songs" ? "Songs added by your church · saved offline" : "300-number Watchman hymn collection plus your church-added hymns"}</p></div><span className="small-label">{active === "Hymns" ? watchmanHymns.length + songs.filter(song => song.category === "traditional").length : songs.filter(song => song.category === "contemporary").length} ITEMS</span></div>
          <div className="library-toolbar">
            {active === "Hymns" ? <div className="category-tabs"><button className={songCategory==="traditional"?"tab active":"tab"} onClick={()=>{setSongCategory("traditional");setStanza(0)}}>Traditional hymns</button><button className={songCategory==="contemporary"?"tab active":"tab"} onClick={()=>{setSongCategory("contemporary");setStanza(0)}}>Contemporary songs</button></div> : <div className="category-tabs"><span className="tab active">Contemporary worship songs</span><button className="tab" onClick={()=>setActive("Hymns")}>Browse all hymns</button></div>}
            <input className="song-search" value={songSearch} onChange={e=>setSongSearch(e.target.value)} placeholder={active === "Hymns" ? "Search hymn number, title or lyrics" : "Search song title or lyrics"}/>
            {active === "Hymns" && <div className="hymn-jump"><input aria-label="Go to hymn number" inputMode="numeric" value={hymnNumberJump} onChange={e=>setHymnNumberJump(e.target.value)} onKeyDown={e=>e.key === "Enter" && jumpToHymnNumber()} placeholder="Hymn no."/><button className="secondary-btn" onClick={jumpToHymnNumber}>Go to hymn</button><select aria-label="Select a hymn directly" value={selectedSong?.id || ""} onChange={e=>{setSelectedSongId(e.target.value);setStanza(0);setEditingSong(false)}}><option value="">Choose a hymn…</option>{filteredSongs.map(song=><option key={song.id} value={song.id}>{song.number ? "No. " + song.number + " — " : ""}{song.title}</option>)}</select></div>}
            <button className="primary-btn" onClick={()=>startNewSong(active==="Songs"?"contemporary":songCategory)}>＋ Add {active==="Songs"?"song":"hymn"}</button>
          </div>
          {active === "Hymns" && hymnJumpMessage && <div className="hint">{hymnJumpMessage}</div>}
          {active === "Hymns" && watchmanError && <div className="error-box">{watchmanError}</div>}
          {active === "Hymns" && !watchmanError && watchmanHymns.length === 0 && <div className="loading-box">Loading the 300 Watchman hymns…</div>}
          <div className="library-layout">
            <div className="song-list">{filteredSongs.map(song=><button key={song.id} className={`song-list-item ${selectedSong?.id===song.id?"chosen":""}`} onClick={()=>{setSelectedSongId(song.id);setStanza(0);setEditingSong(false)}}><strong>{song.number ? "№ " + song.number + " · " : ""}{song.title}</strong><small>{song.author || (song.source === "watchman" ? "Watchman Hymn Collection" : "Author not specified")} · {song.verses.length} sections</small><span>{song.source === "watchman" ? "WATCHMAN HYMN" : song.source === "custom" ? "CHURCH ADDED" : song.category==="traditional"?"TRADITIONAL":"CONTEMPORARY"}</span></button>)}{filteredSongs.length===0&&<div className="empty-state">No songs here yet. Add a song or paste lyrics you have permission to use.</div>}</div>
            <div className="song-detail">
              {editingSong || (!selectedSong && songTitle) ? <div className="song-editor"><h3>{editingSong?"Edit lyrics":"Add to library"}</h3><label>Title<input value={songTitle} onChange={e=>setSongTitle(e.target.value)} placeholder="Song title"/></label><label>Author / songwriter<input value={songAuthor} onChange={e=>setSongAuthor(e.target.value)} placeholder="Optional"/></label><label>Library<select value={songCategory} onChange={e=>setSongCategory(e.target.value)}><option value="traditional">Traditional hymn</option><option value="contemporary">Contemporary song</option></select></label><label>Lyrics<textarea value={songLyrics} onChange={e=>setSongLyrics(e.target.value)} placeholder="Enter stanza 1, leave a blank line, then stanza 2…"/></label><div className="button-row"><button className="primary-btn" onClick={saveSong}>Save offline</button><button className="secondary-btn" onClick={()=>{setEditingSong(false);setSongTitle("");setSongAuthor("");setSongLyrics("")}}>Cancel</button></div><p className="hint">Separate stanzas with one blank line. Your saved lyrics remain on this computer.</p></div>
              : selectedSong ? <><div className="song-detail-head"><div><div className="small-label">{selectedSong.source === "watchman" ? "WATCHMAN HYMN · NO. " + selectedSong.number : selectedSong.category==="traditional"?"TRADITIONAL HYMN":"CONTEMPORARY WORSHIP SONG"}</div><h2>{selectedSong.title}</h2><p>{selectedSong.author || (selectedSong.source === "watchman" ? "Watchman Hymn Collection" : "Author not specified")}</p></div>{selectedSong.source !== "watchman" && <button className="secondary-btn" onClick={()=>startEditSong(selectedSong)}>Edit</button>}</div><div className="stanza-count">{selectedSong.sections ? (selectedSong.sections[stanza]?.type === "chorus" ? "CHORUS" : "VERSE") : "STANZA"}{selectedSong.sections?.[stanza]?.verse ? " " + selectedSong.sections[stanza].verse : selectedSong.sections ? "" : " " + (stanza+1)} · SECTION {stanza+1} OF {selectedSong.verses.length}</div><div className="lyrics-display" style={{fontFamily: settings.fontFamily || "Georgia", fontSize: `${Math.max(18, (settings.scriptureFontSize || 42) * 0.62)}px`,backgroundImage:`linear-gradient(rgba(4,6,11,.58),rgba(4,6,11,.68)),url(./backgrounds/${(BIBLE_BACKGROUNDS.find(item=>item.id===(settings.backgroundId||"bg-01"))||BIBLE_BACKGROUNDS[0]).file})`,backgroundSize:"cover",backgroundPosition:"center"}}>{currentStanza}</div><div className="stanza-controls"><button className="secondary-btn" disabled={stanza<=0} onClick={()=>setStanza(s=>s-1)}>← Previous</button><label className="section-jump">Go to section<select value={stanza} onChange={e=>setStanza(Number(e.target.value))}>{selectedSong.verses.map((_,index)=><option key={index} value={index}>{selectedSong.sections?.[index]?.type === "chorus" ? "Chorus" : "Verse"} {selectedSong.sections?.[index]?.verse || index+1}</option>)}</select></label><button className="secondary-btn" disabled={stanza>=selectedSong.verses.length-1} onClick={()=>setStanza(s=>s+1)}>Next stanza →</button><button className="primary-btn" onClick={()=>sendLive(currentStanza,(selectedSong.number ? "Hymn " + selectedSong.number + " · " : "") + selectedSong.title + " · " + (selectedSong.sections?.[stanza]?.type === "chorus" ? "Chorus" : "Verse") + " " + (selectedSong.sections?.[stanza]?.verse || (stanza+1)), "Song")}>Send section to live</button></div><div className="song-footer"><span>Saved locally on this computer</span>{selectedSong.source !== "watchman" && <button className="text-danger" onClick={()=>deleteSong(selectedSong)}>Delete item</button>}</div></> : <div className="empty-state">Select a hymn or song, or add your own lyrics.</div>}
            </div>
          </div>
          <p className="notice">The Watchman collection is loaded from public/data/watchman-hymns.json and works offline after installation. Church-added lyrics remain stored separately on this computer.</p>
        </section>}


        {active === "Presentations" && <section className="content-panel builder-panel">
          <div className="panel-heading"><div><h2>Presentation Builder</h2><p>Create and save service slides, then send any slide directly to the live OBS output.</p></div><span className="small-label">{presentations.length} PRESENTATIONS</span></div>
          <div className="builder-create"><input value={presentationName} onChange={e=>setPresentationName(e.target.value)} placeholder="New presentation name, e.g. Sunday Service"/><button className="primary-btn" onClick={createPresentation}>Create presentation</button></div>
          {presentations.length === 0 ? <div className="empty-state"><div className="coming-icon">▣</div><h3>No presentations yet</h3><p>Create a presentation above, then add title and scripture or message slides.</p></div> : <div className="presentation-layout">
            <div className="presentation-list">{presentations.map(item=><button key={item.id} className={`presentation-item ${selectedPresentation?.id===item.id?"chosen":""}`} onClick={()=>setSelectedPresentationId(item.id)}><strong>{item.title}</strong><small>{item.slides.length} slides</small></button>)}</div>
            <div className="presentation-editor">{selectedPresentation && <><div className="builder-heading"><div><h3>{selectedPresentation.title}</h3><p>{selectedPresentation.slides.length} saved slides</p></div><button className="text-danger" onClick={()=>deletePresentation(selectedPresentation.id)}>Delete presentation</button></div>
              <div className="slide-form"><label>Slide heading<input value={slideTitle} onChange={e=>setSlideTitle(e.target.value)} placeholder="e.g. Welcome to Worship"/></label><label>Slide text / scripture / message<textarea value={slideText} onChange={e=>setSlideText(e.target.value)} placeholder="Type the words you want on the projector"/></label><div className="button-row"><button className="primary-btn" onClick={addPresentationSlide} disabled={!slideText.trim()}>{editingSlideId ? "Save slide changes" : "Add slide"}</button>{editingSlideId && <button className="secondary-btn" onClick={()=>{setEditingSlideId("");setSlideTitle("");setSlideText("")}}>Cancel edit</button>}</div></div>
              <div className="slide-list">{selectedPresentation.slides.map((slide,index)=><article className="slide-item" key={slide.id}><div><span className="small-label">SLIDE {index+1}</span><h4>{slide.title}</h4><p>{slide.text}</p></div><div className="slide-actions"><button className="secondary-btn" onClick={()=>editPresentationSlide(slide)}>Edit</button><button className="secondary-btn" disabled={index===0} onClick={()=>movePresentationSlide(slide.id,-1)}>↑</button><button className="secondary-btn" disabled={index===selectedPresentation.slides.length-1} onClick={()=>movePresentationSlide(slide.id,1)}>↓</button><button className="primary-btn" onClick={()=>sendLive(slide.text, selectedPresentation.title + " · " + slide.title, "Presentation")}>Send live</button><button className="text-danger" onClick={()=>setPresentations(prev=>prev.map(item=>item.id===selectedPresentation.id?{...item,slides:item.slides.filter(entry=>entry.id!==slide.id)}:item))}>Remove</button></div></article>)}{selectedPresentation.slides.length===0&&<div className="empty-state">Your presentation is empty. Add the first slide above.</div>}</div>
            </>}</div>
          </div>}
        </section>}

        {active === "Announcements" && <section className="content-panel builder-panel">
          <div className="panel-heading"><div><h2>Church Announcements</h2><p>Prepare service notices and send them to the projector with one click.</p></div><span className="small-label">{announcements.length} SAVED NOTICES</span></div>
          <div className="announcement-form"><label>Announcement title<input value={announcementTitle} onChange={e=>setAnnouncementTitle(e.target.value)} placeholder="e.g. Midweek Bible Study"/></label><label>Announcement details<textarea value={announcementBody} onChange={e=>setAnnouncementBody(e.target.value)} placeholder="Enter date, time, venue and other details"/></label><div className="button-row"><button className="primary-btn" onClick={saveAnnouncement} disabled={!announcementTitle.trim() || !announcementBody.trim()}>{editingAnnouncementId ? "Save changes" : "Save announcement"}</button>{editingAnnouncementId && <button className="secondary-btn" onClick={()=>{setEditingAnnouncementId("");setAnnouncementTitle("");setAnnouncementBody("")}}>Cancel edit</button>}</div></div>
          <div className="announcement-list">{announcements.map(item=><article className="announcement-item" key={item.id}><div><span className="small-label">CHURCH NOTICE</span><h3>{item.title}</h3><p>{item.body}</p></div><div className="slide-actions"><button className="secondary-btn" onClick={()=>{setEditingAnnouncementId(item.id);setAnnouncementTitle(item.title);setAnnouncementBody(item.body)}}>Edit</button><button className="primary-btn" onClick={()=>sendLive(item.title + "\n\n" + item.body, "CHURCH ANNOUNCEMENT", "Announcement")}>Send live</button><button className="text-danger" onClick={()=>{setAnnouncements(prev=>prev.filter(entry=>entry.id!==item.id));if(editingAnnouncementId===item.id){setEditingAnnouncementId("");setAnnouncementTitle("");setAnnouncementBody("")}}}>Delete</button></div></article>)}{announcements.length===0&&<div className="empty-state"><div className="coming-icon">◷</div><h3>No announcements saved</h3><p>Create your first notice above. It will remain on this computer after closing the app.</p></div>}</div>
        </section>}

        {active === "Media Library" && <section className="content-panel media-panel">
          <div className="panel-heading"><div><h2>Media Library</h2><p>Import and keep your church images, videos and audio on this computer.</p></div><span className="small-label">{mediaItems.length} FILES SAVED</span></div>
          <div className="media-toolbar">
            <label className="primary-btn media-upload">＋ Add media files<input type="file" accept="image/*,video/*,audio/*" multiple onChange={addMediaFiles}/></label>
            <span className="hint">Images, video and audio · stored locally for offline use</span>
          </div>
          {mediaError && <div className="error-box">{mediaError}</div>}
          {mediaItems.length === 0 ? <div className="empty-state media-empty"><div className="coming-icon">▧</div><h3>Your media library is ready</h3><p>Add photos, video clips or audio tracks to use in church presentations.</p></div> :
            <div className="media-grid">{mediaItems.map(item => <article className="media-card" key={item.id}>
              <div className="media-preview"><MediaAssetPreview item={item}/></div>
              <div className="media-meta"><strong title={item.name}>{item.name}</strong><small>{item.type} · {(item.size / 1048576).toFixed(1)} MB</small></div>
              <div className="media-card-actions">{item.type === "Image" && <button className="primary-btn" onClick={() => sendLive("", item.name, "Media", URL.createObjectURL(item.blob))}>Send image live</button>}{item.type === "Video" && <button className="primary-btn" onClick={() => sendLive("", item.name + " · MUTED VIDEO", "Media Video", URL.createObjectURL(item.blob))}>Send muted video live</button>}<button className="text-danger" onClick={() => removeMedia(item)}>Remove</button></div>
            </article>)}</div>}
          <p className="notice">Images and muted video clips can be sent to the NDI picture output. Audio is kept in the local media library; this NDI sender currently transmits video frames, not sound.</p>
        </section>}

        {active === "Lower Thirds" && <section className="content-panel production-panel">
          <div className="panel-heading"><div><h2>Live Lower Thirds</h2><p>Connected graphics for Bible verses, hymns, songs and preacher identification.</p></div><span className="small-label">LIVE GRAPHICS</span></div>
          <div className="production-grid">
            <div className="settings-section">
              <h3>Content source</h3>
              <label className="setting-row"><span>Automatically follow live content</span><input type="checkbox" checked={lowerThirdMode === "automatic"} onChange={e=>setLowerThirdMode(e.target.checked ? "automatic" : "manual")}/></label>
              <label>Preacher / speaker name<input value={lowerThirdName} onChange={e=>setLowerThirdName(e.target.value)} placeholder="Enter speaker name"/></label>
              <label>Role / service title<input value={lowerThirdTitle} onChange={e=>setLowerThirdTitle(e.target.value)} placeholder="Pastor · Sunday service"/></label>
              <label>Preacher video (green-screen recording)<input type="file" accept="video/*" onChange={e=>{const file=e.target.files && e.target.files[0];if(file){setPreacherVideoUrl(URL.createObjectURL(file));setPreacherVideoName(file.name);}}}/></label>
              <label className="setting-row"><span>Remove green background (chroma key)</span><input type="checkbox" checked={chromaKeyEnabled} onChange={e=>setChromaKeyEnabled(e.target.checked)}/></label>
              <label>Green-screen sensitivity <input type="range" min="20" max="140" value={chromaThreshold} onChange={e=>setChromaThreshold(Number(e.target.value))}/></label>
              <p className="hint">{preacherVideoName || "Choose a preacher video recorded against a green screen."}</p>
              <label>Graphic style<select value={lowerThirdStyle} onChange={e=>setLowerThirdStyle(e.target.value)}><option value="gold">Premium gold</option><option value="white">Clean white</option><option value="blue">Broadcast blue</option></select></label>
              <label className="setting-row"><span>Show lower third on Program</span><input type="checkbox" checked={lowerThirdEnabled} onChange={e=>setLowerThirdEnabled(e.target.checked)}/></label>
              <div className="button-row"><button className="primary-btn" onClick={()=>sendLive(lowerThirdName,lowerThirdTitle,"Lower Third")}>Send speaker graphic live</button><button className="secondary-btn" disabled={!preacherVideoUrl} onClick={()=>sendLive(preacherVideoName || "PREACHER",lowerThirdTitle,"Preacher Video")}>Send keyed preacher live</button><button className="secondary-btn" onClick={()=>setLowerThirdEnabled(false)}>Hide graphic</button></div>
            </div>
            <div className={"lower-third-preview " + lowerThirdStyle}>
              <div className="lt-preview-screen"><span className="lt-preview-kicker">CHURCH MEDIA STUDIO · LIVE</span><strong>{lowerThirdMode === "automatic" && isLive ? liveSlide.reference : lowerThirdName || "SPEAKER NAME"}</strong><small>{lowerThirdMode === "automatic" && isLive ? liveSlide.text : lowerThirdTitle || "TITLE / SERVICE"}</small></div>
              <p>Automatic mode follows the live Bible reference, hymn/song title and current live text. Manual mode uses the speaker details above.</p>
            </div>
          </div>
          <div className="notice">Preacher video compositing and chroma-key controls are part of the green-screen integration stage. This panel currently manages live lower-third graphics and content synchronization.</div>
        </section>}

        {active === "Templates & 3D" && <section className="content-panel production-panel">
          <div className="panel-heading"><div><h2>Motion Templates & 3D Effects</h2><p>Choose a motion treatment for live scripture, worship lyrics, countdowns and slides.</p></div><span className="small-label">MOTION GRAPHICS</span></div>
          <div className="template-showcase"><div className="template-orb"><div className="orb-core">✦</div><i></i><b></b></div><div><span className="small-label">LIVE PREVIEW STYLE</span><h3>Premium cinematic 3D</h3><p>Layered depth, perspective rotation, gold light trails and a smooth reveal.</p></div></div>
          <div className="production-grid">
            <label>Transition style<select value={animationStyle} onChange={e=>setAnimationStyle(e.target.value)}><option value="cinematic-3d">Cinematic 3D reveal</option><option value="flip-3d">3D page flip</option><option value="zoom-depth">Depth zoom</option><option value="gold-sweep">Gold light sweep</option><option value="soft-fade">Soft fade</option></select></label>
            <label>Transition duration<select value={animationDuration} onChange={e=>setAnimationDuration(Number(e.target.value))}><option value="500">Fast · 0.5 seconds</option><option value="900">Standard · 0.9 seconds</option><option value="1400">Cinematic · 1.4 seconds</option><option value="2000">Slow · 2 seconds</option></select></label>
            <div className="settings-section"><h3>Animation coverage</h3><p>Bible · Hymns · Songs · Presentations · Countdown · Announcements · Lower thirds</p><button className="primary-btn" onClick={()=>setTransitionToken(value=>value+1)}>Preview animation</button></div>
          </div>
          <div className="notice">Motion effects are applied to the Program monitor. The NDI-rendered output receives the live content frame; animated NDI overlays will be expanded with the video compositor.</div>
        </section>}

        {active === "Service Planner" && <section className="content-panel production-panel"><div className="panel-heading"><div><h2>Service Planner</h2><p>Plan a service sequence and prepare its content.</p></div><span className="small-label">SERVICE WORKSPACE</span></div><div className="empty-state"><h3>Service planning workspace</h3><p>Use Presentations, Bible, Hymns and Announcements to prepare the current service. A saved run-of-show editor is scheduled for the next service-planner phase.</p></div></section>}
        {active === "Stage Views" && <section className="content-panel production-panel"><div className="panel-heading"><div><h2>Stage Views</h2><p>Operator-facing information for the platform display.</p></div><span className="small-label">STAGE OUTPUT</span></div><div className="empty-state"><h3>Stage display workspace</h3><p>Stage-specific display routing and presenter notes are scheduled for the stage-output integration phase.</p></div></section>}
        {active === "Recording Studio" && <section className="content-panel production-panel"><div className="panel-heading"><div><h2>Recording Studio</h2><p>Recording controls and session management.</p></div><span className="small-label">RECORDING</span></div><div className="empty-state"><h3>Recording integration</h3><p>The complete capture and recording engine is not yet present in this source version. Recording controls will be added with the audio/video pipeline.</p></div></section>}

        {active === "Countdown" && <section className="content-panel countdown-panel">
          <div className="panel-heading"><div><h2>Service Countdown</h2><p>Prepare a countdown for the start of worship, service or a presentation.</p></div><span className="small-label">LOCAL TIMER</span></div>
          <div className="countdown-stage">
            <div className="countdown-display">{String(countdownMinutes).padStart(2,"0")}<span>:</span>{String(countdownSeconds).padStart(2,"0")}</div>
            <div className="countdown-caption">{countdownRunning ? "COUNTDOWN RUNNING" : countdownMinutes === 0 && countdownSeconds === 0 ? "TIME IS UP" : "READY TO BEGIN"}</div>
            <div className="countdown-controls">
              <label>Duration in minutes<input type="number" min="0" max="999" value={countdownMinutes} disabled={countdownRunning} onChange={e=>setCountdownFromMinutes(e.target.value)}/></label>
              <button className="primary-btn" onClick={()=>setCountdownRunning(true)} disabled={countdownRunning || (countdownMinutes===0 && countdownSeconds===0)}>Start</button>
              <button className="secondary-btn" onClick={()=>setCountdownRunning(false)} disabled={!countdownRunning}>Pause</button>
              <button className="secondary-btn" onClick={()=>setCountdownRunning(true)} disabled={countdownRunning || (countdownMinutes===0 && countdownSeconds===0)}>Resume</button>
              <button className="secondary-btn" onClick={resetCountdown}>Reset to 05:00</button>
              <button className="secondary-btn" onClick={sendCountdownLive}>Send time to live</button>
            </div>
          </div>
          <p className="notice">This first countdown version runs inside Church Media Studio. Sending the time updates the local Program monitor; a full-screen countdown output will be added with presentation controls.</p>
        </section>}

        {active === "Settings" && <section className="content-panel settings-panel">
          <div className="panel-heading"><div><h2>Studio settings</h2><p>Configure this computer's local Church Media Studio workspace.</p></div><span className="small-label">SAVED ON THIS COMPUTER</span></div>
          <div className="settings-section">
            <h3>Appearance</h3>
            <div className="setting-row"><div><strong>Interface text size</strong><p>Adjust the size of text throughout the workspace.</p></div>
              <select value={settings.fontSize} onChange={e=>updateSetting("fontSize",e.target.value)}><option value="small">Small</option><option value="medium">Medium</option><option value="large">Large</option></select>
            </div>
          </div>
          <div className="settings-section">
            <h3>Bible and hymn slide design</h3>
            <div className="setting-row"><div><strong>Presentation font style</strong><p>Choose the typeface used for Bible verses and hymn lyrics on the live NDI output.</p></div>
              <select value={settings.fontFamily || "Georgia"} onChange={e=>updateSetting("fontFamily",e.target.value)}>{FONT_CHOICES.map(([value,label])=><option key={value} value={value}>{label}</option>)}</select>
            </div>
            <div className="setting-row"><div><strong>Scripture and hymn font size</strong><p>Set the presentation text size. Long passages automatically fit the live screen.</p></div><div className="font-size-control"><input type="range" min="20" max="64" step="1" value={settings.scriptureFontSize || 42} onChange={e=>updateSetting("scriptureFontSize",Number(e.target.value))}/><strong>{settings.scriptureFontSize || 42}px</strong></div></div>
            <div className="setting-row"><div><strong>Biblical background picture</strong><p>Choose from 15 scenic biblical backgrounds for Bible and hymn presentation slides.</p></div>
              <select value={settings.backgroundId || "bg-01"} onChange={e=>updateSetting("backgroundId",e.target.value)}>{BIBLE_BACKGROUNDS.map(item=><option key={item.id} value={item.id}>{item.name}</option>)}</select>
            </div>
            <div className="background-gallery">{BIBLE_BACKGROUNDS.map(item=><button type="button" key={item.id} className={`background-choice ${(settings.backgroundId || "bg-01")===item.id?"selected":""}`} onClick={()=>updateSetting("backgroundId",item.id)} title={item.name}><img src={`./backgrounds/${item.file}`} alt={item.name}/><span>{item.name}</span></button>)}</div>
            <div className="credit-preview">{CREATOR_CREDIT}</div>
          </div>
          <div className="settings-section">
            <h3>Workspace</h3>
            <div className="setting-row"><div><strong>Show presentation output monitors</strong><p>Keep the Preview and Program / Live panel visible below each workspace.</p></div>
              <label className="switch"><input type="checkbox" checked={settings.showOutput} onChange={e=>updateSetting("showOutput",e.target.checked)}/><span></span></label>
            </div>
            <div className="setting-row"><div><strong>Startup page</strong><p>Choose which page opens when the app starts. This preference is saved for a future startup integration.</p></div>
              <select value={settings.startPage} onChange={e=>updateSetting("startPage",e.target.value)}><option>Dashboard</option><option>Bible</option><option>Hymns</option><option>Songs</option></select>
            </div>
          </div>
          <div className="settings-section">
            <h3>Library safety</h3>
            <div className="setting-row"><div><strong>Ask before deleting a song</strong><p>Show a confirmation before permanently removing a saved song from this computer.</p></div>
              <label className="switch"><input type="checkbox" checked={settings.confirmDelete} onChange={e=>updateSetting("confirmDelete",e.target.checked)}/><span></span></label>
            </div>
          </div>
          <div className="settings-footer"><span>Settings are stored locally. No account or internet connection is required.</span><button className="secondary-btn" onClick={resetSettings}>Restore defaults</button></div>
        </section>}

        {active === "NDI & OBS" && <section className="content-panel ndi-panel">
          <div className="panel-heading"><div><h2>NDI & OBS Output</h2><p>Send the Church Media Studio Program screen to OBS over your local network.</p></div><span className="small-label">NDI 6 · 64-BIT</span></div>
          <div className="ndi-source-card">
            <div className="ndi-source-icon">◉</div>
            <div className="ndi-source-info"><strong>CHURCH MEDIA STUDIO</strong><span>NDI network source name</span><small>{ndiStatus}</small></div>
            <span className={`ndi-state ${ndiRunning ? "active" : ""}`}>{ndiRunning ? "SENDER ON" : "STOPPED"}</span>
          </div>
          {ndiError && <div className="error-box">{ndiError}</div>}
          <div className="ndi-actions">
            <button className="primary-btn" onClick={startNdi} disabled={ndiRunning}>Start NDI Sender</button>
            <button className="secondary-btn" onClick={stopNdi} disabled={!ndiRunning}>Stop NDI Sender</button>
          </div>
          <div className="settings-section">
            <h3>Connection instructions</h3>
            <ol className="ndi-steps">
              <li>Start the NDI sender above. Keep Church Media Studio open.</li>
              <li>Open OBS Studio and add a source using <strong>NDI Source</strong> from DistroAV.</li>
              <li>Choose <strong>CHURCH MEDIA STUDIO</strong> from the source list.</li>
              <li>Put a Bible verse or song on the Program screen to see it in OBS.</li>
            </ol>
          </div>
          <p className="notice">This sender transmits the Program text and status as a 960 × 540 video stream at approximately 10 frames per second. Audio and full-resolution media playback are not included in this first NDI stage. Both computers must be on the same network. Windows Firewall may ask you to allow network access.</p>
        </section>}

        <canvas ref={ndiCanvasRef} width="960" height="540" className="ndi-hidden-canvas" aria-hidden="true" />

        {settings.showOutput && <section className="output-area"><div className="output-header"><div><h3>Presentation output</h3><p>Local program monitor · NDI network output available</p></div><span className={`live-indicator ${isLive?"on":""}`}>{isLive?"● LIVE":"○ STANDBY"}</span></div><div className="screen-grid"><div><div className="screen-label">PREVIEW</div><div className="monitor" style={{backgroundImage:`linear-gradient(rgba(4,6,11,.55),rgba(4,6,11,.65)),url(./backgrounds/${(BIBLE_BACKGROUNDS.find(item=>item.id===(settings.backgroundId||"bg-01"))||BIBLE_BACKGROUNDS[0]).file})`,backgroundSize:"cover",backgroundPosition:"center"}}><span style={{fontFamily:settings.fontFamily||"Georgia",fontSize:`${Math.max(12,(settings.scriptureFontSize||42)*0.34)}px`}}>{active==="Bible"?currentText:active==="Hymns"||active==="Songs"?currentStanza:"Your selected slide will appear here"}</span><small>{active==="Bible"?activeVerseRef: (selectedSong?.number ? "Hymn " + selectedSong.number + " · " : "") + (selectedSong?.title || "CHURCH MEDIA STUDIO")}</small></div></div><div><div className="screen-label">PROGRAM / LIVE</div><div className="monitor program" style={{backgroundImage:`linear-gradient(rgba(4,6,11,.55),rgba(4,6,11,.65)),url(./backgrounds/${(BIBLE_BACKGROUNDS.find(item=>item.id===(settings.backgroundId||"bg-01"))||BIBLE_BACKGROUNDS[0]).file})`,backgroundSize:"cover",backgroundPosition:"center"}}><canvas ref={chromaCanvasRef} width="960" height="540" className="preacher-key-canvas" style={{display:isLive && liveSlide.kind === "Preacher Video" ? "block" : "none"}}/><span key={transitionToken} className={"program-content motion-" + animationStyle} style={{fontFamily:settings.fontFamily||"Georgia",fontSize:`${Math.max(12,(settings.scriptureFontSize||42)*0.34)}px`,animationDuration:animationDuration + "ms",display:isLive && liveSlide.kind === "Preacher Video" ? "none" : "block"}}>{isLive?liveSlide.text:"No live slide"}</span><small>{isLive?liveSlide.reference:"WAITING FOR OUTPUT"}</small>{isLive && lowerThirdEnabled && <div className={"program-lower-third lt-" + lowerThirdStyle}><strong>{lowerThirdMode === "automatic" ? liveSlide.reference : lowerThirdName}</strong><span>{lowerThirdMode === "automatic" ? liveSlide.text : lowerThirdTitle}</span></div>}</div></div></div><div className="output-actions"><button className="secondary-btn" onClick={()=>setIsLive(false)}>Clear live screen</button><span>{isLive?liveSlide.kind+" is on the local program monitor":"Ready for presentation"}</span></div></section>}
      <footer>CHURCH MEDIA STUDIO <span>•</span> PROFESSIONAL EDITION <span>•</span> VERSION 1.4.0 <span>•</span> {CREATOR_CREDIT}</footer>
      </main>
    </div>
  );
}
