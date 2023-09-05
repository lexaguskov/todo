import { ReactNode } from "react";
import { Entry } from "../lib/types";
import ReactDragListView from "react-drag-listview";

const Tree = ({
  data,
  renderItem,
  onMove,
}: {
  data: Entry[];
  renderItem: (
    e: Entry,
    parent: Entry[],
    props: {
      onIndent: (key: string) => void;
      onUnindent: (key: string) => void;
    },
  ) => ReactNode;
  onMove: (
    item: Entry,
    fromParent: Entry[],
    toParent: Entry[],
    toIndex: number,
  ) => void;
}) => {
  const flatList: { indent: number; entry: Entry; parent: Entry[] }[] = [];
  const traverse = (entries: Entry[], indent: number) => {
    for (const entry of entries) {
      // if (entry.checked && entry.children.length === 0) continue;
      flatList.push({ entry, indent, parent: entries });
      traverse(entry.children, indent + 1);
    }
  };
  traverse(data, 0);

  const onIndent = (key: string) => {
    const index = flatList.findIndex((node) => node.entry.key === key);
    const entry = flatList[index];
    if (!entry) return;

    const indent = entry.indent;
    let newParent: Entry | null = null;
    // find item in flatList with index<index and indent === indent
    for (let i = index - 1; i >= 0; i--) {
      if (flatList[i].indent > indent) continue;
      newParent = flatList[i].entry;
      break;
    }
    if (!newParent) return;
    if (newParent.children === entry.parent) return;

    onMove(entry.entry, entry.parent, newParent.children, -1);
  };

  const onUnindent = (key: string) => {
    const index = flatList.findIndex((node) => node.entry.key === key);
    const entry = flatList[index];
    if (!entry) return;

    if (entry.indent === 0) return;

    const indent = entry.indent;
    let newParent: Entry[] | null = null;
    // find item in flatList with index<index and indent === indent
    for (let i = index - 1; i >= 0; i--) {
      if (flatList[i].indent >= indent) continue;
      newParent = flatList[i].parent;
      break;
    }
    if (!newParent) return;

    onMove(entry.entry, entry.parent, newParent, -1);
  };

  const onDragEnd = (fromIndex: number, toIndex: number) => {
    const fromEntry = flatList[fromIndex];
    const toEntry = flatList[toIndex];
    if (!fromEntry || !toEntry) return;

    onMove(
      fromEntry.entry,
      fromEntry.parent,
      toEntry.parent,
      toEntry.parent.indexOf(toEntry.entry),
    );
  };

  return (
    <ReactDragListView
      onDragEnd={onDragEnd}
      nodeSelector="li"
      handleSelector="span.grab-icon"
    >
      {flatList.map((node) => (
        <li key={node.entry.key} style={{ paddingLeft: node.indent * 18 }}>
          {renderItem(node.entry, node.parent, { onIndent, onUnindent })}
        </li>
      ))}
    </ReactDragListView>
  );
};

export default Tree;
