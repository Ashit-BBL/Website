const {
  useState: useStateA,
  useEffect: useEffectA
} = React;
const TWEAK_DEFAULTS = {
  "accent": "#d4a35a",
  "heroStyle": "cinematic"
};
const ACCENTS = ["#d4a35a", "#e58e3a", "#7aa56a", "#5eb0a8"];
const HERO_VARIANTS = ["cinematic", "mosaic", "parallax"];
function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [filter, setFilter] = useStateA("all");
  useEffectA(() => {
    document.documentElement.style.setProperty("--accent", t.accent);
  }, [t.accent]);
  useReveal();
  const scrollToGallery = id => {
    setFilter(id);
    setTimeout(() => {
      const g = document.getElementById("gallery");
      if (g) {
        const top = g.getBoundingClientRect().top + window.scrollY - 20;
        window.scrollTo({
          top,
          behavior: "smooth"
        });
      }
    }, 50);
  };
  return React.createElement(React.Fragment, null, React.createElement(Nav, null), React.createElement(Hero, {
    variant: t.heroStyle
  }), React.createElement(FieldNotes, null), React.createElement(Stats, null), React.createElement(Categories, {
    onPickCategory: scrollToGallery
  }), React.createElement(FeaturedGallery, {
    initialFilter: filter,
    onFilterChange: setFilter
  }), React.createElement(Posts, null), React.createElement(CtaStrip, null), React.createElement(Footer, null), React.createElement(TweaksPanel, null, React.createElement(TweakSection, {
    label: "Accent colour"
  }), React.createElement(TweakColor, {
    label: "Color",
    value: t.accent,
    options: ACCENTS,
    onChange: v => setTweak("accent", v)
  }), React.createElement(TweakSection, {
    label: "Hero style"
  }), React.createElement(TweakRadio, {
    label: "Variant",
    value: t.heroStyle,
    options: HERO_VARIANTS,
    onChange: v => setTweak("heroStyle", v)
  })));
}
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(React.createElement(App, null));