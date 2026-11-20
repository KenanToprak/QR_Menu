import { resolveAssetUrl } from '../utils/assets.js';

const Header = () => {
  return (
    <header className="header-container">
      <div className="logo-container">
        <img src={resolveAssetUrl('images/restaurant_logo.jpg')} alt="Restoran Logosu" />
      </div>
      <h1 className="restaurant-name">QR MENU</h1>
    </header>
  );
};

export default Header;
