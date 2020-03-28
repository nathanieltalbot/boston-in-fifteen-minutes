import loadable from '@loadable/component';
import React from 'react';

const LoadedData = loadable(() => import('./MapData'))

export default function LoadedMap(props)  {
    return(<>
        <LoadedData dataSet={props.dataSet}/>
        </>
    )
}