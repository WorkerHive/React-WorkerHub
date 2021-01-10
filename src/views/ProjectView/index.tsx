import React from 'react'
import {
  Paper,
} from '@material-ui/core';


import { HiveProvider, withEditor } from '@workerhive/hive-flow'
import * as ProjectItemNode from '../../nodes/ProjectItemNode';
import { isArray, merge, mergeWith } from 'lodash';
import { Switch, Route } from 'react-router-dom';
import { YContext } from '../../graph/yjs';
import * as ProjectTabs from '../../tabs/project'
import * as Y from 'yjs';
import { Header } from '@workerhive/react-ui'

import { connect } from 'react-redux';
import './index.css';
import { PlanTab } from '../../tabs/project';

const PlanDialog = require('../../components/dialogs/plan-dialog')

export interface ProjectViewProps {
  history: any;
  location: any;
  match: any;
  project: any;
}


const ProjectView: React.FC<ProjectViewProps> = (props) => {
  const { ydoc } = React.useContext(YContext)

  const [project, setProject] = React.useState<any>({});
  const [selectedTab, setSelectedTab] = React.useState(null)

  const [projectDoc, setDoc] = React.useState<Y.Map<any>>()

  const [selectedCard, setSelectedCard] = React.useState<any>(null)

  const [nodes, setNodes] = React.useState<Array<any>>([])
  const [links, setLinks] = React.useState<Array<any>>([])
  const [attachments, setAttachments] = React.useState<Array<any>>([])

  const View = withEditor(({editor}) => (
        <>
          <PlanDialog
            project={props.project}
            onDelete={(plan: any) => {
              editor.onNodeRemove([{ id: plan }])
            }}
            onSave={(plan: any) => {
              console.log(plan)
              editor.updateNode(plan.id, (node: any) => {
                let update: any = { data: {} }

                if (plan.title) update.data.label = plan.title;
                if (plan.description) update.data.description = plan.description;
                if (plan.dueDate) update.data.dueDate = plan.dueDate;
                console.log(plan.members)
                if (plan.members) update.members = plan.members

                console.log(update, plan.id)
                return update;
              })
              setSelectedCard(null)

            }}
            open={selectedCard}
            plan={selectedCard ? Object.assign({}, nodes.filter((a) => a.id === selectedCard.id)[0]) : {}}
            onClose={() => setSelectedCard(null)} />
        
          
        </>))

  const observer = () => {
    if (projectDoc) {
      let obj = projectDoc.toJSON()
      console.log("OBSERVE", obj)
      if (obj.nodes != null) {
        setNodes(obj.nodes.map((x: any) => Object.assign({}, x)))
      }
      if (obj.links != null) {
        setLinks(obj.links.map((x: any) => Object.assign({}, x)))
      }
      if (obj.attachments != null) {
        setAttachments(obj.attachments.map((x: any) => Object.assign({}, x)))
      }
    }
  }


  React.useEffect(() => {
    if (props.project && props.project.length > 0) {
      if (projectDoc) projectDoc.unobserve(observer)

      let project = props.project[0];
      let doc = ydoc.getMap(`plan-${project.id}`)
      doc.observe(observer)
      setDoc(doc)
      setProject(props.project[0])

      let obj = doc.toJSON();
      if (obj.nodes != null) setNodes(obj.nodes)
      if (obj.links != null) setLinks(obj.links)
      if (obj.attachments != null) setAttachments(obj.attachments)
    }
  }, [props.project])

  const _setNodes = (nodes: Array<any>) => {
    if (projectDoc) {
      projectDoc.set('nodes', nodes)
    }
    setNodes(nodes)
  }

  const _setLinks = (links: Array<any>) => {
    if (projectDoc) {
      projectDoc.set('links', links)
    }
    setLinks(links)
  }

  const _setAttachments = (attachments: Array<any>) => {
    if (projectDoc) {
      projectDoc.set('attachments', attachments)
    }
    setAttachments(attachments)
  }



  return (
    <HiveProvider store={{
      nodes: nodes,
      links: links.filter((a) => a.source && a.target),
      attachFile: (name: string, cid: string) => {
        _setAttachments([...new Set(attachments.concat([{ name, cid }]))])
      },
      explore: (node: any) => {
        setSelectedCard(node)
      },
      exploreNode: (id: string) => {
        let node = nodes.filter((a) => a.id === id)[0]
        setSelectedCard({
          id: id,
          title: node.data.label,
          description: node.data.description,
          dueDate: node.data.dueDate,
          members: node.members,
          attachments: node.data.attachments
        })
      },
      onNodeAdd: (node: any) => _setNodes(nodes.concat(node)),
      onLinkAdd: (link: any) => _setLinks(links.concat(link)),
      onLinkRemove: (_links: any) => {
        _setLinks(links.filter((a) => _links.map((x: any) => x.id).indexOf(a.id) < 0))
      },
      onNodeRemove: (_nodes: any) => {
        _setNodes(nodes.filter((a) => _nodes.map((x: any) => x.id).indexOf(a.id) < 0))
      },
      onNodeUpdate: (id: string, node: any) => {
        console.log("NODE UPDATE")
        let ix = nodes.map((x) => x.id).indexOf(id)
        let n = nodes.slice()

        console.log(node)
        function customizer(objValue: any, srcValue: any) {
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
      onNodeChange: (nodes: any) => _setNodes(nodes),
      onLinkChange: (links: any) => _setLinks(links)
    }}>
        <Header
            tabs={["Plan", "Calendar", "Team", "Files", "Settings"]}
            onTabSelect={(tab: any) => {
              setSelectedTab(tab)
              props.history.push(`${props.match.url}/${tab.toLowerCase()}`)
            }}
            selectedTab={selectedTab || props.location.pathname.replace(`${props.match.url}/`, '')}
            title={project.name} />
      <Paper style={{ flex: 1, width: '100%', height: 'calc(100vh - 76px)', marginTop: 12, display: 'flex' }}>
            <Switch>
              <Route path={`${props.match.url}/plan`} render={(props) => {
                return <PlanTab project={project} {...props} />
              }} />
              <Route path={`${props.match.url}/calendar`} render={(props) => {
                return <ProjectTabs.CalendarTab {...props} project={project} />
              }} />
              <Route path={`${props.match.url}/team`} render={(props) => {
                return <ProjectTabs.TeamTab {...props} />
              }} />
              <Route path={`${props.match.url}/files`} render={(props) => {
                return <ProjectTabs.FileTab {...props} y={projectDoc} project={project} />
              }} />
              <Route path={`${props.match.url}/settings`} render={(props) => {
                return <ProjectTabs.SettingsTab {...props} />
              }} />

            </Switch>
        </Paper>
    </HiveProvider>

  )
}

export default connect((state: any, ownProps: any) => ({
  project: state.projects.list.filter((a: any) => a.id === ownProps.match.params.id)
}))(ProjectView)