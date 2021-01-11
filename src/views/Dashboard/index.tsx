import React, { Suspense, lazy } from 'react';
import { Route, Switch } from 'react-router-dom';

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

export const Dashboard: React.FC<DashboardProps> = (props) => {

    return (
        <div className="dashboard-view">
            <Sidebar />
            <Suspense fallback={<div>Loading...</div>}>
            <div className="dashboard-body">
                <Switch>
                    <Route path={`${props.match.url}/`} exact component={Home} />
                    <Route path={`${props.match.url}/workflows`} exact component={Workflows} />
                    <Route path={`${props.match.url}/settings`} exact component={Settings} />
                    <TypeMap />

                </Switch>
            </div>
            </Suspense>
        </div>        

    )
}