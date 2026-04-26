"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div
      className="fixed inset-0 z-50 flex cursor-pointer items-center justify-center bg-[var(--color-bg)]"
      onClick={() => router.push("/ritual")}
    >
      <span className="font-[family-name:var(--font-libre-caslon-text)] text-[64px] font-normal text-[var(--color-text-primary)] select-none">
        Sophie
      </span>
    </div>
  );
}
