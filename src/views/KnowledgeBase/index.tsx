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
import { Switch, Route } from 'react-router-dom'
import './index.css';
import { ExpandMore, ExpandLess } from '@material-ui/icons';

import { DocumentEditor, MutableDialog, CRUDTree } from "@workerhive/react-ui"

import _ from 'lodash';

export interface KnowledgeBaseProps {
    getKnowledge: Function;
    addKnowledge: Function;
    updateKnowledge: Function;
    match: any;
    history: any;
    list: any;
}

const KnowledgeBase : React.FC<KnowledgeBaseProps> = (props) => {

    const [ dialogOpen, openDialog ] = React.useState(false);
    const [ editorData, setEditorData ] = React.useState('')
    const [ editorMap, setEditorMap ] = React.useState('')

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

    const update = _.debounce((editorData, val) => {
        console.log("DEBOUNCE")
        props.updateKnowledge(editorData.id, {content: val})
    }, 333)

    return (
        <div className="knowledge-base">
            <MutableDialog 
                open={dialogOpen}
                data={modalData}
                onSave={(data : any) => {
                    if(data.id){
                        props.updateKnowledge(data.id, data)
                    }else{
                        data.content = "## " + data.title;
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
                    onClick={(item : any) => {
                      //  setEditorData(item)
                        setEditorMap(item.content)
                        props.history.push(`${props.match.url}/${item.id}`)
                        console.log(item)
                    }}
                    onEdit={(item : any) => {
                        setModalData(item)
                        openDialog(true)
                    }}
                    onAdd={(item : any) => {
                        if(item) setModalData({parent: item.id})
                        openDialog(true)
                    }}
                    value={props.list} />
            </Paper>
            <div className="knowledge-base__editor">
            <Switch>
                <Route path={`${props.match.url}/:id`} render={(_props) => {

                    let kbItem = props.list.filter((a : any) => a.id == _props.match.params.id)

                    if(kbItem.length > 0 && kbItem[0].content){
                        kbItem = Object.assign({}, kbItem[0]);
                        console.log(kbItem)
                    return (
                        <div>
                        <DocumentEditor 
                            data={kbItem}
                            links={props.list}
                            onChange={(value : any) => {
                            if(kbItem.id){
                                update(kbItem, value)
                                
                                setEditorMap(value)
                            }
                        }}/>
                            <div>
                            {((kbItem && kbItem.content.match(/\[([^\[\]]*)\]\((.*?)\)/gm)) || []).map((x : any) => {
                                let data = x.match(/\[([^\[\]]*)\]\((.*?)\)/)
                                return(
                                    <div>
                                        {data[1]}
                                    </div>
                                )
                            })}
                            </div>
                        </div>
                        

                    )
                        }
                }} />
            </Switch>

            
            </div>
        
        </div>
    )
}

export default connect((state : any) => ({
    list: state.knowledge.kb
}), (dispatch: any) => ({
    getKnowledge: () => dispatch(getKnowledge()),
    addKnowledge: (input : any) => dispatch(addKnowledge(input)),
    updateKnowledge: (id : string, update : any) => dispatch(updateKnowledge(id, update))
}))(KnowledgeBase)