import React from 'react'
import {
    Paper,
    Typography,
    Divider
} from '@material-ui/core';

import {
    KeyboardDatePicker
} from '@material-ui/pickers'

import {HiveProvider} from 'react-hive-flow'
import * as ProjectItemNode from '../../nodes/ProjectItemNode';
import { isArray, merge, mergeWith } from 'lodash';
import { Switch, Route } from 'react-router-dom';
import { YContext } from '../../graph/yjs';
import DashboardHeader from '../../components/dashboard-header';
import ProjectTabs from '../../tabs/project'
import PlanDialog from '../../components/dialogs/plan-dialog';

import { connect } from 'react-redux';
import './index.css';


function ProjectView(props){
    const {ydoc} = React.useContext(YContext)

    const [ project, setProject ] = React.useState({});
    const [ selectedTab, setSelectedTab ] = React.useState(null)

    const [ projectDoc, setDoc ] = React.useState(null)

    const [ selectedCard, setSelectedCard ] = React.useState(null)

    const [ nodes, setNodes ] = React.useState([])
    const [ links, setLinks ] = React.useState([])
    const [ attachments, setAttachments ] = React.useState([])

    const observer = () => {
        if(projectDoc){
          let obj = projectDoc.toJSON()
          console.log("OBSERVE", obj)
          if(obj.nodes != null){
            setNodes(obj.nodes.map((x) => Object.assign({}, x)))
          }
          if(obj.links != null) {
            setLinks(obj.links.map((x) => Object.assign({}, x)))
          }
          if(obj.attachments != null){
            setAttachments(obj.attachments.map((x) => Object.assign({}, x)))
          }
        }
      }
  

    React.useEffect(() => {
        if(props.project && props.project.length > 0){
            if(projectDoc) projectDoc.unobserve(observer)

            let project = props.project[0];
            let doc = ydoc.getMap(`plan-${project.id}`)
            doc.observe(observer)
            setDoc(doc)
            setProject(props.project[0])

            let obj = doc.toJSON();
            if(obj.nodes != null) setNodes(obj.nodes)
            if(obj.links != null) setLinks(obj.links)
            if(obj.attachments != null) setAttachments(obj.attachments)
        }
    }, [props.project])

    const _setNodes = (nodes) => {
        if(projectDoc){
            projectDoc.set('nodes', nodes)
        }
        setNodes(nodes)
    }

    const _setLinks = (links) => {
        if(projectDoc){
            projectDoc.set('links', links)
        }
        setLinks(links)
    }

    const _setAttachments = (attachments) => {
        if(projectDoc){
            projectDoc.set('attachments', attachments)
        }
        setAttachments(attachments)
    }


    const tabs = ["Plan", "Calendar", "Team", "Files", "Settings"]

    return (
        <HiveProvider store={{
            nodes: nodes,
            links: links.filter((a) => a.target),
            nodeTypes: [ProjectItemNode],
            attachments: attachments,
            attachFile: (name, cid) => {
              _setAttachments([...new Set(attachments.concat([{name, cid}]))])
            },
            explore: (node) => {
              setSelectedCard(node)
            },
            exploreNode: (id) => {
              let node = nodes.filter((a) => a.id == id)[0]
              setSelectedCard({
                id: id,
                title: node.data.label,
                description: node.data.description,
                dueDate: node.data.dueDate,
                members: node.members,
                attachments: node.data.attachments
              })
            },
            onNodeAdd: (node) => _setNodes(nodes.concat(node)),
            onLinkAdd: (link) => _setLinks(links.concat(link)),
            onLinkRemove: (_links) => {
              _setLinks(links.filter((a) => _links.map((x) => x.id).indexOf(a.id) < 0))
            },
            onNodeRemove: (_nodes) => {
              _setNodes(nodes.filter((a) => _nodes.map((x) => x.id).indexOf(a.id) < 0))
            },
            onNodeUpdate: (id, node) => {
              console.log("NODE UPDATE")
              let ix = nodes.map((x) => x.id).indexOf(id)
              let n = nodes.slice()

              console.log(node)
              function customizer(objValue, srcValue) {
                console.debug("CUSTOMIZER", objValue, srcValue)
                if (Array.isArray(objValue)) {
                  return srcValue
                }
              }

              n[ix] = mergeWith(n[ix], node, customizer)

              console.log(n[ix])
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
            {(editor) => (
              <>
            <PlanDialog 
              project={props.project}
              onDelete={(plan) => {
                editor.onNodeRemove([{id: plan}])
              }}
              onSave={(plan) => {
                console.log(plan)
                editor.updateNode(plan.id, (node) => {
                    let update = {data: {}}

                    if(plan.title) update.data.label = plan.title;
                    if(plan.description) update.data.description = plan.description;
                    if(plan.dueDate) update.data.dueDate = plan.dueDate;
                    console.log(plan.members)
                    if(plan.members) update.members  = plan.members

                    console.log(update, plan.id)
                    return update;
                })
                setSelectedCard(null)

              }}
              open={selectedCard} 
              plan={selectedCard ? Object.assign({}, nodes.filter((a) => a.id == selectedCard.id)[0]) : {}} 
              onClose={() => setSelectedCard(null)}/>
        <DashboardHeader 
            tabs={tabs}
            onTabSelect={(tab) => {
                setSelectedTab(tab)
                props.history.push(`${props.match.url}/${tab.toLowerCase()}`)
            }}
            selectedTab={selectedTab || props.location.pathname.replace(`${props.match.url}/`, '')}
            title={project.name} />
        <Paper style={{flex: 1, width: '100%', height: 'calc(100vh - 76px)', marginTop: 12, display: 'flex'}}>
            <Switch>
                <Route path={`${props.match.url}/plan`} render={(props) => {
                    return <ProjectTabs.PlanTab {...props} y={projectDoc} project={project} />
                }} />
                <Route path={`${props.match.url}/calendar`} render={(props) => {
                    return <ProjectTabs.CalendarTab {...props} y={props.y} project={project} />
                }} />
                <Route path={`${props.match.url}/team`} render={(props) => {
                    return <ProjectTabs.TeamTab {...props} project={project} />
                }} />
                <Route path={`${props.match.url}/files`} render={(props) => {
                    return <ProjectTabs.FileTab {...props} y={projectDoc} project={project} />
                }} />
                <Route path={`${props.match.url}/settings`} render={(props) => {
                  return <ProjectTabs.SettingsTab {...props} project={project} />
                }} />

            </Switch>
        </Paper>
        </>
        )}
        </HiveProvider>

    )
}

export default connect((state, ownProps) => ({
    project: state.projects.list.filter((a) => a.id == ownProps.match.params.id)
}))(ProjectView)