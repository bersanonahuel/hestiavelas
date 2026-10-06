"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Package, 
  TrendingUp, 
  MessageCircle, 
  AlertTriangle, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  ArrowLeft,
  Search,
  Filter,
  Upload,
  Image as ImageIcon,
  Lock,
  LogOut,
  Eye,
  EyeOff,
  User,
  Sparkles
} from "lucide-react";
import { Product, ProductCategory, Metrics } from "@/lib/db";
import { formatPrice } from "@/lib/utils";

const CATEGORIES: ProductCategory[] = [
  "Velas Aromáticas",
  "Difusores & Varillas",
  "Home Spray",
  "Accesorios & Apagavelas",
  "Sets & Regalos",
];

export default function AdminPage() {
  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [loginUser, setLoginUser] = useState("Malena");
  const [loginPass, setLoginPass] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Data & UI State
  const [products, setProducts] = useState<Product[]>([]);
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("Todas");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "Velas Aromáticas" as ProductCategory,
    price: "",
    stock: "",
    imageUrl: "",
    featured: false,
  });

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [prodRes, metRes] = await Promise.all([
        fetch("/api/products"),
        fetch("/api/metrics"),
      ]);
      const prodData = await prodRes.json();
      const metData = await metRes.json();
      setProducts(prodData);
      setMetrics(metData);
    } catch (err) {
      console.error("Error loading admin data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const res = await fetch("/api/auth/check");
        if (res.ok) {
          setIsAuthenticated(true);
          fetchData();
        } else {
          setIsAuthenticated(false);
        }
      } catch {
        setIsAuthenticated(false);
      }
    };
    verifyAuth();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: loginUser, password: loginPass }),
      });

      const data = await res.json();
      if (res.ok) {
        setIsAuthenticated(true);
        fetchData();
      } else {
        setLoginError(data.error || "Credenciales incorrectas");
      }
    } catch {
      setLoginError("Error de conexión al iniciar sesión");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      setIsAuthenticated(false);
      setLoginPass("");
    }
  };

  const openNewModal = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      description: "",
      category: "Velas Aromáticas",
      price: "",
      stock: "10",
      imageUrl: "",
      featured: false,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || "",
      category: product.category,
      price: product.price.toString(),
      stock: product.stock.toString(),
      imageUrl: product.imageUrl || "",
      featured: product.featured,
    });
    setIsModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const data = new FormData();
      data.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: data,
      });
      const result = await res.json();
      if (res.ok && result.url) {
        setFormData((prev) => ({ ...prev, imageUrl: result.url }));
      } else {
        alert(result.error || "No se pudo subir la imagen");
      }
    } catch (err) {
      alert("Error de conexión al subir la imagen");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.stock) {
      alert("Por favor completa los campos obligatorios");
      return;
    }

    try {
      if (editingProduct) {
        // Update
        const res = await fetch(`/api/products/${editingProduct.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        if (res.ok) {
          setIsModalOpen(false);
          fetchData();
        }
      } else {
        // Create
        const res = await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        if (res.ok) {
          setIsModalOpen(false);
          fetchData();
        }
      }
    } catch (error) {
      alert("Ocurrió un error al guardar.");
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`¿Estás seguro de eliminar "${name}"?`)) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        setProducts(products.filter((p) => p.id !== id));
      }
    } catch (error) {
      alert("Error al eliminar.");
    }
  };

  const handleQuickStockUpdate = async (id: string, newStock: number) => {
    if (newStock < 0) return;
    try {
      setProducts(products.map((p) => (p.id === id ? { ...p, stock: newStock } : p)));
      await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stock: newStock }),
      });
    } catch (err) {
      console.error(err);
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = filterCategory === "Todas" || p.category === filterCategory;
    return matchesSearch && matchesCat;
  });

  const lowStockCount = products.filter((p) => p.stock > 0 && p.stock <= 3).length;
  const outOfStockCount = products.filter((p) => p.stock <= 0).length;

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <div className="w-12 h-12 rounded-full border-2 border-primary/20 border-t-primary animate-spin mb-4" />
        <p className="font-serif text-xs text-primary/70 tracking-[0.25em] uppercase">
          Verificando credenciales Hestia...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary/[0.04] to-white flex items-center justify-center p-6 text-primary">
        <div className="w-full max-w-md bg-white rounded-3xl border border-primary/10 shadow-[0_20px_50px_-15px_rgba(30,94,105,0.12)] p-8 sm:p-10 relative overflow-hidden">
          {/* Subtle Accent Glow */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-accent/15 rounded-full filter blur-2xl pointer-events-none" />

          <div className="text-center mb-8 relative z-10">
            <div className="inline-block p-1 bg-white rounded-full shadow-md mb-4 border border-primary/10">
              <Image 
                src="/logo.png" 
                alt="Hestia Logo" 
                width={64} 
                height={64} 
                className="rounded-full object-contain"
              />
            </div>
            <h2 className="font-serif text-2xl font-medium tracking-wide text-primary">
              Panel de Administración
            </h2>
            <p className="text-xs text-primary/60 mt-1 font-light tracking-[0.15em] uppercase">
              Ingreso Privado • Hestia
            </p>
          </div>

          {loginError && (
            <div className="mb-6 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs text-center font-medium animate-in fade-in">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5 relative z-10">
            <div>
              <label className="block text-xs uppercase tracking-[0.15em] font-semibold text-primary/70 mb-2">
                Usuario
              </label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-primary/40" />
                <input
                  type="text"
                  required
                  value={loginUser}
                  onChange={(e) => setLoginUser(e.target.value)}
                  placeholder="Usuario"
                  className="w-full pl-10 pr-4 py-3 text-xs rounded-xl border border-primary/20 focus:outline-hidden focus:border-primary font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-[0.15em] font-semibold text-primary/70 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-primary/40" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={loginPass}
                  onChange={(e) => setLoginPass(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-3 text-xs rounded-xl border border-primary/20 focus:outline-hidden focus:border-primary font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-primary/40 hover:text-primary p-1 cursor-pointer"
                  title={showPassword ? "Ocultar" : "Mostrar"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full bg-primary text-white py-3.5 rounded-full uppercase tracking-[0.2em] text-xs font-semibold hover:bg-accent transition-all duration-300 shadow-md btn-premium cursor-pointer disabled:opacity-70"
              >
                {isLoggingIn ? "Verificando..." : "Ingresar al Panel"}
              </button>
            </div>
          </form>

          <div className="mt-8 text-center border-t border-primary/10 pt-4">
            <Link
              href="/"
              className="text-[11px] uppercase tracking-wider text-primary/60 hover:text-primary transition-colors inline-flex items-center gap-1.5"
            >
              <ArrowLeft size={13} /> Volver a la Tienda
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FBFBFB] text-[#1E5E69]">
      {/* Top Header */}
      <header className="bg-white border-b border-primary/10 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <Link 
              href="/" 
              className="p-2 rounded-full hover:bg-primary/5 text-primary/70 hover:text-primary transition-colors flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider"
            >
              <ArrowLeft size={16} /> Ir a la Tienda
            </Link>
            <div className="h-6 w-px bg-primary/10" />
            <div className="flex items-center gap-2.5">
              <Image 
                src="/logo.png" 
                alt="Logo" 
                width={36} 
                height={36} 
                className="rounded-full"
              />
              <span className="font-serif text-xl tracking-wider font-semibold text-primary">
                Panel Hestia
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/5 border border-primary/10 text-xs font-medium text-primary">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Hola, Malena</span>
            </div>

            <button
              onClick={openNewModal}
              className="bg-primary text-white px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider flex items-center gap-2 hover:bg-accent transition-colors shadow-xs cursor-pointer btn-premium"
            >
              <Plus size={16} /> Nuevo Producto
            </button>

            <button
              onClick={handleLogout}
              className="p-2.5 rounded-full hover:bg-red-50 text-primary/60 hover:text-red-600 transition-colors cursor-pointer border border-primary/10"
              title="Cerrar Sesión"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* KPI / Metrics Section */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-primary/10 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center text-primary">
              <TrendingUp size={22} />
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wider text-primary/60 font-semibold">
                Visitas Totales
              </p>
              <h3 className="font-serif text-2xl font-bold text-primary mt-0.5">
                {metrics?.pageViews ?? "..."}
              </h3>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-primary/10 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-accent/15 flex items-center justify-center text-accent">
              <MessageCircle size={22} />
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wider text-primary/60 font-semibold">
                Clics a WhatsApp
              </p>
              <h3 className="font-serif text-2xl font-bold text-primary mt-0.5">
                {metrics?.whatsappClicks ?? "..."}
              </h3>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-primary/10 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center text-primary">
              <Package size={22} />
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wider text-primary/60 font-semibold">
                Productos Activos
              </p>
              <h3 className="font-serif text-2xl font-bold text-primary mt-0.5">
                {products.length}
              </h3>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-primary/10 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
              <AlertTriangle size={22} />
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wider text-primary/60 font-semibold">
                Control de Stock
              </p>
              <div className="flex gap-2 items-baseline mt-0.5">
                <span className="font-serif text-lg font-bold text-amber-600">
                  {lowStockCount} bajos
                </span>
                <span className="text-xs text-red-500 font-semibold">
                  • {outOfStockCount} sin stock
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Inventory Management Table */}
        <section className="bg-white rounded-2xl border border-primary/10 shadow-xs overflow-hidden">
          {/* Table Toolbar */}
          <div className="p-6 border-b border-primary/10 flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
            <div>
              <h2 className="font-serif text-xl font-medium text-primary">
                Inventario y Catálogo de Productos
              </h2>
              <p className="text-xs text-primary/60 mt-0.5">
                Gestiona velas, difusores, sprays y accesorios en tiempo real.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Search */}
              <div className="relative flex-1 sm:w-64">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/40" />
                <input
                  type="text"
                  placeholder="Buscar producto..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs rounded-full border border-primary/20 focus:outline-hidden focus:border-primary"
                />
              </div>

              {/* Category Filter */}
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="py-2 px-3 text-xs rounded-full border border-primary/20 bg-white focus:outline-hidden text-primary font-medium cursor-pointer"
              >
                <option value="Todas">Todas las Categorías</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-primary/5 uppercase tracking-wider text-[11px] text-primary/70 border-b border-primary/10">
                <tr>
                  <th className="py-3.5 px-6 font-semibold">Producto</th>
                  <th className="py-3.5 px-6 font-semibold">Categoría</th>
                  <th className="py-3.5 px-6 font-semibold">Precio</th>
                  <th className="py-3.5 px-6 font-semibold">Stock</th>
                  <th className="py-3.5 px-6 font-semibold">Estado</th>
                  <th className="py-3.5 px-6 font-semibold text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary/5">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-primary/50 font-serif">
                      Cargando inventario...
                    </td>
                  </tr>
                ) : filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-primary/50 font-serif">
                      No se encontraron productos que coincidan con la búsqueda.
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((p) => {
                    const isOut = p.stock <= 0;
                    const isLow = p.stock > 0 && p.stock <= 3;

                    return (
                      <tr key={p.id} className="hover:bg-primary/2 transition-colors">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg border border-primary/15 bg-primary/5 overflow-hidden flex-shrink-0 flex items-center justify-center">
                              {p.imageUrl && !p.imageUrl.includes("placeholder") ? (
                                <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                              ) : (
                                <ImageIcon size={18} className="text-primary/30" />
                              )}
                            </div>
                            <div>
                              <div className="font-serif text-sm font-medium text-primary">
                                {p.name}
                              </div>
                              {p.description && (
                                <div className="text-[11px] text-primary/60 line-clamp-1 max-w-xs font-light">
                                  {p.description}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className="bg-primary/5 text-primary text-[10px] uppercase font-semibold tracking-wider px-2.5 py-1 rounded-full">
                            {p.category}
                          </span>
                        </td>
                        <td className="py-4 px-6 font-semibold text-primary">
                          {formatPrice(p.price)}
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleQuickStockUpdate(p.id, p.stock - 1)}
                              className="w-6 h-6 rounded-full border border-primary/20 flex items-center justify-center hover:bg-primary/10 text-primary font-bold cursor-pointer"
                              title="Restar 1 unidad"
                            >
                              -
                            </button>
                            <span className="font-semibold text-primary min-w-[20px] text-center">
                              {p.stock}
                            </span>
                            <button
                              onClick={() => handleQuickStockUpdate(p.id, p.stock + 1)}
                              className="w-6 h-6 rounded-full border border-primary/20 flex items-center justify-center hover:bg-primary/10 text-primary font-bold cursor-pointer"
                              title="Sumar 1 unidad"
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          {isOut ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                              Agotado
                            </span>
                          ) : isLow ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                              Stock Crítico
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                              Disponible
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => openEditModal(p)}
                              className="p-1.5 text-primary/60 hover:text-primary hover:bg-primary/5 rounded-md transition-colors cursor-pointer"
                              title="Editar"
                            >
                              <Edit3 size={15} />
                            </button>
                            <button
                              onClick={() => handleDelete(p.id, p.name)}
                              className="p-1.5 text-primary/40 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                              title="Eliminar"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* Modal Crear / Editar Producto */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-primary/10 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-6 border-b border-primary/10 flex justify-between items-center">
              <h3 className="font-serif text-2xl text-primary font-medium">
                {editingProduct ? "Editar Artículo" : "Agregar Nuevo Artículo"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-primary/50 hover:text-primary p-1.5 rounded-full hover:bg-primary/5 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="p-6 space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-primary/70 mb-1.5">
                  Nombre del Producto *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Vela Cera de Soja - Vainilla Bourbon"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 text-xs rounded-xl border border-primary/20 focus:outline-hidden focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-primary/70 mb-1.5">
                    Categoría *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as ProductCategory })}
                    className="w-full px-3 py-2.5 text-xs rounded-xl border border-primary/20 focus:outline-hidden focus:border-primary bg-white"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-primary/70 mb-1.5">
                    Precio ($ ARS) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    placeholder="15000"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-4 py-2.5 text-xs rounded-xl border border-primary/20 focus:outline-hidden focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-primary/70 mb-1.5">
                    Stock Disponible *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    placeholder="10"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full px-4 py-2.5 text-xs rounded-xl border border-primary/20 focus:outline-hidden focus:border-primary"
                  />
                </div>

                <div className="flex items-center pt-6">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-primary">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      className="rounded text-primary focus:ring-primary w-4 h-4"
                    />
                    Destacar en la portada
                  </label>
                </div>
              </div>

              {/* Foto del Producto */}
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-primary/70 mb-1.5">
                  Foto del Producto
                </label>
                <div className="flex items-center gap-4 p-3 bg-primary/2 rounded-2xl border border-primary/10">
                  {/* Vista previa miniatura */}
                  <div className="w-16 h-16 rounded-xl border border-primary/15 bg-white flex items-center justify-center overflow-hidden flex-shrink-0 shadow-xs">
                    {formData.imageUrl && !formData.imageUrl.includes("placeholder") ? (
                      <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon size={22} className="text-primary/30" />
                    )}
                  </div>

                  <div className="flex-1 space-y-1.5">
                    <label className="inline-flex items-center gap-2 bg-primary text-white text-xs font-semibold px-4 py-2 rounded-full cursor-pointer hover:bg-accent transition-colors shadow-xs">
                      <Upload size={14} />
                      {isUploading ? "Subiendo imagen..." : "Seleccionar Foto del Equipo"}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        disabled={isUploading}
                        className="hidden"
                      />
                    </label>

                    {formData.imageUrl && (
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, imageUrl: "" })}
                        className="block text-[11px] text-red-500 hover:underline cursor-pointer"
                      >
                        Quitar foto actual
                      </button>
                    )}
                    <p className="text-[10px] text-primary/50">
                      JPG, PNG, WEBP. Se guardará directamente en la tienda.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-primary/70 mb-1.5">
                  Descripción / Notas de Aroma
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe las notas aromáticas, medidas o cuidados..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2.5 text-xs rounded-xl border border-primary/20 focus:outline-hidden focus:border-primary"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-primary/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-full text-xs uppercase tracking-wider text-primary/70 hover:bg-primary/5 transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-primary text-white px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-accent transition-colors shadow-xs cursor-pointer"
                >
                  {editingProduct ? "Guardar Cambios" : "Crear Artículo"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
