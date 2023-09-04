export type Entry = {
  title: string;
  key: string;
  checked: boolean;
  children: Entry[];
};

export type List = {
  title: string;
  key: string;
  entries: Entry[];
  locked?: boolean;
};

export type Select = {
  name: string;
  key: string;
  start: number;
  end: number;
  timestamp: number;
};
