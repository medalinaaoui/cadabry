import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";
import { cn } from "@/lib/cn";

const control =
  "w-full rounded-xl border border-line bg-well px-3.5 text-body text-foreground " +
  "placeholder:text-ink-300 transition-colors duration-(--duration-fast) " +
  "hover:border-line-strong focus:border-accent focus:outline-none " +
  "focus-visible:outline-none aria-[invalid=true]:border-danger " +
  "disabled:opacity-50";

const inputHeight = "h-11";

type FieldShellProps = {
  label: string;
  hint?: string;
  error?: string;
  htmlFor?: string;
  /** Hide the visual label but keep it for screen readers. */
  labelHidden?: boolean;
  children: ReactNode;
  className?: string;
};

/** Label + control + hint/error, wired together with the right aria plumbing. */
export function FieldShell({
  label,
  hint,
  error,
  htmlFor,
  labelHidden,
  children,
  className,
}: FieldShellProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <label
        className={cn(
          "block text-caption font-semibold text-ink-100",
          labelHidden && "sr-only",
        )}
        htmlFor={htmlFor}
      >
        {label}
      </label>
      {children}
      {error ? (
        <p id={htmlFor ? `${htmlFor}-error` : undefined} className="text-caption text-danger">
          {error}
        </p>
      ) : hint ? (
        <p id={htmlFor ? `${htmlFor}-hint` : undefined} className="text-caption text-subtle">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

function describedBy(id: string | undefined, hint?: string, error?: string) {
  if (!id) return undefined;
  if (error) return `${id}-error`;
  if (hint) return `${id}-hint`;
  return undefined;
}

export type FieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  hint?: string;
  error?: string;
  labelHidden?: boolean;
  wrapperClassName?: string;
};

export function Field({
  label,
  hint,
  error,
  labelHidden,
  wrapperClassName,
  className,
  ...props
}: FieldProps) {
  const id = props.id ?? props.name;
  return (
    <FieldShell
      label={label}
      hint={hint}
      error={error}
      htmlFor={id}
      labelHidden={labelHidden}
      className={wrapperClassName}
    >
      <input
        {...props}
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        className={cn(control, inputHeight, className)}
      />
    </FieldShell>
  );
}

export type TextFieldProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  hint?: string;
  error?: string;
  labelHidden?: boolean;
  wrapperClassName?: string;
};

export function TextField({
  label,
  hint,
  error,
  labelHidden,
  wrapperClassName,
  className,
  rows = 5,
  ...props
}: TextFieldProps) {
  const id = props.id ?? props.name;
  return (
    <FieldShell
      label={label}
      hint={hint}
      error={error}
      htmlFor={id}
      labelHidden={labelHidden}
      className={wrapperClassName}
    >
      <textarea
        {...props}
        id={id}
        rows={rows}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        className={cn(control, "resize-y py-2.5 leading-(--leading-body)", className)}
      />
    </FieldShell>
  );
}

export type SelectFieldProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  hint?: string;
  error?: string;
  labelHidden?: boolean;
  wrapperClassName?: string;
};

/**
 * Native select. Deliberate: OS pickers beat custom listboxes for long,
 * keyboard-driven enum lists, and they cost nothing on mobile.
 */
export function SelectField({
  label,
  hint,
  error,
  labelHidden,
  wrapperClassName,
  className,
  children,
  ...props
}: SelectFieldProps) {
  const id = props.id ?? props.name;
  return (
    <FieldShell
      label={label}
      hint={hint}
      error={error}
      htmlFor={id}
      labelHidden={labelHidden}
      className={wrapperClassName}
    >
      <select
        {...props}
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        className={cn(control, inputHeight, "appearance-none pr-9", className)}
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8' fill='none'><path d='M1 1.5 6 6.5 11 1.5' stroke='%239eabc4' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round'/></svg>\")",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 0.85rem center",
        }}
      >
        {children}
      </select>
    </FieldShell>
  );
}

/** Bare input for toolbars and search bars where the label lives elsewhere. */
export function BareInput({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cn(control, inputHeight, className)} />;
}
