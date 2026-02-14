"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { authFetch } from "@/lib/authFetch";

type CartItem = {
  id: number;
  userId: number;
  productId: number;
  quantity: number;
  product: {
    id: number;
    name: string;
    price: number;
    stock: number;
    storeId: number;
    imageUrl?: string | null;
  };
};

type ApiError = {
  message?: string;
};

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingById, setUpdatingById] = useState<Record<number, boolean>>({});
  const [removingById, setRemovingById] = useState<Record<number, boolean>>({});

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    [items]
  );
  const delivery = items.length > 0 ? 4.99 : 0;
  const tax = useMemo(() => subtotal * 0.08, [subtotal]);
  const totalPrice = subtotal + delivery + tax;

  const fallbackImages = [
    "https://images.unsplash.com/photo-1582655299221-2b6bff351df0?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1517701550927-30cf4ba1f5f5?auto=format&fit=crop&w=900&q=80",
  ];

  async function fetchCart() {
    try {
      setLoading(true);
      setError(null);

      const response = await authFetch("/api/cart");
      const data = (await response.json()) as CartItem[] | ApiError;

      if (!response.ok) {
        throw new Error(
          !Array.isArray(data) && data.message ? data.message : "Failed to load cart items."
        );
      }

      const nextItems = Array.isArray(data) ? data : [];
      setItems(nextItems);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unable to load your cart right now.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void fetchCart();
  }, []);

  async function handleUpdateQuantity(item: CartItem, nextQuantity: number) {
    if (!Number.isInteger(nextQuantity) || nextQuantity <= 0) {
      return;
    }

    try {
      setError(null);
      setUpdatingById((prev) => ({ ...prev, [item.id]: true }));

      const response = await authFetch(`/api/cart/${item.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ quantity: nextQuantity }),
      });

      const data = (await response.json()) as ApiError;
      if (!response.ok) {
        throw new Error(data.message ?? "Failed to update quantity.");
      }

      setItems((prev) =>
        prev.map((row) => (row.id === item.id ? { ...row, quantity: nextQuantity } : row))
      );
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unable to update quantity right now.";
      setError(message);
    } finally {
      setUpdatingById((prev) => ({ ...prev, [item.id]: false }));
    }
  }

  async function handleRemove(item: CartItem) {
    try {
      setError(null);
      setRemovingById((prev) => ({ ...prev, [item.id]: true }));

      const response = await authFetch(`/api/cart/${item.id}`, {
        method: "DELETE",
      });

      const data = (await response.json()) as ApiError;
      if (!response.ok) {
        throw new Error(data.message ?? "Failed to remove cart item.");
      }

      setItems((prev) => prev.filter((row) => row.id !== item.id));
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unable to remove item right now.";
      setError(message);
    } finally {
      setRemovingById((prev) => ({ ...prev, [item.id]: false }));
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black px-6 py-16 text-white">
        <div className="mx-auto max-w-7xl rounded-2xl border border-zinc-800 bg-zinc-900/70 p-10 text-center text-zinc-300">
          Loading cart...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black px-6 py-16 text-white">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-10 text-5xl font-bold tracking-tight">Shopping Cart</h1>

        {error ? (
          <div className="mb-6 rounded-xl border border-[#FF453A]/40 bg-[#FF453A]/10 p-4 text-sm text-[#FF8A80]">
            {error}
          </div>
        ) : null}

        {items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-700 bg-zinc-900/70 p-10 text-center text-zinc-400">
            Your cart is empty.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_420px]">
            <div className="space-y-4">
              {items.map((item, index) => {
                const isUpdating = Boolean(updatingById[item.id]);
                const isRemoving = Boolean(removingById[item.id]);
                const pending = isUpdating || isRemoving;

                return (
                  <div
                    className="rounded-2xl border border-zinc-800 bg-zinc-900/90 p-5"
                    key={item.id}
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-4">
                        <div className="relative h-24 w-24 overflow-hidden rounded-xl bg-zinc-800">
                          <Image
                            alt={item.product.name}
                            className="h-full w-full object-cover"
                            fill
                            sizes="96px"
                            src={item.product.imageUrl ?? fallbackImages[index % fallbackImages.length]}
                          />
                        </div>
                        <div>
                          <p className="text-3xl font-semibold text-zinc-100">{item.product.name}</p>
                          <p className="mt-1 text-xl text-zinc-400">
                            Price: ${item.product.price.toFixed(2)}
                          </p>
                          <div className="mt-4 flex items-center gap-4">
                            <button
                              className="h-12 w-12 rounded-xl bg-zinc-800 text-2xl text-zinc-200 transition hover:bg-zinc-700 disabled:opacity-50"
                              disabled={pending || item.quantity <= 1}
                              onClick={() => void handleUpdateQuantity(item, item.quantity - 1)}
                              type="button"
                            >
                              -
                            </button>
                            <span className="min-w-8 text-center text-3xl font-semibold">
                              {item.quantity}
                            </span>
                            <button
                              className="h-12 w-12 rounded-xl bg-zinc-800 text-2xl text-zinc-200 transition hover:bg-zinc-700 disabled:opacity-50"
                              disabled={pending || item.quantity >= item.product.stock}
                              onClick={() => void handleUpdateQuantity(item, item.quantity + 1)}
                              type="button"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between gap-4 sm:block">
                        <p className="text-4xl font-bold text-zinc-100">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </p>
                        <button
                          className="mt-2 text-2xl text-red-400 transition hover:text-red-300 disabled:opacity-50"
                          disabled={pending}
                          onClick={() => void handleRemove(item)}
                          type="button"
                        >
                          🗑
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="h-fit rounded-2xl border border-zinc-800 bg-zinc-900/90 p-6">
              <h2 className="text-4xl font-semibold text-zinc-100">Order Summary</h2>

              <div className="mt-8 space-y-4 text-2xl text-zinc-300">
                <div className="flex items-center justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-zinc-100">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Delivery</span>
                  <span className="font-semibold text-zinc-100">${delivery.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Tax</span>
                  <span className="font-semibold text-zinc-100">${tax.toFixed(2)}</span>
                </div>
              </div>

              <div className="my-8 h-px bg-zinc-800" />

              <div className="flex items-center justify-between text-4xl font-bold">
                <span>Total</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>

              <Link
                className="mt-8 inline-flex w-full items-center justify-center rounded-xl bg-[#4F7CFF] px-6 py-4 text-2xl font-semibold text-white transition hover:bg-[#3f6ef2]"
                href="/checkout"
              >
                Proceed to Checkout
              </Link>
              <Link
                className="mt-5 inline-flex w-full items-center justify-center text-xl text-zinc-400 transition hover:text-zinc-200"
                href="/"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
