/**
 * This sample adds an item to a ListView every 200ms.
 * After 1s, it attempts to scroll to bottom which will crash the ListView.
 */
import React from 'react';
import './styles.css';
import {
  defaultTheme,
  Item,
  ListView,
  Provider
} from '@adobe/react-spectrum';

function* range(start: number, end: number) {
  for (let i = start; i <= end; i++) {
    yield i;
  }
}

function createItem(id: number) {
  return {id, name: `${id}`};
}

let initialItems = [...range(1, 400)].map(createItem);

export default function App() {
  const [items] = React.useState(initialItems);

  return (
    <Provider theme={defaultTheme}>
      <div>
        <ListView aria-label="Pick an animal" items={items}>
          {(item) => <Item key={item.id}>{item.name}</Item>}
        </ListView>
      </div>
    </Provider>
  );
}
