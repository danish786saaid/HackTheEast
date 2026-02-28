import Link from "next/link";

const FOOTER_LINKS = [
  { href: "/about", label: "About" },
  { href: "/resources", label: "Resources" },
  { href: "/grant-program", label: "Grant Program" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
  { href: "https://www.oax.org/privacy", label: "Privacy Policy", external: true },
];

export function Footer() {
  return (
    <footer className="border-t border-oax-navy/10 bg-oax-cream">
      <div className="mx-auto max-w-oax-content px-4 py-12 md:px-6">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div>
            <Link
              href="/"
              className="text-lg font-semibold text-oax-navy"
            >
              OAX Foundation
            </Link>
            <p className="mt-2 max-w-sm text-sm text-oax-gray-muted">
              Pioneering a decentralized future with AI powered trust and
              compliance.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-oax-navy">
              Connect with us
            </h3>
            <p className="mt-2 text-sm text-oax-gray-muted">
              <a
                href="mailto:info@oax.org"
                className="text-oax-accent hover:text-oax-navy"
              >
                info@oax.org
              </a>
            </p>
            <ul className="mt-4 flex flex-wrap gap-4">
              {FOOTER_LINKS.filter((l) => !l.external).map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-oax-gray-muted hover:text-oax-navy"
                  >
                    {label}
                  </Link>
                </li>
              ))}
              {FOOTER_LINKS.filter((l) => l.external).map(({ href, label }) => (
                <li key={href}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-oax-gray-muted hover:text-oax-navy"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <p className="mt-8 border-t border-oax-navy/10 pt-8 text-center text-xs text-oax-gray-muted">
          © {new Date().getFullYear()} OAX Foundation. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
