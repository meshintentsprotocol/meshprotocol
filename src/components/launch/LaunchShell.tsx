import { Moon, Sun } from "lucide-react";
import { MeshLogo } from "@/components/common/MeshLogo";
import { useMesh } from "@/context/MeshContext";
import { DemoProvider } from "./demo/DemoContext";
import { LaunchLanding } from "./LaunchLanding";
import {
  TemplateGallery,
  BuilderStudio,
  CreatorStudio,
  LaunchReview,
} from "./pages/StudioPages";
import {
  E1CaseStudy,
  LaunchDetail,
  LaunchDirectory,
  LaunchManage,
  LaunchProof,
  TokenIdentity,
} from "./pages/LaunchPages";
import {
  AnalyticsPage,
  BuilderDocsPage,
  LockPage,
  SalesPage,
  VerifyPage,
} from "./pages/ToolsPages";
import { ToolsDirectory } from "./pages/ToolsDirectory";

const links = [
  { label: "Overview", href: "/launch" },
  { label: "Explore", href: "/launch/tokens" },
  { label: "Create", href: "/launch/new" },
  { label: "Templates", href: "/launch/templates" },
  { label: "Builders", href: "/launch/builders" },
  { label: "Tools", href: "/launch/tools" },
  { label: "Docs", href: "/launch/docs" },
];

function RouteContent({ path }: { path: string }) {
  if (path === "/launch") return <LaunchLanding />;
  if (path === "/launch/tokens") return <LaunchDirectory />;
  if (path === "/launch/templates") return <TemplateGallery />;
  if (path === "/launch/builders" || path === "/launch/partner")
    return <BuilderStudio />;
  if (path === "/launch/new") return <CreatorStudio />;
  if (path === "/launch/new/review") return <LaunchReview />;
  if (path === "/launch/examples/e1") return <E1CaseStudy />;
  if (path === "/launch/docs") return <BuilderDocsPage />;
  if (path === "/launch/sales") return <SalesPage />;
  if (path === "/launch/partner/analytics") return <AnalyticsPage />;
  if (path === "/lock") return <LockPage />;
  if (path === "/verify") return <VerifyPage />;
  if (path === "/launch/tools") return <ToolsDirectory />;
  const token = path.match(/^\/tokens\/([0-9a-fA-F]{64})$/);
  if (token) return <TokenIdentity category={token[1].toLowerCase()} />;
  const manage = path.match(/^\/launch\/([^/]+)\/manage$/);
  if (manage) return <LaunchManage id={manage[1]} />;
  const proof = path.match(/^\/launch\/([^/]+)\/proof$/);
  if (proof) return <LaunchProof id={proof[1]} />;
  const launch = path.match(/^\/launch\/([^/]+)$/);
  if (launch) return <LaunchDetail id={launch[1]} />;
  return (
    <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
      <h1 className="text-4xl font-semibold">Page not found</h1>
      <p className="mt-4 text-slate-600 dark:text-slate-400">
        This launch page does not exist.
      </p>
      <a
        href="/launch"
        className="mt-6 inline-block text-emerald-600 dark:text-emerald-400"
      >
        Return to Launch
      </a>
    </div>
  );
}

export function LaunchShell() {
  const { theme, toggleTheme } = useMesh();
  const path = window.location.pathname.replace(/\/$/, "") || "/";
  const selected =
    path.startsWith("/tokens/")
      ? "/launch/tokens"
      : ["/lock", "/verify", "/launch/sales", "/launch/partner/analytics"].some(
            (tool) => path === tool,
          )
        ? "/launch/tools"
        : path === "/launch"
          ? "/launch"
          : links.find(
              (link) => link.href !== "/launch" && path.startsWith(link.href),
            )?.href;
  return (
    <DemoProvider>
      <div
        className={`min-h-screen ${theme === "dark" ? "dark bg-[#09090b] text-white" : "bg-[#f9f9fb] text-slate-950"}`}
      >
        <header className="sticky top-0 z-50 border-b border-slate-300 bg-white/95 px-4 backdrop-blur-md dark:border-slate-800 dark:bg-[#0d0f15]/95 sm:px-6">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 py-3">
            <a href="/" aria-label="Mesh home" className="shrink-0">
              <MeshLogo size={34} showText />
            </a>
            <div className="flex items-center gap-2">
              <span className="hidden rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-1 text-xs font-medium text-sky-700 dark:text-sky-300 md:inline-flex">
                Launch UI demo
              </span>
              <button
                onClick={toggleTheme}
                aria-label="Toggle theme"
                className="rounded-lg border border-slate-300 p-2 dark:border-slate-700"
              >
                {theme === "dark" ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </button>
              <a
                href="https://champrotocol.vercel.app/mesh/new"
                className="inline-flex min-h-10 items-center rounded-lg bg-slate-950 px-3 text-xs font-semibold text-white dark:bg-white dark:text-slate-950"
              >
                Create pool
              </a>
            </div>
          </div>
          <nav
            aria-label="Launch navigation"
            className="mx-auto flex max-w-7xl gap-1 overflow-x-auto pb-2"
          >
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                aria-current={selected === link.href ? "page" : undefined}
                className={`whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition-colors ${selected === link.href ? "bg-slate-950 text-white dark:bg-white dark:text-slate-950" : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"}`}
              >
                {link.label}
              </a>
            ))}
          </nav>
        </header>
        <main>
          <RouteContent path={path} />
        </main>
        <footer className="border-t border-slate-300 px-4 dark:border-slate-800 sm:px-6">
          <div className="mx-auto flex max-w-7xl flex-col justify-between gap-3 py-8 text-sm text-slate-600 dark:text-slate-400 sm:flex-row">
            <span>Mesh · Blaze launch infrastructure</span>
            <span>
              Demo interactions stay in this browser. No wallet transaction is
              available here.
            </span>
          </div>
        </footer>
      </div>
    </DemoProvider>
  );
}
