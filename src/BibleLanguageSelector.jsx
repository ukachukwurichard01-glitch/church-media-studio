import React, { useEffect, useMemo, useState } from "react";

const API = "https://bible.helloao.org/api";

export default function BibleLanguageSelector({ book, chapter, onVerses, onName }) {
  const [translations, setTranslations] = useState([]);
  const [language, setLanguage] = useState("English");
  const [translationId, setTranslationId] = useState("KJV");
  const [status, setStatus] = useState("Offline KJV Bible selected");
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    fetch(API + "/available_translations.json")
      .then(r => { if (!r.ok) throw new Error("Could not load the online translation list."); return r.json(); })
      .then(data => {
        if (!active) return;
        const all = (data.translations || []).filter(t => Number(t.numberOfBooks) === 66 && (t.availableFormats || []).includes("json"));
        setTranslations(all);
      })
      .catch(e => { if (active) setError(e.message || "Translation list unavailable."); });
    return () => { active = false; };
  }, []);

  const languages = useMemo(() => ["English", "Igbo", "Hausa", "Yoruba"], []);
  const options = useMemo(() => translations.filter(t => {
    const name = String(t.languageEnglishName || t.languageName || "").toLowerCase();
    return language === "English" ? name === "english" : name === language.toLowerCase();
  }), [translations, language]);

  useEffect(() => {
    let active = true;
    if (translationId === "KJV") {
      onVerses(null);
      onName("King James Version (KJV · offline)");
      setStatus("Offline KJV Bible selected");
      return () => { active = false; };
    }
    const translation = translations.find(t => String(t.id || t.shortName) === translationId);
    if (!translation) return () => { active = false; };
    const load = async () => {
      setError("");
      setStatus("Loading " + (translation.name || translationId) + "…");
      try {
        const bookResponse = await fetch(API + "/" + encodeURIComponent(translationId) + "/books.json");
        if (!bookResponse.ok) throw new Error("This translation's book list is unavailable.");
        const bookData = await bookResponse.json();
        const found = (bookData.books || []).find(b =>
          String(b.commonName || b.name || "").toLowerCase() === book.toLowerCase()
        );
        if (!found) throw new Error(book + " is not included in this translation.");
        const chapterResponse = await fetch(API + "/" + encodeURIComponent(translationId) + "/" + encodeURIComponent(found.id) + "/" + chapter + ".simple.json");
        if (!chapterResponse.ok) throw new Error("Could not load " + book + " " + chapter + " in this translation.");
        const chapterData = await chapterResponse.json();
        const verses = (chapterData.chapter?.content || [])
          .filter(item => item.type === "verse")
          .map(item => String(item.text || ""));
        if (!verses.length) throw new Error("No verses were returned for this chapter.");
        if (!active) return;
        onVerses(verses);
        onName(translation.name || translation.englishName || translationId);
        setStatus("Online translation loaded · " + verses.length + " verses");
      } catch (e) {
        if (!active) return;
        onVerses(null);
        setError(e.message || "Translation could not be loaded.");
        setStatus("Translation unavailable");
      }
    };
    load();
    return () => { active = false; };
  }, [translationId, translations, book, chapter, onVerses, onName]);

  const changeLanguage = value => {
    setLanguage(value);
    setTranslationId(value === "English" ? "KJV" : "");
    onVerses(null);
    onName(value === "English" ? "King James Version (KJV · offline)" : value + " Bible");
    setStatus(value === "English" ? "Offline KJV Bible selected" : "Choose an available " + value + " Bible");
  };

  return <div className="bible-language-tools">
    <label>Bible language<select value={language} onChange={e=>changeLanguage(e.target.value)}>{languages.map(x=><option key={x}>{x}</option>)}</select></label>
    {language !== "English" && <label>Translation<select value={translationId} onChange={e=>setTranslationId(e.target.value)}>
      <option value="">Choose {language} translation…</option>
      {options.map(t=><option key={t.id || t.shortName} value={t.id || t.shortName}>{t.name || t.englishName || t.shortName}</option>)}
    </select></label>}
    <span className="hint">{status}{translations.length===0 && " · Online list loads when connected"}</span>
    {error && <span className="translation-error">{error}</span>}
  </div>;
}
