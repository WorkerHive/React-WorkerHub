import React from 'react';

import {
    TextField,
    InputAdornment,
    Typography,
    Button
} from '@material-ui/core'

import { withRouter } from 'react-router-dom';
import { withGraph } from '../../graph';

import './hub-setup.css';

const graph = withGraph();

export interface HubSetupProps {
    history: any;
    onHub?: Function;
}

const HubSetup : React.FC<HubSetupProps> = (props) => {
    const [ hubUrl, setHubUrl ] = React.useState<string>(localStorage.getItem('workhub-api') || '')

    const setURL = (url :string) => {
        graph.setURL(`https://${url}.workhub.services/graphql`)
        props.history.push('/')
    }

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
                    onKeyDown={(e) => {
                        if(e.keyCode == 13){
                            setURL(hubUrl)
                        }
                    }}
                    onChange={e => {
                        setHubUrl(e.target.value)
                        localStorage.setItem('workhub-api', e.target.value)
                    }}
                    InputProps={{
                        endAdornment: <InputAdornment position="end">.workhub.services</InputAdornment>
                    }}/>
                <div className="hub-actions">
                    <Button onClick={() => {
                        if(props.onHub) props.onHub(hubUrl)
                        setURL(hubUrl)
                    }} disabled={!hubUrl || hubUrl.length < 1} color="primary" variant="contained">
                        Next
                    </Button>
                </div>
            </div>
            
        </div>
    )
}

export default withRouter(HubSetup)