/* global React, ReactDOM,
   Nav, Hero, FieldNotes, Stats, Categories,
   FeaturedGallery, Posts, CtaStrip, Footer,
   useReveal,
   TweaksPanel, TweakSection, TweakRadio, TweakColor, useTweaks */
const { useState: useStateA, useEffect: useEffectA } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent":    "#d4a35a",
  "heroStyle": "cinematic"
}/*EDITMODE-END*/;

const ACCENTS = ["#d4a35a", "#e58e3a", "#7aa56a", "#5eb0a8"];
const HERO_VARIANTS = ["cinematic", "mosaic", "parallax"];

function App() {
  const [t, setTweak]       = useTweaks(TWEAK_DEFAULTS);
  const [filter, setFilter] = useStateA("all");

  useEffectA(() => {
    document.documentElement.style.setProperty("--accent", t.accent);
  }, [t.accent]);

  useReveal();

  const scrollToGallery = (id) => {
    setFilter(id);
    setTimeout(() => {
      const g = document.getElementById("gallery");
      if (g) {
        const top = g.getBoundingClientRect().top + window.scrollY - 20;
        window.scrollTo({ top, behavior: "smooth" });
      }
    }, 50);
  };

  return (
    <>
      <Nav />
      <Hero variant={t.heroStyle} />
      <FieldNotes />
      <Stats />
      <Categories onPickCategory={scrollToGallery} />
      <FeaturedGallery initialFilter={filter} onFilterChange={setFilter} />
      <Posts />
      <CtaStrip />
      <Footer />

      <TweaksPanel>
        <TweakSection label="Accent colour" />
        <TweakColor
          label="Color"
          value={t.accent}
          options={ACCENTS}
          onChange={(v) => setTweak("accent", v)}
        />
        <TweakSection label="Hero style" />
        <TweakRadio
          label="Variant"
          value={t.heroStyle}
          options={HERO_VARIANTS}
          onChange={(v) => setTweak("heroStyle", v)}
        />
      </TweaksPanel>
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
