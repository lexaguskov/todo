import "./App.css";
import { Card, Space, Button, Input, Checkbox, Result, Tooltip } from "antd";
import { PlusOutlined, CloseOutlined, DeleteOutlined } from "@ant-design/icons";
import { KeyboardEvent, FocusEvent, useEffect } from "react";
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

const socket = io("http://localhost:3001", {
  transports: ["websocket"],
});
socket.on("connect", () => {
  console.log("connected");
});
socket.on("disconnect", () => {
  console.log("disconnected");
});
socket.on("error", (err) => { });

const id = () => Number(Math.random() * 0xffffffff).toString(16);

function App() {
  const [lists, setLists] = usePersistedState<List[]>("lists", []);

  const onCreateListClick = (listKey: string, emit: boolean = true) => {
    const newList = { title: "New todo list", key: listKey, entries: [] };
    emit && socket.emit("edit", { type: "list.create", listKey });
    setLists((lists) => [...lists, newList]);
  };

  const onSetTitle = (listKey: string, title: string, emit: boolean = true) => {
    // if (title === '' && list.entries.length === 0) {
    //   setLists(lists => lists.filter(l => l !== list));
    //   return;
    // }
    console.log('editing title for list', listKey, title)
    emit && socket.emit("edit", { type: "list.title", title, listKey });
    setLists((lists) => lists.map((l) => (l.key === listKey ? { ...l, title } : l)));
  };

  const onDeleteListClick = (listKey: string, emit: boolean = true) => {
    emit && socket.emit("edit", { type: "list.delete", listKey });
    setLists((lists) => lists.filter((l) => l.key !== listKey));
  };

  const onDeleteItem = (listKey: string, itemKey: string, emit: boolean = true) => {
    emit && socket.emit("edit", {
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

  const onCheck = (listKey: string, checked: boolean, itemKey: string, emit: boolean = true) => {
    emit && socket.emit("edit", {
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

  const onAddItem = (listKey: string, itemKey: string, emit: boolean = true) => {
    emit && socket.emit("edit", { type: "list.item.add", listKey, itemKey });
    const newItem: Node = { key: itemKey, title: "", checked: false };
    setLists((lists) =>
      lists.map((l) =>
        l.key === listKey ? { ...l, entries: [...l.entries, newItem] } : l,
      ),
    );
  };

  const onChangeItem = (listKey: string, val: string, itemKey: string, emit: boolean = true) => {
    emit && socket.emit("edit", {
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

  useEffect(() => {
    socket.on("edit", (msg) => {
      console.log('message', msg)
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
    });

    return () => {
      socket.off("edit");
    }
  }, []);

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
          onDeleteListClick={() => onDeleteListClick(list.key)}
          onChangeTitle={(val) => onSetTitle(list.key, val)}
          title={list.title}
          data={list.entries}
          onDeleteItem={(key) => onDeleteItem(list.key, key)}
          onCheck={(val, key) => onCheck(list.key, val, key)}
          onAddItem={() => onAddItem(list.key, id())}
          onChangeItem={(val, key) => onChangeItem(list.key, val, key)} // TODO: debounce
        />
      ))}
      <Card style={{ width: 300 }} hoverable onClick={() => onCreateListClick(id())}>
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
        <>
          <div style={{ position: 'absolute', fontSize: 20, fontWeight: 500 }}>
            {title.split(" ").map((word, n) => n % 2 ? (word) : <> <Mark>{word}</Mark><Pin><Name>Alexey Guskov</Name></Pin> </>)}
          </div>
          <HeaderInput
            placeholder="Add title"
            value={title}
            bordered={false}
            onChange={(e) => onChangeTitle(e.target.value)}
            onBlur={onTitleEditBlur}
          />
        </>
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
          <ItemInput
            checked={node.checked}
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

const ItemInput = styled(Input)`
  padding-left: 0;
  padding-right: 0;
  flex: 1;
  textOverflow: ellipsis;
  text-decoration: ${p => p.checked ? 'line-through' : 'none'};
  color: ${p => p.checked ? 'grey' : 'auto'};
`;

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

const Mark = styled.mark`
border-radius: 2px;
background-color: lightblue;
`;

const Pin = styled.span`
display: inline-block;
    width: 4px;
    background: lightblue;
    height: 1em;
    position: absolute;
    height: 100%;
    border-radius: 2px;
`

const Name = styled.sup`
  font-size: x-small;
  margin-bottom: 1em;
  position: absolute;
  width: 200px;
  /* margin-left: 5px; */
  bottom: 2em;
  color: lightblue;
`;

export default App;
