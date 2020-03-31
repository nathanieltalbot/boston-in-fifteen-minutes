import loadable from '@loadable/component';
import React from 'react';

const LoadedNeighborhoods = loadable(() => import('./Neighborhoods'))

export default LoadedNeighborhoods