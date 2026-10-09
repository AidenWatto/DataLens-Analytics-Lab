import { useState, type ReactNode } from 'react';
import {
  Home, LayoutDashboard, Database, BarChart3, GitCompareArrows,
  FlaskConical, Lightbulb, FileText, GraduationCap, Info,
  Sun, Moon, Menu, X, Telescope, Telescope as AnalysisIcon,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import type { Page } from '@/context/router';
import { useColors } from '@/context/useColors';

const NAV_ITEMS: { page: Page; label: string; icon: typeof Home; group: string }[] = [
  { page: 'home', label: 'Home', icon: Home, group: 'Start' },
  { page: 'workspace', label: 'Workspace', icon: LayoutDashboard, group: 'Start' },
  { page: 'data', label: 'Data', icon: Database, group: 'Data' },
  { page: 'visual', label: 'Visual Lab', icon: BarChart3, group: 'Analysis' },
  { page: 'relationships', label: 'Relationships', icon: GitCompareArrows, group: 'Analysis' },
  { page: 'analysis', label: 'Trends & Compare', icon: AnalysisIcon, group: 'Analysis' },
  { page: 'decision', label: 'Decision Lab', icon: FlaskConical, group: 'Analysis' },
  { page: 'insights', label: 'Insights', icon: Lightbulb, group: 'Workspace' },
  { page: 'reports', label: 'Reports', icon: FileText, group: 'Workspace' },
  { page: 'student', label: 'Student', icon: GraduationCap, group: 'About' },
  { page: 'about', label: 'About', icon: Info, group: 'About' },
];

export function Layout({ page, navigate, children }: { page: Page; navigate: (p: Page) => void; children: ReactNode }) {
  const { theme, toggleTheme, dataset } = useApp();
  const colors = useColors();
  const [mobileOpen, setMobileOpen] = useState(false);

  const groups = Array.from(new Set(NAV_ITEMS.map((n) => n.group)));

  const sidebar = (
    <div className="flex flex-col h-full" style={{ backgroundColor: colors.surface, borderColor: colors.border }}>
      {/* Logo */}
      <div className="px-5 py-5 flex items-center gap-2.5 border-b" style={{ borderColor: colors.border }}>
        <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: colors.primary }}>
          <Telescope size={20} color={colors.surface} />
        </div>
        <div>
          <h1 className="font-bold text-base leading-tight" style={{ color: colors.text }}>DataLens</h1>
          <p className="text-[10px] leading-tight" style={{ color: colors.textMuted }}>Analytics & Decision Lab</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        {groups.map((group) => (
          <div key={group} className="mb-4">
            <p className="px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-wider" style={{ color: colors.textMuted }}>{group}</p>
            {NAV_ITEMS.filter((n) => n.group === group).map((item) => {
              const Icon = item.icon;
              const active = page === item.page;
              return (
                <button
                  key={item.page}
                  onClick={() => { navigate(item.page); setMobileOpen(false); }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all mb-0.5 ${active ? '' : 'hover:opacity-80'}`}
                  style={{
                    backgroundColor: active ? colors.primary : 'transparent',
                    color: active ? colors.surface : colors.text,
                  }}
                >
                  <Icon size={17} />
                  <span>{item.label}</span>
                  {item.page === 'data' && dataset && (
                    <span className="ml-auto w-2 h-2 rounded-full animate-pulse-dot" style={{ backgroundColor: active ? colors.surface : colors.primary }} />
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Theme toggle + dataset indicator */}
      <div className="px-3 py-3 border-t" style={{ borderColor: colors.border }}>
        {dataset && (
          <div className="px-3 py-2 mb-2 rounded-lg text-xs" style={{ backgroundColor: colors.surface2, color: colors.textMuted }}>
            <span className="font-medium" style={{ color: colors.text }}>{dataset.name}</span>
            <span className="ml-1">· {dataset.rows.length} rows</span>
            {dataset.isDemo && <span className="ml-1 opacity-60">(Demo)</span>}
          </div>
        )}
        <button
          onClick={toggleTheme}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all hover:opacity-80"
          style={{ color: colors.text }}
        >
          {theme === 'light' ? <Moon size={17} /> : <Sun size={17} />}
          <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: colors.bg }}>
      {/* Desktop sidebar */}
      <aside className="w-60 flex-shrink-0 border-r hidden lg:block no-print" style={{ borderColor: colors.border }}>
        {sidebar}
      </aside>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40 lg:hidden no-print" onClick={() => setMobileOpen(false)} />
          <aside className="fixed left-0 top-0 bottom-0 w-64 z-50 lg:hidden no-print animate-slide-in">
            {sidebar}
          </aside>
        </>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile header */}
        <header className="lg:hidden flex items-center justify-between px-4 py-3 border-b no-print" style={{ backgroundColor: colors.surface, borderColor: colors.border }}>
          <button onClick={() => setMobileOpen(true)}>
            <Menu size={22} style={{ color: colors.text }} />
          </button>
          <div className="flex items-center gap-2">
            <Telescope size={18} style={{ color: colors.primary }} />
            <span className="font-bold text-sm" style={{ color: colors.text }}>DataLens</span>
          </div>
          <button onClick={toggleTheme}>
            {theme === 'light' ? <Moon size={20} style={{ color: colors.text }} /> : <Sun size={20} style={{ color: colors.text }} />}
          </button>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
