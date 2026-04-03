//i18n
import {t} from "../../../i18n/index.js"


//Utils import
import { el } from "../../../utils/dom.js";
import { useCSSModule } from "../../../utils/css-modul.js";

/**
 * @param {string} activePath - Current page path (for the active class)
 */

//Import Component CSS Style
import NavbarStyle from "./Navbar.module.css"
/*
const NavbarStyle = await useCSSModule(
  "./src/js/components/base/navbar/Navbar.module.css",
);*/



//Component(export)
export const Navbar = (activePath = window.location.pathname) => {
 // Menu
let menuData = [
  {
    label:t("navbar.home"),
    title:t("navbar.home"),
    path:"/home",
    active:true,
    icon:`<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-house-icon lucide-house"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>`
  },
  {
    label:t("navbar.messages"),
    title:t("navbar.messages"),
    path:"/messages",
    active:false,
    icon:`<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-messages-square-icon lucide-messages-square"><path d="M16 10a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 14.286V4a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/><path d="M20 9a2 2 0 0 1 2 2v10.286a.71.71 0 0 1-1.212.502l-2.202-2.202A2 2 0 0 0 17.172 19H10a2 2 0 0 1-2-2v-1"/></svg>`
  },
  {
    label:t("navbar.ai"),
    title:t("navbar.ai"),
    path:"/ai",
    active:false,
    icon:`<svg xmlns="http://www.w3.org/2000/svg"  width="60px" height="60px" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-brain-icon lucide-brain"><path d="M12 18V5"/><path d="M15 13a4.17 4.17 0 0 1-3-4 4.17 4.17 0 0 1-3 4"/><path d="M17.598 6.5A3 3 0 1 0 12 5a3 3 0 1 0-5.598 1.5"/><path d="M17.997 5.125a4 4 0 0 1 2.526 5.77"/><path d="M18 18a4 4 0 0 0 2-7.464"/><path d="M19.967 17.483A4 4 0 1 1 12 18a4 4 0 1 1-7.967-.517"/><path d="M6 18a4 4 0 0 1-2-7.464"/><path d="M6.003 5.125a4 4 0 0 0-2.526 5.77"/></svg>`
  },
  {
    label:t("navbar.apps"),
    title:t("navbar.apps"),
    path:"/apps",
    active:false,
    icon:`<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-shopping-cart-icon lucide-shopping-cart"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>`
  },
  {
    label:t("navbar.profile"),
    title:t("navbar.profile"),
    path:"/profile",
    active:false,
    icon:`<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user-icon lucide-user"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`
  },
];
 //State 
  let activeIndex = localStorage.getItem("activeIndex")?localStorage.getItem("activeIndex"):0;
  let hoveredIndex = null;
  let isScrolling = false;
  let scrollTimeout;

  const navHighlight = el("div", { id: "navHighlight", className:NavbarStyle.nav_highlight });

  const navItemsElements = menuData.map((item, index) => {
    const active = activePath === item.path
    const iconWrapper = el("span", { className:NavbarStyle.icon_wrapper });
    iconWrapper.innerHTML = item.icon; 
    
    if(iconWrapper.firstChild) {
      iconWrapper.firstChild.classList.add(NavbarStyle.nav_icon);
    }

    const label = el("span", { className:NavbarStyle.nav_label, title:item.title }, item.label);

    return el(
      "a",
      {
        className: `${NavbarStyle.nav_item} ${active ? NavbarStyle.active : ""}`,
        dataset:{section:item.path},
        "data-link":item.path,
        href:item.path,
        title:item.title,
        onclick: (e) => handleItemClick(e, index, item.id),
        onmouseenter: () => {
          hoveredIndex = index;
          updateHighlight();
        },
        onmouseleave: () => {
          hoveredIndex = null;
          updateHighlight();
        },
      },
      iconWrapper,
      label
    );
  });


  const navContainer = el("div", { className:NavbarStyle.nav_container }, /*navHighlight,*/ ...navItemsElements);
  const nav = el("nav", { className:NavbarStyle.liquid_glass_nav, title:"Navigation" }, navContainer);

  function updateHighlight() {
    const targetIndex = hoveredIndex !== null?hoveredIndex: activeIndex;
    const targetItem = navItemsElements[targetIndex];

    if (targetItem && navContainer) {
      const navRect = navContainer.getBoundingClientRect();
      const itemRect = targetItem.getBoundingClientRect();

      const x = itemRect.left - navRect.left;
      const width = itemRect.width;

      navHighlight.style.left = x + "px";
      navHighlight.style.width = width + "px";
    }

   
    localStorage.setItem("activeIndex",activeIndex)
  }

  function handleScroll() {
    if (!isScrolling) {
      nav.classList.add(NavbarStyle.scrolling);
    }
    isScrolling = true;

    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      isScrolling = false;
      nav.classList.remove(NavbarStyle.scrolling);
    }, 150);

    const sections = document.querySelectorAll("[id]");
    let currentSection = "";

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= sectionTop - sectionHeight / 3) {
        currentSection = section.getAttribute("id");
      }
    });

    if (currentSection) {
      navItemsElements.forEach((item, index) => {
        if (item.dataset === currentSection) {
          setActiveItem(index);
        }
      });
    }
  }

  function handleItemClick(e, index, sectionId) {
    //createRipple(e, navItemsElements[index]);
    setActiveItem(index);
    const section = document.getElementById(sectionId);
    if (section) section.scrollIntoView({ behavior: "smooth" });
  }

  function setActiveItem(index) {
    if (activeIndex !== index) {
      navItemsElements[activeIndex].classList.remove(NavbarStyle.active);
      activeIndex = index;
      const filered = menuData.filter((item,i)=>{ 
         index === i?item.active = true:item.active = false
         return {...item}
      })
      menuData = filered
      navItemsElements[activeIndex].classList.add(NavbarStyle.active);
      updateHighlight();
    }
  }
/*
  function createRipple(event, item) {
    const rect = item.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const ripple = el("span", {
      className: NavbarStyle.ripple,
      style: {
        left: x + "px",
        top: y + "px",
        width: "10px",
        height: "10px",
        marginLeft: "-5px",
        marginTop: "-5px",
      },
    });

    item.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  }
*/
  window.addEventListener("scroll", handleScroll, { passive: true });
  window.addEventListener("resize", updateHighlight);


  setTimeout(updateHighlight, 100);

  return nav;
};
