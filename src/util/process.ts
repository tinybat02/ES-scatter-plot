import { Frame } from '../types';

export const processData = (data: Array<Frame>) => {
  const result: Array<{ id: string; data: Array<{ x: number; y: number }> }> = [];

  const xStore: { [key: string]: number } = {};
  const yStore: { [key: string]: number } = {};
  data.map(row => {
    if (!row.name) return;

    if (row.name.startsWith('num')) {
      yStore[row.name.split('num')[1]] = row.fields[0].values.buffer.slice(-1)[0];
    } else {
      xStore[row.name] = row.fields[0].values.buffer.slice(-1)[0];
    }
  });

  Object.keys(xStore).map(store => {
    if (yStore[store]) {
      result.push({ id: store, data: [{ x: xStore[store], y: yStore[store] }] });
    }
  });

  return result;
};
