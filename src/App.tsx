import "./App.css";
import { Card, Space, Button, Input, Checkbox, Result, Tooltip } from 'antd';
import { PlusOutlined, CloseOutlined, PlusCircleTwoTone, DeleteOutlined } from '@ant-design/icons';
import { KeyboardEvent, MouseEvent, FocusEvent } from "react";
import { usePersistedState } from "./usePersistedState";
import { styled } from "styled-components";
// TODO: rewrite as a plain input
// TODO: publish app somewhere
// TODO: tf for server

type List = {
  title: string;
  key: string;
  entries: Node[];
}
type Node = {
  title: string;
  key: string;
  checked: boolean;
}

const id = () => Number(Math.random() * 0xffffffff).toString(16);

function App() {
  const [lists, setLists] = usePersistedState<List[]>('lists', []);

  const onCreateListClick = () => {
    const newList = { title: 'New todo list', key: id(), entries: [] };
    setLists(lists => [...lists, newList]);
  }

  const onSetData = (list: List, data: Node[]) => {
    setLists(lists => lists.map(l => l === list ? { ...l, entries: data } : l));
  };

  const onSetTitle = (list: List, title: string) => {
    // if (title === '' && list.entries.length === 0) {
    //   setLists(lists => lists.filter(l => l !== list));
    //   return;
    // }
    setLists(lists => lists.map(l => l === list ? { ...l, title } : l));
  }

  const onDeleteListClick = (list: List) => {
    setLists(lists => lists.filter(l => l !== list));
  }

  return (
    <Space style={{ padding: 64, minWidth: '100vw', height: '100vh', alignItems: 'center', justifyContent: 'center' }} align="center">
      {lists.map(list => (<TodoList onDeleteListClick={() => onDeleteListClick(list)} onChangeTitle={(val) => onSetTitle(list, val)} title={list.title} data={list.entries} onSetData={(e) => onSetData(list, e)} />))}
      <Card style={{ width: 300 }} hoverable onClick={onCreateListClick}>
        <Result icon={<PlusOutlined />} title="Create a new list" />
      </Card>
    </Space>
  );
}

const TodoList = ({ title, onChangeTitle, data, onSetData, onDeleteListClick }: { onDeleteListClick: () => void, onChangeTitle: (val: string) => void, title: string, data: Node[], onSetData: (data: Node[]) => void }) => {
  // const [data, setData] = usePersistedState<Node[]>('data', []);

  const onNewDataClick = (e: MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    const entry = { key: id(), title: '', checked: false };
    onSetData([...data, entry]);
  }

  const onEditChange = (value: string, node: Node) => {
    node.title = value;
    onSetData([...data]);
  }

  const onChecked = (value: boolean, node: Node) => {
    node.checked = value;
    onSetData([...data]);
  }

  const onEditPressEnter = (e: KeyboardEvent<HTMLInputElement>, node: Node) => {
    const input = e.target as HTMLInputElement;
    input.blur();
    if (data.length && data[data.length - 1] === node) {
      onNewDataClick({ stopPropagation: () => { } } as MouseEvent<HTMLElement>);
    }
  }

  const onDeleteClick = (e: Node) => {
    onSetData(data.filter(d => d !== e));
  }

  const showAddButton = !data.some(d => d.title === '');

  const onEditBlur = () => {
    onSetData(data.filter(d => d.title !== ''));
  }

  const onTitleEditBlur = (e: FocusEvent<HTMLInputElement>) => {
    if (e.target.value === '' && data.length === 0) {
      onDeleteListClick();
    }
  }

  return (
    <Container style={{ width: 300, cursor: 'auto' }} hoverable bodyStyle={{ paddingRight: 12 }}>
      {/* <Typography.Title style={{ marginTop: 0 }} level={4} >{title}</Typography.Title> */}
      <Row>
        <HeaderInput placeholder="Add title" value={title} bordered={false} onChange={(e) => onChangeTitle(e.target.value)} onBlur={onTitleEditBlur} />
        <Tooltip title="Delete list">
          <DeleteButton icon={<DeleteOutlined />} type="link" onClick={onDeleteListClick} />
        </Tooltip>
      </Row>
      {data.map(node => (
        <Row>
          <Checkbox style={{ paddingRight: 8 }} checked={node.checked} onChange={(e) => onChecked(e.target.checked, node)} />
          <Input style={{ paddingLeft: 0, paddingRight: 0, flex: 1, textOverflow: 'ellipsis' }} key={node.key} bordered={false} autoFocus value={node.title as string} onChange={(e) => onEditChange(e.target.value, node)} onPressEnter={(e) => onEditPressEnter(e, node)} onBlur={onEditBlur} />
          {node.title && <DeleteButton type="link" icon={<CloseOutlined />} onClick={() => onDeleteClick(node)} />}
        </Row>)
      )}
      {showAddButton && <AddButton onClick={onNewDataClick} type="link" icon={<PlusOutlined />}>new entry</AddButton>}
    </Container>
  );
}

const AddButton = styled(Button)`
  padding: 0;
  opacity: 0;
`;

const Container = styled(Card)`
  width: 300px;
  cursor: auto;
  &:hover ${AddButton} {
    opacity: 1;
  }
`;

const HeaderInput = styled(Input)`
  font-size: 20px;
  font-weight: 500;
  padding-left: 0;
  padding-top: 0;
  padding-bottom: 8px;
  text-overflow: ellipsis;
`;

const DeleteButton = styled(Button)`
opacity: 0;
`;

const Row = styled.div`
  width: 100%;
  display: flex;
  &:hover ${DeleteButton} {
    opacity: 1;
  }
`;



export default App;