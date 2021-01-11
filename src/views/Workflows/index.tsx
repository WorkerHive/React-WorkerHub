import React from 'react';

import { Editor, HiveProvider, NodePanel } from "@workerhive/hive-flow"
import { Header } from '@workerhive/react-ui'
import '@workerhive/hive-flow/dist/index.css'
import './index.css';
import { MenuView } from '../../components/menu-view';

export interface WorkflowsProps{

}

export default function Workflows(props: React.FC<WorkflowsProps>){
    const [ nodes, setNodes ] = React.useState<Array<any>>([])
    const [ links, setLinks ] = React.useState<Array<any>>([])

    const _onNodeAdd = (node: any) => {
        setNodes(nodes.concat([node]))
    }  

    const _onLinkAdd = (link: any) => {
        setLinks(links.concat([link]))
    }

    const updateLinks = (links : any) => {
        setLinks(links)
    }

    const updateNodes = (nodes : any) => {
        setNodes(nodes)
    }

    return (
        <div className="workflows-view">
            <Header tabs={[]} title="Workflows" />
            <MenuView>
            <HiveProvider 
            store={{
                direction: 'horizontal',
                nodes: nodes,
                links: links,
                onNodeAdd: _onNodeAdd,
                onLinkAdd: _onLinkAdd,
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
                statusColors: {
                    'undefined': 'gray'
                }
            }}>
                <Editor />
                <NodePanel />
            </HiveProvider>
            </MenuView>
        </div>
    )
}