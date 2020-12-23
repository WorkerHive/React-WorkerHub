import React from 'react';

import {
    TextField,
    InputAdornment,
    Typography,
    Button
} from '@material-ui/core'

import './hub-setup.css';

export default function HubSetup(props){
    const [ hubUrl, setHubUrl ] = React.useState(localStorage.getItem('workhub-api'))

    return (
        <div className="hub-setup">
            <div className="hub-setup__header">
                <Typography variant="h4" style={{fontWeight: 'bold'}}>Welcome to workhub</Typography>
                <Typography variant="subtitle1">Enter your hub url below</Typography>
            </div>
            <div className="hub-box">
                <TextField 
                    placeholder="Hub URL"
                    value={hubUrl}
                    onChange={e => {
                        setHubUrl(e.target.value)
                        localStorage.setItem('workhub-api', e.target.value)
                    }}
                    InputProps={{
                        endAdornment: <InputAdornment position="end">.workhub.services</InputAdornment>
                    }}/>
                <div className="hub-actions">
                    <Button onClick={() => props.onHub(hubUrl)} disabled={!hubUrl || hubUrl.length < 1} color="primary" variant="contained">
                        Next
                    </Button>
                </div>
            </div>
            
        </div>
    )
}