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

export default function PlanTree(props){
  const [ expanded, setExpanded ] = React.useState(['root'])

  const { nodes, links } = props.graph || {};

  const rootNodes = nodes.filter((x) => links.filter((a) => a.target == x.id).length == 0)

  /*  const renderTree = (tree_branch) => {
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
                      dueDate: tree_branch.data.dueDate,
                      members: tree_branch.members,
                      attachments: tree_branch.attachments
                    })
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
                      members: [],
                      attachments: []
                    })
        
                }} nodeId={tree_branch.id} label={tree_branch && tree_branch.data && tree_branch.data.label}>
                    {(_children || []).map((x) => renderTree(x))}
                </StyledTreeItem>
            )
            return item;
        }
    }*/

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
            children={_children}
            total={completeCount + "/" + (_children.length + count)}
            nodeId={branch.id} 
            data={branch.data}>
            {_branches.map((x) => x.branch)}
          </Branch>
        ),
        children: _children,
        complete: _children.filter((a) => a.data.status == "COMPLETE"),
        completed: completeCount,
        total: count
      }
      
    }

    const branches = rootNodes.map((x) => renderBranch(x))

    const total = branches.map((x) => x.children.length + x.total).concat([0]).reduce((a,b) => a+b)

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
            total={total}
            children={branches}
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