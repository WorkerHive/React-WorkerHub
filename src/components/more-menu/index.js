import React from 'react';

import {
    MoreVert
} from '@material-ui/icons'

import {
    IconButton,
    Menu,
    MenuItem,
    Typography
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
        <Menu open={props.menu.length > 0 && menuOpen} onClose={() => openMenu(null)} anchorEl={menuOpen}>
            {props.menu.map((x) => {
                return (
                    <MenuItem onClick={(e) => {
                        e.stopPropagation()
                        openMenu(null)
                        x.action()
                    }} style={{color: x.color || 'black'}}>
                        {x.icon}
                        <Typography style={{marginLeft: 8}}>
                            {x.label}
                        </Typography>
                    </MenuItem>
                )
            })}
        </Menu>
    ]
}