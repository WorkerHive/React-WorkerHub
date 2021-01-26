import React from "react";
import { AdminView } from "../../Admin";

export const ADMIN_VIEW = {
    path: '/dashboard/admin',
    label: "Admin",
    data: {
        stores: {
            type: '[IntegrationStore]'
        }
    },
    layout: (sizes : any, rowHeight: number) => [
        {
            i: 'data',
            x: 0,
            y: 0,
            w: 12, 
            h: sizes.height / rowHeight,
            component: (data: any) => {
                return <AdminView stores={data.stores}/>
            }
        }
    ]
}