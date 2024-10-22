import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 600 }); // Cache trong 10 phút

export default cache;
