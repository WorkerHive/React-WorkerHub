import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@material-ui/core"
import { useHub } from "@workerhive/client/dist/react";
import { Editor, NodePanel, useEditor } from "@workerhive/hive-flow"
import React from "react"

export interface EditorProps {
    selected?: any;
    onClose: (e : any) => void;
}

export const AdminEditor: React.FC<EditorProps> = (props) => {
    const editor = useEditor();
    const [ client, stores ] = useHub();

    //const [ Modal, setModal ] = React.useState<any>();
    const [ modalOpen, openModal ] = React.useState<boolean>(false);
    
    const Modal = props.selected && props.selected.type && props.selected.type.modal;

    return (
        <>
         <Dialog fullWidth open={props.selected != null} onClose={props.onClose}>
                <DialogTitle>Update Node</DialogTitle>
                <DialogContent style={{display: 'flex', flexDirection: 'column', flex: 1}}>
                    {Modal != null && <Modal node={props.selected} editor={editor} client={client} />}
                </DialogContent>
                <DialogActions>
                    <Button onClick={props.onClose}>Cancel</Button>
                    <Button color="primary" variant="contained">Save</Button>
                </DialogActions>
            </Dialog>
                <Editor />
                <NodePanel />
        </>
    )
}