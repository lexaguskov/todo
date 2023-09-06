import { Input, InputProps } from "antd";
import { styled } from "styled-components";
import Cursor from "./Cursor";
import { setSelection } from "../lib/store";
import useSelectionsForField from "../hooks/useSelectionsForField";

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
  const selects = useSelectionsForField(id);

  const onSelect = (e: any) => {
    const target = e.target as HTMLInputElement;
    const start = target.selectionStart || 0;
    const end = target.selectionEnd || 0;

    setSelection({
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
