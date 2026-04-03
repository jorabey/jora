export function applyUI(ui) {
  const root = document.documentElement;

  root.style.setProperty("--header-color", ui.colors.header);
  root.style.setProperty("--navbar-color", ui.colors.navbar);
  root.style.setProperty("--primary-color", ui.colors.primary);

  root.style.setProperty("--radius", ui.radius + "px");

  root.style.setProperty("--animation-speed", ui.animation.speed + "ms");

  if (!ui.animation.enabled) {
    root.style.setProperty("--animation-speed", "0ms");
  }
}