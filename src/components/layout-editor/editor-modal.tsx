import * as Components from '@workerhive/react-ui'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Select, TextField } from '@material-ui/core';
import * as React from 'react';
import { keys } from 'ts-transformer-keys';

console.log(Components)
const WorkUI : any = {...Components}



export interface EditorModalProps{
    open: boolean;
    onClose?: (e: any) => void;
    onSave?: (e: any) => void;
}


    const TypeOf = (index: string) => {
         const Type = WorkUI[`${index}`] 

         type Tas = React.ComponentProps<typeof Type>

         const createKeys = (keyRecord: Record<keyof Tas, any>): (keyof Tas)[] => {
            return Object.keys(keyRecord) as any
         }

         let k = createKeys({})
         
            console.log(k)
        //        type T = Parameters<typeof Type>
        
    }
console.log(Components)
export const EditorModal : React.FC<EditorModalProps> = (props) => {
    const [ component, setComponent ] = React.useState<any>(null);

    const onClose = (e: any) => {
        if(props.onClose) props.onClose(e);
        setComponent(null)
    }

    const onSave = (e: any) => {
        if(props.onSave) props.onSave(WorkUI[component])
        onClose(e);
    }

    return (
        <Dialog open={props.open} onClose={props.onClose}>
            <DialogTitle>Add component</DialogTitle>
            <DialogContent style={{display: 'flex', flexDirection: 'column'}}>
                <TextField label="" fullWidth />
                <FormControl>
                    <InputLabel>Component</InputLabel>
                    <Select value={component} onChange={(e) => {
                        console.log(TypeOf(e.target.value as string))
                        setComponent(e.target.value)
                    }}>
                        {Object.keys(WorkUI).map((x : string) => (
                            <MenuItem value={x}>{x}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} >Cancel</Button>
                <Button onClick={onSave} color="primary" variant="contained">Add</Button>
            </DialogActions>
        </Dialog>
    )
}