import React, { useEffect, useRef } from 'react';

const Modal = ({ item, onClose }) => {
  const previousOverflow = useRef('');

  useEffect(() => {
    // Save and restore the previous overflow value
    previousOverflow.current = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow.current;
    };
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!item) return null;

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Kapat">×</button>
        <img src={item.image} alt={item.name} className="modal-img" />
        <div className="modal-body">
          <div className="modal-title-row">
            <h2 className="modal-title">{item.name}</h2>
            <span className="modal-price">{item.price}</span>
          </div>
          <p className="modal-desc">{item.description}</p>
        </div>
      </div>
    </div>
  );
};

export default Modal;
