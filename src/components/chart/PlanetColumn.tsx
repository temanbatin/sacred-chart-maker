import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { planetSymbols, planetDescriptions, formatPlanetName } from "@/lib/chartConstants";

export interface PlanetData {
    Planet: string;
    Gate: number;
    Line: number;
    Lon: number;
    Ch_Gate?: number;
}

interface PlanetColumnProps {
    planets: PlanetData[];
    title: string;
    side: "left" | "right";
    hideHeader?: boolean;
}

export const PlanetColumn = ({ planets, title, side, hideHeader = false }: PlanetColumnProps) => {
    const isDesign = side === "left";

    return (
        <div className={`flex flex-col ${isDesign ? "items-end" : "items-start"}`}>
            {/* Header with arrow - Conditionally Rendered */}
            {!hideHeader && (
                <div className={`flex items-center gap-1 mb-2 pb-1 border-b border-muted w-full ${isDesign ? "justify-end" : "justify-start"}`}>
                    {isDesign && <span className="text-primary text-xs">←</span>}
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${isDesign ? "text-primary" : "text-muted-foreground"}`}>
                        {title}
                    </span>
                    {!isDesign && <span className="text-muted-foreground text-xs">→</span>}
                </div>
            )}
            {/* Planet rows - aligned */}
            {planets.map((planet, index) => (
                <Popover key={index}>
                    <PopoverTrigger asChild>
                        <div
                            className={`flex items-center gap-1.5 py-0.5 cursor-pointer hover:bg-muted/30 rounded px-1 transition-colors ${isDesign ? "flex-row-reverse" : "flex-row"}`}
                        >
                            {/* Gate.Line */}
                            <span className="text-xs font-medium text-foreground">
                                {planet.Gate}.{planet.Line}
                            </span>
                            {/* Planet symbol */}
                            <span className={`text-xs ${isDesign ? "text-primary" : "text-muted-foreground"}`}>
                                {planetSymbols[planet.Planet] || planet.Planet[0]}
                            </span>
                        </div>
                    </PopoverTrigger>
                    <PopoverContent side={isDesign ? "left" : "right"} className="max-w-xs p-3">
                        <p className="font-semibold text-sm">
                            {planetDescriptions[planet.Planet]?.title || formatPlanetName(planet.Planet)}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                            {planetDescriptions[planet.Planet]?.description || `Gate ${planet.Gate}, Line ${planet.Line}`}
                        </p>
                    </PopoverContent>
                </Popover>
            ))}
        </div>
    );
};
