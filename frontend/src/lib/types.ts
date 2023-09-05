export type Entry = {
  title: string;
  key: string;
  checked: boolean;
  children: Entry[];
  price?: number;
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

export type Presense = {
  name: string;
  email: string;
};