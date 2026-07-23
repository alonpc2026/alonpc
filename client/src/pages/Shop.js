import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useLanguage } from "../context/LanguageContext";
import "./Shop.css";

const API = "https://alonpc02026.onrender.com/api/products";
const WHATSAPP_NUMBER = "972545221809";

const translations = {
  he: {
    loading: "טוען מוצרים...",
    fetchError: "לא ניתן לקבל את המוצרים",
    storeError: "שגיאה בטעינת החנות",
    badge: "🛒 חנות נגישה וברורה",
    title: "החנות של אלון — ALONPC",
    intro: "בחר קטגוריה, חפש מוצר וקבל שירות אישי וברור ב־WhatsApp.",
    whatsappOrders: "WhatsApp להזמנות",
    categoriesTitle: "קטגוריות מוצרים",
    allProducts: "כל המוצרים",
    searchProduct: "חיפוש מוצר",
    searchPlaceholder: "שם מוצר, מותג, דגם או תיאור...",
    brand: "מותג",
    allBrands: "כל המותגים",
    sort: "מיון",
    newest: "החדשים ביותר",
    priceLow: "מחיר מהנמוך לגבוה",
    priceHigh: "מחיר מהגבוה לנמוך",
    productName: "שם מוצר",
    reset: "ניקוי סינון",
    productsFound: "מוצרים נמצאו",
    noProducts: "לא נמצאו מוצרים מתאימים",
    tryAgain: "נסה לבחור קטגוריה אחרת או לנקות את הסינון.",
    showAll: "הצג את כל המוצרים",
    productDetailsAria: "פרטים על",
    product: "מוצר",
    productImage: "תמונת מוצר",
    unnamedProduct: "מוצר ללא שם",
    askPrice: "מחיר לפי בירור",
    inStock: "במלאי",
    outOfStock: "אזל מהמלאי",
    moreDetails: "פרטים נוספים",
    addToCart: "הוסף לעגלה",
    needHelp: "צריך עזרה בבחירת מוצר?",
    helpText: "אלון ישמח לעזור בכתב דרך WhatsApp.",
    messageAlon: "שלח הודעה לאלון",
    waHello: "שלום אלון, אני מעוניין/ת במוצר מהחנות:",
    waProduct: "מוצר",
    waBrand: "מותג",
    waModel: "דגם",
    waPrice: "מחיר",
    waLink: "קישור"
  },
  en: {
    loading: "Loading products...",
    fetchError: "Unable to receive products",
    storeError: "Store loading error",
    badge: "🛒 Clear and accessible shop",
    title: "Alon's Shop — ALONPC",
    intro: "Choose a category, search for a product and receive personal service through WhatsApp.",
    whatsappOrders: "Order on WhatsApp",
    categoriesTitle: "Product categories",
    allProducts: "All products",
    searchProduct: "Search product",
    searchPlaceholder: "Product name, brand, model or description...",
    brand: "Brand",
    allBrands: "All brands",
    sort: "Sort",
    newest: "Newest first",
    priceLow: "Price: low to high",
    priceHigh: "Price: high to low",
    productName: "Product name",
    reset: "Clear filters",
    productsFound: "products found",
    noProducts: "No matching products were found",
    tryAgain: "Choose another category or clear the filters.",
    showAll: "Show all products",
    productDetailsAria: "Details about",
    product: "product",
    productImage: "Product image",
    unnamedProduct: "Unnamed product",
    askPrice: "Price on request",
    inStock: "In stock",
    outOfStock: "Out of stock",
    moreDetails: "More details",
    addToCart: "Add to cart",
    needHelp: "Need help choosing a product?",
    helpText: "Alon will be happy to help in writing through WhatsApp.",
    messageAlon: "Message Alon",
    waHello: "Hello Alon, I am interested in a product from the shop:",
    waProduct: "Product",
    waBrand: "Brand",
    waModel: "Model",
    waPrice: "Price",
    waLink: "Link"
  },
  ru: {
    loading: "Загрузка товаров...",
    fetchError: "Не удалось получить товары",
    storeError: "Ошибка загрузки магазина",
    badge: "🛒 Понятный и доступный магазин",
    title: "Магазин Алона — ALONPC",
    intro: "Выберите категорию, найдите товар и получите помощь через WhatsApp.",
    whatsappOrders: "Заказать в WhatsApp",
    categoriesTitle: "Категории товаров",
    allProducts: "Все товары",
    searchProduct: "Поиск товара",
    searchPlaceholder: "Название, бренд, модель или описание...",
    brand: "Бренд",
    allBrands: "Все бренды",
    sort: "Сортировка",
    newest: "Сначала новые",
    priceLow: "Цена: по возрастанию",
    priceHigh: "Цена: по убыванию",
    productName: "Название товара",
    reset: "Сбросить фильтры",
    productsFound: "товаров найдено",
    noProducts: "Подходящие товары не найдены",
    tryAgain: "Выберите другую категорию или сбросьте фильтры.",
    showAll: "Показать все товары",
    productDetailsAria: "Подробнее о",
    product: "товаре",
    productImage: "Изображение товара",
    unnamedProduct: "Товар без названия",
    askPrice: "Цена по запросу",
    inStock: "В наличии",
    outOfStock: "Нет в наличии",
    moreDetails: "Подробнее",
    addToCart: "Добавить в корзину",
    needHelp: "Нужна помощь с выбором товара?",
    helpText: "Алон с радостью поможет письменно через WhatsApp.",
    messageAlon: "Написать Алону",
    waHello: "Здравствуйте, Алон. Меня интересует товар из магазина:",
    waProduct: "Товар",
    waBrand: "Бренд",
    waModel: "Модель",
    waPrice: "Цена",
    waLink: "Ссылка"
  },
  ar: {
    loading: "جارٍ تحميل المنتجات...",
    fetchError: "تعذر استلام المنتجات",
    storeError: "خطأ في تحميل المتجر",
    badge: "🛒 متجر واضح وميسّر",
    title: "متجر ألون — ALONPC",
    intro: "اختر فئة وابحث عن منتج واحصل على خدمة شخصية عبر واتساب.",
    whatsappOrders: "الطلب عبر واتساب",
    categoriesTitle: "فئات المنتجات",
    allProducts: "كل المنتجات",
    searchProduct: "بحث عن منتج",
    searchPlaceholder: "اسم المنتج أو العلامة أو الطراز أو الوصف...",
    brand: "العلامة التجارية",
    allBrands: "كل العلامات",
    sort: "الترتيب",
    newest: "الأحدث أولًا",
    priceLow: "السعر من الأقل إلى الأعلى",
    priceHigh: "السعر من الأعلى إلى الأقل",
    productName: "اسم المنتج",
    reset: "مسح التصفية",
    productsFound: "منتجات تم العثور عليها",
    noProducts: "لم يتم العثور على منتجات مطابقة",
    tryAgain: "اختر فئة أخرى أو امسح التصفية.",
    showAll: "عرض كل المنتجات",
    productDetailsAria: "تفاصيل عن",
    product: "المنتج",
    productImage: "صورة المنتج",
    unnamedProduct: "منتج بلا اسم",
    askPrice: "السعر عند الاستفسار",
    inStock: "متوفر",
    outOfStock: "نفد من المخزون",
    moreDetails: "مزيد من التفاصيل",
    addToCart: "أضف إلى السلة",
    needHelp: "هل تحتاج إلى مساعدة في اختيار منتج؟",
    helpText: "يسعد ألون مساعدتك كتابيًا عبر واتساب.",
    messageAlon: "أرسل رسالة إلى ألون",
    waHello: "مرحبًا ألون، أنا مهتم بمنتج من المتجر:",
    waProduct: "المنتج",
    waBrand: "العلامة",
    waModel: "الطراز",
    waPrice: "السعر",
    waLink: "الرابط"
  },
  am: {
    loading: "ምርቶች በመጫን ላይ...",
    fetchError: "ምርቶችን ማግኘት አልተቻለም",
    storeError: "ሱቁን በመጫን ላይ ስህተት",
    badge: "🛒 ግልጽና ተደራሽ ሱቅ",
    title: "የአሎን ሱቅ — ALONPC",
    intro: "ምድብ ይምረጡ፣ ምርት ይፈልጉ እና በWhatsApp እርዳታ ያግኙ።",
    whatsappOrders: "በWhatsApp ይዘዙ",
    categoriesTitle: "የምርት ምድቦች",
    allProducts: "ሁሉም ምርቶች",
    searchProduct: "ምርት ፈልግ",
    searchPlaceholder: "የምርት ስም፣ ብራንድ፣ ሞዴል ወይም መግለጫ...",
    brand: "ብራንድ",
    allBrands: "ሁሉም ብራንዶች",
    sort: "ደርድር",
    newest: "አዲሶቹ በመጀመሪያ",
    priceLow: "ዋጋ፦ ከዝቅተኛ ወደ ከፍተኛ",
    priceHigh: "ዋጋ፦ ከከፍተኛ ወደ ዝቅተኛ",
    productName: "የምርት ስም",
    reset: "ማጣሪያ አጽዳ",
    productsFound: "ምርቶች ተገኝተዋል",
    noProducts: "ተዛማጅ ምርት አልተገኘም",
    tryAgain: "ሌላ ምድብ ይምረጡ ወይም ማጣሪያውን ያጽዱ።",
    showAll: "ሁሉንም ምርቶች አሳይ",
    productDetailsAria: "ዝርዝር ስለ",
    product: "ምርት",
    productImage: "የምርት ምስል",
    unnamedProduct: "ስም የሌለው ምርት",
    askPrice: "ዋጋ በጥያቄ",
    inStock: "አለ",
    outOfStock: "ከክምችት አልቋል",
    moreDetails: "ተጨማሪ ዝርዝር",
    addToCart: "ወደ ጋሪ ጨምር",
    needHelp: "ምርት ለመምረጥ እርዳታ ይፈልጋሉ?",
    helpText: "አሎን በWhatsApp በጽሑፍ ሊረዳዎት ይደሰታል።",
    messageAlon: "ለአሎን መልዕክት ላክ",
    waHello: "ሰላም አሎን፣ ከሱቁ ያለ ምርት እፈልጋለሁ፦",
    waProduct: "ምርት",
    waBrand: "ብራንድ",
    waModel: "ሞዴል",
    waPrice: "ዋጋ",
    waLink: "አገናኝ"
  }
};

function categoryIcon(category) {
  const value = String(category || "").toLowerCase();

  if (value.includes("נייד") || value.includes("laptop")) return "💻";
  if (value.includes("נייח") || value.includes("desktop")) return "🖥️";
  if (value.includes("מדפס") || value.includes("printer")) return "🖨️";
  if (value.includes("מקלד") || value.includes("keyboard")) return "⌨️";
  if (value.includes("עכבר") || value.includes("mouse")) return "🖱️";
  if (value.includes("אוזנ") || value.includes("audio")) return "🎧";
  if (value.includes("אחסון") || value.includes("disk") || value.includes("ssd")) return "💾";
  if (value.includes("כבל") || value.includes("מטען") || value.includes("charger")) return "🔌";
  if (value.includes("נגיש") || value.includes("access")) return "♿";
  if (value.includes("מצלמ") || value.includes("camera")) return "📷";
  if (value.includes("רשת") || value.includes("network")) return "🌐";
  if (value.includes("שירות") || value.includes("repair")) return "🛠️";

  return "📦";
}

function Shop() {
  const { addToCart } = useCart();
  const { language, dir, locale } = useLanguage();
  const text = translations[language] || translations.he;

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    async function loadProducts() {
      setLoading(true);

      try {
        const response = await fetch(API, { signal: controller.signal });

        if (!response.ok) {
          throw new Error(text.fetchError);
        }

        const data = await response.json();
        setProducts(Array.isArray(data) ? data : []);
        setMessage("");
      } catch (error) {
        if (error.name === "AbortError") return;

        setProducts([]);
        setMessage(`${text.storeError}: ${error.message}`);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();

    return () => controller.abort();
  }, [text.fetchError, text.storeError]);

  const categories = useMemo(
    () =>
      [...new Set(products.map((product) => product.category).filter(Boolean))]
        .sort((a, b) => String(a).localeCompare(String(b), locale)),
    [products, locale]
  );

  const brands = useMemo(
    () =>
      [...new Set(products.map((product) => product.brand).filter(Boolean))]
        .sort((a, b) => String(a).localeCompare(String(b), locale)),
    [products, locale]
  );

  const filteredProducts = useMemo(() => {
    const searchText = search.trim().toLocaleLowerCase();

    const result = products.filter((product) => {
      const matchesCategory =
        !selectedCategory || product.category === selectedCategory;

      const matchesBrand =
        !selectedBrand || product.brand === selectedBrand;

      const combinedText = [
        product.name,
        product.category,
        product.brand,
        product.model,
        product.description,
        product.condition
      ]
        .filter(Boolean)
        .join(" ")
        .toLocaleLowerCase();

      return (
        matchesCategory &&
        matchesBrand &&
        (!searchText || combinedText.includes(searchText)) &&
        product.active !== false
      );
    });

    return [...result].sort((a, b) => {
      if (sortBy === "priceLow") {
        return Number(a.price || 0) - Number(b.price || 0);
      }

      if (sortBy === "priceHigh") {
        return Number(b.price || 0) - Number(a.price || 0);
      }

      if (sortBy === "name") {
        return String(a.name || "").localeCompare(
          String(b.name || ""),
          locale
        );
      }

      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });
  }, [products, search, selectedCategory, selectedBrand, sortBy, locale]);

  const formatPrice = (price) => {
    const number = Number(price);
    return Number.isFinite(number)
      ? number.toLocaleString(locale)
      : price || "";
  };

  const buildWhatsAppUrl = (product) => {
    const lines = [
      text.waHello,
      product.name ? `${text.waProduct}: ${product.name}` : "",
      product.brand ? `${text.waBrand}: ${product.brand}` : "",
      product.model ? `${text.waModel}: ${product.model}` : "",
      product.price !== undefined && product.price !== ""
        ? `${text.waPrice}: ₪${formatPrice(product.price)}`
        : "",
      `${text.waLink}: ${window.location.origin}/#/product/${product._id}`
    ].filter(Boolean);

    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
      lines.join("\n")
    )}`;
  };

  const resetFilters = () => {
    setSearch("");
    setSelectedCategory("");
    setSelectedBrand("");
    setSortBy("newest");
  };

  return (
    <main className="shop-page" dir={dir}>
      <section className="shop-hero">
        <div>
          <span className="shop-badge">{text.badge}</span>
          <h1>{text.title}</h1>
          <p>{text.intro}</p>
        </div>

        <a
          className="shop-whatsapp-main"
          href={`https://wa.me/${WHATSAPP_NUMBER}`}
          target="_blank"
          rel="noreferrer"
        >
          {text.whatsappOrders}
        </a>
      </section>

      <section className="shop-category-section">
        <h2>{text.categoriesTitle}</h2>

        <div className="shop-category-grid">
          <button
            type="button"
            className={`shop-category-card all ${
              selectedCategory === "" ? "active" : ""
            }`}
            onClick={() => setSelectedCategory("")}
          >
            <span className="shop-category-icon">🛒</span>
            <span>{text.allProducts}</span>
          </button>

          {categories.map((category, index) => (
            <button
              type="button"
              key={category}
              className={`shop-category-card category-${(index % 8) + 1} ${
                selectedCategory === category ? "active" : ""
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              <span className="shop-category-icon">
                {categoryIcon(category)}
              </span>
              <span>{category}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="shop-tools">
        <label className="shop-search-box">
          <span>{text.searchProduct}</span>
          <input
            type="search"
            placeholder={text.searchPlaceholder}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </label>

        <label>
          <span>{text.brand}</span>
          <select
            value={selectedBrand}
            onChange={(event) => setSelectedBrand(event.target.value)}
          >
            <option value="">{text.allBrands}</option>

            {brands.map((brand) => (
              <option value={brand} key={brand}>
                {brand}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span>{text.sort}</span>
          <select
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
          >
            <option value="newest">{text.newest}</option>
            <option value="priceLow">{text.priceLow}</option>
            <option value="priceHigh">{text.priceHigh}</option>
            <option value="name">{text.productName}</option>
          </select>
        </label>

        <button
          type="button"
          className="shop-reset-button"
          onClick={resetFilters}
        >
          {text.reset}
        </button>
      </section>

      <section className="shop-summary" aria-live="polite">
        <strong>{filteredProducts.length}</strong> {text.productsFound}
      </section>

      {loading && <p className="shop-status">{text.loading}</p>}

      {!loading && message && (
        <p className="shop-status error">{message}</p>
      )}

      {!loading && !message && filteredProducts.length === 0 && (
        <section className="shop-empty">
          <h2>{text.noProducts}</h2>
          <p>{text.tryAgain}</p>

          <button type="button" onClick={resetFilters}>
            {text.showAll}
          </button>
        </section>
      )}

      <section className="shop-grid">
        {filteredProducts.map((product) => {
          const stock = Number(product.stock);
          const hasStock = !Number.isFinite(stock) || stock > 0;

          return (
            <article className="shop-card" key={product._id}>
              <Link
                to={`/product/${product._id}`}
                className="shop-image-link"
                aria-label={`${text.productDetailsAria} ${
                  product.name || text.product
                }`}
              >
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name || text.productImage}
                    className="shop-product-image"
                    loading="lazy"
                    onError={(event) => {
                      event.currentTarget.style.display = "none";
                      const placeholder =
                        event.currentTarget.nextElementSibling;
                      if (placeholder) placeholder.style.display = "flex";
                    }}
                  />
                ) : null}

                <div
                  className="shop-image-placeholder"
                  style={{ display: product.imageUrl ? "none" : "flex" }}
                >
                  🖥️
                </div>
              </Link>

              <div className="shop-card-content">
                <div className="shop-card-tags">
                  {product.category && <span>{product.category}</span>}
                  {product.condition && <span>{product.condition}</span>}
                </div>

                <h2>{product.name || text.unnamedProduct}</h2>

                {(product.brand || product.model) && (
                  <p className="shop-brand-model">
                    {[product.brand, product.model]
                      .filter(Boolean)
                      .join(" • ")}
                  </p>
                )}

                {product.description && (
                  <p className="shop-description">
                    {product.description.length > 150
                      ? `${product.description.slice(0, 150)}...`
                      : product.description}
                  </p>
                )}

                <div className="shop-price-row">
                  <p className="shop-price">
                    {product.price !== undefined && product.price !== ""
                      ? `₪${formatPrice(product.price)}`
                      : text.askPrice}
                  </p>

                  <span
                    className={
                      hasStock
                        ? "stock available"
                        : "stock unavailable"
                    }
                  >
                    {hasStock ? text.inStock : text.outOfStock}
                  </span>
                </div>

                <div className="shop-actions">
                  <Link
                    to={`/product/${product._id}`}
                    className="shop-details-button"
                  >
                    {text.moreDetails}
                  </Link>

                  <button
                    type="button"
                    className="shop-cart-button"
                    disabled={!hasStock}
                    onClick={() => addToCart(product)}
                  >
                    {text.addToCart}
                  </button>

                  <a
                    href={buildWhatsAppUrl(product)}
                    target="_blank"
                    rel="noreferrer"
                    className={`shop-order-button ${
                      hasStock ? "" : "disabled"
                    }`}
                    aria-disabled={!hasStock}
                    onClick={(event) => {
                      if (!hasStock) event.preventDefault();
                    }}
                  >
                    WhatsApp
                  </a>
                </div>
              </div>
            </article>
          );
        })}
      </section>

      <section className="shop-help">
        <h2>{text.needHelp}</h2>
        <p>{text.helpText}</p>

        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}`}
          target="_blank"
          rel="noreferrer"
        >
          {text.messageAlon}
        </a>
      </section>
    </main>
  );
}

export default Shop;
