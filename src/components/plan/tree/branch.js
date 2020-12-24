import React from 'react';

import {
    Typography,
    IconButton
} from '@material-ui/core'

import {
    CheckCircle,
    Publish,
    Edit,
    Add
} from '@material-ui/icons'

import {
    TreeItem
} from "@material-ui/lab"
import { makeStyles } from '@material-ui/core/styles';

import './branch.css';

const useBranchStyles = makeStyles((theme) => ({
    treeActions: {
        opacity: 0,
    },
    labelRoot: {
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(1, 0),
    },

    labelText: {
        flex: 1,
        height: 50,
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

    const branchActions = [
        {
            icon: <Edit />,
            action: () => {
                if(props.onEdit)props.onEdit()
            }
        },
        {
            icon: <Add />,
            action: () => {
                if(props.onAdd)props.onAdd();
            }
        }
    ]

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
                <div className={'labelRoot'}>
                    <div className={'labelIcon'}>
                    {renderIcon()}
                    </div>
                   <Typography variant="subtitle1" className={'labelText'}>
                        {props.data.label} : ({props.children.length}) children ({props.total}) tasks
                    </Typography> 
                    <div className={'treeActions'}>
                        {branchActions.map((x) => (
                            <IconButton onClick={(e) => {
                                e.stopPropagation()
                                x.action()
                            }}>
                                {x.icon}
                            </IconButton>
                        ))}
                    </div>
                </div>
            }
            {...other} />
    )
}