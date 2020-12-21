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
    Button
} from "@material-ui/core"


import HiveEditor, {HiveProvider, withEditor, NodePanel} from 'react-hive-flow'
import GraphKanban from '../../components/graph-kanban';

import { merge } from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import { useSpring, animated } from 'react-spring/web.cjs';
import { setStatus } from '../../actions/authActions';
import { connect } from 'react-redux';
import {YContext} from '../../graph/yjs';
import qs from 'qs';
import './plan.css';

let yDoc;

function PlanTab(props){
  const {ydoc} = React.useContext(YContext)

  const [ selectedCard , setSelectedCard ] = React.useState(null)
  let query = qs.parse(window.location.search, {ignoreQueryPrefix: true})
  const [ selectedView, _setView ] = React.useState('list')

   

    const [ expanded, setExpanded ] = React.useState(['root'])

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
          graph={{nodes: props.editor.nodes, links: props.editor.links}} />
      )
    }

    const renderList = () => {
      let rootNodes = props.editor.nodes.filter((x) => props.editor.links.filter((a) => a.target == x.id).length == 0)
//      let rootNodes = links.filter((a) => a.source == 'root').map((x) => nodes.filter((a) =>  a.id == x.target)[0])

      return (
        <div />
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
              <div>
      
              </div>
              <ButtonGroup>
                <Button variant={view == 'kanban' && 'contained'} onClick={() => setView('kanban')}><DashboardIcon /></Button>
                <Button variant={view == 'list' && 'contained'} onClick={() => setView('list')}><ListIcon /></Button>
                <Button variant={view == 'hive' && 'contained'} onClick={() => setView('hive')}><EmojiNature /></Button>
              </ButtonGroup>
            </div>
            <Divider />
            <div className="plan-container">
            {renderPlan()}
            </div>
        </div>
            )
}

export default connect(null, (dispatch) => ({
  setStatus: (status) => dispatch(setStatus(status))
}))(withEditor(PlanTab))

function MinusSquare(props) {
    return (
      <SvgIcon fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
        {/* tslint:disable-next-line: max-line-length */}
        <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 11.023h-11.826q-.375 0-.669.281t-.294.682v0q0 .401.294 .682t.669.281h11.826q.375 0 .669-.281t.294-.682v0q0-.401-.294-.682t-.669-.281z" />
      </SvgIcon>
    );
  }
  
  function PlusSquare(props) {
    return (
      <SvgIcon fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
        {/* tslint:disable-next-line: max-line-length */}
        <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 12.977h-4.923v4.896q0 .401-.281.682t-.682.281v0q-.375 0-.669-.281t-.294-.682v-4.896h-4.923q-.401 0-.682-.294t-.281-.669v0q0-.401.281-.682t.682-.281h4.923v-4.896q0-.401.294-.682t.669-.281v0q.401 0 .682.281t.281.682v4.896h4.923q.401 0 .682.281t.281.682v0q0 .375-.281.669t-.682.294z" />
      </SvgIcon>
    );
  }
  
  function CloseSquare(props) {
    return (
      <SvgIcon className="close" fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
        {/* tslint:disable-next-line: max-line-length */}
        <path d="M17.485 17.512q-.281.281-.682.281t-.696-.268l-4.12-4.147-4.12 4.147q-.294.268-.696.268t-.682-.281-.281-.682.294-.669l4.12-4.147-4.12-4.147q-.294-.268-.294-.669t.281-.682.682-.281.696 .268l4.12 4.147 4.12-4.147q.294-.268.696-.268t.682.281 .281.669-.294.682l-4.12 4.147 4.12 4.147q.294.268 .294.669t-.281.682zM22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0z" />
      </SvgIcon>
    );
  }


function TransitionComponent(props) {
    const style = useSpring({
      from: { opacity: 0, transform: 'translate3d(20px,0,0)' },
      to: { opacity: props.in ? 1 : 0, transform: `translate3d(${props.in ? 0 : 20}px,0,0)` },
    });
  
    return (
      <animated.div style={style}>
        <Collapse {...props} />
      </animated.div>
    );
  }
  
  TransitionComponent.propTypes = {
    /**
     * Show the component; triggers the enter or exit states
     */
    in: PropTypes.bool,
  };
  
  