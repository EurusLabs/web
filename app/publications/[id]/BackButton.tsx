"use client";
import { useRouter } from "next/navigation";

export default function BackButton() {
  const router = useRouter();
  return (
    <button
      onClick={() => router.push('/publications')}
      className="mb-8 text-base font-medium text-foreground hover:underline bg-transparent border-none outline-none focus:outline-none"
      style={{ fontFamily: 'var(--font-sf-pro)' }}
    >
      ← Back to Publications
    </button>
  );
} 