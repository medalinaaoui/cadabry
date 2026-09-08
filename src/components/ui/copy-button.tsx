"use client";
import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { Button } from "./button";
export function CopyButton({text,label="Copy prompt"}:{text:string;label?:string}){const [copied,setCopied]=useState(false);return <Button type="button" variant="secondary" onClick={async()=>{try{await navigator.clipboard.writeText(text);setCopied(true);toast.success("Copied to clipboard");setTimeout(()=>setCopied(false),2000);}catch{toast.error("Clipboard unavailable. Select the text and copy it manually.");}}}>{copied?<Check size={16}/>:<Copy size={16}/>} {copied?"Copied":label}</Button>;}
