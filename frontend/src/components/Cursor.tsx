import styled from "styled-components";

export const colors = [
  "lightblue",
  "lightgreen",
  "lightcoral",
  "lightpink",
  "lightsalmon",
  "lightskyblue",
  "lightsteelblue",
];

const knownNames: { [name: string]: string } = {};
function getColor(name: string): string {
  if (knownNames[name]) {
    return knownNames[name];
  }
  const color = colors[Math.floor(Math.random() * colors.length)];
  knownNames[name] = color;
  return color;
}

const Cursor = ({
  value = "",
  start,
  end,
  name,
  header = false,
  rightAligned = false,
}: {
  value: string;
  start: number;
  end: number;
  name: string;
  header?: boolean;
  rightAligned?: boolean;
}) => {
  const color = getColor(name);
  return (
    <Container $header={header} $right={rightAligned}>
      {value.substring(0, start)}
      <Mark color={color}>
        <Name $right={rightAligned} $header={header} color={color}>
          {name}
        </Name>
        {value.substring(start, end)}
      </Mark>
    </Container>
  );
};

const Container = styled.div<{ $header: boolean; $right: boolean }>`
  position: absolute;
  font-size: ${(p) => (p.$header ? 20 : 14)}px;
  font-weight: ${(p) => (p.$header ? 500 : "normal")};
  color: rgba(0, 0, 0, 0);
  padding-top: ${(p) => (p.$header ? 0 : 4)}px;
  height: ${(p) => (p.$header ? "auto" : "1.1em")};
  right: ${(p) => (p.$right ? "48px" : "unset")};
`;

const Mark = styled.mark`
  border-radius: 2px;
  background-color: ${(p) => p.color};
  color: rgba(0, 0, 0, 0);
  margin-left: -2px;
  margin-right: -2px;
  padding: 2px;
`;

const Name = styled.sup<{ $header: Boolean; $right: boolean }>`
  font-size: x-small;
  margin-bottom: 1em;
  position: absolute;
  white-space: nowrap;
  bottom: ${(p) => (p.$header ? 2 : 0.5)}em;
  color: ${(p) => p.color};
  background: white;
  right: ${(p) => (p.$right ? "0" : "unset")};
`;

export default Cursor;
