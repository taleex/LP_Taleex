import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export interface SectionConfig {
  id: string;
  label: string;
}

const DEFAULT_SECTIONS: SectionConfig[] = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "contact", label: "Contact" },
];

const SCROLL_DELAY = 900;
const MIN_WHEEL_DELTA = 28;
const MIN_SWIPE_DELTA = 60;
const SECTION_BOUNDARY_THRESHOLD = 48;

const isElementScrollable = (element: HTMLElement | null) => {
  if (!element) return false;
  let current: HTMLElement | null = element;

  while (current && current !== document.body) {
    const style = window.getComputedStyle(current);
    const overflowY = style.overflowY;
    const canScroll =
      (overflowY === "auto" || overflowY === "scroll") &&
      current.scrollHeight > current.clientHeight;

    if (canScroll) {
      return true;
    }

    current = current.parentElement;
  }

  return false;
};

export const SectionNavigator = ({
  sections = DEFAULT_SECTIONS,
}: {
  sections?: SectionConfig[];
}) => {
  const [activeId, setActiveId] = useState<string>(sections[0]?.id ?? "");
  const isAnimatingRef = useRef(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const prefersReducedMotionRef = useRef(false);
  const touchStartYRef = useRef<number | null>(null);
  const sectionIds = useMemo(() => sections.map((section) => section.id), [sections]);

  const scrollToSection = useCallback((id: string) => {
    const element = document.getElementById(id);
    if (!element) return;

    isAnimatingRef.current = true;
    element.scrollIntoView({ behavior: "smooth", block: "start" });

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      isAnimatingRef.current = false;
    }, SCROLL_DELAY);
  }, []);

  const canMoveBetweenSections = useCallback(
    (direction: "next" | "prev") => {
      const currentIndex = sectionIds.indexOf(activeId);
      if (currentIndex === -1) return false;
      if (direction === "next" && currentIndex >= sectionIds.length - 1) {
        return false;
      }
      if (direction === "prev" && currentIndex <= 0) {
        return false;
      }

      const section = document.getElementById(activeId);
      if (!section) return false;

      const rect = section.getBoundingClientRect();

      if (direction === "next") {
        return rect.bottom <= window.innerHeight + SECTION_BOUNDARY_THRESHOLD;
      }

      if (direction === "prev") {
        return rect.top >= -SECTION_BOUNDARY_THRESHOLD;
      }

      return true;
    },
    [activeId, sectionIds]
  );

  const moveTo = useCallback(
    (direction: "next" | "prev") => {
      const currentIndex = sectionIds.indexOf(activeId);
      if (currentIndex === -1) return false;

      const nextIndex =
        direction === "next"
          ? Math.min(sectionIds.length - 1, currentIndex + 1)
          : Math.max(0, currentIndex - 1);

      if (nextIndex === currentIndex) return false;
      scrollToSection(sectionIds[nextIndex]);
      return true;
    },
    [activeId, sectionIds, scrollToSection]
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    prefersReducedMotionRef.current = mediaQuery.matches;

    const handleChange = (event: MediaQueryListEvent) => {
      prefersReducedMotionRef.current = event.matches;
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("id");
            if (id) {
              setActiveId(id);
            }
          }
        });
      },
      {
        threshold: 0.4,
        rootMargin: "0px 0px -10% 0px",
      }
    );

    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
      observer.disconnect();
    };
  }, [sectionIds]);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    if (!sectionIds.length) return undefined;

    const shouldHandleEvent = (eventTarget: EventTarget | null) => {
      if (!(eventTarget instanceof HTMLElement)) return true;
      return !isElementScrollable(eventTarget);
    };

    const handleWheel = (event: WheelEvent) => {
      if (prefersReducedMotionRef.current) return;
      if (!shouldHandleEvent(event.target)) return;
      if (Math.abs(event.deltaY) < MIN_WHEEL_DELTA) return;

      const direction = event.deltaY > 0 ? "next" : "prev";
      if (!canMoveBetweenSections(direction)) return;
      if (window.innerWidth < 1024) return;
      if (isAnimatingRef.current) return;

      const moved = moveTo(direction);
      if (moved) {
        event.preventDefault();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (["ArrowDown", "PageDown"].includes(event.key)) {
        if (!canMoveBetweenSections("next")) return;
        const moved = moveTo("next");
        if (moved) {
          event.preventDefault();
        }
      }
      if (["ArrowUp", "PageUp"].includes(event.key)) {
        if (!canMoveBetweenSections("prev")) return;
        const moved = moveTo("prev");
        if (moved) {
          event.preventDefault();
        }
      }
    };

    const handleTouchStart = (event: TouchEvent) => {
      if (prefersReducedMotionRef.current) return;
      if (event.touches.length !== 1) return;
      touchStartYRef.current = event.touches[0]?.clientY ?? null;
    };

    const handleTouchEnd = (event: TouchEvent) => {
      if (prefersReducedMotionRef.current) return;
      if (touchStartYRef.current === null) return;
      if (!shouldHandleEvent(event.target)) {
        touchStartYRef.current = null;
        return;
      }

      const endY = event.changedTouches[0]?.clientY ?? touchStartYRef.current;
      const delta = touchStartYRef.current - endY;
      touchStartYRef.current = null;

      if (Math.abs(delta) < MIN_SWIPE_DELTA) return;

      const direction = delta > 0 ? "next" : "prev";
      if (!canMoveBetweenSections(direction)) return;
      if (isAnimatingRef.current) return;

      moveTo(direction);
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [canMoveBetweenSections, moveTo]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  if (sections.length <= 1) return null;

  return (
    <div className="fixed right-6 top-1/2 z-30 hidden -translate-y-1/2 flex-col items-center gap-3 lg:flex">
      <div className="flex flex-col gap-3 rounded-full bg-background/60 p-3 shadow-lg shadow-background/40 backdrop-blur">
        {sections.map((section) => {
          const isActive = activeId === section.id;
          return (
            <button
              key={section.id}
              type="button"
              onClick={() => scrollToSection(section.id)}
              className={cn(
                "relative h-3 w-3 rounded-full border transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60",
                isActive
                  ? "h-4 w-4 border-primary bg-primary shadow-[0_0_12px_rgba(59,130,246,0.6)]"
                  : "border-border/60 bg-background/80 hover:border-primary/70"
              )}
              aria-label={`Go to ${section.label}`}
            >
              <span className="sr-only">{section.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SectionNavigator;
