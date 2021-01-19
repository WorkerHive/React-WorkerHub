import React from 'react';

import { Editor, HiveProvider } from "@workerhive/hive-flow"

import './index.css';

export interface AdminViewProps{

}

export const AdminView: React.FC<AdminViewProps> = (props) => {
    return (
        <div className="admin-view">
            <HiveProvider store={{
                nodes: [],
                links: []
            }}>
                <Editor />
            </HiveProvider>
        </div>    
    )
}