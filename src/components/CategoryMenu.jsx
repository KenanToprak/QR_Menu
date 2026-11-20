const CategoryMenu = ({ categories, activeCategory, onSelectCategory }) => {
  return (
    <nav className="category-menu-container" aria-label="Menü kategorileri">
      {categories.map((category) => {
        const isActive = activeCategory === category.id;
        return (
          <button
            key={category.id}
            type="button"
            className={`category-button ${isActive ? 'active' : ''}`}
            aria-current={isActive ? 'true' : undefined}
            onClick={() => onSelectCategory(category.id)}
          >
            {category.category}
          </button>
        );
      })}
    </nav>
  );
};

export default CategoryMenu;
