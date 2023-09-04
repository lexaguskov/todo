import "./App.css";
import { Card, Space, Result, Avatar, Typography } from "antd";
import { PlusOutlined, UserOutlined } from "@ant-design/icons";
import { useMemo } from "react";

import TodoList from "./components/TodoList";
import { Select } from "./lib/types";
import { styled } from "styled-components";

import useStore, { id } from "./lib/store";

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

  const onCreateListClick = (listKey: string) => {
    const newList = { title: "New todo list", key: listKey, entries: [] };
    state.lists.push(newList);
  };

  const onDeleteListClick = (listKey: string) => {
    const index = state.lists.findIndex((l) => l.key === listKey);
    if (index > -1) state.lists.splice(index, 1);
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
            onDelete={() => onDeleteListClick(list.key)}
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
  padding: 0 600px 0 600px;

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
