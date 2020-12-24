import { defineFileAction, FileData } from 'chonky';
import { Nullable } from 'tsdef';

export const ConvertFiles = defineFileAction({
    id: 'convert_files',
    button: {
        name: 'Convert files',
        toolbar: true,
        contextMenu: true,
        group: 'Actions',
    },
});