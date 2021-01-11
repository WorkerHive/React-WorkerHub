import { Divider, Button, Paper, TextField, Typography } from '@material-ui/core';
import React from 'react';

import './index.css';

export interface LoginProps{
    title: string;
}

export const Login = (props : LoginProps) => {
    return (
        <div className="login-view">
           <div className="image-section">
            </div> 
            <Paper className="login-section">
                <div className="login-header">
                    <img className="login-header__img" />
                    <Typography variant="h4">{props.title || 'Workhub'}</Typography>
                </div>
                <Divider />
                <TextField 
                    label="Username" />
                <TextField 
                    type="password"
                    label="Password" />
                <Button 
                    style={{marginTop: 8}}
                    color="primary"
                    variant="contained">Login</Button>
            </Paper>
        </div>
    )
}