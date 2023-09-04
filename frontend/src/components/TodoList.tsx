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
import { List, Select } from "../types";
import { cursorColors } from "../lib";

const TodoList = ({
  onChangeTitle,
  onDeleteListClick,
  onDeleteItem,
  onCheck,
  onAddItem,
  onChangeItem,
  onSelectTitle,
  selects,
  onSelectItem,
  onReorder,
  onToggleLock,
  item,
}: {
  item: List;
  onDeleteListClick: () => void;
  onChangeTitle: (val: string) => void;
  onDeleteItem: (key: string) => void;
  onAddItem: () => void;
  onCheck: (checked: boolean, key: string) => void;
  onChangeItem: (val: string, key: string) => void;
  onSelectTitle: (start: number, end: number) => void;
  selects: Select[];
  onSelectItem: (start: number, end: number, key: string) => void;
  onReorder: (fromIndex: number, toIndex: number) => void;
  onToggleLock: () => void;
}) => {
  const data = item.entries;
  const title = item.title;
  const locked = item.locked;
  const titleSelect = selects.filter((s) => s.key === item.key);

  const onEditPressEnter = (
    e: KeyboardEvent<HTMLInputElement>,
    key: string,
  ) => {
    const input = e.target as HTMLInputElement;
    input.blur();
    if (data.length && data[data.length - 1].key === key) {
      onAddItem();
    }
  };

  const showAddButton = !locked && !data.some((d) => d.title === "");

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

  const onHeaderSelect = (e: any) => {
    const target = e.target as HTMLInputElement;
    onSelectTitle(target.selectionStart || 0, target.selectionEnd || 0);
  };

  const onSelect = (e: any, key: string) => {
    const target = e.target as HTMLInputElement;
    onSelectItem(target.selectionStart || 0, target.selectionEnd || 0, key);
  };

  const dragProps = {
    onDragEnd: onReorder,
    nodeSelector: "li",
    handleSelector: "a",
  };

  const checked = data.filter((node) => node.checked);
  const unchecked = data.filter((node) => !node.checked);

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
      hoverable
      bodyStyle={{ paddingRight: 12, paddingLeft: 12, paddingBottom: 6 }}
    >
      <Row>
        <>
          {titleSelect.map((select, i) => (
            <Cursor
              key={select.name}
              header
              color={cursorColors[i]}
              select={select}
              title={title}
            />
          ))}
          <HeaderInput
            placeholder="Add title"
            value={title}
            bordered={false}
            onChange={locked ? () => { } : (e) => onChangeTitle(e.target.value)}
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
      <ReactDragListView {...dragProps}>
        {unchecked.map((node, i) => (
          <li key={`${i}`}>
            <Item
              locked={locked}
              draggable
              node={node}
              onCheck={onCheck}
              selects={selects}
              onChange={onChangeItem}
              onPressEnter={onEditPressEnter}
              onBlur={onEditBlur}
              onDelete={onDeleteItem}
              onSelect={onSelect}
            />
          </li>
        ))}
      </ReactDragListView>
      {showAddButton && (
        <AddButton onClick={onAddItem} type="link" icon={<PlusOutlined />}>
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
          onClick={onDeleteListClick}
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
  width: 300px;
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
