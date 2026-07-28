import './globals.css';

export const metadata = {
  title: 'FixMate | Reliable Home Services, Simplified',
  description: 'The complete ecosystem for modern home maintenance. Next.js, Node.js and Firebase application.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased bg-white text-slate-900">
        {children}
      </body>
    </html>
  );
}
