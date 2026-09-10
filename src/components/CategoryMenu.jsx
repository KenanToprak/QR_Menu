import React from 'react';

const CategoryMenu = ({ categories, activeCategory, onSelectCategory }) => {
  return (
    <div className="category-menu-container">
      {categories.map((category) => (
        <button
          key={category.id}
          className={`category-button ${activeCategory === category.id ? 'active' : ''}`}
          onClick={() => onSelectCategory(category.id)}
        >
          {category.category}
        </button>
      ))}
    </div>
  );
};

export default CategoryMenu;
