import { Button, List, ListItem, Paper } from '@material-ui/core';
import React from 'react';

import './index.css';

export interface MenuViewProps{
    children?: any;
}

export function MenuView(props: MenuViewProps){
    return (
        <div className="menu-view">
            <Paper className="menu-view__menu">
                <List style={{flex: 1}}>
                    <ListItem button>Menu</ListItem>
                </List>
                <div className="menu-view__action">
                    <Button color="primary" variant="contained">Add</Button>
                </div>
            </Paper>
            <div className="menu-view__inner">
                {props.children}
            </div>
        </div>
    )
}