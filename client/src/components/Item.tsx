import { styled } from "styled-components";
import { KeyboardEvent } from "react";
import { CloseOutlined, HolderOutlined } from "@ant-design/icons";
import { Button, Checkbox, Input } from "antd";

import Cursor from "./Cursor";
import { Node, Select } from "../types";
import { cursorColors } from "../lib";

const Item = ({
  node,
  onCheck,
  selects,
  onChange,
  onPressEnter,
  onBlur,
  onDelete,
  onSelect,
}: {
  node: Node;
  onCheck: (checked: boolean, key: string) => void;
  selects: Select[];
  onChange: (val: string, key: string) => void;
  onPressEnter: (e: KeyboardEvent<HTMLInputElement>, key: string) => void;
  onBlur: () => void;
  onDelete: (key: string) => void;
  onSelect: (e: any, key: string) => void;
}) => {
  return (
    <Row key={node.key}>
      <GrabIcon href="#">
        <HolderOutlined />
      </GrabIcon>
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
              key={select.name}
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
    </Row>
  );
};

const ItemInput = styled(Input)`
  padding-left: 0;
  padding-right: 0;
  flex: 1;
  textoverflow: ellipsis;
  text-decoration: ${(p) => (p.checked ? "line-through" : "none")};
  color: ${(p) => (p.checked ? "grey" : "auto")};
`;

const GrabIcon = styled.a`
  opacity: 0;
  display: flex;
  padding: 4px 4px 4px 0;
  cursor: move;
  color: gray;
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
  &:hover ${GrabIcon} {
    opacity: 1;
  }
`;

export default Item;
