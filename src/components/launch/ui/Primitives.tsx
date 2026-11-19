import type { ReactNode } from "react";
import { AlertCircle, FlaskConical } from "lucide-react";

export const inputClass =
  "w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-950 outline-none transition-colors focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-[#0e121b] dark:text-white";
export const primaryClass =
  "inline-flex min-h-11 items-center justify-center rounded-xl bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-500 dark:bg-white dark:text-slate-950 dark:hover:bg-emerald-300";
export const secondaryClass =
  "inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold transition-colors hover:border-emerald-500 dark:border-slate-700 dark:bg-[#131722]";

export function Page({
  eyebrow,
  title,
  description,
  actions,
  children,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-10">
      <div className="mb-9 flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div className="max-w-3xl">
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400">
            {eyebrow}
          </p>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            {title}
          </h1>
          {description && (
            <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-400">
              {description}
            </p>
          )}
        </div>
        {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
      </div>
      {children}
    </div>
  );
}

export function Panel({
  title,
  description,
  action,
  children,
  className = "",
}: {
  title?: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-2xl border border-slate-300 bg-white p-5 dark:border-slate-700 dark:bg-[#131722] sm:p-6 ${className}`}
    >
      {(title || action) && (
        <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
          <div>
            {title && <h2 className="text-lg font-semibold">{title}</h2>}
            {description && (
              <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-400">
                {description}
              </p>
            )}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

export function Badge({
  children,
  tone = "slate",
}: {
  children: ReactNode;
  tone?: "slate" | "green" | "amber" | "blue";
}) {
  const colors = {
    slate:
      "border-slate-300 bg-slate-100 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300",
    green:
      "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
    amber:
      "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300",
    blue: "border-sky-500/30 bg-sky-500/10 text-sky-700 dark:text-sky-300",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${colors[tone]}`}
    >
      {children}
    </span>
  );
}

export function Metric({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail?: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-[#0e121b]">
      <p className="text-sm text-slate-600 dark:text-slate-400">{label}</p>
      <p className="mt-2 text-2xl font-semibold tabular-nums">{value}</p>
      {detail && <p className="mt-1 text-xs text-slate-500">{detail}</p>}
    </div>
  );
}

export function Progress({ value, label }: { value: number; label?: string }) {
  const percent = Math.min(
    100,
    Math.max(0, Number.isFinite(value) ? value : 0),
  );
  return (
    <div>
      <div className="mb-2 flex justify-between text-sm">
        <span>{label ?? "Progress"}</span>
        <span className="font-mono">{percent.toFixed(0)}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
        <div
          className="h-full rounded-full bg-emerald-500 transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 px-5 py-10 text-center dark:border-slate-700">
      <p className="font-semibold">{title}</p>
      <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-600 dark:text-slate-400">
        {description}
      </p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium">{label}</span>
      {children}
      {hint && (
        <span className="mt-1.5 block text-xs leading-5 text-slate-500">
          {hint}
        </span>
      )}
    </label>
  );
}

export function Notice({
  children,
  kind = "demo",
}: {
  children: ReactNode;
  kind?: "demo" | "warning";
}) {
  return (
    <div
      className={`flex gap-3 rounded-xl border p-4 text-sm leading-6 ${kind === "demo" ? "border-sky-500/30 bg-sky-500/5 text-slate-700 dark:text-slate-300" : "border-amber-500/30 bg-amber-500/5 text-amber-900 dark:text-amber-200"}`}
    >
      {kind === "demo" ? (
        <FlaskConical className="mt-0.5 h-5 w-5 shrink-0 text-sky-600" />
      ) : (
        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
      )}
      <div>{children}</div>
    </div>
  );
}

export function LabelValue({
  label,
  value,
}: {
  label: string;
  value: ReactNode;
}) {
  return (
    <div className="flex flex-wrap justify-between gap-x-5 gap-y-1 border-b border-slate-200 py-3 text-sm last:border-0 dark:border-slate-800">
      <span className="text-slate-600 dark:text-slate-400">{label}</span>
      <span className="break-all text-right font-medium">{value}</span>
    </div>
  );
}
