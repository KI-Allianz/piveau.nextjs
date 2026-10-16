"use client";

import React from "react";
import { ShoppingCart, Check } from "lucide-react";
import { Dataset } from "@/lib/utils";
import { useCart } from "@/hooks/useCart";
import { Button } from "@/components/ui/button";

interface Props {
  dataset?: Dataset;
  variant?: "default" | "secondary" | "outline";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  showText?: boolean;
}

export default function DatasetCartButton({
  dataset,
  variant = "secondary",
  size = "default",
  className = "",
  showText = true,
}: Props) {
  const { isInCart, toggleCart, setIsDrawerOpen } = useCart();

  if (!dataset) return null;

  const inCart = isInCart(dataset.id);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleCart(dataset);
  };

  return (
    <Button
      variant={inCart ? "default" : variant}
      size={size}
      onClick={handleClick}
      title={inCart ? "In DMP Cart (Click to remove)" : "Add to DMP Cart"}
      className={`relative z-10 transition-all duration-200 cursor-pointer ${
        inCart ? "bg-emerald-600 hover:bg-emerald-700 text-white" : ""
      } ${className}`}
    >
      {inCart ? <Check className="w-4 h-4 text-white" /> : <ShoppingCart className="w-4 h-4" />}
      {showText && (
        <span className="ml-1.5 text-xs font-semibold">
          {inCart ? "In DMP Cart" : "Add to DMP"}
        </span>
      )}
    </Button>
  );
}