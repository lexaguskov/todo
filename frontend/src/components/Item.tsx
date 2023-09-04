import { styled } from "styled-components";
import { KeyboardEvent } from "react";
import { CloseOutlined, HolderOutlined } from "@ant-design/icons";
import { Button, Checkbox, Input } from "antd";

import Cursor from "./Cursor";
import { Entry, Select } from "../lib/types";

const Item = ({
  node,
  onCheck,
  selects,
  onChange,
  onPressEnter,
  onBlur,
  onDelete,
  onSelect,
  draggable = false,
  locked = false,
  onIndent,
  onUnindent,
}: {
  node: Entry;
  onCheck: (checked: boolean, key: string) => void;
  selects: Select[];
  onChange: (val: string, key: string) => void;
  onPressEnter: (e: KeyboardEvent<HTMLInputElement>, key: string) => void;
  onBlur: () => void;
  onDelete: (key: string) => void;
  onSelect: (e: any, key: string) => void;
  draggable?: boolean;
  locked?: boolean;
  onIndent: (key: string) => void;
  onUnindent: (key: string) => void;
}) => {
  return (
    <Row key={node.key}>
      {draggable && !locked ? (
        <GrabIcon href="#">
          <HolderOutlined />
        </GrabIcon>
      ) : (
        <span style={{ width: 18 }} />
      )}
      <Checkbox
        style={{ paddingRight: 8 }}
        checked={node.checked}
        onChange={
          locked ? () => {} : (e) => onCheck(e.target.checked, node.key)
        }
      />
      <div style={{ flex: 1 }}>
        {selects
          .filter((select) => select.key === node.key)
          .map((select, i) => (
            <Cursor key={select.name} select={select} title={node.title} />
          ))}
        <ItemInput
          checked={node.checked}
          key={node.key}
          bordered={false}
          autoFocus={node.title === ""}
          value={node.title as string}
          onChange={
            locked ? () => {} : (e) => onChange(e.target.value, node.key)
          }
          onPressEnter={(e) => onPressEnter(e, node.key)}
          onBlur={onBlur}
          onSelect={(e) => onSelect(e, node.key)}
          onKeyDown={(e) => {
            e.stopPropagation();
            if (e.key === "Tab" && !locked) {
              if (e.shiftKey) onUnindent(node.key);
              else onIndent(node.key);
            }
          }}
        />
      </div>
      {!locked && node.title && (
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
