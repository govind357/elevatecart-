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
    <section className="rounded-3xl border border-transparent bg-white p-6 shadow-2xl shadow-slate-200/80 dark:border-slate-800 dark:bg-slate-900 dark:shadow-slate-950/50">
      <button
        type="button"
        className="mb-6 inline-flex items-center rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
        onClick={onContinueShopping}
      >
        &larr; Continue shopping
      </button>

      <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
       <img
  src={
    product.images?.[0]
      ? `${IMAGE_BASE_URL}/uploads/products/${product.images[0]}`
      : 'https://via.placeholder.com/500'
  }
  alt={product.name}
  className="h-full w-full rounded-3xl object-cover"
/>

        <div className="grid gap-4">
          <div>
            <h2 className="text-3xl font-semibold text-slate-900 dark:text-white">{product.name}</h2>
            <p className="mt-3 text-slate-600 dark:text-slate-300">{product.description}</p>
          </div>

          <div className="grid gap-3 rounded-3xl bg-slate-50 p-5 dark:bg-slate-800">
            <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-300">
              <span>Price</span>
              <strong className="text-slate-900 dark:text-slate-100">₹{product.price.toFixed(2)}</strong>
            </div>
            <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-300">
              <span>Stock</span>
              <span>{product.stock}</span>
            </div>
            <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-300">
              <span>Category</span>
              <span>{categoryLabel}</span>
            </div>
          </div>

          <div className="grid gap-4 rounded-3xl bg-slate-50 p-5 dark:bg-slate-800">
            <label className="grid gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
              Quantity
              <input
                type="number"
                min={1}
                value={quantity}
                onChange={(event) => onQuantityChange(Number(event.target.value))}
                className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-slate-500 dark:focus:ring-slate-700"
              />
            </label>
            <button
              type="button"
              className="rounded-3xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
              onClick={onAddToCart}
            >
              Add to cart
            </button>
            {!user && (
              <p className="text-sm text-slate-500 dark:text-slate-400">You must log in to add items to the cart.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
