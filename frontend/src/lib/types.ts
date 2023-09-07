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
  author: string;
};

export type Presence = {
  name: string;
  email: string;
  selection: {
    start: number;
    end: number;
    timestamp: number;
    key: string;
  };
};
