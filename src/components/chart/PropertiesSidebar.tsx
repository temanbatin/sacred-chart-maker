import React from "react";
import type { BirthData } from "@/components/MultiStepForm";

export interface PropertiesSidebarProps {
    userName: string;
    birthData: BirthData | null;
    chartType: string;
    strategy: string;
    authority: string;
    profile: string;
    definition: string;
    incarnationCross: string;
    signature: string;
    notSelf: string;
    variables?: {
        top_left?: { value: string };
        bottom_left?: { value: string };
        top_right?: { value: string };
        bottom_right?: { value: string };
    };
    utcDateTime?: string;
}

const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

export const PropertiesSidebar = ({
    userName,
    birthData,
    chartType,
    strategy,
    authority,
    profile,
    definition,
    incarnationCross,
    signature,
    notSelf,
    variables,
    utcDateTime,
}: PropertiesSidebarProps) => {
    const formatDateTimeLocal = () => {
        if (!birthData) return "—";
        return `${birthData.day} ${monthNames[birthData.month - 1]} ${birthData.year}, ${String(birthData.hour).padStart(2, '0')}:${String(birthData.minute).padStart(2, '0')}`;
    };

    const formatDateTimeUTC = () => {
        if (utcDateTime) return utcDateTime;
        return "—";
    };

    const getVariableString = () => {
        if (!variables) return "—";
        const tl = variables.top_left?.value === "left" ? "P" : "P";
        const bl = variables.bottom_left?.value === "left" ? "R" : "L";
        const tr = variables.top_right?.value === "left" ? "L" : "R";
        const br = variables.bottom_right?.value === "left" ? "L" : "L";
        return `${tl}${bl}${tr} ${br}LL`;
    };

    const Item = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
        <div className="flex items-start gap-2 py-1.5">
            <span className="text-muted-foreground mt-0.5 w-4 h-4 flex items-center justify-center">{icon}</span>
            <div className="flex-1 min-w-0">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide leading-tight">{label}</p>
                <p className="text-xs font-semibold text-foreground leading-tight">{value}</p>
            </div>
        </div>
    );

    return (
        <div className="w-full">
            {/* Header */}
            <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-primary font-bold text-sm">{userName.charAt(0).toUpperCase()}</span>
                </div>
                <h2 className="text-base font-bold text-foreground uppercase tracking-wide">Properties</h2>
            </div>

            {/* Birth Data - 2 columns */}
            <div className="mb-4">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-2">Birth Data</p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-0">
                    <Item icon={<span className="text-xs">○</span>} label="Name" value={userName} />
                    <Item icon={<span className="text-xs">◎</span>} label="Date and Time (Local)" value={formatDateTimeLocal()} />
                    <Item icon={<span className="text-xs">◎</span>} label="Date and Time (UTC)" value={formatDateTimeUTC()} />
                    <Item icon={<span className="text-xs">◉</span>} label="Location" value={birthData?.place || "—"} />
                </div>
            </div>

            {/* Properties - 2 columns */}
            <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-2">Properties</p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-0">
                    <Item icon={<span className="text-xs">◈</span>} label="Type" value={chartType} />
                    <Item icon={<span className="text-xs">⟡</span>} label="Strategy" value={strategy} />
                    <Item icon={<span className="text-xs">✧</span>} label="Signature" value={signature || "—"} />
                    <Item icon={<span className="text-xs">◆</span>} label="Not-Self Theme" value={notSelf || "—"} />
                    <Item icon={<span className="text-xs">△</span>} label="Authority" value={authority} />
                    <Item icon={<span className="text-xs">⊞</span>} label="Definition" value={definition} />
                    <Item icon={<span className="text-xs">✚</span>} label="Incarnation Cross" value={incarnationCross || "—"} />
                    <Item icon={<span className="text-xs">◯</span>} label="Profile" value={profile} />
                </div>
                <div className="mt-1">
                    <Item icon={<span className="text-xs">⇌</span>} label="Variable" value={getVariableString()} />
                </div>
            </div>
        </div>
    );
};
