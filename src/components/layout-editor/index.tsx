import { Fab } from '@material-ui/core';
import { Add, Cancel, Edit } from '@material-ui/icons';
import React from 'react';
import { v4 } from 'uuid';
import { isEqual, merge, unionWith } from 'lodash'
import RGL, {WidthProvider} from 'react-grid-layout'
import { EditorModal } from './editor-modal';
import 'react-grid-layout/css/styles.css';
import './index.css';

const ReactGridLayout = WidthProvider(RGL);

export interface LayoutEditorProps {
    onLayoutChange?: Function;
    layout?: any;
}

const defaultProps = {
    items: 20,
    rowHeight: 50,
    cols: 12, 
}
export const LayoutEditor : React.FC<LayoutEditorProps> = ({layout = [], onLayoutChange}) => {
    const [ modalOpen, openModal ] = React.useState<boolean>(false);
    const componentMenu = [<Edit />, <Cancel />]
    const setLayouts = (layout: any) => {
        if(onLayoutChange) onLayoutChange(layout)
    }

    const addItem = (Item: any, name: string) => {
        setLayouts(layout.concat([{
            i: v4(),
            x: 1,
            y: 1,
            w: 1,
            h: 1,
            component: <Item />,
            componentName: name
        }]))
    }

    return (
        <>
        <ReactGridLayout 
            style={{flex:1}}
            {...defaultProps}    
            layout={layout}
            onLayoutChange={(_layout : any) => {
                console.log("Layout change")
                let l = layout.map((x: any) => {
                    return {
                        ...x,
                        ..._layout.filter((a : any) => a.i == x.i)[0]
                    }
                })
                if(!isEqual(l, layout)){
                    setLayouts(l)
                }else{
                    console.log("No change")
                }
            }} 
            isBounded={true}>
                {layout.map((x: any) => (
                    <div key={x.i} className="layout-item" style={{display: 'flex', flexDirection: 'column'}}>
                        <div className="component-menu">
                            {componentMenu}
                        </div>
                        {x.component}
                    </div>
                ))} 
        </ReactGridLayout>
        <Fab style={{position: 'absolute', right: 12, bottom: 12}} color="primary" onClick={() => openModal(true)}>
            <Add />
        </Fab>
        <EditorModal open={modalOpen} onSave={(item, name) => {
            addItem(item, name)    
        }} onClose={() => openModal(false)}/>
        </>
    )
}