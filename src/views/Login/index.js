import React from 'react';

import {
    TextField,
    Button,
    Paper,
    Typography,
    Divider
} from '@material-ui/core'

import { useMutation } from '@apollo/client';
import { getQuote, LOGIN, setToken } from '../../actions/authActions';
import { connect } from 'react-redux';

import './index.css';

function Login(props){
    const [ quote, setQuote ] = React.useState({})
    const [ error, setError ] = React.useState(null)
    const [ username, setUsername ] = React.useState('')
    const [ password, setPassword ] = React.useState('')

    const [ doLogin ] = useMutation(LOGIN)

    const login = () => {
        doLogin({variables: {
            username: username,
            password: password
        }}).then((r) => {
            if(r.data.login && r.data.login.token){
                props.setToken(r.data.login.token)
                props.history.push('/dashboard')
            }else if(r.data.login && r.data.login.error){
                setError(r.data.login.error)
            }
        })
    }

    React.useEffect(() => {
        getQuote().then((quote) => {
            setQuote(quote)
        })
    })

    return (
        <div className="login-view">
            <div className="image-banner">
                <div className="quotes">
                <span>
                    {quote.q}
                </span>
                <span>{quote.a}</span>
                </div>
            </div>
            <Paper style={{display: 'flex', flex: 0.3, flexDirection: 'column', padding: 8}}>
                <div style={{display: 'flex', alignItems: 'center', paddingBottom: 8}}>
                    <img style={{height: 70, marginRight: 12}} src="/assets/teal.png" />
                    <Typography style={{color: 'teal'}} variant="h4">WorkHub</Typography>

                </div>
                <Divider style={{marginBottom: 22}} />
            <TextField 
                error={error}
                label="Username" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)}/>
            <TextField 
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

export default connect(null, (dispatch) => ({
    setToken: (token) => dispatch(setToken(token))
}))(Login)