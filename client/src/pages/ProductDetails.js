import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useLanguage } from "../context/LanguageContext";
import "./ProductDetails.css";

const API = "https://alonpc02026.onrender.com/api/products";
const WHATSAPP_NUMBER = "972545221809";

const translations = {
  he: {
    loading: "טוען מוצר...", loadError: "לא ניתן לטעון את המוצר", back: "חזרה לחנות",
    product: "מוצר", image: "מוצר", picture: "תמונה", askPrice: "מחיר לפי בירור",
    oldPrice: "מחיר קודם", inStock: "✅ במלאי", outOfStock: "❌ אזל מהמלאי",
    description: "תיאור", specifications: "מפרט", warranty: "אחריות", condition: "מצב",
    addToCart: "הוסף לעגלה", whatsappOrder: "הזמנה ב־WhatsApp",
    waHello: "שלום אלון, אני מעוניין/ת במוצר:", waProduct: "מוצר",
    waBrand: "מותג", waModel: "דגם", waPrice: "מחיר", waLink: "קישור"
  },
  en: {
    loading: "Loading product...", loadError: "Unable to load the product", back: "Back to shop",
    product: "Product", image: "Product", picture: "Image", askPrice: "Price on request",
    oldPrice: "Previous price", inStock: "✅ In stock", outOfStock: "❌ Out of stock",
    description: "Description", specifications: "Specifications", warranty: "Warranty", condition: "Condition",
    addToCart: "Add to cart", whatsappOrder: "Order on WhatsApp",
    waHello: "Hello Alon, I am interested in this product:", waProduct: "Product",
    waBrand: "Brand", waModel: "Model", waPrice: "Price", waLink: "Link"
  },
  ru: {
    loading: "Загрузка товара...", loadError: "Не удалось загрузить товар", back: "Назад в магазин",
    product: "Товар", image: "Товар", picture: "Изображение", askPrice: "Цена по запросу",
    oldPrice: "Предыдущая цена", inStock: "✅ В наличии", outOfStock: "❌ Нет в наличии",
    description: "Описание", specifications: "Характеристики", warranty: "Гарантия", condition: "Состояние",
    addToCart: "Добавить в корзину", whatsappOrder: "Заказать в WhatsApp",
    waHello: "Здравствуйте, Алон. Меня интересует товар:", waProduct: "Товар",
    waBrand: "Бренд", waModel: "Модель", waPrice: "Цена", waLink: "Ссылка"
  },
  ar: {
    loading: "جارٍ تحميل المنتج...", loadError: "تعذر تحميل المنتج", back: "العودة إلى المتجر",
    product: "منتج", image: "منتج", picture: "صورة", askPrice: "السعر عند الاستفسار",
    oldPrice: "السعر السابق", inStock: "✅ متوفر", outOfStock: "❌ نفد من المخزون",
    description: "الوصف", specifications: "المواصفات", warranty: "الضمان", condition: "الحالة",
    addToCart: "أضف إلى السلة", whatsappOrder: "الطلب عبر واتساب",
    waHello: "مرحبًا ألون، أنا مهتم بهذا المنتج:", waProduct: "المنتج",
    waBrand: "العلامة", waModel: "الطراز", waPrice: "السعر", waLink: "الرابط"
  },
  am: {
    loading: "ምርቱ በመጫን ላይ...", loadError: "ምርቱን መጫን አልተቻለም", back: "ወደ ሱቅ ተመለስ",
    product: "ምርት", image: "ምርት", picture: "ምስል", askPrice: "ዋጋ በጥያቄ",
    oldPrice: "የቀድሞ ዋጋ", inStock: "✅ አለ", outOfStock: "❌ ከክምችት አልቋል",
    description: "መግለጫ", specifications: "ዝርዝር", warranty: "ዋስትና", condition: "ሁኔታ",
    addToCart: "ወደ ጋሪ ጨምር", whatsappOrder: "በWhatsApp ይዘዙ",
    waHello: "ሰላም አሎን፣ ይህን ምርት እፈልጋለሁ፦", waProduct: "ምርት",
    waBrand: "ብራንድ", waModel: "ሞዴል", waPrice: "ዋጋ", waLink: "አገናኝ"
  }
};

function ProductDetails() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { language, dir, locale } = useLanguage();
  const text = translations[language] || translations.he;
  const [product, setProduct] = useState(null);
  const [message, setMessage] = useState(text.loading);
  const [selectedImage, setSelectedImage] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    setMessage(text.loading);

    async function loadProduct() {
      try {
        const response = await fetch(`${API}/${id}`, { signal: controller.signal });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(data.message || text.loadError);

        setProduct(data);
        setSelectedImage(data.imageUrl || data.gallery?.[0] || "");
        setMessage("");
      } catch (error) {
        if (error.name === "AbortError") return;
        setProduct(null);
        setMessage(`❌ ${error.message}`);
      }
    }

    loadProduct();
    return () => controller.abort();
  }, [id, text.loading, text.loadError]);

  const formatPrice = (price) => {
    const number = Number(price);
    return Number.isFinite(number) ? number.toLocaleString(locale) : price || "";
  };

  if (message) {
    return (
      <main className="product-details-page" dir={dir}>
        <p className="product-details-status">{message}</p>
        <Link to="/shop">{text.back}</Link>
      </main>
    );
  }

  if (!product) return null;

  const stock = Number(product.stock);
  const hasStock = !Number.isFinite(stock) || stock > 0;
  const gallery = [product.imageUrl, ...(Array.isArray(product.gallery) ? product.gallery : [])]
    .filter(Boolean);

  const whatsappText = [
    text.waHello,
    `${text.waProduct}: ${product.name || ""}`,
    product.brand ? `${text.waBrand}: ${product.brand}` : "",
    product.model ? `${text.waModel}: ${product.model}` : "",
    product.price ? `${text.waPrice}: ₪${formatPrice(product.price)}` : "",
    `${text.waLink}: ${window.location.href}`
  ].filter(Boolean).join("\n");

  return (
    <main className="product-details-page" dir={dir}>
      <Link className="back-to-shop" to="/shop">
        {dir === "rtl" ? "←" : "→"} {text.back}
      </Link>

      <section className="product-details-card">
        <div className="product-gallery">
          <div className="product-main-image">
            {selectedImage ? (
              <img src={selectedImage} alt={product.name || text.image} />
            ) : (
              <div className="product-image-placeholder">🖥️</div>
            )}
          </div>

          {gallery.length > 1 && (
            <div className="product-thumbnails">
              {gallery.map((image, index) => (
                <button type="button" key={`${image}-${index}`}
                  onClick={() => setSelectedImage(image)}
                  className={selectedImage === image ? "selected" : ""}>
                  <img src={image} alt={`${text.picture} ${index + 1}`} />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="product-information">
          <p className="product-category">{product.category || text.product}</p>
          <h1>{product.name}</h1>

          {(product.brand || product.model) && (
            <p className="product-brand">
              {[product.brand, product.model].filter(Boolean).join(" • ")}
            </p>
          )}

          <p className="product-details-price">
            {product.price ? `₪${formatPrice(product.price)}` : text.askPrice}
          </p>

          {Number(product.oldPrice) > Number(product.price) && (
            <p className="old-price">
              {text.oldPrice}: ₪{formatPrice(product.oldPrice)}
            </p>
          )}

          <p className={hasStock ? "in-stock" : "out-of-stock"}>
            {hasStock ? text.inStock : text.outOfStock}
          </p>

          {product.description && (
            <div className="product-section">
              <h2>{text.description}</h2>
              <p>{product.description}</p>
            </div>
          )}

          {product.specifications && (
            <div className="product-section">
              <h2>{text.specifications}</h2>
              <p className="preserve-lines">{product.specifications}</p>
            </div>
          )}

          {product.warranty && <p><strong>{text.warranty}:</strong> {product.warranty}</p>}
          {product.condition && <p><strong>{text.condition}:</strong> {product.condition}</p>}

          <div className="product-details-actions">
            <button type="button" disabled={!hasStock} onClick={() => addToCart(product)}>
              {text.addToCart}
            </button>

            <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappText)}`}
              target="_blank" rel="noreferrer">
              {text.whatsappOrder}
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

export default ProductDetails;
