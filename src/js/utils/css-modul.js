export async function useCSSModule(path) {
  const res = await fetch(path);
  let css = await res.text();

  // Tasodifiy scope yaratish (minimalistik va xavfsiz)
  const scope = "c_" + Math.random().toString(36).slice(2, 7);

  /**
   * MUHIM O'ZGARISH: 
   * /\.([a-zA-Z_-][a-zA-Z0-9_-]*)/g
   * Bu RegEx faqat harf yoki "_" bilan boshlangan klasslarni tutadi.
   * .1 yoki .5 kabi sonlarga tegmaydi.
   */
  const classRegex = /\.([a-zA-Z_-][a-zA-Z0-9_-]*)/g;
  
  // Klasslarni scoped qilish
  css = css.replace(classRegex, `.${scope}-$1`);

  // Style elementini yaratish va qo'shish
  const style = document.createElement("style");
  style.setAttribute("data-module", scope); // Debug uchun qulay
  style.textContent = css;
  document.head.appendChild(style);

  // Qaytariladigan ob'ektni shakllantirish
  const classes = {};
  const matches = [...css.matchAll(new RegExp(`\\.(${scope}-([a-zA-Z0-9_-]+))`, "g"))];

  matches.forEach((m) => {
    const fullClass = m[1];     // masalan: c_a1b2-header
    const originalName = m[2];  // masalan: header
    classes[originalName] = fullClass;
  });

  return classes;
}