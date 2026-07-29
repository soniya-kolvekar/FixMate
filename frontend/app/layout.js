import './globals.css';

export const metadata = {
  title: 'FixMate | Reliable Home Services, Simplified',
  description: 'Connect with trusted, verified professionals for home repairs, plumbing, electrical, AC servicing, carpentry, painting, and appliance maintenance.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="font-sans antialiased bg-mintCream text-prussianBlue min-h-screen">
        {children}
      </body>
    </html>
  );
}
