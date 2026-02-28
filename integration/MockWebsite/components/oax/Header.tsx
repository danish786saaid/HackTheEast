"use client";

import Link from "next/link";
import { useState } from "react";

const NAV_LINKS = [
  { href: "/about", label: "About" },
  { href: "/resources", label: "Resources" },
  { href: "/grant-program", label: "Grant Program" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-oax-navy/10 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-oax-content items-center justify-between px-4 py-4 md:px-6">
        <Link
          href="/"
          className="text-xl font-semibold tracking-tight text-oax-navy"
        >
          OAX Foundation
        </Link>

        <nav className="hidden md:flex md:items-center md:gap-8">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-sm font-medium text-oax-navy hover:text-oax-accent"
            >
              {label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          className="md:hidden rounded p-2 text-oax-navy hover:bg-oax-cream"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          <span className="text-xl">{menuOpen ? "×" : "☰"}</span>
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-oax-navy/10 bg-white px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-3">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-oax-navy hover:text-oax-accent"
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
