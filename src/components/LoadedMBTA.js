import loadable from '@loadable/component';

const LoadedMBTA = loadable(() => import('./MBTA'))

export default LoadedMBTA