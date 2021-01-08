import React from 'react';

import { 
    TextField,
    Button,
    Select,
    FormControl,
    InputLabel,
    Checkbox,
    MenuItem,
    ListSubheader,
} from "@material-ui/core"

export default function CRUDKV(props){
    const [ items, setItems ] = React.useState([]);
    const [ data, setData ] = React.useState({});

    const scalar = [
        "String",
        "Date",
        "Int",
        "Float"
    ]

    const objects = [
        "Author",
        "Project"
    ]

    return (
        <div style={{marginLeft: 8, marginRight: 8, marginTop: 12}}>
            {items.map((x, ix) => (
                <div style={{display: 'flex', marginBottom: 8}}>
                    <TextField style={{marginRight: 4}} value={x.key} onChange={(e) => {
                        let i = items.slice();
                        i[ix].key = e.target.value;
                        setItems(i)
                    }} fullWidth label="Key Name"/>
                    <FormControl style={{marginLeft: 4}} fullWidth>
                        <InputLabel>Type</InputLabel>
                        <Select onChange={(e) => {
                            let i = items.slice();
                            i[ix].value = e.target.value;
                            setItems(i)
                        }} value={x.value}>
                            <ListSubheader>Datatypes</ListSubheader>
                            {scalar.map((x) => (
                                <MenuItem value={x}>{x}</MenuItem>
                            ))}
                            <ListSubheader>Objects</ListSubheader>
                            {objects.map((x) => (
                                <MenuItem value={x}>{x}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <Checkbox />
                </div>
            ))}
            <Button style={{marginTop: 12}} color="primary" fullWidth onClick={() => setItems(items.concat([{}]))} variant="contained">Add Row</Button>
        </div>
    )
}