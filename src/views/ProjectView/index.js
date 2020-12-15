import React from 'react'
import {
    Paper,
    Typography,
    Divider
} from '@material-ui/core';

import {
    KeyboardDatePicker
} from '@material-ui/pickers'

import { Switch, Route } from 'react-router-dom';

import DashboardHeader from '../../components/dashboard-header';
import ProjectTabs from '../../tabs/project'
import { connect } from 'react-redux';
import './index.css';

function ProjectView(props){
    const [ project, setProject ] = React.useState({});
    const [ selectedTab, setSelectedTab ] = React.useState(null)

    React.useEffect(() => {
        if(props.project && props.project.length > 0){
            setProject(props.project[0])
        }
    }, [props.project])


    const tabs = ["Plan", "Calendar", "Team", "Files"]

    return [
        <DashboardHeader 
            tabs={tabs}
            onTabSelect={(tab) => {
                setSelectedTab(tab)
                props.history.push(`${props.match.url}/${tab.toLowerCase()}`)
            }}
            selectedTab={selectedTab || props.location.pathname.replace(`${props.match.url}/`, '')}
            title={project.name} />,
        <Paper style={{flex: 1, marginTop: 12, display: 'flex'}}>
            <Switch>
                <Route path={`${props.match.url}/plan`} render={(props) => {
                    return <ProjectTabs.PlanTab {...props} y={props.y} project={project} />
                }} />
                <Route path={`${props.match.url}/calendar`} render={(props) => {
                    return <ProjectTabs.CalendarTab {...props} project={project} />
                }} />
                <Route path={`${props.match.url}/team`} render={(props) => {
                    return <ProjectTabs.TeamTab {...props} project={project} />
                }} />
                <Route path={`${props.match.url}/files`} render={(props) => {
                    return <ProjectTabs.FileTab {...props} project={project} />
                }} />
            </Switch>
        </Paper>

    ]
}

export default connect((state, ownProps) => ({
    project: state.projects.list.filter((a) => a.id == ownProps.match.params.id)
}))(ProjectView)