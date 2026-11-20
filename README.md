# QR Menü

React 18 ve Vite 5 ile geliştirilmiş, mobil uyumlu ve erişilebilir tek sayfalık dijital restoran menüsü uygulaması.

## Özellikler

- **Kategori Gezinimi ve Scroll-Spy:** Sabit üst kategori çubuğu (`Sıcak İçecekler`, `Soğuk İçecekler`, `Fast Food`) ile ilgili bölüme yumuşak kaydırma ve sayfa kaydırma sırasında aktif kategori takibi.
- **Ürün Detay Modalı:** Kart seçimiyle açılan, `Escape` tuşu desteği, klavye odak tuzağı (focus trap) ve kapanışta odağı geri yükleyen erişilebilir modal pencere.
- **Alt Dizin (GitHub Pages) Desteği:** `vite.config.js` içindeki `base: '/QR_Menu/'` ayarıyla uyumlu dinamik görsel yolu çözümleme (`resolveAssetUrl`).
- **Erişilebilirlik ve Duyarlı Tasarım:** Semantik HTML (`<nav>`, `<button>`, `<main>`), WCAG AA kontrast uyumu, `:focus-visible` klavye odak göstergeleri, `prefers-reduced-motion` desteği ve mobil ekran uyumluluğu.

## Gereksinimler

- **Node.js:** `>= 18.18.0`
- **npm:** `>= 9`

## Kurulum ve Komutlar

```bash
# Bağımlılıkları kilit dosyasından temiz kur
npm ci

# Geliştirme sunucusunu başlat
npm run dev

# ESLint denetimini çalıştır
npm run lint

# Birim ve bileşen testlerini çalıştır
npm test

# Üretim derlemesini oluştur (dist/)
npm run build

# Üretim derlemesini yerel olarak önizle
npm run preview
```

> **Not (`base: '/QR_Menu/'`):** `vite.config.js` üretim önizlemesi ve GitHub Pages dağıtımı için `base: '/QR_Menu/'` kullanır. `npm run preview` çalıştırıldığında uygulama `http://localhost:4173/QR_Menu/` adresinden sunulur.

## GitHub Pages Dağıtımı

```bash
npm run deploy
```

`predeploy` kancası otomatik olarak `npm run build` komutunu çalıştırır ve `dist/` klasörünü `gh-pages` dalına yayımlar.

## Dizin Yapısı

```text
QR_Menu/
├── public/
│   └── images/           # Menü ve restoran görselleri
├── src/
│   ├── components/       # Header, CategoryMenu, MenuItem, Modal, ErrorBoundary
│   ├── utils/
│   │   └── assets.js     # Vite BASE_URL uyumlu varlık yolu yardımcısı
│   ├── App.jsx           # Ana uygulama ve kategori scroll-spy mantığı
│   ├── data.js           # Kategoriler ve menü öğeleri
│   ├── index.css         # Uygulama stilleri ve duyarlı kurallar
│   └── main.jsx          # React kök bağlama ve ErrorBoundary sarmalayıcısı
├── tests/
│   ├── menu.test.js      # Veri doğrulama, görsel varlık ve resolveAssetUrl testleri
│   └── components.test.js# Bileşen HTML/a11y ve BASE_URL render testleri
├── eslint.config.js
├── index.html
├── package.json
└── vite.config.js
```

## Menüyü Özelleştirme

Yeni kategori veya ürün eklemek için `src/data.js` dosyasındaki `menuData` dizisini düzenleyebilirsiniz. `public/images/` altına eklediğiniz görselleri `resolveAssetUrl('images/dosya_adi.jpg')` biçiminde referans vererek hem geliştirme hem de `/QR_Menu/` alt dizini derlemelerinde sorunsuz çalışmasını sağlayabilirsiniz.
