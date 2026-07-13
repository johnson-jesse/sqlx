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

export interface BinaryExpression {
  type: "BinaryExpression";
  left: string;
  operator: string;
  right: string | number;
}

export type Statement = SelectStatement | InsertStatement;
