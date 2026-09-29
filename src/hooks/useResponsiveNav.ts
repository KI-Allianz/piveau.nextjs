import { useState, useRef, useEffect } from "react";
import { AUTH_DISABLED } from "@/lib/auth-config";

export function useResponsiveNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const leftSectionRef = useRef<HTMLDivElement>(null);
  const navLinksRef = useRef<HTMLDivElement>(null);
  const userSectionRef = useRef<HTMLDivElement>(null);

  const navLinksWidthRef = useRef<number>(0);
  const userSectionWidthRef = useRef<number>(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const availableWidth = entry.contentRect.width;

        const newNavWidth = navLinksRef.current?.offsetWidth;
        if (newNavWidth && newNavWidth > 0) {
          navLinksWidthRef.current = newNavWidth;
        }

        const newUserWidth = userSectionRef.current?.offsetWidth;
        if (newUserWidth && newUserWidth > 0) {
          userSectionWidthRef.current = newUserWidth;
        }

        const logoWidth = leftSectionRef.current?.offsetWidth ?? 0;
        const navWidth = navLinksWidthRef.current || newNavWidth || 0;
        const userSectionWidth =
          userSectionWidthRef.current || newUserWidth || 0;

        const totalRequiredWidth =
          logoWidth + navWidth + (AUTH_DISABLED ? 0 : userSectionWidth) + 60;

        setIsMobile(availableWidth < totalRequiredWidth);
      }
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  return {
    isOpen,
    setIsOpen,
    isMobile,
    containerRef,
    leftSectionRef,
    navLinksRef,
    userSectionRef,
  };
}
