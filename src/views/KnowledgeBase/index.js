import React from 'react';

import { 
    Paper
} from "@material-ui/core"

import {
    TreeView,
    TreeItem
} from "@material-ui/lab"

import Editor from 'rich-markdown-editor';

import { getKnowledge, addKnowledge, updateKnowledge } from '../../actions/knowledgeActions'
import { connect } from 'react-redux';

import './index.css';
import { ExpandMore, ExpandLess } from '@material-ui/icons';
import MutableDialog from '../../components/dialogs/mutable-dialog';
import CRUDTree from '../../components/crud-tree';

function KnowledgeBase(props){

    const [ dialogOpen, openDialog ] = React.useState(false);
    const [ editorData, setEditorData ] = React.useState('')
    const [ modalData, setModalData ] = React.useState({})

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
            <MutableDialog 
                open={dialogOpen}
                data={modalData}
                onSave={(data) => {
                    if(data.id){
                        props.updateKnowledge(data.id, data)
                    }else{
                        props.addKnowledge(data)
                    }
                    openDialog(false);
                    console.log(data)
                }}
                onClose={() => openDialog(false)} 
                title={"Knowledge"}
                structure={{
                    title: "String",
                    description: "String" 
                }} />
            <Paper className="knowledge-base__menu">
                <CRUDTree 
                    onClick={(item) => {
                        setEditorData('## ' + item.title)
                        props.history.push(`${props.match.url}/${item.id}`)
                        console.log(item)
                    }}
                    onEdit={(item) => {
                        setModalData(item)
                        openDialog(true)
                    }}
                    onAdd={() => {
                        openDialog(true)
                    }}
                    tree={props.list} />
            </Paper>
            <div className="knowledge-base__editor">
            <Editor 
                readOnly={false}
                onChange={(valueFn) => {
                    let val = valueFn();
                   setEditorData('')
                    console.log("Editor event", val)
                }}
                value={editorData}
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
    addKnowledge: (input) => dispatch(addKnowledge(input)),
    updateKnowledge: (id, update) => dispatch(updateKnowledge(id, update))
}))(KnowledgeBase)