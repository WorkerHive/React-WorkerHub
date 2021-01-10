import React from 'react';

import {
    TreeView,
    TreeItem,
} from '@material-ui/lab'


import {
  ArrowDropDown,
  ArrowRight
} from '@material-ui/icons'

import Branch from './branch';

export interface PlanTreeProps {
  title: string;
  onAdd: Function;
  onEdit: Function;
  graph: any;
}

export const PlanTree : React.FC<PlanTreeProps> = (props ) => {
  const [ expanded, setExpanded ] = React.useState(['root'])

  const { nodes, links } = props.graph || {nodes: [], links: []};

  const rootNodes = nodes.filter((x) => links.filter((a) => a.target == x.id).length == 0)




    const renderBranch = (branch) => {
      let _links = links.filter((a) => a.source == branch.id)
      let _children = _links.map((x) => nodes.filter((a) => a.id == x.target)[0]) || []
      
      let _branches = _children.map((x) => renderBranch(x))

      let count = _branches.map((x) => x.children.length + x.total).concat([0]).reduce((a,b) => a+b)
      let completeCount = _branches.map((x) => x.complete.length + x.completed).concat([0]).reduce((a, b) => a+b)
      console.log(count)
      //let totalChildren = _children.length + _branches.reduce((a, b) => a.children.length + b.children.length)

      return {
        branch: (
          <Branch 
            onEdit={() => props.onEdit(branch)}
            onAdd={() => props.onAdd(branch)}
            childs={_children}
            total={completeCount + "/" + (_children.length + count)}
            nodeId={branch.id} 
            data={branch.data}>
            {_branches.map((x) => x.branch)}
          </Branch>
        ),
        childs: _children,
        complete: _children.filter((a) => a.data.status == "COMPLETE"),
        completed: completeCount,
        total: count
      }
      
    }

    const branches = rootNodes.map((x) => renderBranch(x))

    const total = branches.map((x) => x.childs.length + x.total).concat([0]).reduce((a,b) => a+b)

    return (
        <TreeView
          multiSelect
          expanded={expanded}
          defaultCollapseIcon={<ArrowDropDown />}
          defaultExpandIcon={<ArrowRight />}
          onNodeToggle={(event, newExpanded) => {
            console.log(event, newExpanded)
            setExpanded(newExpanded)
          }}>
          <Branch 
            onAdd={() => props.onAdd()}
            total={total}
            childs={branches}
            nodeId="root" 
            data={{label: props.title}}> 
            {branches.map((x) => x.branch)}
          </Branch> 
        </TreeView>
    )
}

/*

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
  });*/