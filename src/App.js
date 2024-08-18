import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const apiUrl = 'http://localhost:4000/items';

function ItemList({ items, deleteItem, toggleCartStatus }) {
  return (
    <ul className="item-list">
      {items.map((item) => (
        <li key={item.id} className="item">
          <div>
            <strong>{item.name}</strong> - <em>{item.category}</em>
          </div>
          <button 
            onClick={() => deleteItem(item.id)} 
            className="button delete-button"
          >
            Delete
          </button>
          <button 
            onClick={() => toggleCartStatus(item.id)} 
            className={item.isInCart ? 'button remove-from-cart-button' : 'button add-to-cart-button'}
          >
            {item.isInCart ? 'Remove from Cart' : 'Add to Cart'}
          </button>
        </li>
      ))}
    </ul>
  );
}

function Cart({ cartItems }) {
  return (
    <div className="cart">
      <h2>Cart</h2>
      <ul className="item-list">
        {cartItems.map((item) => (
          <li key={item.id} className="item">{item.name}</li>
        ))}
      </ul>
    </div>
  );
}

function AddItemForm({ addItem }) {
  const [inputName, setInputName] = useState('');
  const [inputCategory, setInputCategory] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputName.trim() && inputCategory.trim()) {
      addItem(inputName, inputCategory);
      setInputName('');
      setInputCategory('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="add-item-form">
      <input
        type="text"
        value={inputName}
        onChange={(e) => setInputName(e.target.value)}
        placeholder="Item name"
        className="input"
      />
      <input
        type="text"
        value={inputCategory}
        onChange={(e) => setInputCategory(e.target.value)}
        placeholder="Category"
        className="input"
      />
      <button type="submit" className="button">
        Add Item
      </button>
    </form>
  );
}

function App() {
  const [items, setItems] = useState([]);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    axios.get(apiUrl).then((response) => setItems(response.data));
  }, []);

  const addItem = (name, category) => {
    const newItem = {
      name,
      category,
      isInCart: false,
    };
    axios.post(apiUrl, newItem).then((response) => {
      setItems([...items, response.data]);
    });
  };

  const deleteItem = (id) => {
    axios.delete(`${apiUrl}/${id}`).then(() => {
      setItems(items.filter((item) => item.id !== id));
      setCart(cart.filter((item) => item.id !== id));
    });
  };

  const toggleCartStatus = (id) => {
    const item = items.find((item) => item.id === id);
    const updatedItem = { ...item, isInCart: !item.isInCart };
    axios.put(`${apiUrl}/${id}`, updatedItem).then(() => {
      setItems(items.map((item) => (item.id === id ? updatedItem : item)));
      setCart(items.filter((item) => item.isInCart));
    });
  };

  return (
    <div className="App">
      <header className="header">
        <h1>My Shopping List</h1>
      </header>
      <main className="main-content">
        <AddItemForm addItem={addItem} />
        <ItemList 
          items={items} 
          deleteItem={deleteItem} 
          toggleCartStatus={toggleCartStatus} 
        />
        <Cart cartItems={items.filter((item) => item.isInCart)} />
      </main>
      <footer className="footer">
        <p>&copy; 2024 My Shopping List</p>
      </footer>
    </div>
  );
}

export default App;
