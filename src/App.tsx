import "./App.css";
import { Tree, Card, Space, Button, Input, Checkbox } from 'antd';
import { PlusOutlined, CloseOutlined } from '@ant-design/icons';
import { KeyboardEvent, MouseEvent, useState } from "react";
import { usePersistedState } from "./usePersistedState";
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
  const [edit, setEdit] = useState<Node | null>(null);

  const onSelect = (e: MouseEvent<HTMLElement>, info: Node) => {
    e.stopPropagation();
    // console.log('selected', selectedKeys, info);
    const found = data.find(d => d.key === info.key);
    if (found) setEdit(found);
  };

  // const onCheck: TreeProps['onCheck'] = (checkedKeys, info) => {
  //   console.log('onCheck', checkedKeys, info);
  // };

  const onNewDataClick = (e: MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    const entry = { key: id(), title: '', checked: false };
    setEdit(entry);
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

  const onEditPressEnter = (e: KeyboardEvent<HTMLInputElement>) => {
    const input = e.target as HTMLInputElement;
    input.blur();
  }

  // const renderItem = (node: Node) => node === edit ? <Input bordered={false} style={{ padding: 0 }} autoFocus value={node.title as string} onAbort={onEditPressEnter} onChange={onEditChange} onPressEnter={onEditPressEnter} /> : <>{node.title}</>

  const onFocus = (e: Node) => {
    setEdit(e);
  }

  const onDeleteClick = (e: Node) => {
    setData(data => data.filter(d => d !== e));
  }

  const showAddButton = !data.some(d => d.title === '');

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
          <div style={{ width: '100%', display: 'flex', gap: 8 }} >
            <Checkbox checked={node.checked} onChange={(e) => onChecked(e.target.checked, node)} />
            <Input style={{ paddingLeft: 0, flex: 1 }} key={node.key} bordered={false} autoFocus value={node.title as string} onChange={(e) => onEditChange(e.target.value, node)} onPressEnter={onEditPressEnter} />
            {node.title && <Button type="link" icon={<CloseOutlined />} onClick={() => onDeleteClick(node)}></Button>}
          </div>)
        )}
        {showAddButton && <Button onClick={onNewDataClick} style={{ padding: 0 }} type="link" icon={<PlusOutlined />}>new entry</Button>}
      </Card>
    </Space>
  );
}

export default App;
