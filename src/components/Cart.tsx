"use client";

import { ShoppingBag, X, Plus, Minus, Trash2, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { useCartStore } from "../store/cartStore";
import { formatPrice } from "@/lib/utils";

export default function Cart() {
  const [isOpen, setIsOpen] = useState(false);
  const { items, removeItem, updateQuantity, getCartTotal } = useCartStore();

  // Bloquear scroll de la página cuando el carrito está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleWhatsAppCheckout = async () => {
    if (items.length === 0) return;

    try {
      await fetch("/api/metrics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "whatsappClicks" }),
      });
    } catch (e) {
      console.error(e);
    }
    
    let message = "¡Hola Hestia! 🕯️ Deseo encargar las siguientes piezas:\n\n";
    items.forEach((item) => {
      const catText = item.category ? ` [${item.category}]` : "";
      message += `• ${item.quantity}x ${item.name}${catText} - $${(item.price * item.quantity).toLocaleString()}\n`;
    });
    message += `\n*Total estimado: $${getCartTotal().toLocaleString()}*\n\n¿Podríamos coordinar el envío y método de pago? ¡Muchas gracias!`;
    
    const whatsappNumber = "5491100000000"; // Número del cliente
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <>
      {/* Botón Carrito en Navbar */}
      <button 
        onClick={() => setIsOpen(true)}
        className="relative p-2.5 rounded-full hover:bg-primary/5 text-primary transition-all flex items-center justify-center cursor-pointer group"
        aria-label="Abrir bolsa de compras"
      >
        <ShoppingBag size={21} className="transition-transform duration-300 group-hover:scale-110" />
        {totalItems > 0 && (
          <span className="absolute -top-1 -right-1 bg-accent text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-xs">
            {totalItems}
          </span>
        )}
      </button>

      {/* Drawer Overlay & Panel */}
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Telón de fondo oscuro translúcido con desenfoque suave */}
          <div 
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
            onClick={() => setIsOpen(false)}
          />

          {/* Panel Lateral Drawer */}
          <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
            <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-primary/10 animate-in slide-in-from-right duration-300">
              
              {/* Header Minimalista y Delicado */}
              <div className="px-8 py-6 border-b border-primary/10 flex justify-between items-center bg-white">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.25em] text-accent font-semibold block">
                    Hestia • Boutique
                  </span>
                  <h2 className="font-serif text-2xl text-primary font-normal tracking-tight mt-0.5">
                    Tu Selección
                  </h2>
                </div>
                <button 
                  onClick={() => setIsOpen(false)} 
                  className="w-9 h-9 rounded-full flex items-center justify-center text-primary/60 hover:text-primary hover:bg-primary/5 transition-colors cursor-pointer"
                  title="Cerrar"
                >
                  <X size={19} />
                </button>
              </div>

              {/* Items List con scroll suave */}
              <div className="flex-1 min-h-0 overflow-y-auto px-8 py-6 divide-y divide-primary/5">
                {items.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-16 px-4">
                    <div className="w-16 h-16 rounded-full bg-primary/[0.04] flex items-center justify-center text-primary/30 mb-4 border border-primary/10">
                      <ShoppingBag size={24} />
                    </div>
                    <p className="font-serif text-xl text-primary font-normal">Tu bolsa está vacía</p>
                    <p className="text-xs text-primary/60 max-w-xs mt-2 font-light leading-relaxed">
                      Aún no has seleccionado ninguna pieza. Explora nuestras velas botánicas, difusores y esencias.
                    </p>
                    <button
                      onClick={() => setIsOpen(false)}
                      className="mt-6 border border-primary/30 text-primary text-xs uppercase tracking-[0.18em] px-6 py-2.5 rounded-full hover:bg-primary hover:text-white transition-all cursor-pointer font-medium"
                    >
                      Ver Catálogo
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {items.map((item) => (
                      <div key={item.id} className="pt-6 first:pt-0 flex gap-4 items-start">
                        {/* Foto del Producto con marco delicado */}
                        <div className="w-20 h-24 rounded-xl border border-primary/10 bg-primary/[0.03] overflow-hidden flex-shrink-0 flex items-center justify-center shadow-xs">
                          {item.imageUrl && !item.imageUrl.includes("placeholder") ? (
                            <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="flex flex-col items-center justify-center p-2 text-center">
                              <span className="w-1.5 h-3 bg-accent/60 rounded-full mb-1" />
                              <span className="text-[9px] text-primary/40 font-serif uppercase tracking-widest">Hestia</span>
                            </div>
                          )}
                        </div>

                        {/* Detalle del Producto */}
                        <div className="flex-1 min-w-0 flex flex-col justify-between h-24 py-0.5">
                          <div>
                            {item.category && (
                              <span className="text-[10px] uppercase tracking-[0.18em] text-accent font-semibold block mb-0.5">
                                {item.category}
                              </span>
                            )}
                            <h4 className="font-serif text-primary text-sm font-medium leading-snug line-clamp-2">
                              {item.name}
                            </h4>
                            <p className="text-xs font-semibold text-primary mt-1">
                              {formatPrice(item.price)}
                            </p>
                          </div>

                          {/* Controles de Cantidad y Eliminar */}
                          <div className="flex items-center justify-between mt-auto">
                            <div className="inline-flex items-center border border-primary/15 rounded-full px-2.5 py-1 bg-white shadow-2xs">
                              <button 
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="text-primary/60 hover:text-primary p-0.5 cursor-pointer transition-colors"
                                aria-label="Restar una unidad"
                              >
                                <Minus size={12} />
                              </button>
                              <span className="px-3 text-xs font-semibold text-primary min-w-[18px] text-center">
                                {item.quantity}
                              </span>
                              <button 
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="text-primary/60 hover:text-primary p-0.5 cursor-pointer transition-colors"
                                aria-label="Sumar una unidad"
                              >
                                <Plus size={12} />
                              </button>
                            </div>

                            <button 
                              onClick={() => removeItem(item.id)}
                              className="text-primary/35 hover:text-red-500 p-1.5 transition-colors cursor-pointer"
                              title="Quitar de la bolsa"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer / Resumen Limpio y Elegante */}
              {items.length > 0 && (
                <div className="p-8 border-t border-primary/10 bg-white space-y-5">
                  <div className="space-y-2">
                    <div className="flex justify-between items-baseline">
                      <span className="text-xs uppercase tracking-[0.2em] text-primary/60 font-medium">
                        Subtotal estimado
                      </span>
                      <span className="font-serif text-2xl text-primary font-normal tracking-tight">
                        {formatPrice(getCartTotal())}
                      </span>
                    </div>
                    <p className="text-[11px] text-primary/50 font-light leading-relaxed">
                      El costo de envío y personalizaciones se coordinan al instante por WhatsApp.
                    </p>
                  </div>

                  <button 
                    onClick={handleWhatsAppCheckout}
                    className="w-full bg-primary text-white py-4 rounded-full uppercase tracking-[0.2em] text-xs font-semibold hover:bg-accent transition-all duration-300 shadow-lg hover:shadow-xl btn-premium flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Finalizar Pedido vía WhatsApp</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              )}

            </div>
          </div>
        </div>
      )}
    </>
  );
}
