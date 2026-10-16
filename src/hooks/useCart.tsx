"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Dataset } from "@/lib/utils";
import { useLocale } from "@/hooks/useLocale";

const CART_STORAGE_KEY = "madmp_cart_datasets";
const BRIDGE_API_URL = process.env.NEXT_PUBLIC_BRIDGE_URL || "http://localhost:5005";

interface CartContextType {
  cart: Dataset[];
  cartCount: number;
  isInCart: (id: string) => boolean;
  addToCart: (dataset: Dataset) => void;
  removeFromCart: (id: string) => void;
  toggleCart: (dataset: Dataset) => void;
  clearCart: () => void;
  isDrawerOpen: boolean;
  setIsDrawerOpen: (open: boolean) => void;
  isSubmitting: boolean;
  createDmpFromCart: (projectName?: string) => Promise<string | null>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Dataset[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { translateDict, locale } = useLocale();

  // Load cart from localStorage on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as Record<string, Dataset>;
        setCart(Object.values(parsed));
      }
    } catch (e) {
      console.error("Failed to load cart from localStorage", e);
    }
  }, []);

  const saveCart = (newCart: Dataset[]) => {
    setCart(newCart);
    if (typeof window === "undefined") return;
    const map: Record<string, Dataset> = {};
    newCart.forEach((ds) => {
      map[ds.id] = ds;
    });
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(map));
  };

  const isInCart = (id: string) => cart.some((ds) => ds.id === id);

  const addToCart = (dataset: Dataset) => {
    if (isInCart(dataset.id)) return;
    saveCart([...cart, dataset]);
  };

  const removeFromCart = (id: string) => {
    saveCart(cart.filter((ds) => ds.id !== id));
  };

  const toggleCart = (dataset: Dataset) => {
    if (isInCart(dataset.id)) {
      removeFromCart(dataset.id);
    } else {
      addToCart(dataset);
    }
  };

  const clearCart = () => {
    saveCart([]);
  };

  const createDmpFromCart = async (projectName?: string): Promise<string | null> => {
    if (cart.length === 0) return null;
    setIsSubmitting(true);

    try {
      const payload = {
        projectName:
          projectName ||
          `DMP for Reused Datasets (${new Date().toISOString().slice(0, 10)})`,
        datasets: cart.map((ds) => {
          const firstDist = ds.distributions?.[0];
          return {
            id: ds.id,
            title: translateDict(ds.title) || ds.id,
            description: translateDict(ds.description) || "",
            access: "open",
            format: firstDist?.format?.label || "Data",
            piveauUrl: `${window.location.origin}/${locale}/dataset/${ds.id}`,
            distributions: ds.distributions?.map((dist: any) => {
              // Extract URL whether it is a string or an array of strings
              const rawUrl = dist.access_url || dist.download_urls || dist.access_urls;
              const resolvedUrl = Array.isArray(rawUrl) ? (rawUrl[0] || "") : (rawUrl || "");

              return {
                title: translateDict(dist.title) || `${ds.id}-distribution`,
                downloadUrl: String(resolvedUrl),
                format: dist.format?.label || (typeof dist.format === "string" ? dist.format : "application/octet-stream"),
              };
            }) || [],
          };
        }),
      };

      const res = await fetch(`${BRIDGE_API_URL}/create-project-from-cart`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Bridge returned HTTP ${res.status}: ${errorText}`);
      }

      const data = await res.json();
      if (data.dsw_url) {
        window.open(data.dsw_url, "_blank");
        setIsDrawerOpen(false);
        return data.dsw_url;
      }
      return null;
    } catch (err) {
      console.error("Failed to create DSW project from cart:", err);
      alert(`Error creating DMP: ${err instanceof Error ? err.message : String(err)}`);
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount: cart.length,
        isInCart,
        addToCart,
        removeFromCart,
        toggleCart,
        clearCart,
        isDrawerOpen,
        setIsDrawerOpen,
        isSubmitting,
        createDmpFromCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}