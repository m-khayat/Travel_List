import React, { useState } from "react";
import "./index.css";

function App() {
  const [items, setItems] = useState([]);
  const numOfItem = items.length;
  const numOfCheckedItem = items.filter((item) => item.packed).length;
  const percent = (numOfCheckedItem / numOfItem) * 100;

  function handleAddItems(item) {
    setItems((items) => [...items, item]);
  }

  function handleDeleteItem(id) {
    setItems((items) => items.filter((item) => item.id !== id));
  }

  function handleCheckedItem(id) {
    setItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, packed: !item.packed } : item
      )
    );
  }

  function clearList() {
    if (items.length > 0) {
      const confermed = window.confirm(
        "are you sure you want to clear your list"
      );
      if (confermed) setItems([]);
    }
  }
  return (
    <div>
      <Logo />
      <Form onAddItems={handleAddItems} />
      <PackingList
        items={items}
        onDeleteItem={handleDeleteItem}
        onCheckedItem={handleCheckedItem}
        clearList={clearList}
      />
      <Stats
        numOfItem={numOfItem}
        numOfCheckedItem={numOfCheckedItem}
        percent={percent}
      />
    </div>
  );
}

function Logo() {
  return <h1>🌴 far away 🍸</h1>;
}

function Form(props) {
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState(1);

  function handleSubmit(e) {
    e.preventDefault();
    if (!description) return;
    const newItem = {
      id: Date.now(),
      description: description,
      quantity: quantity,
      packed: false,
    };
    props.onAddItems(newItem);
    setDescription("");
    setQuantity(1);
  }

  return (
    <form className="add-form " onSubmit={handleSubmit}>
      <h3>what do you need for your trip?</h3>
      <select
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
      >
        {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
          <option value={num} key={num}>
            {num}
          </option>
        ))}
      </select>
      <input
        type="text"
        placeholder="item"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      ></input>
      <button>Add</button>
    </form>
  );
}

function PackingList(props) {
  const [sortBy, setSortBy] = useState("input");
  let sortedItem;
  if (sortBy === "input") sortedItem = props.items;
  if (sortBy === "description") {
    sortedItem = props.items
      .slice()
      .sort((a, b) => a.description.localeCompare(b.description));
  }

  if (sortBy === "packed") {
    sortedItem = props.items
      .slice()
      .sort((a, b) => Number(a.packed) - Number(b.packed));
  }
  return (
    <div className="list">
      <ul>
        {sortedItem.map((item) => (
          <Item
            item={item}
            onDeleteItem={props.onDeleteItem}
            onCheckedItem={props.onCheckedItem}
            key={item.id}
          />
        ))}
      </ul>
      <div className="actions">
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="input"> sort by input </option>
          <option value="description"> sort by description </option>
          <option value="packed"> sort by packed status </option>
        </select>
        <button onClick={props.clearList}>CLEAR LIST</button>
      </div>
    </div>
  );
}

function Item(props) {
  // function handleChechItem() {
  //   props.item.packed == !props.item.packed;
  // }
  return (
    <li>
      <input
        type="checkbox"
        value={props.item.packed}
        onChange={() => props.onCheckedItem(props.item.id)}
      />

      <span style={props.item.packed ? { textDecoration: "line-through" } : {}}>
        {props.item.quantity} {props.item.description}
      </span>
      <button onClick={() => props.onDeleteItem(props.item.id)}>❌</button>
    </li>
  );
}

function Stats(props) {
  return (
    <footer className="stats">
      {props.percent == 100 ? (
        <em>You got everything! Ready to go🛫</em>
      ) : (
        <em>
          💼 You have {props.numOfItem} items on your list, and you already
          packed -{props.numOfCheckedItem}- items (
          {Math.floor(props.percent) > 0 ? Math.floor(props.percent) : 0}%)
        </em>
      )}
    </footer>
  );
}
export default App;
