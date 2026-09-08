"use client";

import { useEffect, useRef, useState } from "react";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { Button, type ButtonProps } from "./button";

/**
 * Copy-to-clipboard with an inline confirmation. The label change is the
 * feedback; the toast is the fallback for people not looking at the button.
 */
export function CopyButton({
  text,
  label = "Copy",
  variant = "secondary",
  size = "md",
  className,
}: {
  text: string;
  label?: string;
  variant?: ButtonProps["variant"];
  size?: ButtonProps["size"];
  className?: string;
}) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success("Copied to clipboard");
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Clipboard unavailable — select the text and copy it manually.");
    }
  }

  return (
    <Button variant={variant} size={size} onClick={copy} className={className}>
      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      {copied ? "Copied" : label}
    </Button>
  );
}
