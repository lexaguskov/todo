import { Space } from "antd";
import { useEffect, useRef } from "react";
import { styled } from "styled-components";

const CARD_WIDTH = 600;
const GAP = 8;

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
    let scrollX = 0;
    const width = Math.min(window.innerWidth, CARD_WIDTH);
    const offset = (window.innerWidth - width) / 2;
    if (focusedItem >= 0) {
      scrollX = window.innerWidth / 2 + (width + GAP) * focusedItem - offset;
    } else {
      scrollX = offset;
    }
    scrollerRef.current.scrollTo({
      left: scrollX,
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
  padding: 0 50vw 0 50vw;

  align-items: center;
  justify-content: center;
`;

export default HorizontalList;
