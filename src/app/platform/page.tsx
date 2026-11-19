import Image from "next/image";

export default function PlatformPage() {
  return (
    <div className="flex flex-1 items-center justify-center px-6 pb-14">
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
    </div>
  );
}
