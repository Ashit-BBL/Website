const GEAR_CURRENT = [{
  body: "Olympus OM-1",
  spec: "Micro Four Thirds · Stacked sensor",
  badge: "Body"
}, {
  body: "Panasonic-Leica 100-400mm",
  spec: "f/4–6.3 · the workhorse for everything with wings",
  badge: "Lens"
}, {
  body: "Raynox DCR-150",
  spec: "Conversion lens · macro mode",
  badge: "Macro"
}];
const GEAR_PAST = [{
  body: "Nikon D850 / D500",
  spec: "Full-frame · APS-C",
  badge: "Body"
}, {
  body: "Nikon 200-500mm",
  spec: "f/5.6",
  badge: "Lens"
}, {
  body: "Sigma 18-35mm",
  spec: "f/1.8",
  badge: "Lens"
}, {
  body: "Nikon 50mm",
  spec: "f/1.8",
  badge: "Lens"
}, {
  body: "Tokina 11-16mm",
  spec: "f/2.8",
  badge: "Lens"
}];
const AWARDS = [{
  year: "2024",
  title: "BBC Wildlife Magazine — Photo of the Day",
  body: "Selected on the BBC Wildlife Magazine Instagram feed.",
  tag: "Feature"
}, {
  year: "2024",
  title: "35 Awards · Winner — Sequence: Phases of Motion",
  body: "Recognized in the 12th edition of the international 35AWARDS competition.",
  tag: "Award"
}, {
  year: "2024",
  title: "BNHS-EIACP · Winner — Birds in Habitat",
  body: "International Day of Forests photography competition.",
  tag: "Award"
}, {
  year: "2023",
  title: "Heritage Trust of Baroda — Article published",
  body: "Photo essay published in the Heritage Trust of Baroda's print edition.",
  tag: "Press"
}, {
  year: "2022",
  title: "Polo Forest — Coffee Table Book",
  body: "Photography for the official coffee table book by The Fern Sattva Resort.",
  tag: "Book"
}];
const CALENDARS = ["2026", "2025", "2024", "2023", "2022", "2021"];
function AboutPage() {
  useReveal();
  const portrait = "https://static.wixstatic.com/media/8da357_ea0f95355287499a814de81c540c5359~mv2.jpg/v1/crop/x_394,y_0,w_1773,h_1920/fill/w_900,h_1100,q_85,enc_avif,quality_auto/portrait.jpg";
  return React.createElement(React.Fragment, null, React.createElement(Nav, {
    isHome: false
  }), React.createElement("section", {
    className: "about-hero",
    id: "top"
  }, React.createElement("div", {
    className: "about-portrait",
    "data-reveal": true,
    style: {
      backgroundImage: `url(${IMG(portrait)})`
    }
  }, React.createElement("div", {
    className: "tag"
  }, React.createElement("span", {
    className: "name"
  }, "Ashit Gandhi"), React.createElement("span", null, "Vadodara \xB7 Gujarat \xB7 IN"))), React.createElement("div", {
    className: "about-bio"
  }, React.createElement("div", {
    className: "eyebrow",
    "data-reveal": true
  }, React.createElement("span", {
    className: "ln"
  }), " About"), React.createElement("h1", {
    "data-reveal": true,
    style: {
      transitionDelay: "0.1s"
    }
  }, "Photography found me ", React.createElement("em", null, "late,"), " but it found me ", React.createElement("em", null, "completely.")), React.createElement("p", {
    "data-reveal": true,
    style: {
      transitionDelay: "0.25s"
    }
  }, "I'm ", React.createElement("strong", null, "Ashit Gandhi"), " \u2014 a businessman by profession, a badminton player by habit, and a photographer by quiet obsession. I manufacture medical equipment for a living, but somewhere between early-morning safaris and waiting for the light to fall just right, photography became the other thing I can't stop thinking about."), React.createElement("p", {
    "data-reveal": true,
    style: {
      transitionDelay: "0.4s"
    }
  }, "Birds drew me in first \u2014 the patience they demand, the stillness, the near-misses. Lately I've been wandering into ", React.createElement("strong", null, "macro, landscape and wildlife"), " too. A generalist, as I like to say."))), React.createElement("section", {
    className: "section"
  }, React.createElement("div", {
    className: "about-story"
  }, React.createElement("div", {
    className: "left",
    "data-reveal": true
  }, React.createElement("div", {
    className: "left-eyebrow"
  }, React.createElement("span", {
    style: {
      color: "var(--accent)"
    }
  }, "01"), " \xB7 The long version"), React.createElement("div", {
    className: "left-img",
    style: {
      backgroundImage: `url(${IMG("8da357_2f2d782d311f49f6b510cad40d25dc81", 900, 1200, "fill")})`
    }
  }, React.createElement("span", {
    className: "cap"
  }, "Peregrine Falcon \xB7 Little Rann of Kutch"))), React.createElement("div", {
    className: "body"
  }, React.createElement("p", {
    "data-reveal": true
  }, "I picked up a serious camera in 2018, mostly to keep me quiet in the woods. It worked. What started as weekend birding around Vadodara has grown into a private archive of ", React.createElement("strong", null, "feathers, frost, mud and morning light"), " ", "from across India \u2014 Tal Chhapar, the Little Rann, Manas, the Polo Forest, Sattal, Ranthambore."), React.createElement("p", {
    "data-reveal": true
  }, "I'm still learning to name the birds. Still working toward calling myself a proper birder. But every outing teaches me something new \u2014 a call I'd missed, a perch I should have anticipated, a light I should have shown up an hour earlier for."), React.createElement("blockquote", {
    className: "pull",
    "data-reveal": true
  }, "These images are my attempt to slow down and pay attention to the world around me. I hope they make you want to do the same."), React.createElement("p", {
    "data-reveal": true
  }, "I don't chase rarities. I chase the moment a Shikra blinks, the second an Egret swallows two fish at once, the half-light that turns a Polo river silver. ", React.createElement("strong", null, "This site is where I keep the keepers."))))), React.createElement(Stats, null), React.createElement("section", {
    className: "section",
    id: "gear"
  }, React.createElement("div", {
    className: "section-head"
  }, React.createElement("div", null, React.createElement("div", {
    className: "section-eyebrow",
    "data-reveal": true
  }, React.createElement("span", {
    className: "num"
  }, "02 / Gear")), React.createElement("h2", {
    className: "section-title",
    "data-reveal": true,
    style: {
      transitionDelay: "0.1s"
    }
  }, "What's in the ", React.createElement("em", null, "bag."))), React.createElement("p", {
    className: "section-sub",
    "data-reveal": true,
    style: {
      transitionDelay: "0.2s"
    }
  }, "A small kit. I switched from Nikon to Olympus a few years ago \u2014 lighter shoulders, longer reach. The Panasonic-Leica 100-400 does 90% of the work.")), React.createElement("div", {
    className: "gear-grid"
  }, React.createElement("div", {
    className: "gear-col",
    "data-reveal": true
  }, React.createElement("h4", null, "Current"), React.createElement("ul", null, GEAR_CURRENT.map((g, i) => React.createElement("li", {
    key: i
  }, React.createElement("span", {
    className: "body"
  }, g.body, React.createElement("span", {
    className: "spec"
  }, g.spec)), React.createElement("span", {
    className: "badge"
  }, g.badge))))), React.createElement("div", {
    className: "gear-col",
    "data-state": "past",
    "data-reveal": true,
    style: {
      transitionDelay: "0.1s"
    }
  }, React.createElement("h4", null, "Previously"), React.createElement("ul", null, GEAR_PAST.map((g, i) => React.createElement("li", {
    key: i
  }, React.createElement("span", {
    className: "body"
  }, g.body, React.createElement("span", {
    className: "spec"
  }, g.spec)), React.createElement("span", {
    className: "badge"
  }, g.badge))))))), React.createElement("section", {
    className: "section",
    id: "awards"
  }, React.createElement("div", {
    className: "section-head"
  }, React.createElement("div", null, React.createElement("div", {
    className: "section-eyebrow",
    "data-reveal": true
  }, React.createElement("span", {
    className: "num"
  }, "03 / Recognition")), React.createElement("h2", {
    className: "section-title",
    "data-reveal": true,
    style: {
      transitionDelay: "0.1s"
    }
  }, "A few ", React.createElement("em", null, "kind nods."))), React.createElement("p", {
    className: "section-sub",
    "data-reveal": true,
    style: {
      transitionDelay: "0.2s"
    }
  }, "Awards and features I'm quietly proud of. Most of these came as a surprise.")), React.createElement("div", {
    className: "awards"
  }, AWARDS.map((a, i) => React.createElement("div", {
    className: "award",
    key: i,
    "data-reveal": true,
    style: {
      transitionDelay: `${i * 0.05}s`
    }
  }, React.createElement("div", {
    className: "year"
  }, a.year), React.createElement("div", {
    className: "body"
  }, React.createElement("h4", null, a.title), React.createElement("p", null, a.body)), React.createElement("span", {
    className: "tag"
  }, a.tag))))), React.createElement("section", {
    className: "section",
    id: "editions"
  }, React.createElement("div", {
    className: "section-head"
  }, React.createElement("div", null, React.createElement("div", {
    className: "section-eyebrow",
    "data-reveal": true
  }, React.createElement("span", {
    className: "num"
  }, "04 / Editions")), React.createElement("h2", {
    className: "section-title",
    "data-reveal": true,
    style: {
      transitionDelay: "0.1s"
    }
  }, "Printed ", React.createElement("em", null, "things."))), React.createElement("p", {
    className: "section-sub",
    "data-reveal": true,
    style: {
      transitionDelay: "0.2s"
    }
  }, "Each year I assemble a calendar and a yearbook. Some are still around \u2014 drop a line if you'd like one.")), React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(6, 1fr)",
      gap: "12px"
    }
  }, CALENDARS.map((y, i) => React.createElement("div", {
    key: y,
    "data-reveal": true,
    style: {
      transitionDelay: `${i * 0.05}s`,
      aspectRatio: "3/4",
      background: "linear-gradient(180deg, var(--bg-soft), var(--bg-card))",
      border: "1px solid var(--line)",
      borderRadius: "var(--rad)",
      padding: "18px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      cursor: "pointer",
      transition: "transform .35s, border-color .35s"
    },
    onMouseEnter: e => {
      e.currentTarget.style.transform = "translateY(-4px)";
      e.currentTarget.style.borderColor = "var(--accent)";
    },
    onMouseLeave: e => {
      e.currentTarget.style.transform = "";
      e.currentTarget.style.borderColor = "var(--line)";
    }
  }, React.createElement("span", {
    style: {
      fontFamily: "var(--mono)",
      fontSize: 11,
      color: "var(--text-mute)",
      letterSpacing: ".12em"
    }
  }, "Calendar"), React.createElement("div", null, React.createElement("div", {
    style: {
      fontSize: 38,
      fontWeight: 300,
      letterSpacing: "-0.03em",
      color: "var(--text)"
    }
  }, y), React.createElement("div", {
    style: {
      fontSize: 11,
      letterSpacing: ".2em",
      textTransform: "uppercase",
      color: "var(--accent)",
      marginTop: 4
    }
  }, "Desktop \xB7 Wall"))))), React.createElement("div", {
    style: {
      marginTop: 28,
      padding: "28px",
      border: "1px solid var(--line)",
      borderRadius: "var(--rad)",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      flexWrap: "wrap",
      gap: 16
    },
    "data-reveal": true
  }, React.createElement("div", null, React.createElement("div", {
    style: {
      fontSize: 10,
      letterSpacing: ".25em",
      textTransform: "uppercase",
      color: "var(--accent)",
      marginBottom: 8
    }
  }, "Coffee Table Book \xB7 2022"), React.createElement("h3", {
    style: {
      margin: 0,
      fontWeight: 400,
      fontSize: 22,
      letterSpacing: "-0.01em"
    }
  }, "Polo Forest"), React.createElement("p", {
    style: {
      margin: "8px 0 0",
      color: "var(--text-soft)",
      fontSize: 14
    }
  }, "Photography for The Fern Sattva Resort's official coffee table book.")), React.createElement("span", {
    className: "post-link"
  }, "View edition ", React.createElement("span", {
    className: "arrow"
  }, "\u2192")))), React.createElement("section", {
    className: "contact",
    id: "contact"
  }, React.createElement("div", {
    className: "contact-left"
  }, React.createElement("div", {
    className: "section-eyebrow",
    "data-reveal": true
  }, React.createElement("span", {
    className: "num"
  }, "05 / Get in touch")), React.createElement("h2", {
    "data-reveal": true,
    style: {
      transitionDelay: "0.1s"
    }
  }, "Say ", React.createElement("em", null, "hello.")), React.createElement("p", {
    "data-reveal": true,
    style: {
      transitionDelay: "0.2s"
    }
  }, "Prints, photo walls, calendars, a question about a location, or just a note about a bird \u2014 I read every email. Replies might take a day or two depending on whether I'm out with the camera.")), React.createElement("div", {
    className: "contact-fields"
  }, React.createElement("div", {
    className: "contact-row",
    "data-reveal": true
  }, React.createElement("span", {
    className: "lbl"
  }, "Email"), React.createElement("a", {
    href: "mailto:ashitg.photography@gmail.com"
  }, "ashitg.photography@gmail.com")), React.createElement("div", {
    className: "contact-row",
    "data-reveal": true,
    style: {
      transitionDelay: "0.1s"
    }
  }, React.createElement("span", {
    className: "lbl"
  }, "Based in"), React.createElement("span", {
    className: "val"
  }, "Vadodara, Gujarat \u2014 India")), React.createElement("div", {
    className: "contact-row",
    "data-reveal": true,
    style: {
      transitionDelay: "0.2s"
    }
  }, React.createElement("span", {
    className: "lbl"
  }, "Daily shots"), React.createElement("a", {
    href: "https://instagram.com/ashitgandhi_",
    target: "_blank",
    rel: "noopener"
  }, "@ashitgandhi_ \xB7 Instagram")), React.createElement("div", {
    className: "contact-row",
    "data-reveal": true,
    style: {
      transitionDelay: "0.3s"
    }
  }, React.createElement("span", {
    className: "lbl"
  }, "Newsletter"), React.createElement("span", {
    className: "val"
  }, "Subscribe on the live site for new blog entries.")))), React.createElement(Footer, null));
}
Object.assign(window, {
  AboutPage,
  GEAR_CURRENT,
  GEAR_PAST,
  AWARDS,
  CALENDARS
});
ReactDOM.createRoot(document.getElementById("root")).render(React.createElement(AboutPage));
