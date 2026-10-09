import type { Dataset, SavedInsight, WorkspaceState } from './types';

const DATASET_KEY = 'datalens:dataset';
const INSIGHTS_KEY = 'datalens:insights';
const WORKSPACE_KEY = 'datalens:workspace';
const THEME_KEY = 'datalens:theme';

export function saveDataset(dataset: Dataset): void {
  try {
    localStorage.setItem(DATASET_KEY, JSON.stringify(dataset));
  } catch (e) {
    console.error('Failed to save dataset:', e);
  }
}

export function loadDataset(): Dataset | null {
  try {
    const raw = localStorage.getItem(DATASET_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Dataset;
  } catch {
    return null;
  }
}

export function clearDataset(): void {
  localStorage.removeItem(DATASET_KEY);
}

export function saveInsights(insights: SavedInsight[]): void {
  try {
    localStorage.setItem(INSIGHTS_KEY, JSON.stringify(insights));
  } catch (e) {
    console.error('Failed to save insights:', e);
  }
}

export function loadInsights(): SavedInsight[] {
  try {
    const raw = localStorage.getItem(INSIGHTS_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as SavedInsight[];
  } catch {
    return [];
  }
}

export function saveWorkspace(ws: WorkspaceState): void {
  try {
    localStorage.setItem(WORKSPACE_KEY, JSON.stringify(ws));
  } catch (e) {
    console.error('Failed to save workspace:', e);
  }
}

export function loadWorkspace(): WorkspaceState | null {
  try {
    const raw = localStorage.getItem(WORKSPACE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as WorkspaceState;
  } catch {
    return null;
  }
}

export function clearWorkspace(): void {
  localStorage.removeItem(WORKSPACE_KEY);
}

export function saveTheme(theme: 'light' | 'dark'): void {
  localStorage.setItem(THEME_KEY, theme);
}

export function loadTheme(): 'light' | 'dark' {
  const t = localStorage.getItem(THEME_KEY);
  return t === 'dark' ? 'dark' : 'light';
}
