import "./App.css";
import { Card, Space, Result, Avatar, Typography } from "antd";
import { PlusOutlined, UserOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { usePersistedState } from "./usePersistedState";
import io from "socket.io-client";
import Todo from "./components/Todo";
import { List, Select, Node } from "./types";
import { styled } from "styled-components";
// TODO: publish app somewhere
// TODO: tf for server

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

const socket = io("http://localhost:3001", {
  transports: ["websocket"],
});
socket.on("connect", () => {
  console.log("connected");
});
socket.on("disconnect", () => {
  console.log("disconnected");
});
socket.on("error", (err) => {});

const id = () => Number(Math.random() * 0xffffffff).toString(16);

function App() {
  const [lists, setLists] = usePersistedState<List[]>("lists", []);

  const onCreateListClick = (listKey: string, emit: boolean = true) => {
    const newList = { title: "New todo list", key: listKey, entries: [] };
    emit && socket.emit("edit", { type: "list.create", listKey });
    setLists((lists) => [...lists, newList]);
  };

  const onSetTitle = (listKey: string, title: string, emit: boolean = true) => {
    console.log("editing title for list", listKey, title);
    emit && socket.emit("edit", { type: "list.title", title, listKey });
    setLists((lists) =>
      lists.map((l) => (l.key === listKey ? { ...l, title } : l)),
    );
  };

  const onDeleteListClick = (listKey: string, emit: boolean = true) => {
    emit && socket.emit("edit", { type: "list.delete", listKey });
    setLists((lists) => lists.filter((l) => l.key !== listKey));
  };

  const onDeleteItem = (
    listKey: string,
    itemKey: string,
    emit: boolean = true,
  ) => {
    emit &&
      socket.emit("edit", {
        type: "list.item.delete",
        listKey: listKey,
        itemKey: itemKey,
      });
    setLists((lists) =>
      lists.map((l) =>
        l.key === listKey
          ? { ...l, entries: l.entries.filter((e) => e.key !== itemKey) }
          : l,
      ),
    );
  };

  const onCheck = (
    listKey: string,
    checked: boolean,
    itemKey: string,
    emit: boolean = true,
  ) => {
    emit &&
      socket.emit("edit", {
        type: "list.item.check",
        listKey,
        itemKey,
        checked,
      });
    setLists((lists) =>
      lists.map((l) =>
        l.key === listKey
          ? {
              ...l,
              entries: l.entries.map((e) =>
                e.key === itemKey ? { ...e, checked } : e,
              ),
            }
          : l,
      ),
    );
  };

  const onAddItem = (
    listKey: string,
    itemKey: string,
    emit: boolean = true,
  ) => {
    emit && socket.emit("edit", { type: "list.item.add", listKey, itemKey });
    const newItem: Node = { key: itemKey, title: "", checked: false };
    setLists((lists) =>
      lists.map((l) =>
        l.key === listKey ? { ...l, entries: [...l.entries, newItem] } : l,
      ),
    );
  };

  const onChangeItem = (
    listKey: string,
    val: string,
    itemKey: string,
    emit: boolean = true,
  ) => {
    emit &&
      socket.emit("edit", {
        type: "list.item.title",
        listKey,
        itemKey,
        title: val,
      });
    setLists((lists) =>
      lists.map((l) =>
        l.key === listKey
          ? {
              ...l,
              entries: l.entries.map((e) =>
                e.key === itemKey ? { ...e, title: val } : e,
              ),
            }
          : l,
      ),
    );
  };

  const [selects, setSelects] = useState<{ [name: string]: Select }>({});

  const onListItemReorder = (
    listKey: string,
    fromIndex: number,
    toIndex: number,
    emit: boolean = true,
  ) => {
    emit &&
      socket.emit("edit", {
        type: "list.item.reorder",
        listKey,
        fromIndex,
        toIndex,
      });
    setLists((lists) =>
      lists.map((l) =>
        l.key === listKey
          ? {
              ...l,
              entries: l.entries.map((e, i) => {
                if (i === fromIndex) return l.entries[toIndex];
                if (i === toIndex) return l.entries[fromIndex];
                return e;
              }),
            }
          : l,
      ),
    );
  };

  useEffect(() => {
    socket.on("select", (msg) => {
      console.log("select", msg);
      setSelects((selects) => ({ ...selects, [msg.name]: msg }));
    });

    socket.on("edit", (msg) => {
      console.log("message", msg);
      if (msg.type === "list.title") {
        onSetTitle(msg.listKey, msg.title, false);
      }

      if (msg.type === "list.delete") {
        onDeleteListClick(msg.listKey, false);
      }

      if (msg.type === "list.item.delete") {
        onDeleteItem(msg.listKey, msg.itemKey, false);
      }

      if (msg.type === "list.item.check") {
        onCheck(msg.listKey, msg.checked, msg.itemKey, false);
      }

      if (msg.type === "list.item.add") {
        onAddItem(msg.listKey, msg.itemKey, false);
      }

      if (msg.type === "list.item.title") {
        onChangeItem(msg.listKey, msg.title, msg.itemKey, false);
      }

      if (msg.type === "list.create") {
        onCreateListClick(msg.listKey, false);
      }

      if (msg.type === "list.item.reorder") {
        onListItemReorder(msg.listKey, msg.fromIndex, msg.toIndex, false);
      }
    });

    return () => {
      socket.off("edit");
      socket.off("select");
    };
  }, []);

  return (
    <>
      <Username>
        <Avatar size={32} style={{ margin: 6 }} icon={<UserOutlined />} />
        <Typography.Text>{myName}</Typography.Text>
      </Username>
      <Space
        style={{
          padding: 64,
          minWidth: "100vw",
          height: "100vh",
          alignItems: "center",
          justifyContent: "center",
        }}
        align="center"
      >
        {lists.map((list) => (
          <Todo
            titleSelect={Object.values(selects).filter(
              (s) =>
                s.key === list.key &&
                s.name !== myName &&
                s.start >= 0 &&
                s.end >= 0,
            )}
            selects={Object.values(selects)}
            key={list.key}
            onDeleteListClick={() => onDeleteListClick(list.key)}
            onChangeTitle={(val) => onSetTitle(list.key, val)}
            title={list.title}
            data={list.entries}
            onDeleteItem={(key) => onDeleteItem(list.key, key)}
            onCheck={(val, key) => onCheck(list.key, val, key)}
            onAddItem={() => onAddItem(list.key, id())}
            onChangeItem={(val, key) => onChangeItem(list.key, val, key)} // TODO: debounce
            onSelectTitle={(start, end) =>
              socket.emit("select", {
                name: myName,
                key: list.key,
                start,
                end,
              })
            }
            onSelectItem={(start, end, key) =>
              socket.emit("select", {
                name: myName,
                key,
                start,
                end,
              })
            }
            onReorder={(fromIndex, toIndex) =>
              onListItemReorder(list.key, fromIndex, toIndex)
            }
          />
        ))}
        <Card
          style={{ width: 300 }}
          hoverable
          onClick={() => onCreateListClick(id())}
        >
          <Result icon={<PlusOutlined />} title="Create a new list" />
        </Card>
      </Space>
    </>
  );
}

const Username = styled.div`
  position: fixed;
  right: 8px;
  top: 0;
  display: flex;
  align-items: baseline;
`;

export default App;
