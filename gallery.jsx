/* global React, PHOTO_SLOTS, getAllPhotoSlots, getSlotSrc, IMG, useLiveSlotImages */
const { useState: useStateG, useEffect: useEffectG, useMemo: useMemoG, useCallback: useCallbackG, useRef: useRefG } = React;

const FILTERS = [
  { id: "all",        label: "All" },
  { id: "birds",      label: "Birds" },
  { id: "macro",      label: "Macro" },
  { id: "composites", label: "Composites" },
  { id: "landscape",  label: "Landscape" },
];

/* ─── Featured Frames ──────────────────────────────────────────────── */
function FeaturedGallery({ initialFilter = "all", onFilterChange }) {
  const [filter,  setFilter]  = useStateG(initialFilter);
  const [openIdx, setOpenIdx] = useStateG(-1);
  const masonryRef = useRefG(null);

  useEffectG(() => { setFilter(initialFilter); }, [initialFilter]);

  const allSlots  = useMemoG(() => getAllPhotoSlots(), []);
  const allPhotos = useLiveSlotImages(allSlots);

  const list = useMemoG(
    () => filter === "all" ? allPhotos : allPhotos.filter(p => p.cat === filter),
    [filter, allPhotos]
  );

  /* ── JS masonry: set grid-row-end span ───────────────────────────
     Uses naturalWidth/Height when available, estimates frame width
     × a portrait ratio before the image loads so frames never
     collapse to the 4 px grid-auto-rows default.                  */
  const resizeItem = useCallbackG((frame) => {
    if (!frame) return;
    const img = frame.querySelector('img');
    const fw  = frame.getBoundingClientRect().width || 300;
    let h;
    if (img && img.naturalWidth > 0) {
      h = (img.naturalHeight / img.naturalWidth) * fw;
    } else {
      h = frame.getBoundingClientRect().height;
      if (h < 8) h = fw * 1.3; /* pre-load estimate */
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
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [list, resizeAll]);

  /* keyboard nav for lightbox */
  useEffectG(() => {
    if (openIdx < 0) return;
    const onKey = (e) => {
      if (e.key === "Escape")     setOpenIdx(-1);
      if (e.key === "ArrowRight") setOpenIdx(i => (i + 1) % list.length);
      if (e.key === "ArrowLeft")  setOpenIdx(i => (i - 1 + list.length) % list.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openIdx, list.length]);

  const pick = useCallbackG((id) => {
    setFilter(id);
    onFilterChange && onFilterChange(id);
  }, [onFilterChange]);

  return (
    <section className="section" id="gallery">
      <div className="section-head">
        <div>
          <div className="section-eyebrow" data-reveal>
            <span className="num">03 / Featured Frames</span>
          </div>
          <h2 className="section-title" data-reveal style={{ transitionDelay: "0.1s" }}>
            A handful of <em>keepers.</em>
          </h2>
        </div>
        <p className="section-sub" data-reveal style={{ transitionDelay: "0.2s" }}>
          Filter by category, click any frame to look closer.
          Most of these took a few cold mornings to earn.
        </p>
      </div>

      <div className="gallery-filters" data-reveal>
        {FILTERS.map(f => (
          <button
            key={f.id}
            className="chip"
            data-on={filter === f.id ? "1" : "0"}
            onClick={() => pick(f.id)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {list.length === 0 ? (
        <div className="gallery-empty" data-reveal>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" opacity=".3">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          <p>Photos will appear here once images are uploaded to the <strong>assets</strong> folders on GitHub.</p>
        </div>
      ) : (
        <div className="masonry" ref={masonryRef}>
          {list.map((p, idx) => (
            <figure
              key={p.id}
              className="frame"
              data-reveal
              style={{ transitionDelay: `${Math.min(idx, 8) * 0.05}s` }}
              onClick={() => setOpenIdx(idx)}
            >
              <img
                src={p.src}
                alt={p.title}
                loading="lazy"
                onLoad={e => resizeItem(e.target.closest('.frame'))}
                onError={e => {
                  const f = e.target.closest('.frame');
                  if (f) f.style.display = 'none';
                }}
              />
              {(p.title || p.loc) && (
                <figcaption className="caption">
                  {p.title}{p.title && p.loc ? ' · ' : ''}<span style={{ opacity: .7 }}>{p.loc}</span>
                </figcaption>
              )}
            </figure>
          ))}
        </div>
      )}

      <Lightbox
        list={list}
        idx={openIdx}
        onClose={() => setOpenIdx(-1)}
        onPrev={() => setOpenIdx(i => (i - 1 + list.length) % list.length)}
        onNext={() => setOpenIdx(i => (i + 1) % list.length)}
      />
    </section>
  );
}

/* ─── Lightbox ─────────────────────────────────────────────────────── */
function Lightbox({ list, idx, onClose, onPrev, onNext }) {
  const open = idx >= 0;
  const p = open ? list[idx] : null;
  return (
    <div className="lightbox" data-on={open ? "1" : "0"} onClick={onClose}>
      {open && (
        <>
          <div className="lb-counter">
            {String(idx + 1).padStart(2, "0")} / {String(list.length).padStart(2, "0")}
          </div>
          <button className="lb-x" onClick={e => { e.stopPropagation(); onClose(); }} aria-label="Close">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" strokeWidth="1.6" stroke="currentColor"><path d="M6 6l12 12M18 6L6 18"/></svg>
          </button>
          <button className="lb-nav prev" onClick={e => { e.stopPropagation(); onPrev(); }} aria-label="Previous">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" strokeWidth="1.6" stroke="currentColor"><path d="M15 6l-6 6 6 6"/></svg>
          </button>
          <button className="lb-nav next" onClick={e => { e.stopPropagation(); onNext(); }} aria-label="Next">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" strokeWidth="1.6" stroke="currentColor"><path d="M9 6l6 6-6 6"/></svg>
          </button>
          <img src={p.src} alt={p.title} onClick={e => e.stopPropagation()} />
          <div className="lb-cap">{p.title}{p.title && p.loc ? ' · ' : ''}{p.loc}</div>
        </>
      )}
    </div>
  );
}

/* ─── Latest posts ─────────────────────────────────────────────────── */
const POSTS = [
  {
    img: "8da357_5ac52a1d875c4dbdb09d4262057d1fa5",
    date: "Dec 2025", loc: "Jaisalmer, Rajasthan",
    title: "Six safaris in the Desert National Park",
    body: "Laggar falcons, chinkara at dawn, and a Great Indian Bustard that finally let me near. Field notes from the dunes.",
  },
  {
    img: "8da357_117fc1df67ce40d58658f7d693b37a26",
    date: "Jan 2025", loc: "Ranthambore",
    title: "Five mornings with Riddhi's cub",
    body: "What I learned about light, patience, and how loud a tiger can be when it's choosing whether to look at you.",
  },
  {
    img: "8da357_8d2b9270b6de4cc6a13dee8220320069",
    date: "Dec 2024", loc: "Latpanchar, West Bengal",
    title: "Avian wonders, part three",
    body: "Red-headed Trogons, Sultan Tits, and a fog so thick it felt like the forest was hiding the birds on purpose.",
  },
];

function Posts() {
  return (
    <section className="section" id="journal">
      <div className="section-head">
        <div>
          <div className="section-eyebrow" data-reveal>
            <span className="num">04 / Journal</span>
          </div>
          <h2 className="section-title" data-reveal style={{ transitionDelay: "0.1s" }}>
            From the <em>field.</em>
          </h2>
        </div>
        <p className="section-sub" data-reveal style={{ transitionDelay: "0.2s" }}>
          Trip reports, half-formed thoughts, and the occasional rant about
          tripod heads. Slow blog, slow photography.
        </p>
      </div>
      <div className="posts">
        {POSTS.map((p, i) => (
          <article className="post" key={i} data-reveal style={{ transitionDelay: `${i * 0.1}s` }}>
            <div className="post-img">
              <div className="ph" style={{ backgroundImage: `url(${IMG(p.img, 900, 720)})` }} />
            </div>
            <div className="post-meta">
              <span>{p.date}</span>
              <span className="dot" />
              <span className="loc">{p.loc}</span>
            </div>
            <h3>{p.title}</h3>
            <p>{p.body}</p>
            <span className="post-link">Read entry <span className="arrow">→</span></span>
          </article>
        ))}
      </div>
    </section>
  );
}

/* ─── CTA strip ────────────────────────────────────────────────────── */
function CtaStrip() {
  const sv = window.useSlots ? window.useSlots() : 0;
  const bgSrc = React.useMemo(() =>
    getSlotSrc("composites-01") || getSlotSrc("sunrise-01") || IMG("8da357_4d78fde2ed5e4060a6fbcb57ab1da1b2", 2200, 900),
    [sv]
  );
  return (
    <div className="cta-strip" data-reveal style={{ "--cta-img": `url(${bgSrc})` }}>
      <h2>Want a piece of the wild on your <em>wall?</em></h2>
      <p>
        I print a small, hand-picked set each year — limited-edition archival prints,
        photo walls, and the annual yearbook. Drop a line, and I&apos;ll send the
        current catalog.
      </p>
      <div className="hero-actions">
        <button className="btn btn-ghost">See the yearbooks</button>
      </div>
    </div>
  );
}

/* ─── Footer ───────────────────────────────────────────────────────── */
function Footer() {
  return (
    <footer className="footer" id="about">
      <div className="footer-grid">
        <div>
          <h2 className="foot-brand" data-reveal>Ashit <em>Gandhi.</em></h2>
          <p className="foot-loc" data-reveal style={{ transitionDelay: ".1s" }}>
            <span className="ln" /> Vadodara, Gujarat — India
          </p>
        </div>
        <div className="foot-col" data-reveal>
          <h4>Portfolio</h4>
          <a href="#work">Birds</a>
          <a href="#work">Macro</a>
          <a href="#work">Composites</a>
          <a href="#work">Landscape</a>
        </div>
        <div className="foot-col" data-reveal>
          <h4>Editions</h4>
          <a href="#journal">Yearbook 2024</a>
          <a href="#journal">Yearbook 2023</a>
          <a href="#journal">Calendars</a>
          <a href="#journal">Photo walls</a>
        </div>
        <div className="foot-col" data-reveal>
          <h4>Elsewhere</h4>
          <a href="#">Instagram</a>
          <a href="#">Facebook</a>
          <a href="#">X / Twitter</a>
          <a href="#">Email</a>
        </div>
      </div>
      <div className="foot-bottom">
        <span>© 2018–2026 Ashit Gandhi. All frames are mine.</span>
        <div className="socials">
          <a href="#" aria-label="Instagram">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>
          </a>
          <a href="#" aria-label="Facebook">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M14 8h3V4h-3a4 4 0 0 0-4 4v2H7v4h3v8h4v-8h3l1-4h-4V8z"/></svg>
          </a>
          <a href="#" aria-label="Twitter">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M4 4l7.5 10L4.5 20H7l5.5-5L17 20h3l-7.7-10.4L19 4h-2.5l-5 5L8 4H4z"/></svg>
          </a>
        </div>
      </div>
    </footer>
  );
}

Object.assign(window, {
  FeaturedGallery, Lightbox, Posts, CtaStrip, Footer, FILTERS, POSTS,
});
