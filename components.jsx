/* global React, PHOTO_SLOTS, getSlotSrc, IMG */
const { useState, useEffect, useRef, useMemo, useCallback } = React;

/* ─── Wix image helper (editorial fallbacks: FieldNotes, CTA) ─────── */
const IMG = (id, w = 1600, h = 1100, mode = "fill", ext = "jpg") => {
  if (typeof id === "string" && (id.includes("/") || id.startsWith("http") || id.startsWith("data:"))) {
    const inlined = window.__resources && window.__resources[id];
    return inlined || id;
  }
  const inlined = window.__resources && window.__resources["img_" + id];
  if (inlined) return inlined;
  return `https://static.wixstatic.com/media/${id}~mv2.${ext}/v1/${mode}/w_${w},h_${h},al_c,q_85,enc_avif,quality_auto/${id}~mv2.${ext}`;
};

/* ─── Hook: version bump when any slot changes ─────────────────────── */
function useSlots() {
  const [v, setV] = useState(0);
  useEffect(() => {
    const h = () => setV(x => x + 1);
    window.addEventListener("slots-updated", h);
    return () => window.removeEventListener("slots-updated", h);
  }, []);
  return v;
}

/* ─── Hook: derive slot images synchronously ───────────────────────── *
   Returns all slots that have a src path immediately — no async probe.
   Broken images are hidden by onError in the rendering component.      */
function useLiveSlotImages(slots) {
  const sv = useSlots();
  return useMemo(() => {
    if (!slots) return [];
    return slots.map(s => {
      const src = getSlotSrc(s.id);
      return src ? { ...s, src } : null;
    }).filter(Boolean);
  }, [slots, sv]);
}

/* ─── Hook: single slot image with Wix fallback — synchronous ──────── */
function useSlotOrWix(slotId, wixId, w, h) {
  const sv = useSlots();
  return useMemo(() => {
    const src = getSlotSrc(slotId);
    if (src) return src;
    if (wixId) return IMG(wixId, w || 1000, h || 1400);
    return null;
  }, [slotId, wixId, sv]);
}

/* ─── Scroll reveal ─────────────────────────────────────────────────── */
function useReveal() {
  useEffect(() => {
    const io = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.setAttribute("data-reveal", "visible");
          io.unobserve(e.target);
        }
      }),
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
    );
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
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, [threshold]);
  return s;
}

function useCountUp(target, opts = {}) {
  const { duration = 1800, start = 0 } = opts;
  const [val, setVal] = useState(start);
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
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
    }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, [target, duration, start]);
  return [val, ref];
}

/* ─── Nav ────────────────────────────────────────────────────────────── */
function Nav({ isHome = true }) {
  const scrolled = useScrolled(40);
  const sec = h => isHome ? `#${h}` : `index.html#${h}`;
  return (
    <nav className="nav" data-scrolled={scrolled ? "1" : "0"}>
      <a className="nav-brand" href="index.html">
        <span className="nav-brand-mark">A</span>
        <span>Ashit Gandhi</span>
      </a>
      <div className="nav-links">
        <a href={sec("work")}>Portfolio</a>
        <a href={sec("gallery")}>Gallery</a>
        <a href="Blog.html">Journal</a>
        <a href="About.html">About</a>
        <a href="exif-tool.html">EXIF Tool</a>
      </div>
      <a className="nav-cta" href="About.html#contact">Say hello →</a>
    </nav>
  );
}

/* ─── Hero variants ──────────────────────────────────────────────────── */
function HeroCinematic() {
  const picks = useLiveSlotImages(PHOTO_SLOTS.hero);
  const [i, setI] = useState(0);

  useEffect(() => {
    if (picks.length > 0 && i >= picks.length) setI(0);
  }, [picks.length]);

  useEffect(() => {
    if (picks.length < 2) return;
    const t = setInterval(() => setI(x => (x + 1) % picks.length), 5000);
    return () => clearInterval(t);
  }, [picks.length]);

  const cur = picks[i] || null;
  return (
    <>
      <div className="hero-stage">
        {picks.map((p, idx) => (
          <div
            key={p.id}
            className="hero-img"
            data-on={idx === i ? "1" : "0"}
            style={{ backgroundImage: `url(${p.src})` }}
          />
        ))}
      </div>
      <div className="hero-grade" />
      {cur && (
        <div className="hero-counter">
          <div className="seq">{String(i + 1).padStart(2, "0")} / {String(picks.length).padStart(2, "0")}</div>
          <div className="ttl">{cur.title} · {cur.loc}</div>
        </div>
      )}
    </>
  );
}

function HeroMosaic() {
  const heroImgs = useLiveSlotImages(PHOTO_SLOTS.hero);
  const sv = useSlots();
  const otherSlots = useMemo(() =>
    ["birds","macro","landscape","sunrise"].flatMap(cat =>
      PHOTO_SLOTS[cat].map(s => ({ ...s, cat }))
    ), []
  );
  const otherImgs = useLiveSlotImages(otherSlots);
  const cells = useMemo(() => {
    const all = [...heroImgs, ...otherImgs].slice(0, 7);
    while (all.length < 7) all.push(null);
    return all;
  }, [heroImgs, otherImgs]);

  return (
    <>
      <div className="hero-mosaic">
        {cells.map((p, idx) => (
          <div
            key={p ? p.id : idx}
            className={idx === 0 ? "cell lg" : "cell"}
            style={p ? { backgroundImage: `url(${p.src})`, animationDelay: `${idx * 0.2}s` }
                      : { animationDelay: `${idx * 0.2}s` }}
          />
        ))}
      </div>
      <div className="hero-grade" />
    </>
  );
}

function HeroParallax() {
  const picks = useLiveSlotImages([PHOTO_SLOTS.hero[0]]);
  const ref = useRef(null);
  useEffect(() => {
    const fn = () => {
      if (!ref.current) return;
      ref.current.style.transform =
        `translateY(${window.scrollY * 0.4}px) scale(${1.05 + window.scrollY * 0.0002})`;
    };
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);
  const src = picks[0] ? picks[0].src : null;
  return (
    <>
      <div className="hero-parallax">
        <div ref={ref} className="px-img" style={src ? { backgroundImage: `url(${src})` } : {}} />
      </div>
      <div className="hero-grade" />
    </>
  );
}

function Hero({ variant }) {
  return (
    <header className="hero" id="top">
      {variant === "mosaic"    && <HeroMosaic />}
      {variant === "parallax"  && <HeroParallax />}
      {variant === "cinematic" && <HeroCinematic />}
      <div className="hero-meta"><span className="ln" />Vadodara · Gujarat · India</div>
      <div className="hero-content">
        <div className="hero-eyebrow" data-reveal style={{ transitionDelay: "0.1s" }}>
          <span className="dot" /> Wildlife & Landscape · Field Journal
        </div>
        <h1 className="hero-title" data-reveal style={{ transitionDelay: "0.2s" }}>
          I photograph the things that <em>don&apos;t sit still.</em>
        </h1>
        <p className="hero-sub" data-reveal style={{ transitionDelay: "0.45s" }}>
          Birds, beetles and golden hours — caught between heartbeats.
          I&apos;m Ashit, a wildlife photographer based in Vadodara, India,
          telling small, patient stories about the wild that lives next door.
        </p>
        <div className="hero-actions" data-reveal style={{ transitionDelay: "0.65s" }}>
          <button className="btn btn-primary" onClick={() => {
            const el = document.getElementById('work');
            if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
          }}>See the work <span className="arrow">→</span></button>
          <button className="btn btn-ghost" onClick={() => {
            const el = document.getElementById('journal');
            if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
          }}>Field journal</button>
        </div>
      </div>
      <div className="scroll-cue">Scroll <span className="bar" /></div>
    </header>
  );
}

/* ─── Field Notes ────────────────────────────────────────────────────── */
function FieldNotes() {
  const portraitSrc = useSlotOrWix("birds-01", "8da357_bcd4c5a712c64f628f0eff3083f7c5d7", 900, 1200);
  return (
    <section className="section" id="field">
      <div className="field-notes">
        <div className="fn-portrait" data-reveal style={{ backgroundImage: portraitSrc ? `url(${portraitSrc})` : undefined }}>
          <div className="tag">Field Notes · 01</div>
        </div>
        <div className="fn-text">
          <div className="section-eyebrow" data-reveal><span className="num">01 / Field Notes</span></div>
          <h2 className="section-title" data-reveal style={{ transitionDelay: "0.1s" }}>
            Eight years, one <em>patient lens.</em>
          </h2>
          <p data-reveal style={{ transitionDelay: "0.25s" }}>
            I picked up a camera in 2018, mostly to keep me quiet in the woods. It worked.
            What started as weekend birding around Vadodara has become a private archive
            of <strong>feathers, frost, mud and morning light</strong> from across India —
            Tal Chhapar, the Little Rann, Manas, the Polo Forest.
          </p>
          <blockquote className="pull" data-reveal style={{ transitionDelay: "0.35s" }}>
            "The photo, the click, the speed of the wild — snap."
          </blockquote>
          <p data-reveal style={{ transitionDelay: "0.45s" }}>
            I don&apos;t chase rarities. I chase the moment a Shikra blinks, the second
            an Egret swallows two fish at once, the half-light that turns a Polo river silver.
            This site is where I keep the keepers.
          </p>
          <div className="fn-sign" data-reveal style={{ transitionDelay: "0.55s" }}>
            — <span className="name">Ashit Gandhi</span> · Vadodara, IN
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Stats ──────────────────────────────────────────────────────────── */
function StatNum({ to, suffix, label, desc }) {
  const [val, ref] = useCountUp(to);
  return (
    <div className="stat" ref={ref} data-reveal>
      <div className="num">{val.toLocaleString()}<span className="suffix">{suffix}</span></div>
      <div className="lbl">{label}</div>
      <div className="desc">{desc}</div>
    </div>
  );
}

function Stats() {
  return (
    <div className="stats">
      <StatNum to={8}     suffix=""   label="Years in the field"    desc="Since the first Bulbul in 2018." />
      <StatNum to={280}   suffix="+"  label="Species photographed"  desc="From garden Sunbirds to Imperial Eagles." />
      <StatNum to={45}    suffix=""   label="Locations across India" desc="Tal Chhapar, Manas, Ranthambore, the Rann." />
      <StatNum to={14000} suffix="+"  label="Frames in the archive"  desc="Carefully kept. Quietly culled." />
    </div>
  );
}

/* ─── Categories ─────────────────────────────────────────────────────── */
const CAT_DEFS = [
  { id: "birds",     title: "Birds",            coverSlot: "birds-01",     wix: "8da357_3d29c82e6f0e406d8b836ed9d61bcff6" },
  { id: "macro",     title: "Macro",            coverSlot: "macro-01",     wix: "8da357_4848c1c02bd4493a8065ca9c6d578fe8" },
  { id: "composites", title: "Composites",       coverSlot: "composites-01", wix: "8da357_4d78fde2ed5e4060a6fbcb57ab1da1b2" },
  { id: "landscape", title: "Landscape",        coverSlot: "landscape-01", wix: "8da357_bbac89e34e514c4cba29444cbd2fbfe2" },
];

function CatCard({ c, index, onPickCategory }) {
  const src = useSlotOrWix(c.coverSlot, c.wix, 1000, 1400);
  return (
    <div
      className="cat"
      data-reveal
      style={{ transitionDelay: `${index * 0.08}s` }}
      onClick={() => onPickCategory && onPickCategory(c.id)}
    >
      <div className="img" style={src ? { backgroundImage: `url(${src})` } : {}} />
      <div className="cat-inner">
        <span className="idx">0{index + 1}</span>
        <div className="cat-meta"><h3>{c.title}</h3></div>
      </div>
      <span className="cat-arrow">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" strokeWidth="1.6">
          <path d="M5 12h14M13 5l7 7-7 7" />
        </svg>
      </span>
    </div>
  );
}

function Categories({ onPickCategory }) {
  return (
    <section className="section" id="work">
      <div className="section-head">
        <div>
          <div className="section-eyebrow" data-reveal><span className="num">02 / Portfolio</span></div>
          <h2 className="section-title" data-reveal style={{ transitionDelay: "0.1s" }}>
            What I&apos;m <em>chasing.</em>
          </h2>
        </div>
        <p className="section-sub" data-reveal style={{ transitionDelay: "0.2s" }}>
          Four corners of one quiet practice. Click any door to drop into the
          gallery filtered just for that.
        </p>
      </div>
      <div className="cats">
        {CAT_DEFS.map((c, i) => (
          <CatCard key={c.id} c={c} index={i} onPickCategory={onPickCategory} />
        ))}
      </div>
    </section>
  );
}

Object.assign(window, {
  React, useState, useEffect, useRef, useMemo, useCallback,
  IMG, useSlots, useLiveSlotImages, useSlotOrWix,
  useReveal, useScrolled, useCountUp,
  Nav, Hero, FieldNotes, Stats, StatNum, Categories,
});
