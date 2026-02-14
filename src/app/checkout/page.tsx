"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { authFetch } from "@/lib/authFetch";

type CartItem = {
  id: number;
  productId: number;
  quantity: number;
  product: {
    id: number;
    name: string;
    price: number;
    stock: number;
    imageUrl?: string | null;
  };
};

type ApiError = {
  message?: string;
};

export default function CheckoutPage() {
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

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

  useEffect(() => {
    let active = true;

    async function fetchCart() {
      try {
        setLoading(true);
        setError(null);

        const response = await authFetch("/api/cart");
        const data = (await response.json()) as CartItem[] | ApiError;

        if (!response.ok) {
          const message = !Array.isArray(data) ? data.message : undefined;
          throw new Error(message ?? "Failed to load cart items.");
        }

        if (active) {
          setItems(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        if (!active) {
          return;
        }

        const message =
          err instanceof Error ? err.message : "Unable to load checkout details.";
        setError(message);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void fetchCart();

    return () => {
      active = false;
    };
  }, []);

  async function handlePlaceOrder() {
    try {
      setSubmitting(true);
      setError(null);

      const response = await authFetch("/api/checkout", {
        method: "POST",
      });

      const data = (await response.json()) as ApiError;
      if (!response.ok) {
        throw new Error(data.message ?? "Failed to place order.");
      }

      setSuccess(true);
      setTimeout(() => {
        router.replace("/orders");
      }, 900);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unable to place order right now.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black px-6 py-16 text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900/80 p-10">
          <div className="flex items-center gap-3 text-zinc-300">
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-zinc-500 border-t-white" />
            <span>Loading checkout...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black px-6 py-16 text-white">
      <div className="mx-auto w-full max-w-7xl space-y-6">
        <h1 className="text-5xl font-bold tracking-tight text-zinc-100">Checkout</h1>

        {error ? (
          <div className="rounded-xl border border-[#FF453A]/40 bg-[#FF453A]/10 p-4 text-sm text-[#FF8A80]">
            {error}
          </div>
        ) : null}

        {success ? (
          <div className="rounded-xl border border-[#30D158]/40 bg-[#30D158]/10 p-4 text-sm text-[#7EF2A0]">
            Order placed successfully. Redirecting to orders...
          </div>
        ) : null}

        {items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-700 bg-zinc-900/80 p-10 text-center text-zinc-400">
            Your cart is empty.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1fr]">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/90 p-6">
              <h2 className="text-4xl font-semibold text-zinc-100">Order Summary</h2>
              <div className="mt-6 space-y-4">
                {items.map((item, index) => (
                  <div
                    className="flex items-center justify-between border-b border-zinc-800 pb-4 last:border-b-0 last:pb-0"
                    key={item.id}
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative h-20 w-20 overflow-hidden rounded-xl bg-zinc-800">
                        <Image
                          alt={item.product.name}
                          className="object-cover"
                          fill
                          sizes="80px"
                          src={item.product.imageUrl ?? fallbackImages[index % fallbackImages.length]}
                        />
                      </div>
                      <div>
                        <p className="text-2xl font-semibold text-zinc-100">{item.product.name}</p>
                        <p className="text-xl text-zinc-400">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <p className="text-3xl font-semibold text-zinc-100">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-8 space-y-3 border-t border-zinc-800 pt-6 text-2xl text-zinc-300">
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
                <div className="mt-4 flex items-center justify-between border-t border-zinc-800 pt-4 text-4xl font-bold text-zinc-100">
                  <span>Total</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/90 p-6">
                <h2 className="text-4xl font-semibold text-zinc-100">Delivery Address</h2>
                <div className="mt-4 grid grid-cols-1 gap-4">
                  <input
                    className="rounded-xl border border-zinc-800 bg-black px-4 py-3 text-lg text-zinc-100 outline-none ring-[#4F7CFF] placeholder:text-zinc-500 focus:ring-2"
                    placeholder="Street Address"
                    type="text"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      className="rounded-xl border border-zinc-800 bg-black px-4 py-3 text-lg text-zinc-100 outline-none ring-[#4F7CFF] placeholder:text-zinc-500 focus:ring-2"
                      placeholder="City"
                      type="text"
                    />
                    <input
                      className="rounded-xl border border-zinc-800 bg-black px-4 py-3 text-lg text-zinc-100 outline-none ring-[#4F7CFF] placeholder:text-zinc-500 focus:ring-2"
                      placeholder="ZIP Code"
                      type="text"
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/90 p-6">
                <h2 className="text-4xl font-semibold text-zinc-100">Payment Method</h2>
                <div className="mt-4 grid grid-cols-1 gap-4">
                  <input
                    className="rounded-xl border border-zinc-800 bg-black px-4 py-3 text-lg text-zinc-100 outline-none ring-[#4F7CFF] placeholder:text-zinc-500 focus:ring-2"
                    placeholder="Card Number"
                    type="text"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      className="rounded-xl border border-zinc-800 bg-black px-4 py-3 text-lg text-zinc-100 outline-none ring-[#4F7CFF] placeholder:text-zinc-500 focus:ring-2"
                      placeholder="MM/YY"
                      type="text"
                    />
                    <input
                      className="rounded-xl border border-zinc-800 bg-black px-4 py-3 text-lg text-zinc-100 outline-none ring-[#4F7CFF] placeholder:text-zinc-500 focus:ring-2"
                      placeholder="CVV"
                      type="text"
                    />
                  </div>
                </div>
              </div>

              <button
                className="inline-flex w-full items-center justify-center rounded-xl bg-[#4F7CFF] px-6 py-4 text-3xl font-semibold text-white transition hover:bg-[#3f6ef2] disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-400"
                disabled={submitting || success}
                onClick={() => void handlePlaceOrder()}
                type="button"
              >
                {submitting ? "Placing Order..." : "Confirm Order"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
