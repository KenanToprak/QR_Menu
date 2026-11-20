import { useState, useEffect, useRef, useCallback } from 'react';
import Header from './components/Header.jsx';
import CategoryMenu from './components/CategoryMenu.jsx';
import MenuItem from './components/MenuItem.jsx';
import Modal from './components/Modal.jsx';
import { menuData } from './data.js';

function App() {
  const [activeCategory, setActiveCategory] = useState(menuData?.[0]?.id ?? '');
  const [selectedItem, setSelectedItem] = useState(null);
  const isProgrammaticScrollRef = useRef(false);
  const scrollTimeoutRef = useRef(null);

  const handleCloseModal = useCallback(() => {
    setSelectedItem(null);
  }, []);

  // Smooth scroll to category section without intermediate scroll-spy flicker
  const handleSelectCategory = useCallback((categoryId) => {
    setActiveCategory(categoryId);
    const element = document.getElementById(categoryId);
    if (!element) return;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    isProgrammaticScrollRef.current = true;
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    const yOffset = -80; // offset for sticky category menu
    const y = Math.max(0, element.getBoundingClientRect().top + window.scrollY + yOffset);
    window.scrollTo({
      top: y,
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    });

    scrollTimeoutRef.current = setTimeout(
      () => {
        isProgrammaticScrollRef.current = false;
      },
      prefersReducedMotion ? 50 : 700
    );
  }, []);

  // Intersection Observer + bottom-of-page fallback to highlight active category on scroll
  useEffect(() => {
    const elements = menuData
      .map((category) => document.getElementById(category.id))
      .filter(Boolean);

    if (elements.length === 0) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        if (isProgrammaticScrollRef.current) return;
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveCategory(entry.target.id);
          }
        });
      },
      { rootMargin: '-100px 0px -60% 0px' }
    );

    elements.forEach((el) => observer.observe(el));

    const handleScroll = () => {
      if (isProgrammaticScrollRef.current || menuData.length === 0) return;
      const reachedBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
      if (reachedBottom) {
        setActiveCategory(menuData[menuData.length - 1].id);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
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

      {selectedItem && (
        <Modal item={selectedItem} onClose={handleCloseModal} />
      )}
    </>
  );
}

export default App;
