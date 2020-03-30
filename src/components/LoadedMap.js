import loadable from '@loadable/component';
import React from 'react';

const LoadedMap = loadable(() => import('./Map'))

export default LoadedMap