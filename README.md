# VolaDex – Solana Trading Terminal (Showcase)

VolaDex is a concept-level, premium Solana trading terminal and landing experience inspired by best-in-class execution platforms. The
project focuses on cinematic UI, ultra-polished interactions and data visualisations that highlight what a next-generation Solana
workstation could feel like. **Trading actions are intentionally disabled – the experience is read-only for demonstration purposes.**

## ✨ Highlights

- **Immersive landing page** with hero animations, feature storytelling and live-looking market intelligence.
- **Trading terminal mock** featuring a responsive grid layout, candlestick analytics, order book depth, trade tape and automation cockpit.
- **Data integration-ready** hooks for Birdeye (OHLCV), Helius and Pump.fun feeds with graceful fallbacks to rich simulated datasets.
- **Tailored Solana market set** with category filters, execution confidence gauges and risk simulation controls.
- **Dark, glassmorphic visual language** powered by Tailwind CSS, custom gradients and the Lightweight Charts library.

## 🛠️ Tech stack

- [Vite](https://vitejs.dev/) + React 18 + TypeScript
- [Tailwind CSS](https://tailwindcss.com/) for design system and utility styling
- [TanStack Query](https://tanstack.com/query/latest) for data fetching and caching
- [Lightweight Charts](https://tradingview.github.io/lightweight-charts/) for institutional-grade candlesticks
- [Framer Motion](https://www.framer.com/motion/) & [Lucide Icons](https://lucide.dev/) for motion and iconography

## 🚀 Getting started

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Configure environment variables**

   Duplicate `.env.example` → `.env` and fill any keys you want to use. All values are optional – without them the UI falls back to
   simulated market data.

   ```bash
   cp .env.example .env
   # edit .env and provide your API keys
   ```

   | Variable               | Description                                               |
   | ---------------------- | --------------------------------------------------------- |
   | `VITE_BIRDEYE_API_KEY` | Enables live OHLCV + price data from the Birdeye API.     |
   | `VITE_HELIUS_API_KEY`  | Reserved for wallet / smart money overlays (future use).  |
   | `VITE_PUMPFUN_API_KEY` | Enables memecoin radar integrations (future use).         |

3. **Run the dev server**

   ```bash
   npm run dev
   ```

   The application starts on `http://localhost:5173`. The landing page links to the trading terminal at `/trade`.

4. **Available scripts**

   | Script        | Description                         |
   | ------------- | ----------------------------------- |
   | `npm run dev` | Start the Vite development server.  |
   | `npm run build` | Type-check and produce a production build. |
   | `npm run preview` | Preview the production build locally. |
   | `npm run lint` | Run ESLint on the entire project.   |

## 📡 Data model & fallbacks

- `usePriceData` attempts to fetch OHLCV from Birdeye using the provided API key. If the request fails or no key is supplied, curated
  simulated candles are served so charts remain populated.
- Order book depth, trade tape, automation hints and risk simulator leverage handcrafted data designed to mimic institutional dashboards.
- The trading experience is non-interactive by design: buttons, toggles and sliders illustrate UX flows without triggering on-chain
  actions.

## 🧭 Project structure

```
src/
  components/
    chart/            // Reusable chart primitives
    layout/           // Navbar, footer, layout shell
    trading/          // Terminal-specific panels (order book, metrics, etc.)
    ui/               // Shared UI building blocks
  data/               // Sample market, candle and orderbook data
  hooks/              // Data fetching hooks with API integration points
  pages/              // Landing and trading terminal screens
  styles/             // Tailwind global styles
  lib/                // Formatting helpers, env utilities
```

## ⚠️ Disclaimer

This repository is a **visual and UX showcase**. It does not place, sign or simulate real Solana transactions. Any API integrations are
read-only and optional. Use the codebase as inspiration for high-end trading surfaces or extend it with your own backend / execution
layer.

---

Crafted with a relentless focus on detail – VolaDex imagines what the future Solana trading OS could look like.
