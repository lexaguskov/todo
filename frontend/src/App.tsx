import "./App.css";
import { Card, Space, Result, Avatar, Typography } from "antd";
import { PlusOutlined, UserOutlined } from "@ant-design/icons";
import TodoList from "./components/TodoList";
import { List, Select, Node } from "./types";
import { styled } from "styled-components";
import { syncedStore, getYjsDoc } from "@syncedstore/core";
import { useSyncedStore } from "@syncedstore/react";
import { useMemo } from "react";
import YPartyKitProvider from "y-partykit/provider";
import { IndexeddbPersistence } from "y-indexeddb";

// TODO: publish app somewhere
// TODO: tf for server

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

const myId = Math.floor(Math.random() * names.length);
const myName = names[myId];

const id = () => Number(Math.random() * 0xffffffff).toString(16);

function App() {
  const state = useSyncedStore(store);

  const onCreateListClick = (listKey: string) => {
    const newList = { title: "New todo list", key: listKey, entries: [] };
    store.lists.push(newList);
  };

  const onSetTitle = (listKey: string, title: string) => {
    const list = store.lists.find((l) => l.key === listKey);
    if (list) list.title = title;
  };

  const onDeleteListClick = (listKey: string) => {
    const index = store.lists.findIndex((l) => l.key === listKey);
    if (index > -1) store.lists.splice(index, 1);
  };

  const onDeleteItem = (listKey: string, itemKey: string) => {
    const list = store.lists.find((l) => l.key === listKey);
    if (list) {
      const index = list.entries.findIndex((e) => e.key === itemKey);
      if (index > -1) list.entries.splice(index, 1);
    }
  };

  const onCheck = (listKey: string, checked: boolean, itemKey: string) => {
    const list = store.lists.find((l) => l.key === listKey);
    if (list) {
      const item = list.entries.find((e) => e.key === itemKey);
      if (item) item.checked = checked;
    }
  };

  const onAddItem = (listKey: string, itemKey: string) => {
    const newItem: Node = { key: itemKey, title: "", checked: false };
    const list = store.lists.find((l) => l.key === listKey);
    if (list) list.entries.push(newItem);
  };

  const onChangeItem = (listKey: string, val: string, itemKey: string) => {
    const list = store.lists.find((l) => l.key === listKey);
    if (list) {
      const item = list.entries.find((e) => e.key === itemKey);
      if (item) item.title = val;
    }
  };

  const onListItemReorder = (
    listKey: string,
    fromIndex: number,
    toIndex: number,
  ) => {
    const list = store.lists.find((l) => l.key === listKey);
    if (list) {
      // TRICKY: reusing object from list.entries causes error:
      // 'Not supported: reassigning object that already occurs in the tree.'
      const { key, title, checked } = list.entries[fromIndex];
      list.entries.splice(fromIndex, 1);
      list.entries.splice(toIndex, 0, { key, title, checked });
    }
  };

  const now = Date.now();

  const selects = useMemo<Select[]>(
    () =>
      Object.values(state.selections).filter(
        (a) => a && a.name !== myName && a.timestamp > now - 120000,
      ) as Select[],
    [state.selections],
  );

  return (
    <>
      <Username>
        <Avatar size={32} style={{ margin: 6 }} icon={<UserOutlined />} />
        <Typography.Text>{myName}</Typography.Text>
      </Username>
      <Container align="center">
        {state.lists.map((list) => (
          <TodoList
            item={list}
            selects={selects}
            key={list.key}
            onDeleteListClick={() => onDeleteListClick(list.key)}
            onChangeTitle={(val) => onSetTitle(list.key, val)}
            onDeleteItem={(key) => onDeleteItem(list.key, key)}
            onCheck={(val, key) => onCheck(list.key, val, key)}
            onAddItem={() => onAddItem(list.key, id())}
            onChangeItem={(val, key) => onChangeItem(list.key, val, key)} // TODO: debounce
            onSelectTitle={(start, end) => {
              state.selections[myName] = {
                name: myName,
                key: list.key,
                start,
                end,
                timestamp: Date.now(),
              };
            }}
            onSelectItem={(start, end, key) =>
            (state.selections[myName] = {
              name: myName,
              key,
              start,
              end,
              timestamp: Date.now(),
            })
            }
            onReorder={(fromIndex, toIndex) =>
              onListItemReorder(list.key, fromIndex, toIndex)
            }
            onToggleLock={() => {
              list.locked = !list.locked;
            }}
          />
        ))}
        <TodoCard hoverable onClick={() => onCreateListClick(id())}>
          <Result icon={<PlusOutlined />} title="Create a new list" />
        </TodoCard>
      </Container>
    </>
  );
}

const TodoCard = styled(Card)`
  width: 300px;
`;

const Container = styled(Space)`
  padding: 64px;
  min-width: 100vw;
  height: 100vh;
  align-items: center;
  justify-content: center;
`;

const Username = styled.div`
  position: fixed;
  right: 8px;
  top: 0;
  display: flex;
  align-items: baseline;
`;

export default App;
