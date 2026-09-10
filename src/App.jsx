import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import CategoryMenu from './components/CategoryMenu';
import MenuItem from './components/MenuItem';
import Modal from './components/Modal';
import { menuData } from './data';

function App() {
  const [activeCategory, setActiveCategory] = useState(menuData[0].id);
  const [selectedItem, setSelectedItem] = useState(null);
  const sectionRefs = useRef([]);

  // Smooth scroll to category section
  const handleSelectCategory = (categoryId) => {
    setActiveCategory(categoryId);
    const element = document.getElementById(categoryId);
    if (element) {
      const yOffset = -80; // offset for sticky category menu
      const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  // Intersection Observer to highlight active category on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveCategory(entry.target.id);
          }
        });
      },
      { rootMargin: '-100px 0px -60% 0px' }
    );

    // Collect element references once
    const elements = menuData
      .map((category) => document.getElementById(category.id))
      .filter(Boolean);

    sectionRefs.current = elements;
    elements.forEach((el) => observer.observe(el));

    return () => {
      sectionRefs.current.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <>
      <Header />
      <CategoryMenu
        categories={menuData}
        activeCategory={activeCategory}
        onSelectCategory={handleSelectCategory}
      />

      <main className="main-content">
        {menuData.map((category) => (
          <section key={category.id} id={category.id} className="category-section">
            <h2 className="category-title">{category.category}</h2>
            <div className="menu-items-list">
              {category.items.map((item) => (
                <MenuItem
                  key={item.id}
                  item={item}
                  onClick={setSelectedItem}
                />
              ))}
            </div>
          </section>
        ))}
      </main>

      {/* Modal for item details */}
      {selectedItem && (
        <Modal item={selectedItem} onClose={() => setSelectedItem(null)} />
      )}
    </>
  );
}

export default App;
