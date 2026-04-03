const cache = new Map();

let messages = {};
let currentLang = "uz";
let fallbackLang = "en";

async function loadLocale(lang) {

  if (cache.has(lang)) {
    messages = cache.get(lang);
    return;
  }

  const res = await fetch(`./src/js/i18n/locales/${lang}.json`);

  if (!res.ok) throw new Error("Locale load error");

  const data = await res.json();

  cache.set(lang, data);
  messages = data;
}

export async function initI18n(lang="uz") {
  await setLang(lang);
}

export async function setLang(lang) {

  //if (lang === currentLang) return;

  try {
    await loadLocale(lang);
    currentLang = lang;
  }
  catch {

    await loadLocale(fallbackLang);
    currentLang = fallbackLang;

  }
}

export function t(key) {

  return messages[key] || key;

}