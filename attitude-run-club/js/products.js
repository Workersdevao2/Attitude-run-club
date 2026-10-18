/**
 * Attitude Run Club — Default catalog (fallback when remote catalog.json fails)
 * Live catalog is published to Cloudinary via the Worker; public site merges:
 *   1. localStorage drafts (admin same-browser preview)
 *   2. Remote catalog.json
 *   3. These defaults
 */

/** WhatsApp number (no +) */
const ARC_WA_NUMBER = '244933953989';

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

/** Default products (seed from existing loja) */
const DEFAULT_PRODUCTS = [
  {
    id: 'tank',
    name_pt: 'Attitude Race Tank',
    name_en: 'Attitude Race Tank',
    desc_pt: 'Singlet leve com gradiente e logo Attitude. Ideal para treino e prova.',
    desc_en: 'Lightweight singlet with gradient and Attitude logo. Ideal for training and races.',
    price: 18000,
    image: 'images/product-tank.jpg',
    sizes: ['S', 'M', 'L', 'XL'],
    active: true,
    order: 1
  },
  {
    id: 'socks',
    name_pt: 'Meias Attitude',
    name_en: 'Attitude Socks',
    desc_pt: 'Meias de performance com logo Attitude. Conforto e suporte no treino.',
    desc_en: 'Performance socks with Attitude logo. Comfort and support for training.',
    price: 4500,
    image: 'images/product-socks.jpg',
    sizes: ['35-38', '39-42', '43-46'],
    active: true,
    order: 2
  },
  {
    id: 'shorts-black',
    name_pt: 'Shorts Run Preto',
    name_en: 'Black Run Shorts',
    desc_pt: 'Shorts leves com cordão e logo Attitude. Movimento livre.',
    desc_en: 'Lightweight shorts with drawcord and Attitude logo. Free movement.',
    price: 15000,
    image: 'images/product-shorts-black.jpg',
    sizes: ['S', 'M', 'L', 'XL'],
    active: true,
    order: 3
  },
  {
    id: 'shorts-white',
    name_pt: 'Shorts Run Branco',
    name_en: 'White Run Shorts',
    desc_pt: 'Shorts brancos com detalhe Attitude. Look limpo para o dia a dia e treino.',
    desc_en: 'White shorts with Attitude detail. Clean look for everyday and training.',
    price: 15000,
    image: 'images/product-shorts-white.jpg',
    sizes: ['S', 'M', 'L', 'XL'],
    active: true,
    order: 4
  },
  {
    id: 'visor',
    name_pt: 'Visor Attitude',
    name_en: 'Attitude Visor',
    desc_pt: 'Visor perfurado com bordado ATTITUDE. Proteção e estilo em corrida.',
    desc_en: 'Perforated visor with ATTITUDE embroidery. Protection and style on the run.',
    price: 8500,
    image: 'images/product-visor.jpg',
    sizes: ['Único'],
    active: true,
    order: 5
  },
  {
    id: 'jacket',
    name_pt: 'Casaco Wind Attitude',
    name_en: 'Attitude Wind Jacket',
    desc_pt: 'Casaco leve com capuz e fecho. Proteção contra vento e chuva ligeira.',
    desc_en: 'Lightweight hooded jacket with zipper. Wind and light rain protection.',
    price: 32000,
    image: 'images/product-jacket.jpg',
    sizes: ['S', 'M', 'L', 'XL'],
    active: true,
    order: 6
  },
  {
    id: 'shorts-2in1',
    name_pt: 'Shorts 2-in-1 Preto/Laranja',
    name_en: '2-in-1 Shorts Black/Orange',
    desc_pt: 'Shorts 2-em-1 com compressão interior. Performance e suporte.',
    desc_en: '2-in-1 shorts with inner compression. Performance and support.',
    price: 18500,
    image: 'images/product-shorts-2in1.jpg',
    sizes: ['S', 'M', 'L', 'XL'],
    active: true,
    order: 7
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
