import "./App.css";
import { Card, Space, Button, Input, Checkbox, Result, Tooltip } from "antd";
import { PlusOutlined, CloseOutlined, DeleteOutlined } from "@ant-design/icons";
import { KeyboardEvent, MouseEvent, FocusEvent } from "react";
import { usePersistedState } from "./usePersistedState";
import { styled } from "styled-components";
import io from "socket.io-client";
// TODO: publish app somewhere
// TODO: tf for server

type List = {
  title: string;
  key: string;
  entries: Node[];
};
type Node = {
  title: string;
  key: string;
  checked: boolean;
};

const socket = io("http://localhost:3001");
socket.on("connect", () => {
  console.log("connected");
});
socket.on("disconnect", () => {
  console.log("disconnected");
});
socket.on("message", (data) => {
  console.log(data);
});
socket.on("error", (err) => {});

const id = () => Number(Math.random() * 0xffffffff).toString(16);

function App() {
  const [lists, setLists] = usePersistedState<List[]>("lists", []);

  const onCreateListClick = () => {
    const newList = { title: "New todo list", key: id(), entries: [] };
    setLists((lists) => [...lists, newList]);
  };

  const onSetData = (list: List, data: Node[]) => {
    setLists((lists) =>
      lists.map((l) => (l === list ? { ...l, entries: data } : l)),
    );
  };

  const onSetTitle = (list: List, title: string) => {
    // if (title === '' && list.entries.length === 0) {
    //   setLists(lists => lists.filter(l => l !== list));
    //   return;
    // }
    socket.emit("edit", { type: "list.title", title, key: list.key });
    setLists((lists) => lists.map((l) => (l === list ? { ...l, title } : l)));
  };

  const onDeleteListClick = (list: List) => {
    socket.emit("edit", { type: "list.delete", key: list.key });
    setLists((lists) => lists.filter((l) => l !== list));
  };

  const onDeleteItem = (list: List, key: string) => {
    socket.emit("edit", {
      type: "list.item.delete",
      key: list.key,
      itemKey: key,
    });
    setLists((lists) =>
      lists.map((l) =>
        l === list
          ? { ...l, entries: l.entries.filter((e) => e.key !== key) }
          : l,
      ),
    );
  };

  const onCheck = (list: List, checked: boolean, key: string) => {
    socket.emit("edit", {
      type: "list.item.check",
      key: list.key,
      itemKey: key,
      checked,
    });
    setLists((lists) =>
      lists.map((l) =>
        l === list
          ? {
              ...l,
              entries: l.entries.map((e) =>
                e.key === key ? { ...e, checked } : e,
              ),
            }
          : l,
      ),
    );
  };

  const onAddItem = (list: List) => {
    socket.emit("edit", { type: "list.item.add", key: list.key });
    const newItem: Node = { key: id(), title: "", checked: false };
    setLists((lists) =>
      lists.map((l) =>
        l === list ? { ...l, entries: [...l.entries, newItem] } : l,
      ),
    );
  };

  const onChangeItem = (list: List, val: string, key: string) => {
    socket.emit("edit", {
      type: "list.item.title",
      key: list.key,
      itemKey: key,
      title: val,
    });
    setLists((lists) =>
      lists.map((l) =>
        l === list
          ? {
              ...l,
              entries: l.entries.map((e) =>
                e.key === key ? { ...e, title: val } : e,
              ),
            }
          : l,
      ),
    );
  };

  return (
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
        <TodoList
          key={list.key}
          onDeleteListClick={() => onDeleteListClick(list)}
          onChangeTitle={(val) => onSetTitle(list, val)}
          title={list.title}
          data={list.entries}
          onDeleteItem={(key) => onDeleteItem(list, key)}
          onCheck={(val, key) => onCheck(list, val, key)}
          onAddItem={() => onAddItem(list)}
          onChangeItem={(val, key) => onChangeItem(list, val, key)} // TODO: debounce
        />
      ))}
      <Card style={{ width: 300 }} hoverable onClick={onCreateListClick}>
        <Result icon={<PlusOutlined />} title="Create a new list" />
      </Card>
    </Space>
  );
}

const TodoList = ({
  title,
  onChangeTitle,
  data,
  onDeleteListClick,
  onDeleteItem,
  onCheck,
  onAddItem,
  onChangeItem,
}: {
  onDeleteListClick: () => void;
  onChangeTitle: (val: string) => void;
  title: string;
  data: Node[];
  onDeleteItem: (key: string) => void;
  onAddItem: () => void;
  onCheck: (checked: boolean, key: string) => void;
  onChangeItem: (val: string, key: string) => void;
}) => {
  const onEditPressEnter = (e: KeyboardEvent<HTMLInputElement>, node: Node) => {
    const input = e.target as HTMLInputElement;
    input.blur();
    if (data.length && data[data.length - 1] === node) {
      onAddItem();
    }
  };

  const showAddButton = !data.some((d) => d.title === "");

  const onEditBlur = () => {
    // delete empty items from list
    for (const d of data) {
      if (d.title === "") onDeleteItem(d.key);
    }
  };

  const onTitleEditBlur = (e: FocusEvent<HTMLInputElement>) => {
    if (e.target.value === "" && data.length === 0) {
      onDeleteListClick();
    }
  };

  return (
    <Container
      style={{ width: 300, cursor: "auto" }}
      hoverable
      bodyStyle={{ paddingRight: 12 }}
    >
      {/* <Typography.Title style={{ marginTop: 0 }} level={4} >{title}</Typography.Title> */}
      <Row>
        <HeaderInput
          placeholder="Add title"
          value={title}
          bordered={false}
          onChange={(e) => onChangeTitle(e.target.value)}
          onBlur={onTitleEditBlur}
        />
        <Tooltip title="Delete list">
          <DeleteButton
            icon={<DeleteOutlined />}
            type="link"
            onClick={onDeleteListClick}
          />
        </Tooltip>
      </Row>
      {data.map((node) => (
        <Row key={node.key}>
          <Checkbox
            style={{ paddingRight: 8 }}
            checked={node.checked}
            onChange={(e) => onCheck(e.target.checked, node.key)}
          />
          <Input
            style={{
              paddingLeft: 0,
              paddingRight: 0,
              flex: 1,
              textOverflow: "ellipsis",
            }}
            key={node.key}
            bordered={false}
            autoFocus
            value={node.title as string}
            onChange={(e) => onChangeItem(e.target.value, node.key)}
            onPressEnter={(e) => onEditPressEnter(e, node)}
            onBlur={onEditBlur}
          />
          {node.title && (
            <DeleteButton
              type="link"
              icon={<CloseOutlined />}
              onClick={() => onDeleteItem(node.key)}
            />
          )}
        </Row>
      ))}
      {showAddButton && (
        <AddButton onClick={onAddItem} type="link" icon={<PlusOutlined />}>
          new entry
        </AddButton>
      )}
    </Container>
  );
};

const AddButton = styled(Button)`
  padding: 0;
  opacity: 0;
`;

const Container = styled(Card)`
  width: 300px;
  cursor: auto;
  &:hover ${AddButton} {
    opacity: 1;
  }
`;

const HeaderInput = styled(Input)`
  font-size: 20px;
  font-weight: 500;
  padding-left: 0;
  padding-top: 0;
  padding-bottom: 8px;
  text-overflow: ellipsis;
`;

const DeleteButton = styled(Button)`
  opacity: 0;
`;

const Row = styled.div`
  width: 100%;
  display: flex;
  &:hover ${DeleteButton} {
    opacity: 1;
  }
`;

// socket.connect();

export default App;
