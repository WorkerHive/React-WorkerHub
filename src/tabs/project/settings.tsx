import React from 'react';

import {
    List,
    ListItem
} from '@material-ui/core';

import './settings.css';

export interface SettingsProps {

}

export const SettingsTab : React.FC<SettingsProps> = (props) => {
    const menu = [
        {
            label: "Project Info"
        },
        {
            label: "Security"
        },
        {
            label: "Integrations"
        }
    ]
    return (
        <div className="settings-tab">
            <div className="settings-menu">
                <List>
                    {menu.map((x) => (
                        <ListItem button>{x.label}</ListItem>
                    ))}
                </List>

            </div>
            <div className="settings-body">

            </div>

        </div>
    )
}