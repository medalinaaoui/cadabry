import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";
export const metadata: Metadata = { title: {default:"Cadabry",template:"%s · Cadabry"}, description:"Your external brain for building software with AI." };
export default function RootLayout({children}:{children:React.ReactNode}) { return <html lang="en"><body><a className="skip-link" href="#main">Skip to content</a>{children}<Toaster richColors theme="dark" /></body></html>; }
