import { Link } from 'react-router-dom';
import { Github, Mail, Twitter } from 'lucide-react';

const footerLinks = [
  {
    title: 'Product',
    items: [
      { label: 'Terminal', href: '/trade' },
      { label: 'Analytics', href: '/#analytics' },
      { label: 'Roadmap', href: '/#roadmap' },
    ],
  },
  {
    title: 'Company',
    items: [
      { label: 'About', href: '/#about' },
      { label: 'Security', href: '/#security' },
      { label: 'Careers', href: '/#careers' },
    ],
  },
  {
    title: 'Resources',
    items: [
      { label: 'Documentation', href: '/#docs' },
      { label: 'Status', href: '/#status' },
      { label: 'API', href: '/#api' },
    ],
  },
];

const social = [
  { icon: Twitter, label: 'Twitter', href: 'https://twitter.com' },
  { icon: Github, label: 'GitHub', href: 'https://github.com' },
  { icon: Mail, label: 'Support', href: 'mailto:hello@voladex.io' },
];

export function Footer() {
  return (
    <footer className="relative border-t border-white/5 bg-black/40">
      <div className="absolute inset-x-0 top-0 mx-auto h-px w-4/5 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 lg:grid-cols-4">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 via-primary-600 to-accent-500 shadow-glow">
              <span className="text-lg font-black uppercase text-black">V</span>
            </div>
            <div>
              <p className="text-base font-semibold uppercase tracking-[0.35em] text-white/70">VolaDex</p>
              <p className="text-xs text-white/50">Institutional Solana Trading OS</p>
            </div>
          </div>
          <p className="max-w-sm text-sm text-white/60">
            Built for teams that demand instant execution, predictive analytics and a level of polish that feels like the future of
            decentralized trading.
          </p>
          <div className="flex items-center gap-3">
            {social.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white/70 transition hover:border-white/30 hover:text-white"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        {footerLinks.map((column) => (
          <div key={column.title} className="space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-[0.25em] text-white/60">{column.title}</h4>
            <ul className="space-y-3 text-sm text-white/60">
              {column.items.map((item) => (
                <li key={item.label}>
                  <Link to={item.href} className="transition hover:text-white">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-white/5 bg-black/20">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-6 text-xs text-white/40 sm:flex-row">
          <p>© {new Date().getFullYear()} VolaDex Labs. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link to="/#privacy" className="transition hover:text-white/80">
              Privacy
            </Link>
            <Link to="/#terms" className="transition hover:text-white/80">
              Terms
            </Link>
            <Link to="/#status" className="transition hover:text-white/80">
              System status
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
