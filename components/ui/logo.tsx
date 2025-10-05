
// components/Logo.tsx
import Link from "next/link";
import { Music3 } from "lucide-react";
import React from "react";

type LogoProps = {
  /**
   * Show text wordmark next to the icon.
   * Set false for mark-only (icon-only).
   */
  showWordmark?: boolean;
  /**
   * Size in pixels applied to the icon (height/width).
   */
  size?: number;
  /**
   * Optional text to render; defaults to brand.
   */
  text?: string;
  /**
   * Optional href to wrap the logo in a link.
   * Omit to render a non-link div.
   */
  href?: string;
  /**
   * Extra classes for outer wrapper.
   */
  className?: string;
};

export default function Logo({
  showWordmark = true,
  size = 22,
  text = "The Beat Deck",
  href = "/",
  className = "",
}: LogoProps) {
  const Wrapper = href ? Link : FakeLink;
  return (
    <Wrapper
      href={href as string}
      className={[
        "inline-flex items-center gap-2 select-none",
        "rounded-md",
        "text-neutral-900",
        "no-underline",
        className,
      ].join(" ")}
      aria-label={text}
      title={text}
    >
      {/* Icon mark */}
      <span
        className="relative inline-grid place-items-center rounded-md"
        style={{
          width: size + 10,
          height: size + 10,
        }}
      >
        {/* soft background blob */}
        <span className="absolute inset-0 rounded-md bg-gradient-to-br from-purple-500/15 to-amber-400/15" />
        {/* crisp foreground circle */}
        <span className="absolute inset-1 rounded-md bg-white shadow-[inset_0_0_0_1px_rgba(0,0,0,0.06)]" />
        {/* music note */}
        <Music3
          aria-hidden
          style={{ width: size, height: size }}
          className="relative"
        />
      </span>

      {/* Wordmark */}
      {showWordmark && (
        <span className="leading-none">
          <span className="block text-sm font-semibold tracking-tight">
            {text}
          </span>
          <span className="block text-[10px] uppercase tracking-[0.14em] text-neutral-500">
            Beats • Share • Play
          </span>
        </span>
      )}
    </Wrapper>
  );
}

/** Tiny wrapper so we can write Link-or-div without client hooks. */
function FakeLink({
  children,
  className,
  href, // eslint-disable-line @typescript-eslint/no-unused-vars
  ...rest
}: React.HTMLAttributes<HTMLDivElement> & { href?: string }) {
  return (
    <div className={className} {...rest}>
      {children}
    </div>
  );
}