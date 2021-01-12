import { Fab } from '@material-ui/core';
import { Add } from '@material-ui/icons';
import React from 'react';
import { v4 } from 'uuid';
import { merge, unionWith } from 'lodash'
import RGL, {WidthProvider} from 'react-grid-layout'
import 'react-grid-layout/css/styles.css';
import { EditorModal } from './editor-modal';
const ReactGridLayout = WidthProvider(RGL);

export interface LayoutEditorProps {

}

const defaultProps = {
    items: 20,
    rowHeight: 50,
    cols: 12, 
}
export const LayoutEditor : React.FC<LayoutEditorProps> = (props) => {
    const [ modalOpen, openModal ] = React.useState<boolean>(false);

    const [ layout, setLayouts ] = React.useState<any>([])

    const addItem = (Item: any) => {
        setLayouts(layout.concat([{
            i: v4(),
            x: 1,
            y: 1,
            w: 1,
            h: 1,
            component: <Item />
        }]))
    }

    return (
        <>
        <ReactGridLayout 
            style={{flex:1}}
            {...defaultProps}    
            layout={layout}
            onLayoutChange={(_layout : any) => {
                let l = layout.map((x: any) => {
                    return {
                        ...x,
                        ..._layout.filter((a : any) => a.i == x.i)[0]
                    }
                })
                setLayouts(l)
            }} 
            isBounded={true}>
                {layout.map((x: any) => (
                    <div key={x.i} style={{display: 'flex', flexDirection: 'column'}}>
                        {x.component}
                    </div>
                ))} 
        </ReactGridLayout>
        <Fab style={{position: 'absolute', right: 12, bottom: 12}} color="primary" onClick={() => openModal(true)}>
            <Add />
        </Fab>
        <EditorModal open={modalOpen} onSave={(item) => {
            addItem(item)    
        }} onClose={() => openModal(false)}/>
        </>
    )
}