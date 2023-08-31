import "./App.css";
import { Tree, Card, Space, Button, Input } from 'antd';
import type { DataNode, TreeProps } from 'antd/es/tree';
import { PlusOutlined } from '@ant-design/icons';
import { ChangeEvent, MouseEvent, useState } from "react";

// TODO: publish app somewhere
// TODO: tf for server

const id = () => Number(Math.random() * 0xffffffff).toString(16);

function App() {
  const [data, setData] = useState<DataNode[]>([]);
  const [edit, setEdit] = useState<DataNode | null>(null);

  const onSelect = (e: MouseEvent<HTMLElement>, info: DataNode) => {
    e.stopPropagation();
    // console.log('selected', selectedKeys, info);
    const found = data.find(d => d.key === info.key);
    if (found) setEdit(found);
  };

  const onCheck: TreeProps['onCheck'] = (checkedKeys, info) => {
    console.log('onCheck', checkedKeys, info);
  };

  const onNewDataClick = (e: MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    const entry = { key: id(), title: '' };
    setEdit(entry);
    setData(data => [...data, entry]);
  }

  const onEditChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!edit) return;
    edit.title = e.target.value;
    setData(data => [...data]);
  }

  const onEditPressEnter = () => {
    setEdit(null);
  }

  const renderItem = (node: DataNode) => node === edit ? <Input bordered={false} style={{ padding: 0 }} autoFocus value={node.title as string} onAbort={onEditPressEnter} onChange={onEditChange} onPressEnter={onEditPressEnter} /> : <>{node.title}</>

  return (
    <Space style={{ width: '100vw', height: '100vh', alignItems: 'center', justifyContent: 'center' }} align="center" onClick={onEditPressEnter}>
      <Card title="Default size card" extra={"some text here"} style={{ width: 300 }} onClick={onEditPressEnter}>
        <Tree
          selectable={false}
          checkable
          onClick={onSelect}
          onCheck={onCheck}
          treeData={data}
          draggable
          titleRender={renderItem}
        />
        {(edit && edit.title === '') ? null : <Button onClick={onNewDataClick} type="link" icon={<PlusOutlined />}>new entry</Button>}
      </Card>
    </Space>
  );
}

export default App;
