import { FormEvent, useState } from 'react';
import { Cart, User, fetchRazorpayDemo } from '../api';

type Props = {
  cart: Cart | null;
  totalAmount: number;
  user: User | null;
  checkoutAddress: string;
  checkoutMethod: string;
  onCheckoutAddressChange: (value: string) => void;
  onCheckoutMethodChange: (value: string) => void;
  onUpdateItem: (productId: string, newQuantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onCheckoutSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onLogin: () => void;
};

export default function CartPanel({
  cart,
  totalAmount,
  user,
  checkoutAddress,
  checkoutMethod,
  onCheckoutAddressChange,
  onCheckoutMethodChange,
  onUpdateItem,
  onRemoveItem,
  onCheckoutSubmit,
  onLogin,
}: Props) {
  const [demoPayload, setDemoPayload] = useState<any | null>(null);
  const [showDemoModal, setShowDemoModal] = useState(false);
  return (
    <>
    <section className="grid gap-6 rounded-3xl border border-transparent bg-white p-6 shadow-2xl shadow-slate-200/80 dark:border-slate-800 dark:bg-slate-900 dark:shadow-slate-950/50">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Your Cart</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">Review your items before checkout.</p>
      </div>

      {(!cart || cart.items.length === 0) && (
        <div className="rounded-3xl border border-dashed border-slate-200 p-6 text-sm text-slate-600 dark:border-slate-700 dark:text-slate-300">
          Your cart is empty.
        </div>
      )}

      {cart && cart.items.length > 0 && (
        <div className="grid gap-6">
          <div className="grid gap-4">
            {cart.items.map((item) => (
              <article key={item.product._id} className="grid gap-4 rounded-3xl border border-slate-200 p-4 md:grid-cols-[180px_minmax(0,1fr)] dark:border-slate-700">
                <img
                  src={item.product.images?.[0] ?? 'https://via.placeholder.com/160'}
                  alt={item.product.name}
                  className="h-44 w-full rounded-3xl object-cover md:h-full"
                />
                <div className="grid gap-3">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{item.product.name}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                      {item.product.description ? item.product.description.slice(0, 120) : ''}
                      {item.product.description && item.product.description.length > 120 ? '...' : ''}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="rounded-3xl bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                      ₹{(item.product.price ?? 0).toFixed(2)} each
                    </span>
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium text-slate-600 dark:text-slate-300">Qty</label>
                      <input
                        type="number"
                        min={1}
                        value={item.quantity}
                        onChange={(event) => onUpdateItem(item.product._id, Number(event.target.value))}
                        className="w-20 rounded-3xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                      />
                    </div>
                    <button
                      type="button"
                      className="rounded-3xl bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-100 dark:bg-rose-950 dark:text-rose-200 dark:hover:bg-rose-900"
                      onClick={() => onRemoveItem(item.product._id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="grid gap-4 rounded-3xl bg-slate-50 p-6 dark:bg-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600 dark:text-slate-300">Total:</span>
              <strong className="text-xl text-slate-900 dark:text-white">₹{totalAmount.toFixed(2)}</strong>
            </div>
            <form onSubmit={onCheckoutSubmit} className="grid gap-4">
              <label className="grid gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
                Shipping address
                <textarea
                  value={checkoutAddress}
                  onChange={(event) => onCheckoutAddressChange(event.target.value)}
                  required
                  className="min-h-[120px] rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-slate-500 dark:focus:ring-slate-700"
                />
              </label>
              <label className="grid gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
                Payment method
                <select
                  value={checkoutMethod}
                  onChange={(event) => onCheckoutMethodChange(event.target.value)}
                  className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-slate-500 dark:focus:ring-slate-700"
                >
                  <option value="card">Credit / debit card</option>
              <option value="razorpay">Razorpay</option>
              <option value="paypal">PayPal</option>
              <option value="cash">Cash on delivery</option>
                </select>
              </label>

                {checkoutMethod === 'razorpay' && (
                  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
                    <p className="font-semibold text-slate-900 dark:text-white">Razorpay checkout</p>
                    <p>After you submit, the Razorpay checkout modal will open for secure INR payment.</p>
                    <div className="mt-3 flex items-center gap-2">
                      <button
                        type="button"
                        className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                        onClick={async () => {
                          try {
                            const demo = await fetchRazorpayDemo();
                            setDemoPayload(demo);
                            setShowDemoModal(true);
                          } catch (err) {
                            alert('Unable to fetch Razorpay demo: ' + (err as Error).message);
                          }
                        }}
                      >
                        Show demo payload
                      </button>
                      <span className="text-xs text-slate-500 dark:text-slate-400">(dev/demo only)</span>
                    </div>
                  </div>
                )}

              <button className="rounded-3xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200" type="submit">
                Checkout
              </button>
            </form>
          </div>
        </div>
      )}

      {!user && (
        <div className="rounded-3xl bg-sky-50 p-6 text-sm text-slate-700 dark:bg-sky-950 dark:text-sky-100">
          <p>You must log in to store your cart and complete checkout.</p>
          <button
            type="button"
            className="mt-4 inline-flex rounded-3xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
            onClick={onLogin}
          >
            Login now
          </button>
        </div>
      )}
    </section>
      {showDemoModal && demoPayload && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowDemoModal(false)} />
          <div className="relative z-10 w-[90%] max-w-2xl rounded-2xl bg-white p-6 shadow-lg dark:border dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-start justify-between gap-4">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Razorpay Demo Payload</h3>
              <button
                type="button"
                className="rounded-md bg-slate-100 px-3 py-1 text-sm text-slate-700 dark:bg-slate-800 dark:text-slate-200"
                onClick={() => setShowDemoModal(false)}
              >
                Close
              </button>
            </div>
            <div className="mt-4 max-h-72 overflow-auto rounded-md border border-slate-100 p-3 text-xs text-slate-800 dark:border-slate-700 dark:text-slate-200">
              <pre className="whitespace-pre-wrap">{JSON.stringify(demoPayload, null, 2)}</pre>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
