import { cn } from "@/lib/utils";

function Logo({ isMobile = false }) {
    return (
      <div className={cn("flex items-center gap-2 w-[5.5rem]", isMobile ? "px-2" : "")}>
      <img src="./image/logo.png" alt="" className="h-12 " />
    </div>
    );
  }

  export default Logo