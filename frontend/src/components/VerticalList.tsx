import { Space } from "antd";
import { useEffect, useRef } from "react";
import { styled } from "styled-components";

function VerticalList({
  children,
  focusedItem,
}: {
  children: React.ReactNode[];
  focusedItem: number;
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!scrollerRef.current) return;
    scrollerRef.current.scrollTo({
      left: window.innerWidth / 2 - 300 + focusedItem * 600,
      behavior: "smooth",
    });
  }, [focusedItem]);

  return (
    <Scroller ref={scrollerRef}>
      <Container align="center">{children}</Container>
    </Scroller>
  );
}

const Scroller = styled.div`
  overflow-y: scroll;
  height: 100vh;
  width: 100vw;
  display: flex;
`;

const Container = styled(Space)`
  padding: 0 600px 0 600px;

  align-items: center;
  justify-content: center;
`;

export default VerticalList;
