export type Row = Record<string, unknown>;

export class Table {
  constructor(
    public name: string,
    public columns: string[],
    public rows: Row[],
  ) {}
}
