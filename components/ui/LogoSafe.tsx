"use client";
import { useState } from "react";
import Image from "next/image";

interface LogoSafeProps {
  logoPath: string;
  className?: string;
  textClass?: string;
}

export default function LogoSafe({ logoPath, className = "", textClass = "" }: LogoSafeProps) {
  const [imgError, setImgError] = useState(false);

  if (imgError || !logoPath) {
    return <FallbackLogo className={textClass} />;
  }

  return (
    <div className={`relative ${className}`}>
      <Image
        src={logoPath}
        alt="MICROLOGIS Logo"
        fill
        className="object-contain"
        onError={() => setImgError(true)}
        priority
      />
    </div>
  );
}

function FallbackLogo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-col leading-none ${className}`}>
      <span className="font-head text-xl font-black tracking-tight">
        <span className="text-brand-blue">MICRO</span>
        <span className="text-brand-dark">LOGIS</span>
      </span>
      <span className="text-[9px] font-semibold tracking-[2px] text-gray-400 uppercase mt-0.5">
        Informatique &amp; GSM
      </span>
    </div>
  );
}
