import React from 'react';

import {
    MoreVert
} from '@material-ui/icons'

import {
    IconButton,
    Menu,
    MenuItem
} from '@material-ui/core';

export default function MoreMenu(props){
    const [ menuOpen, openMenu ] = React.useState(null);

    const toggleMenu = (e) => {
        e.preventDefault()
        e.stopPropagation()
        openMenu(e.currentTarget)
    }

    return [
        <IconButton className="more-menu" onClick={toggleMenu}>
            <MoreVert />
        </IconButton>,
        <Menu open={menuOpen} onClose={() => openMenu(null)} anchorEl={menuOpen}>
            <MenuItem>Edit</MenuItem>
            <MenuItem onClick={props.onDelete && props.onDelete} style={{color: 'red'}}>Delete</MenuItem>
        </Menu>
    ]
}