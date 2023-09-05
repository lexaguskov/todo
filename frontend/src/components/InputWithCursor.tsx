import { Input, InputProps } from "antd";
import { Select } from "../lib/types";
import { styled } from "styled-components";
import Cursor from "./Cursor";
import useStore, { awareness, useUsername } from "../lib/store";
import { useUsers } from 'y-presence';
import { Presense } from '../lib/types';

const SELECTION_LIFETIME_SEC = 120;

const InputWithCursor = ({
  checked = false,
  id,
  value,
  header = false,
  rightAligned = false,
  ...props
}: {
  header?: boolean;
  rightAligned?: boolean;
  id: string;
  checked?: boolean;
  value: string;
} & InputProps) => {
  // const state = useStore();

  const now = Math.floor(Date.now() / 1000);

  const myName = useUsername();
  const users = useUsers(awareness) || {};

  // js Map users to array
  const ids = Array.from(users.keys());
  const selects = ids.map(id => users.get(id)).filter(
    (a) => a &&
      a?.selection?.name !== myName &&
      a?.selection?.key === id &&
      a?.selection?.timestamp > now - SELECTION_LIFETIME_SEC,
  ) as { selection: Select, name: string }[];

  const onSelect = (e: any) => {
    const target = e.target as HTMLInputElement;
    const start = target.selectionStart || 0;
    const end = target.selectionEnd || 0;

    awareness.setLocalStateField("selection", {
      key: id,
      start,
      end,
      timestamp: Date.now(),
    });
  };

  const Component = header ? HeaderInput : ItemInput;

  return (
    <Container>
      {selects.map((select) => (
        <Cursor
          rightAligned={rightAligned}
          header={header}
          key={select.name}
          start={select.selection.start}
          end={select.selection.end}
          name={select.name}
          value={value}
        />
      ))}
      <Component
        checked={checked}
        bordered={false}
        value={value}
        onSelect={onSelect}
        {...props}
      />
    </Container>
  );
};

const Container = styled.div`
  flex: 1;
`;

const ItemInput = styled(Input)`
  padding-left: 0;
  padding-right: 0;
  flex: 1;
  text-overflow: ellipsis;
  text-decoration: ${(p) => (p.checked ? "line-through" : "none")};
  color: ${(p) => (p.checked ? "grey" : "auto")};
`;

const HeaderInput = styled(ItemInput)`
  font-size: 20px;
  font-weight: 500;
  padding-bottom: 8px;
`;

export default InputWithCursor;
