import { useMemo } from 'react';
import {
  LayoutDashboard, Database, BarChart3, Lightbulb, FlaskConical,
  Trash2, Save, RotateCcw, ShieldCheck, AlertTriangle, ArrowRight,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useColors } from '@/context/useColors';
import { PageHeader } from '@/components/PageHeader';
import { Button, Card, EmptyState, StatCard, Badge } from '@/components/ui';
import { BarChart } from '@/components/Charts';
import {
  computeNumericStats, getNumericValues, getNumericColumnNames,
  groupAndAggregate, formatNumber,
} from '@/lib/stats';
import { saveWorkspace, clearWorkspace } from '@/lib/storage';
import type { Page } from '@/context/router';

export function WorkspacePage({ navigate }: { navigate: (p: Page) => void }) {
  const {
    workingDataset, dataset, insights, charts, scenario, filters,
    clearAll, setScenario,
  } = useApp();
  const colors = useColors();

  const ds = workingDataset ?? dataset;

  const quickStats = useMemo(() => {
    if (!ds) return null;
    const numericCols = getNumericColumnNames(ds.columns);
    if (numericCols.length === 0) return null;
    const stats = computeNumericStats(getNumericValues(ds.rows, numericCols[0]));
    return { col: numericCols[0], stats };
  }, [ds]);

  const dataQuality = useMemo(() => {
    if (!ds) return null;
    const missing = ds.columns.reduce((a, c) => a + c.missing, 0);
    const seen = new Set<string>();
    let duplicates = 0;
    for (const r of ds.rows) {
      const key = JSON.stringify(r);
      if (seen.has(key)) duplicates++;
      else seen.add(key);
    }
    return { missing, duplicates };
  }, [ds]);

  const chartPreview = useMemo(() => {
    if (!ds) return [];
    const numericCols = getNumericColumnNames(ds.columns);
    const catCols = ds.columns.filter(c => c.type === 'categorical').map(c => c.name);
    if (numericCols.length === 0 || catCols.length === 0) return [];
    return groupAndAggregate(ds.rows, catCols[0], numericCols[0], 'avg').slice(0, 8);
  }, [ds]);

  const handleSaveWorkspace = () => {
    saveWorkspace({
      datasetId: ds?.id ?? null,
      filters,
      insights,
      charts,
      scenario,
      savedAt: Date.now(),
    });
  };

  const handleResetAnalysis = () => {
    setScenario(null);
    clearWorkspace();
  };

  const handleClearData = () => {
    if (confirm('This will remove the current dataset and all saved insights from your browser. Continue?')) {
      clearAll();
      clearWorkspace();
    }
  };

  if (!ds) {
    return (
      <div className="px-4 lg:px-8 py-6 max-w-5xl mx-auto animate-fade-in">
        <PageHeader title="Workspace" subtitle="Your analysis desk" icon={<LayoutDashboard size={20} />} />
        <EmptyState
          icon={<Database size={28} />}
          title="No dataset loaded"
          description="Choose a demo dataset or import a CSV to begin exploring. Your analysis workspace will track your progress here."
          action={
            <Button variant="primary" onClick={() => navigate('data')}>
              <Database size={16} /> Load Data
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="px-4 lg:px-8 py-6 max-w-6xl mx-auto animate-fade-in">
      <PageHeader
        title="Workspace"
        subtitle="Your analysis desk"
        icon={<LayoutDashboard size={20} />}
        action={
          <div className="flex gap-2">
            <Button size="sm" onClick={handleResetAnalysis}><RotateCcw size={15} /> Reset</Button>
            <Button size="sm" variant="primary" onClick={handleSaveWorkspace}><Save size={15} /> Save Workspace</Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Dataset card */}
        <Card title="Current Dataset">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Database size={18} style={{ color: colors.primary }} />
              <h3 className="font-semibold" style={{ color: colors.text }}>{ds.name}</h3>
              {ds.isDemo && <Badge variant="primary">Demo</Badge>}
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div><span className="text-muted">Rows: </span><span style={{ color: colors.text }}>{ds.rows.length.toLocaleString()}</span></div>
              <div><span className="text-muted">Columns: </span><span style={{ color: colors.text }}>{ds.columns.length}</span></div>
              <div><span className="text-muted">Numeric: </span><span style={{ color: colors.text }}>{ds.columns.filter(c => c.type === 'numeric').length}</span></div>
              <div><span className="text-muted">Categorical: </span><span style={{ color: colors.text }}>{ds.columns.filter(c => c.type === 'categorical').length}</span></div>
            </div>
            <Button size="sm" className="w-full" onClick={() => navigate('data')}>Open Data <ArrowRight size={14} /></Button>
          </div>
        </Card>

        {/* Data quality */}
        {dataQuality && (
          <Card title="Data Quality">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                {dataQuality.missing > 0 ? <AlertTriangle size={18} className="text-amber-500" /> : <ShieldCheck size={18} style={{ color: colors.primary }} />}
                <p className="text-sm font-medium" style={{ color: colors.text }}>
                  {dataQuality.missing === 0 ? 'No missing values detected' : `${dataQuality.missing} missing values`}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <StatCard label="Missing" value={dataQuality.missing} />
                <StatCard label="Duplicates" value={dataQuality.duplicates} />
              </div>
            </div>
          </Card>
        )}

        {/* Quick statistics */}
        {quickStats && (
          <Card title={`Quick Stats: ${quickStats.col}`}>
            <div className="grid grid-cols-2 gap-2">
              <StatCard label="Mean" value={formatNumber(quickStats.stats.mean)} />
              <StatCard label="Median" value={formatNumber(quickStats.stats.median)} />
              <StatCard label="Min" value={formatNumber(quickStats.stats.min)} />
              <StatCard label="Max" value={formatNumber(quickStats.stats.max)} />
            </div>
          </Card>
        )}

        {/* Active chart preview */}
        {chartPreview.length > 0 && (
          <Card title="Active Analysis" className="lg:col-span-2">
            <div className="mb-3">
              <p className="text-xs text-muted">Average {quickStats?.col} by {ds.columns.find(c => c.type === 'categorical')?.name}</p>
            </div>
            <BarChart
              data={chartPreview.map(d => ({ label: d.label, value: d.value }))}
              colors={colors}
              yLabel={quickStats?.col}
            />
            <Button size="sm" className="mt-3" onClick={() => navigate('visual')}>Open Visual Lab <ArrowRight size={14} /></Button>
          </Card>
        )}

        {/* Scenario */}
        <Card title="Decision Scenario">
          {scenario ? (
            <div className="space-y-3">
              <FlaskConical size={18} style={{ color: colors.primary }} />
              <p className="text-sm" style={{ color: colors.text }}>
                <strong>{scenario.inputCol}</strong>: {scenario.fromValue} → {scenario.toValue}
              </p>
              <p className="text-xs text-muted">Outcome: {scenario.outputCol}</p>
              <Button size="sm" className="w-full" onClick={() => navigate('decision')}>Open Decision Lab <ArrowRight size={14} /></Button>
            </div>
          ) : (
            <div className="text-center py-4">
              <FlaskConical size={24} className="mx-auto mb-2 text-muted" />
              <p className="text-sm text-muted">No scenario set</p>
              <Button size="sm" className="mt-2" onClick={() => navigate('decision')}>Create Scenario</Button>
            </div>
          )}
        </Card>

        {/* Recent insights */}
        <Card title={`Recent Insights (${insights.length})`}>
          {insights.length > 0 ? (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {insights.slice(0, 5).map((i) => (
                <div key={i.id} className="flex items-start gap-2 text-sm">
                  <Lightbulb size={14} className="flex-shrink-0 mt-0.5" style={{ color: colors.primary }} />
                  <span style={{ color: colors.text }}>{i.text}</span>
                </div>
              ))}
              <Button size="sm" className="w-full mt-2" onClick={() => navigate('insights')}>View All <ArrowRight size={14} /></Button>
            </div>
          ) : (
            <div className="text-center py-4">
              <Lightbulb size={24} className="mx-auto mb-2 text-muted" />
              <p className="text-sm text-muted">No insights saved yet</p>
            </div>
          )}
        </Card>

        {/* Saved charts */}
        {charts.length > 0 && (
          <Card title={`Saved Charts (${charts.length})`}>
            <div className="space-y-2">
              {charts.slice(0, 5).map((c) => (
                <div key={c.id} className="flex items-center gap-2 text-sm">
                  <BarChart3 size={14} style={{ color: colors.primary }} />
                  <span style={{ color: colors.text }}>{c.chartType} · {c.yCol} by {c.xCol}</span>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Privacy / Clear data */}
        <Card title="Local Data" className="lg:col-span-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-start gap-2">
              <ShieldCheck size={18} style={{ color: colors.primary }} className="flex-shrink-0 mt-0.5" />
              <p className="text-sm" style={{ color: colors.textMuted }}>
                Your dataset and insights are stored locally in your browser. No data is sent to a server.
              </p>
            </div>
            <Button size="sm" variant="danger" onClick={handleClearData}><Trash2 size={15} /> Clear All Data</Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
