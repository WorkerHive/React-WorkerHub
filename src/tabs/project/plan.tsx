import React from 'react';
import {
    Dashboard as DashboardIcon,
    List as ListIcon,
    EmojiNature,
} from '@material-ui/icons';

import {
    ButtonGroup,
    Divider,
    Button,
    Switch,
    FormControlLabel
} from "@material-ui/core"


import {Editor, withEditor, NodePanel} from '@workerhive/hive-flow'
import { GraphKanban } from '@workerhive/react-ui'
import { setStatus } from '../../actions/authActions';
import { connect } from 'react-redux';
import qs from 'qs';
import { PlanTree } from '../../components/plan/tree';
import jwt_decode from 'jwt-decode';
import './plan.css';

let yDoc;


export interface PlanTabProps {
  editor?: any;
  project?: any;
  location?: any;
  history?: any;
}

const PlanTab : React.FC<PlanTabProps> = (props) => {

  const [ selfish, setSelfish ] = React.useState(false);

  let query = qs.parse(window.location.search, {ignoreQueryPrefix: true})

    const editChild = (tree_branch : any) => {
      props.editor.explore(tree_branch)
    }
      
    const addChild = (parent : any) => {

      console.log("Add child", parent)
      
      if(!parent) {
        let parents = props.editor.nodes.filter((a : any) => props.editor.links.filter((link : any) => link.target == a.id).length < 1)
        if(parents.length > 0){
          parent = {position: {
            x: parents.length * 121,
            y: parents[0].position.y
          }}
        }else{
          parent = {
            position: {
              x: 300,
              y: 300
            }
          }
        }
      }

      let node = props.editor.addNode('baseNode', {x: parent.position.x, y: parent.position.y + 121})
      
      if(parent.id) {
        console.log("ADD LINK")
        props.editor.addLink(parent.id, node.id)
      }
    
      console.log(node)
  
      props.editor.explore(node)
    }
    

    const renderKanban = () => {
      return (
        <GraphKanban 
          onClick={(card : any) => {
            props.editor.exploreNode(card.id)
          }}
          onStatusChange={(card : any, status : any) => {
            props.editor.updateNode(card.id, (node : any) => {
              return {data: {
                status: status
              }}
            })
          }}
          onChange={(cols : any) => {
            //Add column -> node mapping to yjs
            /*let output = cols.map((x) => ({
              id: x.id,
              title: x.title,
              cards: x.cards.map((x) => x.id)
            }))
            setColumnMap(output)*/
          }}
          template={[
            {
              id: 0,
              title: "Stories",
              numParents: 0
            },
            {
              id: 1,
              title: "Ready to be Done",
              status: "UNFINISHED"
            },
            {
              id: 2,
              title: "Doing",
              status: "IN PROGRESS"
            },
            {
              id: 3,
              title: "Done",
              status: "COMPLETE"
            }
          ]}
          selfish={selfish}
          graph={{nodes: props.editor.nodes, links: props.editor.links}} />
      )
    }

    const renderList = () => {
      let rootNodes = props.editor.nodes.filter((x : any) => props.editor.links.filter((a : any) => a.target == x.id).length == 0)
//      let rootNodes = links.filter((a) => a.source == 'root').map((x) => nodes.filter((a) =>  a.id == x.target)[0])

      return (
        <PlanTree 
          onAdd={addChild}
          onEdit={editChild}
          title={props.project.name}
          graph={props.editor}
          />
      )
    }

    const renderHive = () => {
      return (
        <div className="plan-hive">
        <NodePanel />
        <Editor />
        </div>
      )
    }


    const renderPlan = () => {
      let view = query.view || 'kanban'
      switch(view){
        case 'kanban':
          return renderKanban()
        case 'list':
          return renderList()
        case 'hive':
          return renderHive()
        default:
          return
      }
    }

    const setView = (view : any) => {
      if(!query) query = {};
      query.view = view;
      props.history.push(`${props.location.pathname}?${qs.stringify(query)}`)
    }

    let view = query.view || 'kanban';

    return (
 
        <div style={{padding: 4, display: 'flex', flex: 1, position: 'relative', flexDirection: 'column', width: 'calc(100% - 8px)'}}>
 
            <div className="plan-header">
              <div style={{marginLeft: 12}}>
                <FormControlLabel
                  control={<Switch checked={selfish} onChange={(e) => setSelfish(e.target.checked)} />}
                  label="My tasks" />
              </div>
              <ButtonGroup className="plan-actions">
                <Button className={`${view === 'kanban' && 'contained'}`} onClick={() => setView('kanban')}><DashboardIcon /></Button>
                <Button className={`${view === 'list' && 'contained'}`} onClick={() => setView('list')}><ListIcon /></Button>
                <Button className={`${view === 'hive' && 'contained'}`} onClick={() => setView('hive')}><EmojiNature /></Button>
              </ButtonGroup>
            </div>
            <Divider />
            <div className="plan-container">
            {renderPlan()}
            </div>
        </div>
    )
}

export default withEditor(connect((state : any) => ({
  user: jwt_decode(state.auth.token)
}), (dispatch : any) => ({
  setStatus: (status : any) => dispatch(setStatus(status))
}))(PlanTab))
