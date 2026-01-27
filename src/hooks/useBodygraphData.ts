import { useMemo } from 'react';
import type { BodygraphData, ActivationType } from '@/components/chart/BodygraphSVG';

interface PlanetData {
    Planet: string;
    Gate: string | number;
    Line?: string | number;
    Lon?: number;
    Ch_Gate?: number;
}

interface ChannelData {
    id?: string;
    name?: string;
    circuit?: string;
    // May have gate pair info
    [key: string]: unknown;
}

interface TransformInput {
    definedCenters: string[];
    channels: ChannelData[];
    designPlanets: PlanetData[];
    personalityPlanets: PlanetData[];
}

/**
 * Transform chart API data into BodygraphData format for the React SVG component
 */
export function useBodygraphData({
    definedCenters,
    channels,
    designPlanets,
    personalityPlanets,
}: TransformInput): BodygraphData {
    return useMemo(() => {
        // Build gate activations map
        const gateActivations: Record<number, ActivationType> = {};

        // Process personality gates (teal)
        personalityPlanets.forEach((planet) => {
            const gateNum = typeof planet.Gate === 'string' ? parseInt(planet.Gate) : planet.Gate;
            if (!isNaN(gateNum) && gateNum > 0 && gateNum <= 64) {
                gateActivations[gateNum] = 'personality';
            }
        });

        // Process design gates (gold) - may overlap with personality
        designPlanets.forEach((planet) => {
            const gateNum = typeof planet.Gate === 'string' ? parseInt(planet.Gate) : planet.Gate;
            if (!isNaN(gateNum) && gateNum > 0 && gateNum <= 64) {
                if (gateActivations[gateNum] === 'personality') {
                    gateActivations[gateNum] = 'both';
                } else {
                    gateActivations[gateNum] = 'design';
                }
            }
        });

        // Parse active channels
        // Channels may come in format "1-8" or as objects with id field
        const activeChannels: { gate1: number; gate2: number }[] = [];
        channels.forEach((ch) => {
            const channelId = ch.id || ch.name || '';
            if (typeof channelId === 'string' && channelId.includes('-')) {
                const [g1, g2] = channelId.split('-').map((n) => parseInt(n.trim()));
                if (!isNaN(g1) && !isNaN(g2)) {
                    activeChannels.push({ gate1: g1, gate2: g2 });
                }
            }
        });

        // Map center names to codes
        const centerNameToCode: Record<string, string> = {
            'Head': 'Head',
            'Ajna': 'Ajna',
            'Throat': 'Throat',
            'G': 'G',
            'G Center': 'G',
            'Self': 'G',
            'Heart': 'Heart',
            'Will': 'Heart',
            'Ego': 'Heart',
            'Spleen': 'Spleen',
            'Splenic': 'Spleen',
            'Solar Plexus': 'SolarPlexus',
            'SolarPlexus': 'SolarPlexus',
            'Emotional': 'SolarPlexus',
            'Sacral': 'Sacral',
            'Root': 'Root',
        };

        const mappedDefinedCenters = definedCenters.map((name) => {
            return centerNameToCode[name] || name;
        });

        return {
            gateActivations,
            activeChannels,
            definedCenters: mappedDefinedCenters,
        };
    }, [definedCenters, channels, designPlanets, personalityPlanets]);
}

export default useBodygraphData;
