import React, { useMemo } from 'react';
import { GATE_TO_SPLIT_PATH } from './channelSplitPaths';

// Types for bodygraph data
export type ActivationType = 'personality' | 'design' | 'both';

export interface BodygraphData {
    gateActivations: Record<number, ActivationType>;
    activeChannels: { gate1: number; gate2: number }[];
    definedCenters: string[];
}

// Gate pair connections - maps gate to its paired gate in a channel
const GATE_PAIRS: Record<number, number> = {
    // Head - Ajna connections
    64: 47, 47: 64,
    61: 24, 24: 61,
    63: 4, 4: 63,
    // Ajna - Throat connections
    17: 62, 62: 17,
    43: 23, 23: 43,
    11: 56, 56: 11,
    // Throat connections
    16: 48, 48: 16,
    20: 10, 10: 20,
    35: 36, 36: 35,
    12: 22, 22: 12,
    45: 21, 21: 45,
    31: 7, 7: 31,
    8: 1, 1: 8,
    33: 13, 13: 33,
    // G Center connections
    25: 51, 51: 25,
    15: 5, 5: 15,
    46: 29, 29: 46,
    2: 14, 14: 2,
    // Heart/Will connections
    26: 44, 44: 26,
    40: 37, 37: 40,
    // Spleen connections
    50: 27, 27: 50,
    32: 54, 54: 32,
    28: 38, 38: 28,
    18: 58, 58: 18,
    57: 34, 34: 57,
    // Sacral connections
    3: 60, 60: 3,
    9: 52, 52: 9,
    42: 53, 53: 42,
    59: 6, 6: 59,
    // Solar Plexus connections
    49: 19, 19: 49,
    55: 39, 39: 55,
    30: 41, 41: 30,
};

// Channel paths indexed by gate ID (from layout.json)
// Each gate has its associated channel path
const GATE_TO_CHANNEL_PATH: Record<number, string> = {
    // Throat-G (Channel 1: 1-8)
    1: 'm 117.24563 141.55202 v 29.3688',
    8: 'm 117.24563 117.3514 10e-6 24.20063',
    // G-Sacral (Channel 2: 2-14)
    2: 'm 117.24563 170.92082 v 35.19014',
    14: 'm 117.24563 206.11096 v 31.45188',
    // Sacral-Root (Channel 3: 3-60)
    3: 'm 117.24563 237.56284 v 28.34404',
    60: 'm 117.24563 265.90688 v 11.22725',
    // Head-Ajna (Channel 4: 4-63)
    4: 'm 126.36609 45.984083 0 19.122374',
    63: 'm 126.3661 36.550536 v 9.433547',
    // G-Sacral (Channel 5: 5-15)
    5: 'm 108.46022 206.11096 v 31.45188',
    15: 'm 108.46022 170.92082 v 35.19014',
    // Sacral-SolarPlexus (Channel 6: 6-59)
    6: 'm 154.37388 245.08356 c 6.60737 -1.73579 13.05207 -4.19792 18.71717 -7.05115 3.94215 -1.98546 7.26529 -4.38205 9.37103 -6.77623',
    59: 'm 117.24561 247.54794 h 17.16942 c 7.13346 -0.37373 12.71793 -0.81112 15.95576 -1.50756 1.3376 -0.28772 2.67364 -0.60756 4.00309 -0.95682',
    // Throat-G (Channel 7: 7-31)
    7: 'm 108.46022 141.55202 v 29.3688',
    31: 'm 108.46022 117.3514 0 24.20063',
    // Sacral-Root (Channel 9: 9-52)
    9: 'm 126.36609 237.56284 v 28.34404',
    52: 'm 126.36609 265.90688 v 11.22725',
    // G-Spleen (Channel 10: 10-20)
    10: 'm 97.191315 170.53424 c -29.32718 0.66377 -46.919646 7.89405 -51.634791 25.13449',
    20: 'm 117.24261 114.14258 c -0.0257 -1.6e-4 -0.0513 -2.4e-4 -0.0768 -2.4e-4 -4.75694 0 -10.96672 2.66915 -17.05778 6.40632 -12.704244 7.79469 -23.922164 19.12047 -33.201112 31.63711 -9.306877 12.55429 -16.586763 27.00117 -21.035968 41.93801 -0.139419 0.46805 -0.275653 0.93757 -0.408752 1.40851',
    // Ajna-Throat (Channel 11: 11-56)
    11: 'm 126.3661 65.106457 0 27.761649',
    56: 'M 126.36609 92.868103 V 117.3514',
    // Throat-SolarPlexus (Channel 12: 12-22)
    12: 'm 189.14616 195.06617 c -4.72742 -15.57753 -11.76475 -30.64958 -21.21739 -43.38041 -9.1646 -12.34287 -20.7341 -23.30633 -33.64662 -31.10194 -6.16479 -3.72185 -12.33091 -6.41219 -17.03954 -6.44124',
    22: 'm 195.00208 237.56739 c 0.44138 -13.82808 -1.56568 -28.0396 -5.54103 -41.4514 -0.1038 -0.35018 -0.20876 -0.70013 -0.31489 -1.04982',
    // Throat-G (Channel 13: 13-33)
    13: 'm 126.36609 141.55202 v 29.3688',
    33: 'm 126.36609 117.3514 0 24.20063',
    // Throat-Spleen (Channel 16: 16-48)
    16: 'm 117.24568 104.68142 c -0.0266 -9e-5 -0.0533 -1.4e-4 -0.0799 -1.4e-4 v 0 c -7.78452 0 -15.37459 3.73421 -22.009026 7.80478 -14.052457 8.6219 -26.037664 20.82457 -35.854547 34.06684 -9.965385 13.44256 -17.724963 28.83617 -22.501412 44.87163 -0.155528 0.52213 -0.307314 1.04542 -0.45542 1.56982',
    48: 'm 36.345375 192.99435 c -4.062629 14.38432 -5.357651 29.60047 -5.174577 44.57161',
    // Ajna-Throat (Channel 17: 17-62)
    17: 'm 108.46023 65.106457 0 27.761649',
    62: 'M 108.46022 92.868103 V 117.3514',
    // Root-Spleen (Channel 18: 18-58)
    18: 'm 31.642579,245.00413 v 7.22438 c -1.48e-4,1.43214 0.327908,2.84526 0.958985,4.13086 6.180576,12.58257 14.941309,23.56379 25.754186,31.76624',
    58: 'm 58.35575,288.12561 c 12.663782,9.60649 28.142391,15.40148 45.5876,15.49352 0.0163,6e-5 0.0325,6e-5 0.0488,0 h 15.42187',
    // Root-SolarPlexus (Channel 19: 19-49)
    19: 'm 163.99028,273.14702 c -9.62083,7.28221 -21.13932,11.65791 -34.04781,11.72601 h -5.11329',
    49: 'm 184.52562,245.00421 0.12753,3.08458 c -5.18312,9.97013 -12.18647,18.64227 -20.66287,25.05823',
    // Throat-Heart (Channel 21: 21-45)
    21: 'm 165.27617 203.00258 c 0.34616 -14.37637 -3.25951 -30.63551 -9.93079 -44.27312 -0.34494 -0.70513 -0.6999 -1.40844 -1.06481 -2.10921',
    45: 'm 154.28057 156.62025 c -5.58152 -10.71872 -13.48909 -20.8406 -23.40957 -27.72382 -1.93235 -1.34074 -6.67689 -2.28299 -6.67689 -2.28299',
    // Ajna-Throat (Channel 23: 23-43)
    23: 'M 117.24563 92.868103 V 117.3514',
    43: 'm 117.24564 65.106457 0 27.761649',
    // Head-Ajna (Channel 24: 24-61)
    24: 'm 117.24563 45.984083 0 19.122374',
    61: 'm 117.24564 36.550536 v 9.433547',
    // G-Heart (Channel 25: 25-51)
    25: 'm 137.18645 171.18542 c 5.69505 1.22618 10.25227 3.39083 13.32279 7.54054',
    51: 'm 150.50924 178.72596 c 2.65274 3.5851 4.19582 8.65184 4.40429 15.87508',
    // Heart-Spleen (Channel 26: 26-44)
    26: 'm 144.88691 202.15286 c -2.39931 0 -25.95241 -1.03188 -38.76519 0.58521 -4.88209 0.61616 -9.947698 1.35549 -14.99271 2.3157',
    44: 'm 91.12901 205.05377 c -13.753322 2.61764 -27.353601 6.8768 -36.665643 14.7572 -3.174063 2.68609 -6.966865 6.70315 -7.443433 11.05225',
    // Sacral-Spleen (Channel 27: 27-50)
    27: 'm 78.677682 244.73769 c 1.750565 0.48615 3.515455 0.92248 5.283067 1.30269 3.237881 0.69646 8.822291 1.13383 15.955756 1.50756 h 17.329105',
    50: 'm 52.103945 231.53593 c 1.648299 2.04916 4.929609 4.37768 9.136558 6.49649 5.298659 2.66866 11.279311 4.99519 17.437179 6.70528',
    // Root-Spleen (Channel 28: 28-38)
    28: 'm 41.013671,237.86037 v 14.36814 c 5.648944,11.50026 13.436573,21.3342 23.019093,28.59103',
    38: 'm 64.032764,280.81954 c 11.092461,8.40033 24.590026,13.34741 39.959426,13.4285 h 15.42187',
    // G-Sacral (Channel 29: 29-46)
    29: 'm 126.36609 206.11096 v 31.45188',
    46: 'm 126.36609 170.92082 v 35.19014',
    // Root-SolarPlexus (Channel 30: 30-41)
    30: 'm 202.3409,245.00413 v 7.22438 c 1.5e-4,1.43214 -0.32791,2.84526 -0.95899,4.13086 -6.18061,12.58265 -14.94142,23.56392 -25.75439,31.7664',
    41: 'm 175.62752,288.12577 c -12.66375,9.60639 -28.14228,15.40132 -45.5874,15.49336 -0.0163,3e-5 -0.0325,3e-5 -0.0488,0 h -15.42186',
    // Root-Spleen (Channel 32: 32-54)
    32: 'm 49.753215,237.86043 -0.422875,10.22836 c 5.183105,9.97013 12.186459,18.64227 20.66286,25.05823',
    54: 'm 69.9932,273.14702 c 9.620832,7.28221 21.139324,11.65791 34.04782,11.72601 h 5.11327',
    // Sacral-Spleen (Channel 34: 34-57)
    34: 'm 45.556524 195.66873 c -0.133974 0.48987 -0.257556 0.98783 -0.37071 1.49394 -1.747565 7.81628 4.942477 15.91242 10.664737 21.57843 7.326506 7.25446 17.992034 10.66985 27.931467 13.54924 7.363285 2.1331 22.853242 2.57733 22.853242 2.57733',
    57: 'm 45.462168 195.53229 c -3.746653 13.25656 -5.008231 27.63556 -4.827039 42.0301',
    // Throat-SolarPlexus (Channel 35: 35-36)
    35: 'm 198.26489 192.52559 c -4.98998 -16.5169 -12.4557 -32.63199 -22.73534 -46.47662 -9.83148 -13.24102 -22.23422 -25.03799 -36.35475 -33.56291 -6.64069 -4.00914 -14.17278 -7.77889 -21.92912 -7.80464',
    36: 'm 204.47163 237.56565 c 0.43956 -14.84424 -1.72108 -29.91529 -5.93655 -44.13718 -0.0892 -0.30108 -0.1793 -0.60205 -0.27019 -0.90288',
    // Heart-SolarPlexus (Channel 37: 37-40)
    37: 'm 184.34737 232.35997 c 0.68901 -7.77332 0.0485 -12.89658 -1.88478 -16.6499',
    40: 'm 182.46259 215.71007 c -2.0603 -3.99992 -5.58883 -6.44399 -10.5411 -8.88155',
    // Root-SolarPlexus (Channel 39: 39-55)
    39: 'm 169.95085,280.81946 c -11.09249,8.40036 -24.5901,13.34749 -39.95957,13.42858 h -15.42185',
    55: 'm 192.96981,245.00413 v 7.22438 c -5.64892,11.50021 -13.4365,21.33412 -23.01896,28.59095',
    // Sacral-Root (Channel 42: 42-53)
    42: 'm 108.46022 237.56284 v 28.34404',
    53: 'm 108.46022 265.90688 v 11.22725',
    // Head-Ajna (Channel 47: 47-64)
    47: 'm 108.46022 45.984083 0 19.122374',
    64: 'm 108.46023 36.550536 v 9.433547',
};

// Center shapes and paths
const CENTER_PATHS: Record<string, { type: 'path' | 'rect'; path?: string; x?: number; y?: number; w?: number; h?: number; rx?: number; transform?: string }> = {
    Head: { type: 'path', path: 'm 139.69674 35.940087 c 0 2.630292 -2.13311 4.762558 -4.76445 4.762558 H 99.800645 c -2.631339 0 -4.764454 -2.132266 -4.764454 -4.762558 0 -0.937592 0.275373 -1.808583 0.743405 -2.545612 l -0.004 -0.006 17.319744 -26.7222081 c 0.77715 -1.5751033 2.39546 -2.6613707 4.27125 -2.6613707 1.92439 0 3.57824 1.1427021 4.33019 2.7843523 L 138.7508 33.101152 c 0.5914 0.79343 0.94606 1.773622 0.94606 2.839135 z' },
    Ajna: { type: 'path', path: 'm 139.69674 55.949193 c 0 -2.630293 -2.13311 -4.762559 -4.76445 -4.762559 H 99.800645 c -2.631339 0 -4.764454 2.132266 -4.764454 4.762559 0 0.937591 0.275373 1.808582 0.743405 2.545611 l -0.004 0.006 17.319744 26.722211 c 0.77715 1.575099 2.39546 2.661373 4.27125 2.661373 1.92439 0 3.57824 -1.142714 4.33019 -2.784355 L 138.7508 58.788128 c 0.5914 -0.79343 0.94606 -1.773622 0.94606 -2.839135 z' },
    G: { type: 'path', path: 'm 188.12859 19.180246 h 31.62084 c 1.662 0 3.00001 1.338002 3.00001 3.000005 v 31.62084 c 0 1.662003 -1.33801 3.000005 -3.00001 3.000005 h -31.62084 c -1.662 0 -3 -1.338002 -3 -3.000005 v -31.62084 c 0 -1.662003 1.338 -3.000005 3 -3.000005 z', transform: '0.70724741 0.70696612 -0.70724741 0.70696612 0 0' },
    Heart: { type: 'path', path: 'm 142.12802 202.21659 c -0.33786 1.96619 0.98356 3.83379 2.95147 4.17133 l 26.27391 4.50692 c 1.96791 0.33756 3.8371 -0.98271 4.17498 -2.94892 0.12045 -0.70087 0.0268 -1.38727 -0.22884 -1.99828 l 0.004 -0.004 -9.52048 -22.19735 c -0.3789 -1.27716 -1.44965 -2.29675 -2.85251 -2.53738 -1.43919 -0.24686 -2.82284 0.39511 -3.59607 1.52588 l -16.13394 17.48092 c -0.54418 0.51722 -0.93532 1.20447 -1.0722 2.00096 z' },
    Spleen: { type: 'path', path: 'm 30.344618 215.24159 c -2.631335 0 -4.764454 2.13227 -4.764454 4.76256 v 35.11767 c 0 2.6303 2.133119 4.76256 4.764454 4.76256 0.937978 0 1.809314 -0.27526 2.546628 -0.74311 l 0.0062 0.004 26.732848 -17.31285 c 1.57573 -0.77685 2.662429 -2.39451 2.662429 -4.26955 0 -1.92363 -1.143156 -3.57683 -2.78547 -4.32848 L 33.184888 216.18716 c -0.793735 -0.59116 -1.774325 -0.94569 -2.840266 -0.94569 z' },
    SolarPlexus: { type: 'path', path: 'm 203.4202 215.24157 c 2.63132 0 4.76445 2.13227 4.76445 4.76256 v 35.11769 c 0 2.6303 -2.13313 4.76256 -4.76445 4.76256 -0.93799 0 -1.80932 -0.27526 -2.54665 -0.74311 l -0.006 0.004 -26.73284 -17.31285 c -1.57573 -0.77685 -2.66243 -2.39451 -2.66243 -4.26955 0 -1.92363 1.14317 -3.57683 2.78548 -4.32848 l 26.32235 -17.04725 c 0.79375 -0.59116 1.77433 -0.94569 2.84027 -0.94569 z' },
    Throat: { type: 'rect', x: 98.838089, y: 98.130074, w: 37.056858, h: 39.310009, rx: 4 },
    Sacral: { type: 'rect', x: 98.838089, y: 222.10779, w: 37.056858, h: 37.057182, rx: 4 },
    Root: { type: 'rect', x: 98.838089, y: 272.74216, w: 37.056858, h: 37.057182, rx: 4 },
};

// Gate coordinates for circles (offset +3 X, +2 Y for alignment)
const GATE_COORDS: Record<number, { x: number; y: number }> = {
    // Head center gates
    64: { x: 108.2, y: 34.6 }, 61: { x: 117.2, y: 34.6 }, 63: { x: 126.1, y: 34.6 },
    // Ajna center gates  
    17: { x: 108.2, y: 67.8 }, 11: { x: 126.1, y: 67.8 }, 43: { x: 117.2, y: 81.6 },
    47: { x: 108.2, y: 54.9 }, 24: { x: 117.2, y: 54.9 }, 4: { x: 126.1, y: 54.9 },
    // Throat center gates
    20: { x: 103.3, y: 118.5 }, 16: { x: 103.3, y: 108.2 }, 12: { x: 130.7, y: 116.5 },
    35: { x: 130.7, y: 108.2 }, 45: { x: 130.7, y: 124.9 }, 62: { x: 108.2, y: 101.7 },
    23: { x: 117.2, y: 101.7 }, 56: { x: 126.1, y: 101.7 }, 31: { x: 108.2, y: 131.6 },
    8: { x: 117.2, y: 131.6 }, 33: { x: 126.1, y: 131.6 },
    // G center gates
    1: { x: 117.1, y: 149.7 },
    7: { x: 108.2, y: 158.9 }, 13: { x: 126.1, y: 158.9 }, 10: { x: 96.9, y: 169.8 },
    25: { x: 137.1, y: 169.8 }, 15: { x: 108.2, y: 180.6 }, 46: { x: 126.1, y: 180.6 },
    2: { x: 117.1, y: 189.7 },
    // Heart center gates
    26: { x: 147.3, y: 201.2 }, 51: { x: 154.7, y: 193.0 },
    21: { x: 161.9, y: 185.2 }, 40: { x: 170.5, y: 205.2 },
    // Solar Plexus gates
    36: { x: 202.7, y: 219.3 },
    22: { x: 194.0, y: 225.2 }, 37: { x: 185.3, y: 230.7 }, 6: { x: 176.6, y: 236.3 },
    49: { x: 185.3, y: 241.9 }, 55: { x: 194.0, y: 247.5 }, 30: { x: 202.7, y: 253.4 },
    // Spleen center gates
    48: { x: 30.3, y: 219.3 }, 57: { x: 39.2, y: 225.2 }, 44: { x: 48.1, y: 230.7 },
    50: { x: 57.1, y: 236.3 }, 32: { x: 48.1, y: 241.9 }, 28: { x: 39.2, y: 247.5 },
    18: { x: 30.9, y: 253.4 },
    // Sacral center gates
    14: { x: 117.2, y: 225.9 }, 29: { x: 126.1, y: 225.9 },
    5: { x: 108.2, y: 225.9 }, 3: { x: 117.2, y: 253.1 }, 9: { x: 126.1, y: 253.1 },
    42: { x: 108.2, y: 253.1 }, 59: { x: 130.7, y: 246.6 }, 27: { x: 103.3, y: 246.6 },
    34: { x: 103.3, y: 232.8 },
    // Root center gates
    60: { x: 117.2, y: 276.4 }, 52: { x: 126.1, y: 276.4 },
    53: { x: 108.2, y: 276.4 }, 58: { x: 103.3, y: 302.2 }, 38: { x: 103.3, y: 292.5 },
    54: { x: 103.3, y: 282.8 }, 41: { x: 130.7, y: 302.2 }, 39: { x: 130.7, y: 292.5 },
    19: { x: 130.7, y: 282.8 },
};

// Body outline path
const BODY_OUTLINE = 'm 137.30866 100.47792 c 0.90442 2.15649 2.28884 3.70191 3.82987 5.20851 2.80177 2.73923 5.72891 4.75521 9.62565 6.74866 3.13253 1.6025 6.70347 1.91098 10.68166 2.68235 3.97817 0.77137 8.56247 0.47043 12.17926 2.93034 1.51125 1.02785 3.20855 3.80866 3.20855 3.80866 l 50.86888 123.3464 c 0 0 2.06871 5.00238 0 9.08727 -0.89377 1.76488 -3.47593 4.81091 -3.47593 4.81091 -13.10157 15.76911 -33.09277 33.16046 -51.06942 41.96185 -17.97665 8.80139 -34.58104 11.49272 -55.0801 11.22546 h -4.20585 6.98877 -4.20584 c -20.49907 0.26726 -37.103458 -2.42407 -55.080019 -11.22546 -17.976549 -8.80139 -37.967612 -26.19274 -51.069129 -41.96185 0 0 -2.5821459 -3.04603 -3.4759284 -4.81091 -2.0686923 -4.08489 0 -9.08727 0 -9.08727 L 57.897697 121.85644 c 0 0 1.697304 -2.78081 3.208538 -3.80866 3.616779 -2.45991 8.201035 -2.15897 12.179202 -2.93034 3.978153 -0.77137 8.217545 -2.0153 10.080009 -3.01644 3.855321 -2.07234 6.46327 -2.95267 10.360948 -7.21638 1.743375 -1.90711 2.858512 -3.76479 3.762903 -5.921296 0.56051 -1.336496 0.983083 -4.235072 0.983083 -4.235072';

// Theme colors (Mystic Jade palette)
const COLORS = {
    personality: '#20B2AA', // Teal/Jade (conscious)
    design: '#CD7F32',      // Bronze/Gold (unconscious)
    both: '#40C4B0',        // Blended teal (both)
    defined: '#B8860B',     // Dark gold for defined centers
    undefined: '#1a1a2e',   // Dark for undefined
    inactive: '#6a6a8a',    // Lighter gray for inactive strokes (better contrast)
    background: 'transparent', // Transparent background
    outline: '#4a4a6a',
};

// Short gates - these are gates in short channels that need special stroke-dasharray for visibility
// Head-Ajna: 64-47, 61-24, 63-4
// Ajna-Throat: 17-62, 43-23, 11-56
// Throat-G: 31-7, 8-1, 33-13
// G-Sacral: 2-14, 5-15, 46-29
// Sacral-Root: 3-60, 9-52, 42-53
const SHORT_GATES = new Set([
    // Head-Ajna
    64, 47, 61, 24, 63, 4,
    // Ajna-Throat
    17, 62, 43, 23, 11, 56,
    // Throat-G
    31, 7, 8, 1, 33, 13,
    // G-Sacral
    2, 14, 5, 15, 46, 29,
    // Sacral-Root
    3, 60, 9, 52, 42, 53
]);

interface BodygraphSVGProps {
    data: BodygraphData;
    width?: number;
    height?: number;
    className?: string;
}

export const BodygraphSVG: React.FC<BodygraphSVGProps> = ({
    data,
    width = 234,
    height = 320,
    className = '',
}) => {
    const { gateActivations, activeChannels, definedCenters } = data;

    // Create set of defined center codes
    const definedCenterSet = useMemo(() => {
        const set = new Set<string>();
        definedCenters.forEach(name => {
            // Support various naming formats
            const mappings: Record<string, string[]> = {
                'Head': ['Head', 'HD'],
                'Ajna': ['Ajna', 'AA'],
                'Throat': ['Throat', 'TT'],
                'G': ['G', 'GC', 'G Center', 'Self'],
                'Heart': ['Heart', 'HT', 'Will', 'Ego'],
                'Spleen': ['Spleen', 'SP', 'Splenic'],
                'SolarPlexus': ['SolarPlexus', 'SP', 'Solar Plexus', 'Emotional'],
                'Sacral': ['Sacral', 'SC'],
                'Root': ['Root', 'RT'],
            };
            for (const [canonical, variants] of Object.entries(mappings)) {
                if (variants.includes(name)) {
                    set.add(canonical);
                    break;
                }
            }
        });
        return set;
    }, [definedCenters]);

    // Compute active channels from gate activations
    // A channel is complete when BOTH gates in a pair are activated
    const computedActiveChannels = useMemo(() => {
        const channels: { gate1: number; gate2: number }[] = [];
        const processed = new Set<string>();

        Object.keys(gateActivations).forEach((gateIdStr) => {
            const gateId = parseInt(gateIdStr);
            const pairedGate = GATE_PAIRS[gateId];

            // If paired gate is also activated, we have a complete channel
            if (pairedGate && gateActivations[pairedGate]) {
                // Use sorted pair as key to avoid duplicates
                const pairKey = [Math.min(gateId, pairedGate), Math.max(gateId, pairedGate)].join('-');
                if (!processed.has(pairKey)) {
                    processed.add(pairKey);
                    channels.push({ gate1: gateId, gate2: pairedGate });
                }
            }
        });

        return channels;
    }, [gateActivations]);

    // Track drawn gates to avoid duplicate rendering
    const drawnGates = useMemo(() => {
        const drawn = new Set<number>();
        computedActiveChannels.forEach(ch => {
            drawn.add(ch.gate1);
            drawn.add(ch.gate2);
        });
        return drawn;
    }, [computedActiveChannels]);

    // Get color for gate/channel based on activation
    const getGateColor = (gateId: number): string => {
        const activation = gateActivations[gateId];
        if (!activation) return COLORS.inactive;
        switch (activation) {
            case 'personality': return COLORS.personality;
            case 'design': return COLORS.design;
            case 'both': return COLORS.both;
            default: return COLORS.inactive;
        }
    };

    // Check if channel needs dual stroke (mixed activation types)
    const needsDualStroke = (gate1: number, gate2: number): boolean => {
        const act1 = gateActivations[gate1];
        const act2 = gateActivations[gate2];
        if (act1 === 'both' || act2 === 'both') return true;
        if (act1 && act2 && act1 !== act2) return true;
        return false;
    };

    // Stub length calculation for hanging gates
    const getStubLength = (gateId: number): number => {
        // Short gates that connect to nearby centers
        const shortGates = [64, 61, 63, 47, 24, 4, 60, 52, 53, 3, 9, 42];
        if (shortGates.includes(gateId)) return 10;
        return 15;
    };

    return (
        <svg
            viewBox="0 0 234 320"
            width={width}
            height={height}
            className={className}
            style={{ backgroundColor: 'transparent' }}
        >
            <defs>
                {/* Glow filters - matching theme colors */}
                <filter id="glow-teal" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur in="SourceAlpha" stdDeviation="1.5" result="blur" />
                    <feFlood floodColor="#20B2AA" floodOpacity="1" result="color" />
                    <feComposite in="color" in2="blur" operator="in" result="glow" />
                    <feMerge>
                        <feMergeNode in="glow" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
                <filter id="glow-gold" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur in="SourceAlpha" stdDeviation="1.5" result="blur" />
                    <feFlood floodColor="#CD7F32" floodOpacity="1" result="color" />
                    <feComposite in="color" in2="blur" operator="in" result="glow" />
                    <feMerge>
                        <feMergeNode in="glow" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
                <filter id="glow-both" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur in="SourceAlpha" stdDeviation="1.2" result="blur" />
                    <feFlood floodColor="#40C4B0" floodOpacity="1" result="color" />
                    <feComposite in="color" in2="blur" operator="in" result="glow" />
                    <feMerge>
                        <feMergeNode in="glow" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
                {/* Subtle center glow for defined centers */}
                <filter id="center-glow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur in="SourceAlpha" stdDeviation="1.5" result="blur" />
                    <feFlood floodColor="#B8860B" floodOpacity="0.4" result="color" />
                    <feComposite in="color" in2="blur" operator="in" result="glow" />
                    <feMerge>
                        <feMergeNode in="glow" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
                {/* Stripe pattern for both activation */}
                <pattern id="stripe-pd" width="3" height="3" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                    <rect width="1.5" height="3" fill="#20B2AA" />
                    <rect x="1.5" width="1.5" height="3" fill="#CD7F32" />
                </pattern>
            </defs>

            {/* 1. Draw inactive channel base layer - curved paths for all gates */}
            {Object.entries(GATE_TO_CHANNEL_PATH).map(([gateIdStr, pathData]) => (
                <path
                    key={`base-${gateIdStr}`}
                    d={pathData}
                    fill="none"
                    stroke={COLORS.inactive}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    opacity="0.4"
                />
            ))}

            {/* 2. Draw active gate paths - each active gate draws its half of the channel */}
            {Object.entries(gateActivations).map(([gateIdStr, activation]) => {
                const gateId = parseInt(gateIdStr);

                // Check if this is a short gate
                const isShortGate = SHORT_GATES.has(gateId);

                // For short gates: use split_path (filled shape) for visibility
                // For long gates: use channel_path with stroke
                const pathData = isShortGate
                    ? GATE_TO_SPLIT_PATH[gateId]
                    : GATE_TO_CHANNEL_PATH[gateId];
                if (!pathData) return null;

                const pairedGate = GATE_PAIRS[gateId];
                const pairedActivation = pairedGate ? gateActivations[pairedGate] : null;

                // Determine if this forms a complete channel
                const isCompleteChannel = pairedActivation !== undefined && pairedActivation !== null;

                // Determine colors and effects
                const color = activation === 'personality' ? COLORS.personality :
                    activation === 'design' ? COLORS.design : COLORS.both;
                const filter = activation === 'personality' ? 'url(#glow-teal)' :
                    activation === 'design' ? 'url(#glow-gold)' : 'url(#glow-both)';

                // For short gates: use fill (split_path is a closed filled shape)
                // For long gates: use stroke (channel_path is a line)
                if (isShortGate) {
                    // Short gate: render as filled shape
                    if (activation === 'both') {
                        return (
                            <g key={`active-${gateId}`}>
                                <path
                                    d={pathData}
                                    fill={COLORS.personality}
                                    stroke="none"
                                    opacity="0.85"
                                    transform="translate(-0.5, 0)"
                                    filter="url(#glow-teal)"
                                />
                                <path
                                    d={pathData}
                                    fill={COLORS.design}
                                    stroke="none"
                                    opacity="0.85"
                                    transform="translate(0.5, 0)"
                                    filter="url(#glow-gold)"
                                />
                            </g>
                        );
                    }
                    return (
                        <path
                            key={`active-${gateId}`}
                            d={pathData}
                            fill={color}
                            stroke="none"
                            opacity="0.95"
                            filter={filter}
                        />
                    );
                }

                // Long gates: render as stroked path
                // For complete channels with mixed activations, draw dual strokes
                if (isCompleteChannel && activation !== pairedActivation && activation !== 'both' && pairedActivation !== 'both') {
                    return (
                        <path
                            key={`active-${gateId}`}
                            d={pathData}
                            fill="none"
                            stroke={color}
                            strokeWidth="2.8"
                            strokeLinecap="round"
                            filter={filter}
                        />
                    );
                }

                // For complete channels with same activation or hanging gates
                if (activation === 'both') {
                    return (
                        <g key={`active-${gateId}`}>
                            <path
                                d={pathData}
                                fill="none"
                                stroke={COLORS.personality}
                                strokeWidth="2"
                                strokeLinecap="round"
                                transform="translate(-0.8, 0)"
                                filter="url(#glow-teal)"
                            />
                            <path
                                d={pathData}
                                fill="none"
                                stroke={COLORS.design}
                                strokeWidth="2"
                                strokeLinecap="round"
                                transform="translate(0.8, 0)"
                                filter="url(#glow-gold)"
                            />
                        </g>
                    );
                }

                // Single color stroked path
                return (
                    <path
                        key={`active-${gateId}`}
                        d={pathData}
                        fill="none"
                        stroke={color}
                        strokeWidth={isCompleteChannel ? "3" : "2.5"}
                        strokeLinecap="round"
                        filter={filter}
                    />
                );
            })}

            {/* 4. Body outline */}
            <path
                d={BODY_OUTLINE}
                fill="none"
                stroke={COLORS.outline}
                strokeWidth="0.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.6"
            />

            {/* 5. Draw centers */}
            {Object.entries(CENTER_PATHS).map(([name, shape]) => {
                const isDefined = definedCenterSet.has(name);
                const fillColor = isDefined ? COLORS.defined : COLORS.undefined;
                const strokeColor = isDefined ? '#DAA520' : '#3d3d5c';

                if (shape.type === 'path') {
                    return (
                        <path
                            key={name}
                            d={shape.path}
                            fill={fillColor}
                            stroke={strokeColor}
                            strokeWidth="1.5"
                            transform={shape.transform ? `matrix(${shape.transform})` : undefined}
                        />
                    );
                }

                return (
                    <rect
                        key={name}
                        x={shape.x}
                        y={shape.y}
                        width={shape.w}
                        height={shape.h}
                        rx={shape.rx}
                        fill={fillColor}
                        stroke={strokeColor}
                        strokeWidth="1.5"
                    />
                );
            })}

            {/* 6. Draw gate circles - matching Go nganjuk reference styling */}
            {Object.entries(GATE_COORDS).map(([gateIdStr, coord]) => {
                const gateId = parseInt(gateIdStr);
                const activation = gateActivations[gateId];
                const isActive = activation !== undefined;

                // Gate styling matching nganjuk reference:
                // Inactive: white fill (70% opacity), gold stroke, dark text
                // Personality: dark teal fill (#134E4A), teal stroke (#20B2AA), light teal text (#5EEAD4)
                // Design: dark bronze fill (#5C3D2E), bronze stroke (#CD7F32), gold text (#FFD700)
                // Both: combined pattern with gold text

                let fillColor: string;
                let strokeColor: string;
                let textColor: string;
                let opacity: number;
                const radius = isActive ? 5.0 : 4.5;
                const strokeWidth = isActive ? 0.8 : 0.5;

                if (!isActive) {
                    // Inactive gate - white with gold stroke
                    fillColor = 'white';
                    strokeColor = '#D4AF37';
                    textColor = '#1C1917';
                    opacity = 0.70;
                } else if (activation === 'personality') {
                    // Personality - dark teal
                    fillColor = '#134E4A';
                    strokeColor = '#20B2AA';
                    textColor = '#5EEAD4';
                    opacity = 0.95;
                } else if (activation === 'design') {
                    // Design - dark bronze
                    fillColor = '#5C3D2E';
                    strokeColor = '#CD7F32';
                    textColor = '#FFD700';
                    opacity = 0.95;
                } else {
                    // Both - mixed pattern
                    fillColor = '#3D4030';
                    strokeColor = 'url(#stripe-pd)';
                    textColor = '#FFD700';
                    opacity = 0.95;
                }

                const filterAttr = isActive ? (
                    activation === 'personality' ? 'url(#glow-teal)' :
                        activation === 'design' ? 'url(#glow-gold)' :
                            'url(#glow-both)'
                ) : undefined;

                return (
                    <g key={`gate-${gateId}`} filter={filterAttr}>
                        <circle
                            cx={coord.x}
                            cy={coord.y}
                            r={radius}
                            fill={fillColor}
                            opacity={opacity}
                            stroke={strokeColor}
                            strokeWidth={strokeWidth}
                        />
                        {/* Gate number for ALL gates */}
                        <text
                            x={coord.x}
                            y={coord.y + 0.3}
                            textAnchor="middle"
                            dominantBaseline="central"
                            fill={textColor}
                            fontSize="5.5"
                            fontWeight="bold"
                            fontFamily="'Roboto', sans-serif"
                            className="gate-text"
                        >
                            {gateId}
                        </text>
                    </g>
                );
            })}
        </svg>
    );
};

export default BodygraphSVG;
