import { DataFrame, Field, Vector } from '@grafana/data';

export interface PanelOptions {
  flat_area: { [key: string]: number } | null;
  filename: string;
}

export const defaults: PanelOptions = {
  flat_area: null,
  filename: '',
};

export interface Buffer extends Vector {
  buffer: any;
}

export interface FieldBuffer extends Field<any, Vector> {
  values: Buffer;
}

export interface Frame extends DataFrame {
  fields: FieldBuffer[];
}
export interface CSVRow {
  Store: string;
  'People/m2': number;
  'Timespent (min)': number;
}
