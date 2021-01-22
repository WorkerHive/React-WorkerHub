import React, {Suspense, lazy, useRef} from 'react';
import RGL, {WidthProvider} from 'react-grid-layout'
import { useHub, WorkhubClient } from '@workerhive/client'
import useResizeAware from 'react-resize-aware';
import 'react-grid-layout/css/styles.css';
const ReactGridLayout = WidthProvider(RGL);

const Header = lazy(() => import('@workerhive/react-ui').then((r) => ({default: r.Header})))
const SearchTable = lazy(() => import('@workerhive/react-ui').then((r) => ({default: r.SearchTable})))


export interface LayoutItem {
    x: number;
    y: number;
    w: number;
    h: number;
    i: string;
    maxW?:number;
    maxH?:number;
    component: (store: any, params?: any, type?: object, client?: WorkhubClient | null) => any;
}

export interface LayoutProps {
    layout: (sizes: any, rowHeight: number) => Array<LayoutItem>
    data?: any;
    match: any;
    history: any;
}

const defaultProps = {
    items: 20,
    rowHeight: 50,
    cols: 12, 
}

export const Layout : React.FC<LayoutProps> = (props) => {
    const [resizeListener, sizes] = useResizeAware();

    const [ client, store, isReady, err ] = useHub();

    console.log(store)

    const [data, setData] = React.useState<any>({})
    const [ types, setTypes ] = React.useState<any>({})

    React.useEffect(() => {
        if(Object.keys(data).length < 1 && client != null){
            client!.getModels().then((types : any) => {
                let _type : any ={};
                types.forEach((ty : any) => {
                    _type[ty.name] = ty
                })
                setTypes(_type)
            })

            if(props.data.methods){
   
                for(const k in props.data.methods){
                    console.log(props.data.methods[k])
                    client!.actions[props.data.methods[k]]().then((r : any) => {
                        let d = Object.assign({}, data);
                        d[k] = r;
                        setData(d)
                    })
                }
  
  
        }
    }
    }, [props.data, data])

    return (
        <Suspense fallback={<div>loading</div>}>
            {resizeListener}
        <ReactGridLayout 
            style={{flex:1}}
            {...defaultProps}   
            isDraggable={false}
            isResizable={false} 
            layout={props.layout(sizes, 64) as RGL.Layout[]}
            onLayoutChange={(layout) => {}} 
            isBounded={true}>
                {props.layout(sizes, 64).map((x) => (
                    <div key={x.i} style={{display: 'flex', flexDirection: 'column'}}>
                        {x.component instanceof Function ? x.component(store, {...props.match.params, navigate: (url : string) => props.history.push(url)}, types[props.data.type], client) : x.component}
                    </div>
                ))}
        </ReactGridLayout>
        </Suspense>
    )
}