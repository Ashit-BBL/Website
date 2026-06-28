const {
  useState: useStateG,
  useEffect: useEffectG,
  useMemo: useMemoG,
  useCallback: useCallbackG,
  useRef: useRefG
} = React;
const FILTERS = [{
  id: "all",
  label: "All"
}, {
  id: "birds",
  label: "Birds"
}, {
  id: "macro",
  label: "Macro"
}, {
  id: "composites",
  label: "Composites"
}, {
  id: "landscape",
  label: "Landscape"
}];
function FeaturedGallery({
  initialFilter = "all",
  onFilterChange
}) {
  const [filter, setFilter] = useStateG(initialFilter);
  const [openIdx, setOpenIdx] = useStateG(-1);
  const masonryRef = useRefG(null);
  useEffectG(() => {
    setFilter(initialFilter);
  }, [initialFilter]);
  const allSlots = useMemoG(() => {
    const arr = getAllPhotoSlots();
    let seed = 20260602;
    const rand = () => {
      seed = seed * 1103515245 + 12345 & 0x7fffffff;
      return seed / 0x7fffffff;
    };
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }, []);
  const allPhotos = useLiveSlotImages(allSlots);
  const list = useMemoG(() => filter === "all" ? allPhotos : allPhotos.filter(p => p.cat === filter), [filter, allPhotos]);
  const resizeItem = useCallbackG(frame => {
    if (!frame) return;
    const img = frame.querySelector('img');
    const fw = frame.getBoundingClientRect().width || 300;
    let h;
    if (img && img.naturalWidth > 0) {
      h = img.naturalHeight / img.naturalWidth * fw;
    } else {
      h = frame.getBoundingClientRect().height;
      if (h < 8) h = fw * 1.3;
    }
    frame.style.gridRowEnd = `span ${Math.ceil((h + 12) / 4)}`;
  }, []);
  const resizeAll = useCallbackG(() => {
    if (!masonryRef.current) return;
    masonryRef.current.querySelectorAll('.frame').forEach(resizeItem);
  }, [resizeItem]);
  useEffectG(() => {
    resizeAll();
    const t1 = setTimeout(resizeAll, 400);
    const t2 = setTimeout(resizeAll, 1200);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [list, resizeAll]);
  useEffectG(() => {
    if (openIdx < 0) return;
    const onKey = e => {
      if (e.key === "Escape") setOpenIdx(-1);
      if (e.key === "ArrowRight") setOpenIdx(i => (i + 1) % list.length);
      if (e.key === "ArrowLeft") setOpenIdx(i => (i - 1 + list.length) % list.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openIdx, list.length]);
  const pick = useCallbackG(id => {
    setFilter(id);
    onFilterChange && onFilterChange(id);
  }, [onFilterChange]);
  return React.createElement("section", {
    className: "section",
    id: "gallery"
  }, React.createElement("div", {
    className: "section-head"
  }, React.createElement("div", null, React.createElement("div", {
    className: "section-eyebrow",
    "data-reveal": true
  }, React.createElement("span", {
    className: "num"
  }, "03 / Featured Frames")), React.createElement("h2", {
    className: "section-title",
    "data-reveal": true,
    style: {
      transitionDelay: "0.1s"
    }
  }, "A handful of ", React.createElement("em", null, "keepers."))), React.createElement("p", {
    className: "section-sub",
    "data-reveal": true,
    style: {
      transitionDelay: "0.2s"
    }
  }, "Filter by category, click any frame to look closer. Most of these took a few cold mornings to earn.")), React.createElement("div", {
    className: "gallery-filters",
    "data-reveal": true
  }, FILTERS.map(f => React.createElement("button", {
    key: f.id,
    className: "chip",
    "data-on": filter === f.id ? "1" : "0",
    onClick: () => pick(f.id)
  }, f.label))), list.length === 0 ? React.createElement("div", {
    className: "gallery-empty",
    "data-reveal": true
  }, React.createElement("svg", {
    width: "40",
    height: "40",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.2",
    opacity: ".3"
  }, React.createElement("path", {
    d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"
  }), React.createElement("polyline", {
    points: "17 8 12 3 7 8"
  }), React.createElement("line", {
    x1: "12",
    y1: "3",
    x2: "12",
    y2: "15"
  })), React.createElement("p", null, "Photos will appear here once images are uploaded to the ", React.createElement("strong", null, "assets"), " folders on GitHub.")) : React.createElement("div", {
    className: "masonry",
    ref: masonryRef
  }, list.map((p, idx) => React.createElement("figure", {
    key: p.id,
    className: "frame",
    "data-reveal": true,
    style: {
      transitionDelay: `${Math.min(idx, 8) * 0.05}s`
    },
    onClick: () => setOpenIdx(idx)
  }, React.createElement("img", {
    src: p.src,
    alt: p.title,
    loading: "lazy",
    onLoad: e => resizeItem(e.target.closest('.frame')),
    onError: e => {
      const f = e.target.closest('.frame');
      if (f) f.style.display = 'none';
    }
  }), (p.title || p.loc) && React.createElement("figcaption", {
    className: "caption"
  }, p.title, p.title && p.loc ? ' · ' : '', React.createElement("span", {
    style: {
      opacity: .7
    }
  }, p.loc))))), React.createElement(Lightbox, {
    list: list,
    idx: openIdx,
    onClose: () => setOpenIdx(-1),
    onPrev: () => setOpenIdx(i => (i - 1 + list.length) % list.length),
    onNext: () => setOpenIdx(i => (i + 1) % list.length)
  }));
}
function Lightbox({
  list,
  idx,
  onClose,
  onPrev,
  onNext
}) {
  const open = idx >= 0;
  const p = open ? list[idx] : null;
  return React.createElement("div", {
    className: "lightbox",
    "data-on": open ? "1" : "0",
    onClick: onClose
  }, open && React.createElement(React.Fragment, null, React.createElement("div", {
    className: "lb-counter"
  }, String(idx + 1).padStart(2, "0"), " / ", String(list.length).padStart(2, "0")), React.createElement("button", {
    className: "lb-x",
    onClick: e => {
      e.stopPropagation();
      onClose();
    },
    "aria-label": "Close"
  }, React.createElement("svg", {
    width: "16",
    height: "16",
    viewBox: "0 0 24 24",
    fill: "none",
    strokeWidth: "1.6",
    stroke: "currentColor"
  }, React.createElement("path", {
    d: "M6 6l12 12M18 6L6 18"
  }))), React.createElement("button", {
    className: "lb-nav prev",
    onClick: e => {
      e.stopPropagation();
      onPrev();
    },
    "aria-label": "Previous"
  }, React.createElement("svg", {
    width: "18",
    height: "18",
    viewBox: "0 0 24 24",
    fill: "none",
    strokeWidth: "1.6",
    stroke: "currentColor"
  }, React.createElement("path", {
    d: "M15 6l-6 6 6 6"
  }))), React.createElement("button", {
    className: "lb-nav next",
    onClick: e => {
      e.stopPropagation();
      onNext();
    },
    "aria-label": "Next"
  }, React.createElement("svg", {
    width: "18",
    height: "18",
    viewBox: "0 0 24 24",
    fill: "none",
    strokeWidth: "1.6",
    stroke: "currentColor"
  }, React.createElement("path", {
    d: "M9 6l6 6-6 6"
  }))), React.createElement("img", {
    src: p.src,
    alt: p.title,
    onClick: e => e.stopPropagation()
  }), React.createElement("div", {
    className: "lb-cap"
  }, p.title, p.title && p.loc ? ' · ' : '', p.loc)));
}
const POSTS = [{
  img: "8da357_cc4805d0dd0f497b9afc6d1c1cc6971c",
  date: "May 2026",
  loc: "Tadoba, Maharashtra",
  title: "Tiger cubs at Tadoba — Collarwala, Veera & Jaanvi",
  url: "https://blog.ashitgphotography.com/post/tadoba-may-2026",
  body: "Four safaris, three tigers. Collarwala in the Moharli core, a fleeting Veera, and 45 uninterrupted minutes with Jaanvi's four cubs at Shedegaon."
}, {
  img: "8da357_9c65b71f04384452b9f371a91d4b01e9",
  date: "Dec 2025",
  loc: "Jaisalmer, Rajasthan",
  title: "Six safaris in the Desert National Park",
  url: "https://blog.ashitgphotography.com/post/desert-national-park-jaisalmer",
  body: "Laggar falcons, chinkara at dawn, and a Great Indian Bustard that finally let me near. Field notes from the dunes."
}, {
  img: "8da357_26f780ce931941f5a57eb1949f768d16",
  date: "Jan 2025",
  loc: "Ranthambore",
  title: "Five mornings with Riddhi's cub",
  url: "https://blog.ashitgphotography.com/post/ranthambore-national-park-january-2025",
  body: "What I learned about light, patience, and how loud a tiger can be when it's choosing whether to look at you."
}];
function Posts() {
  return React.createElement("section", {
    className: "section",
    id: "journal"
  }, React.createElement("div", {
    className: "section-head"
  }, React.createElement("div", null, React.createElement("div", {
    className: "section-eyebrow",
    "data-reveal": true
  }, React.createElement("span", {
    className: "num"
  }, "04 / Journal")), React.createElement("h2", {
    className: "section-title",
    "data-reveal": true,
    style: {
      transitionDelay: "0.1s"
    }
  }, "From the ", React.createElement("em", null, "field."))), React.createElement("p", {
    className: "section-sub",
    "data-reveal": true,
    style: {
      transitionDelay: "0.2s"
    }
  }, "Trip reports, half-formed thoughts, and the occasional rant about tripod heads. Slow blog, slow photography.")), React.createElement("div", {
    className: "posts"
  }, POSTS.map((p, i) => React.createElement("article", {
    className: "post",
    key: i,
    "data-reveal": true,
    style: {
      transitionDelay: `${i * 0.1}s`
    }
  }, React.createElement("a", {
    href: p.url,
    target: "_blank",
    rel: "noopener",
    className: "post-card-link"
  }, React.createElement("div", {
    className: "post-img"
  }, React.createElement("div", {
    className: "ph",
    style: {
      backgroundImage: `url(${IMG(p.img, 900, 720)})`
    }
  })), React.createElement("div", {
    className: "post-meta"
  }, React.createElement("span", null, p.date), React.createElement("span", {
    className: "dot"
  }), React.createElement("span", {
    className: "loc"
  }, p.loc)), React.createElement("h3", null, p.title), React.createElement("p", null, p.body), React.createElement("span", {
    className: "post-link"
  }, "Read entry ", React.createElement("span", {
    className: "arrow"
  }, "\u2192")))))));
}
function CtaStrip() {
  const sv = window.useSlots ? window.useSlots() : 0;
  const bgSrc = React.useMemo(() => getSlotSrc("composites-01") || getSlotSrc("sunrise-01") || IMG("8da357_4d78fde2ed5e4060a6fbcb57ab1da1b2", 2200, 900), [sv]);
  return React.createElement("div", {
    className: "cta-strip",
    "data-reveal": true,
    style: {
      "--cta-img": `url(${bgSrc})`
    }
  }, React.createElement("h2", null, "Want a piece of the wild on your ", React.createElement("em", null, "wall?")), React.createElement("p", null, "I print a small, hand-picked set each year \u2014 limited-edition archival prints, photo walls, and the annual yearbook. Drop a line, and I'll send the current catalog."), React.createElement("div", {
    className: "hero-actions"
  }, React.createElement("a", {
    className: "btn btn-ghost",
    href: "https://blog.ashitgphotography.com/copy-of-calendars",
    target: "_blank",
    rel: "noopener"
  }, "See the yearbooks")));
}
function Footer() {
  return React.createElement("footer", {
    className: "footer",
    id: "about"
  }, React.createElement("div", {
    className: "footer-grid"
  }, React.createElement("div", null, React.createElement("h2", {
    className: "foot-brand",
    "data-reveal": true
  }, "Ashit ", React.createElement("em", null, "Gandhi.")), React.createElement("p", {
    className: "foot-loc",
    "data-reveal": true,
    style: {
      transitionDelay: ".1s"
    }
  }, React.createElement("span", {
    className: "ln"
  }), " Vadodara, Gujarat \u2014 India")), React.createElement("div", {
    className: "foot-col",
    "data-reveal": true
  }, React.createElement("h4", null, "Portfolio"), React.createElement("a", {
    href: "https://blog.ashitgphotography.com/portfolio-birds",
    target: "_blank",
    rel: "noopener"
  }, "Birds"), React.createElement("a", {
    href: "https://blog.ashitgphotography.com/portfolio-macro",
    target: "_blank",
    rel: "noopener"
  }, "Macro"), React.createElement("a", {
    href: "https://blog.ashitgphotography.com/composite-images",
    target: "_blank",
    rel: "noopener"
  }, "Composites"), React.createElement("a", {
    href: "https://blog.ashitgphotography.com/portfolio-landscape",
    target: "_blank",
    rel: "noopener"
  }, "Landscape")), React.createElement("div", {
    className: "foot-col",
    "data-reveal": true
  }, React.createElement("h4", null, "Editions"), React.createElement("a", {
    href: "https://blog.ashitgphotography.com/yearbook-2024",
    target: "_blank",
    rel: "noopener"
  }, "Yearbook 2024"), React.createElement("a", {
    href: "https://blog.ashitgphotography.com/yearbook-2023",
    target: "_blank",
    rel: "noopener"
  }, "Yearbook 2023"), React.createElement("a", {
    href: "https://blog.ashitgphotography.com/calendars",
    target: "_blank",
    rel: "noopener"
  }, "Calendars"), React.createElement("a", {
    href: "https://blog.ashitgphotography.com/photowalls",
    target: "_blank",
    rel: "noopener"
  }, "Photo walls")), React.createElement("div", {
    className: "foot-col",
    "data-reveal": true
  }, React.createElement("h4", null, "Elsewhere"), React.createElement("a", {
    href: "https://instagram.com/ashitgandhi_",
    target: "_blank",
    rel: "noopener"
  }, "Instagram"), React.createElement("a", {
    href: "https://www.facebook.com/ashitgphotography",
    target: "_blank",
    rel: "noopener"
  }, "Facebook"), React.createElement("a", {
    href: "https://www.twitter.com/GandhiAshit",
    target: "_blank",
    rel: "noopener"
  }, "X / Twitter"), React.createElement("a", {
    href: "mailto:ashitg.photography@gmail.com"
  }, "Email"))), React.createElement("div", {
    className: "foot-bottom"
  }, React.createElement("span", null, "\xA9 2018\u20132026 Ashit Gandhi. All frames are mine."), React.createElement("div", {
    className: "socials"
  }, React.createElement("a", {
    href: "https://instagram.com/ashitgandhi_",
    target: "_blank",
    rel: "noopener",
    "aria-label": "Instagram"
  }, React.createElement("svg", {
    width: "14",
    height: "14",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.6"
  }, React.createElement("rect", {
    x: "3",
    y: "3",
    width: "18",
    height: "18",
    rx: "5"
  }), React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "4"
  }), React.createElement("circle", {
    cx: "17.5",
    cy: "6.5",
    r: "1",
    fill: "currentColor"
  }))), React.createElement("a", {
    href: "https://www.facebook.com/ashitgphotography",
    target: "_blank",
    rel: "noopener",
    "aria-label": "Facebook"
  }, React.createElement("svg", {
    width: "14",
    height: "14",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.6"
  }, React.createElement("path", {
    d: "M14 8h3V4h-3a4 4 0 0 0-4 4v2H7v4h3v8h4v-8h3l1-4h-4V8z"
  }))), React.createElement("a", {
    href: "https://www.twitter.com/GandhiAshit",
    target: "_blank",
    rel: "noopener",
    "aria-label": "Twitter"
  }, React.createElement("svg", {
    width: "14",
    height: "14",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.6"
  }, React.createElement("path", {
    d: "M4 4l7.5 10L4.5 20H7l5.5-5L17 20h3l-7.7-10.4L19 4h-2.5l-5 5L8 4H4z"
  }))))));
}
Object.assign(window, {
  FeaturedGallery,
  Lightbox,
  Posts,
  CtaStrip,
  Footer,
  FILTERS,
  POSTS
});