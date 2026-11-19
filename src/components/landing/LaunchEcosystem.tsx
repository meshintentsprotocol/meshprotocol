import { ArrowUpRight, Coins, Layers3, Workflow } from 'lucide-react';

const paths = [
  {
    label: 'For creators',
    title: 'Launch a token',
    description: 'Explore a fixed-supply CashToken launch, its bonding curve, fees, and graduation into Mesh liquidity.',
    href: '/launch',
    action: 'Explore Blaze',
    icon: Coins,
  },
  {
    label: 'For builders',
    title: 'Build a launchpad',
    description: 'Design reusable launch configurations and see the rights that every launch must commit to.',
    href: '/launch/builders',
    action: 'Open Config Studio',
    icon: Workflow,
  },
  {
    label: 'For liquidity providers',
    title: 'Create a Mesh pool',
    description: 'Use the existing wallet-connected app to create and manage a liquidity position.',
    href: 'https://champrotocol.vercel.app/mesh/new',
    action: 'Create a pool',
    icon: Layers3,
  },
];

export function LaunchEcosystem() {
  return (
    <section id="launch-ecosystem" className="border-b border-slate-300 dark:border-slate-800 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto border-x border-slate-300 dark:border-slate-800 px-6 sm:px-10 lg:px-12 py-16 sm:py-24">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5 mb-10">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.24em] text-emerald-600 dark:text-emerald-400 mb-3">The Mesh ecosystem</p>
            <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight">Create a market. Build on Mesh.</h2>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md leading-6">One protocol for token launches, programmable liquidity, and the tools other teams need to create their own experiences.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {paths.map(({ label, title, description, href, action, icon: Icon }) => (
            <a key={title} href={href} className="group rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#131722] p-6 min-h-64 flex flex-col hover:border-emerald-500 dark:hover:border-emerald-500 transition-colors">
              <div className="flex items-start justify-between">
                <span className="w-11 h-11 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center"><Icon className="w-5 h-5" /></span>
                <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-500 transition-colors" />
              </div>
              <div className="mt-auto pt-8">
                <p className="font-mono text-[10px] uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mb-2">{label}</p>
                <h3 className="text-xl font-semibold mb-2">{title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-6 mb-5">{description}</p>
                <span className="text-sm font-semibold group-hover:text-emerald-600 dark:group-hover:text-emerald-400">{action} →</span>
              </div>
            </a>
          ))}
        </div>
        <p className="mt-5 text-xs text-slate-500 dark:text-slate-400">Blaze launch creation is in preview. Pool creation opens the existing Mesh app.</p>
      </div>
    </section>
  );
}
