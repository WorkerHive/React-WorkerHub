import React from 'react';

import {
    IconButton
} from '@material-ui/core'

import {
    TreeItem
} from '@material-ui/lab'

import {
    Edit,
    Add 
} from "@material-ui/icons"

import './branch.css';

export default function Branch(props){
    const actions = [
        {
            icon: <Edit />,
            action: (e) => {
                e.stopPropagation();
                if(props.onEdit) props.onEdit();
            }
        },
        {
            icon: <Add />,
            action: (e) => {
                e.stopPropagation()
                if(props.onAdd) props.onAdd();
            }
        }
    ]
    return (
        <TreeItem   
            nodeId={props.id}
            label={(
                <div 
                    onClick={props.onClick}
                    className={'crud-branch'} 
                    style={{
                        height: 50,
                        display: 'flex', 
                        alignItems: 'center'
                    }}>
                    <div style={{flex: 1}}>{props.label}</div>
                    <div className={'crud-branch__actions'}>
                        {actions.map((x) => (
                            <IconButton onClick={(e) => x.action(e)}>
                                {x.icon}
                            </IconButton>
                        ))}
                    </div>
                </div>
            )}></TreeItem>
    )
}