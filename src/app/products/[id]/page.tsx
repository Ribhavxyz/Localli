import Image from "next/image";
import Link from "next/link";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import AddToCartButton from "@/components/products/AddToCartButton";

type Product = {
  id: number;
  name: string;
  price: number;
  stock: number;
  store: { id: number; name: string };
  imageUrl?: string | null;
};

type ProductApiResponse = {
  product?: Product;
  message?: string;
};

type ProductPageProps = {
  params: Promise<{ id: string }>;
};

async function fetchProduct(productId: string): Promise<Product | null> {
  const requestHeaders = await headers();
  const host =
    requestHeaders.get("x-forwarded-host") ??
    requestHeaders.get("host") ??
    process.env.NEXT_PUBLIC_BASE_URL?.replace(/^https?:\/\//, "") ??
    "localhost:3000";
  const proto = requestHeaders.get("x-forwarded-proto") ?? "http";
  const origin = `${proto}://${host}`;

  const response = await fetch(`${origin}/api/products/${productId}`, {
    cache: "no-store",
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error("Failed to fetch product details");
  }

  const data = (await response.json()) as ProductApiResponse;
  return data.product ?? null;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;

  let product: Product | null = null;
  try {
    product = await fetchProduct(id);
  } catch {
    return (
      <div className="min-h-screen bg-black px-6 py-16 text-white">
        <div className="mx-auto max-w-3xl rounded-xl border border-red-900/40 bg-red-950/20 p-6">
          <h1 className="text-2xl font-semibold">Something went wrong</h1>
          <p className="mt-2 text-sm text-red-300">
            We could not load this product right now. Please try again.
          </p>
        </div>
      </div>
    );
  }

  if (!product) {
    notFound();
  }

  const inStock = product.stock > 0;

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900">
            <Image
              alt={product.name}
              className="object-cover"
              fill
              sizes="(max-width:768px) 100vw, 50vw"
              src={
                product.imageUrl && product.imageUrl.trim().length > 0
                  ? product.imageUrl
                  : "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1600&q=80"
              }
            />
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
            <p className="text-sm text-zinc-400">Product Details</p>
            <h1 className="mt-3 text-4xl font-bold">{product.name}</h1>
            <p className="mt-4 text-2xl font-semibold text-[#4F7CFF]">
              ${product.price.toFixed(2)}
            </p>
            <p className={`mt-4 text-lg ${inStock ? "text-[#30D158]" : "text-[#FF453A]"}`}>
              {inStock ? `In stock (${product.stock})` : "Out of stock"}
            </p>
            <p className="mt-4 text-sm text-zinc-400">
              Sold by{" "}
              <Link
                className="text-zinc-200 underline decoration-zinc-600 underline-offset-4 transition hover:text-white"
                href={`/stores/${product.store.id}`}
              >
                {product.store.name}
              </Link>
            </p>

            {inStock ? <AddToCartButton inStock={inStock} productId={product.id} /> : null}
          </div>
        </div>
      </div>
    </div>
  );
}
