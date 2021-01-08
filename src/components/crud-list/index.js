import React from 'react';

import { 
    List,
    ListItem,
    IconButton,
    Typography,
    Button,
    Menu,
    MenuItem,
    Divider
} from "@material-ui/core"

import MutableDialog from '../dialogs/mutable-dialog'
import './index.css';
import { MoreVert } from '@material-ui/icons';

export default function CRUDList(props){
    const [ dialogOpen, openDialog ] = React.useState(false);
    const [ selected, setSelected ] = React.useState(null)
    const [ anchorEl, setAnchorEl ] = React.useState(null);

    return (
        <div className="crud-list">
            {props.type && !props.dialog && 
            <MutableDialog 
                onSave={(data) => {
                 if(props.onSave) props.onSave(data);
                 openDialog(false);
                 setSelected(null);
                }}
                title={`Add ${props.title}`} 
                structure={props.type} 
                data={selected}
                open={dialogOpen} 
                onClose={() => {
                    setSelected(null)
                    openDialog(false)
                }} />}
            {/*props.dialog != null && <props.dialog open={dialogOpen} onClose={openDialog(false)} />*/}
            <List>
                {props.data.map((x) => [
                    <ListItem>
                        <Typography style={{flex: 1}}>{x.name}</Typography>
                        <IconButton onClick={(e) => {
                            setSelected(x)
                            setAnchorEl(e.currentTarget)
                        }}>
                            <MoreVert />
                        </IconButton>
                        {anchorEl && <Menu onClose={() => setSelected(null)} anchorEl={anchorEl} open={selected && selected.id == x.id && !dialogOpen}>
                            <MenuItem onClick={() => openDialog(true)}>
                                <Typography>Edit</Typography>
                            </MenuItem>
                            <MenuItem onClick={() => {
                                if(props.onDelete){
                                    props.onDelete(x);
                                }
                            }}>
                                <Typography color="secondary">Delete</Typography>
                            </MenuItem>
                        </Menu>}
                    </ListItem>,
                    <Divider />
                ])}
            </List>
            <div className="crud-list__actions">
                <Button color="primary" variant="contained" onClick={() => openDialog(true)}>Add</Button>
            </div>
        </div>

    )
}