import Image from "next/image";

export default function PlatformPage() {
  return (
    <main className="dark animate-in fade-in flex min-h-dvh w-full items-center justify-center bg-background px-6 text-foreground duration-500 motion-reduce:animate-none">
      <div className="flex animate-in fade-in slide-in-from-bottom-2 items-center gap-4 duration-700 motion-reduce:animate-none sm:gap-7">
        <Image
          src="/metaweb-icon.svg"
          alt=""
          width={144}
          height={144}
          preload
          unoptimized
          className="size-[clamp(3.5rem,12vw,9rem)] shrink-0 brightness-0 invert"
        />
        <h1 className="flex flex-col text-[clamp(1.875rem,6.5vw,5rem)] leading-[0.9] font-medium tracking-[-0.07em]">
          <span>MetaWeb</span>
          <span>Dev Solutions</span>
        </h1>
      </div>
    </main>
  );
}
