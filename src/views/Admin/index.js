import React from 'react';

import { cloneDeep } from 'lodash';
import * as TypeDefNode from '../../nodes/TypeDefNode'
import * as MSSQLNode from '../../nodes/MSSQLNode';
import * as MSSQLServer from '../../nodes/MSSQLServerNode';

import { useMutation } from '@apollo/client';
import { getTypes, getIntegrationMap, UPDATE_INTEGRATION_MAP} from '../../actions/adminActions'
import { connect } from 'react-redux';
import HiveEditor, { HiveProvider, NodePanel } from 'react-hive-flow';
import 'react-hive-flow/dist/index.css';
import './index.css'

function Admin(props){

    React.useEffect(() => {
        props.getTypes()
        
    }, [])


    const [ updateIntegrationMap, {data}] = useMutation(UPDATE_INTEGRATION_MAP)
       
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

    return (
        <div className="admin-view">
        <HiveProvider store={{
            nodes: (props.types || []).concat(nodes),
            links: links,
            statusColors: {

            },
            exploreNode: () => {},
            onNodeAdd: () => {},
            onLinkAdd: () => {},
            onNodeUpdate: () => {},
            onNodeRemove: () => {},
            onLinkRemove: () => {},
            nodeTypes: [TypeDefNode, MSSQLNode, MSSQLServer]
        }}>
            {(editor) => [
            <NodePanel />,
            <HiveEditor      onNodeChange={(nodes) => {
                let n = nodes.filter((a) => props.types.map((x) => x.id).indexOf(a.id) < 0)
                updateIntegrationMap({variables: {
                    nodes: n,
                    links: links
                }})
                setNodes(n)
            }}
            onLinkChange={(link) => {
                updateIntegrationMap({variables: {
                    nodes: nodes,
                    links: link
                }})
                setLinks(link)
            }} />
            ]}

      
        </HiveProvider>
       
        </div>
    )
}

export default connect(
    (state) => ({
        types: (state.dashboard.types||[]).map((x, ix) => ({
            id: x.name.toLowerCase(),
            type: 'typeDef',
            data: {
                label: x.name,
                typedef: x.typeDef
            },
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