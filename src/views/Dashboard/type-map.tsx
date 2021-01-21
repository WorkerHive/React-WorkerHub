import React, { FC, ReactElement } from 'react';
import { Calendar, DocumentEditor, FileBrowser, Header, MutableDialog, PermissionForm, SearchTable } from '@workerhive/react-ui'
import { Route } from 'react-router-dom';
import { Layout } from '../../components/layout';
import { Paper, Fab } from '@material-ui/core';
import { Add } from '@material-ui/icons';

const Types = [
    {
        path: '/dashboard/calendar',
        label: "Calendar",
        data: {
            type: "Schedule",
            methods: {
                scheduleItems: 'getSchedules'
            }
        },
        layout: (sizes: any, rowHeight: number) => [
            {
                i: 'header',
                x: 0,
                y: 0,
                w: 12,
                h: 1,
                component: (data: any) => <Header title={"Calendar"} />,
            },
            {
                i: 'data',
                x: 0,
                y: 1,
                w: 12,
                h: sizes.height / rowHeight - 1, 
                component: (data: any, type: any, client: any) => {
                
                    return ((props) => {
                        
                        const [ modalOpen, openModal ] = React.useState<boolean>(false);

                        const [ userData, setData ] = React.useState<object>({});

                          return <Paper style={{padding: 4, flex: 1, display: 'flex'}}>
                        <MutableDialog 
                            open={modalOpen} 
                            onSave={({item} : any) => {
                                if(item.id){
                                    const id = item.id;
                                    delete item.id;
                                    client.actions.updateSchedule(id, item).then(() => {
                                        openModal(false)
                                    })
                                }else{
                                    client.actions.addSchedule(item).then(() => {
                                        openModal(false)
                                    })
                                }
                                console.log("Save calendar", item)
                            }}
                            onClose={() => {
                                openModal(false);
                                setData({})
                            }}
                            data={userData}
                            structure={{
                                title: "String",
                                start: "Date",
                                end: "Date",
                                allDay: "Boolean"
                            }} title={"Schedule"}/>
                        <Calendar events={data.scheduleItems ? data.scheduleItems.map((x:any) => {
                            return {
                                ...x,
                                start: typeof(x.start) === 'string' ? new Date(x.start) : x.start,
                                end: typeof(x.end) === 'string' ? new Date(x.end) : x.end
                            }
                        }) : []} 
                        onDoubleClickEvent={(event: any) => {
                            setData(event)
                            openModal(true)
                        }}
                        onSelectSlot={(slotInfo: any) =>{
                            openModal(true)
                            setData(slotInfo)
                        } } />
                    </Paper>
                    })(data)
                }
            }
        ]
    },
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
                h: (sizes.height / rowHeight) - (sizes.width < 600 ? 2 : 1),
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
                h: (sizes.height / rowHeight) - (sizes.width < 600 ? 2 : 1),
                component: (data: any, type: any, client: any) => {
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
                                    onSave={({item} : any) => {
                                        console.log("new team member", item)

                                        props.client.actions.addTeamMember(item)
                                    }}
                                    onClose={() => modalOpen(false)}
                                    open={open} />
                                <SearchTable renderItem={(item:any) => item.name} data={data.team || []} />
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
                component: (<Header title="Files" />)
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
    },
    {
        path: '/dashboard/kb',
        label: "Knowledge",
        data :{
            type: 'Knowledge',
            methods: {
                knowledges: 'getKnowledges'
            }
        },
        layout: (sizes: any, rowHeight: number) => [
            {
                i: 'header',
                x: 0,
                y: 0,
                w: 12,
                h: 1,
                component: (<Header title="Knowledge Base" />)
            },
            {
                i: 'editor',
                x: 0,
                y: 1,
                w: 12,
                h: (sizes.height / rowHeight) - 2,
                component: (data: any, type: any, client: any) => {
                    const t: any = {};
                    if (type) type.def.forEach((_type: any) => {
                        t[_type.name] = _type.type;
                    })
                    return ((props) => {
                        const [open, modalOpen] = React.useState<boolean>(false);

                        return (
                            <div style={{ flex: 1, display: 'flex', position: 'relative' }}>
                                <MutableDialog 
                                    title={"Knowledge"} 
                                    structure={t} 
                                    onSave={({item}) => {
                                        props.client.actions.addKnowledge(item)
                                        modalOpen(false)
                                    }}
                                    onClose={() => modalOpen(false)}
                                     open={open} />
                                <SearchTable renderItem={(item: any) => item.title} data={data.knowledges || []} />
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
        path: '/dashboard/contacts',
        label: "Contacts",
        data: {
            type: 'Contact',
            methods: {
                contacts: 'getContacts'
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
                y: 1,
                w: 12,
                h: (sizes.height / rowHeight) - (sizes.width < 600 ? 2 : 1),
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
                                    onSave={({item}) => {
                                        props.client.actions.addContact(item)
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
                h: (sizes.height / rowHeight) - (sizes.width < 600 ? 2 : 1),
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
                                    onSave={({item}) => {
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