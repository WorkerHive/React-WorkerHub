import React from 'react';

import { 
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Checkbox,
} from '@material-ui/core'

export default function RWTable(props){

    const change = (ix, key, value) => {
        let _value = props.value;
        let val = _value[props.items[ix].name] || {};
        val[key] = value;
        _value[props.items[ix].name] = val;
        if(props.onChange) props.onChange(_value)
    }

    return (
        <Table>
            <TableHead>
                <TableRow >
                    <TableCell style={{fontWeight: 'bold'}}>Data type</TableCell>
                    <TableCell style={{fontWeight: 'bold'}} align="right">Create</TableCell>
                    <TableCell style={{fontWeight: 'bold'}} align="right">Read</TableCell>
                    <TableCell style={{fontWeight: 'bold'}} align="right">Update</TableCell>
                    <TableCell style={{fontWeight: 'bold'}} align="right">Delete</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {props.items.map((item, ix) => (
                    <TableRow>
                        <TableCell>{item.name}</TableCell>
                        <TableCell align="right">
                            <Checkbox value={props.value[item.name] && props.value[item.name].create} onChange={(e) => change(ix, 'create', e.target.checked)} margin="dense" size="small" />
                        </TableCell>
                        <TableCell align="right">
                            <Checkbox value={props.value[item.name] && props.value[item.name].read} onChange={(e) => change(ix, 'read', e.target.checked)} margin="dense" size="small" />
                        </TableCell>
                        <TableCell align="right">
                            <Checkbox value={props.value[item.name] && props.value[item.name].update} onChange={(e) => change(ix, 'update', e.target.checked)} margin="dense" size="small" />
                        </TableCell>
                        <TableCell align="right">
                            <Checkbox value={props.value[item.name] && props.value[item.name].delete} onChange={(e) => change(ix, 'delete', e.target.checked)} margin="dense" size="small" />
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}