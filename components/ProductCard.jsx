"use client";

import { useState } from "react";
import { deleteProduct } from "@/app/action";
import PriceChart from "./PriceChart";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ExternalLink,
  Trash2,
  TrendingDown,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import Link from "next/link";

export default function ProductCard({ product }) {
  const [showChart, setShowChart] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Remove this product from tracking?")) return;

    setDeleting(true);
    await deleteProduct(product.id);
  };

  return (
    <Card className="hover:shadow-lg transition-shadow overflow-hidden bg-white">
      {/* Container that splits Image vs Content side-by-side */}
      <div className="flex flex-col sm:flex-row items-start gap-4 p-5">
        
        {/* Left Side: Product Image */}
        {product.image_url && (
          <div className="w-full sm:w-40 h-40 flex-shrink-0  flex items-center justify-center p-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={product.image_url}
              alt={product.name}
              className="max-w-full max-h-full object-contain mix-blend-multiply"
            />
          </div>
        )}

        {/* Right Side: Details & Actions packed together */}
        <div className="flex-1 min-w-0 w-full flex flex-col justify-between h-40">
          
          {/* Text and Pricing details info group */}
          <div>
            <h3 className="font-semibold text-gray-900 text-base line-clamp-2 mb-1.5 leading-snug text-start">
              {product.name}
            </h3>

            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl font-bold text-orange-500 tracking-tight">
                {product.currency} {product.current_price}
              </span>
              <Badge variant="secondary" className="gap-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-50 border-none font-medium text-xs py-0.5">
                <TrendingDown className="w-3 h-3 text-emerald-600" />
                Tracking
              </Badge>
            </div>
          </div>

          {/* Action Button Row */}
          <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-50">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowChart(!showChart)}
              className={`gap-1 h-8 text-xs font-medium ${showChart ? 'bg-slate-100 text-slate-900' : 'text-slate-600'}`}
            >
              {showChart ? (
                <>
                  <ChevronUp className="w-3.5 h-3.5" />
                  Hide Chart
                </>
              ) : (
                <>
                  <ChevronDown className="w-3.5 h-3.5" />
                  Show Chart
                </>
              )}
            </Button>

            <Button variant="outline" size="sm" asChild className="gap-1 h-8 text-xs font-medium text-slate-700">
              <Link href={product.url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-3.5 h-3.5" />
                View
              </Link>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              disabled={deleting}
              className="text-red-600 hover:text-red-700 hover:bg-red-50 gap-1 h-8 text-xs font-medium ml-auto"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Remove
            </Button>
          </div>

        </div>
      </div>

      {/* Full width collapsible chart footer */}
      {showChart && (
        <CardFooter className="px-5 pb-5 pt-0 border-t border-slate-100 bg-slate-50/50">
          <div className="w-full pt-4">
            <PriceChart productId={product.id} />
          </div>
        </CardFooter>
      )}
    </Card>
  );
}