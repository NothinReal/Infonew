import { useEffect, useMemo, useState } from "react";
import { site } from "./content.js";
import Header from "./components/Header.jsx";
import Hero from "./components/Hero.jsx";
import FeaturedGrid from "./components/FeaturedGrid.jsx";
import Section from "./components/Section.jsx";
import Skills from "./components/Skills.jsx";
import ReadingList from "./components/ReadingList.jsx";
import HobbiesStrip from "./components/HobbiesStrip.jsx";
import Contact from "./components/Contact.jsx";
import Footer from "./components/Footer.jsx";
import Now from "./components/Now.jsx";
import Starfield from "./components/Starfield.jsx";
import CursorGlow from "./components/CursorGlow.jsx";
import PlanetsLayer from "./components/PlanetsLayer.jsx";
import Animation from "./assets/Animation.gif";

/* ---------------------- Theme persistence ---------------------- */
function useTheme() {
  const [theme, setTheme] = useState(() => {
    const saved =
      typeof window !== "undefined" ? localStorage.getItem("theme") : null;
    if (saved) return saved;
    const prefersDark =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    return prefersDark ? "dark" : "light";
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  return { theme, setTheme };
}

/* ---------------------- Scrollspy ---------------------- */
function useScrollSpy(ids) {
  const [active, setActive] = useState("home");
  const options = useMemo(
    () => ({ rootMargin: "-45% 0px -50% 0px", threshold: 0 }),
    []
  );

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(
        (entry) => entry.isIntersecting && setActive(entry.target.id)
      );
    }, options);
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [ids, options]);

  return active;
}

/* ---------------------- Lightbox Modal ---------------------- */
function Lightbox({ open, onClose, title, src, alt }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-[2px] flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-white dark:bg-zinc-900 rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-200 dark:border-zinc-800">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-md px-2 py-1 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            ✕
          </button>
        </div>
        <div className="max-h-[80vh] overflow-auto">
          <img src={src} alt={alt ?? ""} className="w-full h-auto" />
        </div>
        <div className="px-4 py-3 text-sm opacity-80">
          Click outside or press <kbd>Esc</kbd> to close.
        </div>
      </div>
    </div>
  );
}

/* ---------------------- Main App ---------------------- */
export default function App() {
  const { theme, setTheme } = useTheme();
  const sectionIds = site.sections.map((s) => s.id);
  const active = useScrollSpy(sectionIds);

  const [lightbox, setLightbox] = useState({
    open: false,
    title: "",
    src: "",
    alt: "",
  });

  const handleMoreInfo = (item) => {
    const isEriski =
      item?.slug === "eriski" ||
      (item?.title ?? "").toLowerCase().includes("eriski");

    const src = isEriski
      ? Animation
      : item?.media || item?.gif || item?.image || Animation;

    setLightbox({
      open: true,
      title: item?.title || "Project",
      src,
      alt: `${item?.title || "Project"} demo`,
    });
  };

  return (
    <div className="relative">
      {/* 🌌 Background stack */}
      <PlanetsLayer count={7} /> {/* floating planets */}
      <Starfield /> {/* twinkling stars */}
      <CursorGlow /> {/* mouse glow */}
      {/* UI */}
      <Header
        sections={site.sections}
        active={active}
        theme={theme}
        onToggle={() => setTheme(theme === "dark" ? "light" : "dark")}
      />
      <main id="main" className="mx-auto max-w-6xl px-4">
        <Section id="home">
          <Hero />
        </Section>

        <Section id="featured" title="Highlights 🔥">
          <FeaturedGrid items={site.featured} />
        </Section>

        <Section id="projects" title="Projects">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {site.projects.map((p) => (
              <FeaturedGrid.Card
                key={p.title}
                item={p}
                compact
                onMoreInfo={() => handleMoreInfo(p)}
              />
            ))}
          </div>
        </Section>

        <Section id="skills" title="Skills">
          <Skills />
        </Section>

        <Section id="now" title={site.now.heading}>
          <Now now={site.now} />
        </Section>

        <Section id="reading" title="Reading">
          <ReadingList items={site.reading} />
        </Section>

        <Section id="hobbies" title="Hobbies">
          <HobbiesStrip items={site.hobbies} />
          <div id="back-to-fun" aria-hidden="true" />
        </Section>

        <Section id="contact" title="Contact">
          <Contact />
        </Section>
      </main>
      <Footer />
      {/* Lightbox modal */}
      <Lightbox
        open={lightbox.open}
        onClose={() => setLightbox((s) => ({ ...s, open: false }))}
        title={lightbox.title}
        src={lightbox.src}
        alt={lightbox.alt}
      />
    </div>
  );
}
