import React from 'react';

import {
    Search,
    ViewHeadline,
    ViewModule
} from '@material-ui/icons';

import {
    Paper,
    TextField,
    ButtonGroup,
    Button,
    Divider,
    List,
    ListItem,
    InputAdornment
} from '@material-ui/core';

import './index.css';

export default function SearchTable(props){
    return (
        <Paper style={{flex: 1, marginTop: 12}}>
            <div className="options-bar">
                <TextField
                    InputProps={{
                        startAdornment: <InputAdornment position="start"><Search /></InputAdornment>
                    }}
                    label="Search"
                    variant="outlined"
                    size="small" />
                <ButtonGroup>
                    <Button><ViewHeadline /></Button>
                    <Button><ViewModule /></Button>
                </ButtonGroup>
            </div>
            <Divider />
            <div className="grid-list">
                <List>
                    {props.data.map((x) => (
                    <ListItem>
                        {props.renderItem(x)}
                    </ListItem>
                    ))}
                </List>
            </div>
        </Paper>
    )
}