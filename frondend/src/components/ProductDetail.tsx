import { Product, User } from '../api';
const IMAGE_BASE_URL =
  import.meta.env.VITE_API_URL!.replace(
    '/api',
    ''
  );

type Props = {
  product: Product;
  quantity: number;
  user: User | null;
  onQuantityChange: (quantity: number) => void;
  onAddToCart: () => void;
  onContinueShopping: () => void;
};

export default function ProductDetail({
  product,
  quantity,
  user,
  onQuantityChange,
  onAddToCart,
  onContinueShopping,
}: Props) {
  const categoryLabel =
    product.category && typeof product.category === 'object'
      ? product.category.name
      : product.category ?? 'Uncategorized';

  return (
    <section className="rounded-3xl border border-slate-800/80 bg-slate-900/50 p-6 shadow-2xl backdrop-blur-md animate-fade-in">
      <button
        type="button"
        className="mb-6 inline-flex items-center rounded-2xl bg-slate-950/40 border border-slate-800/80 px-4 py-2 text-xs font-bold text-slate-300 transition hover:bg-slate-900 hover:text-white"
        onClick={onContinueShopping}
      >
        &larr; Continue shopping
      </button>

      <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
        <img
          src={
            product.images?.[0]
              ? product.images[0].startsWith('http')
                ? product.images[0]
                : `${IMAGE_BASE_URL}/uploads/products/${product.images[0]}`
              : 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80'
          }
          alt={product.name}
          className="h-96 w-full rounded-3xl object-cover border border-slate-800"
        />

        <div className="grid gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-white">{product.name}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-400">{product.description}</p>
          </div>

          <div className="grid gap-3 rounded-3xl bg-slate-950/60 border border-slate-900/60 p-5">
            <div className="flex items-center justify-between text-sm text-slate-400">
              <span>Price</span>
              <strong className="text-indigo-400 text-lg font-bold">₹{product.price.toFixed(2)}</strong>
            </div>
            <div className="flex items-center justify-between text-sm text-slate-400">
              <span>Stock Status</span>
              <span className={`font-semibold ${product.stock > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {product.stock > 0 ? `${product.stock} items left` : 'Out of Stock'}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm text-slate-400">
              <span>Category</span>
              <span className="text-slate-300">{categoryLabel}</span>
            </div>
          </div>

          <div className="grid gap-4 rounded-3xl bg-slate-950/60 border border-slate-900/60 p-5">
            <label className="grid gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Quantity
              <input
                type="number"
                min={1}
                value={quantity}
                onChange={(event) => onQuantityChange(Number(event.target.value))}
                className="mt-1 rounded-2xl border border-slate-700/80 bg-slate-900/40 px-4 py-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-950/50"
              />
            </label>
            
            <button
              type="button"
              className="rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-indigo-500 shadow-md shadow-indigo-900/20"
              onClick={onAddToCart}
            >
              Add to cart
            </button>
            {!user && (
              <p className="text-xs text-center text-slate-500">You must log in to add items to the cart.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
