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

        // Calculate UTC from local time if not provided (assuming WIB = UTC+7)
        if (birthData) {
            const localDate = new Date(
                birthData.year,
                birthData.month - 1,
                birthData.day,
                birthData.hour,
                birthData.minute
            );
            // Subtract 7 hours for WIB -> UTC
            const utcDate = new Date(localDate.getTime() - (7 * 60 * 60 * 1000));

            const utcDay = utcDate.getUTCDate();
            const utcMonth = monthNames[utcDate.getUTCMonth()];
            const utcYear = utcDate.getUTCFullYear();
            const utcHour = String(utcDate.getUTCHours()).padStart(2, '0');
            const utcMinute = String(utcDate.getUTCMinutes()).padStart(2, '0');

            return `${utcDay} ${utcMonth} ${utcYear}, ${utcHour}:${utcMinute} UTC`;
        }

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

    const Item = ({ label, value }: { label: string; value: string }) => (
        <div className="py-1.5">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide leading-tight">{label}</p>
            <p className="text-xs font-semibold text-foreground leading-tight">{value}</p>
        </div>
    );

    return (
        <div className="w-full">
            {/* Birth Data - 2 columns */}
            <div className="mb-4">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-2">Birth Data</p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-0">
                    <Item label="Date and Time (Local)" value={formatDateTimeLocal()} />
                    <Item label="Date and Time (UTC)" value={formatDateTimeUTC()} />
                    <Item label="Location" value={birthData?.place || "—"} />
                </div>
            </div>

            {/* Properties - 2 columns */}
            <div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-0">
                    <Item label="Type" value={chartType} />
                    <Item label="Strategy" value={strategy} />
                    <Item label="Signature" value={signature || "—"} />
                    <Item label="Not-Self Theme" value={notSelf || "—"} />
                    <Item label="Authority" value={authority} />
                    <Item label="Definition" value={definition} />
                    <Item label="Incarnation Cross" value={incarnationCross || "—"} />
                    <Item label="Profile" value={profile} />
                </div>
                <div className="mt-1">
                    <Item label="Variable" value={getVariableString()} />
                </div>
            </div>
        </div>
    );
};
