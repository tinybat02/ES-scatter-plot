import { DataFrame, Field, Vector } from '@grafana/data';

export interface PanelOptions {
  flat_area: { [key: string]: number } | null;
  filename: string;
  enableDownload: boolean;
}

export const defaults: PanelOptions = {
  flat_area: null,
  filename: '',
  enableDownload: false,
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
  'People/m2': string;
  'Timespent (min)/m2': string;
}
