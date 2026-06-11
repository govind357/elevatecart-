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

  onNewUserChange: (
    field: keyof NewUserForm,
    value: string
  ) => void;

  onNewProductChange: (
    field: keyof NewProductForm,
    value: string
  ) => void;

  onNewCategoryChange: (
    field: keyof NewCategoryForm,
    value: string
  ) => void;

  onCreateUser: (
    event: FormEvent<HTMLFormElement>
  ) => void;

  onCreateProduct: (
    event: FormEvent<HTMLFormElement>
  ) => void;

  onCreateCategory: (
    event: FormEvent<HTMLFormElement>
  ) => void;

  onDeleteProduct: (
    productId: string
  ) => void;

  onToggleProductStatus: (
    productId: string,
    isActive: boolean
  ) => void;

  onToggleRole: (
    userId: string,
    role: string
  ) => void;

  onToggleBlock: (
    userId: string
  ) => void;

  onProductImagesChange: (
  files: FileList | null
) => void;

  productImages: FileList | null;


userPage: number;
userTotalPages: number;
onUserPageChange: (
  page: number
) => void;


editProduct: EditProductForm | null;

onEditProduct: (
  product: Product
) => void;

onEditProductChange: (
  field: keyof EditProductForm,
  value: string
) => void;

onUpdateProduct: (
  event: FormEvent<HTMLFormElement>
) => void;


};

// type Props = {
//   summary: AdminSummary | null;
//   users: User[];
//   newUser: NewUserForm;
//   onNewUserChange: (field: keyof NewUserForm, value: string) => void;
//   onCreateUser: (event: FormEvent<HTMLFormElement>) => void;
//   onToggleRole: (userId: string, role: string) => void;
//   onToggleBlock: (userId: string) => void;
// };

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
    <section className="grid gap-6 rounded-3xl bg-white p-6 shadow-2xl shadow-slate-200/80">
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-3xl bg-slate-50 p-5">
          <p className="text-sm font-medium text-slate-500">Users</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900">{summary?.userCount ?? '-'}</p>
        </div>
        <div className="rounded-3xl bg-slate-50 p-5">
          <p className="text-sm font-medium text-slate-500">Products</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900">{summary?.productCount ?? '-'}</p>
        </div>
        <div className="rounded-3xl bg-slate-50 p-5">
          <p className="text-sm font-medium text-slate-500">Orders</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900">{summary?.orderCount ?? '-'}</p>
        </div>
        <div className="rounded-3xl bg-slate-50 p-5">
          <p className="text-sm font-medium text-slate-500">Total Revenue</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900">${summary ? summary.totalRevenue.toFixed(2) : '0.00'}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <div className="grid gap-4 rounded-3xl bg-slate-50 p-5">
          <h2 className="text-xl font-semibold text-slate-900">Create Admin/User</h2>
          <form onSubmit={onCreateUser} className="grid gap-4">
            <label className="grid gap-2 text-sm font-medium text-slate-700">
              Name
              <input
                value={newUser.name}
                onChange={(event) => onNewUserChange('name', event.target.value)}
                className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                required
              />
            </label>
            <label className="grid gap-2 text-sm font-medium text-slate-700">
              Email
              <input
                type="email"
                value={newUser.email}
                onChange={(event) => onNewUserChange('email', event.target.value)}
                className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                required
              />
            </label>
            <label className="grid gap-2 text-sm font-medium text-slate-700">
              Password
              <input
                type="password"
                value={newUser.password}
                onChange={(event) => onNewUserChange('password', event.target.value)}
                className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                required
              />
            </label>
            <label className="grid gap-2 text-sm font-medium text-slate-700">
              Role
              <select
                value={newUser.role}
                onChange={(event) => onNewUserChange('role', event.target.value)}
                className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
              >
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
            </label>
            <button className="rounded-3xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800" type="submit">
              Create account
            </button>
          </form>
        </div>

        <div className="rounded-3xl bg-slate-50 p-5">
          <h2 className="text-xl font-semibold text-slate-900">Recent users</h2>
          <div className="mt-4 space-y-4">
            {users.length === 0 ? (
              <p className="text-sm text-slate-500">No users found.</p>
            ) : (
              users.map((user) => (
                <div key={user.id} className="rounded-3xl border border-slate-200 bg-white p-4">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{user.name}</p>
                      <p className="text-sm text-slate-500">{user.email}</p>
                      <p className="text-sm text-slate-500">Role: {user.role}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        className="rounded-3xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-800"
                        onClick={() => onToggleRole(user.id, user.role === 'admin' ? 'user' : 'admin')}
                      >
                        {user.role === 'admin' ? 'Demote' : 'Promote'}
                      </button>
                      <button
                        type="button"
                        className={`rounded-3xl px-4 py-2 text-xs font-semibold transition ${user.isBlocked ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' : 'bg-rose-50 text-rose-700 hover:bg-rose-100'}`}
                        onClick={() => onToggleBlock(user.id)}
                      >
                        {user.isBlocked ? 'Unblock' : 'Block'}
                      </button>
                    </div>
                  </div>
               
                </div>
              ))
            )}
               <div className="mt-4 flex items-center justify-center gap-3">
  <button
    type="button"
    disabled={userPage === 1}
    onClick={() => onUserPageChange(userPage - 1)}
    className="rounded-lg bg-slate-200 px-4 py-2 disabled:opacity-50"
  >
    Previous
  </button>

  <span className="text-sm font-medium">
    Page {userPage} of {userTotalPages}
  </span>

  <button
    type="button"
    disabled={userPage === userTotalPages}
    onClick={() => onUserPageChange(userPage + 1)}
    className="rounded-lg bg-slate-200 px-4 py-2 disabled:opacity-50"
  >
    Next
  </button>
</div>
          </div>
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr_1.2fr]">
  {/* Create Category */}
  <div className="rounded-3xl bg-slate-50 p-5">
    <h2 className="text-xl font-semibold text-slate-900">
      Create Category
    </h2>
    <form
      onSubmit={onCreateCategory}
      className="mt-4 grid gap-4"
    >
      <input
        type="text"
        placeholder="Category Name"
        value={newCategory.name}
        onChange={(e) =>
          onNewCategoryChange(
            'name',
            e.target.value
          )
        }
        className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
        required
      />

      <input
        type="text"
        placeholder="Category Slug"
        value={newCategory.slug}
        onChange={(e) =>
          onNewCategoryChange(
            'slug',
            e.target.value
          )
        }
        className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
        required
      />

      <button
        type="submit"
        className="rounded-3xl bg-slate-900 px-5 py-3 font-semibold text-white hover:bg-slate-800"
      >
        Create Category
      </button>
    </form>
    



{editProduct && (
  <div className="rounded-3xl bg-amber-50 p-5">
    <h2 className="text-xl font-semibold">
      Edit Product
    </h2>

    <form
      onSubmit={onUpdateProduct}
      className="mt-4 grid gap-4"
    >
      <input
        value={editProduct.name}
        onChange={(e) =>
          onEditProductChange(
            'name',
            e.target.value
          )
        }
        className="rounded-3xl border px-4 py-3"
      />

      <textarea
        value={editProduct.description}
        onChange={(e) =>
          onEditProductChange(
            'description',
            e.target.value
          )
        }
        className="rounded-3xl border px-4 py-3"
      />

      <input
        type="number"
        value={editProduct.price}
        onChange={(e) =>
          onEditProductChange(
            'price',
            e.target.value
          )
        }
        className="rounded-3xl border px-4 py-3"
      />

      <input
        type="number"
        value={editProduct.stock}
        onChange={(e) =>
          onEditProductChange(
            'stock',
            e.target.value
          )
        }
        className="rounded-3xl border px-4 py-3"
      />

      <button
        type="submit"
        className="rounded-3xl bg-green-600 px-5 py-3 text-white"
      >
        Update Product
      </button>
    </form>
  </div>
)}


    
    <div className="mt-6">
      <h3 className="text-sm font-semibold text-slate-700">Existing Categories</h3>
      <div className="mt-2 max-h-48 overflow-y-auto space-y-2">
        {categories.map((cat) => (
          <div key={cat._id} className="flex items-center justify-between rounded-xl bg-white px-3 py-2 border border-slate-100">
            <span className="text-sm font-medium text-slate-800">{cat.name}</span>
            <span className="text-xs text-slate-400">{cat.slug}</span>
          </div>
        ))}
      </div>
    </div>
  </div>

  {/* Create Product */}

  <div className="rounded-3xl bg-slate-50 p-5">
    <h2 className="text-xl font-semibold text-slate-900">
      Create Product
    </h2>

    <form
      onSubmit={onCreateProduct}
      className="mt-4 grid gap-4"
    >
      <input
        type="text"
        placeholder="Product Name"
        value={newProduct.name}
        onChange={(e) =>
          onNewProductChange(
            'name',
            e.target.value
          )
        }
        className="rounded-3xl border border-slate-200 bg-white px-4 py-3"
      />

      <textarea
        placeholder="Description"
        value={newProduct.description}
        onChange={(e) =>
          onNewProductChange(
            'description',
            e.target.value
          )
        }
        className="rounded-3xl border border-slate-200 bg-white px-4 py-3"
      />

      <input
        type="number"
        placeholder="Price"
        value={newProduct.price}
        onChange={(e) =>
          onNewProductChange(
            'price',
            e.target.value
          )
        }
        className="rounded-3xl border border-slate-200 bg-white px-4 py-3"
      />

      <input
        type="number"
        placeholder="Stock"
        value={newProduct.stock}
        onChange={(e) =>
          onNewProductChange(
            'stock',
            e.target.value
          )
        }
        className="rounded-3xl border border-slate-200 bg-white px-4 py-3"
      />
      <label className="grid gap-2 text-sm font-medium text-slate-700">
  Product Images

  <input
    type="file"
    multiple
    accept="image/*"
    onChange={(e) =>
      onProductImagesChange(
        e.target.files
      )
    }
    className="rounded-3xl border border-slate-200 bg-white px-4 py-3"
  />
</label>

{productImages && productImages.length > 0 && (
  <div className="mt-2">
    <p className="text-xs font-semibold text-slate-500 mb-2">Selected Images Preview:</p>
    <div className="flex flex-wrap gap-2">
      {Array.from(productImages).map((file, idx) => (
        <div key={idx} className="relative w-16 h-16 rounded-xl overflow-hidden border border-slate-200 shadow-sm animate-fade-in">
          <img
            src={URL.createObjectURL(file)}
            alt="preview"
            className="w-full h-full object-cover"
          />
        </div>
      ))}
    </div>
  </div>
)}
<select
  value={newProduct.category}
  onChange={(e) =>
    onNewProductChange(
      'category',
      e.target.value
    )
  }
  className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-slate-700 outline-none focus:border-slate-400"
  required
>
  <option value="">Select Category</option>
  {categories.map((cat) => (
    <option key={cat._id} value={cat._id}>
      {cat.name}
    </option>
  ))}
</select>
      <button
        type="submit"
        className="rounded-3xl bg-slate-900 px-5 py-3 font-semibold text-white hover:bg-slate-800"
      >
        Create Product
      </button>
    </form>
  </div>

  {/* Product List */}

  <div className="rounded-3xl bg-slate-50 p-5">
    <h2 className="text-xl font-semibold text-slate-900">
      Products
    </h2>

    <div className="mt-4 space-y-4">
      {products.length === 0 ? (
        <p className="text-sm text-slate-500">
          No products found.
        </p>
      ) : (
        products.map((product) => (
          <div
            key={product._id}
            className="rounded-3xl border border-slate-200 bg-white p-4"
          >
            <div className="flex flex-col gap-2">
              <p className="font-semibold text-slate-900">
                {product.name}
              </p>

              <p className="text-sm text-slate-500">
                ₹{product.price}
              </p>

              <p className="text-sm text-slate-500">
                Stock: {product.stock}
              </p>
              

              <p className="text-sm text-slate-500">
                Status:{' '}
                {product.isActive
                  ? 'Active'
                  : 'Inactive'}
              </p>

              <div className="flex gap-2 mt-2">
                <button
                  type="button"
                  onClick={() =>
                    onToggleProductStatus(
                      product._id,
                      !product.isActive
                    )
                  }
                  className="rounded-3xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white"
                >
                  {product.isActive
                    ? 'Deactivate'
                    : 'Activate'}
                </button>
                <button
  type="button"
  onClick={() => onEditProduct(product)}
  className="rounded-3xl bg-amber-500 px-4 py-2 text-xs font-semibold text-white"
>
  Edit
</button>

                <button
                  type="button"
                  onClick={() =>
                    onDeleteProduct(
                      product._id
                    )
                  }
                  className="rounded-3xl bg-red-600 px-4 py-2 text-xs font-semibold text-white"
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
