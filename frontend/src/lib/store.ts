import YPartyKitProvider from "y-partykit/provider";
import { IndexeddbPersistence } from "y-indexeddb";
import { syncedStore, getYjsDoc } from "@syncedstore/core";
import { useSyncedStore } from "@syncedstore/react";

import { List, Select } from "./types";

type Selections = { [user: string]: Select };
const store = syncedStore({
  selections: {} as Selections,
  lists: [] as List[],
});
const room = document.location.host;
const doc = getYjsDoc(store);
new YPartyKitProvider(
  "blocknote-dev.yousefed.partykit.dev",
  room, // use the current hostname as the room name
  doc,
);
new IndexeddbPersistence("lexaguskov.todo", doc);

export const id = () => Number(Math.random() * 0xffffffff).toString(16);

export default () => useSyncedStore(store);
