import { cn } from "@/lib/utils";

interface BadgeProps {
  variant: "new" | "occasion" | "reconditioned" | "promo" | "stock";
  className?: string;
}

export default function Badge({ variant, className }: BadgeProps) {
  const styles: Record<string, string> = {
    new: "bg-brand-blue text-white",
    occasion: "bg-brand-orange text-white",
    reconditioned: "bg-emerald-600 text-white",
    promo: "bg-green-600 text-white",
    stock: "bg-red-500 text-white",
  };

  const labels: Record<string, string> = {
    new: "Neuf",
    occasion: "Occasion",
    reconditioned: "Reconditionné",
    promo: "Promo",
    stock: "Rupture",
  };

  return (
    <span
      className={cn(
        "inline-block text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide",
        styles[variant],
        className
      )}
    >
      {labels[variant]}
    </span>
  );
}
