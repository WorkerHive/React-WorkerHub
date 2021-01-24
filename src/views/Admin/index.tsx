import React from 'react';

import { Editor, HiveProvider } from "@workerhive/hive-flow"

import './index.css';
import { useHub } from '@workerhive/client';

export interface AdminViewProps{

}

export const AdminView: React.FC<AdminViewProps> = (props) => {
    const [ client, store, isReady, err ] = useHub()

    return (
        <div className="admin-view">
            <HiveProvider store={{
                nodes: client!.models! ? client!.models!.map((x: any, ix :number) => ({
                    id: `type-${ix}`,
                    type: 'typeDef',
                    position: {
                        x: ix * 200,
                        y: 200,
                    },
                    data: {
                        label: x.name,
                    }
                })).concat((store.IntegrationStore || []).map((x: any, ix : number) => ({
                    id: `store-${ix}`,
                    type: 'store',
                    position: {
                        x: ix * 200,
                        y: 350
                    },
                    data: {
                        label: x.name
                    }
                }))) : [],
                links: []
            }}>
                <Editor />
            </HiveProvider>
        </div>    
    )
}