import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

/**
 * system-ui already resolves to SF Pro on Apple platforms, which is where the
 * type ramp was tuned. Inter is loaded as the cross-platform stand-in and sits
 * behind system-ui in the font stack (see --font-sans).
 */
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "Cadabry", template: "%s · Cadabry" },
  description: "Your universe of unfinished ideas becoming real software.",
  applicationName: "Cadabry",
};

export const viewport: Viewport = {
  themeColor: "#080e1f",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        {children}
        <Toaster
          theme="dark"
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
