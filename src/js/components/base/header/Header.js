//Utils import
import { el } from "../../../utils/dom.js";
import { useCSSModule } from "../../../utils/css-modul.js";

//Import Component CSS Style
import HeaderStyle from "./Header.module.css"
/*
const HeaderStyle = await useCSSModule(
  "./src/js/components/base/header/Header.module.css",
);*/


//Component (export)
export const Header = (title = "Jora Net") => {
const openBtn = el("button",{className:HeaderStyle.search_trigger,"aria-label":"Qidirish"},el("i",{className:"fa-solid fa-magnifying-glass"}));
const cancelBtn = el("button",{className:HeaderStyle.cancel_btn},"Bekor Qilish");
const searchInput = el("input",{className:HeaderStyle.search_input,type:"text",placeholder:"Qidirish...",autocomplete:"off"});
const clearBtn = el("button",{className:HeaderStyle.clear_btn},el("i",{className:"fa-solid fa-close"}));
const header = el("header",{className:HeaderStyle.floating_header},
	el("div",{className:HeaderStyle.header_content},
  		el("div",{className:HeaderStyle.page_title},title),
  		openBtn
  		),

	el("div",{className:HeaderStyle.search_form},
  		el("div",{className:HeaderStyle.input_wrapper},
  			el("i",{className:"fa-solid fa-magnifying-glass"}),
  			searchInput,
  			clearBtn
  			),
  		cancelBtn
  		)

	)


 // Qidiruvni ochish funksiyasi
            const openSearch = () => {
                header.classList.add(HeaderStyle.search_active);
                // Animatsiya silliq tugagach, inputga fokus beramiz (telefonlarda klaviatura chiqadi)
                setTimeout(() => {
                    searchInput.focus();
                }, 300);
            };

            // Qidiruvni yopish funksiyasi
            const closeSearch = () => {
                header.classList.remove(HeaderStyle.search_active);
                searchInput.value = ''; // Yopilganda matnni tozalaymiz
                searchInput.blur();     // Klaviaturani yopamiz
                toggleClearButton();    // "X" ikonkasini yashiramiz
            };

            // Yozilayotganda "X" (tozalash) tugmasini nazorat qilish
            const toggleClearButton = () => {
                if (searchInput.value.length > 0) {
                    clearBtn.classList.add(HeaderStyle.visible);
                } else {
                    clearBtn.classList.remove(HeaderStyle.visible);
                }
            };

            // Matnni bir marta bosish orqali tozalash
            const clearSearch = () => {
                searchInput.value = '';
                toggleClearButton();
                searchInput.focus(); // Tozalagach yana yozishga tayyor qilish
            };

            // Event Listener'larni ulash
            openBtn.addEventListener('click', openSearch);
            cancelBtn.addEventListener('click', closeSearch);
            searchInput.addEventListener('input', toggleClearButton);
            clearBtn.addEventListener('click', clearSearch);
  return header
};
