import React from 'react';

import {
    Paper
} from '@material-ui/core';
import GridLayout, { WidthProvider } from 'react-grid-layout';

import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'
import './index.css';
const ResponsiveGridLayout = WidthProvider(GridLayout);
export default function Dashboard(props){
    const layout = [
        {i: 'a', x: 0, y: 0, w: 7, h: 3}
    ]
    return (
        <div className="dashboard-view">
            <ResponsiveGridLayout
                isBounded={true}
                autoSize={false}
                className="layout" 
                style={{height: 'calc(100vh - 16px)'}}
                rowHeight={35}
                height={window.innerHeight - 16}
                containerPadding={[0, 0]}
                layout={layout}
                
                cols={12}>
                <Paper key="a" data-grid={{w: 7, h: 3, x: 0, y: 0}}>a</Paper>
                <Paper key="b" data-grid={{w: 5, h: parseInt(window.innerHeight / 35) - 8, x: 8, y: 5}}>b</Paper>

            </ResponsiveGridLayout>
        </div>
    )
}