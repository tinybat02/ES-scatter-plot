import { Frame, CSVRow } from '../types';

export const processData = (data: Array<Frame>, area: { [key: string]: number }) => {
  const result: Array<{ id: string; data: Array<{ x: number; y: number }> }> = [];

  const xStore: { [key: string]: number } = {};
  const yStore: { [key: string]: number } = {};
  const csvData: Array<CSVRow> = [];

  data.map(row => {
    if (!row.name) return;

    if (row.name.startsWith('num')) {
      yStore[row.name.split('num')[1]] = row.fields[0].values.buffer.slice(-1)[0];
    } else {
      xStore[row.name] = Math.round(row.fields[0].values.buffer.slice(-1)[0] / 6) / 10;
    }
  });

  Object.keys(xStore).map(store => {
    if (yStore[store] && area[store]) {
      const yValue = Math.round((yStore[store] / area[store]) * 100) / 100;
      csvData.push({ Store: store, 'People/m2': yValue, 'Duration (min)': xStore[store] });
      result.push({
        id: store,
        data: [{ x: xStore[store], y: yValue }],
      });
    }
  });

  return { result, csvData };
};
