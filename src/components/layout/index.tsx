import React, {Suspense, lazy} from 'react';

import RGL, {WidthProvider} from 'react-grid-layout'
import 'react-grid-layout/css/styles.css';
const ReactGridLayout = WidthProvider(RGL);


const Header = lazy(() => import('@workerhive/react-ui').then((r) => ({default: r.Header})))
const SearchTable = lazy(() => import('@workerhive/react-ui').then((r) => ({default: r.SearchTable})))

const TestWidget = (props: any) => {
    return (<div>TeST</div>)
}

export interface LayoutItem {
    x: number;
    y: number;
    w: number;
    h: number;
    i: string;
    maxW?:number;
    maxH?:number;
    component: any;
}

export interface LayoutProps {
    layout: Array<LayoutItem>
}

const defaultProps = {
    items: 20,
    rowHeight: 50,
    cols: 12, 
}

export const Layout : React.FC<LayoutProps> = (props) => {
    const [ widgets, setWidgets ] = React.useState<any>({WordCounter: {type: TestWidget, title: 'Test Widget'}})
    const [ layout, setLayouts ] = React.useState<any>({rows: [{columns: [{className: 'col-md-12', widgets: [{key: 'WordCounter'}]}]}]})


    return (
        <Suspense fallback={<div>loading</div>}>
        <ReactGridLayout 
            style={{flex:1}}
            {...defaultProps}    
            layout={props.layout as RGL.Layout[]}
            onLayoutChange={(layout) => {}} 
            isBounded={true}>
                {props.layout.map((x) => (
                    <div key={x.i} style={{display: 'flex', flexDirection: 'column'}}>
                        {x.component}
                    </div>
                ))}
        </ReactGridLayout>
        </Suspense>
    )
}