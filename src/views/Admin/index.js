import React from 'react';

import { cloneDeep } from 'lodash';
import * as TypeDefNode from '../../nodes/TypeDefNode'
import * as MSSQLNode from '../../nodes/MSSQLNode';
import * as MSSQLServer from '../../nodes/MSSQLServerNode';
import * as MongoServer from '../../nodes/MongoDBServerNode';

import { useMutation } from '@apollo/client';
import { getTypes, getIntegrationMap, updateIntegrationMap} from '../../actions/adminActions'
import { connect } from 'react-redux';
import HiveEditor, { HiveProvider, NodePanel } from 'react-hive-flow';
import 'react-hive-flow/dist/index.css';
import './index.css'
import { IconButton } from '@material-ui/core'
import { ArrowBack } from '@material-ui/icons';

function Admin(props){

    React.useEffect(() => {
        props.getTypes()
        
    }, [])

       
    const [ nodes, setNodes ] = React.useState([])
    const [ links, setLinks ] = React.useState([])

    React.useEffect(() => {
        getIntegrationMap().then((integrations) => {
            if(integrations.nodes) setNodes(integrations.nodes.map((x) => {
                let y = cloneDeep(x)
                delete y.__typename;
                delete y.position.__typename;
                return y;
            }).slice());
            if(integrations.links) setLinks(integrations.links.map((x) => {
                let y = cloneDeep(x)
                delete y.__typename;
                return y;
            }).slice());
        })
    }, [])


    const updateNodes = (nodes) => {
        updateIntegrationMap(nodes, links)
        setNodes(nodes)
    }

    const updateLinks = (links) => {
        updateIntegrationMap(nodes, links)
        setLinks(links)
    }

    console.log(props.stores);

    return (
        <div className="admin-view">
        <IconButton onClick={() => props.history.push('/dashboard/settings')} style={{position: 'absolute', left: 12, top: 12, zIndex: 9}}>
            <ArrowBack />
        </IconButton>
        <HiveProvider store={{
            nodes: (props.types || []).concat(props.stores || []).concat(nodes),
            links: links,
            statusColors: {
                'typedef': 'green',
                'adapter': 'yellow',
                'datasource': 'orange'
            },
            exploreNode: () => {},
            onNodeAdd: (node) => {
                node.data.status = 'adapter';
                let n = nodes.concat([node])
                updateNodes(n)
            },
            onLinkAdd: (link) => {
                let l = links.concat([link])
                updateIntegrationMap(nodes, l)
                updateLinks(l)
            },
            onNodeUpdate: (id, node) => {
                let n = nodes.slice()
                let ix = n.map((x) => x.id).indexOf(id);
                n[ix] = {
                    ...n[ix], 
                    ...node
                }
                updateNodes(n)
            },
            onNodeRemove: (node) => {
                let n = nodes.slice().filter((a) => node.map((x) => x.id).indexOf(a.id) < 0);
                updateNodes(n)
                console.log(node)
            },
            onLinkRemove: (link) => {
                let l = links.slice().filter((a) => link.map((x) => x.id).indexOf(a.id) < 0);
                updateLinks(l);
            },
            nodeTypes: [MongoServer, TypeDefNode, MSSQLNode, MSSQLServer]
        }}>
            {(editor) => [
            <NodePanel />,
            <HiveEditor   />
            ]}

      
        </HiveProvider>
       
        </div>
    )
}

export default connect(
    (state) => ({
        stores: state.admin.stores.map((x, ix) => ({
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
        types: (state.dashboard.types||[]).map((x, ix) => ({
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
    (dispatch) => ({
        getTypes: () => dispatch(getTypes())
    })
)(Admin)