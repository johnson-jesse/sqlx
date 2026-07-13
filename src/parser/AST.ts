export interface SelectStatement {
  type: "SelectStatement";
  columns: string[];
  table: string;
  where?: BinaryExpression;
}

export interface InsertStatement {
  type: "InsertStatement";
  table: string;
  values: (string | number)[];
}

export interface CreateTableStatement {
  type: "CreateTableStatement";
  table: string;
  columns: string[];
}

export interface BinaryExpression {
  type: "BinaryExpression";
  left: string;
  operator: string;
  right: string | number;
}

export interface Assignment {
  column: string;
  value: string | number;
}

export interface UpdateStatement {
  type: "UpdateStatement";
  table: string;
  assignments: Assignment[];
  where?: BinaryExpression;
}

export type Statement =
  | SelectStatement
  | InsertStatement
  | CreateTableStatement
  | UpdateStatement;
