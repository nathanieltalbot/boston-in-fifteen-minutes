import loadable from '@loadable/component'
const LoadableComponent = loadable(props => import(`./${props.component}`))
export default LoadableComponent