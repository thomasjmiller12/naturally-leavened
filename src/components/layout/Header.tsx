"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { href: "/about", label: "About" },
  { href: "/classes", label: "Classes" },
  { href: "/recipes", label: "Recipes" },
  { href: "/calculator", label: "Calculator" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
        scrolled
          ? "bg-cream/95 backdrop-blur-md shadow-[0_1px_0_rgba(212,163,115,0.2)] py-3"
          : "bg-transparent py-5"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between">
        {/* Logo / Brand */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-10 h-10 rounded-full overflow-hidden transition-transform duration-300 group-hover:scale-105">
            <Image
              src="/images/logo.jpg"
              alt="Naturally Leavened"
              fill
              className="object-cover"
              sizes="40px"
              priority
            />
          </div>
          <div className="hidden sm:block">
            <span className="font-serif text-xl tracking-wide text-brown-dark">
              Naturally{" "}
            </span>
            <span className="font-serif text-xl italic text-golden-dark">
              Leavened
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="relative text-[13px] tracking-[0.2em] uppercase text-brown-light hover:text-brown-dark transition-colors duration-300 group"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-golden transition-all duration-500 ease-out group-hover:w-full" />
            </Link>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden relative z-50 flex flex-col justify-center items-center w-10 h-10"
          aria-label="Toggle menu"
        >
          <motion.span
            animate={
              mobileOpen
                ? { rotate: 45, y: 0, width: 24 }
                : { rotate: 0, y: -4, width: 24 }
            }
            transition={{ duration: 0.3 }}
            className="block h-[1.5px] bg-brown-dark absolute"
          />
          <motion.span
            animate={mobileOpen ? { opacity: 0, width: 0 } : { opacity: 1, width: 16 }}
            transition={{ duration: 0.2 }}
            className="block h-[1.5px] bg-brown-dark absolute"
          />
          <motion.span
            animate={
              mobileOpen
                ? { rotate: -45, y: 0, width: 24 }
                : { rotate: 0, y: 4, width: 20 }
            }
            transition={{ duration: 0.3 }}
            className="block h-[1.5px] bg-brown-dark absolute"
          />
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-40 bg-cream/98 backdrop-blur-lg md:hidden"
          >
            <div className="flex flex-col items-center justify-center h-full gap-10">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: i * 0.1, duration: 0.4 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="text-3xl font-serif text-brown-dark hover:text-golden transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
