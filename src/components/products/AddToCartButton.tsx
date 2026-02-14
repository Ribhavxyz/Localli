"use client";

import { useState } from "react";
import { authFetch } from "@/lib/authFetch";

interface AddToCartButtonProps {
  productId: number;
  inStock: boolean;
}

type ApiResponse = {
  message?: string;
};

export default function AddToCartButton({ productId, inStock }: AddToCartButtonProps) {
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);

  async function handleAddToCart() {
    try {
      setPending(true);
      setMessage(null);
      setIsError(false);

      const response = await authFetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
          quantity: 1,
        }),
      });

      const data = (await response.json()) as ApiResponse;
      if (!response.ok) {
        throw new Error(data.message ?? "Failed to add item to cart.");
      }

      setMessage("Added to cart.");
      setIsError(false);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Unable to add item to cart right now.";
      setMessage(errorMessage);
      setIsError(true);
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="mt-6">
      <button
        className="rounded-lg bg-[#4F7CFF] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#3f6ef2] disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-400"
        disabled={!inStock || pending}
        onClick={() => void handleAddToCart()}
        type="button"
      >
        {pending ? "Adding..." : "Add to Cart"}
      </button>

      {message ? (
        <p className={`mt-3 text-sm ${isError ? "text-[#FF453A]" : "text-[#30D158]"}`}>
          {message}
        </p>
      ) : null}
    </div>
  );
}
