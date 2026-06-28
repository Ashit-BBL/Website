const {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback
} = React;
const IMG = (id, w = 1600, h = 1100, mode = "fill", ext = "jpg") => {
  if (typeof id === "string" && (id.includes("/") || id.startsWith("http") || id.startsWith("data:"))) {
    const inlined = window.__resources && window.__resources[id];
    return inlined || id;
  }
  const inlined = window.__resources && window.__resources["img_" + id];
  if (inlined) return inlined;
  return `https://static.wixstatic.com/media/${id}~mv2.${ext}/v1/${mode}/w_${w},h_${h},al_c,q_85,enc_avif,quality_auto/${id}~mv2.${ext}`;
};
function useSlots() {
  const [v, setV] = useState(0);
  useEffect(() => {
    const h = () => setV(x => x + 1);
    window.addEventListener("slots-updated", h);
    return () => window.removeEventListener("slots-updated", h);
  }, []);
  return v;
}
function useLiveSlotImages(slots) {
  const sv = useSlots();
  return useMemo(() => {
    if (!slots) return [];
    return slots.map(s => {
      const src = getSlotSrc(s.id);
      return src ? {
        ...s,
        src
      } : null;
    }).filter(Boolean);
  }, [slots, sv]);
}
function useSlotOrWix(slotId, wixId, w, h) {
  const sv = useSlots();
  return useMemo(() => {
    const src = getSlotSrc(slotId);
    if (src) return src;
    if (wixId) return IMG(wixId, w || 1000, h || 1400);
    return null;
  }, [slotId, wixId, sv]);
}
function useReveal() {
  useEffect(() => {
    const io = new IntersectionObserver(entries => entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.setAttribute("data-reveal", "visible");
        io.unobserve(e.target);
      }
    }), {
      threshold: 0.15,
      rootMargin: "0px 0px -10% 0px"
    });
    document.querySelectorAll("[data-reveal]").forEach(el => {
      if (el.getAttribute("data-reveal") !== "visible") io.observe(el);
    });
    return () => io.disconnect();
  });
}
function useScrolled(threshold = 30) {
  const [s, setS] = useState(false);
  useEffect(() => {
    const fn = () => setS(window.scrollY > threshold);
    fn();
    window.addEventListener("scroll", fn, {
      passive: true
    });
    return () => window.removeEventListener("scroll", fn);
  }, [threshold]);
  return s;
}
function useCountUp(target, opts = {}) {
  const {
    duration = 1800,
    start = 0
  } = opts;
  const [val, setVal] = useState(start);
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const t0 = performance.now();
          const tick = now => {
            const p = Math.min(1, (now - t0) / duration);
            setVal(Math.round(start + (target - start) * (1 - Math.pow(1 - p, 3))));
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
          io.disconnect();
        }
      });
    }, {
      threshold: 0.4
    });
    io.observe(el);
    return () => io.disconnect();
  }, [target, duration, start]);
  return [val, ref];
}
function Nav({
  isHome = true
}) {
  const scrolled = useScrolled(40);
  const sec = h => isHome ? `#${h}` : `index.html#${h}`;
  return React.createElement("nav", {
    className: "nav",
    "data-scrolled": scrolled ? "1" : "0"
  }, React.createElement("a", {
    className: "nav-brand",
    href: "index.html"
  }, React.createElement("span", {
    className: "nav-brand-mark"
  }, "A"), React.createElement("span", null, "Ashit Gandhi")), React.createElement("div", {
    className: "nav-links"
  }, React.createElement("a", {
    href: sec("work")
  }, "Portfolio"), React.createElement("a", {
    href: sec("gallery")
  }, "Gallery"), React.createElement("a", {
    href: "Blog.html"
  }, "Journal"), React.createElement("a", {
    href: "About.html"
  }, "About"), React.createElement("a", {
    href: "exif-tool.html"
  }, "EXIF Tool"), React.createElement("a", {
    href: "Gujarat Birding Locations.html"
  }, "Gujarat Birding")), React.createElement("a", {
    className: "nav-cta",
    href: "About.html#contact"
  }, "Say hello \u2192"));
}
function HeroCinematic() {
  const picks = useLiveSlotImages(PHOTO_SLOTS.hero);
  const [i, setI] = useState(0);
  const [loaded, setLoaded] = useState(() => new Set([0]));
  useEffect(() => {
    if (picks.length > 0 && i >= picks.length) setI(0);
  }, [picks.length]);
  useEffect(() => {
    setLoaded(prev => {
      const n = new Set(prev);
      n.add(i);
      if (picks.length) n.add((i + 1) % picks.length);
      return n;
    });
  }, [i, picks.length]);
  useEffect(() => {
    if (picks.length < 2) return;
    const t = setInterval(() => setI(x => (x + 1) % picks.length), 5000);
    return () => clearInterval(t);
  }, [picks.length]);
  const cur = picks[i] || null;
  return React.createElement(React.Fragment, null, React.createElement("div", {
    className: "hero-stage"
  }, picks.map((p, idx) => React.createElement("div", {
    key: p.id,
    className: "hero-img",
    "data-on": idx === i ? "1" : "0",
    style: {
      backgroundImage: loaded.has(idx) ? `url(${p.src})` : "none"
    }
  }))), React.createElement("div", {
    className: "hero-grade"
  }), cur && React.createElement("div", {
    className: "hero-counter"
  }, React.createElement("div", {
    className: "seq"
  }, String(i + 1).padStart(2, "0"), " / ", String(picks.length).padStart(2, "0")), React.createElement("div", {
    className: "ttl"
  }, cur.title, " \xB7 ", cur.loc)));
}
function HeroMosaic() {
  const heroImgs = useLiveSlotImages(PHOTO_SLOTS.hero);
  const sv = useSlots();
  const otherSlots = useMemo(() => ["birds", "macro", "landscape", "sunrise"].flatMap(cat => PHOTO_SLOTS[cat].map(s => ({
    ...s,
    cat
  }))), []);
  const otherImgs = useLiveSlotImages(otherSlots);
  const cells = useMemo(() => {
    const all = [...heroImgs, ...otherImgs].slice(0, 7);
    while (all.length < 7) all.push(null);
    return all;
  }, [heroImgs, otherImgs]);
  return React.createElement(React.Fragment, null, React.createElement("div", {
    className: "hero-mosaic"
  }, cells.map((p, idx) => React.createElement("div", {
    key: p ? p.id : idx,
    className: idx === 0 ? "cell lg" : "cell",
    style: p ? {
      backgroundImage: `url(${p.src})`,
      animationDelay: `${idx * 0.2}s`
    } : {
      animationDelay: `${idx * 0.2}s`
    }
  }))), React.createElement("div", {
    className: "hero-grade"
  }));
}
function HeroParallax() {
  const picks = useLiveSlotImages([PHOTO_SLOTS.hero[0]]);
  const ref = useRef(null);
  useEffect(() => {
    const fn = () => {
      if (!ref.current) return;
      ref.current.style.transform = `translateY(${window.scrollY * 0.4}px) scale(${1.05 + window.scrollY * 0.0002})`;
    };
    window.addEventListener("scroll", fn, {
      passive: true
    });
    return () => window.removeEventListener("scroll", fn);
  }, []);
  const src = picks[0] ? picks[0].src : null;
  return React.createElement(React.Fragment, null, React.createElement("div", {
    className: "hero-parallax"
  }, React.createElement("div", {
    ref: ref,
    className: "px-img",
    style: src ? {
      backgroundImage: `url(${src})`
    } : {}
  })), React.createElement("div", {
    className: "hero-grade"
  }));
}
function Hero({
  variant
}) {
  return React.createElement("header", {
    className: "hero",
    id: "top"
  }, variant === "mosaic" && React.createElement(HeroMosaic, null), variant === "parallax" && React.createElement(HeroParallax, null), variant === "cinematic" && React.createElement(HeroCinematic, null), React.createElement("div", {
    className: "hero-meta"
  }, React.createElement("span", {
    className: "ln"
  }), "Vadodara \xB7 Gujarat \xB7 India"), React.createElement("div", {
    className: "hero-content"
  }, React.createElement("div", {
    className: "hero-eyebrow",
    "data-reveal": true,
    style: {
      transitionDelay: "0.1s"
    }
  }, React.createElement("span", {
    className: "dot"
  }), " Wildlife & Landscape \xB7 Field Journal"), React.createElement("h1", {
    className: "hero-title",
    "data-reveal": true,
    style: {
      transitionDelay: "0.2s"
    }
  }, "I photograph the things that ", React.createElement("em", null, "don't sit still.")), React.createElement("p", {
    className: "hero-sub",
    "data-reveal": true,
    style: {
      transitionDelay: "0.45s"
    }
  }, "Birds, beetles and golden hours \u2014 caught between heartbeats. I'm Ashit, a wildlife photographer based in Vadodara, India, telling small, patient stories about the wild that lives next door."), React.createElement("div", {
    className: "hero-actions",
    "data-reveal": true,
    style: {
      transitionDelay: "0.65s"
    }
  }, React.createElement("button", {
    className: "btn btn-primary",
    onClick: () => {
      const el = document.getElementById('work');
      if (el) window.scrollTo({
        top: el.getBoundingClientRect().top + window.scrollY - 80,
        behavior: 'smooth'
      });
    }
  }, "See the work ", React.createElement("span", {
    className: "arrow"
  }, "\u2192")), React.createElement("button", {
    className: "btn btn-ghost",
    onClick: () => {
      const el = document.getElementById('journal');
      if (el) window.scrollTo({
        top: el.getBoundingClientRect().top + window.scrollY - 80,
        behavior: 'smooth'
      });
    }
  }, "Field journal"))), React.createElement("div", {
    className: "scroll-cue"
  }, "Scroll ", React.createElement("span", {
    className: "bar"
  })));
}
function FieldNotes() {
  const portraitSrc = useSlotOrWix("birds-01", "8da357_bcd4c5a712c64f628f0eff3083f7c5d7", 900, 1200);
  return React.createElement("section", {
    className: "section",
    id: "field"
  }, React.createElement("div", {
    className: "field-notes"
  }, React.createElement("div", {
    className: "fn-portrait",
    "data-reveal": true,
    style: {
      backgroundImage: portraitSrc ? `url(${portraitSrc})` : undefined
    }
  }, React.createElement("div", {
    className: "tag"
  }, "Field Notes \xB7 01")), React.createElement("div", {
    className: "fn-text"
  }, React.createElement("div", {
    className: "section-eyebrow",
    "data-reveal": true
  }, React.createElement("span", {
    className: "num"
  }, "01 / Field Notes")), React.createElement("h2", {
    className: "section-title",
    "data-reveal": true,
    style: {
      transitionDelay: "0.1s"
    }
  }, "Eight years, one ", React.createElement("em", null, "patient lens.")), React.createElement("p", {
    "data-reveal": true,
    style: {
      transitionDelay: "0.25s"
    }
  }, "I picked up a camera in 2018, mostly to keep me quiet in the woods. It worked. What started as weekend birding around Vadodara has become a private archive of ", React.createElement("strong", null, "feathers, frost, mud and morning light"), " from across India \u2014 Tal Chhapar, the Little Rann, Manas, the Polo Forest."), React.createElement("blockquote", {
    className: "pull",
    "data-reveal": true,
    style: {
      transitionDelay: "0.35s"
    }
  }, "\"The photo, the click, the speed of the wild \u2014 snap.\""), React.createElement("p", {
    "data-reveal": true,
    style: {
      transitionDelay: "0.45s"
    }
  }, "I don't chase rarities. I chase the moment a Shikra blinks, the second an Egret swallows two fish at once, the half-light that turns a Polo river silver. This site is where I keep the keepers."), React.createElement("div", {
    className: "fn-sign",
    "data-reveal": true,
    style: {
      transitionDelay: "0.55s"
    }
  }, "\u2014 ", React.createElement("span", {
    className: "name"
  }, "Ashit Gandhi"), " \xB7 Vadodara, IN"))));
}
function StatNum({
  to,
  suffix,
  label,
  desc
}) {
  const [val, ref] = useCountUp(to);
  return React.createElement("div", {
    className: "stat",
    ref: ref,
    "data-reveal": true
  }, React.createElement("div", {
    className: "num"
  }, val.toLocaleString(), React.createElement("span", {
    className: "suffix"
  }, suffix)), React.createElement("div", {
    className: "lbl"
  }, label), React.createElement("div", {
    className: "desc"
  }, desc));
}
function Stats() {
  return React.createElement("div", {
    className: "stats"
  }, React.createElement(StatNum, {
    to: 8,
    suffix: "",
    label: "Years in the field",
    desc: "Since the first Bulbul in 2018."
  }), React.createElement(StatNum, {
    to: 450,
    suffix: "+",
    label: "Species photographed",
    desc: "From garden Sunbirds to Imperial Eagles."
  }), React.createElement(StatNum, {
    to: 30,
    suffix: "",
    label: "Locations across India",
    desc: "Tal Chhapar, Manas, Ranthambore, the Rann."
  }), React.createElement(StatNum, {
    to: 14000,
    suffix: "+",
    label: "Frames in the archive",
    desc: "Carefully kept. Quietly culled."
  }));
}
function ExifToolBanner() {
  return React.createElement("div", {
    className: "exif-banner",
    "data-reveal": true
  }, React.createElement("div", {
    className: "exif-preview"
  }, React.createElement("img", {
    src: "assets/kingfisher-exif.jpg",
    alt: "White-throated Kingfisher \u2014 actual EXIF overlay output",
    className: "exif-preview-img",
    loading: "lazy"
  }), React.createElement("div", {
    className: "exif-preview-badge"
  }, "Actual Output")), React.createElement("div", {
    className: "exif-banner-right"
  }, React.createElement("div", {
    className: "exif-banner-kicker"
  }, React.createElement("span", {
    className: "dot"
  }), "Studio Tool"), React.createElement("h3", {
    className: "exif-banner-heading"
  }, "EXIF ", React.createElement("em", null, "Overlay Tool")), React.createElement("p", {
    className: "exif-banner-body"
  }, "A Windows utility that stamps camera data directly onto your photograph. Choose from ", React.createElement("strong", null, "15 EXIF fields"), " \u2014 camera, lens, shutter, aperture, ISO and more. Pick what shows, where it sits, how it looks."), React.createElement("div", {
    className: "exif-features"
  }, React.createElement("span", {
    className: "exif-feat"
  }, "15 EXIF fields"), React.createElement("span", {
    className: "exif-feat"
  }, "Batch processing"), React.createElement("span", {
    className: "exif-feat"
  }, "Originals untouched")), React.createElement("a", {
    className: "btn btn-ghost",
    href: "exif-tool.html"
  }, "Try the tool ", React.createElement("span", {
    className: "arrow"
  }, "\u2192"))));
}
const CAT_DEFS = [{
  id: "birds",
  title: "Birds",
  coverSlot: "birds-01",
  wix: "8da357_3d29c82e6f0e406d8b836ed9d61bcff6"
}, {
  id: "macro",
  title: "Macro",
  coverSlot: "macro-01",
  wix: "8da357_4848c1c02bd4493a8065ca9c6d578fe8"
}, {
  id: "composites",
  title: "Composites",
  coverSlot: "composites-01",
  wix: "8da357_4d78fde2ed5e4060a6fbcb57ab1da1b2"
}, {
  id: "landscape",
  title: "Landscape",
  coverSlot: "landscape-01",
  wix: "8da357_bbac89e34e514c4cba29444cbd2fbfe2"
}];
function CatCard({
  c,
  index,
  onPickCategory
}) {
  const src = useSlotOrWix(c.coverSlot, c.wix, 1000, 1400);
  return React.createElement("div", {
    className: "cat",
    "data-reveal": true,
    style: {
      transitionDelay: `${index * 0.08}s`
    },
    onClick: () => onPickCategory && onPickCategory(c.id)
  }, React.createElement("div", {
    className: "img",
    style: src ? {
      backgroundImage: `url(${src})`
    } : {}
  }), React.createElement("div", {
    className: "cat-inner"
  }, React.createElement("span", {
    className: "idx"
  }, "0", index + 1), React.createElement("div", {
    className: "cat-meta"
  }, React.createElement("h3", null, c.title))), React.createElement("span", {
    className: "cat-arrow"
  }, React.createElement("svg", {
    width: "14",
    height: "14",
    viewBox: "0 0 24 24",
    fill: "none",
    strokeWidth: "1.6"
  }, React.createElement("path", {
    d: "M5 12h14M13 5l7 7-7 7"
  }))));
}
function Categories({
  onPickCategory
}) {
  return React.createElement("section", {
    className: "section",
    id: "work"
  }, React.createElement("div", {
    className: "section-head"
  }, React.createElement("div", null, React.createElement("div", {
    className: "section-eyebrow",
    "data-reveal": true
  }, React.createElement("span", {
    className: "num"
  }, "02 / Portfolio")), React.createElement("h2", {
    className: "section-title",
    "data-reveal": true,
    style: {
      transitionDelay: "0.1s"
    }
  }, "What I'm ", React.createElement("em", null, "chasing."))), React.createElement("p", {
    className: "section-sub",
    "data-reveal": true,
    style: {
      transitionDelay: "0.2s"
    }
  }, "Four corners of one quiet practice. Click any door to drop into the gallery filtered just for that.")), React.createElement("div", {
    className: "cats"
  }, CAT_DEFS.map((c, i) => React.createElement(CatCard, {
    key: c.id,
    c: c,
    index: i,
    onPickCategory: onPickCategory
  }))));
}
Object.assign(window, {
  React,
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
  IMG,
  useSlots,
  useLiveSlotImages,
  useSlotOrWix,
  useReveal,
  useScrolled,
  useCountUp,
  Nav,
  Hero,
  FieldNotes,
  Stats,
  StatNum,
  ExifToolBanner,
  Categories
});