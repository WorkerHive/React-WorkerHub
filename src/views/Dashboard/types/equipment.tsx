import { Fab, Typography } from "@material-ui/core";
import { Add, Delete, Edit } from "@material-ui/icons";
import { Header, MoreMenu, MutableDialog, SearchTable } from "@workerhive/react-ui";
import React from "react";

export const EQUIPMENT_VIEW = {
        path: '/dashboard/equipment',
        label: "Equipment",
        data: {
            equipment: {
                type: '[Equipment]'
            }
        },
        layout: (sizes : any, rowHeight : number) => [
            {
                i: 'header',
                x: 0,
                y: 0,
                w: 12,
                h: 1,
                component: (data : any) => (<Header title={data.label} tabs={[...new Set(data.equipment.map((x:any) => x.type))]}/>)
            },
            {
                i: 'data',
                x: 0,
                y: 0,
                w: 12,
                h: (sizes.height / rowHeight) - (sizes.width < 600 ? 2 : 1),
                component: (data: any, params: any, type: any, client: any) => {
                    const t: any = {};
                    console.log(type)
                    if (type["Equipment"]) type["Equipment"].def.forEach((_type: any) => {
                        t[_type.name] = _type.type;
                    })
                    return ((props) => {
                        const [open, modalOpen] = React.useState<boolean>(false);

                        return (
                            <div style={{ flex: 1, display: 'flex', position: 'relative' }}>
                                <MutableDialog 
                                    title={data.label} 
                                    structure={t} 
                                    onSave={({item}) => {
                                        props.client.actions.addEquipment(item).then(() => {
                                            modalOpen(false)

                                        })
                                    }}
                                    onClose={() => modalOpen(false)}
                                     open={open} />
                                <SearchTable 
                                    renderItem={({item}: {item: any}) => (
                                        <>
                                            <Typography style={{flex: 1}}>{item.name}</Typography>
                                            <MoreMenu menu={[
                                                {label:"Edit", icon: <Edit />},
                                                {label: "Delete", color: 'red', icon: <Delete />}
                                            ]} />
                                        </>
                                    )} 
                                    data={data.equipment || []} />
                                <Fab onClick={() => modalOpen(true)} style={{ position: 'absolute', right: 12, bottom: 12 }} color="primary">
                                    <Add />
                                </Fab>
                            </div>
                        )
                    })({client})
                }
            }
        ]
    }