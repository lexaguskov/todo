import { IndexeddbPersistence } from "y-indexeddb";
import { syncedStore, getYjsDoc } from "@syncedstore/core";
import { useSyncedStore } from "@syncedstore/react";
import { useSelf } from "y-presence";
import { WebsocketProvider } from "y-websocket";

import { List, Presense } from "./types";
import { SERVER_HOSTNAME } from "./config";
import { useEffect, useState } from "react";

const store = syncedStore({
  lists: [] as List[],
});

const room = "lexaguskov-todo" + document.location.hostname;
const doc = getYjsDoc(store);

const provider = new WebsocketProvider(
  SERVER_HOSTNAME.replace(/^http/, "ws"),
  room,
  doc,
);
new IndexeddbPersistence("lexaguskov.todo", doc);

export const awareness = provider.awareness;

const setUsername = (name: string) =>
  awareness.setLocalStateField("name", name);
const setUserId = (id: string) => awareness.setLocalStateField("id", id);
export const setSelection = (selection: Presense["selection"]) =>
  awareness.setLocalStateField("selection", selection);

// returns user info from y-presence
export const useUsername = () =>
  [useSelf(awareness, (state: any) => state?.name), setUsername] as const;
export const useUserId = () =>
  [useSelf(awareness, (state: any) => state?.id), setUserId] as const;

// generates unique id
export const id = () =>
  Number(Math.floor(Math.random() * 0xffffffff)).toString(16);

export const useOnlineStatus = () => {
  const [online, setOnline] = useState(false);
  useEffect(() => {
    const handler = (event: { status: string }) => {
      setOnline(event.status === "connected");
    };
    provider.on("status", handler);
    return () => provider.off("status", handler);
  }, []);

  return online;
};

const useStore = () => useSyncedStore(store);
export default useStore;
