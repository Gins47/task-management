export type Id = string | number;

export type Column = {
  id: Id;
  title: string;
  updatedAt?: string;
};

export type Task = {
  id: Id;
  content: string;
  columnId: Id;
  updatedAt?: string;
};
