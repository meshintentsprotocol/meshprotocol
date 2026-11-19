import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Coins,
  GitBranch,
  LockKeyhole,
  Settings2,
} from "lucide-react";

const evidence =
  "https://chipnet.imaginary.cash/tx/678040e3042fbba22c6d1260b4a90bf6378ed5e0e6584698a050162c8063a081";

export function LaunchLanding() {
  return (
    <div>
      <section className="px-4 sm:px-6 border-b border-slate-300 dark:border-slate-800">
        <div className="max-w-7xl mx-auto border-x border-slate-300 dark:border-slate-800 px-6 sm:px-10 lg:px-12 py-16 sm:py-24 grid lg:grid-cols-[1.15fr_0.85fr] gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 px-3 py-1.5 font-mono text-xs mb-7">
              <span className="w-2 h-2 rounded-full bg-emerald-500" /> Blaze by
              Mesh · UI preview
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-semibold tracking-tight leading-[1.04] mb-7">
              Launch tokens.
              <br />
              <span className="text-emerald-600 dark:text-emerald-400">
                Build markets.
              </span>
            </h1>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-8 max-w-xl mb-8">
              Create a fixed-supply CashToken, discover its price on a curve,
              and graduate liquidity into a Mesh market. Builders can define
              reusable launch policies for their own launchpads.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="/launch/new"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-950 dark:bg-white text-white dark:text-slate-950 text-sm font-semibold"
              >
                Preview a launch <ArrowUpRight className="w-4 h-4" />
              </a>
              <a
                href="/launch/builders"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-slate-300 dark:border-slate-700 text-sm font-semibold"
              >
                Open Config Studio <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
          <div className="rounded-3xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#131722] p-6 sm:p-8 shadow-xl shadow-slate-900/5">
            <div className="flex justify-between items-center mb-9">
              <span className="font-mono text-xs uppercase tracking-widest text-slate-500">
                Launch lifecycle
              </span>
              <span className="rounded-full px-2.5 py-1 bg-amber-500/10 text-amber-700 dark:text-amber-300 font-mono text-[10px]">
                CHIPNET PROVEN E1
              </span>
            </div>
            {[
              [
                "01",
                "Create",
                "Fixed-supply CashToken and launch manifest",
                Coins,
              ],
              ["02", "Discover", "Buy and sell against the curve", GitBranch],
              ["03", "Graduate", "Fund a Mesh market at the target", Settings2],
              [
                "04",
                "Verify",
                "Inspect locked liquidity and fee rights",
                LockKeyhole,
              ],
            ].map(([number, title, detail, Icon]) => {
              const StepIcon = Icon as typeof Coins;
              return (
                <div
                  key={number as string}
                  className="flex gap-4 py-4 border-t border-slate-200 dark:border-slate-800"
                >
                  <span className="font-mono text-xs text-emerald-600 dark:text-emerald-400 pt-1">
                    {number as string}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 font-semibold">
                      <StepIcon className="w-4 h-4" />
                      {title as string}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      {detail as string}
                    </p>
                  </div>
                  <Check className="w-4 h-4 text-emerald-500" />
                </div>
              );
            })}
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-6 leading-5">
              The BCH-quoted E1 lifecycle has confirmed Chipnet transactions.
              This interface does not yet create mainnet launches.
            </p>
          </div>
        </div>
      </section>
      <section className="px-4 sm:px-6 border-b border-slate-300 dark:border-slate-800">
        <div className="max-w-7xl mx-auto border-x border-slate-300 dark:border-slate-800 px-6 sm:px-10 lg:px-12 py-16">
          <div className="grid md:grid-cols-3 gap-4">
            <a
              href="/launch/new"
              className="rounded-2xl border border-slate-300 dark:border-slate-700 p-7 bg-white dark:bg-[#131722] hover:border-emerald-500 transition-colors"
            >
              <Coins className="w-7 h-7 text-emerald-500 mb-7" />
              <h2 className="text-xl font-semibold mb-2">For token creators</h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-6 mb-7">
                Preview supply, allocation, curve target, fees, and liquidity
                lock before any wallet action.
              </p>
              <span className="text-sm font-semibold">
                Explore creator preview →
              </span>
            </a>
            <a
              href="/launch/builders"
              className="rounded-2xl border border-slate-300 dark:border-slate-700 p-7 bg-white dark:bg-[#131722] hover:border-emerald-500 transition-colors"
            >
              <Settings2 className="w-7 h-7 text-emerald-500 mb-7" />
              <h2 className="text-xl font-semibold mb-2">
                For launchpad builders
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-6 mb-7">
                Explore reusable configuration fields and the launch rules they
                will eventually commit.
              </p>
              <span className="text-sm font-semibold">
                Open builder tools →
              </span>
            </a>
            <a
              href="https://champrotocol.vercel.app/mesh/new"
              className="rounded-2xl border border-slate-300 dark:border-slate-700 p-7 bg-white dark:bg-[#131722] hover:border-emerald-500 transition-colors"
            >
              <GitBranch className="w-7 h-7 text-emerald-500 mb-7" />
              <h2 className="text-xl font-semibold mb-2">
                For direct liquidity
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-6 mb-7">
                Create and manage a Mesh pool in the existing wallet-connected
                application.
              </p>
              <span className="text-sm font-semibold">Open pool creator →</span>
            </a>
          </div>
          <div className="mt-10 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#131722] p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mb-2">
                Verified engineering evidence
              </p>
              <h3 className="font-semibold">
                15 confirmed transactions in the BCH-quoted Chipnet lifecycle
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Genesis, curve trades, partial fill and refund, graduation,
                market trade, and fee claims.
              </p>
            </div>
            <a
              href={evidence}
              target="_blank"
              rel="noreferrer"
              className="shrink-0 text-sm font-semibold inline-flex gap-2 items-center"
            >
              View graduation transaction <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
