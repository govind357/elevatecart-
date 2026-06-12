import { FormEvent } from 'react';
import { AdminSummary, User, Product, Category } from '../api';

type NewProductForm = {
  name: string;
  description: string;
  price: string;
  stock: string;
  category: string;
};
type NewUserForm = {
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
};
type NewCategoryForm = {
  name: string;
  slug: string;
};
type EditProductForm = {
  _id: string;
  name: string;
  description: string;
  price: string;
  stock: string;
  category: string;
};

type Props = {
  summary: AdminSummary | null;
  users: User[];
  products: Product[];
  categories: Category[];
  newUser: NewUserForm;
  newProduct: NewProductForm;
  newCategory: NewCategoryForm;

  onNewUserChange: (field: keyof NewUserForm, value: string) => void;
  onNewProductChange: (field: keyof NewProductForm, value: string) => void;
  onNewCategoryChange: (field: keyof NewCategoryForm, value: string) => void;

  onCreateUser: (event: FormEvent<HTMLFormElement>) => void;
  onCreateProduct: (event: FormEvent<HTMLFormElement>) => void;
  onCreateCategory: (event: FormEvent<HTMLFormElement>) => void;

  onDeleteProduct: (productId: string) => void;
  onToggleProductStatus: (productId: string, isActive: boolean) => void;
  onToggleRole: (userId: string, role: string) => void;
  onToggleBlock: (userId: string) => void;
  onProductImagesChange: (files: FileList | null) => void;
  productImages: FileList | null;

  userPage: number;
  userTotalPages: number;
  onUserPageChange: (page: number) => void;

  editProduct: EditProductForm | null;
  onEditProduct: (product: Product) => void;
  onEditProductChange: (field: keyof EditProductForm, value: string) => void;
  onUpdateProduct: (event: FormEvent<HTMLFormElement>) => void;
};

export default function AdminPanel({
  summary,
  users,
  products,
  categories,
  newUser,
  newProduct,
  newCategory,
  onNewUserChange,
  onNewProductChange,
  onNewCategoryChange,
  onCreateUser,
  onCreateProduct,
  onCreateCategory,
  onDeleteProduct,
  onToggleProductStatus,
  onToggleRole,
  onToggleBlock,
  onProductImagesChange,
  productImages,
  userPage,
  userTotalPages,
  onUserPageChange,
  editProduct,
  onEditProduct,
  onEditProductChange,
  onUpdateProduct,
}: Props) {
  return (
    <section className="grid gap-6 rounded-3xl border border-slate-800 bg-slate-900/50 p-6 shadow-2xl backdrop-blur-md animate-fade-in text-slate-100">
      
      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
        <div className="rounded-3xl bg-slate-950/60 border border-slate-900/60 p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Users</p>
          <p className="mt-2 text-3xl font-bold text-white">{summary?.userCount ?? '-'}</p>
        </div>
        <div className="rounded-3xl bg-slate-950/60 border border-slate-900/60 p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Products</p>
          <p className="mt-2 text-3xl font-bold text-white">{summary?.productCount ?? '-'}</p>
        </div>
        <div className="rounded-3xl bg-slate-950/60 border border-slate-900/60 p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Orders</p>
          <p className="mt-2 text-3xl font-bold text-white">{summary?.orderCount ?? '-'}</p>
        </div>
        <div className="rounded-3xl bg-slate-950/60 border border-slate-900/60 p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Revenue</p>
          <p className="mt-2 text-3xl font-bold text-indigo-400">₹{summary ? summary.totalRevenue.toFixed(2) : '0.00'}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        
        {/* Create User Form */}
        <div className="grid gap-4 rounded-3xl bg-slate-950/60 border border-slate-900/60 p-5">
          <h2 className="text-lg font-bold text-white">Create Admin/User</h2>
          <form onSubmit={onCreateUser} className="grid gap-4">
            <label className="grid gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Name
              <input
                value={newUser.name}
                onChange={(event) => onNewUserChange('name', event.target.value)}
                placeholder="User name"
                className="mt-1 rounded-2xl border border-slate-700 bg-slate-900/40 px-4 py-3 text-sm text-slate-100 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-950/50"
                required
              />
            </label>
            <label className="grid gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Email Address
              <input
                type="email"
                value={newUser.email}
                onChange={(event) => onNewUserChange('email', event.target.value)}
                placeholder="user@example.com"
                className="mt-1 rounded-2xl border border-slate-700 bg-slate-900/40 px-4 py-3 text-sm text-slate-100 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-950/50"
                required
              />
            </label>
            <label className="grid gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Password
              <input
                type="password"
                value={newUser.password}
                onChange={(event) => onNewUserChange('password', event.target.value)}
                placeholder="••••••••"
                className="mt-1 rounded-2xl border border-slate-700 bg-slate-900/40 px-4 py-3 text-sm text-slate-100 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-950/50"
                required
              />
            </label>
            <label className="grid gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Role
              <select
                value={newUser.role}
                onChange={(event) => onNewUserChange('role', event.target.value)}
                className="mt-1 rounded-2xl border border-slate-700 bg-slate-900/40 px-4 py-3 text-sm text-slate-100 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-950/50"
              >
                <option value="admin" className="bg-slate-900">Admin</option>
                <option value="user" className="bg-slate-900">User</option>
              </select>
            </label>
            <button className="mt-2 rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-indigo-550 shadow-md shadow-indigo-900/20" type="submit">
              Create Account
            </button>
          </form>
        </div>

        {/* User Management List */}
        <div className="rounded-3xl bg-slate-950/60 border border-slate-900/60 p-5">
          <h2 className="text-lg font-bold text-white">Recent Users</h2>
          <div className="mt-4 space-y-3">
            {users.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-6">No users found.</p>
            ) : (
              users.map((user) => (
                <div key={user.id} className="rounded-2xl border border-slate-800/80 bg-slate-900/30 p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-bold text-white">{user.name}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{user.email}</p>
                      <span className="inline-flex mt-1.5 rounded-md bg-slate-950 px-2 py-0.5 text-[10px] font-bold text-slate-500 uppercase tracking-wide border border-slate-900">
                        {user.role}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        className="rounded-xl border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:bg-slate-800"
                        onClick={() => onToggleRole(user.id, user.role === 'admin' ? 'user' : 'admin')}
                      >
                        {user.role === 'admin' ? 'Demote' : 'Promote'}
                      </button>
                      <button
                        type="button"
                        className={`rounded-xl border px-3 py-1.5 text-xs font-semibold transition ${
                          user.isBlocked
                            ? 'bg-emerald-950/20 border-emerald-900/40 text-emerald-400 hover:bg-emerald-900/30'
                            : 'bg-rose-950/20 border-rose-900/40 text-rose-400 hover:bg-rose-900/30'
                        }`}
                        onClick={() => onToggleBlock(user.id)}
                      >
                        {user.isBlocked ? 'Unblock' : 'Block'}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
            
            {/* Pagination */}
            <div className="mt-4 flex items-center justify-center gap-3">
              <button
                type="button"
                disabled={userPage === 1}
                onClick={() => onUserPageChange(userPage - 1)}
                className="rounded-xl bg-slate-900 border border-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-300 disabled:opacity-40"
              >
                Previous
              </button>
              <span className="text-xs font-semibold text-slate-400">
                Page {userPage} of {userTotalPages}
              </span>
              <button
                type="button"
                disabled={userPage === userTotalPages}
                onClick={() => onUserPageChange(userPage + 1)}
                className="rounded-xl bg-slate-900 border border-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-300 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr_1.2fr]">
        
        {/* Create Category */}
        <div className="rounded-3xl bg-slate-950/60 border border-slate-900/60 p-5">
          <h2 className="text-lg font-bold text-white">Create Category</h2>
          <form onSubmit={onCreateCategory} className="mt-4 grid gap-4">
            <input
              type="text"
              placeholder="Category Name"
              value={newCategory.name}
              onChange={(e) => onNewCategoryChange('name', e.target.value)}
              className="rounded-2xl border border-slate-700 bg-slate-900/40 px-4 py-3 text-sm text-slate-100 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-950/50"
              required
            />
            <input
              type="text"
              placeholder="Category Slug"
              value={newCategory.slug}
              onChange={(e) => onNewCategoryChange('slug', e.target.value)}
              className="rounded-2xl border border-slate-700 bg-slate-900/40 px-4 py-3 text-sm text-slate-100 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-950/50"
              required
            />
            <button
              type="submit"
              className="rounded-2xl bg-indigo-600 px-5 py-3 font-bold text-white hover:bg-indigo-550 shadow-md shadow-indigo-900/20"
            >
              Create Category
            </button>
          </form>

          {editProduct && (
            <div className="rounded-2xl border border-amber-900/30 bg-amber-950/10 p-5 mt-6">
              <h2 className="text-md font-bold text-amber-300">Edit Product</h2>
              <form onSubmit={onUpdateProduct} className="mt-4 grid gap-4">
                <input
                  value={editProduct.name}
                  onChange={(e) => onEditProductChange('name', e.target.value)}
                  className="rounded-2xl border border-slate-700 bg-slate-900/40 px-4 py-3 text-sm text-slate-100 outline-none focus:border-indigo-500"
                />
                <textarea
                  value={editProduct.description}
                  onChange={(e) => onEditProductChange('description', e.target.value)}
                  className="rounded-2xl border border-slate-700 bg-slate-900/40 px-4 py-3 text-sm text-slate-100 outline-none focus:border-indigo-500"
                />
                <input
                  type="number"
                  value={editProduct.price}
                  onChange={(e) => onEditProductChange('price', e.target.value)}
                  className="rounded-2xl border border-slate-700 bg-slate-900/40 px-4 py-3 text-sm text-slate-100 outline-none focus:border-indigo-500"
                />
                <input
                  type="number"
                  value={editProduct.stock}
                  onChange={(e) => onEditProductChange('stock', e.target.value)}
                  className="rounded-2xl border border-slate-700 bg-slate-900/40 px-4 py-3 text-sm text-slate-100 outline-none focus:border-indigo-500"
                />
                <button type="submit" className="rounded-2xl bg-emerald-600 px-5 py-3 font-bold text-white hover:bg-emerald-500">
                  Update Product
                </button>
              </form>
            </div>
          )}

          <div className="mt-6">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Existing Categories</h3>
            <div className="mt-2 max-h-48 overflow-y-auto space-y-2">
              {categories.map((cat) => (
                <div key={cat._id} className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/30 px-3 py-2">
                  <span className="text-sm font-semibold text-slate-350">{cat.name}</span>
                  <span className="text-[10px] text-slate-500 uppercase font-mono">{cat.slug}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Create Product Form */}
        <div className="rounded-3xl bg-slate-950/60 border border-slate-900/60 p-5">
          <h2 className="text-lg font-bold text-white">Create Product</h2>
          <form onSubmit={onCreateProduct} className="mt-4 grid gap-4">
            <input
              type="text"
              placeholder="Product Name"
              value={newProduct.name}
              onChange={(e) => onNewProductChange('name', e.target.value)}
              className="rounded-2xl border border-slate-700 bg-slate-900/40 px-4 py-3 text-sm text-slate-100 outline-none focus:border-indigo-500"
            />
            <textarea
              placeholder="Description"
              value={newProduct.description}
              onChange={(e) => onNewProductChange('description', e.target.value)}
              className="rounded-2xl border border-slate-700 bg-slate-900/40 px-4 py-3 text-sm text-slate-100 outline-none focus:border-indigo-500"
            />
            <input
              type="number"
              placeholder="Price"
              value={newProduct.price}
              onChange={(e) => onNewProductChange('price', e.target.value)}
              className="rounded-2xl border border-slate-700 bg-slate-900/40 px-4 py-3 text-sm text-slate-100 outline-none focus:border-indigo-500"
            />
            <input
              type="number"
              placeholder="Stock"
              value={newProduct.stock}
              onChange={(e) => onNewProductChange('stock', e.target.value)}
              className="rounded-2xl border border-slate-700 bg-slate-900/40 px-4 py-3 text-sm text-slate-100 outline-none focus:border-indigo-500"
            />
            
            <label className="grid gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Product Images
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => onProductImagesChange(e.target.files)}
                className="mt-1 rounded-2xl border border-slate-700 bg-slate-900/40 px-4 py-2.5 text-xs text-slate-400 outline-none focus:border-indigo-500"
              />
            </label>

            {productImages && productImages.length > 0 && (
              <div className="mt-1">
                <p className="text-[10px] font-semibold text-slate-500 mb-2">Selected Images:</p>
                <div className="flex flex-wrap gap-2">
                  {Array.from(productImages).map((file, idx) => (
                    <div key={idx} className="relative w-12 h-12 rounded-xl overflow-hidden border border-slate-800 shadow-inner">
                      <img src={URL.createObjectURL(file)} alt="preview" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <select
              value={newProduct.category}
              onChange={(e) => onNewProductChange('category', e.target.value)}
              className="rounded-2xl border border-slate-700 bg-slate-900/40 px-4 py-3 text-sm text-slate-350 outline-none focus:border-indigo-500"
              required
            >
              <option value="" className="bg-slate-900">Select Category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id} className="bg-slate-900">
                  {cat.name}
                </option>
              ))}
            </select>
            
            <button
              type="submit"
              className="rounded-2xl bg-indigo-600 px-5 py-3 font-bold text-white hover:bg-indigo-550 shadow-md shadow-indigo-900/20"
            >
              Create Product
            </button>
          </form>
        </div>

        {/* Product List */}
        <div className="rounded-3xl bg-slate-950/60 border border-slate-900/60 p-5">
          <h2 className="text-lg font-bold text-white">Products</h2>
          <div className="mt-4 space-y-3 max-h-[480px] overflow-y-auto pr-1">
            {products.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-6">No products found.</p>
            ) : (
              products.map((product) => (
                <div key={product._id} className="rounded-2xl border border-slate-800 bg-slate-900/30 p-4">
                  <div className="flex flex-col gap-2">
                    <p className="font-bold text-white">{product.name}</p>
                    <p className="text-xs text-indigo-400 font-semibold mt-0.5">₹{product.price}</p>
                    <p className="text-xs text-slate-400">Stock: {product.stock}</p>
                    <p className="text-xs text-slate-450">
                      Status: <span className={product.isActive ? 'text-emerald-400' : 'text-slate-500'}>{product.isActive ? 'Active' : 'Inactive'}</span>
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mt-3">
                      <button
                        type="button"
                        onClick={() => onToggleProductStatus(product._id, !product.isActive)}
                        className={`rounded-xl border px-3 py-1.5 text-xs font-semibold transition ${
                          product.isActive
                            ? 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
                            : 'bg-indigo-950/20 border-indigo-900/40 text-indigo-400 hover:bg-indigo-900/30'
                        }`}
                      >
                        {product.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        type="button"
                        onClick={() => onEditProduct(product)}
                        className="rounded-xl border border-amber-900/30 bg-amber-950/20 px-3 py-1.5 text-xs font-semibold text-amber-400 hover:bg-amber-900/30"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteProduct(product._id)}
                        className="rounded-xl border border-rose-900/30 bg-rose-950/20 px-3 py-1.5 text-xs font-semibold text-rose-400 hover:bg-rose-900/30"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </section>
  );
}
