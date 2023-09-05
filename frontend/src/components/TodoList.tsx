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
import ReactDragListView from "react-drag-listview";

import Item from "./Item";
import { List, Entry } from "../lib/types";
import { id } from "../lib/store";
import InputWithCursor from "./InputWithCursor";

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

  const flatList: { indent: number; entry: Entry; parent: Entry[] }[] = [];
  const traverse = (entries: Entry[], indent: number) => {
    for (const entry of entries) {
      // if (entry.checked && entry.children.length === 0) continue;
      flatList.push({ entry, indent, parent: entries });
      traverse(entry.children, indent + 1);
    }
  };
  traverse(data, 0);

  const onChangeTitle = (val: string) => {
    item.title = val;
  };

  const onDeleteItem = (itemKey: string) => {
    const entry = flatList.find((node) => node.entry.key === itemKey);
    if (!entry) return;
    entry.parent.splice(entry.parent.indexOf(entry.entry), 1);
  };

  const onAddItem = (afterKey?: string) => {
    const newItem: Entry = {
      key: id(),
      title: "",
      checked: false,
      children: [],
    };
    if (afterKey) {
      const prev = flatList.find((e) => e.entry.key === afterKey);
      if (!prev) return;
      if (prev.entry.checked) newItem.checked = true;
      prev.parent.splice(prev.parent.indexOf(prev.entry) + 1, 0, newItem);
    } else {
      item.entries.push(newItem);
    }
  };

  const onEditPressEnter = (
    e: KeyboardEvent<HTMLInputElement>,
    key: string,
  ) => {
    const input = e.target as HTMLInputElement;
    input.blur();
    onAddItem(key);
  };

  const showAddButton = !locked && !data.some((d) => d.title === "");

  const onTitleEditBlur = (e: FocusEvent<HTMLInputElement>) => {
    if (e.target.value === "" && data.length === 0) {
      onDelete();
    }
  };

  const onDragEnd = (fromIndex: number, toIndex: number) => {
    const fromEntry = flatList[fromIndex];
    const toEntry = flatList[toIndex];
    if (!fromEntry || !toEntry) return;

    const copy = cloneEntry(fromEntry.entry);
    fromEntry.parent.splice(fromEntry.parent.indexOf(fromEntry.entry), 1);
    toEntry.parent.splice(toEntry.parent.indexOf(toEntry.entry), 0, copy);
  };

  const [showchecked, setShowChecked] = useState(true);
  const toggleShowChecked = () => setShowChecked((s) => !s);

  const onIndent = (key: string) => {
    const index = flatList.findIndex((node) => node.entry.key === key);
    const entry = flatList[index];
    if (!entry) return;

    const indent = entry.indent;
    let newParent: Entry | null = null;
    // find item in flatList with index<index and indent === indent
    for (let i = index - 1; i >= 0; i--) {
      if (flatList[i].indent > indent) continue;
      newParent = flatList[i].entry;
      break;
    }
    if (!newParent) return;
    if (newParent.children === entry.parent) return;

    // remove from current parent
    const copy = cloneEntry(entry.entry);
    entry.parent.splice(entry.parent.indexOf(entry.entry), 1);

    // add to a new parent
    newParent.children.push(copy);
  };

  const onUnindent = (key: string) => {
    const index = flatList.findIndex((node) => node.entry.key === key);
    const entry = flatList[index];
    if (!entry) return;

    if (entry.indent === 0) return;

    const indent = entry.indent;
    let newParent: Entry[] | null = null;
    // find item in flatList with index<index and indent === indent
    for (let i = index - 1; i >= 0; i--) {
      if (flatList[i].indent >= indent) continue;
      newParent = flatList[i].parent;
      break;
    }
    if (!newParent) return;

    // remove from current parent
    const copy = cloneEntry(entry.entry);
    entry.parent.splice(entry.parent.indexOf(entry.entry), 1);

    newParent.push(copy);
  };

  const onToggleLock = () => {
    item.locked = !item.locked;
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
      <ReactDragListView
        onDragEnd={onDragEnd}
        nodeSelector="li"
        handleSelector="span.grab-icon"
      >
        {flatList.map((node) => (
          <li key={node.entry.key} style={{ paddingLeft: node.indent * 18 }}>
            <Item
              hideChecked={!showchecked}
              locked={locked}
              draggable
              node={node.entry}
              onPressEnter={onEditPressEnter}
              onDelete={onDeleteItem}
              onIndent={onIndent}
              onUnindent={onUnindent}
            />
          </li>
        ))}
      </ReactDragListView>
      {showAddButton && (
        <AddButton
          onClick={() => onAddItem()}
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
          <HiddenButton
            icon={<UnlockOutlined />}
            type="link"
            onClick={onToggleLock}
          >
            Unlock
          </HiddenButton>
        ) : (
          <HiddenButton
            icon={<LockOutlined />}
            type="link"
            onClick={onToggleLock}
          >
            Lock
          </HiddenButton>
        )}
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
