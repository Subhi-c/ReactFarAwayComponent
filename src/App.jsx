import { useState } from "react";
import "./index.css";

function App() {
  const [items, setItems] = useState([]);

  function addItems(item) {
    setItems((items) => [...items, item]);
  }
  function DeleteItem(id) {
    setItems((items) => items.filter((item) => item.id != id));
  }
  function toggle(id) {
    setItems((items) =>
      items.map((item) =>
        item.id == id ? { ...item, packed: !item.packed } : item
      )
    );
  }
  function clearList() {
    const confime = window.confirm("Are you sure to delete all items ?");
    if (confime) setItems([]);
  }
  return (
    <>
      <div className="app">
        <Logo />
        <Form onAddItems={addItems} />
        <PackingList
          items={items}
          onDeleteItem={DeleteItem}
          onToggle={toggle}
          onclearList={clearList}
        />
        <Stats items={items} />
      </div>
    </>
  );
}

function Logo() {
  return <h1>🎒 FAR AWAY 🌴 </h1>;
}
function Form({ onAddItems }) {
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState(1);

  function handleSubmit(e) {
    e.preventDefault();
    if (!description) return;
    const newItem = { description, quantity, packed: false, id: Date.now() };
    console.log(newItem);
    onAddItems(newItem);
    setDescription("");
    setQuantity(1);
  }

  return (
    <form className="add-form" onSubmit={handleSubmit}>
      <h3>What do you need for your trip ?</h3>
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
        name="text"
        id="text"
        placeholder="item.."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button>Add</button>
    </form>
  );
}
function PackingList({ items, onDeleteItem, onToggle, onclearList }) {
  const [sortBy, setsortBy] = useState("input");
  let sortedItems;
  if (sortBy == "input") sortedItems = items;
  if (sortBy == "description")
    sortedItems = items
      .slice()
      .sort((a, b) => a.description.localCompare(b.description));

  if (sortBy == "packed")
    sortedItems = items
      .slice()
      .sort((a, b) => Number(a.packed) - Number(b.packed));
  return (
    <div className="list">
      <ul>
        {sortedItems.map((item) => (
          <Item
            item={item}
            key={item.id}
            onDeleteItem={onDeleteItem}
            onToggle={onToggle}
          />
        ))}
      </ul>
      <div className="actions">
        <select value={sortBy} onChange={(e) => setsortBy(e.target.value)}>
          <option value="input">Sort BY input order</option>
          {/* <option value="description">Sort BY description</option> */}
          <option value="packed">Sort BY Packed Status</option>
        </select>
        <button onClick={onclearList}>Clear List</button>
      </div>
    </div>
  );
}

function Item({ item, onDeleteItem, onToggle }) {
  return (
    <li>
      <input
        type="checkbox"
        value={item.packed}
        onChange={() => onToggle(item.id)}
      />
      <span
        style={
          item.packed
            ? {
                textDecoration: "line-through",
              }
            : {}
        }
      >
        {item.quantity} {item.description}
      </span>
      <button onClick={() => onDeleteItem(item.id)}>❌</button>
    </li>
  );
}
function Stats({ items }) {
  if (!items.length)
    return <p className="stats">Start add some items to your packing List</p>;
  const numItems = items.length;
  const numPacked = items.filter((item) => item.packed).length;
  const percentage = Math.round((numPacked / numItems) * 100);
  return (
    <footer className="stats">
      {percentage == 100
        ? "You got everything to go 🎒"
        : `  You have ${numItems} items on your list and you already packed ${numPacked} 
      (${percentage}%) `}
    </footer>
  );
}
export default App;
