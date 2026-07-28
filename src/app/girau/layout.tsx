import type { Metadata } from 'next';
import '../globals.css';

export const metadata: Metadata = {
  title: 'Girau International School — E-Learning Platform',
  description: 'Girau International School E-Learning Platform. Learn, Live, Achieve.',
};

export default function GirauLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="min-h-screen bg-[#fafafa] text-slate-800"
      style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}
    >
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap"
        rel="stylesheet"
      />
      {children}
    </div>
  );
}
