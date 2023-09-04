export type List = {
  title: string;
  key: string;
  entries: Node[];
  locked?: boolean;
};
export type Node = {
  title: string;
  key: string;
  checked: boolean;
  children: Node[];
};
export type Select = {
  name: string;
  key: string;
  start: number;
  end: number;
  timestamp: number;
};
