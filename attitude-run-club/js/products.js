/**
 * Attitude Run Club — Default catalog (fallback when remote catalog.json fails)
 * Live catalog is published to Cloudinary via the Worker; public site merges:
 *   1. localStorage drafts (admin same-browser preview)
 *   2. Remote catalog.json
 *   3. These defaults
 */

/** WhatsApp number (no +) */
const ARC_WA_NUMBER = '244932826818';

/**
 * Catalog JSON URL on Cloudinary (raw).
 * Created/overwritten by the Worker on each "Publicar na loja".
 */
const CATALOG_JSON_URL = 'https://res.cloudinary.com/ev6fgna8/raw/upload/attitude-run-club/catalog.json';

/**
 * Cloudinary — public browser config only.
 * API Key + API Secret stay on the Worker (never in client JS).
 *
 * Create an unsigned upload preset in Cloudinary console:
 *   Settings → Upload → Add upload preset
 *   Signing mode: Unsigned
 *   Folder: attitude-run-club/media
 *   Unique filename: on · Overwrite: off
 * Then set the preset name below (default: arc_media).
 */
const CLOUDINARY_CLOUD_NAME = 'ev6fgna8';
const CLOUDINARY_UPLOAD_PRESET = 'arc_media';
const CLOUDINARY_FOLDER = 'attitude-run-club';

/** Default products (full Attitude Sportwear catalog — attach photos in Admin → Média) */
const DEFAULT_PRODUCTS = [
  {
    id: "short-boost",
    name_pt: "Short Boost",
    name_en: "Short Boost",
    desc_pt: "Cores: azul, preto.",
    desc_en: "Colours: blue, black.",
    price: 33500,
    image: '',
    sizes: ["S", "XL"],
    colors: ["Azul", "Preto"],
    active: true,
    order: 1
  },
  {
    id: "conjunto-lilly",
    name_pt: "Conjunto Lilly",
    name_en: "Lilly Set",
    desc_pt: "Cores: preta, cinza claro, castanho caqui, rosa.",
    desc_en: "Colours: black, light grey, khaki brown, pink.",
    price: 80500,
    image: '',
    sizes: ["S", "XL"],
    colors: ["Preta", "Cinza claro", "Castanho caqui", "Rosa"],
    active: true,
    order: 2
  },
  {
    id: "cap",
    name_pt: "Cap",
    name_en: "Cap",
    desc_pt: "Cor: preto.",
    desc_en: "Colour: black.",
    price: 13000,
    image: '',
    sizes: [],
    colors: ["Preto"],
    active: true,
    order: 3
  },
  {
    id: "conjunto-just-go",
    name_pt: "Conjunto Just Go (2 peças)",
    name_en: "Just Go Set (2 pieces)",
    desc_pt: "Conjunto completo (2 peças).",
    desc_en: "Full set (2 pieces).",
    price: 116500,
    image: '',
    sizes: [],
    colors: [],
    active: true,
    order: 4
  },
  {
    id: "pulover-just-go",
    name_pt: "Pulôver Just Go",
    name_en: "Just Go Pullover",
    desc_pt: "Peça avulsa do conjunto Just Go.",
    desc_en: "Single piece from the Just Go set.",
    price: 67500,
    image: '',
    sizes: [],
    colors: [],
    active: true,
    order: 5
  },
  {
    id: "calca-just-go",
    name_pt: "Calça Just Go",
    name_en: "Just Go Pants",
    desc_pt: "Peça avulsa do conjunto Just Go.",
    desc_en: "Single piece from the Just Go set.",
    price: 49000,
    image: '',
    sizes: [],
    colors: [],
    active: true,
    order: 6
  },
  {
    id: "conjunto-freedom",
    name_pt: "Conjunto Freedom",
    name_en: "Freedom Set",
    desc_pt: "Cores: preto e verde.",
    desc_en: "Colours: black and green.",
    price: 71900,
    image: '',
    sizes: ["XL"],
    colors: ["Preto", "Verde"],
    active: true,
    order: 7
  },
  {
    id: "short-rush",
    name_pt: "Short Rush",
    name_en: "Short Rush",
    desc_pt: "Cores: cinza claro e cinza escuro.",
    desc_en: "Colours: light grey and dark grey.",
    price: 51560,
    image: '',
    sizes: ["M", "L", "XL", "2XL"],
    colors: ["Cinza claro", "Cinza escuro"],
    active: true,
    order: 8
  },
  {
    id: "short-swift",
    name_pt: "Short Swift",
    name_en: "Short Swift",
    desc_pt: "",
    desc_en: "",
    price: 51560,
    image: '',
    sizes: [],
    colors: [],
    active: true,
    order: 9
  },
  {
    id: "macacao-flow-suit",
    name_pt: "Macacão Flow Suit",
    name_en: "Flow Suit",
    desc_pt: "Cores: preto, bege, cinza.",
    desc_en: "Colours: black, beige, grey.",
    price: 61500,
    image: '',
    sizes: ["S", "XL"],
    colors: ["Preto", "Bege", "Cinza"],
    active: true,
    order: 10
  },
  {
    id: "mala-move",
    name_pt: "Mala Move",
    name_en: "Move Bag",
    desc_pt: "Cor única.",
    desc_en: "Single colour.",
    price: 40500,
    image: '',
    sizes: [],
    colors: ["Única"],
    active: true,
    order: 11
  },
  {
    id: "legging-start",
    name_pt: "Legging Start",
    name_en: "Start Legging",
    desc_pt: "Cores: cinza, castanha escura e castanha clara.",
    desc_en: "Colours: grey, dark brown and light brown.",
    price: 36500,
    image: '',
    sizes: ["M", "L", "XL"],
    colors: ["Cinza", "Castanha escura", "Castanha clara"],
    active: true,
    order: 12
  },
  {
    id: "blusa-just-go",
    name_pt: "Blusa Just Go",
    name_en: "Just Go Top",
    desc_pt: "Cores: rosa, bege, preta.",
    desc_en: "Colours: pink, beige, black.",
    price: 39200,
    image: '',
    sizes: ["L", "4XL"],
    colors: ["Rosa", "Bege", "Preta"],
    active: true,
    order: 13
  },
  {
    id: "short-runway",
    name_pt: "Short Runway",
    name_en: "Runway Short",
    desc_pt: "Cores: preto, castanho.",
    desc_en: "Colours: black, brown.",
    price: 40700,
    image: '',
    sizes: ["L", "XL"],
    colors: ["Preto", "Castanho"],
    active: true,
    order: 14
  },
  {
    id: "short-speed",
    name_pt: "Short Speed",
    name_en: "Speed Short",
    desc_pt: "Cor: azul escuro.",
    desc_en: "Colour: dark blue.",
    price: 36500,
    image: '',
    sizes: ["2XL"],
    colors: ["Azul escuro"],
    active: true,
    order: 15
  },
  {
    id: "tshirt-go-one",
    name_pt: "T-shirt Go One",
    name_en: "Go One T-shirt",
    desc_pt: "Cores: vermelho, azul, lilás e cinza.",
    desc_en: "Colours: red, blue, lilac and grey.",
    price: 39200,
    image: '',
    sizes: ["S", "M", "L"],
    colors: ["Vermelho", "Azul", "Lilás", "Cinza"],
    active: true,
    order: 16
  },
  {
    id: "classic-tshirt-polo",
    name_pt: "Classic T-shirt Polo",
    name_en: "Classic Polo T-shirt",
    desc_pt: "Cores: branca, azul ciano, azul marinho.",
    desc_en: "Colours: white, cyan blue, navy blue.",
    price: 45000,
    image: '',
    sizes: ["S", "XL"],
    colors: ["Branca", "Azul ciano", "Azul marinho"],
    active: true,
    order: 17
  },
  {
    id: "conjunto-full-strength",
    name_pt: "Conjunto Full Strength",
    name_en: "Full Strength Set",
    desc_pt: "Cores: rosé, preto.",
    desc_en: "Colours: rosé, black.",
    price: 57500,
    image: '',
    sizes: ["2XL", "3XL"],
    colors: ["Rosé", "Preto"],
    active: true,
    order: 18
  },
  {
    id: "tshirt-casual-fit",
    name_pt: "T-shirt Casual Fit",
    name_en: "Casual Fit T-shirt",
    desc_pt: "Cores: bege, verde escura, azul escuro, cinza escura.",
    desc_en: "Colours: beige, dark green, dark blue, dark grey.",
    price: 39850,
    image: '',
    sizes: ["M", "L", "XL", "2XL"],
    colors: ["Bege", "Verde escura", "Azul escuro", "Cinza escura"],
    active: true,
    order: 19
  },
  {
    id: "attitude-kids-futebol",
    name_pt: "Attitude Kids Futebol",
    name_en: "Attitude Kids Football",
    desc_pt: "Kit futebol infantil.",
    desc_en: "Kids football kit.",
    price: 45850,
    image: '',
    sizes: [],
    colors: [],
    active: true,
    order: 20
  },
  {
    id: "regatas",
    name_pt: "Regatas",
    name_en: "Tank Tops",
    desc_pt: "",
    desc_en: "",
    price: 30000,
    image: '',
    sizes: ["S", "2XL"],
    colors: [],
    active: true,
    order: 21
  },
  {
    id: "cropped-bia",
    name_pt: "Cropped Bia",
    name_en: "Bia Cropped",
    desc_pt: "Cores: amarelo manteiga, cinza escuro, castanho.",
    desc_en: "Colours: butter yellow, dark grey, brown.",
    price: 45550,
    image: '',
    sizes: ["L", "XL"],
    colors: ["Amarelo manteiga", "Cinza escuro", "Castanho"],
    active: true,
    order: 22
  },
  {
    id: "conjunto-go-one",
    name_pt: "Conjunto Go One",
    name_en: "Go One Set",
    desc_pt: "Cores: preto, roxo, cinza, azul, vermelho.",
    desc_en: "Colours: black, purple, grey, blue, red.",
    price: 79990,
    image: '',
    sizes: ["S"],
    colors: ["Preto", "Roxo", "Cinza", "Azul", "Vermelho"],
    active: true,
    order: 23
  },
  {
    id: "conjunto-short-comfort-plus",
    name_pt: "Conjunto Short Comfort Plus",
    name_en: "Short Comfort Plus Set",
    desc_pt: "",
    desc_en: "",
    price: 49850,
    image: '',
    sizes: [],
    colors: [],
    active: true,
    order: 24
  },
  {
    id: "calca-go-girl",
    name_pt: "Calça Go Girl",
    name_en: "Go Girl Pants",
    desc_pt: "Cores: bege, preto.",
    desc_en: "Colours: beige, black.",
    price: 37000,
    image: '',
    sizes: ["2XL", "3XL"],
    colors: ["Bege", "Preto"],
    active: true,
    order: 25
  },
  {
    id: "top-lifted",
    name_pt: "Top Lifted",
    name_en: "Lifted Top",
    desc_pt: "Cores: preto, cinza claro, cinza escuro.",
    desc_en: "Colours: black, light grey, dark grey.",
    price: 42000,
    image: '',
    sizes: ["2XL", "3XL"],
    colors: ["Preto", "Cinza claro", "Cinza escuro"],
    active: true,
    order: 26
  },
  {
    id: "attitude-teens",
    name_pt: "Attitude Teens",
    name_en: "Attitude Teens",
    desc_pt: "Idade: dos 9 aos 16 anos. Cores: preto, bege, branco.",
    desc_en: "Age: 9 to 16 years. Colours: black, beige, white.",
    price: 78000,
    image: '',
    sizes: [],
    colors: ["Preto", "Bege", "Branco"],
    active: true,
    order: 27
  },
  {
    id: "attitude-kids",
    name_pt: "Attitude Kids",
    name_en: "Attitude Kids",
    desc_pt: "Idade: dos 3 aos 8 anos. Cores: azul escuro, cinza escuro, cinza claro, laranja.",
    desc_en: "Age: 3 to 8 years. Colours: dark blue, dark grey, light grey, orange.",
    price: 75000,
    image: '',
    sizes: [],
    colors: ["Azul escuro", "Cinza escuro", "Cinza claro", "Laranja"],
    active: true,
    order: 28
  },
  {
    id: "jacket-run",
    name_pt: "Jacket Run",
    name_en: "Run Jacket",
    desc_pt: "Cores: preta, branca.",
    desc_en: "Colours: black, white.",
    price: 40500,
    image: '',
    sizes: [],
    colors: ["Preta", "Branca"],
    active: true,
    order: 29
  },
  {
    id: "tshirt-essential-attitude",
    name_pt: "T-shirt Essential Attitude",
    name_en: "Essential Attitude T-shirt",
    desc_pt: "Cores: preto, azul claro, azul escuro, branco.",
    desc_en: "Colours: black, light blue, dark blue, white.",
    price: 50000,
    image: '',
    sizes: [],
    colors: ["Preto", "Azul claro", "Azul escuro", "Branco"],
    active: true,
    order: 30
  },
  {
    id: "jacket-drive",
    name_pt: "Jacket Drive",
    name_en: "Drive Jacket",
    desc_pt: "Cores: branca, preta.",
    desc_en: "Colours: white, black.",
    price: 57500,
    image: '',
    sizes: ["M", "XL"],
    colors: ["Branca", "Preta"],
    active: true,
    order: 31
  },
  {
    id: "short-bolt",
    name_pt: "Short Bolt",
    name_en: "Bolt Short",
    desc_pt: "Cores: cinza, neon verde, neon laranja.",
    desc_en: "Colours: grey, neon green, neon orange.",
    price: 38500,
    image: '',
    sizes: ["S", "XL"],
    colors: ["Cinza", "Neon verde", "Neon laranja"],
    active: true,
    order: 32
  },
  {
    id: "short-kickstart",
    name_pt: "Short Kickstart",
    name_en: "Kickstart Short",
    desc_pt: "Cores: bege, cinzento, azul, verde oliva, preto.",
    desc_en: "Colours: beige, grey, blue, olive green, black.",
    price: 39200,
    image: '',
    sizes: ["S", "M", "L", "XL", "2XL", "3XL"],
    colors: ["Bege", "Cinzento", "Azul", "Verde oliva", "Preto"],
    active: true,
    order: 33
  },
  {
    id: "fato-flex",
    name_pt: "Fato Flex",
    name_en: "Flex Suit",
    desc_pt: "Cor: preto.",
    desc_en: "Colour: black.",
    price: 145500,
    image: '',
    sizes: ["M", "2XL"],
    colors: ["Preto"],
    active: true,
    order: 34
  },
  {
    id: "conjunto-belindah",
    name_pt: "Conjunto Belindah",
    name_en: "Belindah Set",
    desc_pt: "Cores: vermelho, azul escuro, preto, verde, laranja.",
    desc_en: "Colours: red, dark blue, black, green, orange.",
    price: 53850,
    image: '',
    sizes: ["M", "L"],
    colors: ["Vermelho", "Azul escuro", "Preto", "Verde", "Laranja"],
    active: true,
    order: 35
  },
  {
    id: "conjunto-all-day",
    name_pt: "Conjunto All Day",
    name_en: "All Day Set",
    desc_pt: "100% algodão.",
    desc_en: "100% cotton.",
    price: 87000,
    image: '',
    sizes: [],
    colors: [],
    active: true,
    order: 36
  },
  {
    id: "pala-run-attitude",
    name_pt: "Pala Run Attitude",
    name_en: "Attitude Run Visor",
    desc_pt: "Cores: preto, branco.",
    desc_en: "Colours: black, white.",
    price: 18000,
    image: '',
    sizes: [],
    colors: ["Preto", "Branco"],
    active: true,
    order: 37
  },
  {
    id: "conjunto-go-girl-pants",
    name_pt: "Conjunto Go Girl Pants",
    name_en: "Go Girl Pants Set",
    desc_pt: "Cores: preto, off white, bordô.",
    desc_en: "Colours: black, off-white, burgundy.",
    price: 62500,
    image: '',
    sizes: [],
    colors: ["Preto", "Off white", "Bordô"],
    active: true,
    order: 38
  },
  {
    id: "conjunto-legging-comfort",
    name_pt: "Conjunto Legging Comfort",
    name_en: "Legging Comfort Set",
    desc_pt: "Cores: azul, cinza, lilás, rosa, preto.",
    desc_en: "Colours: blue, grey, lilac, pink, black.",
    price: 55850,
    image: '',
    sizes: [],
    colors: ["Azul", "Cinza", "Lilás", "Rosa", "Preto"],
    active: true,
    order: 39
  },
  {
    id: "tshirt-focus",
    name_pt: "T-shirt Focus",
    name_en: "Focus T-shirt",
    desc_pt: "Cores: cinza, castanho, bege.",
    desc_en: "Colours: grey, brown, beige.",
    price: 42000,
    image: '',
    sizes: ["S", "XXL"],
    colors: ["Cinza", "Castanho", "Bege"],
    active: true,
    order: 40
  },
  {
    id: "tshirt-start",
    name_pt: "T-shirt Start",
    name_en: "Start T-shirt",
    desc_pt: "Cores: cinza, castanho, bege.",
    desc_en: "Colours: grey, brown, beige.",
    price: 42000,
    image: '',
    sizes: ["S", "XL"],
    colors: ["Cinza", "Castanho", "Bege"],
    active: true,
    order: 41
  },
  {
    id: "long-sleeve",
    name_pt: "Long Sleeve",
    name_en: "Long Sleeve",
    desc_pt: "Cores: cinza escuro, cinza claro, preto.",
    desc_en: "Colours: dark grey, light grey, black.",
    price: 49500,
    image: '',
    sizes: ["S", "2XL"],
    colors: ["Cinza escuro", "Cinza claro", "Preto"],
    active: true,
    order: 42
  },
  {
    id: "short-ally",
    name_pt: "Short Ally",
    name_en: "Ally Short",
    desc_pt: "Cores: amarelo, verde, lilás.",
    desc_en: "Colours: yellow, green, lilac.",
    price: 52850,
    image: '',
    sizes: ["M", "L", "XL"],
    colors: ["Amarelo", "Verde", "Lilás"],
    active: true,
    order: 43
  },
  {
    id: "short-run",
    name_pt: "Short Run",
    name_en: "Run Short",
    desc_pt: "Cores: branco, preto, azul escuro.",
    desc_en: "Colours: white, black, dark blue.",
    price: 45000,
    image: '',
    sizes: [],
    colors: ["Branco", "Preto", "Azul escuro"],
    active: true,
    order: 44
  },
  {
    id: "legging-fuel",
    name_pt: "Legging Fuel",
    name_en: "Fuel Legging",
    desc_pt: "Cor: preta.",
    desc_en: "Colour: black.",
    price: 42000,
    image: '',
    sizes: ["XL", "3XL"],
    colors: ["Preta"],
    active: true,
    order: 45
  },
  {
    id: "conjunto-lucelia",
    name_pt: "Conjunto Lucélia",
    name_en: "Lucélia Set",
    desc_pt: "Cores: azul céu vibrante, rosa, castanho.",
    desc_en: "Colours: vibrant sky blue, pink, brown.",
    price: 55850,
    image: '',
    sizes: ["S", "XL"],
    colors: ["Azul céu vibrante", "Rosa", "Castanho"],
    active: true,
    order: 46
  },
  {
    id: "kit-toalha-attitude",
    name_pt: "Kit de Toalha Attitude",
    name_en: "Attitude Towel Kit",
    desc_pt: "2 peças. Cores: cinza escuro, cinza claro, branco.",
    desc_en: "2 pieces. Colours: dark grey, light grey, white.",
    price: 28750,
    image: '',
    sizes: [],
    colors: ["Cinza escuro", "Cinza claro", "Branco"],
    active: true,
    order: 47
  },
  {
    id: "regata-burn-flow",
    name_pt: "Regata Burn Flow",
    name_en: "Burn Flow Tank",
    desc_pt: "Cores: preta, branca.",
    desc_en: "Colours: black, white.",
    price: 40500,
    image: '',
    sizes: [],
    colors: ["Preta", "Branca"],
    active: true,
    order: 48
  },
  {
    id: "short-black-panther",
    name_pt: "Short Black Panther",
    name_en: "Black Panther Short",
    desc_pt: "Cor única.",
    desc_en: "Single colour.",
    price: 33500,
    image: '',
    sizes: ["S", "XL"],
    colors: ["Única"],
    active: true,
    order: 49
  },
  {
    id: "tshirt-balance",
    name_pt: "T-shirt Balance",
    name_en: "Balance T-shirt",
    desc_pt: "Cores: branca, preto, azul, cinza, laranja.",
    desc_en: "Colours: white, black, blue, grey, orange.",
    price: 40500,
    image: '',
    sizes: ["M", "XXL"],
    colors: ["Branca", "Preto", "Azul", "Cinza", "Laranja"],
    active: true,
    order: 50
  },
  {
    id: "short-beverly",
    name_pt: "Short Beverly",
    name_en: "Beverly Short",
    desc_pt: "Cores: branca, rosa, azul, verde, preto.",
    desc_en: "Colours: white, pink, blue, green, black.",
    price: 38500,
    image: '',
    sizes: ["M", "L", "XXL"],
    colors: ["Branca", "Rosa", "Azul", "Verde", "Preto"],
    active: true,
    order: 51
  },
  {
    id: "shaker-attitude",
    name_pt: "Shaker Attitude",
    name_en: "Attitude Shaker",
    desc_pt: "",
    desc_en: "",
    price: 10000,
    image: '',
    sizes: [],
    colors: [],
    active: true,
    order: 52
  },
  {
    id: "garrafa-attitude",
    name_pt: "Garrafa Attitude",
    name_en: "Attitude Bottle",
    desc_pt: "",
    desc_en: "",
    price: 10000,
    image: '',
    sizes: [],
    colors: [],
    active: true,
    order: 53
  },
  {
    id: "meias-curtas",
    name_pt: "Meias Curtas",
    name_en: "Short Socks",
    desc_pt: "Cores: preta, branca.",
    desc_en: "Colours: black, white.",
    price: 6500,
    image: '',
    sizes: [],
    colors: ["Preta", "Branca"],
    active: true,
    order: 54
  },
  {
    id: "meias-compridas",
    name_pt: "Meias Compridas",
    name_en: "Long Socks",
    desc_pt: "Cores: preta, branca.",
    desc_en: "Colours: black, white.",
    price: 7500,
    image: '',
    sizes: [],
    colors: ["Preta", "Branca"],
    active: true,
    order: 55
  },
  {
    id: "kit-move",
    name_pt: "Kit Move",
    name_en: "Move Kit",
    desc_pt: "Contém: Mala Move + shaker + 1 par de meias.",
    desc_en: "Includes: Move Bag + shaker + 1 pair of socks.",
    price: 55000,
    image: '',
    sizes: [],
    colors: [],
    active: true,
    order: 56
  }
];

/** Optional delivery zones (Luanda). Empty = no zone selector on checkout. */
const DEFAULT_ZONES = [
  { id: 'talatona', name: 'Talatona', price: 0 },
  { id: 'miramar', name: 'Miramar', price: 0 },
  { id: 'baixa', name: 'Baixa', price: 0 },
  { id: 'outro', name: 'Outra zona (a combinar)', price: 0 }
];

/** Editable site texts (merged into i18n on public pages) */
const DEFAULT_TEXTS = {
  pt: {
    'hero.title1': 'Corre Com',
    'hero.title2': 'Atitude.',
    'hero.sub': 'A maior comunidade lusófona de corrida ligada a uma marca africana. Não é só treino — é tribo, identidade e movimento.',
    'loja.title': 'Corre com estilo.',
    'loja.sub': 'Peças oficiais de performance. Encomenda via WhatsApp — confirmamos stock, tamanho e pagamento contigo.'
  },
  en: {
    'hero.title1': 'Run With',
    'hero.title2': 'Attitude.',
    'hero.sub': 'The largest Lusophone running community linked to an African brand. Not just training — tribe, identity and movement.',
    'loja.title': 'Run with style.',
    'loja.sub': 'Official performance pieces. Order via WhatsApp — we confirm stock, size and payment with you.'
  }
};

/**
 * Site image slots (data-site-img / data-site-img-bg keys).
 * Values are relative paths or full Cloudinary URLs after publish.
 */
const DEFAULT_SITE_IMAGES = {
  hero: 'images/start-01.jpg',
  'loja-hero': '',
  logo: 'images/logo.jpg'
};

/** Slot definitions for admin UI */
const SITE_IMAGE_SLOTS = [
  { key: 'hero', label: 'Home hero', hint: 'Fundo do hero da página inicial' },
  { key: 'loja-hero', label: 'Loja hero (opcional)', hint: 'Se vazio, usa o estilo padrão da loja' },
  { key: 'logo', label: 'Logo', hint: 'Logo no header e favicon' }
];

// Export for modules / global
if (typeof window !== 'undefined') {
  window.ARC_WA_NUMBER = ARC_WA_NUMBER;
  window.CATALOG_JSON_URL = CATALOG_JSON_URL;
  window.CLOUDINARY_CLOUD_NAME = CLOUDINARY_CLOUD_NAME;
  window.CLOUDINARY_UPLOAD_PRESET = CLOUDINARY_UPLOAD_PRESET;
  window.CLOUDINARY_FOLDER = CLOUDINARY_FOLDER;
  window.DEFAULT_PRODUCTS = DEFAULT_PRODUCTS;
  window.DEFAULT_ZONES = DEFAULT_ZONES;
  window.DEFAULT_TEXTS = DEFAULT_TEXTS;
  window.DEFAULT_SITE_IMAGES = DEFAULT_SITE_IMAGES;
  window.SITE_IMAGE_SLOTS = SITE_IMAGE_SLOTS;
}
