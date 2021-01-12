import { useHub } from '@workerhive/client';
import React, { Suspense, lazy } from 'react';
import { Route, Switch } from 'react-router-dom';
import { LayoutEditor } from '../../components/layout-editor';

import Sidebar from '../../components/sidebar'

import './index.css';

const TypeMap = lazy(() => import('./type-map'))
const Home = lazy(() => import('../Home'))
const Settings = lazy(() => import('../Settings')) 
const Workflows = lazy(() => import('../Workflows'))
const Team = lazy(() => import('../Team'))

export interface DashboardProps{
    match: any;
}

const Fallback = (props : any) => {
    return (<div>Loading ...</div>)
}

export const Dashboard: React.FC<DashboardProps> = (props) => {
    const [ hub, err ] = useHub()
    console.log("HUB ERR", hub, err)
    return (
        <div className="dashboard-view">
            <Sidebar />
            {hub != null ?(
                <Suspense fallback={<Fallback />}>
                <div className="dashboard-body">
                    <Switch>
                        <Route path={`${props.match.url}/`} exact component={Home} />
                        <Route path={`${props.match.url}/workflows`} exact component={Workflows} />
                        <Route path={`${props.match.url}/settings`} exact component={Settings} />
                        <Route path={`${props.match.url}/settings/page-editor`} component={LayoutEditor} />
                        <TypeMap />

                    </Switch>
                </div>
                </Suspense>
            ) : <Fallback />}

        </div>        

    )
}