import fs from "fs/promises";
import path from "path";

export type ProductCategory = 
  | "Velas Aromáticas" 
  | "Difusores & Varillas" 
  | "Home Spray" 
  | "Accesorios & Apagavelas" 
  | "Sets & Regalos";

export interface Product {
  id: string;
  name: string;
  description: string;
  category: ProductCategory;
  price: number;
  stock: number;
  imageUrl?: string;
  featured: boolean;
  createdAt: string;
}

export interface Metrics {
  pageViews: number;
  whatsappClicks: number;
  lastUpdated: string;
}

const DATA_DIR = path.join(process.cwd(), "data");
const PRODUCTS_FILE = path.join(DATA_DIR, "products.json");
const METRICS_FILE = path.join(DATA_DIR, "metrics.json");

const DEFAULT_PRODUCTS: Product[] = [
  {
    id: "prod-1",
    name: "Vela Cera de Soja - Jazmín & Vainilla",
    description: "Vela artesanal en vaso de vidrio reutilizable con flores secas.",
    category: "Velas Aromáticas",
    price: 15500,
    stock: 12,
    imageUrl: "/placeholder-candle.png",
    featured: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "prod-2",
    name: "Difusor de Ambientes - Naranja & Canela",
    description: "Difusor mikado de 250ml con varillas de ratán de alta absorción.",
    category: "Difusores & Varillas",
    price: 18000,
    stock: 8,
    imageUrl: "/placeholder-diffuser.png",
    featured: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "prod-3",
    name: "Home Spray Textil - Lavanda Serena",
    description: "Aromatizador textil de 500ml para ropa de cama y cortinas.",
    category: "Home Spray",
    price: 12500,
    stock: 20,
    imageUrl: "/placeholder-spray.png",
    featured: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "prod-4",
    name: "Apagavelas Clásico Acero Dorado",
    description: "Accesorio sofisticado de acero inoxidable color oro antiguo.",
    category: "Accesorios & Apagavelas",
    price: 9500,
    stock: 5,
    imageUrl: "/placeholder-accessory.png",
    featured: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "prod-5",
    name: "Box Regalo Hestia Ritual",
    description: "Incluye 1 vela aromática, 1 home spray y apagavelas de regalo en caja premium.",
    category: "Sets & Regalos",
    price: 38000,
    stock: 4,
    imageUrl: "/placeholder-box.png",
    featured: true,
    createdAt: new Date().toISOString(),
  }
];

const DEFAULT_METRICS: Metrics = {
  pageViews: 124,
  whatsappClicks: 38,
  lastUpdated: new Date().toISOString(),
};

async function ensureDataFiles() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    try {
      await fs.access(PRODUCTS_FILE);
    } catch {
      await fs.writeFile(PRODUCTS_FILE, JSON.stringify(DEFAULT_PRODUCTS, null, 2), "utf-8");
    }

    try {
      await fs.access(METRICS_FILE);
    } catch {
      await fs.writeFile(METRICS_FILE, JSON.stringify(DEFAULT_METRICS, null, 2), "utf-8");
    }
  } catch (err) {
    console.error("Error initializing data directory:", err);
  }
}

export async function getProducts(): Promise<Product[]> {
  await ensureDataFiles();
  try {
    const data = await fs.readFile(PRODUCTS_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return DEFAULT_PRODUCTS;
  }
}

export async function saveProducts(products: Product[]): Promise<void> {
  await ensureDataFiles();
  await fs.writeFile(PRODUCTS_FILE, JSON.stringify(products, null, 2), "utf-8");
}

export async function addProduct(product: Omit<Product, "id" | "createdAt">): Promise<Product> {
  const products = await getProducts();
  const newProduct: Product = {
    ...product,
    id: `prod-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  products.unshift(newProduct);
  await saveProducts(products);
  return newProduct;
}

export async function updateProduct(id: string, updates: Partial<Omit<Product, "id" | "createdAt">>): Promise<Product | null> {
  const products = await getProducts();
  const index = products.findIndex((p) => p.id === id);
  if (index === -1) return null;

  products[index] = { ...products[index], ...updates };
  await saveProducts(products);
  return products[index];
}

export async function deleteProduct(id: string): Promise<boolean> {
  const products = await getProducts();
  const filtered = products.filter((p) => p.id !== id);
  if (filtered.length === products.length) return false;
  await saveProducts(filtered);
  return true;
}

export async function getMetrics(): Promise<Metrics> {
  await ensureDataFiles();
  try {
    const data = await fs.readFile(METRICS_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return DEFAULT_METRICS;
  }
}

export async function incrementMetric(type: "pageViews" | "whatsappClicks"): Promise<Metrics> {
  await ensureDataFiles();
  const metrics = await getMetrics();
  metrics[type] = (metrics[type] || 0) + 1;
  metrics.lastUpdated = new Date().toISOString();
  try {
    await fs.writeFile(METRICS_FILE, JSON.stringify(metrics, null, 2), "utf-8");
  } catch {
    // Entorno serverless de solo lectura (como Vercel)
  }
  return metrics;
}
