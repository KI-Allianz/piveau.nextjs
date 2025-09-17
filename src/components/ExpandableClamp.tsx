"use client";

import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/hooks/useLocale";

interface ExpandableClampProps {
  children: ReactNode;

  // Height when collapsed (in px). Default: 320
  collapsedHeight?: number;
  gradientName?: string;

  // Initially expanded. Default: false
  defaultExpanded?: boolean;

  // Callback when user toggles
  onToggle?: (expanded: boolean) => void;
}

export function ExpandableClamp({
  children,
  collapsedHeight = 320,
  defaultExpanded = false,
  onToggle,
  gradientName = "from-neutral-50 dark:from-neutral-950"
}: ExpandableClampProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [canExpand, setCanExpand] = useState(false);
  const [contentHeight, setContentHeight] = useState<number>(0);
  const { translations } = useLocale();

  const containerRef = useRef<HTMLDivElement | null>(null);

  // Measure full content height and whether we need clamping
  const measure = useMemo(
    () => () => {
      const el = containerRef.current;
      if (!el) return;
      // Temporarily unset maxHeight to measure full scrollHeight accurately
      const prevMax = el.style.maxHeight;
      el.style.maxHeight = "none";
      const full = el.scrollHeight;
      el.style.maxHeight = prevMax;

      setContentHeight(full);
      setCanExpand(full > collapsedHeight + 8); // tolerance
    },
    [collapsedHeight],
  );

  // First measurement after mount and whenever children change
  useLayoutEffect(() => {
    measure();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [children]);

  // Keep in sync on content/layout changes
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const ro = new ResizeObserver(() => measure());
    ro.observe(el);
    return () => ro.disconnect();
  }, [measure]);

  // Update parent when toggled
  useEffect(() => {
    onToggle?.(expanded);
  }, [expanded, onToggle]);

  const toggle = () => setExpanded((v) => !v);

  // Styles for the content wrapper: animate between measured heights
  const maxHeight = expanded
    ? Math.max(contentHeight, collapsedHeight)
    : collapsedHeight;

  return (
    <div className={["relative"].filter(Boolean).join(" ")}>
      <div
        id="expandable-clamp"
        ref={containerRef}
        style={{
          maxHeight,
          overflow: "hidden",
          transition: "max-height 300ms ease-in-out",
        }}
      >
        {children}
      </div>

      {!expanded && canExpand && (
        <div
          aria-hidden="true"
          className={[
            // Default gradient; adjust to your design system
            `pointer-events-none absolute inset-x-0 bottom-0 h-16`,
            `bg-gradient-to-t to-transparent ${gradientName}`,
          ]
            .filter(Boolean)
            .join(" ")}
        />
      )}

      {canExpand &&
        (expanded ? (
          <div className="mt-2 flex justify-end">
            <Button onClick={toggle} variant={"outline"} className={"z-10"}>
              {expanded ? translations.expand.less : translations.expand.more}
            </Button>
          </div>
        ) : (
          <div className="bottom-0 right-2 absolute flex justify-end">
            <Button onClick={toggle} variant={"outline"} className={""}>
              {expanded ? translations.expand.less : translations.expand.more}
            </Button>
          </div>
        ))}
    </div>
  );
}
