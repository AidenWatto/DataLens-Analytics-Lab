import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { Dataset, SavedInsight, ChartConfig, Scenario, Filter, ColumnMeta } from '@/lib/types';
import { saveDataset, loadDataset, saveInsights, loadInsights, clearDataset } from '@/lib/storage';
import { createDemoDatasets } from '@/lib/demoData';
import { buildDataset } from '@/lib/csv';

interface AppState {
  dataset: Dataset | null;
  workingDataset: Dataset | null;
  insights: SavedInsight[];
  charts: ChartConfig[];
  scenario: Scenario | null;
  filters: Filter[];
  theme: 'light' | 'dark';
  loadDemo: (name?: string) => void;
  importDataset: (name: string, headers: string[], rows: Record<string, string>[]) => void;
  setWorkingDataset: (ds: Dataset) => void;
  commitWorking: () => void;
  resetWorking: () => void;
  updateColumnMeta: (colName: string, meta: Partial<ColumnMeta>) => void;
  addInsight: (text: string, note: string, page: string) => void;
  removeInsight: (id: string) => void;
  updateInsightNote: (id: string, note: string) => void;
  addChart: (chart: ChartConfig) => void;
  removeChart: (id: string) => void;
  setScenario: (s: Scenario | null) => void;
  setFilters: (f: Filter[]) => void;
  toggleTheme: () => void;
  clearAll: () => void;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [dataset, setDataset] = useState<Dataset | null>(null);
  const [workingDataset, setWorkingDatasetState] = useState<Dataset | null>(null);
  const [insights, setInsights] = useState<SavedInsight[]>([]);
  const [charts, setCharts] = useState<ChartConfig[]>([]);
  const [scenario, setScenarioState] = useState<Scenario | null>(null);
  const [filters, setFiltersState] = useState<Filter[]>([]);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const loaded = loadDataset();
    if (loaded) {
      setDataset(loaded);
      setWorkingDatasetState(loaded);
    }
    setInsights(loadInsights());
    const t = localStorage.getItem('datalens:theme');
    if (t === 'dark') setTheme('dark');
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const loadDemo = useCallback((name?: string) => {
    const demos = createDemoDatasets();
    const selected = name ? demos.find((d) => d.name === name) ?? demos[0] : demos[0];
    setDataset(selected);
    setWorkingDatasetState(selected);
    setFiltersState([]);
    saveDataset(selected);
  }, []);

  const importDataset = useCallback((name: string, headers: string[], rows: Record<string, string>[]) => {
    const ds = buildDataset(name, headers, rows, false);
    setDataset(ds);
    setWorkingDatasetState(ds);
    setFiltersState([]);
    saveDataset(ds);
  }, []);

  const setWorkingDataset = useCallback((ds: Dataset) => {
    setWorkingDatasetState(ds);
  }, []);

  const commitWorking = useCallback(() => {
    setWorkingDatasetState((wd) => {
      if (wd) {
        setDataset(wd);
        saveDataset(wd);
      }
      return wd;
    });
  }, []);

  const resetWorking = useCallback(() => {
    setWorkingDatasetState(dataset);
  }, [dataset]);

  const updateColumnMeta = useCallback((colName: string, meta: Partial<ColumnMeta>) => {
    setWorkingDatasetState((wd) => {
      if (!wd) return wd;
      return {
        ...wd,
        columns: wd.columns.map((c) => (c.name === colName ? { ...c, ...meta } : c)),
      };
    });
  }, []);

  const addInsight = useCallback((text: string, note: string, page: string) => {
    const insight: SavedInsight = {
      id: `ins_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      text,
      note,
      page,
      createdAt: Date.now(),
    };
    setInsights((prev) => {
      const next = [insight, ...prev];
      saveInsights(next);
      return next;
    });
  }, []);

  const removeInsight = useCallback((id: string) => {
    setInsights((prev) => {
      const next = prev.filter((i) => i.id !== id);
      saveInsights(next);
      return next;
    });
  }, []);

  const updateInsightNote = useCallback((id: string, note: string) => {
    setInsights((prev) => {
      const next = prev.map((i) => (i.id === id ? { ...i, note } : i));
      saveInsights(next);
      return next;
    });
  }, []);

  const addChart = useCallback((chart: ChartConfig) => {
    setCharts((prev) => [chart, ...prev].slice(0, 10));
  }, []);

  const removeChart = useCallback((id: string) => {
    setCharts((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const setScenario = useCallback((s: Scenario | null) => {
    setScenarioState(s);
  }, []);

  const setFilters = useCallback((f: Filter[]) => {
    setFiltersState(f);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem('datalens:theme', next);
      return next;
    });
  }, []);

  const clearAll = useCallback(() => {
    clearDataset();
    setDataset(null);
    setWorkingDatasetState(null);
    setInsights([]);
    setCharts([]);
    setScenarioState(null);
    setFiltersState([]);
    saveInsights([]);
  }, []);

  return (
    <AppContext.Provider
      value={{
        dataset,
        workingDataset,
        insights,
        charts,
        scenario,
        filters,
        theme,
        loadDemo,
        importDataset,
        setWorkingDataset,
        commitWorking,
        resetWorking,
        updateColumnMeta,
        addInsight,
        removeInsight,
        updateInsightNote,
        addChart,
        removeChart,
        setScenario,
        setFilters,
        toggleTheme,
        clearAll,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppState {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
