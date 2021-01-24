import React, { Suspense, lazy, useRef } from 'react';
import RGL, { WidthProvider } from 'react-grid-layout'
import { useHub, WorkhubClient } from '@workerhive/client'
import useResizeAware from 'react-resize-aware';
import 'react-grid-layout/css/styles.css';
const ReactGridLayout = WidthProvider(RGL);

const Header = lazy(() => import('@workerhive/react-ui').then((r) => ({ default: r.Header })))
const SearchTable = lazy(() => import('@workerhive/react-ui').then((r) => ({ default: r.SearchTable })))


export interface LayoutItem {
    x: number;
    y: number;
    w: number;
    h: number;
    i: string;
    maxW?: number;
    maxH?: number;
    component: (store: any, params?: any, type?: object, client?: WorkhubClient | null) => any;
}

export interface LayoutProps {
    schema: {
        layout: (sizes: any, rowHeight: number) => Array<LayoutItem>,
        data: any,
        label: string,
        path: string
    },
    match: any;
    history: any;
}

const defaultProps = {
    items: 20,
    rowHeight: 50,
    cols: 12,
}

export const Layout: React.FC<LayoutProps> = (props) => {
    const [resizeListener, sizes] = useResizeAware();

    const [client, store, isReady, err] = useHub();


    const [data, setData] = React.useState<any>({})
    const [types, setTypes] = React.useState<any>({})

    React.useEffect(() => {
        if (Object.keys(data).length < 1 && client != null) {
            /*client!.getModels().then((types : any) => {
                let _type : any ={};
                types.forEach((ty : any) => {
                    _type[ty.name] = ty
                })
                setTypes(_type)
            })*/

            if (props.schema.data) {
                /*
                    Data fetching schema
                    {
                        [key]: {
                            type: 'GraphType',
                            query: `getGraphType(id: $id)`
                        }
                    }
                */
                (async () => {
                    for (const k in props.schema.data) {
                        //Pull name from data object
                        let name = props.schema.data[k].type;
                        let isArray = false;
                        let query = typeof(props.schema.data[k].query) === 'function' ? props.schema.data[k].query(props.match.params) : {}

                        //Check to see if it's an array type
                        if (name.match(/\[(.*?)\]/)) {
                            name = name.match(/\[(.*?)\]/)[1]
                            isArray = true;
                        }

                        //Fetch the full Model
                        let model = client.models?.filter((a) => a.name == name)[0]

                        if (model) {
                            //Key the model to types state
                            let t = Object.assign({}, types)
                            t[model.name] = model;
                            setTypes(t);

                            let currentValue;

                            //Check for data in cache if not delegate to fetch
                            if (isArray) {
                                currentValue = store[model.name]
                                if (currentValue) {
                                    console.log("Current value", currentValue)
                                } else {
                                    let result = await client!.actions[`get${model.name}s`]()

                                    console.log(store, result)
                                    currentValue = result //store[model.name]

                                }
                            } else {
                                currentValue = store[model.name] ? store[model.name].filter((a: any) => {
                                    let matches = true;
                                    for (var k in (query || {})) {
                                        if (a[k] != query[k]) {
                                            matches = false;
                                            break;
                                        }
                                    }
                                    return matches;
                                }) : []

                                if (currentValue.length > 0) {
                                    currentValue = currentValue[0]
                                    console.log("CUrrent Valye", currentValue)
                                } else {
                                    let result = await client!.actions[`get${model.name}`](query.id)
                                    console.log(result, query, store[model.name])
                                    currentValue = result
                                  /*  currentValue = store[model.name].filter((a: any) => {
                                        let matches = true;
                                        for (var k in (query || {})) {
                                            if (a[k] != query[k]) {
                                                matches = false;

                                            }
                                        }
                                        return matches;
                                    })*/

                                }
                            }

                            console.log("KEYING", k, currentValue)
                            let d = Object.assign({}, data)
                            d[k] = currentValue;
                            setData(d)


                        }
                    }
                })()
                /*
                                    console.log("Data action", k, props.schema.data)
                                    client!.actions[props.schema.data[k].query]().then((r : any) => {
                                        console.log(r, k)
                                        let d = Object.assign({}, data);
                                        d[k] = r;
                                        setData(d)
                                    })*/



            }
        }
    }, [props.schema, data, store])

    function getData() : object{
        let obj : any = {};

        for(const k in props.schema.data){
            let name = props.schema.data[k].type;
            let arr = (name.match(/\[(.*?)\]/) != null)
            if(arr) name = name.match(/\[(.*?)\]/)[1]
            let query = typeof(props.schema.data[k].query) === 'function' ? props.schema.data[k].query(props.match.params) : {}

            
            obj[k] = arr ? (store[name] || []):(store[name].filter((a: any) => {
                let match = true;
                for(var queryK in query){
                    if(a[queryK] != query[queryK]){
                        match = false;
                    }
                }
                return match;
            })[0] || {})
        }

        return obj
    }

    return (
        <Suspense fallback={<div>loading</div>}>
            {resizeListener}
            <ReactGridLayout
                style={{ flex: 1 }}
                {...defaultProps}
                isDraggable={false}
                isResizable={false}
                layout={props.schema.layout(sizes, 64) as RGL.Layout[]}
                onLayoutChange={(layout) => { }}
                isBounded={true}>
                {props.schema.layout(sizes, 64).map((x) => (
                    <div key={x.i} style={{ display: 'flex', flexDirection: 'column' }}>
                        {x.component instanceof Function ? x.component({
                            ...getData(),
                            label: props.schema.label,
                            path: props.schema.path
                        }, { ...props.match.params, navigate: (url: string) => props.history.push(url) }, types, client) : x.component}
                    </div>
                ))}
            </ReactGridLayout>
        </Suspense>
    )
}