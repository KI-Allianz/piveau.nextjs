"use client";

import React, { useState } from "react";
import { useCart } from "@/hooks/useCart";
import { useLocale } from "@/hooks/useLocale";
import { X, Trash2, Rocket, ShoppingCart, ExternalLink, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";

export default function CartDrawer() {
  const { cart, cartCount, removeFromCart, clearCart, isDrawerOpen, setIsDrawerOpen, isSubmitting, createDmpFromCart } = useCart();
  const { translateDict, locale } = useLocale();
  const [customTitle, setCustomTitle] = useState("");

  if (!isDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={() => !isSubmitting && setIsDrawerOpen(false)}
      />

      {/* Slide-out Drawer */}
      <div className="relative z-50 w-full max-w-md bg-white dark:bg-neutral-900 h-full shadow-2xl flex flex-col justify-between border-l border-neutral-200 dark:border-neutral-800 animate-in slide-in-from-right duration-200">
        {/* Top Header */}
        <div className="p-5 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-foreground">DMP Dataset Cart</h3>
              <p className="text-xs text-muted-foreground">
                {cartCount} {cartCount === 1 ? "dataset" : "datasets"} selected for maDMP
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsDrawerOpen(false)}
            disabled={isSubmitting}
            className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dataset List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-muted-foreground gap-3">
              <FileText className="w-12 h-12 stroke-[1.2] opacity-40" />
              <p className="text-sm font-medium">Your DMP cart is empty.</p>
              <p className="text-xs max-w-xs">
                Browse the catalog and click <b>"Add to DMP"</b> on datasets you wish to include in your data management plan.
              </p>
            </div>
          ) : (
            cart.map((ds) => {
              const format = ds.distributions?.[0]?.format?.label || "Data";
              return (
                <div
                  key={ds.id}
                  className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/40 flex flex-col gap-2 hover:border-primary/50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-sm font-semibold text-foreground line-clamp-2 leading-snug">
                      {translateDict(ds.title) || ds.id}
                    </h4>
                    <button
                      onClick={() => removeFromCart(ds.id)}
                      disabled={isSubmitting}
                      className="text-muted-foreground hover:text-red-500 p-1 rounded transition-colors cursor-pointer"
                      title="Remove from cart"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
                    <Badge variant="secondary" className="text-[10px] py-0 px-2 font-mono">
                      {format}
                    </Badge>
                    <a
                      href={`/${locale}/dataset/${ds.id}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] hover:text-primary transition-colors"
                    >
                      <span>View details</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Actions */}
        {cart.length > 0 && (
          <div className="p-5 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950/70 space-y-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Plan / Project Name (optional)
              </label>
              <Input
                type="text"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                placeholder="e.g. AI Vibration Analysis maDMP"
                disabled={isSubmitting}
                className="h-9 text-xs"
              />
            </div>

            <Button
              onClick={() => createDmpFromCart(customTitle)}
              disabled={isSubmitting}
              className="w-full h-11 bg-primary text-primary-foreground font-semibold flex items-center justify-center gap-2 shadow-md hover:bg-primary/90 transition-all cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Spinner />
                  <span>Minting DSW Plan...</span>
                </>
              ) : (
                <>
                  <Rocket className="w-4 h-4" />
                  <span>Generate maDMP in DS-Wizard</span>
                </>
              )}
            </Button>

            <div className="flex justify-between items-center pt-1">
              <button
                onClick={clearCart}
                disabled={isSubmitting}
                className="text-xs text-muted-foreground hover:text-red-500 transition-colors cursor-pointer"
              >
                Clear cart
              </button>
              <span className="text-[11px] text-muted-foreground font-mono">
                Bridge: :5005
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}