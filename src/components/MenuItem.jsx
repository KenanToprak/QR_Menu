import React from 'react';

const MenuItem = ({ item, onClick }) => {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick(item);
    }
  };

  return (
    <div
      className="menu-item"
      role="button"
      tabIndex={0}
      onClick={() => onClick(item)}
      onKeyDown={handleKeyDown}
    >
      <img src={item.image} alt={item.name} className="menu-item-img" />
      <div className="menu-item-content">
        <div className="menu-item-header">
          <h3 className="menu-item-title">{item.name}</h3>
          <span className="menu-item-price">{item.price}</span>
        </div>
        <p className="menu-item-desc">{item.description}</p>
      </div>
    </div>
  );
};

export default MenuItem;
