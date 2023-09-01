import "./App.css";
import { Tree, Card, Space, Button, Input, Checkbox } from 'antd';
import { PlusOutlined, CloseOutlined } from '@ant-design/icons';
import { KeyboardEvent, MouseEvent, useState } from "react";
import { usePersistedState } from "./usePersistedState";
import { styled } from "styled-components";
// TODO: rewrite as a plain input
// TODO: publish app somewhere
// TODO: tf for server

type Node = {
  title: string;
  key: string;
  checked: boolean;
}

const id = () => Number(Math.random() * 0xffffffff).toString(16);

function App() {
  const [data, setData] = usePersistedState<Node[]>('data', []);

  const onNewDataClick = (e: MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    const entry = { key: id(), title: '', checked: false };
    setData(data => [...data, entry]);
  }

  const onEditChange = (value: string, node: Node) => {
    node.title = value;
    setData(data => [...data]);
  }

  const onChecked = (value: boolean, node: Node) => {
    node.checked = value;
    setData(data => [...data]);
  }

  const onEditPressEnter = (e: KeyboardEvent<HTMLInputElement>, node: Node) => {
    const input = e.target as HTMLInputElement;
    input.blur();
    if (data.length && data[data.length - 1] === node) {
      onNewDataClick({ stopPropagation: () => { } } as MouseEvent<HTMLElement>);
    }
  }

  const onDeleteClick = (e: Node) => {
    setData(data => data.filter(d => d !== e));
  }

  const showAddButton = !data.some(d => d.title === '');

  const onEditBlur = () => {
    setData(data => data.filter(d => d.title !== ''));
  }

  return (
    <Space style={{ width: '100vw', height: '100vh', alignItems: 'center', justifyContent: 'center' }} align="center">
      <Card title="My todo list" extra={""} style={{ width: 300, cursor: 'auto' }} hoverable bodyStyle={{ paddingRight: 12 }}>
        {/* <Tree
          selectable={false}
          checkable
          onClick={onSelect}
          onCheck={onCheck}
          treeData={data}
          draggable
          titleRender={renderItem}
        /> */}
        {data.map(node => (
          <Row>
            <Checkbox checked={node.checked} onChange={(e) => onChecked(e.target.checked, node)} />
            <Input style={{ paddingLeft: 0, flex: 1 }} key={node.key} bordered={false} autoFocus value={node.title as string} onChange={(e) => onEditChange(e.target.value, node)} onPressEnter={(e) => onEditPressEnter(e, node)} onBlur={onEditBlur} />
            {node.title && <DeleteButton type="link" icon={<CloseOutlined />} onClick={() => onDeleteClick(node)} />}
          </Row>)
        )}
        {showAddButton && <Button onClick={onNewDataClick} style={{ padding: 0 }} type="link" icon={<PlusOutlined />}>new entry</Button>}
      </Card>
    </Space>
  );
}

const DeleteButton = styled(Button)`
opacity: 0;
`;

const Row = styled.div`
  width: 100%;
  display: flex;
  gap: 8px;
  &:hover ${DeleteButton} {
    opacity: 1;
  }
`;



export default App;
