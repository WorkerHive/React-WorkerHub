import React, {Suspense, lazy} from 'react';
import RGL, {WidthProvider} from 'react-grid-layout'
import { WorkhubClient } from '@workerhive/client'
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
    data?: any;
}

const defaultProps = {
    items: 20,
    rowHeight: 50,
    cols: 12, 
}

const client = new WorkhubClient();

export const Layout : React.FC<LayoutProps> = (props) => {
    const [ widgets, setWidgets ] = React.useState<any>({WordCounter: {type: TestWidget, title: 'Test Widget'}})
    const [ layout, setLayouts ] = React.useState<any>({rows: [{columns: [{className: 'col-md-12', widgets: [{key: 'WordCounter'}]}]}]})

    const [data, setData] = React.useState<any>({})
    const [ types, setTypes ] = React.useState<any>({})
    React.useEffect(() => {
        client.getModels().then((types : any) => {
            let _type : any ={};
            types.forEach((ty : any) => {
                _type[ty.name] = ty
            })
            setTypes(_type)
            console.log("TYPES", types, types[props.data.type])
        })

        if(props.data.methods){
           setTimeout(() => {
            for(const k in props.data.methods){
                client.actions[props.data.methods[k]]().then((r : any) => {
                    let d = Object.assign({}, data);
                    d[k] = r;
                    setData(d)
                })
            }
        }, 1000)
  
        }
    }, [props.data, data])

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
                        {x.component instanceof Function ? x.component(data, types[props.data.type], client) : x.component}
                    </div>
                ))}
        </ReactGridLayout>
        </Suspense>
    )
}