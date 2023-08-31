import "./App.css";
import { Tree, Card, Space, Button } from 'antd';
import type { DataNode, TreeProps } from 'antd/es/tree';
import { PlusOutlined } from '@ant-design/icons';

const treeData: DataNode[] = [
  {
    title: 'parent 1',
    key: '0-0',
    children: [
      {
        title: 'parent 1-0',
        key: '0-0-0',
        disabled: true,
        children: [
          {
            title: 'leaf',
            key: '0-0-0-0',
            disableCheckbox: true,
          },
          {
            title: 'leaf',
            key: '0-0-0-1',
          },
        ],
      },
      {
        title: 'parent 1-1',
        key: '0-0-1',
        children: [{ title: <span style={{ color: '#1677ff' }}>sss</span>, key: '0-0-1-0' }],
      },
    ],
  },
];


function App() {
  const onSelect: TreeProps['onSelect'] = (selectedKeys, info) => {
    console.log('selected', selectedKeys, info);
  };

  const onCheck: TreeProps['onCheck'] = (checkedKeys, info) => {
    console.log('onCheck', checkedKeys, info);
  };

  return (
    <Space style={{ width: '100vw', height: '100vh', alignItems: 'center', justifyContent: 'center' }} align="center" >
      <Card title="Default size card" extra={"some text here"} style={{ width: 300 }}>
        <Tree
          checkable
          defaultExpandedKeys={['0-0-0', '0-0-1']}
          defaultSelectedKeys={['0-0-0', '0-0-1']}
          defaultCheckedKeys={['0-0-0', '0-0-1']}
          onSelect={onSelect}
          onCheck={onCheck}
          treeData={treeData}
          draggable
        />
        <Button type="link" icon={<PlusOutlined />}>new entry</Button>
      </Card>
    </Space>
  );
}

export default App;
