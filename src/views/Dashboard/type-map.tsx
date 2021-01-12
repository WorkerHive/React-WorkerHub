import React, { FC, ReactElement } from 'react';
import { Header, MutableDialog, PermissionForm, SearchTable } from '@workerhive/react-ui'
import { Route } from 'react-router-dom';
import { Layout } from '../../components/layout';
import { Fab } from '@material-ui/core';
import { Add } from '@material-ui/icons';

const Types = [
    {
        path: '/dashboard/projects',
        label: "Projects",
        data: {
            type: "Project",
            methods: {
                projects: 'getProjects'
            }
        },
        layout: (sizes : any, rowHeight: number) => [
            {
                i: 'header',
                x: 0,
                y: 0,
                w: 12,
                h: 1,
                component: (data: any) => (<Header title="Projects" />)
            },
            {
                i: 'data',
                x: 0,
                y: 1,
                w: 12,
                h: (sizes.height / rowHeight) -2,
                component: (data: any) => (<SearchTable renderItem={(item: any) => item.name} data={data.projects || []} />)
            }
        ]
    },
    {
        path: '/dashboard/team',
        label: "Team",
        data: {
            type: 'TeamMember',
            methods: {
                team: 'getTeamMembers'
            }
        },
        layout: (sizes : any, rowHeight: number) => [
            {
                i: 'header',
                x: 0,
                y: 0,
                w: 12,
                h: 1,
                component: (<Header title="Team" />)
            },
            {
                i: 'data',
                x: 0,
                y: 0,
                w: 12,
                h: (sizes.height / rowHeight) - 2,
                component: (data: any, type: any) => {
                    const t: any = {};
                    if (type) type.def.forEach((_type: any) => {
                        t[_type.name] = _type.type;
                    })
                    return ((props) => {
                        const [open, modalOpen] = React.useState<boolean>(false);

                        return (
                            <div style={{ flex: 1, display: 'flex', position: 'relative' }}>
                                <MutableDialog 
                                    title={"Team"} 
                                    structure={t}
                                    onSave={(item : any) => {
                                        console.log("new team member", item)
                                    }}
                                    onClose={() => modalOpen(false)}
                                    open={open} />
                                <SearchTable renderItem={(item:any) => item.name} data={data.team || []} />
                                <Fab onClick={() => modalOpen(true)} style={{ position: 'absolute', right: 12, bottom: 12 }} color="primary">
                                    <Add />
                                </Fab>
                            </div>
                        )
                    })({})
                }
            }
        ]
    },
    {
        path: '/dashboard/contacts',
        label: "Contacts",
        data: {
            type: 'Contact',
            methods: {
                equipment: 'getContacts'
            }
        },
        layout: (sizes : any, rowHeight : number) => [
            {
                i: 'header',
                x: 0,
                y: 0,
                w: 12,
                h: 1,
                component: (<Header title="Contacts" />)
            },
            {
                i: 'data',
                x: 0,
                y: 0,
                w: 12,
                h: (sizes.height / rowHeight) - 2,
                component: (data: any, type: any, client: any) => {
                    const t: any = {};
                    console.log(type)
                    if (type) type.def.forEach((_type: any) => {
                        t[_type.name] = _type.type;
                    })
                    return ((props) => {
                        const [open, modalOpen] = React.useState<boolean>(false);

                        return (
                            <div style={{ flex: 1, display: 'flex', position: 'relative' }}>
                                <MutableDialog 
                                    title={"Contacts"} 
                                    structure={t} 
                                    onSave={(item:any, type: any) => {
                                        props.client.actions.addEquipment(item)
                                        modalOpen(false)
                                    }}
                                    onClose={() => modalOpen(false)}
                                     open={open} />
                                <SearchTable renderItem={(item: any) => item.name} data={data.contacts || []} />
                                <Fab onClick={() => modalOpen(true)} style={{ position: 'absolute', right: 12, bottom: 12 }} color="primary">
                                    <Add />
                                </Fab>
                            </div>
                        )
                    })({client})
                }
            }
        ]
    },
    {
        path: '/dashboard/equipment',
        label: "Equipment",
        data: {
            type: 'Equipment',
            methods: {
                equipment: 'getEquipments'
            }
        },
        layout: (sizes : any, rowHeight : number) => [
            {
                i: 'header',
                x: 0,
                y: 0,
                w: 12,
                h: 1,
                component: (<Header title="Equipment" />)
            },
            {
                i: 'data',
                x: 0,
                y: 0,
                w: 12,
                h: (sizes.height / rowHeight) - 2,
                component: (data: any, type: any, client: any) => {
                    const t: any = {};
                    console.log(type)
                    if (type) type.def.forEach((_type: any) => {
                        t[_type.name] = _type.type;
                    })
                    return ((props) => {
                        const [open, modalOpen] = React.useState<boolean>(false);

                        return (
                            <div style={{ flex: 1, display: 'flex', position: 'relative' }}>
                                <MutableDialog 
                                    title={"Equipment"} 
                                    structure={t} 
                                    onSave={(item:any, type: any) => {
                                        props.client.actions.addEquipment(item)
                                        modalOpen(false)
                                    }}
                                    onClose={() => modalOpen(false)}
                                     open={open} />
                                <SearchTable renderItem={(item: any) => item.name} data={data.equipment || []} />
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
]

export default (props: any) => {
    return (
        <>
            {Types.map((x) => (
                <Route path={x.path} exact render={(props) => (
                    <Layout data={x.data} layout={x.layout} />
                )} />
            ))}
        </>
    )
}