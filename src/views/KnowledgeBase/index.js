import React from 'react';

import { 
    Paper
} from "@material-ui/core"

import {
    TreeView,
    TreeItem
} from "@material-ui/lab"

import Editor from 'rich-markdown-editor';

import './index.css';
import { ExpandMore, ExpandLess } from '@material-ui/icons';

export default function KnowledgeBase(props){

    const [branches, setBranches ] = React.useState([
        "Flows",
        "Graphs",
        "Libraries"
    ])

    return (
        <div className="knowledge-base">
            <Paper className="knowledge-base__menu">
                <TreeView
                    defaultCollapseIcon={<ExpandLess />}
                    defaultExpandIcon={<ExpandMore />}>
                    <TreeItem nodeId="root" label="Homepage">
                        {branches.map((x) => (
                            <TreeItem nodeId={x} label={x} />
                        ))}
                    </TreeItem>
                </TreeView>
            </Paper>
            <div className="knowledge-base__editor">
            <Editor 
                style={{
                    border: '1px solid #dfdfdf', 
                    flex: 1, 
                    background: 'white', 
                    flexDirection: 'column', 
                    borderRadius: 7,
                    display: 'flex', 
                    justifyContent: 'flex-start', 
                    minWidth: 'calc(49em + 48px)', 
                    maxWidth: 'calc(49em + 48px)', 
                    padding: '12px 24px'
                }}
                 defaultValue=""
                 onSearchLink={(search) => {
                     return branches.filter((a) => a.indexOf(search) > -1).map((x) => ({title: x, url: `/kb/${x}`}))
                     return [{title: "Flow programming", subtitle:"Flow spec", url: "[[Flow Spec]]"}]
                 }} />
            </div>
        
        </div>
    )
}