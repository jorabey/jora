//Core import
import { store } from "../../../core/store.js";

//Utils import
import { el } from "../../../utils/dom.js";
import { useCSSModule } from "../../../utils/css-modul.js";
import { observer } from "../../../core/observer.js";
import { timeAgo } from "../../../utils/timeAgo.js";

//i18n
import { t } from "../../../i18n/index.js";

//ui-engine and Components import
import { UIEngine } from "../../ui-engine.js";

function PostItem(post, index) {
  return  el("div",{className:"feed glass"},

        el("div",{className:"head"}),

        el("div",{className:"user"},
          el("div",{className:"profile-pic"},
            el("img",{title:`${post.author.firstname || "unknown"} ${post.author.lastname || "Unknown"}`,src:post.author.avatar || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3PYyZuge1vobU7BDJ1dsYaiUf8LdMIqAK-A&s"})),
          el("div",{className:"info"},
            el("h3",{title:`${post.author.firstname || "unknown"} ${post.author.lastname || "Unknown"}`},`${post.author.firstname || "Unknown"} ${post.author.lastname || "unknown"}`),
            el("small",{title:`${post.location.city || "Unknown"}, ${timeAgo(post.created) || "Unknown"}`},`${post.location.city || "Unknown"}, ${timeAgo(post.created) || "Unknown"}`),
          ),
         // el("span",{className:"edit"},el("i",{className:"material-icons"},"wifi_off"))
        ),

        el("div",{className:"photo"},
          el("img",{src:post.img})),
        el("div",{className:"caption", title:post.caption || ""},
        el("p",{},
          el("b",{},`${post.author.firstname || "unknown"} ${post.author.lastname || "Unknown"}`), 
          post.caption || "",
          el("span",{className:"hash-tag"},post.hashtag || "")
        )),

        el("div",{className:"action-button"},
          el("div",{className:"interaction-button"},
            el("span",{},
              el("i",{className:"material-icons"},"favorite")),
              " ",
              post.likes || 0,
              " ",
            el("span",{},
              el("i",{className:"material-icons"},"comment")),
              " ",
              post.comments || 0,
              " ",
            el("span",{},
              el("i",{className:"material-icons"},"share")),
              " ",
              post.shares || 0,
              " ",
            ),
          el("div",{className:"bookmark"},
            el("span",{},
              el("i",{className:"material-icons"},"bookmark")))
      ),

      el("div",{className:"liked-by"},
        el("span",{},
          el("img",{src:"https://res.cloudinary.com/freecodez/image/upload/v1698067298/images/fy8azbqxhgdrbbijhipe.webp"})),
        el("span",{},
          el("img",{src:"https://64.media.tumblr.com/7b28774544438d73ca8c1daad11402e0/88958e5f55a67155-fd/s250x400/a9ef3dad54f6c57a53fdeef1a793f0143a9aea27.jpg"})),
        el("span",{},
          el("img",{src:"https://64.media.tumblr.com/2d678d77b051ee352d722d1f7fd2c029/88958e5f55a67155-7d/s250x400/74d69559d55329719bb0a50d8e9d77cbf0ec6da0.jpg"})),
        el("p",{},"Liked by",
          el("b",{},"Enrest Achiever"),
          "snd",
          el("b",{},"220 others"))
        ),


      el("div",{className:"comments text-muted"},`${t("navbar.home")} ${post.comments} comments`)
      );
}

function PostView(posts) {
  return el("div",{className:"card"},el("div",{className:"middle"},
    el("div",{className:"feeds"},
   ...posts.map((post, i) => PostItem(post, i)),
    ))) 
}

export function Post(rootElement) {
  return UIEngine.createComponent({
    root: rootElement,

    selector: (state) => ({
      posts: state.posts,
      lang: state.lang
    }),

    view: ({ posts, lang}) => PostView(posts)
  });
}
