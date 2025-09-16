import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X, Zap } from 'lucide-react';
import clsx from 'clsx';

const navItems = [
  { label: 'Discover', to: '/' },
  { label: 'Terminal', to: '/trade' },
  { label: 'Insights', to: '/#insights' },
  { label: 'Docs', to: '/#docs' },
];

const activeClasses = 'text-white';

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-6">
        <Link to="/" className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 via-primary-600 to-accent-500 shadow-glow">
            <Zap className="h-6 w-6" />
          </span>
          <div>
            <p className="text-lg font-semibold tracking-wide">VolaDex</p>
            <p className="text-xs font-semibold uppercase text-accent-400 tracking-[0.3em]">Solana Terminal</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-10 text-sm font-medium text-white/70 lg:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                clsx('transition hover:text-white', isActive && activeClasses)
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <button className="rounded-full border border-white/10 px-4 py-2 text-sm font-medium text-white/80 transition hover:border-white/20 hover:text-white">
            Book demo
          </button>
          <Link
            to="/trade"
            className="rounded-full bg-gradient-to-r from-primary-500 via-primary-400 to-accent-500 px-4 py-2 text-sm font-semibold text-black shadow-glow transition hover:scale-[1.02]"
          >
            Launch terminal
          </Link>
        </div>

        <button
          className="flex items-center justify-center rounded-xl border border-white/10 p-2 text-white/80 lg:hidden"
          onClick={() => setOpen((prev) => !prev)}
          aria-label="Toggle navigation"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <div
        className={clsx(
          'lg:hidden',
          'border-t border-white/5 bg-black/70 backdrop-blur-xl transition-all duration-300',
          open ? 'max-h-96 opacity-100' : 'max-h-0 overflow-hidden opacity-0',
        )}
      >
        <nav className="flex flex-col gap-4 px-6 py-6 text-sm font-medium text-white/70">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                clsx('rounded-xl px-4 py-3 transition hover:bg-white/5 hover:text-white', isActive && 'bg-white/10 text-white')
              }
            >
              {item.label}
            </NavLink>
          ))}
          <div className="mt-2 flex flex-col gap-3">
            <button className="rounded-xl border border-white/10 px-4 py-3 text-sm font-medium text-white/80 transition hover:border-white/20 hover:text-white">
              Book demo
            </button>
            <Link
              to="/trade"
              onClick={() => setOpen(false)}
              className="rounded-xl bg-gradient-to-r from-primary-500 via-primary-400 to-accent-500 px-4 py-3 text-center text-sm font-semibold text-black shadow-glow transition hover:scale-[1.02]"
            >
              Launch terminal
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
