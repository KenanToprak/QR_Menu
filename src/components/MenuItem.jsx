const MenuItem = ({ item, onClick }) => {
  return (
    <button
      type="button"
      className="menu-item"
      onClick={() => onClick(item)}
    >
      <img
        src={item.image}
        alt={item.name}
        className="menu-item-img"
        loading="lazy"
      />
      <div className="menu-item-content">
        <div className="menu-item-header">
          <h3 className="menu-item-title">{item.name}</h3>
          <span className="menu-item-price">{item.price}</span>
        </div>
        <p className="menu-item-desc">{item.description}</p>
      </div>
    </button>
  );
};

export default MenuItem;
