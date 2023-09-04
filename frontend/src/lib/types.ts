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
};
export type Select = {
  name: string;
  key: string;
  start: number;
  end: number;
  timestamp: number;
};
