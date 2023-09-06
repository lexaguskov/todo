import styled from "styled-components";
import { Button, Card } from "antd";
import {
  DeleteOutlined,
  PlusOutlined,
  LockOutlined,
  UnlockOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
} from "@ant-design/icons";
import { FocusEvent, KeyboardEvent, useState } from "react";

import Item from "./Item";
import { List, Entry } from "../lib/types";
import { id, useUserId } from "../lib/store";
import InputWithCursor from "./InputWithCursor";
import Tree from "./Tree";

const cloneEntry = (entry: Entry): Entry => {
  const { key, title, checked, children = [], price } = entry;
  return { key, title, checked, children: children.map(cloneEntry), price };
};

const TodoList = ({
  onDelete,
  onFocus,
  item,
}: {
  onFocus: () => void;
  item: List;
  onDelete: () => void;
}) => {
  const data = item.entries;
  const title = item.title;
  const locked = item.locked;
  const [myId] = useUserId();

  const onChangeTitle = (val: string) => {
    item.title = val;
  };

  const onDeleteItem = (item: Entry, parent: Entry[]) => {
    parent.splice(parent.indexOf(item), 1);
  };

  const onAddItem = (after: Entry | null, parent: Entry[]) => {
    const newItem: Entry = {
      key: id(),
      title: "",
      checked: false,
      children: [],
    };
    if (after) {
      if (after.checked) newItem.checked = true;
      parent.splice(parent.indexOf(after) + 1, 0, newItem);
    } else {
      parent.push(newItem);
    }
  };

  const onEditPressEnter = (
    ev: KeyboardEvent<HTMLInputElement>,
    e: Entry,
    parent: Entry[],
  ) => {
    const input = ev.target as HTMLInputElement;
    input.blur();
    onAddItem(e, parent);
  };

  const showAddButton = !locked && !data.some((d) => d.title === "");

  const onTitleEditBlur = (e: FocusEvent<HTMLInputElement>) => {
    if (e.target.value === "" && data.length === 0) {
      onDelete();
    }
  };

  const [showchecked, setShowChecked] = useState(true);
  const toggleShowChecked = () => setShowChecked((s) => !s);

  const onToggleLock = () => {
    item.locked = !item.locked;
  };

  const onMoveItem = (
    entry: Entry,
    fromParent: Entry[],
    toParent: Entry[],
    toIndex: number,
  ) => {
    const copy = cloneEntry(entry);
    fromParent.splice(fromParent.indexOf(entry), 1);
    if (toIndex === -1) toParent.push(copy);
    else toParent.splice(toIndex, 0, copy);
  };

  return (
    <Container
      onClick={onFocus}
      hoverable
      bodyStyle={{ paddingRight: 12, paddingLeft: 12, paddingBottom: 6 }}
    >
      <Row>
        <InputWithCursor
          header
          id={item.key}
          placeholder="Add title"
          value={title}
          onChange={locked ? () => {} : (e) => onChangeTitle(e.target.value)}
          onBlur={onTitleEditBlur}
        />
        {locked && <Lock />}
      </Row>
      <Tree
        data={data}
        onMove={onMoveItem}
        renderItem={(
          e: Entry,
          parent: Entry[],
          { onIndent, onUnindent }: { onIndent: any; onUnindent: any },
        ) => (
          <Item
            hideChecked={!showchecked}
            locked={locked}
            draggable
            node={e}
            onPressEnter={(event) => onEditPressEnter(event, e, parent)}
            onDelete={() => onDeleteItem(e, parent)}
            onIndent={onIndent}
            onUnindent={onUnindent}
          />
        )}
      />
      {showAddButton && (
        <AddButton
          onClick={() => onAddItem(null, data)}
          type="link"
          icon={<PlusOutlined />}
        >
          new entry
        </AddButton>
      )}
      <Toolbar>
        <HiddenButton
          icon={showchecked ? <EyeInvisibleOutlined /> : <EyeOutlined />}
          type="link"
          onClick={toggleShowChecked}
        >
          {showchecked ? "Hide checked" : "Show checked"}
        </HiddenButton>
        {locked ? (
          myId === item.author ? (
            <HiddenButton
              icon={<UnlockOutlined />}
              type="link"
              onClick={onToggleLock}
            >
              Unlock
            </HiddenButton>
          ) : (
            <HiddenButton icon={<LockOutlined />} type="link" disabled>
              Locked by {item.author}
            </HiddenButton>
          )
        ) : null}
        {!locked && myId === item.author ? (
          <HiddenButton
            icon={<LockOutlined />}
            type="link"
            onClick={onToggleLock}
          >
            Lock
          </HiddenButton>
        ) : null}
        <HiddenButton
          disabled={locked}
          icon={<DeleteOutlined />}
          type="link"
          danger
          onClick={onDelete}
        >
          Delete
        </HiddenButton>
      </Toolbar>
    </Container>
  );
};

const Lock = styled(LockOutlined)`
  font-size: 20px;
  margin: 0 4px 8px 0;
  color: #aaa;
`;

const AddButton = styled(Button)`
  padding: 0 0 0 18px;
  opacity: 0;
`;

const HiddenButton = styled(Button)`
  opacity: 0;
`;

const Container = styled(Card)`
  max-width: 100vw;
  width: 600px;
  cursor: auto;
  &:hover ${AddButton} {
    opacity: 1;
  }
  &:hover ${HiddenButton} {
    opacity: 1;
  }
`;

const Row = styled.div`
  width: 100%;
  display: flex;
  &:hover ${HiddenButton} {
    opacity: 1;
  }
  padding-left: 18px;
  width: auto;
`;

const Toolbar = styled.div`
  position: absolute;
  right: 0;
  left: 0;
  bottom: -40px;
  display: flex;
  justify-content: center;
`;

export default TodoList;
