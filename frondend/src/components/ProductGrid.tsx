import { Category, Product } from '../api';
const IMAGE_BASE_URL =
  import.meta.env.VITE_API_URL!.replace('/api', '');

type Props = {
  products: Product[];
  categories: Category[];
  search: string;
  categoryFilter: string;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onSelectProduct: (productId: string) => void;
};

export default function ProductGrid({
  products,
  categories,
  search,
  categoryFilter,
  onSearchChange,
  onCategoryChange,
  onSelectProduct,
}: Props) {
  
  // Safe helper to resolve category name from ID or object structure
  const getCategoryName = (prodCategory: any) => {
    if (!prodCategory) return 'Product';
    if (typeof prodCategory === 'object' && prodCategory.name) {
      return prodCategory.name;
    }
    const matched = categories.find((c) => c._id === prodCategory || c.slug === prodCategory);
    return matched ? matched.name : 'Product';
  };

  return (
    <section className="grid gap-6">
      
      {/* Luxury Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950/20 via-slate-900/30 to-slate-950/40 border border-slate-800/80 p-8 md:p-12 lg:p-16 text-left animate-fade-in shadow-2xl">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 h-80 w-80 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 h-80 w-80 rounded-full bg-indigo-500/5 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-bold text-indigo-400 border border-indigo-500/20 uppercase tracking-wider">
            Premium Essentials 2026
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-none text-white bg-gradient-to-r from-white via-indigo-100 to-indigo-250 bg-clip-text text-transparent">
            Elevate Your Everyday Gear
          </h2>
          <p className="mt-4 text-xs sm:text-sm md:text-base text-slate-400 leading-relaxed">
            Discover hand-picked premium gadgets, wearables, and high-fidelity audio equipment. Crafted for absolute precision and premium utility.
          </p>
          <div className="mt-6">
            <button
              onClick={() => {
                document.getElementById('catalog-anchor')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="rounded-xl bg-indigo-600 px-5 py-3 text-xs font-bold text-white transition hover:bg-indigo-500 shadow-md shadow-indigo-900/20 hover:scale-[1.02] active:scale-[0.98]"
            >
              Shop Collection &darr;
            </button>
          </div>
        </div>
      </div>

      <div id="catalog-anchor" className="h-2" />

      {/* Filter & Search Section */}
      <div className="flex flex-col gap-4">
        {/* Search Input */}
        <div className="relative">
          <span className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-500">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.637 10.637z" />
            </svg>
          </span>
          <input
            type="search"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search products..."
            className="w-full rounded-2xl border border-slate-800/80 bg-slate-900/40 py-3.5 pl-11 pr-4 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-950/50 shadow-inner"
          />
        </div>

        {/* Category Horizontal Chips Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => onCategoryChange('')}
            className={`whitespace-nowrap rounded-2xl px-5 py-2 text-xs font-bold tracking-wide uppercase transition-all duration-200 border ${
              categoryFilter === ''
                ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-900/20'
                : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:bg-slate-800/80 hover:text-slate-200'
            }`}
          >
            All Categories
          </button>
          {categories.map((category) => (
            <button
              key={category._id}
              onClick={() => onCategoryChange(category.slug)}
              className={`whitespace-nowrap rounded-2xl px-5 py-2 text-xs font-bold tracking-wide uppercase transition-all duration-200 border ${
                categoryFilter === category.slug
                  ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-900/20'
                  : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:bg-slate-800/80 hover:text-slate-200'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
        {products.length === 0 ? (
          <div className="col-span-full rounded-3xl border border-dashed border-slate-800 bg-slate-900/20 p-12 text-center text-sm text-slate-400">
            No products found.
          </div>
        ) : (
          products.map((product) => (
            <article key={product._id} className="product-card animate-fade-in group overflow-hidden rounded-[2rem] border border-slate-800/60 bg-slate-900/30 backdrop-blur-sm shadow-xl hover:border-slate-700/80">
              <div className="relative overflow-hidden">
                <img
                  src={
                    product.images?.[0]
                      ? product.images[0].startsWith('http')
                        ? product.images[0]
                        : `${IMAGE_BASE_URL}/uploads/products/${product.images[0]}`
                      : 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80'
                  }
                  alt={product.name}
                  className="h-56 w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <span className="absolute top-3 left-3 bg-slate-950/85 border border-slate-800/60 backdrop-blur-md text-slate-300 px-2.5 py-1 text-[9px] uppercase font-bold tracking-wider rounded-xl">
                  {getCategoryName(product.category)}
                </span>
              </div>
              
              <div className="p-5">
                <h2 className="text-sm font-bold text-slate-100 group-hover:text-white transition line-clamp-1">{product.name}</h2>
                <p className="mt-2 text-[11px] leading-5 text-slate-400 h-10 overflow-hidden line-clamp-2">
                  {product.description}
                </p>
                <div className="mt-4 flex items-center justify-between gap-4">
                  <span className="text-sm font-bold text-indigo-400">₹{product.price.toFixed(2)}</span>
                  <button
                    className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-indigo-500 border border-indigo-600/40"
                    type="button"
                    onClick={() => onSelectProduct(product._id)}
                  >
                    View
                  </button>
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
