import Image from "next/image";
import Link from "next/link";
import Cart from "@/components/Cart";
import CatalogSection from "@/components/CatalogSection";
import MarqueeBanner from "@/components/MarqueeBanner";
import { getProducts, incrementMetric } from "@/lib/db";
import { Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function Home() {
  const products = await getProducts();
  
  try {
    await incrementMetric("pageViews");
  } catch (e) {
    // ignore in server render
  }

  return (
    <main className="flex min-h-screen flex-col bg-white selection:bg-accent/20 selection:text-primary">
      {/* 1. Barra Marquesina Infinita Superior */}
      <MarqueeBanner />

      {/* 2. Barra de Navegación Sofisticada con Glassmorphism */}
      <nav className="w-full border-b border-primary/10 py-4 px-6 md:px-12 flex justify-between items-center bg-white/90 backdrop-blur-md sticky top-0 z-40 transition-all">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <Image 
                src="/logo.png" 
                alt="Hestia Velas Logo" 
                width={52} 
                height={52} 
                className="rounded-full object-contain transition-transform duration-500 group-hover:scale-105"
              />
              <span className="absolute -inset-1 rounded-full bg-accent/20 filter blur-xs opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
            </div>
            <span className="font-serif text-2xl tracking-[0.2em] text-primary font-medium hidden sm:inline group-hover:text-primary/90 transition-colors">
              HESTIA
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-6 md:gap-10 text-[11px] uppercase tracking-[0.2em] font-medium text-primary/80">
          <div className="hidden md:flex gap-8 items-center">
            <a href="#catalogo" className="nav-link text-primary/80 hover:text-primary transition-colors">
              Catálogo
            </a>
            <a href="#nosotros" className="nav-link text-primary/80 hover:text-primary transition-colors">
              Filosofía
            </a>
            <a href="#contacto" className="nav-link text-primary/80 hover:text-primary transition-colors">
              Contacto
            </a>
            <Link 
              href="/admin" 
              className="bg-primary/5 hover:bg-primary/10 text-primary px-3.5 py-1.5 rounded-full transition-colors font-semibold"
            >
              Panel Admin
            </Link>
          </div>
          <Cart />
        </div>
      </nav>

      {/* 3. Hero Section con Gradiente de Luz Ambiental & Acabados de Lujo */}
      <section className="relative overflow-hidden flex flex-col items-center justify-center text-center px-6 py-24 md:py-36 bg-white border-b border-primary/5">
        {/* Glow de fondo cálido etéreo */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[450px] bg-[radial-gradient(circle,rgba(232,152,165,0.14)_0%,rgba(30,94,105,0.03)_50%,transparent_75%)] pointer-events-none filter blur-2xl" />

        <div className="max-w-3xl space-y-7 relative z-10">
          {/* Subtle Accent Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 border border-primary/10 text-[10px] uppercase tracking-[0.25em] text-primary font-semibold">
            <Sparkles size={12} className="text-accent" />
            <span>Velas • Fragancias de Autor • Decoración</span>
          </div>

          <h2 className="font-serif text-4xl sm:text-6xl md:text-7xl font-normal text-primary leading-[1.15] tracking-tight">
            Ilumina tu espacio, <br />
            <span className="italic font-serif text-accent relative inline-block">
              eleva tus sentidos.
              <span className="absolute bottom-1 left-0 w-full h-[2px] bg-accent/30 -z-10" />
            </span>
          </h2>

          <p className="text-base md:text-lg text-primary/70 font-light max-w-2xl mx-auto leading-relaxed">
            Creaciones artesanales que despiertan recuerdos y armonizan tus espacios cotidianos con ceras 100% vegetales, esencias puras y diseño atemporal.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <a 
              href="#catalogo" 
              className="bg-primary text-white px-9 py-4 rounded-full uppercase tracking-[0.2em] text-xs font-semibold hover:bg-accent transition-all duration-300 shadow-md hover:shadow-xl btn-premium cursor-pointer"
            >
              Explorar Colección
            </a>
            <a 
              href="https://wa.me/5491100000000?text=Hola%20Hestia,%20quisiera%20hacer%20una%20consulta"
              target="_blank"
              rel="noopener noreferrer"
              className="border border-primary/25 text-primary px-8 py-4 rounded-full uppercase tracking-[0.2em] text-xs font-semibold hover:bg-primary/5 transition-all duration-300 cursor-pointer"
            >
              Consultar por WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* 4. Catálogo Interactivo con Reflejos y Filtros */}
      <CatalogSection initialProducts={products} />

      {/* 5. Sección Filosofía con Tarjetas Elevadas */}
      <section id="nosotros" className="py-24 bg-gradient-to-b from-primary/[0.02] to-primary/[0.06] px-6 border-y border-primary/10 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
          <span className="text-[10px] uppercase tracking-[0.25em] text-accent font-semibold block">
            Nuestros Valores
          </span>
          <h3 className="font-serif text-3xl md:text-5xl text-primary font-normal">
            El arte de transformar el ambiente
          </h3>
          <p className="text-sm md:text-base text-primary/75 font-light leading-relaxed max-w-2xl mx-auto">
            En Hestia cada producto es elaborado meticulosamente a mano. Utilizamos ceras vegetales no tóxicas, aceites botánicos de alta concentración y recipientes de diseño que perduran como objetos de decoración.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-10 text-left">
            <div className="p-7 bg-white rounded-2xl border border-primary/10 shadow-[0_10px_30px_-15px_rgba(30,94,105,0.07)] hover:-translate-y-1 transition-transform duration-300">
              <span className="w-10 h-10 rounded-full bg-accent/15 flex items-center justify-center text-accent mb-4 font-serif text-lg font-bold">
                01
              </span>
              <h4 className="font-serif text-lg text-primary mb-2">100% Cera Botánica</h4>
              <p className="text-xs text-primary/65 font-light leading-relaxed">
                Libre de parafinas y tóxicos. Combustión limpia y hasta un 50% más duradera.
              </p>
            </div>

            <div className="p-7 bg-white rounded-2xl border border-primary/10 shadow-[0_10px_30px_-15px_rgba(30,94,105,0.07)] hover:-translate-y-1 transition-transform duration-300">
              <span className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4 font-serif text-lg font-bold">
                02
              </span>
              <h4 className="font-serif text-lg text-primary mb-2">Fragancias de Autor</h4>
              <p className="text-xs text-primary/65 font-light leading-relaxed">
                Aceites aromáticos puros formulados para una difusión envolvente y natural.
              </p>
            </div>

            <div className="p-7 bg-white rounded-2xl border border-primary/10 shadow-[0_10px_30px_-15px_rgba(30,94,105,0.07)] hover:-translate-y-1 transition-transform duration-300">
              <span className="w-10 h-10 rounded-full bg-accent/15 flex items-center justify-center text-accent mb-4 font-serif text-lg font-bold">
                03
              </span>
              <h4 className="font-serif text-lg text-primary mb-2">Objetos Sostenibles</h4>
              <p className="text-xs text-primary/65 font-light leading-relaxed">
                Vasos y envases reutilizables pensados para embellecer cualquier rincón.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Footer Sofisticado */}
      <footer id="contacto" className="bg-primary text-white py-16 px-6 text-center">
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          <div className="relative mb-5 group">
            <Image 
              src="/logo.png" 
              alt="Hestia Logo" 
              width={70} 
              height={70} 
              className="rounded-full object-contain bg-white p-1 shadow-md transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          <h4 className="font-serif text-2xl tracking-[0.25em] mb-2 font-medium">HESTIA</h4>
          <p className="text-xs text-white/70 max-w-md font-light mb-8 leading-relaxed">
            Velas, difusores y aromas diseñados para transformar cada instante cotidiano en un ritual sagrado de calma.
          </p>
          <div className="flex gap-8 text-[11px] uppercase tracking-[0.2em] mb-10 text-white/80">
            <a href="#catalogo" className="hover:text-accent transition-colors">Catálogo</a>
            <a href="https://wa.me/5491100000000" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">WhatsApp</a>
            <Link href="/admin" className="hover:text-accent transition-colors">Administración</Link>
          </div>
          <div className="border-t border-white/10 w-full pt-8 text-[11px] text-white/40">
            © {new Date().getFullYear()} Hestia. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </main>
  );
}
