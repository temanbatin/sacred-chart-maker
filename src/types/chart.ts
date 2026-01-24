export interface ChartData {
    planets: Record<string, unknown>;
    lines: Record<string, unknown>;
    variables: Record<string, unknown>;
    centers: Record<string, unknown>;
    channels: Record<string, unknown>;
    gates: Record<string, unknown>;
    profiles: string;
    type: string;
    authority: string;
    definition: string;
    incarnation_cross: string;
    strategy: string;
    theme: string;
    signature: string;
    not_self_theme: string;
}
