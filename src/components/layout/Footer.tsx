import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-brown-dark text-cream/80">
      {/* Decorative top border */}
      <div className="h-px bg-gradient-to-r from-transparent via-golden/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <h3 className="font-serif text-2xl text-cream mb-4">
              Naturally{" "}
              <span className="italic text-golden">Leavened</span>
            </h3>
            <p className="text-sm leading-relaxed text-cream/60 max-w-xs">
              Handcrafted sourdough made with love, patience, and a little bit
              of science. Because bread should be simple and beautiful.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-[11px] tracking-[0.25em] uppercase text-golden mb-6">
              Explore
            </h4>
            <nav className="flex flex-col gap-3">
              {[
                { href: "/about", label: "About Haylee" },
                { href: "/classes", label: "Sourdough Classes" },
                { href: "/recipes", label: "Recipes" },
                { href: "/calculator", label: "Dough Calculator" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-cream/60 hover:text-golden transition-colors duration-300"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-[11px] tracking-[0.25em] uppercase text-golden mb-6">
              Get In Touch
            </h4>
            <p className="text-sm text-cream/60 mb-2">
              Ready to start your sourdough journey?
            </p>
            <p className="text-sm text-cream/60 mb-6">
              Text us to sign up for a class.
            </p>
            <a
              href="sms:+15551234567"
              className="inline-flex items-center gap-2 px-5 py-2.5 border border-golden/40 text-golden text-sm tracking-wider uppercase hover:bg-golden/10 transition-all duration-300 rounded-full"
            >
              <span>Text to Sign Up</span>
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
                />
              </svg>
            </a>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-cream/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-cream/40">
            &copy; {new Date().getFullYear()} Naturally Leavened. Made with
            flour, water, salt &amp; time.
          </p>
          <div className="flex items-center gap-1 text-xs text-cream/30">
            <span>Baked with</span>
            <svg
              className="w-3 h-3 text-golden/60"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            <span>by Haylee</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
