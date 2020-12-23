import React from 'react';

import {
    TextField,
    Button,
    InputAdornment,
    Paper,
    Typography,
    Divider
} from '@material-ui/core'

import isElectron from 'is-electron';
import { useMutation } from '@apollo/client';
import { getNodeConf, LOGIN, setToken } from '../../actions/authActions';
import { connect } from 'react-redux';
import HubSetup from './hub-setup'
import WorkhubLogo from '../../assets/teal.png'

import './index.css';

function Login(props){
    const [ error, setError ] = React.useState(null)

    const [ workhub, setWorkhub ] = React.useState(localStorage.getItem('workhub-api'))
    const [ username, setUsername ] = React.useState('')
    const [ password, setPassword ] = React.useState('')

    const [ doLogin ] = useMutation(LOGIN)

    const login = () => {
        doLogin({variables: {
            username: username,
            password: password
        }}).then((r) => {
            if(r.data.login && r.data.login.token){
                props.getNodeConf()
                props.setToken(r.data.login.token)
                props.history.push('/dashboard')
            }else if(r.data.login && r.data.login.error){
                setError(r.data.login.error)
            }
        })
    }

    const renderLogin = () => {
        return (
            <div className="login-view">
                <div className="image-banner">
           
                </div>
                <Paper style={{display: 'flex', flex: 0.3, flexDirection: 'column', padding: 8}}>
                    <div style={{display: 'flex', alignItems: 'center', paddingBottom: 8}}>
                        <img style={{height: 70, marginRight: 12}} src={WorkhubLogo} />
                        <Typography style={{color: 'teal'}} variant="h4">WorkHub</Typography>
    
                    </div>
                    <Divider style={{marginBottom: 22}} />
    
                {isElectron() && (
                    <TextField  
                        InputProps={{
                            endAdornment: <InputAdornment position="end">.workhub.services</InputAdornment>
                        }}
                        marin="normal"
                        value={workhub}
                        onChange={e => {
                            setWorkhub(e.target.value)
                            localStorage.setItem('workhub-api', e.target.value)
                        }}
                        label="Workhub URL"
                        />
                )}
                <TextField 
                    margin="normal"
                    error={error}
                    label="Username" 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)}/>
                <TextField 
                    margin="normal"
                    error={error}
                    label="Password" 
                    type="password" 
                    value={password} 
                    onKeyDown={(e) => {if(e.keyCode == 13) {login()}}}
                    onChange={(e) => setPassword(e.target.value)}/>
                <Button 
                    onClick={login}
                    style={{marginTop: 33}} 
                    color="primary" 
                    variant="contained">Login</Button>
                </Paper>
    
            </div>
        )
    }

    return isElectron() && (!workhub || workhub.length < 1) ? (
        <HubSetup onHub={(url) => {
            setWorkhub(url)  
        }}/>
    ) : renderLogin()

   
}

export default connect(null, (dispatch) => ({
    setToken: (token) => dispatch(setToken(token)),
    getNodeConf: () => dispatch(getNodeConf())
}))(Login)