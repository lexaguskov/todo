import YPartyKitProvider from "y-partykit/provider";
import { IndexeddbPersistence } from "y-indexeddb";
import { syncedStore, getYjsDoc } from "@syncedstore/core";
import { useSyncedStore } from "@syncedstore/react";
import { useSelf } from "y-presence";
// import { WebsocketProvider } from "y-websocket";

import { List } from "./types";

const store = syncedStore({
  lists: [] as List[],
});
const room = "lexaguskov-todo" + document.location.hostname;
const doc = getYjsDoc(store);
const provider = new YPartyKitProvider(
  "blocknote-dev.yousefed.partykit.dev",
  room, // use the current hostname as the room name
  doc,
);
new IndexeddbPersistence("lexaguskov.todo", doc);

// // Create a websocket provider
// const provider = new WebsocketProvider(
//   "wss://demos.yjs.dev",
//   room,
//   doc
// );

export const awareness = provider.awareness;

export const useUsername = () =>
  useSelf(awareness, (state: any) => state?.name);
export const useId = () => useSelf(awareness, (state: any) => state?.email);

// const name = names[Math.floor(Math.random() * names.length)];
// awareness.setLocalState({ name, email: "johndoe@gmail.com" });

export function id() {
  return Number(Math.floor(Math.random() * 0xffffffff)).toString(16);
}

const useStore = () => useSyncedStore(store);

export default useStore;
