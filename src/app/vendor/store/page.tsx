"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authFetch } from "@/lib/authFetch";

interface Store {
  name: string;
  description: string;
  latitude: number;
  longitude: number;
}

interface StoreResponse {
  store?: Store;
  message?: string;
}

function isValidLatitude(value: number): boolean {
  return Number.isFinite(value) && value >= -90 && value <= 90;
}

function isValidLongitude(value: number): boolean {
  return Number.isFinite(value) && value >= -180 && value <= 180;
}

export default function VendorStoreCreatePage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const parsedLatitude = Number(latitude);
    const parsedLongitude = Number(longitude);

    if (!isValidLatitude(parsedLatitude)) {
      setError("Please enter a valid latitude between -90 and 90.");
      return;
    }

    if (!isValidLongitude(parsedLongitude)) {
      setError("Please enter a valid longitude between -180 and 180.");
      return;
    }

    try {
      setLoading(true);

      const response = await authFetch("/api/vendor/store", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    name: name.trim(),
    lat: Number(latitude),
    lng: Number(longitude),
    description: description.trim() || undefined,
  }),
});


      const data = (await response.json()) as StoreResponse;

      if (!response.ok) {
        throw new Error(data.message ?? "Failed to create store");
      }

      router.replace("/vendor/products");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to create store. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-xl">
      <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-zinc-100">Create Store</h2>
        <p className="mt-1 text-sm text-zinc-400">
          Add your store details to start listing products.
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="mb-1 block text-sm text-zinc-300" htmlFor="store-name">
              Store Name
            </label>
            <input
              className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white outline-none ring-[#4F7CFF] transition focus:ring-2"
              id="store-name"
              onChange={(event) => setName(event.target.value)}
              required
              type="text"
              value={name}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm text-zinc-300" htmlFor="store-description">
              Description
            </label>
            <textarea
              className="min-h-24 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white outline-none ring-[#4F7CFF] transition focus:ring-2"
              id="store-description"
              onChange={(event) => setDescription(event.target.value)}
              required
              value={description}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm text-zinc-300" htmlFor="store-latitude">
                Latitude
              </label>
              <input
                className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white outline-none ring-[#4F7CFF] transition focus:ring-2"
                id="store-latitude"
                inputMode="decimal"
                onChange={(event) => setLatitude(event.target.value)}
                placeholder="e.g. 28.6139"
                required
                type="text"
                value={latitude}
              />
            </div>

            <div>
              <label className="mb-1 block text-sm text-zinc-300" htmlFor="store-longitude">
                Longitude
              </label>
              <input
                className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white outline-none ring-[#4F7CFF] transition focus:ring-2"
                id="store-longitude"
                inputMode="decimal"
                onChange={(event) => setLongitude(event.target.value)}
                placeholder="e.g. 77.2090"
                required
                type="text"
                value={longitude}
              />
            </div>
          </div>

          {error ? <p className="text-sm text-[#FF453A]">{error}</p> : null}

          <button
            className="w-full rounded-lg bg-[#4F7CFF] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#3f6ef2] disabled:cursor-not-allowed disabled:opacity-60"
            disabled={loading}
            type="submit"
          >
            {loading ? "Creating store..." : "Create Store"}
          </button>
        </form>
      </div>
    </div>
  );
}
