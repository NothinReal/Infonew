import { useEffect, useRef } from "react";

/**
 * Floating planets background:
 * - GPU-friendly canvas, DPR-scaled
 * - Depth parallax on mouse move
 * - Soft gradient shading + optional rings
 * - Wraps around edges, slow drift
 * - Respects prefers-reduced-motion
 */
export default function PlanetsLayer({
  count = 6, // base number of planets
  minSize = 60, // px
  maxSize = 180, // px
  speed = 0.06, // base drift speed
}) {
  const ref = useRef(null);

  useEffect(() => {
    const c = ref.current;
    const ctx = c.getContext("2d");
    let w = 0,
      h = 0,
      dpr = Math.min(window.devicePixelRatio || 1, 2);

    const prefersReduced = matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const coarse = matchMedia("(pointer: coarse)").matches;

    const TARGET = prefersReduced
      ? Math.max(2, Math.floor(count * 0.4))
      : count;
    const PLANETS = [];
    const rand = (a, b) => Math.random() * (b - a) + a;
    const choice = (arr) => arr[(Math.random() * arr.length) | 0];

    const palettes = [
      ["#FEE3B0", "#F7B267", "#F79D65", "#F4845F"], // warm sand
      ["#C3D5FF", "#8FB3FF", "#6D8CFF", "#485BFF"], // indigo ice
      ["#FFC7EA", "#FBA1D0", "#E685B5", "#C66BA7"], // pink nebula
      ["#B7F0AD", "#7ED39E", "#58B89B", "#3A8C86"], // teal jade
      ["#FFE6B3", "#FFBE7B", "#FF9B54", "#D96B2B"], // orange dusk
    ];

    const resize = () => {
      w = c.width = Math.floor(window.innerWidth * dpr);
      h = c.height = Math.floor(window.innerHeight * dpr);
      c.style.width = window.innerWidth + "px";
      c.style.height = window.innerHeight + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const makePlanet = () => {
      const palette = choice(palettes);
      const r = rand(minSize, maxSize);
      const hasRing = Math.random() < 0.35;
      const depth = rand(0.4, 1.0); // 0=far,1=near
      const drift = speed * (0.4 + depth); // deeper = faster
      const hueShift = rand(-0.05, 0.05); // tiny hue jitter in gradient
      return {
        x: rand(-r, window.innerWidth + r),
        y: rand(-r, window.innerHeight + r),
        r,
        palette,
        depth,
        driftX: rand(-drift, drift),
        driftY: rand(-drift, drift),
        rot: rand(0, Math.PI * 2),
        rotSpeed: rand(-0.0015, 0.0015),
        hasRing,
        ringTilt: rand(-0.5, 0.5),
        hueShift,
      };
    };

    // init
    resize();
    PLANETS.length = 0;
    for (let i = 0; i < TARGET; i++) PLANETS.push(makePlanet());

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    const onMove = (e) => {
      if (!coarse) {
        mouseX = e.clientX;
        mouseY = e.clientY;
      }
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("resize", resize);

    let raf;
    const bgGrad = () => {
      const g = ctx.createLinearGradient(0, 0, 0, window.innerHeight);
      g.addColorStop(0, "#040515");
      g.addColorStop(1, "#0a0b1b");
      return g;
    };

    const drawPlanet = (p) => {
      // parallax offset
      const parallax = 12 * p.depth; // px
      const px =
        p.x + (mouseX - window.innerWidth / 2) * (parallax / window.innerWidth);
      const py =
        p.y +
        (mouseY - window.innerHeight / 2) * (parallax / window.innerHeight);

      // body shading (radial gradient)
      const grad = ctx.createRadialGradient(
        px - p.r * 0.3,
        py - p.r * 0.3,
        p.r * 0.1,
        px,
        py,
        p.r
      );
      const cols = p.palette;
      grad.addColorStop(0, addAlpha(cols[0], 1));
      grad.addColorStop(0.45, addAlpha(cols[1], 0.95));
      grad.addColorStop(0.85, addAlpha(cols[2], 0.9));
      grad.addColorStop(1, addAlpha(cols[3], 0.0));

      // glow
      ctx.beginPath();
      ctx.fillStyle = grad;
      ctx.shadowColor = addAlpha(cols[1], 0.25);
      ctx.shadowBlur = Math.min(40, p.r * 0.4);
      ctx.arc(px, py, p.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // subtle surface bands
      ctx.save();
      ctx.translate(px, py);
      ctx.rotate(p.rot);
      ctx.globalAlpha = 0.15;
      ctx.fillStyle = addAlpha("#ffffff", 0.16);
      for (let i = -p.r * 0.6; i <= p.r * 0.6; i += p.r * 0.18) {
        roundedRect(ctx, -p.r * 0.9, i, p.r * 1.8, p.r * 0.08, p.r * 0.04);
        ctx.fill();
      }
      ctx.restore();
      ctx.globalAlpha = 1;

      // rings (if any)
      if (p.hasRing) {
        ctx.save();
        ctx.translate(px, py);
        ctx.rotate(p.ringTilt);
        ctx.globalAlpha = 0.55;

        // outer ring gradient stroke
        const rg = ctx.createLinearGradient(-p.r * 1.6, 0, p.r * 1.6, 0);
        rg.addColorStop(0, "rgba(255,255,255,0)");
        rg.addColorStop(0.2, "rgba(255,255,255,0.3)");
        rg.addColorStop(0.8, "rgba(255,255,255,0.3)");
        rg.addColorStop(1, "rgba(255,255,255,0)");
        ctx.strokeStyle = rg;
        ctx.lineWidth = Math.max(1, p.r * 0.16);
        ellipseStroke(ctx, 0, 0, p.r * 1.4, p.r * 0.5);
        ctx.stroke();

        ctx.globalAlpha = 1;
        ctx.restore();
      }
    };

    function addAlpha(hexOrRgb, a = 1) {
      if (hexOrRgb.startsWith("#")) {
        // simple hex → rgba; no full parsing needed for this palette
        const hex = hexOrRgb.replace("#", "");
        const bigint = parseInt(
          hex.length === 3
            ? hex
                .split("")
                .map((x) => x + x)
                .join("")
            : hex,
          16
        );
        const r = (bigint >> 16) & 255;
        const g = (bigint >> 8) & 255;
        const b = bigint & 255;
        return `rgba(${r},${g},${b},${a})`;
      }
      return hexOrRgb; // already rgba
    }

    function roundedRect(ctx, x, y, w, h, r) {
      const rr = Math.min(r, h / 2, w / 2);
      ctx.beginPath();
      ctx.moveTo(x + rr, y);
      ctx.arcTo(x + w, y, x + w, y + h, rr);
      ctx.arcTo(x + w, y + h, x, y + h, rr);
      ctx.arcTo(x, y + h, x, y, rr);
      ctx.arcTo(x, y, x + w, y, rr);
      ctx.closePath();
    }

    function ellipseStroke(ctx, x, y, rx, ry) {
      ctx.save();
      ctx.beginPath();
      ctx.translate(x, y);
      ctx.scale(1, ry / rx);
      ctx.arc(0, 0, rx, 0, Math.PI * 2);
      ctx.restore();
    }

    const step = () => {
      // bg gradient
      ctx.fillStyle = bgGrad();
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

      // move & wrap + rotate
      for (const p of PLANETS) {
        p.x += p.driftX;
        p.y += p.driftY;
        p.rot += p.rotSpeed;

        const margin = p.r * 1.8;
        if (p.x < -margin) p.x = window.innerWidth + margin;
        if (p.x > window.innerWidth + margin) p.x = -margin;
        if (p.y < -margin) p.y = window.innerHeight + margin;
        if (p.y > window.innerHeight + margin) p.y = -margin;

        drawPlanet(p);
      }
      raf = requestAnimationFrame(step);
    };

    step();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
    };
  }, [count, minSize, maxSize, speed]);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="fixed inset-0 -z-50 pointer-events-none"
    />
  );
}
