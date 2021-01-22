import { FileBrowser, Header } from "@workerhive/react-ui";
import React from "react";

export const FILE_VIEW = {
        path: '/dashboard/files',
        label: "Files",
        data: {
            type: 'File',
            methods: {
                files: 'getFiles'
            }
        },
        layout: (sizes: any, rowHeight: number) => [
            {
                i: 'header',
                x: 0,
                y: 0,
                w: 12, 
                h: 1,
                component: (data: any) => (<Header title="Files" />)
            },
            {
                i: 'data',
                x: 0,
                y: 1,
                w: 12,
                h: (sizes.height / rowHeight) -2,
                component: (data: any) => (<FileBrowser files={data.files} />)
            }
        ]
    }