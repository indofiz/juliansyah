"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { Menu, X, ArrowUpRight } from "lucide-react";

const navLinks = [
  { label: "Projects", href: "/projects" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const headerRef = useRef<HTMLElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!headerRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from(headerRef.current, {
        y: -60,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      });
    });

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!mobileMenuRef.current) return;
    const items = mobileMenuRef.current.querySelectorAll("[data-menu-item]");

    if (isOpen) {
      gsap.fromTo(
        mobileMenuRef.current,
        { height: 0, opacity: 0 },
        { height: "auto", opacity: 1, duration: 0.3, ease: "power2.out" }
      );
      gsap.fromTo(
        items,
        { x: -20, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.3, ease: "power2.out", stagger: 0.05, delay: 0.1 }
      );
    } else {
      gsap.to(mobileMenuRef.current, {
        height: 0,
        opacity: 0,
        duration: 0.2,
        ease: "power2.in",
      });
    }
  }, [isOpen]);

  const closeMenu = () => setIsOpen(false);

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-50 flex w-full items-center justify-center px-4 py-4"
    >
      <div className="w-full max-w-175">
        <nav className="flex h-16 w-full items-center rounded-lg px-4 border border-white/10 bg-black/40 backdrop-blur-xl">
          {/* Logo / Name */}
          <Link href="/">
            <span className="md:hidden font-(family-name:--font-dancing) text-2xl font-bold text-white">Juliansyah</span>
            <Image src="/LOGO.png" alt="Juliansyah" width={32} height={32} className="hidden md:block w-8 h-8" />
          </Link>

          {/* Nav Links — desktop */}
          <div className="hidden md:flex flex-1 items-center justify-center gap-8">
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

          {/* Resume CTA — desktop */}
          <Link
            href="/contact"
            className="hidden md:flex h-9 items-center rounded-lg bg-white px-5 text-sm font-medium text-[#060703] transition-opacity hover:opacity-90"
          >
            Resume
          </Link>

          {/* Hamburger — mobile */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="ml-auto md:hidden flex items-center justify-center text-white"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>

        {/* Mobile menu */}
        <div
          ref={mobileMenuRef}
          className="md:hidden overflow-hidden mt-2 rounded-xl border border-white/10 bg-black/60 backdrop-blur-xl"
          style={{ height: 0, opacity: 0 }}
        >
          <div className="flex flex-col p-3">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                data-menu-item
                href={link.href}
                onClick={closeMenu}
                className="group flex items-center justify-between rounded-lg px-4 py-3.5 text-base text-foreground transition-colors hover:bg-white/5"
              >
                {link.label}
                <ArrowUpRight size={16} className="text-gray-text opacity-0 transition-opacity group-hover:opacity-100" />
              </Link>
            ))}
            <div className="mx-3 my-2 h-px bg-white/10" />
            <Link
              data-menu-item
              href="/contact"
              onClick={closeMenu}
              className="flex h-11 items-center justify-center rounded-lg bg-white mx-1 text-sm font-medium text-[#060703] transition-opacity hover:opacity-90"
            >
              Resume
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
