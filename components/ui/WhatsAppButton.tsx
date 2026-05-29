import WhatsAppIcon from "@/components/ui/WhatsAppIcon";
import { cn } from "@/lib/utils";

interface WhatsAppButtonProps {
  href: string;
  label?: string;
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  className?: string;
}

export default function WhatsAppButton({
  href,
  label = "Commander",
  size = "md",
  fullWidth = false,
  className,
}: WhatsAppButtonProps) {
  const sizes = {
    sm: "h-8 px-3 text-xs gap-1.5",
    md: "h-10 px-4 text-sm gap-2",
    lg: "h-12 px-6 text-base gap-2.5",
  };

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex items-center justify-center font-semibold rounded-brand-sm",
        "bg-whatsapp text-white transition-opacity hover:opacity-85 active:opacity-75",
        sizes[size],
        fullWidth && "w-full",
        className
      )}
    >
      <WhatsAppIcon className="shrink-0" style={{ width: size === "sm" ? 14 : size === "lg" ? 20 : 16, height: size === "sm" ? 14 : size === "lg" ? 20 : 16 }} />
      {label}
    </a>
  );
}
