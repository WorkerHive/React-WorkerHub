import { Divider, Button, Paper, TextField, Typography } from '@material-ui/core';
import React from 'react';
import { authenticate } from '../../actions/auth'
import './index.css';

export interface LoginProps{
    title: string;
    history: any;
}

export const Login = (props : LoginProps) => {
    
    const [username, setUsername] = React.useState<string>('');
    const [password, setPassword] = React.useState<string>('');

    const login = () => {
        authenticate(username, password).then((data: any) => {
            if(data.token){
                localStorage.setItem('token', data.token) //Change this to reducer
                props.history.push(`/dashboard`)
            }else{
                console.log(data.error)
            }
           
        })
       
    }

    return (
        <div className="login-view">
           <div className="image-section">
            </div> 
            <Paper className="login-section">
                <div className="login-header">
                    <img src={'/assets/teal.png'} className="login-header__img" alt="Workhub Logo"/>
                    <Typography style={{color: 'teal'}} variant="h5">{props.title || 'Workhub'}</Typography>
                </div>
                <Divider />
                <TextField 
                    label="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)} />
                <TextField 
                    value={password}
                    onKeyDown={(e) => {
                        if(e.which === 13 || e.keyCode === 13){
                            login();
                        }
                    }}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    label="Password" />
                <Button 
                    onClick={login}
                    style={{marginTop: 8}}
                    color="primary"
                    variant="contained">Login</Button>
            </Paper>
        </div>
    )
}