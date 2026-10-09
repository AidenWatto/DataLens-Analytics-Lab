import type { ColumnMeta, Dataset } from './types';
import { detectType } from './stats';

export function parseCSV(text: string): { headers: string[]; rows: Record<string, string>[] } {
  const lines = text.split(/\r?\n/).filter((l) => l.trim() !== '');
  if (lines.length === 0) {
    throw new Error('The CSV file appears to be empty.');
  }

  const headers = parseCSVLine(lines[0]);
  if (headers.length === 0) {
    throw new Error('No column headers were found in the CSV file.');
  }

  const rows: Record<string, string>[] = [];
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    const row: Record<string, string> = {};
    for (let j = 0; j < headers.length; j++) {
      row[headers[j]] = values[j] ?? '';
    }
    rows.push(row);
  }

  return { headers, rows };
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

export function buildDataset(
  name: string,
  headers: string[],
  rawRows: Record<string, string>[],
  isDemo = false
): Dataset {
  const columns: ColumnMeta[] = headers.map((name) => {
    const values = rawRows.map((r) => r[name] as string | null);
    const type = detectType(values);
    const missing = values.filter((v) => v === null || v === '' || v === undefined).length;
    const uniqueCount = new Set(values.filter((v) => v !== '' && v !== null && v !== undefined).map(String)).size;
    return { name, type, missing, uniqueCount };
  });

  // Convert numeric values to numbers for efficiency
  const rows: Record<string, string | number | null>[] = rawRows.map((r) => {
    const row: Record<string, string | number | null> = {};
    for (const col of columns) {
      const v = r[col.name];
      if (v === undefined || v === '') {
        row[col.name] = null;
      } else if (col.type === 'numeric') {
        const n = Number(v);
        row[col.name] = isNaN(n) ? v : n;
      } else {
        row[col.name] = v;
      }
    }
    return row;
  });

  return {
    id: `ds_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    name,
    isDemo,
    rows,
    columns,
    createdAt: Date.now(),
  };
}

export function toCSV(dataset: Dataset): string {
  const headers = dataset.columns.map((c) => c.name);
  const lines = [headers.join(',')];
  for (const row of dataset.rows) {
    const vals = headers.map((h) => {
      const v = row[h];
      if (v === null || v === undefined) return '';
      const s = String(v);
      if (s.includes(',') || s.includes('"') || s.includes('\n')) {
        return `"${s.replace(/"/g, '""')}"`;
      }
      return s;
    });
    lines.push(vals.join(','));
  }
  return lines.join('\n');
}

export function toJSON(dataset: Dataset): string {
  return JSON.stringify(dataset, null, 2);
}

export function downloadFile(filename: string, content: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
