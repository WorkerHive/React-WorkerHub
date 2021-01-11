import React from 'react';
import {Header, SearchTable} from '@workerhive/react-ui'
import { Route } from 'react-router-dom';
import { Layout } from '../../components/layout';

const Types = [

    {
        path: '/dashboard/team',
        label: "Team",
        layout: [
            {
                i: 'header',
                x: 0,
                y: 0,
                w: 12,
                h: 1,
                component: (<Header title="Team" />)   
            },
            {
                i: 'data',
                x: 0,
                y: 0,
                w: 12,
                h: 15,
                component: (<SearchTable data={[]} />)
            }
        ]
    },
    {
        path: '/dashboard/equipment',
        label: "Equipment",
        layout: [
            {
                i: 'header',
                x: 0,
                y: 0,
                w: 12,
                h: 1,
                component: (<Header title="Equipment" />)   
            },
            {
                i: 'data',
                x: 0,
                y: 0,
                w: 12,
                h: 15,
                component: (<SearchTable data={[]} />)
            }
        ]
    }
]

export default (props: any) => {
    return (
        <>
        {Types.map((x) => (
        <Route path={x.path} exact render={(props) => (
            <Layout layout={x.layout} />
        )} />
        ))}
        </>
    )
}