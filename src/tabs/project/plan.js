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

import {
    TreeView,
    TreeItem,
} from '@material-ui/lab'

import PlanDialog from '../../components/plan-dialog';
import HiveEditor, {HiveProvider, NodePanel} from 'react-hive-flow'
import GraphKanban from '../../components/graph-kanban';

import { merge } from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import { useSpring, animated } from 'react-spring/web.cjs';
import { setStatus } from '../../actions/authActions';
import { connect } from 'react-redux';
import YActions from '../../graph/yjs';
import qs from 'qs';
import './plan.css';

let yDoc;

function PlanTab(props){
  const [ydoc] = React.useState(YActions(props.setStatus))

  const [ selectedCard , setSelectedCard ] = React.useState(null)
  let query = qs.parse(window.location.search, {ignoreQueryPrefix: true})
  const [ selectedView, _setView ] = React.useState('list')

    const [ nodes, setNodes ] = React.useState([])
    const [ links, setLinks ] = React.useState([])

    const [ expanded, setExpanded ] = React.useState(['root'])

    const [ docProject, setProject ] = React.useState({})
    const [ doc, setDoc ] = React.useState(null)
    
    const observer = () => {
      if(yDoc){
        let obj = yDoc.toJSON()
        console.log("OBSERVE", obj)
        if(obj.nodes != null){
          setNodes(obj.nodes.map((x) => Object.assign({}, x)))
        }
        if(obj.links != null) {
          setLinks(obj.links.map((x) => Object.assign({}, x)))
        }
      }
    }

    React.useEffect(() => {
      console.log("YDC", props)
      if(props.project && ydoc && props.project.id != docProject.id){
        if(doc) doc.unobserve(observer);

        console.log("Setting up YDOC")
        let _doc = ydoc.getMap(`plan-${props.project.id}`)
        yDoc = _doc;
        setDoc(_doc)
        _doc.observe(observer)

        setProject(props.project)
        
        let init = _doc.toJSON();

        if(init.nodes != null) setNodes(init.nodes)
        if(init.links != null) setLinks(init.links)
      }
    }, [props.project, doc])

    const _setNodes = (nodes) => {
      if(doc){
        doc.set('nodes', nodes)
      }
      setNodes(nodes)
    }

    const _setLinks = (links) => {
      if(doc){
        doc.set('links', links)
      }
      setLinks(links)
    }

    const renderTree = (tree_branch) => {
        if(tree_branch){
            let _links = links.filter((a) => a.source == tree_branch.id)
            let _children = _links.map((x) => nodes.filter((a) => a.id == x.target)[0])

            let parent_pos = nodes.filter((a) => a.id == tree_branch.id)[0].position

            let item = (
                <StyledTreeItem 
                  editChild={() => {
                    setSelectedCard({
                      id: tree_branch.id,
                      title: tree_branch.data.label,
                      description: tree_branch.data.description,
                      dueDate: tree_branch.dueDate,
                      members: tree_branch.members})
                  }}
                  addChild={() => {
                    let n = addNode({
                        type: 'baseNode',
                        data:{
                          label: ""
                        },
                        position: {
                          x: parent_pos.x,
                          y: parent_pos.y + 121
                        }
                    })
                    addLink({target: n.id, source: tree_branch.id})

                    setSelectedCard({
                      id: n.id,
                      title: "",
                      dueDate: null,
                      members: []
                    })
        
                }} nodeId={tree_branch.id} label={tree_branch && tree_branch.data && tree_branch.data.label}>
                    {(_children || []).map((x) => renderTree(x))}
                </StyledTreeItem>
            )
            return item;
        }
    }

    const addNode = (node) => {
        let n = nodes.slice();
        node.id = uuidv4()
        if(!node.data)node.data = {};
        if(!node.position)node.position = {x:300, y:300}
        n.push(node)
        _setNodes(n)
        return node;
    }

    const addLink = (link) => {
        let l = links.slice();
        link.id = uuidv4()
        l.push(link);
        _setLinks(l)
        return link;
    }

    const [ columnMap, setColumnMap ] = React.useState([])

    const renderKanban = () => {
      return (
        <GraphKanban 
          onClick={(card) => {
            setSelectedCard({
              id: card.id,
              title: card.title,
              dueDate: card.dueDate,
              members: card.members
            })
          }}
          onStatusChange={(card, status) => {
            let n = nodes.slice()
            let ix = n.map((x) => x.id).indexOf(card.id)
            n[ix].data.status = status;
            _setNodes(n)
           // console.log(card, status)
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
          graph={{nodes: nodes, links: links}} />
      )
    }

    const renderList = () => {
      let rootNodes = nodes.filter((x) => links.filter((a) => a.target == x.id).length == 0)
//      let rootNodes = links.filter((a) => a.source == 'root').map((x) => nodes.filter((a) =>  a.id == x.target)[0])

      return (
        <TreeView
        multiSelect
        defaultExpanded={['1']}
        expanded={expanded}
        onNodeToggle={(event, newExpanded) => {
            console.log(event, newExpanded)
            setExpanded(newExpanded)
        }}
        defaultCollapseIcon={<MinusSquare />}
        defaultExpandIcon={<PlusSquare />}
        defaultEndIcon={<CloseSquare />}>
         <StyledTreeItem 
          addChild={() => {
            let n = addNode({
                type: 'baseNode',
                data: {label: ''}
            })
            setSelectedCard({
              id: n.id,
              title: "",
              dueDate: null,
              members: []
            })
          //  addLink({target: n.id, source: 'root'})
                        
            console.log(nodes, links)
         }} nodeId="root" label={props.project.name}>
             {rootNodes.map((x) => renderTree(x))}
        </StyledTreeItem>
     </TreeView>
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
      <HiveProvider store={{
        nodes: nodes,
        links: links,
        onNodeAdd: (node) => _setNodes(nodes.concat(node)),
        onLinkAdd: (link) => _setLinks(links.concat(link)),
        onLinkRemove: (_links) => {
          _setLinks(links.filter((a) => _links.map((x) => x.id).indeOf(a.id) < 0))
        },
        onNodeRemove: (_nodes) => {
          _setNodes(nodes.filter((a) => _nodes.map((x) => x.id).indexOf(a.id) < 0))
        },
        onNodeUpdate: (id, node) => {
          let ix = nodes.map((x) => x.id).indexOf(id)
          let n = nodes.slice()
          n[ix] = merge(n[ix], node)
          _setNodes(n)
        },
        statusColors: {
          unfinished: 'orange',
          blocked: 'red',
          doing: '#d4faf4',
          complete: 'green',
  
        },
        onNodeChange: (nodes) => _setNodes(nodes),
        onLinkChange: (links) => _setLinks(links)
      }}>
        <div style={{padding: 4, display: 'flex', flex: 1, position: 'relative', flexDirection: 'column', width: 'calc(100% - 8px)'}}>
            <PlanDialog 
              onSave={(plan) => {
                console.log(plan)
                let n = nodes.slice()
                let ix = n.map((x) => x.id).indexOf(plan.id)
                let data = {}

                if(plan.title) data.label = plan.title;
                if(plan.description) data.description = plan.description
                if(plan.dueDate) data.dueDate = plan.dueDate;
                
                n[ix] = {
                  ...n[ix],
                  data: {
                    ...n[ix].data,
                    ...data
                  },
                  members: plan.members
                };
                _setNodes(n)
              }}
              open={selectedCard} 
              plan={selectedCard} 
              onClose={() => setSelectedCard(null)}/>
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
        </HiveProvider>
    )
}

export default connect(null, (dispatch) => ({
  setStatus: (status) => dispatch(setStatus(status))
}))(PlanTab)

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
  
  const StyledTreeItem = withStyles((theme) => ({
    iconContainer: {
      '& .close': {
        opacity: 0.3,
      },
    },
    group: {
      marginLeft: 7,
      paddingLeft: 18,
      borderLeft: `1px dashed ${fade(theme.palette.text.primary, 0.4)}`,
    },

  }))((props) => {
      return(
    <TreeItem {...props} label={(
        <div className="tree-item" style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
            {props.label}
            <div style={{display: 'flex'}}>
            <IconButton onClick={(e) => {
                e.stopPropagation();
                if(props.editChild) props.editChild()
            }}>
              <Edit />
            </IconButton>
            <IconButton onClick={(e) => {
                e.stopPropagation()
                props.addChild()
            }}>
                <Add />
            </IconButton>
            </div>
        </div>
    )} TransitionComponent={TransitionComponent}/>

  )});
  
  const useStyles = makeStyles({
    root: {
      height: 264,
      flexGrow: 1,
      maxWidth: 400,
    },
  });