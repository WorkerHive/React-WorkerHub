import { Fab, Typography } from "@material-ui/core";
import { Add, Delete, Edit } from "@material-ui/icons";
import { Header, MoreMenu, MutableDialog, SearchTable } from "@workerhive/react-ui";
import React from "react";

export const PROJECT_DRILLDOWN = {
    path: '/dashboard/projects/:id',
    label: "Project Drilldown",
    data: {
        type: "Project",
        methods: {
            project: 'getProjects'
        }
    },
    layout: (sizes: any, rowHeight: number) => [
        {
            i: 'header',
            x: 0,
            y: 0,
            w: 12, 
            h: 1,
            component: (data: any, params: any) => {
                let project = (data.Project || []).filter((project : any) => project.id === params.id)[0]
                return (<Header title={project ? project.name : ''} />)
            }
        },
        {
            i: 'body',
            x: 0,
            y: 1,
            w: 12, 
            h: sizes.height / rowHeight,
            component: (data: any, params: any) => {
                let project = (data.Project || []).filter((a : any) => a.id == params.id)[0]
                return <div>
                    {JSON.stringify(project)}
                </div>
            }
        }
    ]
}

export const PROJECT_VIEW = {
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
                component: (data: any, params: any, type: any, client: any) => {
                    const t: any = {};
                    console.log(type)
                    if (type) type.def.forEach((_type: any) => {
                        t[_type.name] = _type.type;
                    })
                    return ((props) => {
                        const [open, modalOpen] = React.useState<boolean>(false);
                        const [ selected, setSelected] = React.useState<any>();
                        return (
                            <div style={{ flex: 1, display: 'flex', position: 'relative' }}>
                                <MutableDialog 
                                    title={"Project"} 
                                    data={selected}
                                    structure={t} 
                                    onSave={({item} : any) => {
                                        if(item.id){
                                            const id = item.id;
                                            delete item.id;
                                            props.client.actions.updateProject(id, item).then(() => modalOpen(false))
                                        }else{
                                            props.client.actions.addProject(item).then(() => modalOpen(false))
                                        }
                                        
                                        //modalOpen(false)
                                    }}
                                    onClose={() => {
                                        modalOpen(false)
                                        setSelected(null)
                                    }}
                                     open={open} />

                                <SearchTable 
                                    renderItem={({item}: {item: any}) => (
                                       <div style={{cursor: 'pointer', alignItems: 'center', flex: 1, display: 'flex'}} onClick={() => {params.navigate(`/dashboard/projects/${item.id}`)}}>

                                        <Typography style={{flex: 1}}>{item.name}</Typography>
                                        <MoreMenu menu={[
                                            {label: "Edit", icon: <Edit />, action: () => {
                                                setSelected(item)
                                                modalOpen(true)
                                            }},
                                            {label: "Delete", icon: <Delete />, color: 'red'}
                                        ]} />
                                       
                                       </div> 
                                    )}
                                    data={data.Project || []} />
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