import React, { Component } from 'react';

import { Editor, HiveProvider, NodePanel, useEditor, withEditor } from "@workerhive/hive-flow"
import '@workerhive/hive-flow/dist/index.css'
import './index.css';
import { useHub } from '@workerhive/client/dist/react';

import * as ExtStore from './nodes/ext-store';
import * as ExtAdapter from './nodes/ext-adapter';
import * as TypeDefNode from './nodes/type-def'
import { link } from 'fs';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@material-ui/core';
import { AdminEditor } from './editor';

export interface AdminViewProps{
    stores: any;
}

export const AdminView: React.FC<AdminViewProps> = (props) => {
    const [ client, store, isReady, err ] = useHub()

    const editor = useEditor();
    const [ nodes, setNodes ] = React.useState<any>([])
    const [ links, setLinks ] = React.useState<any>([])

    const displayNodes = client!.models! ? client!.models!.filter((a) => a.directives.indexOf('configurable') > -1).map((x: any, ix :number) => ({
                    id: `type-${ix}`,
                    type: 'typeDef',
                    position: {
                        x: ix * 200,
                        y: 200,
                    },
                    data: {
                        status: 'typing',
                        label: x.name,
                        typedef: x.def,
                    }
                })).concat((props.stores || []).map((x: any, ix : number) => ({
                    id: `store-${ix}`,
                    type: 'extStore',
                    position: {
                        x: ix * 200,
                        y: 350
                    },
                    data: {
                        status: 'warning',
                        label: x.name
                    }
                }))).concat(nodes) : []
    const types = [TypeDefNode, ExtStore, ExtAdapter]

    const [ modalOpen, openModal ] = React.useState<boolean>(false);

    const [ Modal, setModal ] = React.useState<any>();
    const [ selectedNode, setNode ] = React.useState<any>();

    const [ filterLink, setFilterLink ] = React.useState<any>([]);

    return (
        <div className="admin-view">

            <HiveProvider store={{
                nodeTypes: types,
                nodes: displayNodes,
                links: links.filter((a : any) => filterLink.map((x : any) => x.id).indexOf(a.id) == -1),
                statusColors: {
                    typing: 'green',
                    new: 'yellow',
                    warning: 'orange',
                },
                exploreNode: (id: string) => {
                    let node : any = Object.assign({}, displayNodes.filter((a) => a.id == id)[0])
                    const type = types.filter((a) => a.type == node.type)[0]
                    node.type = type;
                    setNode(node)
                },
                onNodeAdd: (node: any) => {
                    setNodes(nodes.concat([node]))
                },
                onLinkAdd: (link : any) => {
                    console.log("Addd link", link)
                   setLinks(links.concat([link])) 
                },
                onLinkRemove: (_links : any) => {
                    const link = links.filter((a : any) => {
                        let ix = _links.map((x : any) => x.id).indexOf(a.id)
                        return ix == -1
                    })
                    setFilterLink(filterLink.concat(_links))
                   // setLinks(link)
                }
            }}>
                <AdminEditor onClose={() => setNode(null)} selected={selectedNode} />
            </HiveProvider>
        </div>    
    )
}