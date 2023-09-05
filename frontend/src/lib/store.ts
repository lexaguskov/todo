import YPartyKitProvider from "y-partykit/provider";
import { IndexeddbPersistence } from "y-indexeddb";
import { syncedStore, getYjsDoc } from "@syncedstore/core";
import { useSyncedStore } from "@syncedstore/react";

import { List, Select } from "./types";

const names = [
  "Eric Cartman",
  "Stan Marsh",
  "Kyle Broflovski",
  "Kenny McCormick",
  "Butters Stotch",
  "Wendy Testaburger",
  "Bebe Stevens",
  "Jimmy Valmer",
  "Timmy Burch",
  "Token Black",
  "Clyde Donovan",
  "Craig Tucker",
  "Tweek Tweak",
  "Heidi Turner",
  "Bradley Biggle",
  "Scott Malkinson",
];

type Selections = { [user: string]: Select };
const store = syncedStore({
  selections: {} as Selections,
  lists: [] as List[],
});
const room = "lexaguskov-todo" + document.location.hostname;
const doc = getYjsDoc(store);
new YPartyKitProvider(
  "blocknote-dev.yousefed.partykit.dev",
  room, // use the current hostname as the room name
  doc,
);
new IndexeddbPersistence("lexaguskov.todo", doc);

export function id() {
  return Number(Math.floor(Math.random() * 0xffffffff)).toString(16);
}

export const myId = Math.floor(Math.random() * names.length);
export const myName = names[myId];

export default () => useSyncedStore(store);
