import React from 'react';

import {
    Typography
} from '@material-ui/core'

import {
    CheckCircle,
    Publish
} from '@material-ui/icons'

import {
    TreeItem
} from "@material-ui/lab"
import { makeStyles } from '@material-ui/core/styles';

import './branch.css';

const useBranchStyles = makeStyles((theme) => ({
    labelRoot: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(1, 0)
    },
    labelText: {
        height: 44,
        display: 'flex',
        alignItems: 'center'
    },
    labelIcon: {
        marginRight: 8
    }
}))

export default function Branch (props){
    const classes = useBranchStyles()
    const { status, ...other } = props;

    const renderIcon = () => {
        switch(props.data.status){
            case 'COMPLETE':
                return <CheckCircle style={{color: 'green'}}/>
            case 'IN PROGRESS':
                return <Publish style={{color: 'orange'}} />
            default:
                return null;
        }
    }

    return (
        <TreeItem
            className={['tree-branch']}
            label={
                <div className={classes.labelRoot}>
                    <div className={classes.labelIcon}>
                    {renderIcon()}
                    </div>
                   <Typography variant="subtitle1" className={classes.labelText}>
                        {props.data.label} : ({props.children.length}) children ({props.total}) tasks
                    </Typography> 
                </div>
            }
            {...other} />
    )
}