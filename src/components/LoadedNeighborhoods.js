import loadable from '@loadable/component';
import React from 'react';

const LoadedComponent = loadable(() => import('./Neighborhoods'))

export default function LoadedNeighborhoods(props) {
    return(
        <LoadedComponent dataSet={props.dataSet} />
    )
}