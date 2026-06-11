export interface Category {
  _id: string;
  name: string;
  slug: string;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  images: string[];
  category: { name: string } | string | null;
  isActive: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  isBlocked?: boolean;
}

type UserResponse = Omit<User, 'id'> & {
  id?: string;
  _id?: string;
};

export interface AdminSummary {
  userCount: number;
  productCount: number;
  orderCount: number;
  totalRevenue: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
}

export interface Order {
  id: string;
  amount: number;
  paymentMethod: string;
  paymentStatus: string;
}

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api';

const defaultOptions: RequestInit = {
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json',
  },
};

function buildHeaders(token?: string): HeadersInit {
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function parseResponse(response: Response) {
  const body = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(body?.message ?? 'Request failed');
  }
  return body;
}

function normalizeUser(user: UserResponse): User {
  const id = user.id ?? user._id;

  if (!id) {
    throw new Error('User response is missing an id');
  }

  return {
    id,
    name: user.name,
    email: user.email,
    role: user.role,
    isBlocked: user.isBlocked,
  };
}

export async function fetchCategories(): Promise<Category[]> {
  const response = await fetch(`${API_BASE}/categories`, {
    ...defaultOptions,
  });
  const body = await parseResponse(response);
  return body.categories ?? [];
}

export async function fetchProducts(
  params?: {
    q?: string;
    category?: string;
    sort?: string;
    page?: number;
    limit?: number;
    admin?: boolean;
  },
  token?: string
): Promise<Product[]> {
  const url = new URL(`${API_BASE}/products`);
  if (params?.q) url.searchParams.append('q', params.q);
  if (params?.category) url.searchParams.append('category', params.category);
  if (params?.sort) url.searchParams.append('sort', params.sort);
  if (params?.page) url.searchParams.append('page', String(params.page));
  if (params?.limit) url.searchParams.append('limit', String(params.limit));
  if (params?.admin) url.searchParams.append('admin', 'true');

  const response = await fetch(url.toString(), {
    ...defaultOptions,
    headers: buildHeaders(token),
  });
  const body = await parseResponse(response);
  return body.products ?? [];
}

export async function fetchProduct(productId: string): Promise<Product> {
  const response = await fetch(`${API_BASE}/products/${productId}`, {
    ...defaultOptions,
  });
  const body = await parseResponse(response);
  return body.product;
}

export async function login(email: string, password: string): Promise<{ user: User; token: string }> {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    body: JSON.stringify({ email, password }),
    headers: buildHeaders(),
    credentials: 'include',
  });
  const body = await parseResponse(response);
  return { user: normalizeUser(body.user), token: body.token };
}

export async function register(
  name: string,
  email: string,
  password: string
): Promise<{
  success: boolean;
  message: string;
}> {
  const response = await fetch(
    `${API_BASE}/auth/register`,
    {
      method: 'POST',
      body: JSON.stringify({
        name,
        email,
        password,
      }),
      headers: buildHeaders(),
      credentials: 'include',
    }
  );

  return parseResponse(response);
}

export async function logout(token?: string): Promise<void> {
  const response = await fetch(`${API_BASE}/auth/logout`, {
    method: 'POST',
    headers: buildHeaders(token),
    credentials: 'include',
  });
  await parseResponse(response);
}

export async function fetchProfile(token?: string): Promise<User> {
  const response = await fetch(`${API_BASE}/users/profile`, {
    ...defaultOptions,
    headers: buildHeaders(token),
  });
  const body = await parseResponse(response);
  return normalizeUser(body.user);
}

export async function fetchCart(token?: string): Promise<Cart> {
  const response = await fetch(`${API_BASE}/cart`, {
    ...defaultOptions,
    headers: buildHeaders(token),
  });
  const body = await parseResponse(response);
  return body.cart;
}

export async function addToCart(productId: string, quantity: number, token?: string): Promise<Cart> {
  const response = await fetch(`${API_BASE}/cart/items`, {
    method: 'POST',
    body: JSON.stringify({ productId, quantity }),
    headers: buildHeaders(token),
    credentials: 'include',
  });
  const body = await parseResponse(response);
  return body.cart;
}

export async function updateCartItem(productId: string, quantity: number, token?: string): Promise<Cart> {
  const response = await fetch(`${API_BASE}/cart/items/${productId}`, {
    method: 'PUT',
    body: JSON.stringify({ quantity }),
    headers: buildHeaders(token),
    credentials: 'include',
  });
  const body = await parseResponse(response);
  return body.cart;
}

export async function removeCartItem(productId: string, token?: string): Promise<Cart> {
  const response = await fetch(`${API_BASE}/cart/items/${productId}`, {
    method: 'DELETE',
    headers: buildHeaders(token),
    credentials: 'include',
  });
  const body = await parseResponse(response);
  return body.cart;
}

export async function checkoutCart(
  shippingAddress: string,
  paymentMethod: string,
  token?: string
): Promise<{ order: Order }> {
  const response = await fetch(`${API_BASE}/cart/checkout`, {
    method: 'POST',
    body: JSON.stringify({ shippingAddress, paymentMethod }),
    headers: buildHeaders(token),
    credentials: 'include',
  });
  const body = await parseResponse(response);
  return { order: body.order };
}
// Development helper: fetch a demo Razorpay payload from the server.
// This endpoint returns an example Razorpay order and a small snippet
// describing how the frontend should invoke the checkout widget.
export async function fetchRazorpayDemo(): Promise<any> {
  const response = await fetch(`${API_BASE}/payments/razorpay/demo`, {
    ...defaultOptions,
  });
  const body = await parseResponse(response);
  return body;
}

export async function createRazorpayOrder(
  shippingAddress: string,
  paymentMethod: string,
  token?: string
): Promise<{ order: any; razorpayOrder: any; keyId: string; currency: string }> {
  const response = await fetch(`${API_BASE}/payments/razorpay/order`, {
    method: 'POST',
    body: JSON.stringify({ shippingAddress, paymentMethod }),
    headers: buildHeaders(token),
    credentials: 'include',
  });
  const body = await parseResponse(response);
  return {
    order: body.order,
    razorpayOrder: body.razorpayOrder,
    keyId: body.keyId,
    currency: body.currency,
  };
}

export async function verifyRazorpayPayment(
  params: {
    orderId: string;
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
  },
  token?: string
): Promise<{ order: any }> {
  const response = await fetch(`${API_BASE}/payments/razorpay/verify`, {
    method: 'POST',
    body: JSON.stringify(params),
    headers: buildHeaders(token),
    credentials: 'include',
  });
  const body = await parseResponse(response);
  return { order: body.order };
}

export async function fetchAdminSummary(token?: string): Promise<AdminSummary> {
  const response = await fetch(`${API_BASE}/dashboard/summary`, {
    ...defaultOptions,
    headers: buildHeaders(token),
  });
  const body = await parseResponse(response);
  return body as AdminSummary;
}

export async function fetchAdminUsers(
  page = 1,
  limit = 5,
  token?: string
): Promise<{
  users: User[];
  totalPages: number;
}> {
  const response = await fetch(
    `${API_BASE}/admin/users?page=${page}&limit=${limit}`,
    {
      ...defaultOptions,
      headers: buildHeaders(token),
    }
  );

  const body = await parseResponse(response);

  return {
    users: (body.users ?? []).map(normalizeUser),
    totalPages: body.totalPages ?? 1,
  };
}

export async function createAdminUser(
  name: string,
  email: string,
  password: string,
  role: 'user' | 'admin',
  token?: string
): Promise<User> {
  const response = await fetch(`${API_BASE}/admin/users`, {
    method: 'POST',
    body: JSON.stringify({ name, email, password, role }),
    headers: buildHeaders(token),
    credentials: 'include',
  });
  const body = await parseResponse(response);
  return normalizeUser(body.user);
}

export async function updateUserRole(userId: string, role: string, token?: string): Promise<User> {
  const response = await fetch(`${API_BASE}/admin/users/${userId}/role`, {
    method: 'PUT',
    body: JSON.stringify({ role }),
    headers: buildHeaders(token),
    credentials: 'include',
  });
  const body = await parseResponse(response);
  return normalizeUser(body.user);
}

export async function toggleUserBlock(userId: string, token?: string): Promise<User> {
  const response = await fetch(`${API_BASE}/admin/users/${userId}/block`, {
    method: 'PUT',
    headers: buildHeaders(token),
    credentials: 'include',
  });
  const body = await parseResponse(response);
  return normalizeUser(body.user);
}

export async function createProduct(
  productData: any,
  token?: string
): Promise<Product> {
  const response = await fetch(`${API_BASE}/products`, {
    method: 'POST',
    body: JSON.stringify(productData),
    headers: buildHeaders(token),
    credentials: 'include',
  });

  const body = await parseResponse(response);
  return body.product;
}

export async function uploadProductImages(
  productId: string,
  files: FileList,
  token?: string
) {
  const formData = new FormData();

  Array.from(files).forEach((file) => {
    formData.append('images', file);
  });

  const response = await fetch(
    `${API_BASE}/products/${productId}/images`,
    {
      method: 'POST',
      body: formData,
      headers: token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {},
      credentials: 'include',
    }
  );

  return parseResponse(response);
}

export async function createCategory(
  categoryData: { name: string; slug: string },
  token?: string
): Promise<Category> {
  const response = await fetch(`${API_BASE}/admin/categories`, {
    method: 'POST',
    body: JSON.stringify(categoryData),
    headers: buildHeaders(token),
    credentials: 'include',
  });
  const body = await parseResponse(response);
  return body.category;
}

export async function deleteProduct(productId: string, token?: string): Promise<void> {
  const response = await fetch(`${API_BASE}/products/${productId}`, {
    method: 'DELETE',
    headers: buildHeaders(token),
    credentials: 'include',
  });
  await parseResponse(response);
}

export async function updateProduct(
  productId: string,
  productData: any,
  token?: string
): Promise<Product> {
  const response = await fetch(`${API_BASE}/products/${productId}`, {
    method: 'PUT',
    body: JSON.stringify(productData),
    headers: buildHeaders(token),
    credentials: 'include',
  });
  const body = await parseResponse(response);
  return body.product;
}
export async function verifyOtp(
  email: string,
  otp: string
) {
  const response = await fetch(
    `${API_BASE}/auth/verify-otp`,
    {
      method: 'POST',
      body: JSON.stringify({
        email,
        otp,
      }),
      headers: buildHeaders(),
      credentials: 'include',
    }
  );

  return parseResponse(response);
}