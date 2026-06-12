import { FormEvent, useState } from 'react';
import { Cart, User, fetchRazorpayDemo } from '../api';

const IMAGE_BASE_URL = import.meta.env.VITE_API_URL!.replace('/api', '');

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
      <section className="grid gap-6 rounded-3xl border border-slate-800/80 bg-slate-900/50 p-6 shadow-2xl backdrop-blur-md animate-fade-in">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-bold tracking-tight text-white">Your Cart</h2>
          <p className="text-sm text-slate-400">Review your items before checkout.</p>
        </div>

        {(!cart || cart.items.length === 0) && (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-800 p-12 text-center bg-slate-950/20">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900/60 text-slate-500 border border-slate-800">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
            </div>
            <h3 className="mt-4 text-sm font-semibold text-slate-350 dark:text-slate-300">Your Cart is Empty</h3>
            <p className="mt-1.5 text-xs text-slate-500">Explore our products and add them to your cart.</p>
          </div>
        )}

        {cart && cart.items.length > 0 && (
          <div className="grid gap-6">
            <div className="grid gap-4">
              {cart.items.map((item) => (
                <article key={item.product._id} className="grid gap-4 rounded-3xl border border-slate-800/80 p-4 md:grid-cols-[180px_minmax(0,1fr)] bg-slate-950/20">
                  <img
                    src={
                      item.product.images?.[0]
                        ? item.product.images[0].startsWith('http')
                          ? item.product.images[0]
                          : `${IMAGE_BASE_URL}/uploads/products/${item.product.images[0]}`
                        : 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80'
                    }
                    alt={item.product.name}
                    className="h-44 w-full rounded-2xl object-cover md:h-full border border-slate-800"
                  />
                  <div className="grid gap-3">
                    <div>
                      <h3 className="text-lg font-bold text-white">{item.product.name}</h3>
                      <p className="mt-2 text-xs leading-5 text-slate-400">
                        {item.product.description ? item.product.description.slice(0, 120) : ''}
                        {item.product.description && item.product.description.length > 120 ? '...' : ''}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="rounded-xl bg-slate-900 border border-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-300">
                        ₹{(item.product.price ?? 0).toFixed(2)} each
                      </span>
                      <div className="flex items-center gap-2">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Qty</label>
                        <input
                          type="number"
                          min={1}
                          value={item.quantity}
                          onChange={(event) => onUpdateItem(item.product._id, Number(event.target.value))}
                          className="w-20 rounded-xl border border-slate-700 bg-slate-900/40 px-3 py-1.5 text-xs text-slate-100 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-950/50"
                        />
                      </div>
                      <button
                        type="button"
                        className="rounded-xl bg-rose-950/40 border border-rose-900/30 px-4 py-1.5 text-xs font-bold text-rose-400 transition hover:bg-rose-900/30 hover:text-rose-300"
                        onClick={() => onRemoveItem(item.product._id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className="grid gap-4 rounded-3xl bg-slate-950/60 border border-slate-900/60 p-6">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-400">Total Amount:</span>
                <strong className="text-xl text-indigo-400 font-bold">₹{totalAmount.toFixed(2)}</strong>
              </div>
              
              <form onSubmit={onCheckoutSubmit} className="grid gap-4">
                <label className="grid gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Shipping Address
                  <textarea
                    value={checkoutAddress}
                    onChange={(event) => onCheckoutAddressChange(event.target.value)}
                    required
                    placeholder="Enter your delivery address..."
                    className="mt-1 min-h-[100px] rounded-2xl border border-slate-700 bg-slate-900/40 px-4 py-3 text-sm text-slate-100 outline-none placeholder:text-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-950/50"
                  />
                </label>
                
                <label className="grid gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Payment Method
                  <select
                    value={checkoutMethod}
                    onChange={(event) => onCheckoutMethodChange(event.target.value)}
                    className="mt-1 rounded-2xl border border-slate-700 bg-slate-900/40 px-4 py-3 text-sm text-slate-100 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-950/50"
                  >
                    <option value="card" className="bg-slate-900">Credit / debit card</option>
                    <option value="razorpay" className="bg-slate-900">Razorpay</option>
                    <option value="paypal" className="bg-slate-900">PayPal</option>
                    <option value="cash" className="bg-slate-900">Cash on delivery</option>
                  </select>
                </label>

                {checkoutMethod === 'razorpay' && (
                  <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4 text-xs text-slate-450 dark:text-slate-400">
                    <p className="font-semibold text-indigo-400">Razorpay sandbox activated</p>
                    <p className="mt-1 leading-relaxed">After clicking submit, the Razorpay checkout overlay will open to simulate INR payment.</p>
                    <div className="mt-3 flex items-center gap-2">
                      <button
                        type="button"
                        className="rounded-xl border border-slate-800 bg-slate-900 px-3 py-1.5 text-[10px] font-bold text-slate-300 hover:bg-slate-800"
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
                      <span className="text-[10px] text-slate-500">(dev/demo environment only)</span>
                    </div>
                  </div>
                )}

                <button className="mt-2 rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-indigo-550 shadow-md shadow-indigo-900/20" type="submit">
                  Proceed to Checkout
                </button>
              </form>
            </div>
          </div>
        )}

        {!user && (
          <div className="flex flex-col items-center justify-center rounded-3xl bg-indigo-950/20 border border-indigo-900/30 p-8 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-950 text-indigo-400 border border-indigo-800/40">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0V10.5m-3.75 3h16.5M19.5 21H4.5c-.621 0-1.125-.504-1.125-1.125v-6.375c0-.621.504-1.125 1.125-1.125h15c.621 0 1.125.504 1.125 1.125v6.375c0 .621-.504 1.125-1.125 1.125z" />
              </svg>
            </div>
            <h3 className="mt-4 text-sm font-bold text-indigo-200">Sign In Required</h3>
            <p className="mt-1.5 text-xs text-indigo-300/60 max-w-xs leading-relaxed">
              You must log in to store your cart items, apply your preferences, and complete checkout.
            </p>
            <button
              type="button"
              className="mt-5 inline-flex items-center justify-center rounded-2xl bg-indigo-600 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-indigo-500 shadow-md shadow-indigo-900/20"
              onClick={onLogin}
            >
              Login Now
            </button>
          </div>
        )}
      </section>

      {showDemoModal && demoPayload && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowDemoModal(false)} />
          <div className="relative z-10 w-[90%] max-w-2xl rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <h3 className="text-lg font-bold text-white">Razorpay Demo Payload</h3>
              <button
                type="button"
                className="rounded-lg bg-slate-800 px-3 py-1 text-xs font-semibold text-slate-300 hover:bg-slate-700"
                onClick={() => setShowDemoModal(false)}
              >
                Close
              </button>
            </div>
            <div className="mt-4 max-h-72 overflow-auto rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs text-slate-350">
              <pre className="whitespace-pre-wrap">{JSON.stringify(demoPayload, null, 2)}</pre>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
