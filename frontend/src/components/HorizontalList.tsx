import { Space } from "antd";
import { useEffect, useRef } from "react";
import { styled } from "styled-components";

const CARD_WIDTH = 600;

function HorizontalList({
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
      left: window.innerWidth / 2 - CARD_WIDTH / 2 + focusedItem * CARD_WIDTH,
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
  padding: 0 ${CARD_WIDTH}px 0 ${CARD_WIDTH}px;

  align-items: center;
  justify-content: center;
`;

export default HorizontalList;
