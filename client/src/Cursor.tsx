import styled from 'styled-components';

const Cursor = ({
  title,
  select,
  color,
  header = false,
}: {
  title: string;
  select: { start: number; end: number; name: string };
  color: string;
  header?: boolean;
}) => (<Container header={header}>
  {title.substring(0, select.start)}
  <Mark color={color}>
    {title.substring(select.start, select.end)}
  </Mark>
  <Pin color={color}>
    <Name color={color}>{select.name}</Name>
  </Pin>
  {title.substring(select.end)}
</Container>
);

const Container = styled.div<{ header: boolean }>`
  position: absolute;
  font-size: ${(p) => p.header ? 20 : 14}px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0);
`;

const Mark = styled.mark`
  border-radius: 2px;
  background-color: ${(p) => p.color};
  color: rgba(0, 0, 0, 0);
`;

const Pin = styled.span`
  display: inline-block;
  width: 4px;
  background: ${(p) => p.color};
  position: absolute;
  height: 100%;
  border-radius: 2px;
`;

const Name = styled.sup`
  font-size: x-small;
  margin-bottom: 1em;
  position: absolute;
  white-space: nowrap;
  bottom: 2em;
  color: ${(p) => p.color};
  background: white;
`;

export default Cursor;