import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "Learn Morse — a calm way to pick up Morse code",
  description:
    "Learn Morse code one letter at a time, in English or Turkish, with real words instead of drills.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fbf1e9" },
    { media: "(prefers-color-scheme: dark)", color: "#221b16" },
  ],
};

// Applies the learner's saved palette/theme/language before first paint,
// so returning visitors don't see a flash of the default look.
const THEME_INIT_SCRIPT = `
(function() {
  try {
    var raw = localStorage.getItem('learnmorse:settings');
    if (!raw) return;
    var s = JSON.parse(raw);
    var root = document.documentElement;
    if (s.palette) root.setAttribute('data-palette', s.palette);
    if (s.language) root.lang = s.language;
    if (s.theme && s.theme !== 'auto') root.setAttribute('data-theme', s.theme);
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-palette="peach-pine">
      <body>
        <Script id="theme-init" strategy="beforeInteractive">
          {THEME_INIT_SCRIPT}
        </Script>
        {children}
      </body>
    </html>
  );
}
