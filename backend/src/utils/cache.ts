import NodeCache from 'node-cache';

export const cache = new NodeCache({ stdTTL: 300 }); // Cache for 5 minutes by default
