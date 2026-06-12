import { FormEvent, useEffect, useMemo, useState } from 'react';
import Swal from 'sweetalert2';
import {
  addToCart,
  AdminSummary,
  Cart,
  Category,
  checkoutCart,
  createAdminUser,
  createRazorpayOrder,
  fetchAdminSummary,
  fetchAdminUsers,
  fetchCart,
  fetchCategories,
  fetchProduct,
  fetchProducts,
  fetchProfile,
  login,
  logout,
  Product,
  register,
  updateUserRole,
  User,
  verifyRazorpayPayment,
  toggleUserBlock,
  updateCartItem,
  removeCartItem,
  createProduct,
  uploadProductImages,
  createCategory,
  deleteProduct,
  updateProduct,
} from './api';
import Header from './components/Header';
import StatusBanner from './components/StatusBanner';
import AuthPanel from './components/AuthPanel';
import CartPanel from './components/CartPanel';
import ProductDetail from './components/ProductDetail';
import ProductGrid from './components/ProductGrid';
import AdminPanel from './components/AdminPanel';
import {verifyOtp} from './api';
declare global {
  interface Window {
    Razorpay?: any;
  }
}

type Page = 'home' | 'product' | 'cart' | 'auth' | 'admin';
type AuthMode = 'login' | 'register';
type AuthFormType = { name: string; email: string; password: string };
type EditProductForm = {
  _id: string;
  name: string;
  description: string;
  price: string;
  stock: string;
  category: string;
};
type Theme = 'light' | 'dark';

function App() {
  const [editProduct, setEditProduct] =
  useState<EditProductForm | null>(null);
  const [userPage, setUserPage] = useState(1);
const [userTotalPages, setUserTotalPages] = useState(1);
  const [page, setPage] = useState<Page>('home');
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('ecom_token'));
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<Cart | null>(null);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [checkoutAddress, setCheckoutAddress] = useState('');
  const [checkoutMethod, setCheckoutMethod] = useState('card');
  const [loading, setLoading] = useState(false);
  const [error, setErrorState] = useState('');
  const [message, setMessageState] = useState('');

  const setError = (msg: string) => {
    setErrorState(msg);
    if (msg) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: msg,
        confirmButtonColor: '#0f172a',
      });
    }
  };

  const setMessage = (msg: string) => {
    setMessageState(msg);
    if (msg) {
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: msg,
        timer: 1500,
        showConfirmButton: false,
      });
    }
  };
  const [theme, setTheme] = useState<Theme>(() => {
    const storedTheme = localStorage.getItem('ecom_theme');
    if (storedTheme === 'light' || storedTheme === 'dark') {
      return storedTheme;
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });
  const [authForm, setAuthForm] = useState<AuthFormType>({ name: '', email: '', password: '' });
  const [otp, setOtp] = useState('');
const [showOtpForm, setShowOtpForm] = useState(false);
const [verificationEmail, setVerificationEmail] =
  useState('');
  type NewAdminUser = { name: string; email: string; password: string; role: 'admin' | 'user' };

  const [adminSummary, setAdminSummary] = useState<AdminSummary | null>(null);
  const [adminUsers, setAdminUsers] = useState<User[]>([]);
  const [newAdminUser, setNewAdminUser] = useState<NewAdminUser>({ name: '', email: '', password: '', role: 'admin' });
  const [adminProducts, setAdminProducts] = useState<Product[]>([]);

const [newProduct, setNewProduct] = useState({
  name: '',
  description: '',
  price: '',
  stock: '',
  category: '',
});
useEffect(() => {
  if (
    page === 'admin' &&
    user?.role === 'admin'
  ) {
    loadAdminDashboard();
  }
}, [userPage]);
const [productImages, setProductImages] =
  useState<FileList | null>(null);
async function handleCreateProduct(
  event: FormEvent<HTMLFormElement>
) {
  event.preventDefault();

  try {
    setLoading(true);

    const createdProduct =
      await createProduct(
        {
          name: newProduct.name,
          description:
            newProduct.description,
          price: Number(
            newProduct.price
          ),
          stock: Number(
            newProduct.stock
          ),
          category:
            newProduct.category,
        },
        token ?? undefined
      );

    if (productImages) {
      await uploadProductImages(
        createdProduct._id,
        productImages,
        token ?? undefined
      );
    }

    setMessage(
      'Product created successfully'
    );

    setNewProduct({
      name: '',
      description: '',
      price: '',
      stock: '',
      category: '',
    });

    setProductImages(null);
    await loadAdminDashboard();
    await loadProducts();
  } catch (err) {
    setError(
      (err as Error).message
    );
  } finally {
    setLoading(false);
  }
}
async function handleDeleteProduct(
  productId: string
) {
  try {
    const confirm = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    });
    if (!confirm.isConfirmed) return;

    setLoading(true);
await deleteProduct(productId, token ?? undefined);

await Promise.all([
  loadAdminDashboard(),
  loadProducts()
]);
  } catch (err) {
    setError((err as Error).message);
  } finally {
    setLoading(false);
  }
}

async function handleToggleProductStatus(
  productId: string,
  isActive: boolean
) {
  try {
    setLoading(true);
   await updateProduct(productId, { isActive }, token ?? undefined);

await Promise.all([
  loadAdminDashboard(),
  loadProducts()
]);
  } catch (err) {
    setError((err as Error).message);
  } finally {
    setLoading(false);
  }
}
function handleEditProduct(
  product: Product
) {
  setEditProduct({
    _id: product._id,
    name: product.name,
    description: product.description,
    price: String(product.price),
    stock: String(product.stock),
    category:
      typeof product.category === 'string'
        ? product.category
        : '',
  });
}
function handleEditProductChange(
  field: keyof EditProductForm,
  value: string
) {
  setEditProduct((prev) =>
    prev
      ? {
          ...prev,
          [field]: value,
        }
      : prev
  );
}
async function handleUpdateProduct(
  event: FormEvent<HTMLFormElement>
) {
  event.preventDefault();

  if (!editProduct) return;

  try {
    setLoading(true);

    await updateProduct(
      editProduct._id,
      {
        name: editProduct.name,
        description:
          editProduct.description,
        price: Number(
          editProduct.price
        ),
        stock: Number(
          editProduct.stock
        ),
        category:
          editProduct.category,
      },
      token ?? undefined
    );

    setMessage(
      'Product updated successfully'
    );

    setEditProduct(null);

    await Promise.all([
      loadAdminDashboard(),
      loadProducts(),
    ]);
  } catch (err) {
    setError(
      (err as Error).message
    );
  } finally {
    setLoading(false);
  }
}

const [newCategory, setNewCategory] = useState({ name: '', slug: '' });

async function handleCreateCategory(event: FormEvent<HTMLFormElement>) {
  event.preventDefault();
  try {
    setLoading(true);
    await createCategory(newCategory, token ?? undefined);
    setNewCategory({ name: '', slug: '' });
    setMessage('Category created successfully');
    await loadCategories();
  } catch (err) {
    setError((err as Error).message);
  } finally {
    setLoading(false);
  }
}
  const cartItemCount = useMemo(
    () => cart?.items.reduce((count, item) => count + item.quantity, 0) ?? 0,
    [cart]
  );

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    localStorage.setItem('ecom_theme', theme);
  }, [theme]);

  useEffect(() => {
    loadProducts();
  }, [search, categoryFilter]);

  useEffect(() => {
    const storedToken = localStorage.getItem('ecom_token');
    if (storedToken) {
      setToken(storedToken);
      loadProfile(storedToken);
      loadCart(storedToken);
    }
  }, []);

  useEffect(() => {
    if (page === 'admin' && (!user || user.role !== 'admin')) {
      setError('Admin dashboard is only available to administrators.');
      setPage('home');
    }
  }, [page, user]);

  async function loadCategories() {
    try {
      const result = await fetchCategories();
      setCategories(result);
    } catch (err) {
      console.error(err);
    }
  }

  async function loadProducts() {
    try {
      setLoading(true);
      const result = await fetchProducts({ q: search, category: categoryFilter, limit: 50 });
      setProducts(result);
      setError('');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  async function loadProfile(authToken?: string) {
    try {
      setLoading(true);
      const profile = await fetchProfile(authToken ?? token ?? undefined);
      setUser(profile);
      setError('');
    } catch (err) {
      setUser(null);
      setToken(null);
      localStorage.removeItem('ecom_token');
      console.warn(err);
    } finally {
      setLoading(false);
    }
  }

  async function loadCart(authToken?: string) {
    try {
      const cartData = await fetchCart(authToken ?? token ?? undefined);
      setCart(cartData);
    } catch (err) {
      setCart(null);
    }
  }

  async function handleSelectProduct(productId: string) {
    try {
      setLoading(true);
      const product = await fetchProduct(productId);
      setSelectedProduct(product);
      setPage('product');
      setError('');
      setQuantity(1);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  const handleGoHome = () => {
    setPage('home');
    setSelectedProduct(null);
    setMessage('');
    setError('');
  };

  const handleToggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === 'dark' ? 'light' : 'dark'));
  };

  const handleGoCart = async () => {
    setPage('cart');
    setMessage('');
    setError('');
    if (user) {
      await loadCart();
    }
  };

  const handleGoAuth = (mode: AuthMode) => {
    setPage('auth');
    setAuthMode(mode);
    setMessage('');
    setError('');
  };

  const handleGoAdmin = async () => {
    if (!user || user.role !== 'admin') {
      setError('Admin dashboard is only available to administrators.');
      setMessage('');
      setPage('home');
      return;
    }

    setPage('admin');
    setMessage('');
    setError('');
    await loadAdminDashboard();
  };

async function loadAdminDashboard() {
  try {
    setLoading(true);

    const [summary, userResult, productResult] =
      await Promise.all([
        fetchAdminSummary(
          token ?? undefined
        ),
        fetchAdminUsers(
          userPage,
          5,
          token ?? undefined
        ),
        fetchProducts(
          { admin: true, limit: 100 },
          token ?? undefined
        ),
      ]);

    setAdminSummary(summary);
    setAdminUsers(userResult.users);
    setUserTotalPages(userResult.totalPages);
    setAdminProducts(productResult);
    setError('');
  } catch (err) {
    setError((err as Error).message);
  } finally {
    setLoading(false);
  }
}

  async function handleCreateAdminUser(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      setLoading(true);
      await createAdminUser(newAdminUser.name, newAdminUser.email, newAdminUser.password, newAdminUser.role, token ?? undefined);
      setNewAdminUser({ name: '', email: '', password: '', role: 'admin' });
      await loadAdminDashboard();
      setMessage('New user created successfully.');
      setError('');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  async function handleToggleRole(userId: string, role: string) {
    try {
      setLoading(true);
      await updateUserRole(userId, role, token ?? undefined);
      await loadAdminDashboard();
      setError('');
      setMessage(`User role updated to ${role}.`);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  async function handleToggleBlock(userId: string) {
    try {
      setLoading(true);
      await toggleUserBlock(userId, token ?? undefined);
      await loadAdminDashboard();
      setError('');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  async function handleLoginSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      setLoading(true);
      const result = await login(authForm.email, authForm.password);
      setToken(result.token);
      localStorage.setItem('ecom_token', result.token);
      setUser(result.user);
      setPage('home');
      setMessage('Login successful.');
      await loadCart(result.token);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  async function handleRegisterSubmit(
  event: FormEvent<HTMLFormElement>
) {
  event.preventDefault();

  try {
    setLoading(true);

    await register(
      authForm.name,
      authForm.email,
      authForm.password
    );

    setVerificationEmail(
      authForm.email
    );

    setShowOtpForm(true);

    setMessage(
      'OTP sent to your email'
    );
  } catch (err) {
    setError(
      (err as Error).message
    );
  } finally {
    setLoading(false);
  }
}




async function handleVerifyOtp(
  event: FormEvent<HTMLFormElement>
) {
  event.preventDefault();

  try {
    setLoading(true);

    await verifyOtp(
      verificationEmail,
      otp
    );

    setShowOtpForm(false);
    setOtp('');
    setAuthMode('login');

    setMessage(
      'Email verified successfully. Please login.'
    );
  } catch (err) {
    setError(
      (err as Error).message
    );
  } finally {
    setLoading(false);
  }
}
  


async function handleLogoutClick() {
    try {
      await logout(token ?? undefined);
    } catch {
      // ignore logout failure
    }
    setUser(null);
    setToken(null);
    localStorage.removeItem('ecom_token');
    setCart(null);    setAdminSummary(null);
    setAdminUsers([]);    setPage('home');
    setMessage('You have been logged out.');
    setError('');
  }

  async function handleAddProductToCart() {
    if (!user || !selectedProduct) {
      setError('Please log in to add items to your cart.');
      setPage('auth');
      setAuthMode('login');
      return;
    }

    try {
      setLoading(true);
      const result = await addToCart(selectedProduct._id, quantity, token ?? undefined);
      setCart(result);
      setMessage('Product added to cart.');
      setError('');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdateCartItem(productId: string, newQuantity: number) {
    try {
      setLoading(true);
      const result = await updateCartItem(productId, newQuantity, token ?? undefined);
      setCart(result);
      setMessage('Cart updated.');
      setError('');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  async function handleRemoveCartItem(productId: string) {
    try {
      setLoading(true);
      const result = await removeCartItem(productId, token ?? undefined);
      setCart(result);
      setMessage('Item removed from cart.');
      setError('');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  async function loadRazorpayScript(): Promise<boolean> {
    if (window.Razorpay) {
      return true;
    }

    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  }

  async function handleCheckoutSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user) {
      setError('Please log in before checking out.');
      setPage('auth');
      setAuthMode('login');
      return;
    }

    try {
      setLoading(true);
      if (checkoutMethod === 'razorpay') {
        const paymentData = await createRazorpayOrder(checkoutAddress, checkoutMethod, token ?? undefined);
        const scriptLoaded = await loadRazorpayScript();

        if (!scriptLoaded || !window.Razorpay) {
          throw new Error('Unable to load Razorpay checkout script.');
        }

        const razorpayOptions = {
          key: paymentData.keyId,
          amount: paymentData.razorpayOrder.amount,
          currency: paymentData.currency,
          name: 'Shopify Demo',
          description: 'Complete payment with Razorpay',
          order_id: paymentData.razorpayOrder.id,
          handler: async (response: any) => {
            try {
              await verifyRazorpayPayment(
                {
                  orderId: paymentData.order.id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_signature: response.razorpay_signature,
                },
                token ?? undefined
              );
              setCart({ items: [] });
              setMessage('Payment completed successfully.');
              setError('');
            } catch (verifyError) {
              setError((verifyError as Error).message);
            }
          },
          prefill: {
            name: user.name,
            email: user.email,
          },
          theme: {
            color: '#0f172a',
          },
          modal: {
            ondismiss: () => {
              setMessage('Payment process was cancelled.');
            },
          },
        };

        const razorpay = new window.Razorpay(razorpayOptions);
        razorpay.open();
      } else {
        const result = await checkoutCart(checkoutAddress, checkoutMethod, token ?? undefined);
        setCart({ items: [] });
        setMessage(`Order created: ₹${result.order.amount.toFixed(2)}`);
        setError('');
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  const totalAmount = useMemo(
    () => cart?.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0) ?? 0,
    [cart]
  );

  return (
    <div className="dark min-h-screen bg-[#090d16] text-slate-100 transition-colors duration-300">
      <div className="w-full px-4 md:px-8 py-6">
        <Header
          user={user}
          cartItemCount={cartItemCount}
          theme={theme}
          onHome={handleGoHome}
          onCart={handleGoCart}
          onAuth={handleGoAuth}
          onAdmin={handleGoAdmin}
          onLogout={handleLogoutClick}
          onToggleTheme={handleToggleTheme}
        />

        <div className="grid gap-6">
          <StatusBanner loading={loading} error={error} message={message} />

             {page === 'auth' ? (   showOtpForm ? (
     <section className="mx-auto w-full max-w-md rounded-3xl border border-slate-800/80 bg-slate-900/50 p-6 shadow-xl backdrop-blur-md animate-fade-in">
       <form
         onSubmit={handleVerifyOtp}
         className="grid gap-4"
       >
         <div className="text-center">
           <h2 className="text-2xl font-bold tracking-tight text-slate-100">
             Verify Email
           </h2>
           <p className="mt-2 text-sm text-slate-400">
             Enter the OTP sent to:
             <br />
             <strong className="text-indigo-400 font-semibold">{verificationEmail}</strong>
           </p>
         </div>
 
         <input
           type="text"
           value={otp}
           onChange={(e) =>
             setOtp(e.target.value)
           }
           placeholder="Enter OTP code"
           className="mt-2 rounded-2xl border border-slate-700/80 bg-slate-800/40 px-4 py-3 text-center text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-950/50"
           required
         />
 
         <button
           type="submit"
           className="mt-2 inline-flex items-center justify-center rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-indigo-500 shadow-md shadow-indigo-100 dark:shadow-none"
         >
           Verify OTP
         </button>
       </form>
     </section>
  ) : (
    <AuthPanel
      mode={authMode}
      form={authForm}
      onModeChange={setAuthMode}
      onFormChange={(field, value) =>
        setAuthForm({
          ...authForm,
          [field]: value,
        })
      }
      onSubmit={
        authMode === 'login'
          ? handleLoginSubmit
          : handleRegisterSubmit
      }
    />
  )
  ): page === 'cart' ? (
            <CartPanel
              cart={cart}
              totalAmount={totalAmount}
              user={user}
              checkoutAddress={checkoutAddress}
              checkoutMethod={checkoutMethod}
              onCheckoutAddressChange={setCheckoutAddress}
              onCheckoutMethodChange={setCheckoutMethod}
              onUpdateItem={handleUpdateCartItem}
              onRemoveItem={handleRemoveCartItem}
              onCheckoutSubmit={handleCheckoutSubmit}
              onLogin={() => handleGoAuth('login')}
            />
          ) : page === 'admin' ? (
           <AdminPanel
           editProduct={editProduct}
onEditProduct={handleEditProduct}
onEditProductChange={
  handleEditProductChange
}
onUpdateProduct={
  handleUpdateProduct
}
             categories={categories}
             newCategory={newCategory}
             onNewCategoryChange={(field, value) =>
               setNewCategory({
                 ...newCategory,
                 [field]: value,
               })
             }
             onCreateCategory={handleCreateCategory}
             productImages={productImages}
             onProductImagesChange={setProductImages}
             userPage={userPage}
             userTotalPages={userTotalPages}
             onUserPageChange={setUserPage}
             summary={adminSummary}
             users={adminUsers}
             products={adminProducts}
             newUser={newAdminUser}
             newProduct={newProduct}
             onNewUserChange={(field, value) =>
               setNewAdminUser({
                 ...newAdminUser,
                 [field]: value,
               })
             }
             onNewProductChange={(field, value) =>
               setNewProduct({
                 ...newProduct,
                 [field]: value,
               })
             }
             onCreateUser={handleCreateAdminUser}
             onCreateProduct={handleCreateProduct}
             onDeleteProduct={handleDeleteProduct}
             onToggleProductStatus={handleToggleProductStatus}
             onToggleRole={handleToggleRole}
             onToggleBlock={handleToggleBlock}
           />
          ) : selectedProduct ? (
            <ProductDetail
              product={selectedProduct}
              quantity={quantity}
              user={user}
              onQuantityChange={setQuantity}
              onAddToCart={handleAddProductToCart}
              onContinueShopping={handleGoHome}
            />
          ) : (
            <ProductGrid
              products={products}
              categories={categories}
              search={search}
              categoryFilter={categoryFilter}
              onSearchChange={setSearch}
              onCategoryChange={setCategoryFilter}
              onSelectProduct={handleSelectProduct}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
