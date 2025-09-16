import type { PropsWithChildren } from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

export function AppLayout({ children }: PropsWithChildren) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
