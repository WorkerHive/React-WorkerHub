import React from 'react';
import PropTypes from 'prop-types';

import { fade, makeStyles, withStyles } from '@material-ui/core/styles';

import {
    Add,
    Dashboard as DashboardIcon,
    List as ListIcon,
    EmojiNature
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

import HiveEditor from 'react-hive-flow'
import GraphKanban from '../../components/graph-kanban';

import { v4 as uuidv4 } from 'uuid';
import { useSpring, animated } from 'react-spring/web.cjs';
import './plan.css';

export default function PlanTab(props){
  const [ selectedView, setView ] = React.useState('list')

    const [ nodes, setNodes ] = React.useState([])
    const [ links, setLinks ] = React.useState([])

    const [ expanded, setExpanded ] = React.useState(['root'])

    
    const renderTree = (tree_branch) => {
        if(tree_branch){
            let _links = links.filter((a) => a.source == tree_branch.id)
            let _children = _links.map((x) => nodes.filter((a) => a.id == x.target)[0])

            let item = (
                <StyledTreeItem addChild={() => {
                    let n = addNode({
                        name: 'test'
                    })
                    addLink({target: n.id, source: tree_branch.id})
        
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
        n.push(node)
        setNodes(n)
        return node;
    }

    const addLink = (link) => {
        let l = links.slice();
        link.id = uuidv4()
        l.push(link);
        setLinks(l)
        return link;
    }


    const renderKanban = () => {
      return (
        <GraphKanban graph={{nodes: nodes}} />
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
         <StyledTreeItem addChild={() => {
            let n = addNode({
                name: ''
            })
            addLink({target: n.id, source: 'root'})
                        
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
      <HiveEditor
          nodes={nodes}
          links={links}
          onNodeChange={(nodes) => setNodes(nodes)}
          onLinkChange={(links) => setLinks(links)} />
        </div>
      )
    }


    const renderPlan = () => {
      switch(selectedView){
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

    return (
        <div style={{padding: 4, display: 'flex', flex: 1, flexDirection: 'column'}}>
            <div className="plan-header">
              <div>

              </div>
              <ButtonGroup>
                <Button variant={selectedView == 'kanban' && 'contained'} onClick={() => setView('kanban')}><DashboardIcon /></Button>
                <Button variant={selectedView == 'list' && 'contained'} onClick={() => setView('list')}><ListIcon /></Button>
                <Button variant={selectedView == 'hive' && 'contained'} onClick={() => setView('hive')}><EmojiNature /></Button>
              </ButtonGroup>
            </div>
            <Divider />
            {renderPlan()}
        </div>
    )
}

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
            <IconButton onClick={(e) => {
                e.stopPropagation()
                props.addChild()
            }}>
                <Add />
            </IconButton>
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