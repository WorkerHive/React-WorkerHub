import React from 'react';
import * as Y from 'yjs';

export interface YContextProps {
    ydoc: Y.Doc;
    status: string;
}

export const YContext : React.Context<YContextProps> = React.createContext({
    ydoc: new Y.Doc(),
    status: 'disconnected'
})