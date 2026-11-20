import { resolveAssetUrl } from './utils/assets.js';

export const menuData = [
  {
    category: "Sıcak İçecekler",
    id: "sicak",
    items: [
      {
        id: 1,
        name: "Latte Macchiato",
        description: "Taze çekilmiş espresso, buharla ısıtılmış süt ve yoğun süt köpüğü.",
        price: "85 ₺",
        image: resolveAssetUrl("images/hot_drink.jpg"),
      },
      {
        id: 2,
        name: "Filtre Kahve",
        description: "Özel harman çekirdeklerle demlenmiş yoğun aromalı filtre kahve.",
        price: "60 ₺",
        image: resolveAssetUrl("images/hot_drink.jpg"),
      },
      {
        id: 3,
        name: "Sıcak Çikolata",
        description: "Gerçek Belçika çikolatası ve sıcak sütün enfes uyumu.",
        price: "90 ₺",
        image: resolveAssetUrl("images/hot_drink.jpg"),
      }
    ]
  },
  {
    category: "Soğuk İçecekler",
    id: "soguk",
    items: [
      {
        id: 4,
        name: "Iced Caramel Macchiato",
        description: "Karamel şurubu, soğuk süt, buz ve yoğun espresso.",
        price: "95 ₺",
        image: resolveAssetUrl("images/cold_drink.jpg"),
      },
      {
        id: 5,
        name: "Taze Nane Limonata",
        description: "Taze limon suyu ve taze nane yaprakları ile ferahlatıcı lezzet.",
        price: "75 ₺",
        image: resolveAssetUrl("images/cold_drink.jpg"),
      },
      {
        id: 6,
        name: "Buzlu Çay (Şeftali)",
        description: "Demlenmiş siyah çay ve taze şeftali aroması.",
        price: "65 ₺",
        image: resolveAssetUrl("images/cold_drink.jpg"),
      }
    ]
  },
  {
    category: "Fast Food",
    id: "fastfood",
    items: [
      {
        id: 7,
        name: "Gourmet Burger Menü",
        description: "150 gr. dana köfte, cheddar peyniri, karamelize soğan, patates kızartması ile.",
        price: "240 ₺",
        image: resolveAssetUrl("images/fast_food.jpg"),
      },
      {
        id: 8,
        name: "Crispy Tavuk Burger",
        description: "Çıtır tavuk fileto, marul, özel sos ve patates kızartması.",
        price: "195 ₺",
        image: resolveAssetUrl("images/fast_food.jpg"),
      },
      {
        id: 9,
        name: "Karışık Pizza (Orta)",
        description: "Sucuk, sosis, mantar, yeşil biber, mısır ve bol mozzarella peyniri.",
        price: "280 ₺",
        image: resolveAssetUrl("images/fast_food.jpg"),
      }
    ]
  }
];
