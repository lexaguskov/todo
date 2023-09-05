import { Input, InputProps } from "antd";
import { Select } from "../lib/types";
import { styled } from "styled-components";
import Cursor from "./Cursor";
import useStore, { myName } from "../lib/store";

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
  const state = useStore();

  const now = Math.floor(Date.now() / 1000);

  const selects = Object.values(state.selections).filter(
    (a) =>
      a &&
      a.name !== myName &&
      a.key === id &&
      a.timestamp > now - SELECTION_LIFETIME_SEC,
  ) as Select[];

  const onSelect = (e: any) => {
    const target = e.target as HTMLInputElement;
    const start = target.selectionStart || 0;
    const end = target.selectionEnd || 0;

    state.selections[myName] = {
      name: myName,
      key: id,
      start,
      end,
      timestamp: Date.now(),
    };
  };

  const Component = header ? HeaderInput : ItemInput;

  return (
    <Container>
      {selects.map((select) => (
        <Cursor
          rightAligned={rightAligned}
          header={header}
          key={select.name}
          select={select}
          title={value}
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
