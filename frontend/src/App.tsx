import { Card, Result, Avatar, Typography } from "antd";
import { PlusOutlined, UserOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";

import TodoList from "./components/TodoList";
import { List, Select } from "./lib/types";
import { styled } from "styled-components";

import useStore, { id } from "./lib/store";
import VerticalList from "./components/VerticalList";

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

function App() {
  const state = useStore();

  const [focused, setFocused] = useState<number>(0);
  const onFocus = (list: List) => {
    setFocused(state.lists.findIndex((l) => l === list));
    document.location.hash = list.key;
  };

  useEffect(() => {
    // add event when document location hash changes
    const listener = () => {
      const hash = document.location.hash;
      let index = state.lists.findIndex((l) => l.key === hash.substring(1));
      if (index === -1) index = state.lists.length - 1;
      setFocused(index);
    };
    window.addEventListener("hashchange", listener);
    return () => window.removeEventListener("hashchange", listener);
  }, [setFocused, state.lists]);

  const onCreateList = () => {
    const newList = { title: "New todo list", key: id(), entries: [] };
    state.lists.push(newList);
  };

  const onDeleteList = (list: List) => {
    const index = state.lists.findIndex((l) => l === list);
    if (index > -1) state.lists.splice(index, 1);
  };

  const now = Date.now();

  const selects = Object.values(state.selections).filter(
    (a) => a && a.name !== myName && a.timestamp > now - 120000,
  ) as Select[];

  return (
    <>
      <Username>
        <UserIcon size={32} icon={<UserOutlined />} />
        <Typography.Text>{myName}</Typography.Text>
      </Username>
      <VerticalList focusedItem={focused}>
        {state.lists.map((list, n) => (
          <TodoList
            onFocus={() => onFocus(list)}
            item={list}
            selects={selects}
            key={list.key}
            onDelete={() => onDeleteList(list)}
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
          />
        ))}
        <AddListButton hoverable onClick={onCreateList}>
          <Result icon={<PlusOutlined />} title="Create a new list" />
        </AddListButton>
      </VerticalList>
    </>
  );
}

const AddListButton = styled(Card)`
  width: 300px;
`;

const UserIcon = styled(Avatar)`
  margin: 6px;
`;

const Username = styled.div`
  position: fixed;
  right: 8px;
  top: 0;
  display: flex;
  align-items: baseline;
`;

export default App;
