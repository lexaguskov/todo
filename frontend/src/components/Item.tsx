import { styled } from "styled-components";
import { KeyboardEvent } from "react";
import { CloseOutlined, HolderOutlined } from "@ant-design/icons";
import { Button, Checkbox } from "antd";

import { Entry } from "../lib/types";
import InputWithCursor from "./InputWithCursor";
import { CheckboxChangeEvent } from "antd/es/checkbox";

const Item = ({
  node,
  onPressEnter,
  onDelete,
  draggable = false,
  locked = false,
  onIndent,
  onUnindent,
  hideChecked = false,
  hideUnchecked = false,
}: {
  node: Entry;
  onPressEnter: (e: KeyboardEvent<HTMLInputElement>, key: string) => void;
  onDelete: (key: string) => void;
  draggable?: boolean;
  locked?: boolean;
  onIndent: (key: string) => void;
  onUnindent: (key: string) => void;
  hideChecked?: boolean;
  hideUnchecked?: boolean;
}) => {
  let totalComplete = 0;
  let totalIncomplete = 0;

  const traverseChildren = (entry: Entry) => {
    if (entry.children.length) {
      let on = 0;
      let off = 0;
      for (const child of entry.children) {
        const [onChild, offChild] = traverseChildren(child);
        on += onChild;
        off += offChild;
      }
      return [on, off];
    }

    if (entry.checked) {
      totalComplete += entry.price || 0;
    } else {
      totalIncomplete += entry.price || 0;
    }

    return entry.checked ? [1, 0] : [0, 1];
  };
  const [onChildren, offChildren] = traverseChildren(node);
  const checked = onChildren > offChildren && offChildren === 0;
  const unchecked = offChildren > onChildren && onChildren === 0;

  if (hideChecked && checked) return null;
  if (hideUnchecked && unchecked) return null;

  const hasChildren = node.children.length > 0;

  const onCheck = (e: CheckboxChangeEvent) => {
    if (locked) return;
    const checkRecursive = (entry: Entry, checked: boolean) => {
      entry.checked = checked;
      for (const child of entry.children) {
        checkRecursive(child, checked);
      }
    };
    checkRecursive(node, e.target.checked);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (locked) return;
    e.stopPropagation();
    if (e.key === "Tab" && !locked) {
      if (e.shiftKey) onUnindent(node.key);
      else onIndent(node.key);
    }
  };

  return (
    <Container key={node.key}>
      {draggable && !locked ? (
        <GrabIcon className="grab-icon">
          <HolderOutlined />
        </GrabIcon>
      ) : (
        <DragPlaceholder />
      )}
      <Check
        indeterminate={onChildren > 0 && offChildren > 0}
        checked={checked}
        onChange={onCheck}
      />
      <InputWithCursor
        readOnly={locked}
        checked={checked}
        id={node.key}
        autoFocus={node.title === ""}
        value={node.title as string}
        onChange={(e) => {
          node.title = e.target.value;
        }}
        onPressEnter={(e) => onPressEnter(e, node.key)}
        onKeyDown={onKeyDown}
      />
      {!hasChildren && (
        <PriceContainer>
          <PriceInput
            style={{ opacity: isNaN(node.price as any) ? 0 : 1 }}
            readOnly={locked}
            rightAligned
            id={node.key + ".price"}
            checked={checked}
            autoFocus={node.price === 0}
            value={node.price ? "$" + node.price : ("$" as string)}
            onChange={(e) =>
              (node.price = parseFloat(e.target.value.replace("$", "")))
            }
          />
        </PriceContainer>
      )}
      {hasChildren && totalComplete + totalIncomplete ? (
        <PriceContainer>
          <PriceInput
            readOnly
            rightAligned
            id={node.key + ".price"}
            checked={checked}
            value={
              totalComplete || totalIncomplete
                ? `$${totalComplete} of $${totalComplete + totalIncomplete}`
                : `$${totalComplete + totalIncomplete}`
            }
          />
        </PriceContainer>
      ) : null}
      {!locked && (
        <DeleteButton
          type="link"
          icon={<CloseOutlined />}
          onClick={() => onDelete(node.key)}
        />
      )}
    </Container>
  );
};

const PriceContainer = styled.span`
  text-align: right;
`;

const DragPlaceholder = styled.span`
  width: 18px;
`;

const Check = styled(Checkbox)`
  padding-right: 8px;
`;

const GrabIcon = styled.span`
  opacity: 0;
  display: flex;
  padding: 4px 4px 4px 0;
  cursor: move;
  color: gray;
`;

const DeleteButton = styled(Button)`
  opacity: 0;
`;

const Container = styled.div`
  width: 100%;
  display: flex;
  &:hover ${DeleteButton} {
    opacity: 1;
  }
  &:hover ${GrabIcon} {
    opacity: 1;
  }
`;

const PriceInput = styled(InputWithCursor)`
  text-align: right;
  margin-right: 4px;
  width: 80%;
  &:hover {
    opacity: 1 !important;
  }
`;

export default Item;
