import React from 'react';

import { cloneDeep } from 'lodash';
import * as TypeDefNode from '../../nodes/TypeDefNode'
import * as MSSQLNode from '../../nodes/MSSQLNode';
import * as MSSQLServer from '../../nodes/MSSQLServerNode';
import * as MongoServer from '../../nodes/MongoDBServerNode';

import { getTypes, getIntegrationMap, updateIntegrationMap } from '../../actions/adminActions'
import { connect } from 'react-redux';
import { Editor, HiveProvider, NodePanel } from '@workerhive/hive-flow';
import '@workerhive/hive-flow/dist/index.css';
import './index.css'
import { IconButton } from '@material-ui/core'
import { ArrowBack } from '@material-ui/icons';

export interface AdminProps {
    getTypes: Function;
    stores: any;
    types: any;
    history: any;

}

const Admin: React.FC<AdminProps> = (props) => {

    React.useEffect(() => {
        props.getTypes()

    }, [])

    const [nodes, setNodes] = React.useState<Array<any>>([])
    const [links, setLinks] = React.useState<Array<any>>([])

    React.useEffect(() => {
        getIntegrationMap().then((integrations: any) => {
            if (integrations) {
                if (integrations.nodes) setNodes(integrations.nodes.map((x: any) => {
                    let y = cloneDeep(x)
                    delete y.__typename;
                    if (y.position) delete y.position.__typename;
                    return y;
                }).slice());
                if (integrations.links) setLinks(integrations.links.map((x: any) => {
                    let y = cloneDeep(x)
                    delete y.__typename;
                    return y;
                }).slice());
            }
        })
    }, [])


    const updateNodes = (nodes: any) => {
        updateIntegrationMap(nodes, links)
        setNodes(nodes)
    }

    const updateLinks = (links: any) => {
        updateIntegrationMap(nodes, links)
        setLinks(links)
    }

    console.log(links);

    return (
        <div className="admin-view">
            <IconButton onClick={() => props.history.push('/dashboard/settings')} style={{ position: 'absolute', left: 12, top: 12, zIndex: 9 }}>
                <ArrowBack />
            </IconButton>
            <HiveProvider store={{
                nodes: (props.types || []).concat(props.stores || []).concat(nodes).filter((a) => a.position),
                links: links.filter((a) => a.source && a.target),
                statusColors: {
                    'typedef': 'green',
                    'adapter': 'yellow',
                    'datasource': 'orange'
                },
                exploreNode: () => { },
                onNodeAdd: (node: any) => {
                    node.data.status = 'adapter';
                    let n = nodes.concat([node])
                    updateNodes(n)
                },
                onLinkAdd: (link: any) => {
                    let l = links.concat([link])
                    updateIntegrationMap(nodes, l)
                    updateLinks(l)
                },
                onNodeUpdate: (id: any, node: any) => {
                    let n = nodes.slice()
                    let ix = n.map((x: any) => x.id).indexOf(id);
                    n[ix] = {
                        ...n[ix],
                        ...node
                    }
                    updateNodes(n)
                },
                onNodeRemove: (node: any) => {
                    let n = nodes.slice().filter((a: any) => node.map((x: any) => x.id).indexOf(a.id) < 0);
                    updateNodes(n)
                    console.log(node)
                },
                onLinkRemove: (link: any) => {
                    let l = links.slice().filter((a: any) => link.map((x: any) => x.id).indexOf(a.id) < 0);
                    updateLinks(l);
                },
                nodeTypes: [MongoServer, TypeDefNode, MSSQLNode, MSSQLServer]
            }}>
        
                    <NodePanel />
                    <Editor />
            
            </HiveProvider>

        </div>
    )
}

export default connect(
    (state: any) => ({
        stores: (state.admin.stores || []).map((x: any, ix: number) => ({
            id: x.id,
            type: `${x.type.id} server`,
            data: {
                label: x.name,
                status: 'DataSource'
            },
            position: {
                x: 300 + (ix * 200),
                y: 700
            }
        })),
        types: (state.dashboard.types || []).map((x: any, ix: number) => ({
            id: x.name.toLowerCase(),
            type: 'typeDef',
            data: {
                label: x.name,
                typedef: x.typeDef,
                status: 'TypeDef',

            },
            status: 'TypeDef',
            position: {
                x: 200 + (ix * 200),
                y: 300
            },
            draggable: false
        }))
    }),
    (dispatch: any) => ({
        getTypes: () => dispatch(getTypes())
    })
)(Admin)