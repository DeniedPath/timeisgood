import './globals.css'; // Import global styles

export const metadata = {
  title: 'Cool Countdown Timer',
  description: 'An advanced and interactive countdown timer built with Next.js',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children} {/* This will render the content of your page.js */}
      </body>
    </html>
  );
}