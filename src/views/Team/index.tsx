import { Header, SearchTable } from '@workerhive/react-ui';

import React from 'react';
import { Layout } from '../../components/layout';

export default function Team(props: any) {
    return (
        <Layout layout={(sizes: any) => [
            {
                i: 'header',
                x: 0,
                y: 0,
                w: 12,
                h: 1,
                maxH: 1,
                component: (<Header title="Team" />)
            },
            {
                i: 'data',
                x: 0,
                y: 1,
                w: 12,
                h: 16,
                component: (<SearchTable data={[]} />)
            }
        ]} />
    )
}