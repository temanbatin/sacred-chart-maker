// Types for Bodygraph SVG rendering

export type ActivationType = 'personality' | 'design' | 'both';

export interface BodygraphData {
    gateActivations: Record<number, ActivationType>;
    activeChannels: { gate1: number; gate2: number }[];
    definedCenters: string[];
}

// Layout.json types
export interface CenterData {
    type: 'path' | 'rect';
    path?: string;
    x?: number;
    y?: number;
    w?: number;
    h?: number;
    transform?: string | null;
}

export interface GateCoord {
    x: number;
    y: number;
}

export interface ChannelData {
    channel_path: string;
    split_path?: string;
}

export interface LayoutData {
    body_outline: string;
    centers: Record<string, CenterData>;
    gates_coords: Record<string, GateCoord>;
    channels: Record<string, ChannelData>;
}

// Center code to name mapping
export const CENTER_NAMES: Record<string, string> = {
    HD: 'Head',
    AA: 'Ajna',
    TT: 'Throat',
    GC: 'G',
    HT: 'Heart',
    SN: 'Spleen',
    SL: 'Sacral',
    SP: 'SolarPlexus',
    RT: 'Root',
};

// Channel pairs - maps gate number to its complementary gate
export const CHANNEL_PAIRS: Record<number, number> = {
    64: 47, 47: 64,  // Head-Ajna
    61: 24, 24: 61,  // Head-Ajna
    63: 4, 4: 63,    // Head-Ajna
    17: 62, 62: 17,  // Ajna-Throat
    43: 23, 23: 43,  // Ajna-Throat
    11: 56, 56: 11,  // Ajna-Throat
    16: 48, 48: 16,  // Throat-Spleen
    20: 10, 10: 20,  // Throat-Self (20-34 also)
    20: 57, 57: 20,  // Spleen-Throat
    20: 34, 34: 20,  // Sacral-Throat
    31: 7, 7: 31,    // Throat-G
    8: 1, 1: 8,      // Throat-G
    33: 13, 13: 33,  // Throat-G
    12: 22, 22: 12,  // Throat-Solar Plexus
    45: 21, 21: 45,  // Throat-Heart
    35: 36, 36: 35,  // Throat-Solar Plexus
    25: 51, 51: 25,  // G-Heart
    10: 34, 34: 10,  // G-Sacral (via 20)
    10: 57, 57: 10,  // G-Spleen (via 20)
    15: 5, 5: 15,    // G-Sacral
    46: 29, 29: 46,  // G-Sacral
    2: 14, 14: 2,    // G-Sacral
    26: 44, 44: 26,  // Heart-Spleen
    40: 37, 37: 40,  // Heart-Solar Plexus
    50: 27, 27: 50,  // Spleen-Sacral
    32: 54, 54: 32,  // Spleen-Root
    28: 38, 38: 28,  // Spleen-Root
    18: 58, 58: 18,  // Spleen-Root
    44: 26, 26: 44,  // Spleen-Heart (duplicate)
    48: 16, 16: 48,  // Spleen-Throat (duplicate)
    57: 34, 34: 57,  // Spleen-Sacral
    57: 10, 10: 57,  // Spleen-Self
    3: 60, 60: 3,    // Sacral-Root
    9: 52, 52: 9,    // Sacral-Root
    42: 53, 53: 42,  // Sacral-Root
    59: 6, 6: 59,    // Sacral-Solar Plexus
    27: 50, 50: 27,  // Sacral-Spleen (duplicate)
    34: 10, 10: 34,  // Sacral-Self
    34: 20, 20: 34,  // Sacral-Throat
    34: 57, 57: 34,  // Sacral-Spleen (duplicate)
    5: 15, 15: 5,    // Sacral-G (duplicate)
    14: 2, 2: 14,    // Sacral-G (duplicate)
    29: 46, 46: 29,  // Sacral-G (duplicate)
    49: 19, 19: 49,  // Solar Plexus-Root
    55: 39, 39: 55,  // Solar Plexus-Root
    30: 41, 41: 30,  // Solar Plexus-Root
    6: 59, 59: 6,    // Solar Plexus-Sacral (duplicate)
    37: 40, 40: 37,  // Solar Plexus-Heart (duplicate)
    22: 12, 12: 22,  // Solar Plexus-Throat (duplicate)
    36: 35, 35: 36,  // Solar Plexus-Throat (duplicate)
    19: 49, 49: 19,  // Root-Solar Plexus (duplicate)
    39: 55, 55: 39,  // Root-Solar Plexus (duplicate)
    41: 30, 30: 41,  // Root-Solar Plexus (duplicate)
    54: 32, 32: 54,  // Root-Spleen (duplicate)
    38: 28, 28: 38,  // Root-Spleen (duplicate)
    58: 18, 18: 58,  // Root-Spleen (duplicate)
    60: 3, 3: 60,    // Root-Sacral (duplicate)
    52: 9, 9: 52,    // Root-Sacral (duplicate)
    53: 42, 42: 53,  // Root-Sacral (duplicate)
};
