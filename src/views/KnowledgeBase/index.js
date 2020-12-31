import React from 'react';

import { 
    Paper
} from "@material-ui/core"

import {
    TreeView,
    TreeItem
} from "@material-ui/lab"

import Editor from 'rich-markdown-editor';

import { getKnowledge, addKnowledge } from '../../actions/knowledgeActions'
import { connect } from 'react-redux';

import './index.css';
import { ExpandMore, ExpandLess } from '@material-ui/icons';

function KnowledgeBase(props){

    const [branches, setBranches ] = React.useState([
        "Flows",
        "Graphs",
        "Libraries"
    ])


    React.useEffect(() => {
        props.getKnowledge()
     //   props.addKnowledge({title: "Linked Data Graphs", description: "The start of an explanation"})
    }, [])

    return (
        <div className="knowledge-base">
            <Paper className="knowledge-base__menu">
                <TreeView
                    defaultExpanded={['root']}
                    defaultCollapseIcon={<ExpandLess />}
                    defaultExpandIcon={<ExpandMore />}>
                    <TreeItem nodeId="root" label="Homepage">
                        {props.list.map((x) => (
                            <TreeItem nodeId={x.id} label={x.title} />
                        ))}
                    </TreeItem>
                </TreeView>
            </Paper>
            <div className="knowledge-base__editor">
            <Editor 
                value={"## Title Block"}
                style={{
                    border: '1px solid #dfdfdf', 
                    flex: 1, 
                    background: 'white', 
                    flexDirection: 'column', 
                    borderRadius: 7,
                    display: 'flex', 
                    justifyContent: 'flex-start', 
                    minWidth: 'calc(40em + 48px)', 
                    maxWidth: 'calc(40em + 48px)', 
                    padding: '12px 24px'
                }}
                 onSearchLink={(search) => {
                     return branches.filter((a) => a.indexOf(search) > -1).map((x) => ({title: x, url: `/kb/${x}`}))
                     return [{title: "Flow programming", subtitle:"Flow spec", url: "[[Flow Spec]]"}]
                 }} />
            </div>
        
        </div>
    )
}

export default connect((state) => ({
    list: state.knowledge.kb
}), (dispatch) => ({
    getKnowledge: () => dispatch(getKnowledge()),
    addKnowledge: (input) => dispatch(addKnowledge(input))
}))(KnowledgeBase)