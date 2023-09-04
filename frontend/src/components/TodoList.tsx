import styled from "styled-components";
import { Button, Card, Collapse, Divider, Input } from "antd";
import {
  DeleteOutlined,
  PlusOutlined,
  LockOutlined,
  UnlockOutlined,
} from "@ant-design/icons";
import { FocusEvent, KeyboardEvent } from "react";
import ReactDragListView from "react-drag-listview";

import Cursor from "./Cursor";
import Item from "./Item";
import { List, Select, Entry } from "../lib/types";
import { id } from "../lib/store";

const cloneEntry = (entry: Entry): Entry => {
  const { key, title, checked, children = [] } = entry;
  return { key, title, checked, children: children.map(cloneEntry) };
};

const TodoList = ({
  onDelete,
  onFocus,
  onSelectTitle,
  selects,
  onSelectItem,
  onToggleLock,
  item,
}: {
  onFocus: () => void;
  item: List;
  onDelete: () => void;
  onSelectTitle: (start: number, end: number) => void;
  selects: Select[];
  onSelectItem: (start: number, end: number, key: string) => void;
  onToggleLock: () => void;
}) => {
  const data = item.entries;
  const title = item.title;
  const locked = item.locked;
  const titleSelect = selects.filter((s) => s.key === item.key);

  const flatList: { indent: number; entry: Entry; parent: Entry[] }[] = [];
  const traverse = (entries: Entry[], indent: number) => {
    for (const entry of entries) {
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

  const onCheck = (checked: boolean, itemKey: string) => {
    const entry = flatList.find((node) => node.entry.key === itemKey);
    if (!entry) return;
    entry.entry.checked = checked;
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

  const onChangeItem = (val: string, itemKey: string) => {
    const entry = flatList.find((e) => e.entry.key === itemKey);
    if (entry) entry.entry.title = val;
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

  const onEditBlur = () => {
    // delete empty items from list
    // for (const d of data) {
    //   if (d.title === "") onDeleteItem(d.key);
    // }
  };

  const onTitleEditBlur = (e: FocusEvent<HTMLInputElement>) => {
    if (e.target.value === "" && data.length === 0) {
      onDelete();
    }
  };

  const onHeaderSelect = (e: any) => {
    const target = e.target as HTMLInputElement;
    onSelectTitle(target.selectionStart || 0, target.selectionEnd || 0);
  };

  const onSelect = (e: any, key: string) => {
    const target = e.target as HTMLInputElement;
    onSelectItem(target.selectionStart || 0, target.selectionEnd || 0, key);
  };

  const onDragEnd = (fromIndex: number, toIndex: number) => {
    const fromEntry = flatList[fromIndex];
    const toEntry = flatList[toIndex];
    if (!fromEntry || !toEntry) return;

    const copy = cloneEntry(fromEntry.entry);
    fromEntry.parent.splice(fromEntry.parent.indexOf(fromEntry.entry), 1);
    toEntry.parent.splice(toEntry.parent.indexOf(toEntry.entry), 0, copy);
  };

  const checked = data.filter((node) => node.checked);
  const unchecked = data.filter((node) => !node.checked);

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

  const checkedItems = checked.map((node, i) => (
    <li key={`${i}`}>
      <Item
        locked={locked}
        node={node}
        onCheck={onCheck}
        selects={selects}
        onChange={onChangeItem}
        onPressEnter={onEditPressEnter}
        onBlur={onEditBlur}
        onDelete={onDeleteItem}
        onSelect={onSelect}
        onIndent={onIndent}
        onUnindent={onUnindent}
      />
    </li>
  ));
  const collapsed = [
    {
      key: "1",
      label: `${checked.length} checked items`,
      children: checkedItems,
    },
  ];

  return (
    <Container
      onClick={onFocus}
      hoverable
      bodyStyle={{ paddingRight: 12, paddingLeft: 12, paddingBottom: 6 }}
    >
      <Row>
        <>
          {titleSelect.map((select, i) => (
            <Cursor key={select.name} header select={select} title={title} />
          ))}
          <HeaderInput
            placeholder="Add title"
            value={title}
            bordered={false}
            onChange={locked ? () => {} : (e) => onChangeTitle(e.target.value)}
            onBlur={onTitleEditBlur}
            onSelect={onHeaderSelect}
          />
          {locked && (
            <LockOutlined
              style={{ fontSize: 20, margin: "0 4px 8px 0", color: "#aaa" }}
            />
          )}
        </>
      </Row>
      <ReactDragListView
        onDragEnd={onDragEnd}
        nodeSelector="li"
        handleSelector="a"
      >
        {flatList.map((node) => (
          <li key={node.entry.key} style={{ paddingLeft: node.indent * 18 }}>
            <Item
              locked={locked}
              draggable
              node={node.entry}
              onCheck={onCheck}
              selects={selects}
              onChange={onChangeItem}
              onPressEnter={onEditPressEnter}
              onBlur={onEditBlur}
              onDelete={onDeleteItem}
              onSelect={onSelect}
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
      {unchecked.length > 0 && checked.length > 0 && (
        <Divider style={{ marginTop: 4, marginBottom: 4 }} />
      )}

      {checked.length > 3 ? (
        <CustomCollapse ghost items={collapsed} />
      ) : (
        checkedItems
      )}
      <Toolbar>
        {locked ? (
          <DeleteButton
            icon={<UnlockOutlined />}
            type="link"
            onClick={onToggleLock}
          >
            Unlock
          </DeleteButton>
        ) : (
          <DeleteButton
            icon={<LockOutlined />}
            type="link"
            onClick={onToggleLock}
          >
            Lock
          </DeleteButton>
        )}
        <DeleteButton
          disabled={locked}
          icon={<DeleteOutlined />}
          type="link"
          danger
          onClick={onDelete}
        >
          Delete
        </DeleteButton>
      </Toolbar>
    </Container>
  );
};

const CustomCollapse = styled(Collapse)`
  & .ant-collapse-item .ant-collapse-header {
    padding-top: 4px;
    padding-bottom: 4px;
    color: gray;
  }
  & .ant-collapse-item .ant-collapse-content-box {
    padding: 0;
    padding-block: 0 !important;
  }
`;

const AddButton = styled(Button)`
  padding: 0 0 0 18px;
  opacity: 0;
`;

const DeleteButton = styled(Button)`
  opacity: 0;
`;

const Container = styled(Card)`
  width: 600px;
  cursor: auto;
  &:hover ${AddButton} {
    opacity: 1;
  }
  &:hover ${DeleteButton} {
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

const Row = styled.div`
  width: 100%;
  display: flex;
  &:hover ${DeleteButton} {
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
