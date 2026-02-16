interface LogoProps {
    className?: string;
    variant?: "full" | "compact";
}

const Logo = ({ className = "", variant = "full" }: LogoProps) => {
    return (
        <div className={`flex items-center gap-2 ${className}`}>
            {/* Icon part - geometric truck shape */}
            <div className="relative flex-shrink-0">
                <svg
                    width={variant === "full" ? "48" : "36"}
                    height={variant === "full" ? "48" : "36"}
                    viewBox="0 0 48 48"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    {/* Truck body - bold geometric shape */}
                    <rect x="4" y="16" width="24" height="16" fill="currentColor" className="text-sidebar-foreground" />
                    <rect x="28" y="20" width="12" height="12" fill="currentColor" className="text-primary" />

                    {/* Wheels */}
                    <circle cx="14" cy="34" r="4" fill="currentColor" className="text-primary" />
                    <circle cx="34" cy="34" r="4" fill="currentColor" className="text-primary" />

                    {/* Checkered pattern accent */}
                    <rect x="8" y="12" width="3" height="3" fill="currentColor" className="text-primary" />
                    <rect x="14" y="12" width="3" height="3" fill="currentColor" className="text-primary" />
                    <rect x="11" y="9" width="3" height="3" fill="currentColor" className="text-primary" />
                </svg>
            </div>

            {/* Text part */}
            {variant === "full" && (
                <div className="flex flex-col leading-none">
                    <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-heading font-black uppercase tracking-tighter text-sidebar-foreground">
                            TAXI
                        </span>
                        <span className="text-2xl font-heading font-black uppercase tracking-tighter text-primary">
                            TRUCK
                        </span>
                    </div>
                    <span className="text-[9px] font-heading font-bold uppercase tracking-widest text-sidebar-foreground/60 mt-0.5">
                        Transporte de Mercancías
                    </span>
                </div>
            )}
        </div>
    );
};

export default Logo;
