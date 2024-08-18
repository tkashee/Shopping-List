import React from 'react';

function Filter({ category, onCategoryChange }) {
  function handleCategoryChange(e) {
    onCategoryChange(e.target.value);
  }

  return (
    <div className="Filter">
      <select value={category} onChange={handleCategoryChange}>
        <option>All</option>
        <option>Produce</option>
        <option>Dairy</option>
        <option>Bakery</option>
      </select>
    </div>
  );
}

export default Filter;
