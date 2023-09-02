import styled from "styled-components";
import { Button, Card, Checkbox, Input, Tooltip } from "antd";
import { CloseOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { FocusEvent, KeyboardEvent } from "react";
import Cursor from "./Cursor";
import { Node, Select } from "./types";

const cursorColors = [
  "lightblue",
  "lightgreen",
  "lightcoral",
  "lightpink",
  "lightsalmon",
  "lightskyblue",
  "lightsteelblue",
];

const TodoList = ({
  title,
  onChangeTitle,
  data,
  onDeleteListClick,
  onDeleteItem,
  onCheck,
  onAddItem,
  onChangeItem,
  onSelectTitle,
  titleSelect,
  selects,
  onSelectItem,
}: {
  onDeleteListClick: () => void;
  onChangeTitle: (val: string) => void;
  title: string;
  data: Node[];
  onDeleteItem: (key: string) => void;
  onAddItem: () => void;
  onCheck: (checked: boolean, key: string) => void;
  onChangeItem: (val: string, key: string) => void;
  onSelectTitle: (start: number, end: number) => void;
  titleSelect: Select[];
  selects: Select[];
  onSelectItem: (start: number, end: number, key: string) => void;
}) => {
  const onEditPressEnter = (e: KeyboardEvent<HTMLInputElement>, key: string) => {
    const input = e.target as HTMLInputElement;
    input.blur();
    if (data.length && data[data.length - 1].key === key) {
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
    onSelectTitle(-1, -1);
  };

  const onHeaderSelect = (e: any) => {
    const target = e.target as HTMLInputElement;
    onSelectTitle(target.selectionStart || 0, target.selectionEnd || 0);
  };

  const onSelect = (e: any, key: string) => {
    const target = e.target as HTMLInputElement;
    onSelectItem(target.selectionStart || 0, target.selectionEnd || 0, key);
  };

  return (
    <Container hoverable bodyStyle={{ paddingRight: 12 }}>
      <Row>
        <>
          {titleSelect.map((select, i) => (
            <Cursor
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
            onChange={(e) => onChangeTitle(e.target.value)}
            onBlur={onTitleEditBlur}
            onSelect={onHeaderSelect}
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
        <Item
          node={node}
          onCheck={onCheck}
          selects={selects}
          onChange={onChangeItem}
          onPressEnter={onEditPressEnter}
          onBlur={onEditBlur}
          onDelete={onDeleteItem}
          onSelect={onSelect}
        />
      ))}
      {showAddButton && (
        <AddButton onClick={onAddItem} type="link" icon={<PlusOutlined />}>
          new entry
        </AddButton>
      )}
    </Container>
  );
};

const Item = ({ node, onCheck, selects, onChange, onPressEnter, onBlur, onDelete, onSelect }:
  {
    node: Node,
    onCheck: (checked: boolean, key: string) => void,
    selects: Select[],
    onChange: (val: string, key: string) => void,
    onPressEnter: (e: KeyboardEvent<HTMLInputElement>, key: string) => void,
    onBlur: () => void,
    onDelete: (key: string) => void,
    onSelect: (e: any, key: string) => void,
  }) => {
  return (
    <Row key={node.key}>
      <Checkbox
        style={{ paddingRight: 8 }}
        checked={node.checked}
        onChange={(e) => onCheck(e.target.checked, node.key)}
      />
      <div style={{ flex: 1 }}>
        {selects
          .filter((select) => select.key === node.key)
          .map((select, i) => (
            <Cursor
              color={cursorColors[i]}
              select={select}
              title={node.title}
            />
          ))}
        <ItemInput
          checked={node.checked}
          key={node.key}
          bordered={false}
          autoFocus
          value={node.title as string}
          onChange={(e) => onChange(e.target.value, node.key)}
          onPressEnter={(e) => onPressEnter(e, node.key)}
          onBlur={onBlur}
          onSelect={(e) => onSelect(e, node.key)}
        />
      </div>
      {node.title && (
        <DeleteButton
          type="link"
          icon={<CloseOutlined />}
          onClick={() => onDelete(node.key)}
        />
      )}
    </Row>)
};

const ItemInput = styled(Input)`
  padding-left: 0;
  padding-right: 0;
  flex: 1;
  textoverflow: ellipsis;
  text-decoration: ${(p) => (p.checked ? "line-through" : "none")};
  color: ${(p) => (p.checked ? "grey" : "auto")};
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

export default TodoList;
