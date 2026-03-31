import Link from "next/link";

const navLinks = [
  { label: "Projects", href: "#projects" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 flex w-full items-center justify-center px-4 py-4 animate-fade-in-nav">
      <nav className="glass-nav flex h-16 w-full max-w-175 items-center rounded-lg px-5">
        {/* Logo / Name */}
        <Link
          href="#hero"
          className="font-(family-name:--font-bricolage) text-lg font-semibold text-white tracking-tight"
        >
          Juliansyah
        </Link>

        {/* Nav Links — centered */}
        <div className="flex flex-1 items-center justify-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-base text-foreground transition-opacity hover:opacity-70"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Resume CTA — separate on right */}
        <Link
          href="#contact"
          className="flex h-9 items-center rounded-lg bg-white px-5 text-sm font-medium text-[#060703] transition-opacity hover:opacity-90"
        >
          Resume
        </Link>
      </nav>
    </header>
  );
}
