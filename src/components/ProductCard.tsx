"use client";

import { useCartStore, Product } from "../store/cartStore";
import { formatPrice } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const isOutOfStock = product.stock !== undefined && product.stock <= 0;
  const isLowStock = product.stock !== undefined && product.stock > 0 && product.stock <= 3;

  return (
    <div className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-primary/10 shadow-[0_4px_20px_-8px_rgba(30,94,105,0.06)] hover:shadow-[0_24px_50px_-15px_rgba(30,94,105,0.16)] hover:-translate-y-2 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]">
      {/* Product Image Container with Sheen Reflection */}
      <div className="aspect-[4/5] bg-gradient-to-b from-primary/[0.03] to-primary/[0.08] overflow-hidden flex items-center justify-center relative shine-overlay cursor-pointer">
        {/* Subtle Category Badge */}
        {product.category && (
          <span className="absolute top-4 left-4 z-10 bg-white/95 backdrop-blur-md text-primary text-[10px] uppercase tracking-[0.15em] font-semibold px-3 py-1 rounded-full shadow-xs border border-primary/10">
            {product.category}
          </span>
        )}

        {/* Stock Badge */}
        {isOutOfStock ? (
          <span className="absolute top-4 right-4 z-10 bg-red-50 text-red-700 border border-red-200 text-[10px] uppercase tracking-wider font-semibold px-2.5 py-1 rounded-full shadow-xs">
            Sin Stock
          </span>
        ) : isLowStock ? (
          <span className="absolute top-4 right-4 z-10 bg-amber-50 text-amber-800 border border-amber-200 text-[10px] uppercase tracking-wider font-semibold px-2.5 py-1 rounded-full shadow-xs">
            ¡Últimas {product.stock}!
          </span>
        ) : null}

        {/* Real image or luxury artistic placeholder */}
        {product.imageUrl && !product.imageUrl.includes("placeholder") ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center group-hover:scale-108 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]">
            <div className="w-24 h-32 border border-primary/20 rounded-t-full rounded-b-xl flex flex-col items-center justify-center bg-white/70 shadow-xs backdrop-blur-xs relative p-2">
              <span className="w-2 h-4 rounded-full bg-accent/60 mb-2 blur-[1px] animate-pulse" />
              <span className="text-primary/50 font-serif text-xs tracking-widest uppercase">Hestia</span>
            </div>
            <p className="text-primary/40 text-xs italic font-serif mt-3">Esencia Botánica</p>
          </div>
        )}
      </div>

      {/* Info & Action */}
      <div className="p-6 flex-1 flex flex-col justify-between text-center bg-white">
        <div>
          <h4 className="font-serif text-lg text-primary font-medium mb-1.5 leading-snug group-hover:text-accent transition-colors duration-300">
            {product.name}
          </h4>
          {product.description && (
            <p className="text-xs text-primary/65 line-clamp-2 mb-3 font-light leading-relaxed">
              {product.description}
            </p>
          )}
          <p className="font-serif text-xl text-primary font-semibold mb-4 tracking-tight">
            {formatPrice(product.price)}
          </p>
        </div>

        <div>
          <button
            onClick={() => addItem(product)}
            disabled={isOutOfStock}
            className={`w-full py-3 px-5 rounded-full text-xs uppercase tracking-[0.18em] font-semibold transition-all duration-300 btn-premium cursor-pointer ${
              isOutOfStock
                ? "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
                : "border border-primary text-primary hover:bg-primary hover:text-white shadow-xs hover:shadow-md"
            }`}
          >
            {isOutOfStock ? "Agotado" : "Agregar a la bolsa"}
          </button>
        </div>
      </div>
    </div>
  );
}
