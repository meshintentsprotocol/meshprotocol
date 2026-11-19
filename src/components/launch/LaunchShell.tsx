import { ArrowUpRight, Moon, Sun } from 'lucide-react';
import { MeshLogo } from '@/components/common/MeshLogo';
import { useMesh } from '@/context/MeshContext';
import { LaunchLanding } from './LaunchLanding';
import { ConfigStudio } from './ConfigStudio';

export function LaunchShell() {
  const { theme, toggleTheme } = useMesh();
  const path = window.location.pathname.replace(/\/$/, '') || '/';
  const page = path === '/launch/builders' ? 'builder' : path === '/launch/new' ? 'creator' : 'landing';

  return <div className={`min-h-screen ${theme === 'dark' ? 'dark bg-[#09090b] text-white' : 'bg-[#f9f9fb] text-slate-950'}`}>
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-[#0d0f15]/95 backdrop-blur-md border-b border-slate-300 dark:border-slate-800 px-4 sm:px-6"><div className="max-w-7xl mx-auto h-17 py-3 flex items-center justify-between gap-4"><a href="/" aria-label="Mesh home" className="shrink-0"><MeshLogo size={34} showText /></a><div className="flex items-center gap-2 sm:gap-4"><a className="hidden sm:inline text-xs font-semibold hover:text-emerald-500" href="/launch">Launch</a><a className="hidden sm:inline text-xs font-semibold hover:text-emerald-500" href="/launch/builders">For builders</a><button onClick={toggleTheme} aria-label="Toggle theme" className="p-2 rounded-lg border border-slate-300 dark:border-slate-700">{theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}</button><a href="https://champrotocol.vercel.app/mesh/new" className="inline-flex items-center gap-1 rounded-lg bg-slate-950 dark:bg-white px-3 py-2 text-xs font-semibold text-white dark:text-slate-950">Create pool <ArrowUpRight className="w-3.5 h-3.5" /></a></div></div></header>
    <main>{page === 'landing' ? <LaunchLanding /> : <ConfigStudio mode={page} />}</main>
    <footer className="border-t border-slate-300 dark:border-slate-800 px-4 sm:px-6"><div className="max-w-7xl mx-auto py-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-slate-500 dark:text-slate-400"><span>Mesh · Blaze launch infrastructure</span><span>Launch pages are UI previews. No wallet transaction is available here.</span></div></footer>
  </div>;
}
