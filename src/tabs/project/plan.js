import React from 'react';
import PropTypes from 'prop-types';

import { fade, makeStyles, withStyles } from '@material-ui/core/styles';

import {
    Add,
    Dashboard as DashboardIcon,
    List as ListIcon,
    EmojiNature,
    Edit
} from '@material-ui/icons';

import {
    IconButton,
    SvgIcon,
    Collapse,
    ButtonGroup,
    Divider,
    Button,
    Switch,
    FormControlLabel
} from "@material-ui/core"


import HiveEditor, {HiveProvider, withEditor, NodePanel} from 'react-hive-flow'
import GraphKanban from '../../components/graph-kanban';

import PlanTree from '../../components/plan/tree';

import { merge } from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import { useSpring, animated } from 'react-spring/web.cjs';
import { setStatus } from '../../actions/authActions';
import { connect } from 'react-redux';
import {YContext} from '../../graph/yjs';
import qs from 'qs';
import jwt_decode from 'jwt-decode';
import './plan.css';

let yDoc;

function PlanTab(props){

  const [ selfish, setSelfish ] = React.useState(false);

  const {ydoc} = React.useContext(YContext)

  const [ selectedCard , setSelectedCard ] = React.useState(null)
  let query = qs.parse(window.location.search, {ignoreQueryPrefix: true})
  const [ selectedView, _setView ] = React.useState('list')

   


    const [ docProject, setProject ] = React.useState({})
    const [ doc, setDoc ] = React.useState(null)
    


    const [ columnMap, setColumnMap ] = React.useState([])

    const renderKanban = () => {
      return (
        <GraphKanban 
          onClick={(card) => {
            props.editor.exploreNode(card.id)
          }}
          onStatusChange={(card, status) => {
            props.editor.updateNode(card.id, (node) => {
              return {data: {
                status: status
              }}
            })
          }}
          onChange={(cols) => {
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
              title: "Blocked",
              status: "BLOCKED"
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
          map={columnMap}
          selfish={selfish}
          graph={{nodes: props.editor.nodes, links: props.editor.links}} />
      )
    }

    const renderList = () => {
      let rootNodes = props.editor.nodes.filter((x) => props.editor.links.filter((a) => a.target == x.id).length == 0)
//      let rootNodes = links.filter((a) => a.source == 'root').map((x) => nodes.filter((a) =>  a.id == x.target)[0])

      return (
        <PlanTree 
          title={props.project.name}
          graph={props.editor}/>
      )
    }

    const renderHive = () => {
      return (
        <div className="plan-hive">
        <NodePanel />
        <HiveEditor />
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

    const setView = (view) => {
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
                <Button className={view == 'kanban' && 'contained'} onClick={() => setView('kanban')}><DashboardIcon /></Button>
                <Button className={view == 'list' && 'contained'} onClick={() => setView('list')}><ListIcon /></Button>
                <Button className={view == 'hive' && 'contained'} onClick={() => setView('hive')}><EmojiNature /></Button>
              </ButtonGroup>
            </div>
            <Divider />
            <div className="plan-container">
            {renderPlan()}
            </div>
        </div>
            )
}

export default connect((state) => ({
  user: jwt_decode(state.auth.token)
}), (dispatch) => ({
  setStatus: (status) => dispatch(setStatus(status))
}))(withEditor(PlanTab))
