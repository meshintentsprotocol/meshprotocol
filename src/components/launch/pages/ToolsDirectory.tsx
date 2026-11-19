import { Page } from "../ui/Primitives";

const tools = [
  {
    href: "/verify",
    name: "Token verification",
    detail:
      "See category, metadata, creator review, and liquidity proof as separate signals.",
  },
  {
    href: "/lock",
    name: "Token vesting",
    detail: "Preview beneficiary locks and date-based claims in a local demo.",
  },
  {
    href: "/launch/sales",
    name: "Presale and Alpha",
    detail:
      "Simulate deposits, settlement, and refunds across launch extensions.",
  },
  {
    href: "/launch/partner/analytics",
    name: "Builder analytics",
    detail: "Inspect browser-local launch and template activity.",
  },
];

export function ToolsDirectory() {
  return (
    <Page
      eyebrow="Launch ecosystem"
      title="Tools for the full lifecycle"
      description="Explore supporting products. Each page labels what is a browser demo and what has independent chain evidence."
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {tools.map((tool) => (
          <a
            key={tool.href}
            href={tool.href}
            className="rounded-2xl border border-slate-300 bg-white p-6 transition-colors hover:border-emerald-500 dark:border-slate-700 dark:bg-[#131722]"
          >
            <h2 className="text-xl font-semibold">{tool.name}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
              {tool.detail}
            </p>
            <p className="mt-6 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
              Explore tool
            </p>
          </a>
        ))}
      </div>
    </Page>
  );
}
