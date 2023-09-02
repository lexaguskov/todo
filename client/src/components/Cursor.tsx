import styled from "styled-components";

const Cursor = ({
  title = "",
  select,
  color,
  header = false,
}: {
  title: string;
  select: { start: number; end: number; name: string };
  color: string;
  header?: Boolean;
}) => (
  <Container $header={header}>
    {title.substring(0, select.start)}
    <Mark color={color}>
      <Name $header={header} color={color}>
        {select.name}
      </Name>
      {title.substring(select.start, select.end)}
    </Mark>
  </Container>
);

const Container = styled.div<{ $header: Boolean }>`
  position: absolute;
  font-size: ${(p) => (p.$header ? 20 : 14)}px;
  font-weight: ${(p) => (p.$header ? 500 : "normal")};
  color: rgba(0, 0, 0, 0);
  padding-top: ${(p) => (p.$header ? 0 : 4)}px;
  height: ${(p) => (p.$header ? "auto" : "1.1em")};
`;

const Mark = styled.mark`
  border-radius: 2px;
  background-color: ${(p) => p.color};
  color: rgba(0, 0, 0, 0);
  margin-left: -2px;
  margin-right: -2px;
  padding: 2px;
`;

const Name = styled.sup<{ $header: Boolean }>`
  font-size: x-small;
  margin-bottom: 1em;
  position: absolute;
  white-space: nowrap;
  bottom: ${(p) => (p.$header ? 2 : 0.5)}em;
  color: ${(p) => p.color};
  background: white;
`;

export default Cursor;
