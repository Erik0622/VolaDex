export default function PortfolioPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="text-3xl font-semibold">Portfolio</h1>
      <p className="mt-2 text-white/60">Hier erscheint deine Portfolio-Übersicht sobald du eine Wallet verbunden hast.</p>
      <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6">
        <p className="text-sm text-white/60">No wallet connected.</p>
      </div>
    </div>
  );
}


