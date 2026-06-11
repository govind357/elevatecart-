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
  return (
    <section className="grid gap-6">
      <div className="grid gap-4 md:grid-cols-[1fr_220px]">
        <input
          type="search"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search products..."
          className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none shadow-sm transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-slate-500 dark:focus:ring-slate-700"
        />
        <select
          value={categoryFilter}
          onChange={(event) => onCategoryChange(event.target.value)}
          className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none shadow-sm transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-slate-500 dark:focus:ring-slate-700"
        >
          <option value="">All categories</option>
          {categories.map((category) => (
            <option key={category._id} value={category.slug}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {products.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
            No products found.
          </div>
        ) : (
          products.map((product) => (
            <article key={product._id} className="product-card animate-fade-in group overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
             <img
  src={
    product.images?.[0]
      ? `${IMAGE_BASE_URL}/uploads/products/${product.images[0]}`
      : 'https://via.placeholder.com/320'
  }
  alt={product.name}
  className="h-56 w-full object-cover transition duration-500 group-hover:scale-105"
/>
              <div className="p-5">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">{product.name}</h2>
                <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
                  {product.description.slice(0, 120)}{product.description.length > 120 ? '...' : ''}
                </p>
                <div className="mt-5 flex items-center justify-between gap-4">
                  <span className="text-lg font-semibold text-slate-900 dark:text-slate-100">₹{product.price.toFixed(2)}</span>
                  <button
                    className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
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
