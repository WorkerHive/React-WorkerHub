import React from 'react';

import {
    ExpandLess,
    ExpandMore
} from '@material-ui/icons'

import {
    TreeView,
    TreeItem
} from '@material-ui/lab';

import Branch from './branch';

import './index.css';

export default function CRUDTree(props){

    const onAdd = (x) => {
        if(props.onAdd) props.onAdd(x)
    }

    const onEdit = (x) => {
        if(props.onEdit) props.onEdit(x)
    }

    const onClick = (x) => {
        if(props.onClick) props.onClick(x)
    }

    return (
        <TreeView
            defaultCollapseIcon={<ExpandLess />}
            defaultExpandIcon={<ExpandMore />}
            >
            {props.tree.map((x) => (
                <Branch 
                    onAdd={() => onAdd(x)}
                    onEdit={() => onEdit(x)}
                    onClick={() => onClick(x)}
                    id={x.id} 
                    label={x.title} />
            ))}
        </TreeView>
    )
}