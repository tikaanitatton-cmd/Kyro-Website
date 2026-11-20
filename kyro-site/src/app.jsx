
const { motion } = window.Motion;
const KYRO_DATA = window.KYRO_DATA;
const KYRO_APPLY_VIDEO_DATA_URI = "/assets/apply.mp4";
const KYRO_LOGO_DATA_URI = "/assets/wordmark.png";

/* ============================================================
   SHARED
   ============================================================ */
function useInView(threshold = 0.1) {
  const ref = React.useRef(null);
  const [inView, setInView] = React.useState(false);
  React.useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
            observer.disconnect();
          }
        });
      },
      { threshold }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return [ref, inView];
}

function ArrowUpRight({ className = "h-5 w-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 17L17 7" />
      <path d="M7 7h10v10" />
    </svg>
  );
}

function PlayIcon({ className = "h-4 w-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <polygon points="6 4 20 12 6 20 6 4" />
    </svg>
  );
}

function MenuIcon({ className = "h-5 w-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 7h16" />
      <path d="M4 12h16" />
      <path d="M4 17h16" />
    </svg>
  );
}

function CloseIcon({ className = "h-5 w-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 6l12 12" />
      <path d="M18 6L6 18" />
    </svg>
  );
}

function ClockIcon({ className = "h-7 w-7" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </svg>
  );
}

function GlobeIcon({ className = "h-7 w-7" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3c2.5 2.6 3.8 5.8 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.8-3.8-9s1.3-6.4 3.8-9Z" />
    </svg>
  );
}

function ImageIcon({ className = "h-6 w-6 text-white" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M5 21q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h14q.825 0 1.413.588T21 5v14q0 .825-.587 1.413T19 21H5Zm1-4h12l-3.75-5-3 4L9 13l-3 4Z" />
    </svg>
  );
}

function MovieIcon({ className = "h-6 w-6 text-white" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M4 6.47 5.76 10H20v8H4V6.47M22 4h-4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.89-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4Z" />
    </svg>
  );
}

function LightbulbIcon({ className = "h-6 w-6 text-white" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1Zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7Z" />
    </svg>
  );
}

/* ---------- BlurText ---------- */
function BlurText({ text, className, as: Tag = "p" }) {
  const [ref, inView] = useInView(0.1);
  const words = text.split(" ");
  return (
    <Tag
      ref={ref}
      className={className}
      style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", rowGap: "0.1em" }}
    >
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{
            duration: 0.5,
            ease: "easeOut",
            delay: (i * 60) / 1000,
          }}
          style={{ display: "inline-block", marginRight: "0.28em", willChange: "transform, opacity" }}
        >
          {word}
        </motion.span>
      ))}
    </Tag>
  );
}

/* ---------- FadingVideo ---------- */
function FadingVideo({ src, className, style }) {
  // Two stacked copies of the same clip. Instead of a hard cut back to
  // frame 0 (native `loop`, which shows a visible jump), the second copy
  // is started a fraction of a second before the first ends and the two
  // are cross-dissolved, so the loop point is never visible.
  const videoARef = React.useRef(null);
  const videoBRef = React.useRef(null);
  const activeRef = React.useRef("a");
  const triggeredRef = React.useRef(false);
  const watchRafRef = React.useRef(null);
  const FADE_MS = 500;
  const CROSSFADE_S = 0.25;

  React.useEffect(() => {
    const a = videoARef.current;
    const b = videoBRef.current;
    if (!a || !b) return;

    a.style.opacity = 0;
    b.style.opacity = 0;

    const fade = (el, from, to, duration, onDone) => {
      const startTime = performance.now();
      const step = (now) => {
        const t = Math.min((now - startTime) / duration, 1);
        el.style.opacity = from + (to - from) * t;
        if (t < 1) requestAnimationFrame(step);
        else if (onDone) onDone();
      };
      requestAnimationFrame(step);
    };

    const crossfade = () => {
      const cur = activeRef.current === "a" ? a : b;
      const next = activeRef.current === "a" ? b : a;
      try {
        next.currentTime = 0;
      } catch (e) {}
      next.play().catch(() => {});
      const ms = CROSSFADE_S * 1000;
      fade(next, 0, 1, ms);
      fade(cur, 1, 0, ms, () => {
        cur.pause();
        try {
          cur.currentTime = 0;
        } catch (e) {}
      });
      activeRef.current = activeRef.current === "a" ? "b" : "a";
      triggeredRef.current = false;
    };

    // Watched every animation frame rather than via the `timeupdate` event,
    // which browsers throttle (often to a few times a second) — that
    // throttling was letting the clip reach its very last frame and hold
    // there before the crossfade kicked in, which read as a jump/stutter.
    const tick = () => {
      const el = activeRef.current === "a" ? a : b;
      if (!triggeredRef.current) {
        const nearEnd = el.duration && isFinite(el.duration) && el.duration - el.currentTime <= CROSSFADE_S;
        if (nearEnd || el.ended) {
          triggeredRef.current = true;
          crossfade();
        }
      }
      watchRafRef.current = requestAnimationFrame(tick);
    };

    let started = false;
    const start = () => {
      if (started) return;
      started = true;
      a.style.opacity = 0;
      a.play().catch(() => {});
      fade(a, 0, 1, FADE_MS);
      watchRafRef.current = requestAnimationFrame(tick);
    };

    // Mobile browsers (especially on cellular / low-data mode) often treat
    // preload="auto" as a hint they can ignore and won't actually fetch the
    // video without the `autoplay` attribute present, so `loadeddata` could
    // never fire and the clip would sit invisible forever. Listening on a
    // few different readiness events (and forcing a manual `load()`) makes
    // this resilient across browsers that fire them at different points.
    a.addEventListener("loadeddata", start);
    a.addEventListener("canplay", start);
    a.addEventListener("playing", start);
    try {
      a.load();
    } catch (e) {}

    // iOS Low Power Mode blocks autoplaying video outright at the OS level —
    // no script can force it to start on load. What it does allow is video
    // that starts as part of a genuine user gesture, so the first tap,
    // scroll or key press on the page is used to (re)kick playback. This
    // also recovers a video the OS silently paused for any other reason
    // (backgrounding the tab, a phone call, etc.) the next time someone
    // touches the page.
    const nudge = () => {
      const el = activeRef.current === "a" ? a : b;
      if (el && el.paused) el.play().catch(() => {});
      if (!started) start();
    };
    window.addEventListener("touchstart", nudge, { passive: true });
    window.addEventListener("scroll", nudge, { passive: true });
    window.addEventListener("click", nudge, { passive: true });
    document.addEventListener("visibilitychange", nudge);

    return () => {
      a.removeEventListener("loadeddata", start);
      a.removeEventListener("canplay", start);
      a.removeEventListener("playing", start);
      window.removeEventListener("touchstart", nudge);
      window.removeEventListener("scroll", nudge);
      window.removeEventListener("click", nudge);
      document.removeEventListener("visibilitychange", nudge);
      if (watchRafRef.current) cancelAnimationFrame(watchRafRef.current);
    };
  }, []);

  return (
    <React.Fragment>
      <video
        ref={videoARef}
        autoPlay
        muted
        playsInline
        webkit-playsinline="true"
        preload="auto"
        className={className}
        style={{ opacity: 0, ...style }}
        src={src}
      />
      <video
        ref={videoBRef}
        muted
        playsInline
        webkit-playsinline="true"
        preload="auto"
        className={className}
        style={{ opacity: 0, ...style }}
        src={src}
      />
    </React.Fragment>
  );
}

/* ---------- ScrollVideo: playback driven by scroll position, not autoplay ---------- */
function ScrollVideo({ src, className, style }) {
  const videoRef = React.useRef(null);
  const rafRef = React.useRef(null);
  const metaRef = React.useRef({ duration: 0, topOffset: 0, scrollable: 1 });

  React.useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.pause();

    const fadeIn = () => {
      const startOpacity = parseFloat(video.style.opacity) || 0;
      const startTime = performance.now();
      const duration = 500;
      const step = (now) => {
        const t = Math.min((now - startTime) / duration, 1);
        video.style.opacity = startOpacity + (1 - startOpacity) * t;
        if (t < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    const measure = () => {
      const section = video.closest("section");
      const topOffset = section ? section.offsetTop : 0;
      const height = section ? section.offsetHeight : window.innerHeight;
      metaRef.current.topOffset = topOffset;
      metaRef.current.scrollable = Math.max(height - window.innerHeight, 1);
    };

    let lastProgress = -1;
    let lastSeekAt = 0;
    const MIN_SEEK_INTERVAL = 80; // ms, caps seek rate so decoding can keep up
    const MIN_PROGRESS_DELTA = 0.002;

    const applyScroll = () => {
      rafRef.current = null;
      const { duration, topOffset, scrollable } = metaRef.current;
      if (!duration) return;
      const progress = Math.min(Math.max((window.scrollY - topOffset) / scrollable, 0), 1);

      if (video.seeking) return; // don't stack a new seek on top of one still resolving
      const now = performance.now();
      if (
        Math.abs(progress - lastProgress) < MIN_PROGRESS_DELTA &&
        now - lastSeekAt < MIN_SEEK_INTERVAL
      ) {
        return;
      }
      lastProgress = progress;
      lastSeekAt = now;
      video.currentTime = progress * duration;
    };

    const onScroll = () => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(applyScroll);
    };

    const onResize = () => {
      measure();
      applyScroll();
    };

    const onLoadedMetadata = () => {
      metaRef.current.duration = video.duration || 0;
      measure();
      video.style.opacity = 0;
      fadeIn();
      applyScroll();
    };

    video.addEventListener("loadedmetadata", onLoadedMetadata);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      video.removeEventListener("loadedmetadata", onLoadedMetadata);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <video
      ref={videoRef}
      muted
      playsInline
      preload="auto"
      className={className}
      style={{ opacity: 0, ...style }}
      src={src}
    />
  );
}

/* ---------- Navbar ---------- */
function Navbar({ ecom }) {
  const links = [
    { label: "Services", href: "/#kyro-services" },
    { label: "Industries", href: "/#kyro-industries" },
    { label: "Results", href: ecom ? "#kyro-results" : "/results/" },
    { label: "FAQ", href: "/#kyro-faq" },
  ];
  const ctaLabel = ecom ? "Get More Sales" : "Get More Clients";
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="fixed top-4 left-0 right-0 px-8 lg:px-16 z-50">
      <div className="flex items-center justify-between">
        <a
          href="/"
          onClick={() => setOpen(false)}
          className="w-14 h-14 rounded-full liquid-glass flex items-center justify-center p-0.5"
          style={{ backgroundColor: "rgba(0,0,0,0.55)" }}
        >
          <img
            src={KYRO_LOGO_DATA_URI}
            alt="Kyro Marketing"
            className="w-full h-full object-contain"
            style={{ transform: "scale(1.05)" }}
          />
        </a>

        <div className="hidden md:flex items-center gap-1 liquid-glass rounded-full px-1.5 py-1.5">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="px-3 py-2 text-sm font-medium text-white/90 font-body hover:text-white transition-colors"
            >
              {link.label}
            </a>
          ))}
          <a
            href="/apply/"
            className="ml-1 flex items-center gap-1.5 bg-white text-black rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap"
          >
            {ctaLabel}
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>

        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="md:hidden w-12 h-12 rounded-full liquid-glass flex items-center justify-center text-white"
          style={{ backgroundColor: "rgba(0,0,0,0.55)" }}
        >
          {open ? <CloseIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
        </button>
        <div className="hidden md:block w-12 h-12 invisible" />
      </div>

      {open && (
        <div
          className="md:hidden mt-3 liquid-glass rounded-[1.5rem] p-2 flex flex-col gap-1"
          style={{ backgroundColor: "rgba(6,2,2,0.92)" }}
        >
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setOpen(false)}
              className="px-4 py-3 text-base font-medium text-white/90 font-body hover:text-white transition-colors rounded-2xl hover:bg-white/5"
            >
              {link.label}
            </a>
          ))}
          <a
            href="/apply/"
            onClick={() => setOpen(false)}
            className="mt-1 flex items-center justify-center gap-1.5 bg-white text-black rounded-full px-4 py-3 text-sm font-medium"
          >
            {ctaLabel}
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>
      )}
    </div>
  );
}

/* ---------- Hero ---------- */
function Hero({ ecom }) {
  const easeOut = [0.16, 1, 0.3, 1];
  const headline = ecom
    ? "Driving Online Sales Through Performance Advertising"
    : "Performance Advertising For Automotive Businesses";
  const subcopy = ecom
    ? "We run paid ads on Facebook, Instagram and TikTok that get your products selling, without wasting spend on people who'll never buy."
    : "We run Meta, Google and TikTok ads for detailers, car washes, tinters and ceramic coating, PPF and headlight restoration businesses, so your phone rings with local car owners, not people who'll never book.";
  return (
    <section id="top" className="relative min-h-screen w-full overflow-hidden bg-black">
      <FadingVideo
        src="/assets/hero.mp4"
        className="absolute inset-0 w-full h-full object-cover z-0 hero-bg-video"
        style={{
          filter: "grayscale(1) sepia(1) hue-rotate(320deg) saturate(6) brightness(1.25) contrast(1.4)",
        }}
      />
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{ background: "rgba(0,0,0,0.7)", mixBlendMode: "multiply" }}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-64 z-[2] pointer-events-none"
        style={{ background: "linear-gradient(to bottom, transparent, #000000 92%)" }}
      />

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar ecom={ecom} />

        <div className="flex-1 flex flex-col items-center justify-center pt-10 pb-12 px-4">
        <div className="flex flex-col items-center" style={{ transform: "translateY(11%)" }}>
          <BlurText
            as="h1"
            text={headline}
            className="text-6xl md:text-7xl lg:text-[5.5rem] font-heading italic text-white leading-[0.85] max-w-6xl justify-center tracking-[-4px] text-center"
          />

          <motion.p
            initial={{ filter: "blur(10px)", opacity: 0, y: 20 }}
            animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: easeOut, delay: 0.8 }}
            className="mt-4 text-sm md:text-base text-white max-w-2xl font-body font-light leading-tight text-center"
          >
            {subcopy}
          </motion.p>

          <motion.div
            initial={{ filter: "blur(10px)", opacity: 0, y: 20 }}
            animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: easeOut, delay: 1.1 }}
            className="flex items-center gap-6 mt-5"
          >
            <a href="/apply/" className="flex items-center gap-1.5 bg-white text-black rounded-full px-5 py-2.5 text-sm font-medium">
              Apply Now
              <ArrowUpRight className="h-5 w-5" />
            </a>
            <a href={ecom ? "#kyro-results" : "/results/"} className="rounded-full border border-white/40 px-5 py-2.5 flex items-center gap-2 text-sm font-medium text-white hover:bg-white/10 transition-colors">
              {ecom ? "See the numbers" : "See real results"}
              <PlayIcon className="h-4 w-4" />
            </a>
          </motion.div>

          <motion.div
            initial={{ filter: "blur(10px)", opacity: 0, y: 20 }}
            animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: easeOut, delay: 1.3 }}
            className="flex flex-row items-stretch gap-3 sm:gap-4 mt-6"
          >
            <div className="liquid-glass p-4 sm:p-5 flex-1 sm:w-[220px] sm:flex-none rounded-[1.25rem] flex flex-col justify-between">
              <ClockIcon className="h-7 w-7 text-white" />
              <div className="mt-4">
                <div className="font-heading italic text-white text-3xl sm:text-4xl tracking-[-1px] leading-none">5<span className="not-italic font-sans text-white" style={{ fontSize: "0.85em" }}>×</span></div>
                <div className="text-xs text-white font-body font-light mt-2">Return on Ads Spend</div>
              </div>
            </div>
            <div className="liquid-glass p-4 sm:p-5 flex-1 sm:w-[220px] sm:flex-none rounded-[1.25rem] flex flex-col justify-between">
              <GlobeIcon className="h-7 w-7 text-white" />
              <div className="mt-4">
                <div className="font-heading italic text-white text-3xl sm:text-4xl tracking-[-1px] leading-none">$35K+</div>
                <div className="text-xs text-white font-body font-light mt-2">Added Revenue</div>
              </div>
            </div>
          </motion.div>
        </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Capabilities ---------- */
function CapabilityCard({ Icon, tags, title, body }) {
  return (
    <div className="liquid-glass rounded-[1.25rem] p-6 min-h-[360px] flex flex-col">
      <div className="flex items-start justify-between gap-4">
        <div className="w-11 h-11 liquid-glass rounded-[0.75rem] flex items-center justify-center flex-shrink-0">
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div className="flex flex-wrap justify-end gap-1.5 max-w-[70%]">
          {tags.map((tag) => (
            <span
              key={tag}
              className="liquid-glass rounded-full px-3 py-1 text-[11px] text-white/90 font-body whitespace-nowrap"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="flex-1" />

      <div className="mt-6">
        <h3 className="font-heading italic text-white text-3xl md:text-4xl tracking-[-1px] leading-none">{title}</h3>
        <p className="mt-3 text-sm text-white/90 font-body font-light leading-snug max-w-[32ch]">{body}</p>
      </div>
    </div>
  );
}

function Capabilities() {
  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-black">
      <FadingVideo
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260418_094631_d30ab262-45ee-4b7d-99f3-5d5848c8ef13.mp4"
        className="absolute inset-0 w-full h-full object-cover z-0"
      />

      <div className="relative z-10 px-8 md:px-16 lg:px-20 pt-24 pb-10 flex flex-col min-h-screen">
        <div className="mb-auto">
          <div className="text-sm font-body text-white/80 mb-6">// Capabilities</div>
          <h2 className="font-heading italic text-white text-6xl md:text-7xl lg:text-[6rem] leading-[0.9] tracking-[-3px]">
            Production
            <br />
            evolved
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          <CapabilityCard
            Icon={ImageIcon}
            tags={["Natural Context", "Photo Realism", "Infinite Settings", "Eco-Vibe"]}
            title="AI Scenery"
            body="AI analyzes your product to create indistinguishable natural environments, from Icelandic cliffs to misty forests."
          />
          <CapabilityCard
            Icon={MovieIcon}
            tags={["Scale Fast", "Visual Consistency", "Time Saver", "Ready to Post"]}
            title="Batch Production"
            body="Style your entire product line in minutes. Create a unified visual identity for catalogues and social media without weeks of retouching."
          />
          <CapabilityCard
            Icon={LightbulbIcon}
            tags={["Ray Tracing", "Physical Shadows", "Studio Quality", "Sunlight Sync"]}
            title="Smart Lighting"
            body="Automatic lighting and material adjustment. Achieve flawless integration with realistic shadows and sunlight."
          />
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   PERPETUALX SECTION
   ============================================================ */
function usePxInView(threshold = 0.15) {
  return useInView(threshold);
}

function PxReveal({ children, className, delay = 0 }) {
  const [ref, inView] = usePxInView();
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: "easeOut", delay }}
    >
      {children}
    </motion.div>
  );
}

function PxKicker({ children }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <span className="w-1.5 h-1.5 rounded-full bg-pxAccent px-pulse-dot" />
      <span className="font-pxMono text-xs tracking-[0.15em] uppercase text-pxAccent">{children}</span>
    </div>
  );
}

function PxIconBolt({ className = "h-5 w-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" />
    </svg>
  );
}
function PxIconPulse({ className = "h-5 w-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12h4l2 7 4-14 2 7h6" />
    </svg>
  );
}
function PxIconRefresh({ className = "h-5 w-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12a9 9 0 0 1 15.3-6.4L21 8" />
      <path d="M21 3v5h-5" />
      <path d="M21 12a9 9 0 0 1-15.3 6.4L3 16" />
      <path d="M3 21v-5h5" />
    </svg>
  );
}
function PxIconLayers({ className = "h-5 w-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 2 9 5-9 5-9-5 9-5Z" />
      <path d="m3 12 9 5 9-5" />
      <path d="m3 17 9 5 9-5" />
    </svg>
  );
}
function PxIconBan({ className = "h-5 w-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="m5.6 5.6 12.8 12.8" />
    </svg>
  );
}
function PxIconCeiling({ className = "h-5 w-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 20 9 9l4 6 3-4 5 9" />
      <path d="M3 4h18" />
    </svg>
  );
}
function PxIconPuzzle({ className = "h-5 w-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 8h3a2 2 0 1 1 4 0h3v3a2 2 0 1 0 0 4v3h-3a2 2 0 1 0-4 0H4v-3a2 2 0 1 1 0-4V8Z" />
    </svg>
  );
}
function PxIconShield({ className = "h-5 w-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3 4 6v6c0 4.5 3 8 8 9 5-1 8-4.5 8-9V6l-8-3Z" />
    </svg>
  );
}
function PxIconHand({ className = "h-5 w-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 12V5a1.5 1.5 0 0 1 3 0v6" />
      <path d="M12 11V4a1.5 1.5 0 0 1 3 0v7" />
      <path d="M15 11V6a1.5 1.5 0 0 1 3 0v9c0 3.5-2.5 6-6 6h-1c-2.5 0-3.7-1-5-2.5L3.5 15a1.4 1.4 0 0 1 2-2L8 15" />
    </svg>
  );
}
function PxIconChevron({ className = "h-4 w-4", open }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)" }}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
function PxIconCheck({ className = "h-3.5 w-3.5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function PxHero() {
  const platforms = ["Meta", "Google Ads", "TikTok Ads"];
  return (
    <section className="relative px-8 md:px-16 lg:px-20 pt-28 pb-20 border-t border-pxLine">
      <PxReveal>
        <PxKicker>Ad infrastructure that never fails</PxKicker>
      </PxReveal>
      <PxReveal delay={0.05} className="max-w-4xl">
        <h1 className="font-pxHeading font-medium text-white text-5xl md:text-6xl lg:text-[4.25rem] leading-[1.05] tracking-[-1.5px]">
          Ads that never stop.
          <br />
          Growth that never sleeps.
        </h1>
      </PxReveal>
      <PxReveal delay={0.15} className="max-w-xl">
        <p className="mt-6 text-base text-pxMuted font-pxBody font-light leading-relaxed">
          Always-on ad account infrastructure that provisions, monitors, and replaces accounts in real time, so campaigns never miss a beat.
        </p>
      </PxReveal>
      <PxReveal delay={0.25} className="flex flex-wrap items-center gap-4 mt-8">
        <button className="bg-pxAccent text-black font-pxBody font-medium text-sm rounded-full px-5 py-3 flex items-center gap-2 hover:brightness-110 transition">
          Get Perpetual Access
          <ArrowUpRight className="h-4 w-4" />
        </button>
        <button className="border border-pxLine text-white font-pxBody font-medium text-sm rounded-full px-5 py-3 hover:bg-white/5 transition">
          See How It Works
        </button>
      </PxReveal>

      <PxReveal delay={0.35} className="mt-14 flex flex-wrap items-center gap-3">
        {platforms.map((p) => (
          <div
            key={p}
            className="flex items-center gap-2 bg-pxCard border border-pxLine rounded-full pl-3 pr-4 py-2"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-pxAccent px-pulse-dot" />
            <span className="font-pxMono text-xs text-white/80">{p}</span>
            <span className="font-pxMono text-xs text-pxAccent">Active</span>
          </div>
        ))}
      </PxReveal>
    </section>
  );
}

function PxProblemCard({ Icon, title, body, delay }) {
  return (
    <PxReveal delay={delay} className="bg-pxCard border border-pxLine rounded-2xl p-6">
      <div className="w-10 h-10 rounded-lg bg-white/5 border border-pxLine flex items-center justify-center text-pxAccent">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="mt-5 font-pxHeading text-white text-lg font-medium">{title}</h3>
      <p className="mt-2 text-sm text-pxMuted font-pxBody font-light leading-relaxed">{body}</p>
    </PxReveal>
  );
}

function PxProblem() {
  return (
    <section className="px-8 md:px-16 lg:px-20 py-24 border-t border-pxLine">
      <PxReveal>
        <PxKicker>The cost of downtime</PxKicker>
      </PxReveal>
      <PxReveal delay={0.05} className="max-w-2xl">
        <h2 className="font-pxHeading font-medium text-white text-3xl md:text-4xl tracking-[-0.5px]">
          When campaigns pause, revenue disappears
        </h2>
        <p className="mt-4 text-sm text-pxMuted font-pxBody font-light leading-relaxed">
          Account bans, spend caps, and fragmented tooling quietly cost media buyers thousands every month.
        </p>
      </PxReveal>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-12">
        <PxProblemCard
          Icon={PxIconBan}
          title="Bans break your flow"
          body="One suspension cascades into missed targets and a scrambled team scramble to recover."
          delay={0.1}
        />
        <PxProblemCard
          Icon={PxIconCeiling}
          title="Caps kill your ceiling"
          body="Just as a campaign hits its stride, platform limits quietly put the brakes on."
          delay={0.18}
        />
        <PxProblemCard
          Icon={PxIconPuzzle}
          title="Fragmented tooling gaps"
          body="Juggling separate providers for accounts, monitoring, and cloaking leaves cracks nothing else covers."
          delay={0.26}
        />
      </div>
    </section>
  );
}

function PxFeatureCard({ Icon, title, body, delay }) {
  return (
    <PxReveal delay={delay} className="bg-pxCard border border-pxLine rounded-2xl p-6 flex flex-col">
      <div className="w-10 h-10 rounded-lg bg-pxAccent/10 border border-pxAccent/30 flex items-center justify-center text-pxAccent">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="mt-5 font-pxHeading text-white text-lg font-medium">{title}</h3>
      <p className="mt-2 text-sm text-pxMuted font-pxBody font-light leading-relaxed">{body}</p>
    </PxReveal>
  );
}

function PxFeatures() {
  return (
    <section id="features" className="px-8 md:px-16 lg:px-20 py-24 border-t border-pxLine">
      <PxReveal>
        <PxKicker>Capabilities</PxKicker>
      </PxReveal>
      <PxReveal delay={0.05} className="max-w-2xl flex items-end justify-between flex-wrap gap-6">
        <h2 className="font-pxHeading font-medium text-white text-3xl md:text-4xl tracking-[-0.5px]">
          Built for endless performance
        </h2>
      </PxReveal>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mt-12">
        <PxFeatureCard
          Icon={PxIconBolt}
          title="Rapid Provisioning"
          body="Accounts delivered in hours, not weeks. So when opportunity knocks, you're already running."
          delay={0.1}
        />
        <PxFeatureCard
          Icon={PxIconPulse}
          title="Perpetual Monitoring"
          body="Real-time health checks across every account, watching around the clock so you don't have to."
          delay={0.16}
        />
        <PxFeatureCard
          Icon={PxIconRefresh}
          title="Instant Regeneration"
          body="Flagged account? A warmed replacement deploys automatically for a seamless transition."
          delay={0.22}
        />
        <PxFeatureCard
          Icon={PxIconLayers}
          title="Single Source of Truth"
          body="One dashboard to request accounts, monitor health, and reach support: nothing scattered."
          delay={0.28}
        />
      </div>
    </section>
  );
}

function PxCalculator() {
  const [spend, setSpend] = React.useState(75000);
  const [roas, setRoas] = React.useState(3.5);
  const [downtime, setDowntime] = React.useState(40);

  const potential = Math.round(spend * roas * (downtime / 730) * 1.4);
  const fmt = (n) => "$" + n.toLocaleString("en-US");

  return (
    <section className="px-8 md:px-16 lg:px-20 py-24 border-t border-pxLine">
      <PxReveal>
        <PxKicker>Downtime calculator</PxKicker>
      </PxReveal>
      <PxReveal delay={0.05} className="max-w-2xl">
        <h2 className="font-pxHeading font-medium text-white text-3xl md:text-4xl tracking-[-0.5px]">
          See what downtime is really costing you
        </h2>
        <p className="mt-4 text-sm text-pxMuted font-pxBody font-light leading-relaxed">
          Adjust your spend, ROAS, and downtime hours to estimate the revenue Perpetual could recover.
        </p>
      </PxReveal>

      <PxReveal delay={0.15} className="mt-12 bg-pxCard border border-pxLine rounded-2xl p-6 md:p-10 grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="flex flex-col gap-8">
          <div>
            <div className="flex items-baseline justify-between mb-3">
              <label className="font-pxMono text-xs uppercase tracking-[0.1em] text-pxMuted">Monthly ad spend</label>
              <span className="font-pxMono text-sm text-white">{fmt(spend)}</span>
            </div>
            <input
              type="range"
              min="5000"
              max="1000000"
              step="5000"
              value={spend}
              onChange={(e) => setSpend(Number(e.target.value))}
              className="px-slider w-full"
            />
          </div>
          <div>
            <div className="flex items-baseline justify-between mb-3">
              <label className="font-pxMono text-xs uppercase tracking-[0.1em] text-pxMuted">Current ROAS</label>
              <span className="font-pxMono text-sm text-white">{roas.toFixed(1)}x</span>
            </div>
            <input
              type="range"
              min="1.5"
              max="6.0"
              step="0.1"
              value={roas}
              onChange={(e) => setRoas(Number(e.target.value))}
              className="px-slider w-full"
            />
          </div>
          <div>
            <div className="flex items-baseline justify-between mb-3">
              <label className="font-pxMono text-xs uppercase tracking-[0.1em] text-pxMuted">Downtime hours / month</label>
              <span className="font-pxMono text-sm text-white">{downtime}</span>
            </div>
            <input
              type="range"
              min="0"
              max="200"
              step="5"
              value={downtime}
              onChange={(e) => setDowntime(Number(e.target.value))}
              className="px-slider w-full"
            />
          </div>
        </div>

        <div className="flex flex-col items-center justify-center text-center border-t md:border-t-0 md:border-l border-pxLine pt-8 md:pt-0 md:pl-10">
          <span className="font-pxMono text-xs uppercase tracking-[0.1em] text-pxMuted">Additional revenue potential</span>
          <span className="font-pxHeading text-4xl md:text-5xl text-pxAccent mt-3 tracking-[-1px]">
            +{fmt(potential)}
          </span>
          <span className="font-pxMono text-xs text-pxMuted mt-1">per month</span>
        </div>
      </PxReveal>
    </section>
  );
}

function PxAdvantageCard({ Icon, title, body, delay }) {
  return (
    <PxReveal delay={delay} className="flex gap-4 py-6 border-t border-pxLine first:border-t-0">
      <div className="w-10 h-10 flex-shrink-0 rounded-lg bg-white/5 border border-pxLine flex items-center justify-center text-pxAccent">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <h3 className="font-pxHeading text-white text-lg font-medium">{title}</h3>
        <p className="mt-1.5 text-sm text-pxMuted font-pxBody font-light leading-relaxed max-w-md">{body}</p>
      </div>
    </PxReveal>
  );
}

function PxAdvantages() {
  return (
    <section id="advantages" className="px-8 md:px-16 lg:px-20 py-24 border-t border-pxLine">
      <PxReveal>
        <PxKicker>Why Perpetual</PxKicker>
      </PxReveal>
      <PxReveal delay={0.05} className="max-w-2xl">
        <h2 className="font-pxHeading font-medium text-white text-3xl md:text-4xl tracking-[-0.5px]">
          The Perpetual advantage
        </h2>
        <p className="mt-4 text-sm text-pxMuted font-pxBody font-light leading-relaxed">
          Four pillars that separate always-on infrastructure from fragile, fragmented setups.
        </p>
      </PxReveal>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 mt-8">
        <PxAdvantageCard
          Icon={PxIconShield}
          title="Redundancy by design"
          body="Every account has a warmed backup ready to take over the instant it's needed."
          delay={0.1}
        />
        <PxAdvantageCard
          Icon={PxIconRefresh}
          title="Zero manual intervention"
          body="Replacements deploy automatically: no tickets, no waiting on a rep."
          delay={0.14}
        />
        <PxAdvantageCard
          Icon={PxIconPulse}
          title="Continuous monitoring"
          body="Health checks run around the clock across every platform you use."
          delay={0.18}
        />
        <PxAdvantageCard
          Icon={PxIconHand}
          title="Support without limits"
          body="Real people respond in minutes, embedded in your workflow when it matters most."
          delay={0.22}
        />
      </div>
    </section>
  );
}

function PxProcess() {
  const steps = [
    { n: "01", title: "Activate", body: "Create an account and your dashboard is provisioned instantly." },
    { n: "02", title: "Launch", body: "Request ad accounts directly through the platform, ready in hours." },
    { n: "03", title: "Run Perpetually", body: "Our systems monitor and replace accounts around the clock." },
  ];
  return (
    <section id="process" className="px-8 md:px-16 lg:px-20 py-24 border-t border-pxLine">
      <PxReveal>
        <PxKicker>Onboarding</PxKicker>
      </PxReveal>
      <PxReveal delay={0.05} className="max-w-2xl">
        <h2 className="font-pxHeading font-medium text-white text-3xl md:text-4xl tracking-[-0.5px]">
          From setup to scale, without the stops
        </h2>
        <p className="mt-4 text-sm text-pxMuted font-pxBody font-light leading-relaxed">
          Three steps to always-on ad infrastructure, from activation to autonomous operation in under 24 hours.
        </p>
      </PxReveal>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-12">
        {steps.map((s, i) => (
          <PxReveal key={s.n} delay={0.1 + i * 0.08} className="bg-pxCard border border-pxLine rounded-2xl p-6">
            <span className="font-pxMono text-xs text-pxAccent">{s.n}</span>
            <h3 className="mt-3 font-pxHeading text-white text-xl font-medium">{s.title}</h3>
            <p className="mt-2 text-sm text-pxMuted font-pxBody font-light leading-relaxed">{s.body}</p>
          </PxReveal>
        ))}
      </div>
    </section>
  );
}

function PxPricingCard({ name, price, blurb, features, featured, delay }) {
  return (
    <PxReveal
      delay={delay}
      className={
        "rounded-2xl p-6 flex flex-col " +
        (featured ? "bg-pxAccent/[0.06] border-2 border-pxAccent" : "bg-pxCard border border-pxLine")
      }
    >
      {featured && (
        <span className="font-pxMono text-[10px] uppercase tracking-[0.1em] text-pxAccent mb-3">Most popular</span>
      )}
      <h3 className="font-pxHeading text-white text-xl font-medium">{name}</h3>
      <div className="mt-3 font-pxHeading text-4xl text-white tracking-[-1px]">{price}</div>
      <p className="mt-2 text-sm text-pxMuted font-pxBody font-light leading-relaxed">{blurb}</p>
      <ul className="mt-6 flex flex-col gap-3 flex-1">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm text-white/80 font-pxBody font-light">
            <span className="mt-0.5 text-pxAccent"><PxIconCheck /></span>
            {f}
          </li>
        ))}
      </ul>
      <button
        className={
          "mt-8 rounded-full px-5 py-3 text-sm font-pxBody font-medium transition " +
          (featured ? "bg-pxAccent text-black hover:brightness-110" : "border border-pxLine text-white hover:bg-white/5")
        }
      >
        Get Started
      </button>
    </PxReveal>
  );
}

function PxPricing() {
  return (
    <section id="pricing" className="px-8 md:px-16 lg:px-20 py-24 border-t border-pxLine">
      <PxReveal>
        <PxKicker>Pricing</PxKicker>
      </PxReveal>
      <PxReveal delay={0.05} className="max-w-2xl">
        <h2 className="font-pxHeading font-medium text-white text-3xl md:text-4xl tracking-[-0.5px]">
          Priced for performance, not promises
        </h2>
      </PxReveal>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-12">
        <PxPricingCard
          name="Starter"
          price="$0"
          blurb="For media buyers exploring always-on infrastructure."
          features={["1 ad account provisioned", "Meta or Google monitoring", "Standard provisioning (48–72 hrs)", "Dashboard access", "Email support"]}
          delay={0.1}
        />
        <PxPricingCard
          name="Growth"
          price="$1,500"
          blurb="For scaling teams that can't afford a day of downtime."
          features={["Up to 5 ad accounts provisioned", "Meta + Google monitoring", "Priority provisioning (<24 hrs)", "Instant account replacement", "Slack support"]}
          featured
          delay={0.16}
        />
        <PxPricingCard
          name="Scale"
          price="$5,600"
          blurb="For agencies running high-volume operations."
          features={["Unlimited ad accounts", "Full multi-platform monitoring", "Rapid provisioning (<6 hrs)", "Automated account replacement", "Dedicated account manager"]}
          delay={0.22}
        />
      </div>
    </section>
  );
}

function PxFaqItem({ q, a, isOpen, onToggle }) {
  return (
    <div className="border-t border-pxLine py-5">
      <button className="w-full flex items-center justify-between text-left gap-4" onClick={onToggle}>
        <span className="font-pxHeading text-white text-base md:text-lg font-medium">{q}</span>
        <span className="text-pxMuted flex-shrink-0"><PxIconChevron open={isOpen} /></span>
      </button>
      {isOpen && (
        <p className="mt-3 text-sm text-pxMuted font-pxBody font-light leading-relaxed max-w-2xl">{a}</p>
      )}
    </div>
  );
}

function PxFAQ() {
  const [openIndex, setOpenIndex] = React.useState(0);
  const faqs = [
    {
      q: "How quickly are ad accounts provisioned?",
      a: "Growth plan accounts arrive within 24 hours. Scale plan clients get accounts in under 6 hours, drawn from a warm inventory kept ready to go.",
    },
    {
      q: "What happens when an account gets banned or suspended?",
      a: "Flags are detected in real time and a pre-warmed replacement deploys automatically, typically with zero downtime.",
    },
    {
      q: "Which ad platforms are supported?",
      a: "Meta, Google Ads, and TikTok Ads are provisioned and monitored by default, with more platforms available on the Scale plan.",
    },
    {
      q: "Is there a minimum ad spend requirement?",
      a: "No minimum to get started. Growth and Scale fit best for teams running $20K+ a month, where downtime has a direct revenue impact.",
    },
    {
      q: "Are there contracts, or can I cancel anytime?",
      a: "All plans are month-to-month, with 20% off on annual billing. Cancel or upgrade anytime from the dashboard.",
    },
  ];
  return (
    <section id="faq" className="px-8 md:px-16 lg:px-20 py-24 border-t border-pxLine">
      <PxReveal>
        <PxKicker>FAQ</PxKicker>
      </PxReveal>
      <PxReveal delay={0.05} className="max-w-2xl">
        <h2 className="font-pxHeading font-medium text-white text-3xl md:text-4xl tracking-[-0.5px]">
          Frequently asked questions
        </h2>
      </PxReveal>
      <PxReveal delay={0.1} className="mt-8 max-w-3xl">
        {faqs.map((f, i) => (
          <PxFaqItem
            key={f.q}
            q={f.q}
            a={f.a}
            isOpen={openIndex === i}
            onToggle={() => setOpenIndex(openIndex === i ? -1 : i)}
          />
        ))}
      </PxReveal>
    </section>
  );
}

function PxClosingCTA() {
  return (
    <section className="px-8 md:px-16 lg:px-20 py-24 border-t border-pxLine text-center">
      <PxReveal className="max-w-2xl mx-auto flex flex-col items-center">
        <h2 className="font-pxHeading font-medium text-white text-3xl md:text-5xl tracking-[-1px]">
          Stop pausing. Start perpetual.
        </h2>
        <p className="mt-4 text-sm md:text-base text-pxMuted font-pxBody font-light leading-relaxed max-w-lg">
          Pre-warmed account inventory, real-time monitoring, and instant replacement, all in one platform built for media buyers who can't afford to pause.
        </p>
        <button className="mt-8 bg-pxAccent text-black font-pxBody font-medium text-sm rounded-full px-6 py-3 flex items-center gap-2 hover:brightness-110 transition">
          Get Perpetual Access
          <ArrowUpRight className="h-4 w-4" />
        </button>
      </PxReveal>
    </section>
  );
}

function PxFooter() {
  const links = ["Features", "Advantages", "Process", "Pricing", "FAQ"];
  return (
    <footer className="px-8 md:px-16 lg:px-20 py-12 border-t border-pxLine flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
      <div>
        <span className="font-pxHeading text-white text-lg font-medium">PerpetualX</span>
        <p className="mt-2 text-xs text-pxMuted font-pxBody font-light max-w-xs">
          The continuous infrastructure layer for paid media.
        </p>
      </div>
      <div className="flex flex-wrap gap-x-6 gap-y-2">
        {links.map((l) => (
          <a key={l} href={"#" + l.toLowerCase()} className="font-pxMono text-xs text-pxMuted hover:text-white transition">
            {l}
          </a>
        ))}
      </div>
      <span className="font-pxMono text-xs text-pxMuted">© 2026 PerpetualX, Inc.</span>
    </footer>
  );
}

function PerpetualXPage() {
  return (
    <div className="relative bg-pxBg px-grid-bg">
      <PxHero />
      <PxProblem />
      <PxFeatures />
      <PxCalculator />
      <PxAdvantages />
      <PxProcess />
      <PxPricing />
      <PxFAQ />
      <PxClosingCTA />
      <PxFooter />
    </div>
  );
}

/* ============================================================
   KYRO MARKETING SECTION
   ============================================================ */
function KyroReveal({ children, className, delay = 0, style }) {
  const [ref, inView] = useInView(0.15);
  return (
    <motion.div
      ref={ref}
      className={className}
      style={style}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: "easeOut", delay }}
    >
      {children}
    </motion.div>
  );
}

function KyroCounter({ to, prefix = "", suffix = "", duration = 1600 }) {
  const [ref, inView] = useInView(0.4);
  const [val, setVal] = React.useState(0);
  React.useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    const step = (now) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setVal(Math.round(to * eased));
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView]);
  return (
    <span ref={ref}>
      {prefix}
      {val.toLocaleString("en-US")}
      {suffix}
    </span>
  );
}

function KyroIconTikTok({ className = "h-5 w-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M14 3c.3 1.9 1.5 3.4 3.3 4v2.6c-1.2 0-2.4-.4-3.3-1.1V15a5.4 5.4 0 1 1-4.7-5.4v2.7A2.7 2.7 0 1 0 12 15V3h2Z" />
    </svg>
  );
}
function KyroIconFacebook({ className = "h-5 w-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M13.5 21v-7.5H16l.5-3H13.5V8.4c0-.9.3-1.5 1.6-1.5H16.5V4.3c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4V10.5H8v3h2.3V21h3.2Z" />
    </svg>
  );
}
function KyroIconInstagram({ className = "h-5 w-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}
function KyroIconCreative({ className = "h-5 w-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v3M12 18v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M3 12h3M18 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" />
      <circle cx="12" cy="12" r="4" />
    </svg>
  );
}
function KyroIconTarget({ className = "h-5 w-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="12" cy="12" r="0.7" fill="currentColor" />
    </svg>
  );
}
function KyroIconChart({ className = "h-5 w-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 20V10M12 20V4M20 20v-7" />
    </svg>
  );
}
function KyroIconWeb({ className = "h-5 w-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.6 3.8 5.8 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.8-3.8-9s1.3-6.4 3.8-9Z" />
    </svg>
  );
}
function KyroIconGoogle({ className = "h-5 w-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="m15.5 15.5 5 5" />
      <path d="M8 10.5h5" />
    </svg>
  );
}
function KyroIconCar({ className = "h-5 w-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 15v-3l2-5h12l2 5v3" />
      <path d="M3 15h18v3H3z" />
      <circle cx="7.5" cy="18.5" r="1.4" />
      <circle cx="16.5" cy="18.5" r="1.4" />
      <path d="M6.5 12h11" />
    </svg>
  );
}
function KyroIconMail({ className = "h-4 w-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}
function KyroIconPhone({ className = "h-4 w-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L14 13l5 2v4a2 2 0 0 1-2 2C9.6 21 3 14.4 3 6a2 2 0 0 1 1-2Z" />
    </svg>
  );
}

function KyroNav() {
  return (
    <div className="relative z-10 border-b border-kyroLine bg-kyroBg">
      <div className="px-6 md:px-12 lg:px-20 py-4 flex items-center justify-between">
        <span className="font-kyroHeading italic text-kyroText text-xl">Kyro Marketing</span>
        <div className="hidden md:flex items-center gap-8">
          <a href="/#kyro-services" className="text-sm text-kyroMuted hover:text-white font-kyroBody transition">Services</a>
          <a href="/#kyro-results" className="text-sm text-kyroMuted hover:text-white font-kyroBody transition">Results</a>
          <a href="#kyro-pricing" className="text-sm text-kyroMuted hover:text-white font-kyroBody transition">Pricing</a>
        </div>
        <div className="flex items-center gap-3">
          <a href="mailto:Kyro.Marketing@outlook.com" className="hidden sm:block text-sm text-kyroMuted hover:text-white font-kyroBody transition">
            Learn More
          </a>
          <a href="#kyro-apply" className="bg-kyroRed text-white text-sm font-kyroBody font-medium rounded-full px-4 py-2 flex items-center gap-1.5 hover:brightness-110 transition">
            Apply Now
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}

function KyroHero() {
  return (
    <section className="relative pt-20 pb-28 px-6 md:px-12 lg:px-20 overflow-hidden">
      <div className="absolute inset-0 kyro-glow pointer-events-none" />
      <div className="relative max-w-4xl">
        <KyroReveal>
          <span className="inline-block text-xs font-kyroBody font-medium tracking-[0.15em] uppercase text-kyroRed border border-kyroRed/40 rounded-full px-3 py-1.5">
            Professional Paid Advertising Solutions
          </span>
        </KyroReveal>
        <KyroReveal delay={0.08}>
          <h1 className="mt-6 font-kyroHeading font-semibold text-kyroText text-4xl md:text-6xl leading-[1.08] tracking-[-1px]">
            Driving business success through performance-driven advertising solutions
          </h1>
        </KyroReveal>
        <KyroReveal delay={0.16}>
          <p className="mt-6 text-base md:text-lg text-kyroMuted font-kyroBody font-light max-w-2xl leading-relaxed">
            Building effective campaigns that engage your customers, generate measurable outcomes, and fuel long-term expansion.
          </p>
        </KyroReveal>
        <KyroReveal delay={0.24} className="flex flex-wrap items-center gap-4 mt-9">
          <a href="#kyro-apply" className="bg-kyroRed text-white font-kyroBody font-medium text-sm rounded-full px-6 py-3.5 flex items-center gap-2 hover:brightness-110 transition">
            Apply Now
            <ArrowUpRight className="h-4 w-4" />
          </a>
          <a href="/#kyro-results" className="border border-kyroLine text-kyroText font-kyroBody font-medium text-sm rounded-full px-6 py-3.5 hover:bg-white/5 transition">
            View Results
          </a>
        </KyroReveal>
      </div>
    </section>
  );
}

const KYRO_SERVICE_ICONS = { meta: KyroIconFacebook, web: KyroIconWeb, search: KyroIconGoogle, target: KyroIconTarget, creative: KyroIconCreative, tiktok: KyroIconTikTok };
const KYRO_SERVICES = KYRO_DATA.services.map((x) => ({ ...x, body: x.short, Icon: KYRO_SERVICE_ICONS[x.icon] }));
const KYRO_INDUSTRIES = KYRO_DATA.industries.map((x) => ({ ...x, Icon: KyroIconCar, kind: "industry" }));

const ECOM_SERVICES = [
  {
    slug: "ecom-tiktok-ads",
    Icon: KyroIconTikTok,
    title: "TikTok Ads",
    tag: "Short-Form Video",
    body: "Get your products in front of thousands of shoppers without a big budget. TikTok's algorithm does the heavy lifting, and we make sure your ad is what stops the scroll.",
    overview: "We build TikTok campaigns that feel native to the platform so they earn attention instead of getting skipped. Your customers are already on TikTok, and we make sure they see your brand.",
    different: [
      "Creative built for how TikTok actually works, not repurposed studio shots",
      "Rapid hook testing so you find what converts fast",
      "Campaigns optimised for add-to-carts and checkouts, not just views",
    ],
    process: [
      "Research what's already working in your niche",
      "Test multiple hooks and formats in parallel",
      "Scale budget behind the creative that converts",
      "Refresh regularly to maintain performance",
    ],
    benefits: [
      "More shoppers discovering your store",
      "Lower cost per purchase than traditional advertising",
      "Brand visibility that compounds over time",
    ],
  },
  {
    slug: "ecom-paid-social",
    Icon: KyroIconFacebook,
    title: "Facebook & Instagram",
    tag: "Paid Social",
    body: "Turn your ad spend into a steady stream of checkouts from shoppers who are ready to buy, not just browse.",
    overview: "Facebook and Instagram let you put your products in front of the exact type of shopper you want. We set up campaigns that drive real purchases, not just likes and comments.",
    different: [
      "Campaigns structured to drive purchases, not vanity metrics",
      "Weekly optimisation so your budget keeps working harder",
      "Retargeting to capture shoppers who browsed but didn't check out",
    ],
    process: [
      "Build targeted audiences based on your ideal customer",
      "Launch and test ads with clear tracking from day one",
      "Shift budget toward what's generating sales",
      "Add retargeting to recover abandoned carts",
    ],
    benefits: [
      "Consistent flow of new orders every week",
      "Know exactly what your ad spend is generating",
      "Reach shoppers you'd never find through organic alone",
    ],
  },
  {
    slug: "ecom-ad-creative",
    Icon: KyroIconCreative,
    title: "Ad Creative",
    tag: "Creative",
    body: "Ads that actually get clicked. We create visuals and copy that make people stop, tap, and add to cart, not scroll straight past.",
    overview: "Your ad creative is the first thing a potential customer sees. If it doesn't stop them, nothing else matters. We design ads built around what actually converts for ecommerce and clothing brands.",
    different: [
      "Creative tested against real data, not gut feeling",
      "Fast turnaround so you're never waiting on assets for a drop or launch",
      "Built for each platform, not the same product shot resized",
    ],
    process: [
      "Research top-converting creative in your niche",
      "Produce multiple concepts to test",
      "Identify winners and scale them",
      "Continuously refresh to prevent ad fatigue",
    ],
    benefits: [
      "More clicks for the same spend",
      "Ads that build trust and credibility fast",
      "A library of proven assets you own",
    ],
  },
  {
    slug: "ecom-audience-targeting",
    Icon: KyroIconTarget,
    title: "Audience Targeting",
    tag: "Reach",
    body: "Stop paying to show your ads to people who'll never buy. We target the right shoppers, the right demographics, and the right purchase intent signals.",
    overview: "Showing your ad to the wrong shopper is the fastest way to burn your budget. We build targeting strategies that put your brand in front of people who are actually likely to buy.",
    different: [
      "Targeting built around your actual customers, not assumptions",
      "Constant refinement as your campaigns learn and improve",
      "Separate strategies for new customers vs warm retargeting",
    ],
    process: [
      "Analyse your existing customer base for patterns",
      "Build tiered audiences from cold to warm",
      "Test and refine based on real conversion data",
      "Concentrate spend on the highest-value segments",
    ],
    benefits: [
      "Lower cost per purchase over time",
      "Less wasted spend on the wrong audience",
      "Faster path to a profitable campaign",
    ],
  },
  {
    slug: "ecom-reporting",
    Icon: KyroIconChart,
    title: "Reporting",
    tag: "Transparency",
    body: "Know exactly what your ads are generating, in plain English, not a confusing spreadsheet. We tell you what's working, what's not, and what we're doing about it.",
    overview: "Most agencies hide behind impressions and reach. We report on what actually matters to you: sales, AOV, and revenue. You'll always know where your money is going.",
    different: [
      "Reports that show revenue impact, not just ad metrics",
      "Weekly check-ins so you're never left wondering",
      "Honest conversation when something isn't working",
    ],
    process: [
      "Set up tracking tied to real sales outcomes",
      "Review performance every week",
      "Flag issues early and adjust fast",
      "Monthly summary with clear next steps",
    ],
    benefits: [
      "Full visibility over your ad spend",
      "Faster decisions based on real data",
      "No surprises at the end of the month",
    ],
  },
  {
    slug: "ecom-landing-pages",
    Icon: KyroIconWeb,
    title: "Product Pages",
    tag: "Conversion",
    body: "A great ad sending people to a slow, cluttered product page is wasted money. We build fast, simple pages designed to turn visitors into checkouts.",
    overview: "If your store doesn't convert, your ad spend is working against you. We build and optimise product and landing pages that are fast, clear, and built around one goal: getting you more sales.",
    different: [
      "Built for conversion first, not just to look nice",
      "Optimised for mobile and fast load times",
      "Designed to match your ads so nothing feels off",
    ],
    process: [
      "Map the journey from ad click to checkout",
      "Design and build a focused, fast-loading page",
      "Test speed and mobile experience before launch",
      "Refine based on conversion data",
    ],
    benefits: [
      "More sales from the same ad spend",
      "A store that works as hard as your ads",
      "Looks professional and builds trust instantly",
    ],
  },
];

function KyroServices({ services }) {
  const list = services || KYRO_SERVICES;
  const containerRef = React.useRef(null);
  const cardRefs = React.useRef([]);
  const indexRef = React.useRef(null);
  const trackRef = React.useRef(null);
  const topRef = React.useRef(0);
  const heightRef = React.useRef(0);
  const n = list.length;

  React.useEffect(() => {
    let rafId = null;
    let smoothedFloat = 0;
    let hasMeasured = false;
    let isActive = false;

    const measure = () => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      topRef.current = rect.top + window.scrollY;
      heightRef.current = rect.height;
    };

    const render = (activeFloat) => {
      cardRefs.current.forEach((node, i) => {
        if (!node) return;
        const raw = activeFloat - i;
        const arrive = Math.min(Math.max(raw + 1, 0), 1);
        const eased = arrive * arrive * (3 - 2 * arrive); // smoothstep, no linear snap
        const translateVh = (1 - eased) * 100;
        const depth = Math.min(Math.max(raw, 0), 3);
        const peekPct = -depth * 2;
        const scale = 1 - depth * 0.018;

        node.style.transform =
          "translate3d(0, calc(" + translateVh + "vh + " + peekPct + "%), 0) scale(" + scale + ")";
        node.style.zIndex = String(i + 1);
      });

      const activeIndex = Math.min(n - 1, Math.round(activeFloat));
      if (indexRef.current) {
        indexRef.current.textContent = String(activeIndex + 1).padStart(2, "0") + " / " + String(n).padStart(2, "0");
      }
      if (trackRef.current) {
        const continuousProgress = Math.min(Math.max((activeFloat + 1) / n, 1 / n), 1);
        trackRef.current.style.width = continuousProgress * 100 + "%";
      }
    };

    let lastTickTs = 0;

    const tick = (ts) => {
      const scrollable = heightRef.current - window.innerHeight;
      const top = topRef.current - window.scrollY;
      const progress = scrollable > 0 ? Math.min(Math.max(-top / scrollable, 0), 1) : 0;
      const targetFloat = progress * (n - 1);

      if (!hasMeasured) {
        smoothedFloat = targetFloat;
        hasMeasured = true;
        lastTickTs = ts;
      } else {
        const dt = lastTickTs ? Math.min((ts - lastTickTs) / 1000, 0.05) : 1 / 60;
        lastTickTs = ts;
        // Frame-rate independent exponential smoothing: consistent glide feel
        // regardless of display refresh rate (60Hz, 120Hz, etc).
        const smoothing = 1 - Math.pow(1 - 0.08, dt * 60);
        smoothedFloat += (targetFloat - smoothedFloat) * smoothing;
        if (Math.abs(targetFloat - smoothedFloat) < 0.0008) smoothedFloat = targetFloat;
      }

      render(smoothedFloat);

      // Keep animating a little past exact convergence so the settle feels smooth,
      // then stop ticking entirely until the section is back in view or scroll moves again.
      if (isActive) {
        rafId = requestAnimationFrame(tick);
      } else {
        rafId = null;
      }
    };

    const ensureTicking = () => {
      if (rafId == null) {
        rafId = requestAnimationFrame(tick);
      }
    };

    const onResize = () => {
      measure();
      if (isActive) ensureTicking();
    };

    const onScroll = () => {
      if (isActive) ensureTicking();
    };

    measure();

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        const wasActive = isActive;
        isActive = entry.isIntersecting;
        if (isActive) {
          measure();
          if (!wasActive) hasMeasured = false; // snap to the correct position instantly, no catch-up lerp
          ensureTicking();
        }
      },
      { rootMargin: "600px 0px 600px 0px", threshold: 0 }
    );
    if (containerRef.current) observer.observe(containerRef.current);

    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      observer.disconnect();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <section
      id="kyro-services"
      ref={containerRef}
      className="relative"
      style={{ height: n * 100 + "vh", background: "#0B0B0C" }}
    >
      <div
        className="sticky top-0 h-screen overflow-hidden flex flex-col justify-center px-6 md:px-12 lg:px-20"
        style={{
          background:
            "linear-gradient(to bottom, #000000 0%, #200606 12%, #0B0B0C 40%, #0B0B0C 100%)",
        }}
      >
        <div className="relative flex items-center justify-between">
          <KyroReveal>
            <span className="text-xs font-body font-medium tracking-[0.15em] uppercase text-kyroRed">Reach real customers</span>
          </KyroReveal>
          <span ref={indexRef} className="font-body text-xs text-white/40 tracking-[0.1em]">
            01 / {String(n).padStart(2, "0")}
          </span>
        </div>

        <KyroReveal delay={0.06} className="relative max-w-2xl mt-4">
          <h2 className="font-heading italic text-white text-4xl md:text-5xl tracking-[-1px]">
            Everything your automotive business needs to get booked
          </h2>
        </KyroReveal>

        <div className="relative mt-4 h-px bg-white/10 overflow-hidden max-w-2xl">
          <div ref={trackRef} className="h-full bg-kyroRed" style={{ width: 100 / n + "%" }} />
        </div>

        <div className="relative mt-[7vh] md:mt-[6vh] h-[52vh] md:h-[48vh]">
          {list.map((s, i) => (
            <a
              key={s.title}
              href={"/services/" + s.slug + "/"}
              ref={(node) => (cardRefs.current[i] = node)}
              className="absolute inset-0 stack-card rounded-[1.75rem] p-8 md:p-12 flex flex-col md:flex-row md:items-center gap-8 overflow-hidden cursor-pointer hover:brightness-110 transition-[filter] duration-150"
              style={{
                transform: i === 0 ? "translate3d(0,0,0)" : "translate3d(0,100vh,0)",
                willChange: "transform",
                backfaceVisibility: "hidden",
              }}
            >
              <div className="w-14 h-14 liquid-glass rounded-[0.9rem] flex items-center justify-center text-white flex-shrink-0">
                <s.Icon className="h-7 w-7" />
              </div>
              <div className="max-w-xl">
                <span className="text-xs font-body uppercase tracking-[0.15em] text-white/50">{s.tag}</span>
                <h3 className="mt-2 font-heading italic text-white text-3xl md:text-4xl tracking-[-1px]">{s.title}</h3>
                <p className="mt-3 text-sm md:text-base text-white/70 font-body font-light leading-relaxed max-w-lg">{s.body}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-body text-kyroRed">
                  Learn more
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </span>
              </div>
              <span className="hidden md:block md:ml-auto font-heading italic text-white/15 text-7xl leading-none select-none flex-shrink-0">
                {String(i + 1).padStart(2, "0")}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function KyroResults() {
  return (
    <section id="kyro-results" className="cv-auto relative px-6 md:px-12 lg:px-20 py-24 overflow-hidden">
      <div className="absolute inset-0 kyro-glow pointer-events-none" />
      <KyroReveal className="relative">
        <span className="text-xs font-body font-medium tracking-[0.15em] uppercase text-kyroRed">All you require</span>
      </KyroReveal>
      <KyroReveal delay={0.06} className="relative max-w-2xl">
        <h2 className="mt-4 font-heading italic text-white text-4xl md:text-5xl tracking-[-1px]">
          Real and steady progress
        </h2>
        <p className="mt-4 text-sm md:text-base text-white/70 font-body font-light leading-relaxed">
          From first-time detailing customers to high-ticket ceramic coating and PPF jobs, we build campaigns around the numbers that matter to a workshop: enquiries, bookings and return on ad spend.
        </p>
      </KyroReveal>

      <div className="relative grid grid-cols-1 sm:grid-cols-3 gap-5 mt-14">
        <KyroReveal delay={0.1} className="liquid-glass rounded-[1.25rem] p-8">
          <ClockIcon className="h-6 w-6 text-kyroRed" />
          <div className="mt-6 font-heading italic text-white text-5xl tracking-[-1px]">
            <KyroCounter to={13} suffix="+" duration={1200} />
          </div>
          <div className="mt-2 text-sm text-white/80 font-body">Happy Clients</div>
          <div className="text-xs text-white/50 font-body mt-0.5">Strong partnerships with brands seeing real success</div>
        </KyroReveal>
        <KyroReveal delay={0.16} className="liquid-glass rounded-[1.25rem] p-8">
          <KyroIconChart className="h-6 w-6 text-kyroRed" />
          <div className="mt-6 font-heading italic text-white text-5xl tracking-[-1px] flex items-baseline">
            <KyroCounter to={5} duration={1200} />
            <span className="not-italic font-sans text-white" style={{ fontSize: "0.85em" }}>×</span>
          </div>
          <div className="mt-2 text-sm text-white/80 font-body">Return on Ads Spend</div>
        </KyroReveal>
        <KyroReveal delay={0.22} className="liquid-glass rounded-[1.25rem] p-8">
          <GlobeIcon className="h-6 w-6 text-kyroRed" />
          <div className="mt-6 font-heading italic text-white text-5xl tracking-[-1px]">
            <KyroCounter to={35} prefix="$" suffix="K+" duration={1200} />
          </div>
          <div className="mt-2 text-sm text-white/80 font-body">Added Revenue</div>
        </KyroReveal>
      </div>
    </section>
  );
}

function KyroPricingCard({ name, price, blurb, features, featured, delay }) {
  return (
    <KyroReveal delay={delay} className={featured ? "liquid-glass-strong rounded-[1.25rem] p-6 flex flex-col" : "liquid-glass rounded-[1.25rem] p-6 flex flex-col"}>
      {featured && (
        <span className="liquid-glass rounded-full self-start px-3 py-1 text-[10px] uppercase tracking-[0.1em] text-white mb-4">Most popular</span>
      )}
      <h3 className="font-heading italic text-white text-2xl">{name}</h3>
      <div className="mt-3 font-heading italic text-white text-4xl tracking-[-1px]">{price}</div>
      <p className="mt-2 text-sm text-white/70 font-body font-light leading-relaxed">{blurb}</p>
      <ul className="mt-6 flex flex-col gap-3 flex-1">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm text-white/80 font-body font-light">
            <span className="mt-0.5 text-kyroRed">
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </span>
            {f}
          </li>
        ))}
      </ul>
      <a
        href="#kyro-apply"
        className={
          featured
            ? "mt-8 liquid-glass-strong rounded-full px-5 py-3 text-sm font-body font-medium text-white text-center transition"
            : "mt-8 rounded-full px-5 py-3 text-sm font-body font-medium text-white text-center border border-kyroLine hover:bg-white/5 transition"
        }
      >
        Get Started
      </a>
    </KyroReveal>
  );
}

function KyroPricing() {
  return (
    <section id="kyro-pricing" className="px-6 md:px-12 lg:px-20 py-24 border-t border-kyroLine">
      <KyroReveal>
        <span className="text-xs font-body font-medium tracking-[0.15em] uppercase text-kyroRed">Pricing</span>
      </KyroReveal>
      <KyroReveal delay={0.06} className="max-w-2xl">
        <h2 className="mt-4 font-heading italic text-white text-4xl md:text-5xl tracking-[-1px]">
          Plans built around your growth stage
        </h2>
      </KyroReveal>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-12">
        <KyroPricingCard
          name="Starter"
          price="Free"
          blurb="A strategy call to map out where paid ads can move the needle."
          features={["30-minute strategy session", "Account audit", "Custom recommendations", "No obligation"]}
          delay={0.1}
        />
        <KyroPricingCard
          name="Growth"
          price="$1,500/mo"
          blurb="For brands ready to run consistent, optimized campaigns."
          features={["Up to 2 ad platforms managed", "Weekly optimization", "Monthly reporting", "Dedicated Slack channel"]}
          featured
          delay={0.16}
        />
        <KyroPricingCard
          name="Scale"
          price="$5,600/mo"
          blurb="Full-service management for larger, multi-platform budgets."
          features={["Unlimited ad platforms", "Custom creative production", "Weekly reporting calls", "Dedicated account manager"]}
          delay={0.22}
        />
      </div>
    </section>
  );
}

/* ---------- Process ---------- */
function KyroProcess() {
  const steps = [
    { n: "01", title: "Discover", body: "We audit your workshop, your services, your local competitors and your current ads to find where the next bookings will come from." },
    { n: "02", title: "Strategize", body: "A plan built around your best-margin services, such as ceramic coating, PPF, tinting or full details, with a clear offer for each." },
    { n: "03", title: "Launch", body: "Campaigns go live on Meta, Google and TikTok with clean testing and call and enquiry tracking, so we learn fast without wasting spend." },
    { n: "04", title: "Optimize", body: "We review performance weekly and move budget toward the services and ads that are filling your calendar, cutting what isn't." },
  ];
  return (
    <section id="kyro-process" className="cv-auto relative px-6 md:px-12 lg:px-20 py-24">
      <KyroReveal className="relative">
        <span className="text-xs font-body font-medium tracking-[0.15em] uppercase text-kyroRed">How we work</span>
      </KyroReveal>
      <KyroReveal delay={0.06} className="relative max-w-2xl">
        <h2 className="mt-4 font-heading italic text-white text-4xl md:text-5xl tracking-[-1px]">
          A clear process, from day one
        </h2>
      </KyroReveal>
      <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mt-12">
        {steps.map((s, i) => (
          <KyroReveal key={s.n} delay={0.08 * i} className="liquid-glass rounded-[1.25rem] p-6">
            <span className="font-heading italic text-kyroRed text-3xl">{s.n}</span>
            <h3 className="mt-3 font-heading italic text-white text-xl">{s.title}</h3>
            <p className="mt-2 text-sm text-white/70 font-body font-light leading-relaxed">{s.body}</p>
          </KyroReveal>
        ))}
      </div>
    </section>
  );
}

/* ---------- Case studies / client showcase ---------- */
function KyroCaseStudyCard({ tag, name, stat, statLabel, body, delay }) {
  return (
    <KyroReveal delay={delay} className="liquid-glass rounded-[1.25rem] p-4 sm:p-6 flex flex-col">
      <span className="text-xs font-body uppercase tracking-[0.15em] text-white/50">{tag}</span>
      <h3 className="mt-2 font-heading italic text-white text-2xl tracking-[-0.5px]">{name}</h3>
      <div className="mt-5 font-heading italic text-kyroRed text-5xl sm:text-7xl tracking-[-2px]">{stat}</div>
      <div className="text-xs text-white/50 font-body mt-0.5">{statLabel}</div>
      <p className="mt-4 text-sm text-white/70 font-body font-light leading-relaxed">{body}</p>
    </KyroReveal>
  );
}

function KyroCaseStudies() {
  return (
    <section id="kyro-work" className="cv-auto px-6 md:px-12 lg:px-20 py-24">
      <KyroReveal>
        <span className="text-xs font-body font-medium tracking-[0.15em] uppercase text-kyroRed">Our work</span>
      </KyroReveal>
      <KyroReveal delay={0.06} className="max-w-2xl">
        <h2 className="mt-4 font-heading italic text-white text-4xl md:text-5xl tracking-[-1px]">
          Results for automotive businesses
        </h2>
        <p className="mt-4 text-sm md:text-base text-white/70 font-body font-light leading-relaxed">
          A snapshot of the outcomes we aim for with every client, across car care and tinting businesses around Australia.
        </p>
      </KyroReveal>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-12">
        {KYRO_DATA.cases.slice(0, 3).map((c, i) => (
          <KyroCaseStudyCard key={c.name} tag={c.tag} name={c.name} stat={c.stat} statLabel={c.label} body={c.body} delay={0.1 + 0.06 * i} />
        ))}
      </div>
      <KyroReveal delay={0.34} className="mt-10">
        <a href="/case-studies/" className="inline-flex items-center gap-1.5 text-sm font-body font-medium text-kyroRed hover:text-white transition">
          See more case studies
          <ArrowUpRight className="h-4 w-4" />
        </a>
      </KyroReveal>
    </section>
  );
}

/* ---------- About ---------- */
function KyroAbout() {
  const pillars = [
    { title: "Small by design", body: "A focused team means your account gets senior attention, not a rotating cast of junior managers." },
    { title: "Hands-on, always", body: "No black-box dashboards. You can reach the people actually running your campaigns, directly." },
    { title: "Built around your numbers", body: "Every decision traces back to revenue and ROAS, not impressions or vanity metrics." },
  ];
  return (
    <section id="kyro-about" className="cv-auto relative px-6 md:px-12 lg:px-20 py-24">
      <KyroReveal className="relative">
        <span className="text-xs font-body font-medium tracking-[0.15em] uppercase text-kyroRed">Who we are</span>
      </KyroReveal>
      <KyroReveal delay={0.06} className="relative max-w-2xl">
        <h2 className="mt-4 font-heading italic text-white text-4xl md:text-5xl tracking-[-1px]">
          A team that treats your budget like our own
        </h2>
        <p className="mt-4 text-sm md:text-base text-white/70 font-body font-light leading-relaxed">
          Kyro Marketing is a small, Victoria-based team of media buyers and creative strategists. We focus on automotive businesses, from detailing and car washes to tinting, ceramic coating, PPF and headlight restoration, and we'd rather run fewer accounts well than many accounts poorly.
        </p>
      </KyroReveal>
      <div className="relative grid grid-cols-1 md:grid-cols-3 gap-5 mt-12">
        {pillars.map((p, i) => (
          <KyroReveal key={p.title} delay={0.08 * i} className="liquid-glass rounded-[1.25rem] p-6">
            <h3 className="font-heading italic text-white text-xl">{p.title}</h3>
            <p className="mt-2 text-sm text-white/70 font-body font-light leading-relaxed">{p.body}</p>
          </KyroReveal>
        ))}
      </div>
    </section>
  );
}

/* ---------- FAQ ---------- */
function KyroFaqItem({ q, a, isOpen, onToggle }) {
  return (
    <div className="border-t border-kyroLine py-5">
      <button className="w-full flex items-center justify-between text-left gap-4" onClick={onToggle} aria-expanded={isOpen}>
        <span className="font-heading italic text-white text-lg md:text-xl">{q}</span>
        <span className="text-white/50 flex-shrink-0">
          <PxIconChevron open={isOpen} />
        </span>
      </button>
      <div
        aria-hidden={!isOpen}
        style={{
          display: "grid",
          gridTemplateRows: isOpen ? "1fr" : "0fr",
          opacity: isOpen ? 1 : 0,
          transition: "grid-template-rows 0.6s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.5s ease " + (isOpen ? "0.08s" : "0s"),
        }}
      >
        <div
          style={{
            overflow: "hidden",
            minHeight: 0,
            visibility: isOpen ? "visible" : "hidden",
            transition: "visibility 0s linear " + (isOpen ? "0s" : "0.6s"),
          }}
        >
          <p
            className="pt-3 text-sm text-white/70 font-body font-light leading-relaxed max-w-2xl"
            style={{
              transform: isOpen ? "translateY(0)" : "translateY(-6px)",
              transition: "transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)",
            }}
          >
            {a}
          </p>
        </div>
      </div>
    </div>
  );
}

function KyroFAQ() {
  const [openIndex, setOpenIndex] = React.useState(0);
  const faqs = KYRO_DATA.homeFaq.map(([q, a]) => ({ q, a }));

  return (
    <section id="kyro-faq" className="cv-auto px-6 md:px-12 lg:px-20 py-24">
      <KyroReveal>
        <span className="text-xs font-body font-medium tracking-[0.15em] uppercase text-kyroRed">FAQ</span>
      </KyroReveal>
      <KyroReveal delay={0.06} className="max-w-2xl">
        <h2 className="mt-4 font-heading italic text-white text-4xl md:text-5xl tracking-[-1px]">
          Frequently asked questions
        </h2>
      </KyroReveal>
      <KyroReveal delay={0.1} className="mt-8">
        {faqs.map((f, i) => (
          <KyroFaqItem
            key={f.q}
            q={f.q}
            a={f.a}
            isOpen={openIndex === i}
            onToggle={() => setOpenIndex(openIndex === i ? -1 : i)}
          />
        ))}
      </KyroReveal>
    </section>
  );
}

function KyroTrusted() {
  return (
    <section className="px-6 md:px-12 lg:px-20 py-24 border-t border-kyroLine text-center">
      <KyroReveal className="max-w-2xl mx-auto">
        <h2 className="font-heading italic text-white text-4xl md:text-5xl tracking-[-1px]">
          Relied upon by leading brands globally
        </h2>
        <p className="mt-4 text-sm md:text-base text-white/70 font-body font-light leading-relaxed">
          We've collaborated with many businesses to help them reach their objectives, producing over $20,000 in additional revenue.
        </p>
      </KyroReveal>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-12 max-w-3xl mx-auto">
        <KyroReveal delay={0.08}>
          <div className="font-heading italic text-white text-4xl tracking-[-1px]">
            <KyroCounter to={250} prefix="$" suffix="K+" duration={1600} />
          </div>
          <div className="mt-2 text-xs text-white/60 font-body uppercase tracking-[0.1em]">Revenue produced for partners</div>
        </KyroReveal>
        <KyroReveal delay={0.14}>
          <div className="font-heading italic text-white text-4xl tracking-[-1px]">
            <KyroCounter to={85} suffix="+" duration={1600} />
          </div>
          <div className="mt-2 text-xs text-white/60 font-body uppercase tracking-[0.1em]">Campaigns successfully run</div>
        </KyroReveal>
        <KyroReveal delay={0.2}>
          <div className="font-heading italic text-white text-4xl tracking-[-1px]">
            <KyroCounter to={12} suffix="+" duration={1600} />
          </div>
          <div className="mt-2 text-xs text-white/60 font-body uppercase tracking-[0.1em]">Brands we've partnered with</div>
        </KyroReveal>
      </div>
    </section>
  );
}

function KyroClosingCTA({ ecom }) {
  return (
    <section id="kyro-apply" className="cv-auto relative px-6 md:px-12 lg:px-20 py-28 overflow-hidden">
      <div
        className="absolute inset-0 kyro-glow pointer-events-none"
        style={{
          maskImage: "linear-gradient(to bottom, transparent 0%, black 18%)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 18%)",
        }}
      />
      <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <KyroReveal className="relative max-w-3xl">
          <h2 className="font-heading italic text-white text-4xl md:text-6xl leading-[1.05] tracking-[-1.5px]">
            {ecom ? "Ready to sell more?" : "Ready to get more customers?"}
            <br />
            Let's make your ads work.
          </h2>
          <p className="mt-6 text-sm md:text-base text-white/70 font-body font-light max-w-xl leading-relaxed">
            Whether you run a detailing studio, a car wash, a tint shop or a ceramic coating and PPF business, we build the ads that put your work in front of local car owners and turn them into booked jobs.
          </p>
          <div className="flex flex-wrap items-center gap-6 mt-8">
            <a href="/apply/" className="liquid-glass-strong rounded-full px-5 py-2.5 text-sm font-medium text-white flex items-center gap-2">
              Get Started Today
              <ArrowUpRight className="h-5 w-5" />
            </a>
            <a href="/#kyro-faq" className="flex items-center gap-2 text-sm font-medium text-white">
              Learn more
              <PlayIcon className="h-4 w-4" />
            </a>
          </div>
        </KyroReveal>

        <KyroReveal delay={0.12} className="hidden lg:block relative">
          <div className="relative liquid-glass liquid-glass-no-border rounded-[1.75rem] p-10">
            <span className="font-heading italic text-white/20 text-8xl leading-none select-none">"</span>
            <p className="mt-2 font-heading italic text-white text-2xl md:text-3xl leading-snug tracking-[-0.5px]">
              "If you don't move forward, you begin to move backward."
            </p>
            <span className="mt-4 block text-xs text-white/50 font-body uppercase tracking-[0.1em]">By Mikhail Gorbachev</span>
            <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-3 gap-4">
              <div>
                <div className="font-heading italic text-white text-2xl tracking-[-1px]">13+</div>
                <div className="mt-1 text-[11px] text-white/50 font-body uppercase tracking-[0.08em]">Clients</div>
              </div>
              <div>
                <div className="font-heading italic text-white text-2xl tracking-[-1px] flex items-baseline">
                  5<span className="not-italic font-sans text-white" style={{ fontSize: "0.85em" }}>×</span>
                </div>
                <div className="mt-1 text-[11px] text-white/50 font-body uppercase tracking-[0.08em]">ROAS</div>
              </div>
              <div>
                <div className="font-heading italic text-white text-2xl tracking-[-1px]">$35K+</div>
                <div className="mt-1 text-[11px] text-white/50 font-body uppercase tracking-[0.08em]">Revenue</div>
              </div>
            </div>
          </div>
        </KyroReveal>
      </div>
    </section>
  );
}

function KyroFooter({ ecom }) {
  const resultsHref = ecom ? "#kyro-results" : "/results/";
  const workHref = ecom ? "#apply" : "#kyro-work";
  const workLabel = ecom ? "Apply" : "Our Work";
  return (
    <footer className="cv-auto relative px-6 md:px-12 lg:px-20 py-14 bg-black">
      <div className="absolute inset-x-0 top-0 h-[2px] bg-kyroRed/40" />
      <div className="flex flex-col gap-6 sm:hidden">
        <div className="flex items-center justify-between">
          <span className="font-heading italic text-white text-xl">Kyro Marketing</span>
          <div className="flex items-center gap-2">
            <a href="https://www.facebook.com/kyromarketing.au" aria-label="Kyro Marketing on Facebook" className="w-8 h-8 rounded-full liquid-glass flex items-center justify-center text-white/70 hover:text-white transition">
              <KyroIconFacebook className="h-3.5 w-3.5" />
            </a>
            <a href="https://www.instagram.com/kyro_marketing" aria-label="Kyro Marketing on Instagram" className="w-8 h-8 rounded-full liquid-glass flex items-center justify-center text-white/70 hover:text-white transition">
              <KyroIconInstagram className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <p className="font-body text-[10px] uppercase tracking-[0.1em] text-white/50 mb-2">Company</p>
            <ul className="flex flex-col gap-2">
              <li><a href="/#kyro-services" className="text-xs text-white/80 hover:text-white font-body transition">Services</a></li>
              <li><a href={resultsHref} className="text-xs text-white/80 hover:text-white font-body transition">Results</a></li>
              <li><a href={workHref} className="text-xs text-white/80 hover:text-white font-body transition">{workLabel}</a></li>
              <li><a href="/#kyro-faq" className="text-xs text-white/80 hover:text-white font-body transition">FAQ</a></li>
              <li><a href="/apply/" className="text-xs text-white/80 hover:text-white font-body transition">Apply</a></li>
            </ul>
          </div>

          <div>
            <p className="font-body text-[10px] uppercase tracking-[0.1em] text-white/50 mb-2">Services</p>
            <ul className="flex flex-col gap-2">
              <li><a href="/services/meta-ads/" className="text-xs text-white/80 hover:text-white font-body transition">Meta Ads</a></li>
              <li><a href="/services/website-creation/" className="text-xs text-white/80 hover:text-white font-body transition">Website Creation</a></li>
              <li><a href="/services/google-ads/" className="text-xs text-white/80 hover:text-white font-body transition">Google Ads</a></li>
              <li><a href="/services/targeting/" className="text-xs text-white/80 hover:text-white font-body transition">Targeting</a></li>
              <li><a href="/services/ad-creatives/" className="text-xs text-white/80 hover:text-white font-body transition">Ad Creatives</a></li>
              <li><a href="/services/tiktok-ads/" className="text-xs text-white/80 hover:text-white font-body transition">TikTok Ads</a></li>
            </ul>
            <p className="font-body text-[10px] uppercase tracking-[0.1em] text-white/50 mb-2 mt-5">Industries</p>
            <ul className="flex flex-col gap-2">
              {KYRO_INDUSTRIES.map((i) => (
                <li key={i.slug}><a href={"/industries/" + i.slug + "/"} className="text-xs text-white/80 hover:text-white font-body transition">{i.title}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-body text-[10px] uppercase tracking-[0.1em] text-white/50 mb-2">Support</p>
            <ul className="flex flex-col gap-2">
              <li><a href="/apply/" className="text-xs text-white/80 hover:text-white font-body transition">Contact</a></li>
              <li>
                <a href="mailto:Kyro.marketing@outlook.com" className="text-xs text-white/80 hover:text-white font-body transition flex items-center gap-1">
                  <KyroIconMail /> Email
                </a>
              </li>
              <li>
                <a href="tel:0494625754" className="text-xs text-white/80 hover:text-white font-body transition flex items-center gap-1">
                  <KyroIconPhone /> Call
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="hidden sm:grid grid-cols-4 gap-6 md:gap-10">
        <div>
          <span className="font-heading italic text-white text-xl md:text-2xl">Kyro Marketing</span>
          <p className="mt-3 text-sm text-white/60 font-body font-light max-w-xs leading-relaxed hidden md:block">
            Performance advertising for automotive businesses: detailing, car washes, tinting, ceramic coating, PPF and headlight restoration.
          </p>
          <div className="flex items-center gap-3 mt-5">
            <a href="https://www.facebook.com/kyromarketing.au" aria-label="Kyro Marketing on Facebook" className="w-9 h-9 rounded-full liquid-glass flex items-center justify-center text-white/70 hover:text-white transition">
              <KyroIconFacebook className="h-4 w-4" />
            </a>
            <a href="https://www.instagram.com/kyro_marketing" aria-label="Kyro Marketing on Instagram" className="w-9 h-9 rounded-full liquid-glass flex items-center justify-center text-white/70 hover:text-white transition">
              <KyroIconInstagram className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div>
          <p className="font-body text-xs uppercase tracking-[0.1em] text-white/50 mb-4">Company</p>
          <ul className="flex flex-col gap-2.5">
            <li><a href="/#kyro-services" className="text-sm text-white/80 hover:text-white font-body transition">Services</a></li>
            <li><a href={resultsHref} className="text-sm text-white/80 hover:text-white font-body transition">Results</a></li>
            <li><a href={workHref} className="text-sm text-white/80 hover:text-white font-body transition">{workLabel}</a></li>
            <li><a href="/#kyro-faq" className="text-sm text-white/80 hover:text-white font-body transition">FAQ</a></li>
            <li><a href="/apply/" className="text-sm text-white/80 hover:text-white font-body transition">Apply</a></li>
          </ul>
        </div>

        <div>
          <p className="font-body text-xs uppercase tracking-[0.1em] text-white/50 mb-4">Services</p>
          <ul className="flex flex-col gap-2.5">
            <li><a href="/services/meta-ads/" className="text-sm text-white/80 hover:text-white font-body transition">Meta Ads</a></li>
            <li><a href="/services/website-creation/" className="text-sm text-white/80 hover:text-white font-body transition">Website Creation</a></li>
            <li><a href="/services/google-ads/" className="text-sm text-white/80 hover:text-white font-body transition">Google Ads</a></li>
            <li><a href="/services/targeting/" className="text-sm text-white/80 hover:text-white font-body transition">Targeting</a></li>
            <li><a href="/services/ad-creatives/" className="text-sm text-white/80 hover:text-white font-body transition">Ad Creatives</a></li>
            <li><a href="/services/tiktok-ads/" className="text-sm text-white/80 hover:text-white font-body transition">TikTok Ads</a></li>
          </ul>
            <p className="font-body text-xs uppercase tracking-[0.1em] text-white/50 mb-4 mt-8">Industries</p>
            <ul className="flex flex-col gap-2.5">
              {KYRO_INDUSTRIES.map((i) => (
                <li key={i.slug}><a href={"/industries/" + i.slug + "/"} className="text-sm text-white/80 hover:text-white font-body transition">{i.title}</a></li>
              ))}
            </ul>
        </div>

        <div>
          <p className="font-body text-xs uppercase tracking-[0.1em] text-white/50 mb-4">Support</p>
          <ul className="flex flex-col gap-2.5">
            <li><a href="/apply/" className="text-sm text-white/80 hover:text-white font-body transition">Contact</a></li>
            <li>
              <a href="mailto:Kyro.marketing@outlook.com" className="text-sm text-white/80 hover:text-white font-body transition flex items-center gap-1.5">
                <KyroIconMail /> Email Us
              </a>
            </li>
            <li>
              <a href="tel:0494625754" className="text-sm text-white/80 hover:text-white font-body transition flex items-center gap-1.5">
                <KyroIconPhone /> Call Us
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-12 pt-6 border-t border-kyroLine text-xs text-white/50 font-body">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span>© 2026 Kyro Marketing. All rights reserved.</span>
          <span className="flex items-center gap-5">
            <a href="/case-studies/" className="hover:text-white transition">Case studies</a>
            <a href="/privacy/" className="hover:text-white transition">Privacy</a>
            <a href="/terms/" className="hover:text-white transition">Terms</a>
          </span>
        </div>
      </div>
    </footer>
  );
}

function KyroIconArrowLeft({ className = "h-4 w-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 18 9 12l6-6" />
    </svg>
  );
}

function PageFaq({ items }) {
  const [openIndex, setOpenIndex] = React.useState(0);
  return (
    <div className="mt-20 max-w-3xl">
      <KyroReveal>
        <h2 className="font-heading italic text-white text-2xl md:text-3xl tracking-[-0.5px]">Frequently asked questions</h2>
      </KyroReveal>
      <div className="mt-6">
        {items.map(([q, a], i) => (
          <KyroFaqItem key={q} q={q} a={a} isOpen={openIndex === i} onToggle={() => setOpenIndex(openIndex === i ? -1 : i)} />
        ))}
      </div>
    </div>
  );
}

function KyroPillLinks({ title, items }) {
  return (
    <div className="mt-20">
      <KyroReveal>
        <h2 className="font-heading italic text-white text-2xl md:text-3xl tracking-[-0.5px]">{title}</h2>
      </KyroReveal>
      <KyroReveal delay={0.06} className="mt-6 flex flex-wrap gap-3">
        {items.map((it) => (
          <a key={it.href} href={it.href} className="liquid-glass rounded-full px-5 py-2.5 text-sm text-white font-body hover:bg-white/10 transition">
            {it.label}
          </a>
        ))}
      </KyroReveal>
    </div>
  );
}

function ServiceDetailPage({ service }) {
  const isIndustry = service.kind === "industry";
  const caseItems = isIndustry ? KYRO_DATA.cases.filter((c) => (service.cases || []).includes(c.name)) : [];
  return (
    <div className="relative min-h-screen bg-kyroBg overflow-hidden">
      <div className="kyro-grain" />
      <div className="absolute inset-0 kyro-glow pointer-events-none" />

      <div className="relative px-6 md:px-12 lg:px-20 pt-10 pb-28">
        <a href="/" className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white font-body transition">
          <KyroIconArrowLeft />
          Back to Kyro Marketing
        </a>

        <KyroReveal className="flex items-center gap-4 mt-10">
          <div className="w-14 h-14 liquid-glass rounded-[0.9rem] flex items-center justify-center text-white">
            <service.Icon className="h-7 w-7" />
          </div>
          <span className="text-xs font-body uppercase tracking-[0.15em] text-kyroRed">{service.tag}</span>
        </KyroReveal>

        <KyroReveal delay={0.06}>
          <h1 className="mt-6 font-heading italic text-white text-5xl md:text-7xl tracking-[-2px] max-w-4xl">
            {service.h1 || service.title}
          </h1>
        </KyroReveal>

        <KyroReveal delay={0.12}>
          <p className="mt-6 text-xl md:text-2xl text-white/80 font-body font-light leading-relaxed max-w-3xl">
            {service.overview}
          </p>
        </KyroReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-16 max-w-4xl">
          <KyroReveal delay={0.1}>
            <h2 className="font-heading italic text-white text-2xl md:text-3xl tracking-[-0.5px]">
              {isIndustry ? "What works for " + service.title.toLowerCase() : "What we do differently"}
            </h2>
            <ul className="mt-6 flex flex-col gap-4">
              {service.different.map((d) => (
                <li key={d} className="flex items-start gap-3 text-sm text-white/80 font-body font-light leading-relaxed">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-kyroRed flex-shrink-0" />
                  {d}
                </li>
              ))}
            </ul>
          </KyroReveal>
          <KyroReveal delay={0.16}>
            <h2 className="font-heading italic text-white text-2xl md:text-3xl tracking-[-0.5px]">
              {isIndustry ? "Offers that work" : "How this helps you"}
            </h2>
            <ul className="mt-6 flex flex-col gap-4">
              {service.benefits.map((b) => (
                <li key={b} className="flex items-start gap-3 text-sm text-white/80 font-body font-light leading-relaxed">
                  <span className="mt-0.5 text-kyroRed flex-shrink-0">
                    <PxIconCheck />
                  </span>
                  {b}
                </li>
              ))}
            </ul>
          </KyroReveal>
        </div>

        {isIndustry && service.creative && (
          <div className="mt-16 max-w-4xl">
            <KyroReveal>
              <h2 className="font-heading italic text-white text-2xl md:text-3xl tracking-[-0.5px]">Creative that gets attention</h2>
              <ul className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                {service.creative.map((c) => (
                  <li key={c} className="flex items-start gap-3 text-sm text-white/80 font-body font-light leading-relaxed">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-kyroRed flex-shrink-0" />
                    {c}
                  </li>
                ))}
              </ul>
            </KyroReveal>
          </div>
        )}

        <div className="mt-20">
          <KyroReveal>
            <h2 className="font-heading italic text-white text-2xl md:text-3xl tracking-[-0.5px]">{isIndustry ? "Your first month" : "Our process"}</h2>
          </KyroReveal>
          <div className={"grid grid-cols-1 md:grid-cols-2 gap-5 mt-8 " + (isIndustry ? "lg:grid-cols-3" : "lg:grid-cols-4")}>
            {service.process.map((step, i) => (
              <KyroReveal key={step} delay={0.06 * i} className="liquid-glass rounded-[1.25rem] p-6">
                <span className="font-heading italic text-kyroRed text-3xl">{String(i + 1).padStart(2, "0")}</span>
                <p className="mt-4 text-sm text-white/80 font-body font-light leading-relaxed">{step}</p>
              </KyroReveal>
            ))}
          </div>
        </div>

        {caseItems.length > 0 && (
          <div className="mt-20">
            <KyroReveal>
              <h2 className="font-heading italic text-white text-2xl md:text-3xl tracking-[-0.5px]">Results in this industry</h2>
            </KyroReveal>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-8">
              {caseItems.map((c, i) => (
                <KyroCaseStudyCard key={c.name} tag={c.tag} name={c.name} stat={c.stat} statLabel={c.label} body={c.body} delay={0.06 * i} />
              ))}
            </div>
          </div>
        )}

        {service.faq && service.faq.length > 0 && <PageFaq items={service.faq} />}

        {isIndustry ? (
          <>
            <KyroPillLinks title="The services we use" items={KYRO_SERVICES.map((x) => ({ href: "/services/" + x.slug + "/", label: x.title }))} />
            <KyroPillLinks title="Other automotive industries" items={KYRO_INDUSTRIES.filter((x) => x.slug !== service.slug).map((x) => ({ href: "/industries/" + x.slug + "/", label: x.title }))} />
          </>
        ) : (
          <>
            <KyroPillLinks title={service.title + " for every automotive service"} items={KYRO_INDUSTRIES.map((x) => ({ href: "/industries/" + x.slug + "/", label: x.title }))} />
            <KyroPillLinks title="Other services" items={KYRO_SERVICES.filter((x) => x.slug !== service.slug).map((x) => ({ href: "/services/" + x.slug + "/", label: x.title }))} />
          </>
        )}

        <KyroReveal className="mt-24 flex flex-wrap items-center gap-6">
          <a
            href="/apply/"
            className="liquid-glass-strong rounded-full px-6 py-3 text-sm font-medium text-white flex items-center gap-2"
          >
            Apply Now
            <ArrowUpRight className="h-4 w-4" />
          </a>
          <a href={isIndustry ? "/#kyro-industries" : "/#kyro-services"} className="flex items-center gap-2 text-sm font-medium text-white">
            {isIndustry ? "Back to all industries" : "Back to all services"}
          </a>
        </KyroReveal>
      </div>
    </div>
  );
}

function LegalPage({ kind }) {
  const doc = KYRO_DATA.legal[kind];
  return (
    <div className="relative min-h-screen bg-kyroBg overflow-hidden">
      <div className="kyro-grain" />
      <div className="absolute inset-0 kyro-glow pointer-events-none" />
      <div className="relative px-6 md:px-12 lg:px-20 pt-10 pb-28">
        <a href="/" className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white font-body transition">
          <KyroIconArrowLeft />
          Back to Kyro Marketing
        </a>
        <KyroReveal className="mt-10">
          <span className="text-xs font-body font-medium tracking-[0.15em] uppercase text-kyroRed">Legal</span>
        </KyroReveal>
        <KyroReveal delay={0.06}>
          <h1 className="mt-4 font-heading italic text-white text-5xl md:text-6xl tracking-[-1.5px] max-w-2xl">{doc.title}</h1>
        </KyroReveal>
        <KyroReveal delay={0.12}>
          <p className="mt-4 text-sm text-white/50 font-body">Last updated {doc.updated}</p>
        </KyroReveal>
        <div className="mt-12 max-w-2xl flex flex-col gap-10">
          {doc.sections.map((sec) => (
            <KyroReveal key={sec.h}>
              <h2 className="font-heading italic text-white text-2xl md:text-3xl tracking-[-0.5px]">{sec.h}</h2>
              {(sec.p || []).map((t) => (
                <p key={t} className="mt-4 text-sm md:text-base text-white/70 font-body font-light leading-relaxed">{t}</p>
              ))}
              {sec.ul && (
                <ul className="mt-4 flex flex-col gap-3">
                  {sec.ul.map((t) => (
                    <li key={t} className="flex items-start gap-3 text-sm md:text-base text-white/70 font-body font-light leading-relaxed">
                      <span className="mt-2 w-1.5 h-1.5 rounded-full bg-kyroRed flex-shrink-0" />
                      {t}
                    </li>
                  ))}
                </ul>
              )}
            </KyroReveal>
          ))}
        </div>
      </div>
    </div>
  );
}

function KyroIndustries() {
  return (
    <section id="kyro-industries" className="cv-auto relative px-6 md:px-12 lg:px-20 py-24">
      <KyroReveal className="relative">
        <span className="text-xs font-body font-medium tracking-[0.15em] uppercase text-kyroRed">Who we help</span>
      </KyroReveal>
      <KyroReveal delay={0.06} className="relative max-w-2xl">
        <h2 className="mt-4 font-heading italic text-white text-4xl md:text-5xl tracking-[-1px]">Built for automotive businesses</h2>
        <p className="mt-4 text-sm md:text-base text-white/70 font-body font-light leading-relaxed">
          If you detail, wash, tint, coat or protect cars, we know how to fill your calendar. Pick your service to see how we advertise it.
        </p>
      </KyroReveal>
      <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-12">
        {KYRO_INDUSTRIES.map((s, i) => (
          <KyroReveal key={s.slug} delay={0.06 * (i % 3)} className="liquid-glass rounded-[1.25rem]">
            <a href={"/industries/" + s.slug + "/"} className="block p-6 h-full">
              <div className="w-11 h-11 liquid-glass rounded-[0.75rem] flex items-center justify-center text-white">
                <s.Icon className="h-6 w-6" />
              </div>
              <h3 className="mt-5 font-heading italic text-white text-2xl">{s.title}</h3>
              <p className="mt-2 text-sm text-white/70 font-body font-light leading-relaxed">{s.short}</p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-body text-kyroRed">
                Learn more
                <ArrowUpRight className="h-3.5 w-3.5" />
              </span>
            </a>
          </KyroReveal>
        ))}
      </div>
    </section>
  );
}

function KyroCaseStudyDetailCard({ tag, name, stat, statLabel, body, delay, placeholder }) {
  if (placeholder) {
    return (
      <KyroReveal
        delay={delay}
        className="rounded-[1.25rem] p-6 flex flex-col border border-dashed border-white/15"
      >
        <span className="text-xs font-body uppercase tracking-[0.15em] text-white/30">Coming soon</span>
        <h3 className="mt-2 font-heading italic text-white/30 text-2xl tracking-[-0.5px]">Client slot open</h3>
        <div className="mt-5 font-heading italic text-white/20 text-6xl tracking-[-2px]">TBD</div>
        <div className="text-xs text-white/25 font-body mt-0.5">Awaiting results to add</div>
        <p className="mt-4 text-sm text-white/30 font-body font-light leading-relaxed">
          Placeholder slot: swap in a real client name, stat, and summary here once available.
        </p>
      </KyroReveal>
    );
  }
  return (
    <KyroCaseStudyCard tag={tag} name={name} stat={stat} statLabel={statLabel} body={body} delay={delay} />
  );
}

const AD_IMGS = ["/assets/ad-result-00.webp", "/assets/ad-result-01.webp", "/assets/ad-result-02.webp", "/assets/ad-result-03.webp", "/assets/ad-result-04.webp", "/assets/ad-result-05.webp", "/assets/ad-result-06.webp", "/assets/ad-result-07.webp", "/assets/ad-result-08.webp", "/assets/ad-result-09.webp", "/assets/ad-result-10.webp", "/assets/ad-result-11.webp", "/assets/ad-result-12.webp", "/assets/ad-result-13.webp", "/assets/ad-result-14.webp", "/assets/ad-result-15.webp"];

const SLIDES = [
{date:"",when:"Window tint & paint protection client · 3 campaigns",tag:"Biggest result",tone:"good",img:13,
 h:"468 people messaged a tint business across three campaigns",
 p:["We ran three campaigns for one client, one for each service: home window tinting, paint protection film and car window tinting. Together they brought in 468 message enquiries at an average of $14.64 each.","The car tint and home tint campaigns both came in around $13 per enquiry. Paint protection cost more per enquiry ($19.08), which is normal for a higher-priced service."],
 s:[["468","<strong>Conversations</strong> across all three campaigns."],["182","<strong>Home window tint</strong> enquiries at $13.23 each."],["168","<strong>Car window tint</strong> enquiries at $13.05 each."],["118","<strong>Paint protection</strong> enquiries at $19.08 each."],["$14.64","<strong>Average cost per conversation.</strong>"]]},
{date:"",when:"Lead campaign",tag:"Strong",tone:"good",img:14,
 h:"61 leads and 75 conversations from one campaign",
 p:["One campaign brought 61 leads at $15.63 each, plus 75 people messaging the business.","1,347 people clicked the ad at 71 cents per click, and 3.42% of people who saw it clicked, which is well above most of the other results here."],
 s:[["61","<strong>Leads</strong> at $15.63 each."],["75","<strong>Conversations.</strong>"],["1,347","<strong>Clicks</strong> at $0.71 each."],["3.42%","<strong>Click rate.</strong> About 3 or 4 in every 100 people clicked."]]},
{date:"",when:"Click campaign",tag:"Top click rate",tone:"good",img:15,
 h:"5% of people who saw this ad clicked it",
 p:["This ad had the highest click rate in this set. 5.11% of people who saw it clicked, about 1 in every 20.","29 of its 30 clicks went straight through to the business, at about 70 cents each. Each person saw it 1.61 times on average, so it grabbed attention without being shown over and over."],
 s:[["5.11%","<strong>Click rate.</strong> About 1 in 20 people clicked."],["29","<strong>Link clicks</strong> out of 30 total clicks."],["$0.71","<strong>Cost per link click.</strong>"],["1.61","<strong>Frequency.</strong>"]]},
{date:"12 April 2026",tag:"Early test",tone:"warn",img:0,
 h:"5 people messaged the business from a $40 test",
 p:["This was a small test with $39.88 of ad spend. For that money, 5 people started a chat with the business, which works out to $7.98 per conversation.","Meta also recorded about 4 leads at $9.97 each."],
 s:[["$39.88","<strong>Spent</strong> on the ads."],["5","<strong>Conversations.</strong> People who messaged the business."],["$7.98","<strong>Cost per conversation.</strong>"],["2.22%","<strong>Click rate.</strong> About 2 in every 100 people who saw the ad clicked it."]]},
{date:"18 April 2026",tag:"Two ads compared",tone:"",img:1,
 h:"15 message enquiries across two ads for $147",
 p:["Two ads ran side by side (one per row). The first spent $21.58 and brought in 2 conversations. The second spent $125.90 and brought in 13 conversations at $9.68 each.","Running ads side by side shows which one deserves more of the budget."],
 s:[["15","<strong>Conversations</strong> across both ads."],["$9.68","<strong>Cost per conversation</strong> on the stronger ad."],["$0.55–0.95","<strong>Cost per click.</strong>"],["1.3–1.7","<strong>Frequency.</strong> Each person saw the ad less than twice on average."]]},
{date:"22 April 2026",tag:"Solid",tone:"good",img:2,
 h:"9 leads and about 15 conversations from $176",
 p:["$175.93 of ad spend brought 179 clicks. Meta recorded 9 leads at $19.54 each.","The cost per messaging conversation was $11.73, which works out to about 15 people messaging the business."],
 s:[["9","<strong>Leads</strong> at $19.54 each."],["~15","<strong>Conversations</strong> at $11.73 each."],["179","<strong>Clicks</strong> at $0.98 each."],["2.29%","<strong>Click rate.</strong>"]]},
{date:"1 May 2026",tag:"Live campaign",tone:"good",img:3,
 h:"25 people messaged the business while the ad was still running",
 p:["This screenshot was taken while the campaign was still live. At that point, 25 people had started a conversation at $14.80 each, about $370 in total.","Meta had also recorded 16 leads."],
 s:[["25","<strong>Conversations.</strong>"],["16","<strong>Leads.</strong>"],["$14.80","<strong>Cost per conversation.</strong>"],["2.08","<strong>Frequency.</strong> Each person saw the ad about twice."]]},
{date:"4 May 2026",tag:"Strong",tone:"good",img:4,
 h:"28 conversations and 19 leads from $426",
 p:["$425.62 of ad spend brought 476 clicks, which is under $1 per click.","28 people messaged the business at $15.20 each, and Meta recorded 19 leads."],
 s:[["$425.62","<strong>Spent.</strong>"],["28","<strong>Conversations</strong> at $15.20 each."],["19","<strong>Leads.</strong>"],["476","<strong>Clicks.</strong> People who clicked the ad."]]},
{date:"7 May 2026",tag:"Strong",tone:"good",img:5,
 h:"32 people reached out from under $500 of ads",
 p:["$489.88 of ad spend brought 32 message conversations at $15.31 each.","Meta also recorded about 21 leads at $23.33 each. Some of these may be the same people who messaged."],
 s:[["32","<strong>Conversations.</strong>"],["~21","<strong>Leads</strong> at $23.33 each."],["$15.31","<strong>Cost per conversation.</strong>"],["0.97%","<strong>Link click rate.</strong> This only counts clicks on the link itself, so it's lower than the other click rates."]]},
{date:"11 May 2026",tag:"Two ads compared",tone:"",img:6,
 h:"20 leads and 24 conversations across two ads",
 p:["Two ads ran together for $411.49 in total. The first spent $79.04 for 3 leads and 6 conversations.","The second spent $332.45 for 17 leads and 18 conversations. More people clicked it too (3.29% against 2.31%), so it was the clear winner."],
 s:[["20","<strong>Leads</strong> across both ads."],["24","<strong>Conversations</strong> across both ads."],["$19.56","<strong>Cost per lead</strong> on the stronger ad."],["3.29%","<strong>Click rate</strong> on the stronger ad."]]},
{date:"16 May 2026",tag:"Strong",tone:"good",img:7,
 h:"23 leads at $18 each, with one of the best click rates",
 p:["$418.81 of ad spend brought 23 leads at $18.21 each and 24 conversations at $17.45 each.","3.56% of people who saw the ad clicked it, one of the highest rates in this set."],
 s:[["23","<strong>Leads</strong> at $18.21 each."],["24","<strong>Conversations</strong> at $17.45 each."],["3.56%","<strong>Click rate.</strong> About 3 or 4 in every 100 people clicked."],["$418.81","<strong>Spent.</strong>"]]},
{date:"16 May 2026",tag:"Small budget",tone:"",img:8,
 h:"8 conversations at under $11 each",
 p:["A smaller ad spent $87.74.","It brought 8 conversations at $10.97 each and 3 leads at $29.25 each."],
 s:[["8","<strong>Conversations</strong> at $10.97 each."],["3","<strong>Leads</strong> at $29.25 each."],["2.27%","<strong>Click rate.</strong>"],["$87.74","<strong>Spent.</strong>"]]},
{date:"18 May 2026",tag:"Test: phone calls",tone:"warn",img:9,
 h:"53 clicks, but no phone calls yet",
 p:["This ad was set up to get people to call the business directly. After $42.27 it had 53 clicks at $0.80 each, but no calls yet (shown by the dash under cost per result).","Tests like this show which approach to drop, so the budget goes to the ads that bring in bookings."],
 s:[["$42.27","<strong>Spent.</strong>"],["53","<strong>Clicks</strong> at $0.80 each."],["0","<strong>Calls placed</strong> so far."],["1.81","<strong>Frequency.</strong>"]]},
{date:"18 May 2026",tag:"Low cost",tone:"good",img:10,
 h:"5 leads at $11 each",
 p:["$55.29 of ad spend brought 110 clicks at 50 cents each.","It produced 5 leads at $11.06 each, one of the cheapest costs per lead in this set."],
 s:[["5","<strong>Leads</strong> at $11.06 each."],["110","<strong>Clicks.</strong>"],["$0.50","<strong>Cost per click.</strong>"],["2.76%","<strong>Click rate.</strong>"]]},
{date:"21 May 2026",tag:"Creative test",tone:"",img:11,
 h:"Four ads tested to see which one grabs attention",
 p:["Four versions of an ad (one per row) ran on a very small budget to see which one people respond to. The top ad got 15 clicks at 10 cents each.","Another got 17.86% of viewers clicking, but from a small sample. The winners get the bigger budget."],
 s:[["15","<strong>Clicks</strong> on the top ad."],["$0.05–0.82","<strong>Cost per click</strong> across the four ads."],["$3.34–22.42","<strong>CPM.</strong> The cost to show each ad 1,000 times."],["3.48%","<strong>Click rate</strong> on the top ad."]]},
{date:"23 May 2026",tag:"Lowest cost",tone:"good",img:12,
 h:"11 conversations, the cheapest at $6.29 each",
 p:["Two ads ran side by side. The first brought 7 conversations at $6.29 each, the lowest cost per conversation in this set. The second brought 4 at $12.91 each.","Together that's about $96 for 11 people messaging the business."],
 s:[["11","<strong>Conversations</strong> across both ads."],["$6.29","<strong>Cost per conversation</strong> on the top ad."],["29","<strong>Link clicks</strong> across both ads."],["2.45%","<strong>Click rate</strong> on the top ad."]]}
];

function KyroAdResultsCard({ d, i, idx, n, onGo, onZoom }) {
  const [open, setOpen] = React.useState(false);
  let o = i - idx;
  if (o > n / 2) o -= n;
  if (o < -n / 2) o += n;
  const a = Math.min(Math.abs(o), 3);
  const sg = Math.sign(o);
  const X = [0, 0.62, 1.06, 1.42];
  const S = [1, 0.82, 0.68, 0.6];
  const Y = [0, 0.1, 0.16, 0.2];
  const pos = a === 0 ? "0" : a === 1 ? "1" : a === 2 ? "2" : "far";
  const isCenter = o === 0;
  const label = d.date || d.when;

  return (
    <div
      className={"ar-card" + (isCenter ? " ar-center" : "") + (open ? " ar-open" : "")}
      data-ar-pos={pos}
      style={{
        "--ar-x": "calc(var(--ar-w) * " + (sg * X[a]) + ")",
        "--ar-y": "calc(var(--ar-h) * " + Y[a] + ")",
        "--ar-s": S[a],
        zIndex: 10 - a,
      }}
      role="group"
      aria-roledescription="slide"
      aria-label={"Result " + (i + 1) + " of " + n + ": " + d.h}
      tabIndex={isCenter ? 0 : -1}
      onClick={() => {
        if (!isCenter) { onGo(i); return; }
        setOpen((v) => !v);
      }}
    >
      <div className="ar-face">
        <div className="flex justify-between items-center gap-2">
          <span className="text-xs text-white/50 font-body tracking-wide">{String(i + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}</span>
          <span
            className={
              "text-[10px] font-body font-semibold uppercase tracking-[0.1em] px-2 py-1 rounded-full whitespace-nowrap " +
              (d.tone === "good" ? "bg-emerald-500/15 text-emerald-300" : d.tone === "warn" ? "bg-amber-500/15 text-amber-300" : "bg-kyroRed/15 text-kyroRed")
            }
          >
            {d.tag}
          </span>
        </div>
        <div className="ar-shot">
          <img
            src={AD_IMGS[d.img]}
            alt={"Meta Ads Manager screenshot: " + d.h}
            onClick={(e) => { if (isCenter) { e.stopPropagation(); onZoom(AD_IMGS[d.img]); } }}
            style={isCenter ? { cursor: "zoom-in" } : undefined}
          />
        </div>
        <div>
          <div className="text-[10px] font-body uppercase tracking-[0.14em] text-white/40 mb-1">{label}</div>
          <h2 className="font-heading italic text-white text-xl md:text-2xl leading-tight tracking-[-0.5px]">{d.h}</h2>
        </div>
      </div>
      <div className="ar-info">
        <div className="text-[10px] font-body uppercase tracking-[0.14em] text-white/40">{label}</div>
        <h3 className="font-heading italic text-white text-xl leading-tight tracking-[-0.5px]">{d.h}</h3>
        {d.p.map((para, k) => (
          <p key={k} className="text-[13px] text-white/75 font-body font-light leading-relaxed" dangerouslySetInnerHTML={{ __html: para }} />
        ))}
        <div className="grid grid-cols-2 gap-px bg-white/10 rounded-lg overflow-hidden border border-white/10 mt-1">
          {d.s.map(([v, m], k) => (
            <div key={k} className="bg-[#0d0707] p-2">
              <div className="font-heading italic text-white text-base leading-none">{v}</div>
              <div className="mt-1 text-[10px] text-white/50 font-body leading-snug" dangerouslySetInnerHTML={{ __html: m }} />
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onZoom(AD_IMGS[d.img]); }}
          className="mt-1 self-start text-[11px] font-body font-medium uppercase tracking-[0.08em] text-black bg-white rounded-full px-3 py-1.5"
        >
          View full screenshot
        </button>
      </div>
    </div>
  );
}

function AdResultsPage() {
  const n = SLIDES.length;
  const [idx, setIdx] = React.useState(0);
  const [lightbox, setLightbox] = React.useState(null);
  const go = (i) => setIdx(((i % n) + n) % n);

  React.useEffect(() => {
    const onKey = (e) => {
      if (lightbox) { if (e.key === "Escape") setLightbox(null); return; }
      if (e.key === "ArrowRight") go(idx + 1);
      if (e.key === "ArrowLeft") go(idx - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [idx, lightbox]);

  return (
    <div className="ar-page relative min-h-screen bg-kyroBg overflow-hidden">
      <div className="kyro-grain" />
      <div className="absolute top-0 left-0 right-0 h-[140vh] kyro-glow pointer-events-none" />
      <Navbar />

      <div className="relative px-6 md:px-12 lg:px-20 pt-32 md:pt-36 pb-28">
        <div className="flex flex-col items-center text-center gap-3">
          <h1 className="font-heading italic text-white text-4xl md:text-6xl tracking-[-1.5px]">
            Real ads. <span className="text-kyroRed">Real enquiries.</span>
          </h1>
          <p className="max-w-xl text-sm md:text-base text-white/70 font-body font-light leading-relaxed">
            Real results from the Facebook and Instagram ads we run for car detailing and tinting businesses.
            Hover over a result (or tap it on your phone) to see what the numbers mean.
          </p>
        </div>

        <div className="ar-stage" aria-roledescription="carousel" aria-label="Ad results">
          {SLIDES.map((d, i) => (
            <KyroAdResultsCard key={i} d={d} i={i} idx={idx} n={n} onGo={go} onZoom={setLightbox} />
          ))}
          <button onClick={() => go(idx - 1)} aria-label="Previous result" className="ar-arrow ar-prev liquid-glass-strong">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
          </button>
          <button onClick={() => go(idx + 1)} aria-label="Next result" className="ar-arrow ar-next liquid-glass-strong">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </button>
        </div>
        <div className="flex items-center justify-center">
          <span className="text-xs text-white/40 font-body tracking-wide">
            Result <b className="text-white font-medium">{String(idx + 1).padStart(2, "0")}</b> / {String(n).padStart(2, "0")}
          </span>
        </div>
        <div className="ar-dots" role="group" aria-label="Choose a result">
          {SLIDES.map((_, i) => (
            <button key={i} onClick={() => go(i)} aria-label={"Go to result " + (i + 1)} aria-current={i === idx ? "true" : "false"} />
          ))}
        </div>

        <div className="relative -mx-6 md:-mx-12 lg:-mx-20 px-6 md:px-12 lg:px-20 mt-16 pt-4 pb-4">
          <div className="absolute inset-0 kyro-glow pointer-events-none" />

          <div className="relative grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-4xl mx-auto">
            <div className="liquid-glass rounded-[1.25rem] p-6 text-center">
              <div className="font-heading italic text-white text-4xl tracking-[-1px]">468</div>
              <div className="mt-2 text-sm text-white/70 font-body font-light">people messaged one tint business across three campaigns</div>
            </div>
            <div className="liquid-glass rounded-[1.25rem] p-6 text-center">
              <div className="font-heading italic text-white text-4xl tracking-[-1px]">$6.29</div>
              <div className="mt-2 text-sm text-white/70 font-body font-light">lowest cost for one person to message the business</div>
            </div>
            <div className="liquid-glass rounded-[1.25rem] p-6 text-center">
              <div className="font-heading italic text-white text-4xl tracking-[-1px]">61</div>
              <div className="mt-2 text-sm text-white/70 font-body font-light">leads from a single campaign, at $15.63 each</div>
            </div>
          </div>

          <div className="relative max-w-3xl mx-auto mt-20">
            <span className="text-xs font-body font-medium tracking-[0.15em] uppercase text-kyroRed">Plain English</span>
            <h2 className="mt-3 font-heading italic text-white text-3xl md:text-4xl tracking-[-1px]">What the numbers mean</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 border-t border-kyroLine mt-8">
              {[
                ["Amount spent", "What the business paid Meta to show the ads."],
                ["Messaging conversations", "People who sent the business a message on Messenger, Instagram or WhatsApp after seeing the ad. These are real enquiries."],
                ["Results / Meta leads", "People Meta counted as leads, usually because they left their name and contact details. Some may be the same people who messaged."],
                ["Cost per result / per messaging", "Amount spent divided by the number of leads or conversations. Lower is better."],
                ["Clicks", "How many times people clicked on the ad."],
                ["CPC (cost per click)", "The average price paid each time someone clicked."],
                ["CTR (click-through rate)", "Out of every 100 people who saw the ad, how many clicked. 2.5% means 2 or 3 people in every 100."],
                ["Frequency", "How many times, on average, each person saw the ad. Around 1 to 2 means people aren't getting sick of it."],
                ["CPM", "The cost to show the ad 1,000 times."],
                ["Link clicks", "Clicks that went through to the business's page, form or chat. Likes and photo taps don't count."],
              ].map(([t, b]) => (
                <div key={t} className="py-4 border-b border-kyroLine">
                  <div className="text-sm font-medium text-white">{t}</div>
                  <div className="mt-1 text-sm text-white/60 font-body font-light leading-relaxed">{b}</div>
                </div>
              ))}
            </div>
            <p className="text-xs text-white/40 font-body mt-6">Screenshots from Meta Ads Manager. All amounts in AUD.</p>
          </div>

          <div className="relative flex flex-col items-center text-center gap-4 mt-20">
            <span className="text-xs font-body font-medium tracking-[0.15em] uppercase text-kyroRed">Your turn</span>
            <h2 className="font-heading italic text-white text-3xl md:text-5xl tracking-[-1.5px]">Want results <span className="text-kyroRed">like these?</span></h2>
            <p className="max-w-md text-sm text-white/70 font-body font-light leading-relaxed">
              We run Meta ads for car detailers and automotive businesses. Apply now and we'll show you what we'd do for yours.
            </p>
            <a href="/apply/" className="flex items-center gap-1.5 bg-white text-black rounded-full px-5 py-2.5 text-sm font-medium mt-2">
              Get More Clients
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>

      {lightbox && (
        <div className="fixed inset-0 z-[300] bg-black/85 flex items-center justify-center p-6" onClick={() => setLightbox(null)} role="dialog" aria-modal="true">
          <div className="relative inline-flex max-w-[95vw] max-h-[92vh]" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setLightbox(null)} aria-label="Close" className="absolute -top-4 -right-4 z-10 w-11 h-11 rounded-full bg-white text-black flex items-center justify-center shadow-lg">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
            </button>
            <div className="bg-white rounded-xl p-3 max-w-[95vw] max-h-[92vh] overflow-auto">
              <img src={lightbox} alt="Full-size screenshot" className="max-w-none" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CaseStudiesPage() {
  const studies = KYRO_DATA.cases.map((c) => ({ tag: c.tag, name: c.name, stat: c.stat, statLabel: c.label, body: c.body }));


  return (
    <div className="relative min-h-screen bg-kyroBg overflow-hidden">
      <div className="absolute inset-0 kyro-glow pointer-events-none" />

      <div className="relative px-6 md:px-12 lg:px-20 pt-10 pb-28">
        <a href="/#kyro-work" className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white font-body transition">
          <KyroIconArrowLeft />
          Back to Kyro Marketing
        </a>

        <KyroReveal className="mt-10">
          <span className="text-xs font-body font-medium tracking-[0.15em] uppercase text-kyroRed">Case studies</span>
        </KyroReveal>
        <KyroReveal delay={0.06}>
          <h1 className="mt-4 font-heading italic text-white text-5xl md:text-6xl tracking-[-1.5px] max-w-2xl">
            Case studies for automotive businesses
          </h1>
        </KyroReveal>
        <KyroReveal delay={0.12}>
          <p className="mt-6 text-base md:text-lg text-white/70 font-body font-light leading-relaxed max-w-2xl">
            Every campaign is different, but the goal is always the same: real, trackable outcomes. Here are campaigns
            for car washes, detailers, tinters and ceramic coating businesses around Australia. Results vary by business, area and budget.
          </p>
        </KyroReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-14">
          {studies.map((s, i) => (
            <KyroCaseStudyDetailCard key={s.name || "placeholder-" + i} {...s} delay={0.06 * i} />
          ))}
        </div>

        <KyroReveal delay={0.5} className="mt-16 flex flex-wrap items-center gap-4">
          <a href="/apply/" className="liquid-glass-strong rounded-full px-6 py-3 text-sm font-medium text-white flex items-center gap-2">
            Apply Now
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </KyroReveal>
      </div>
    </div>
  );
}

function KyroIconChevronUp({ className = "h-4 w-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 15l6-6 6 6" />
    </svg>
  );
}
function KyroIconChevronDown({ className = "h-4 w-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

function ApplyPage({ ecom }) {
  const [form, setForm] = React.useState({
    name: "",
    phone: "",
    service: "",
    budget: "",
    message: "",
  });
  const [sent, setSent] = React.useState(false);
  const [step, setStep] = React.useState(0);
  const [submitting, setSubmitting] = React.useState(false);
  const [submitError, setSubmitError] = React.useState(false);

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const steps = [
    { field: "name", label: "What's your name?", type: "text", required: true, placeholder: "Type your answer here…" },
    { field: "phone", label: "Best phone number to reach you on?", type: "tel", required: true, placeholder: "Type your answer here…" },
    ecom
      ? { field: "service", label: "What's your store, and what do you sell?", type: "text", required: true, placeholder: "e.g. Streetwear brand, swimwear, jewellery…" }
      : { field: "service", label: "What type of automotive business do you run?", type: "text", required: true, placeholder: "e.g. Detailing, tinting, ceramic coating, PPF, headlight restoration…" },
    { field: "budget", label: "Rough monthly ad budget?", type: "text", required: true, placeholder: "e.g. $1,000–$3,000" },
    { field: "message", label: "What's your biggest challenge right now?", type: "textarea", required: false, placeholder: "Type your answer here… (optional)" },
  ];
  const currentStep = steps[step];
  const isLastStep = step === steps.length - 1;
  const canAdvance = !currentStep.required || form[currentStep.field].trim().length > 0;
  const progress = ((step + (sent ? 1 : 0)) / steps.length) * 100;

  const advance = () => {
    if (!canAdvance || submitting) return;
    if (isLastStep) {
      handleSubmit();
    } else {
      setStep((s) => s + 1);
    }
  };
  const goNext = (e) => {
    e.preventDefault();
    advance();
  };
  const goBack = () => setStep((s) => Math.max(0, s - 1));

  const handleSubmit = async () => {
    setSubmitting(true);
    setSubmitError(false);
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: "0e957f26-e483-4522-9b04-6cbe7c51f70a",
          subject: "New enquiry: " + (form.service || form.name || "Kyro Marketing"),
          from_name: "Kyro Marketing — Apply form" + (ecom ? " (Ecom)" : ""),
          Name: form.name,
          Phone: form.phone,
          [ecom ? "Store / what they sell" : "Service they offer"]: form.service,
          "Monthly ad budget": form.budget,
          "Biggest challenge": form.message || "—",
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) throw new Error("Request failed");
      if (window.gtag) { try { window.gtag("event", "generate_lead", { event_category: "apply_form" }); } catch (e) {} }
      setSent(true);
    } catch (err) {
      setSubmitError(true);
    } finally {
      setSubmitting(false);
    }
  };

  React.useEffect(() => {
    const onKey = (e) => {
      if (sent) return;
      if (e.key === "ArrowUp") { e.preventDefault(); goBack(); }
      if (e.key === "ArrowDown") { e.preventDefault(); advance(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [step, form, sent]);

  return (
    <div className="relative min-h-screen bg-kyroBg overflow-hidden flex flex-col">
      <div className="kyro-grain" />
      <div className="absolute inset-0 kyro-glow pointer-events-none" />
      <FadingVideo
        src={KYRO_APPLY_VIDEO_DATA_URI}
        className="fixed inset-0 w-full h-full object-cover z-0 opacity-40"
      />
      <div
        className="fixed inset-0 z-[1] pointer-events-none"
        style={{ background: "rgba(8,2,2,0.78)" }}
      />

      {/* progress bar */}
      <div className="fixed top-0 left-0 right-0 h-[3px] bg-white/10 z-30">
        <div
          className="h-full bg-kyroRed transition-[width] duration-500 ease-out"
          style={{ width: (sent ? 100 : progress) + "%" }}
        />
      </div>

      <div className="relative z-20">
        <Navbar ecom={ecom} />
      </div>
      {!sent && (
        <span className="absolute top-[70px] md:top-[78px] right-6 md:right-10 z-20 text-[11px] text-white/40 font-body uppercase tracking-[0.15em]">
          {step + 1} / {steps.length}
        </span>
      )}

      <div className="relative z-10 flex-1 flex flex-col justify-center px-6 md:px-16 lg:px-24 py-16">
        {sent ? (
          <KyroReveal className="max-w-xl">
            <span className="text-xs font-body font-medium tracking-[0.15em] uppercase text-kyroRed">Thank you</span>
            <h1 className="mt-4 font-heading italic text-white text-4xl md:text-6xl tracking-[-1.5px]">
              We'll be in touch soon.
            </h1>
            <p className="mt-6 text-base md:text-lg text-white/70 font-body font-light leading-relaxed max-w-md">
              Your application's been sent. We'll get back to you within one business day to talk through fit and next steps.
            </p>
            <a
              href="/"
              className="inline-flex items-center gap-2 mt-10 bg-white text-black rounded-full px-6 py-3 text-sm font-medium hover:brightness-95 transition"
            >
              <KyroIconArrowLeft />
              Back to Kyro Marketing
            </a>
            <div className="mt-14 flex flex-col gap-3">
              <a href="mailto:kyro.marketing@outlook.com" className="flex items-center gap-2 text-sm text-white/70 hover:text-white font-body transition">
                <KyroIconMail /> kyro.marketing@outlook.com
              </a>
              <a href="tel:0494625754" className="flex items-center gap-2 text-sm text-white/70 hover:text-white font-body transition">
                <KyroIconPhone /> 0494 625 754
              </a>
            </div>
          </KyroReveal>
        ) : (
          <form onSubmit={goNext} className="max-w-2xl w-full" key={step}>
            <KyroReveal className="flex items-start gap-3">
              <span className="mt-1 flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-md bg-white text-black text-xs font-bold font-body">
                {step + 1}
              </span>
              <h1 className="font-heading italic text-white text-3xl md:text-5xl tracking-[-1px] leading-tight">
                {currentStep.label}
                {currentStep.required && <span className="text-kyroRed">*</span>}
              </h1>
            </KyroReveal>

            <KyroReveal delay={0.08} className="mt-10">
              {currentStep.type === "textarea" ? (
                <textarea
                  autoFocus
                  rows={2}
                  value={form[currentStep.field]}
                  onChange={update(currentStep.field)}
                  placeholder={currentStep.placeholder}
                  className="w-full bg-transparent border-b-2 border-white/25 focus:border-kyroRed outline-none pb-3 text-xl md:text-2xl text-white font-body font-light placeholder:text-white/30 transition-colors resize-none"
                />
              ) : (
                <input
                  autoFocus
                  required={currentStep.required}
                  type={currentStep.type}
                  value={form[currentStep.field]}
                  onChange={update(currentStep.field)}
                  placeholder={currentStep.placeholder}
                  className="w-full bg-transparent border-b-2 border-white/25 focus:border-kyroRed outline-none pb-3 text-xl md:text-2xl text-white font-body font-light placeholder:text-white/30 transition-colors"
                />
              )}
            </KyroReveal>

            <KyroReveal delay={0.14} className="flex items-center gap-4 mt-8">
              <button
                type="submit"
                disabled={!canAdvance || submitting}
                className="bg-kyroRed text-white rounded-full px-6 py-3 text-sm font-medium flex items-center gap-2 hover:brightness-110 transition disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:brightness-100"
              >
                {submitting ? "Sending…" : isLastStep ? "Send Application" : "OK"}
                {!submitting && <ArrowUpRight className="h-4 w-4" />}
              </button>
            </KyroReveal>
            {submitError && (
              <p className="mt-6 text-xs text-kyroRed font-body max-w-sm">
                Something went wrong sending that — please try again, or email us directly at{" "}
                <a href="mailto:kyro.marketing@outlook.com" className="underline hover:text-white">kyro.marketing@outlook.com</a>.
              </p>
            )}
          </form>
        )}
      </div>

      {!sent && (
        <div className="fixed bottom-6 right-6 md:bottom-8 md:right-10 z-20 flex flex-col gap-2">
          <button
            type="button"
            onClick={goBack}
            disabled={step === 0 || submitting}
            aria-label="Previous question"
            className="w-11 h-11 rounded-lg liquid-glass flex items-center justify-center text-white/70 hover:text-white transition disabled:opacity-25 disabled:cursor-not-allowed"
          >
            <KyroIconChevronUp />
          </button>
          <button
            type="button"
            onClick={advance}
            disabled={!canAdvance || submitting}
            aria-label="Next question"
            className="w-11 h-11 rounded-lg bg-kyroRed flex items-center justify-center text-white hover:brightness-110 transition disabled:opacity-30 disabled:cursor-not-allowed disabled:bg-white/10"
          >
            <KyroIconChevronDown />
          </button>
        </div>
      )}
    </div>
  );
}

function KyroMarketingPage() {
  return (
    <div className="relative bg-kyroBg">
      <div className="kyro-grain" />
      <KyroNav />
      <KyroHero />
      <KyroServices />
      <KyroResults />
      <KyroTrusted />
      <KyroClosingCTA />
      <KyroFooter />
    </div>
  );
}

/* ---------- App ---------- */
function App() {
  React.useEffect(() => {
    const originalError = console.error;
    console.error = (...args) => {
      if (typeof args[0] === "string" && args[0].includes("key")) return;
      originalError(...args);
    };
    return () => {
      console.error = originalError;
    };
  }, []);

  React.useEffect(() => {
    const t = setTimeout(() => { const el = document.getElementById("hero-poster"); if (el) el.remove(); }, 3500);
    return () => clearTimeout(t);
  }, []);

  // Global scroll dampening: reduce how far each wheel tick moves the page,
  // site-wide, without touching touch scrolling (mobile) or elements that
  // manage their own internal scroll (lightboxes, the flip-card info panel).
  React.useEffect(() => {
    const SENSITIVITY = 0.55;
    let pending = 0;
    let scheduled = false;

    const hasOwnScroll = (el) => {
      while (el && el !== document.body && el !== document.documentElement) {
        if (el.scrollHeight > el.clientHeight + 1) {
          const overflowY = window.getComputedStyle(el).overflowY;
          if (overflowY === "auto" || overflowY === "scroll") return true;
        }
        el = el.parentElement;
      }
      return false;
    };

    const flush = () => {
      window.scrollBy(0, pending);
      pending = 0;
      scheduled = false;
    };

    const onWheel = (e) => {
      if (Math.abs(e.deltaY) < Math.abs(e.deltaX)) return; // let horizontal wheel gestures pass through
      if (hasOwnScroll(e.target)) return;
      e.preventDefault();
      const delta = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaMode === 2 ? e.deltaY * window.innerHeight : e.deltaY;
      pending += delta * SENSITIVITY;
      if (!scheduled) {
        scheduled = true;
        requestAnimationFrame(flush);
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, []);

  const routeFromLocation = () => {
    if (typeof window === "undefined") return "";
    const p = window.location.pathname.replace(/\/index\.html$/, "").replace(/\/+$/, "");
    let m;
    if (p === "/apply") return "#apply";
    if (p === "/case-studies") return "/case-studies/";
    if (p === "/results") return "/results/";
    if (p === "/privacy") return "#privacy";
    if (p === "/terms") return "#terms";
    if ((m = p.match(/^\/services\/([a-z0-9-]+)$/))) return "#service-" + m[1];
    if ((m = p.match(/^\/industries\/([a-z0-9-]+)$/))) return "#industry-" + m[1];
    return window.location.hash;
  };
  const [route, setRoute] = React.useState(routeFromLocation);

  React.useEffect(() => {
    const onHashChange = () => setRoute(routeFromLocation());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  // /ecom is a near-replica of the homepage retargeted at ecommerce/clothing
  // brands. It's determined by pathname (not hash) so it stays stable while
  // the user navigates between in-page hash routes (service detail, apply).
  // The "#ecom-preview" hash is a local-only escape hatch: opening the file
  // directly (file://...) has no real pathname to match, so this lets the
  // /ecom variant be checked before it's deployed. Production visits always
  // go through the pathname check.
  const isEcom = false; // Standalone service-based build: always targets automotive/detailing clients. No route ever flips this.
  const servicesList = isEcom ? ECOM_SERVICES : KYRO_SERVICES;

  const activeService = servicesList.find((s) => route === "#service-" + s.slug);
  const activeIndustry = KYRO_INDUSTRIES.find((s) => route === "#industry-" + s.slug);
  const isLegalPage = route === "#privacy" || route === "#terms";
  const isApplyPage = route === "#apply";
  const isCaseStudiesPage = route === "/case-studies/";
  const isAdResultsPage = route === "/results/";

  // When navigating to a normal in-page anchor (not a service page), scroll
  // to it manually since the browser's native hash-scroll only fires once,
  // not after React swaps the page content back in.
  React.useEffect(() => {
    if (!route || activeService || activeIndustry || isLegalPage || isApplyPage || isCaseStudiesPage || isAdResultsPage) return;
    const id = route.replace("#", "");
    requestAnimationFrame(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "auto" });
    });
  }, [route, activeService, isApplyPage, isCaseStudiesPage]);

  // The stacking Services section is many viewport-heights tall, so when a
  // card is clicked mid-scroll, the browser's scroll position stays put,
  // reset to the top so the new (much shorter) detail page opens at its top.
  React.useEffect(() => {
    if (activeService || activeIndustry || isLegalPage || isApplyPage || isCaseStudiesPage || isAdResultsPage) {
      window.scrollTo(0, 0);
    }
  }, [activeService, activeIndustry, isLegalPage, isApplyPage, isCaseStudiesPage, isAdResultsPage]);

  if (activeService) {
    return <ServiceDetailPage service={activeService} />;
  }

  if (activeIndustry) {
    return <ServiceDetailPage service={activeIndustry} />;
  }

  if (isLegalPage) {
    return <LegalPage kind={route === "#privacy" ? "privacy" : "terms"} />;
  }

  if (isApplyPage) {
    return <ApplyPage ecom={isEcom} />;
  }

  if (isCaseStudiesPage) {
    return <CaseStudiesPage />;
  }

  if (isAdResultsPage) {
    return <AdResultsPage />;
  }

  return (
    <div className="bg-black">
      <Hero ecom={isEcom} />
      <div
        className="relative"
        style={{
          background:
            "radial-gradient(ellipse 1400px 700px at 50% 3%, rgba(228,49,43,0.09) 0%, transparent 65%)," +
            "radial-gradient(ellipse 1400px 900px at 50% 55%, rgba(228,49,43,0.10) 0%, transparent 60%)," +
            "radial-gradient(ellipse 1400px 900px at 50% 74%, rgba(228,49,43,0.09) 0%, transparent 60%)," +
            "radial-gradient(ellipse 1400px 900px at 50% 90%, rgba(228,49,43,0.11) 0%, transparent 60%)," +
            "#0B0B0C",
        }}
      >
        <div className="kyro-grain" />
        <KyroServices services={servicesList} />
        <KyroIndustries />
        <KyroResults />
        <KyroProcess />
        {!isEcom && <KyroCaseStudies />}
        <KyroAbout />
        <KyroFAQ />
        <KyroClosingCTA ecom={isEcom} />
        <KyroFooter ecom={isEcom} />
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
