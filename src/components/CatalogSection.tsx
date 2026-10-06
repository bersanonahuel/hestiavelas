"use client";

import { useState } from "react";
import ProductCard from "./ProductCard";
import { Product } from "@/lib/db";

interface CatalogSectionProps {
  initialProducts: Product[];
}

export default function CatalogSection({ initialProducts }: CatalogSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("Todos");

  const categories = [
    "Todos",
    "Velas Aromáticas",
    "Difusores & Varillas",
    "Home Spray",
    "Accesorios & Apagavelas",
    "Sets & Regalos",
  ];

  const filteredProducts = selectedCategory === "Todos"
    ? initialProducts
    : initialProducts.filter((p) => p.category === selectedCategory);

  return (
    <section id="catalogo" className="py-24 px-6 max-w-7xl mx-auto scroll-mt-20">
      <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
        <span className="text-[11px] uppercase tracking-[0.25em] text-accent font-semibold block">
          Catálogo Artesanal
        </span>
        <h3 className="font-serif text-3xl md:text-5xl text-primary font-normal tracking-tight">
          Colección de Autor
        </h3>
        <p className="text-sm md:text-base text-primary/70 font-light leading-relaxed">
          Cada aroma cuenta una historia. Explora nuestras diferentes fórmulas aromáticas y accesorios.
        </p>
      </div>

      {/* Category Pills Filter */}
      <div className="flex flex-wrap items-center justify-center gap-2.5 md:gap-3.5 mb-16">
        {categories.map((category) => {
          const isActive = selectedCategory === category;
          const count = category === "Todos"
            ? initialProducts.length
            : initialProducts.filter((p) => p.category === category).length;

          return (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-5 py-2.5 rounded-full text-xs uppercase tracking-[0.14em] transition-all duration-400 cursor-pointer flex items-center gap-2 ${
                isActive
                  ? "bg-primary text-white shadow-[0_8px_20px_-6px_rgba(30,94,105,0.35)] font-semibold -translate-y-0.5"
                  : "bg-primary/[0.04] text-primary/75 hover:bg-primary/[0.08] hover:text-primary border border-primary/5"
              }`}
            >
              <span>{category}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                isActive ? "bg-white/20 text-white" : "bg-primary/10 text-primary/60"
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Grid of Products with Staggered Visual Feel */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-20 px-4 bg-primary/[0.02] rounded-3xl border border-dashed border-primary/15 max-w-lg mx-auto">
          <p className="font-serif text-xl text-primary mb-1">Sin productos en esta categoría</p>
          <p className="text-xs text-primary/60">
            Pronto añadiremos nuevas creaciones para esta línea.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-9">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}
