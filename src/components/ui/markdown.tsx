import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/cn";

/**
 * Long-form prose rendering for generated prompts, notes, and context packs.
 * Styles live here rather than a plugin so the type ramp stays in one system.
 */
export function Markdown({ children, className }: { children: string; className?: string }) {
  return (
    <div
      className={cn(
        "max-w-(--reading-max) text-body leading-(--leading-body) text-ink-100",
        "[&>*+*]:mt-4",
        "[&_h1]:text-title-1 [&_h1]:text-foreground",
        "[&_h2]:mt-8 [&_h2]:text-title-2 [&_h2]:text-foreground",
        "[&_h3]:mt-6 [&_h3]:text-title-3 [&_h3]:text-foreground",
        "[&_strong]:font-semibold [&_strong]:text-foreground",
        "[&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-5",
        "[&_ol]:list-decimal [&_ol]:space-y-1.5 [&_ol]:pl-5",
        "[&_li::marker]:text-ink-400",
        "[&_blockquote]:border-l-2 [&_blockquote]:border-cobalt-500/50 [&_blockquote]:pl-4 [&_blockquote]:text-muted",
        "[&_pre]:overflow-x-auto [&_pre]:rounded-xl [&_pre]:border [&_pre]:border-line-subtle [&_pre]:bg-well [&_pre]:p-4 [&_pre]:text-caption",
        "[&_:not(pre)>code]:rounded-md [&_:not(pre)>code]:border [&_:not(pre)>code]:border-line-subtle [&_:not(pre)>code]:bg-well [&_:not(pre)>code]:px-1.5 [&_:not(pre)>code]:py-0.5 [&_:not(pre)>code]:text-caption [&_:not(pre)>code]:text-gold-300",
        "[&_a]:text-cobalt-400 [&_a]:underline [&_a]:underline-offset-2 [&_a:hover]:text-cobalt-300",
        "[&_hr]:border-line",
        "[&_table]:block [&_table]:w-full [&_table]:overflow-x-auto [&_table]:text-caption",
        "[&_th]:border-b [&_th]:border-line [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_th]:text-foreground",
        "[&_td]:border-b [&_td]:border-line-subtle [&_td]:px-3 [&_td]:py-2 [&_td]:align-top",
        className,
      )}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        skipHtml
        components={{
          a: ({ children: c, href }) => (
            <a href={href} target="_blank" rel="noopener noreferrer">
              {c}
            </a>
          ),
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
