import type { Metadata, Viewport } from "next";
import { Fraunces, Instrument_Sans, JetBrains_Mono } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

/**
 * Three voices, one system:
 * · Fraunces — display voice: the wordmark, page titles, node names. The
 *   astronomer's atlas lettering.
 * · Instrument Sans — the UI voice: everything you read and click all day.
 * · JetBrains Mono — the chart-label voice: eyebrows, keycaps, metadata.
 */
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const instrument = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "Cadabry", template: "%s · Cadabry" },
  description: "Your universe of unfinished ideas becoming real software.",
  applicationName: "Cadabry",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#070b17" },
    { media: "(prefers-color-scheme: light)", color: "#f6f2e7" },
  ],
};

/**
 * Theme is applied before first paint so there is no flash of the wrong sky.
 * Stored preference wins; the brand default is the night sky. The `theme-ready`
 * class is added on first interaction so the theme *toggle* animates but the
 * initial render does not.
 */
const themeInit = `(function(){try{var t=localStorage.getItem("cadabry:theme");document.documentElement.dataset.theme=t==="light"?"light":"dark";}catch(e){document.documentElement.dataset.theme="dark";}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      data-theme="dark"
      suppressHydrationWarning
      className={`${fraunces.variable} ${instrument.variable} ${jetbrains.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
        <script
          dangerouslySetInnerHTML={{
            __html: `requestAnimationFrame(function(){document.documentElement.classList.add("theme-ready")});`,
          }}
        />
      </head>
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "var(--overlay)",
              border: "1px solid var(--line-strong)",
              color: "var(--foreground)",
              borderRadius: "var(--radius-md)",
              fontSize: "var(--text-caption)",
            },
          }}
        />
      </body>
    </html>
  );
}
