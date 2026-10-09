import {
  Telescope, ArrowRight, Database, BarChart3, GitCompareArrows,
  FlaskConical, Lightbulb, FileText, Upload, ArrowRightCircle,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useColors } from '@/context/useColors';
import type { Page } from '@/context/router';
import { DEMO_DATASET_NAMES } from '@/lib/demoData';

export function HomePage({ navigate }: { navigate: (p: Page) => void }) {
  const { loadDemo, dataset } = useApp();
  const colors = useColors();

  const workflow = [
    { icon: Upload, label: 'Import', desc: 'Bring data in' },
    { icon: Database, label: 'Explore', desc: 'Browse & filter' },
    { icon: BarChart3, label: 'Visualise', desc: 'See patterns' },
    { icon: GitCompareArrows, label: 'Analyse', desc: 'Find relationships' },
    { icon: FlaskConical, label: 'Decide', desc: 'Model scenarios' },
  ];

  const features = [
    { icon: BarChart3, title: 'Visual Lab', desc: 'Bar, line, scatter, histogram, pie, and box plot charts with live aggregation.', page: 'visual' as Page },
    { icon: GitCompareArrows, title: 'Relationships', desc: 'Correlation coefficients with scatter plots and statistical interpretation.', page: 'relationships' as Page },
    { icon: FlaskConical, title: 'Decision Lab', desc: 'What-if scenarios with sliders. Explore how changing a variable affects outcomes.', page: 'decision' as Page },
    { icon: Lightbulb, title: 'Insight Board', desc: 'Save findings as you explore. Build a personal research workspace.', page: 'insights' as Page },
  ];

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="relative overflow-hidden" style={{ borderBottom: `1px solid ${colors.border}` }}>
        <div className="absolute inset-0 grid-bg-dots" />
        <div className="relative px-6 lg:px-12 py-16 lg:py-24 max-w-5xl mx-auto">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: colors.primary }}>
              <Telescope size={22} color={colors.surface} />
            </div>
            <span className="font-bold text-xl" style={{ color: colors.text }}>DataLens</span>
          </div>

          <h1 className="text-4xl lg:text-5xl font-bold tracking-tight leading-[1.1] mb-4" style={{ color: colors.text }}>
            Interactive Data Analytics<br />
            <span style={{ color: colors.primary }}>& Decision Lab</span>
          </h1>

          <p className="text-lg max-w-xl mb-8 leading-relaxed" style={{ color: colors.textMuted }}>
            Turn raw data into patterns, visualisations, and decisions. Explore datasets, find relationships, model scenarios, and build insights — all in your browser.
          </p>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => { if (!dataset) loadDemo(); navigate('workspace'); }}
              className="btn-primary inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-sm"
            >
              <Database size={18} />
              Explore Demo Data
            </button>
            <button
              onClick={() => navigate('data')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-sm surface hover:opacity-80 transition-opacity"
              style={{ color: colors.text }}
            >
              <Upload size={18} />
              Import Dataset
            </button>
            <button
              onClick={() => navigate('about')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-sm"
              style={{ color: colors.textMuted }}
            >
              How DataLens Works <ArrowRight size={16} />
            </button>
          </div>

          {/* Demo dataset chips */}
          <div className="mt-10">
            <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: colors.textMuted }}>Demo Datasets</p>
            <div className="flex flex-wrap gap-2">
              {DEMO_DATASET_NAMES.map((name) => (
                <button
                  key={name}
                  onClick={() => { loadDemo(name); navigate('workspace'); }}
                  className="px-3 py-1.5 rounded-lg text-sm surface hover:opacity-80 transition-opacity"
                  style={{ color: colors.text }}
                >
                  {name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Workflow */}
      <section className="px-6 lg:px-12 py-16 max-w-5xl mx-auto">
        <h2 className="text-xs font-semibold uppercase tracking-wider mb-8 text-center" style={{ color: colors.textMuted }}>
          The Analytical Workflow
        </h2>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {workflow.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={i} className="flex items-center gap-4 md:flex-1">
                <div className="flex flex-col items-center text-center flex-shrink-0">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-2" style={{ backgroundColor: colors.surface2, border: `1px solid ${colors.border}` }}>
                    <Icon size={24} style={{ color: colors.primary }} />
                  </div>
                  <p className="font-semibold text-sm" style={{ color: colors.text }}>{step.label}</p>
                  <p className="text-xs" style={{ color: colors.textMuted }}>{step.desc}</p>
                </div>
                {i < workflow.length - 1 && (
                  <ArrowRightCircle size={20} className="hidden md:block flex-shrink-0" style={{ color: colors.textMuted }} />
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Features grid */}
      <section className="px-6 lg:px-12 py-12 max-w-5xl mx-auto">
        <h2 className="text-xl font-bold mb-6" style={{ color: colors.text }}>What you can do</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <button
                key={f.title}
                onClick={() => navigate(f.page)}
                className="surface rounded-xl p-5 text-left hover:opacity-90 transition-opacity group"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: colors.surface2 }}>
                    <Icon size={20} style={{ color: colors.primary }} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-1">
                      <h3 className="font-semibold" style={{ color: colors.text }}>{f.title}</h3>
                      <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: colors.primary }} />
                    </div>
                    <p className="text-sm mt-1" style={{ color: colors.textMuted }}>{f.desc}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Privacy note */}
      <section className="px-6 lg:px-12 py-12 max-w-5xl mx-auto">
        <div className="surface rounded-xl p-6 flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: colors.surface2 }}>
            <FileText size={20} style={{ color: colors.primary }} />
          </div>
          <div>
            <h3 className="font-semibold mb-1" style={{ color: colors.text }}>Your data stays in your browser</h3>
            <p className="text-sm" style={{ color: colors.textMuted }}>
              DataLens processes imported datasets entirely within your browser. No data is uploaded to a server, and no account or API key is required.
            </p>
          </div>
        </div>
      </section>

      <footer className="px-6 lg:px-12 py-8 max-w-5xl mx-auto border-t" style={{ borderColor: colors.border }}>
        <p className="text-xs text-center" style={{ color: colors.textMuted }}>
          DataLens — Interactive Data Analytics & Decision Lab · A project by Aranya Vij
        </p>
      </footer>
    </div>
  );
}
