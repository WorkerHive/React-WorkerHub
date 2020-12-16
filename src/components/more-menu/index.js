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
            <MenuItem onClick={() => {
                if(props.onEdit){
                    openMenu(null)
                    props.onEdit()
                }
            }}>Edit</MenuItem>
            <MenuItem onClick={() => {
                if(props.onDelete) {
                    openMenu(null)
                 props.onDelete()
                 }
                 }} style={{color: 'red'}}>Delete</MenuItem>
        </Menu>
    ]
}