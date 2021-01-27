import { Paper } from "@material-ui/core";
import { WorkhubClient } from "@workerhive/client";
import { useHub } from "@workerhive/client/dist/react";
import { Calendar, Header, MutableDialog } from "@workerhive/react-ui";
import React from "react";

export const CALENDAR_VIEW =  {
        path: '/dashboard/calendar',
        label: "Calendar",
        data: {
            scheduleItems: {
                type: '[Schedule]',
                live: false
            },
            people: {
                type: '[TeamMember]'
            },
            equipment: {
                type: '[Equipment]'
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
                component: (data: any, params: any, type: any, client?: WorkhubClient | null) => {
                    const t: any = {};
                    console.log(type)
                    if (type["Schedule"]) type["Schedule"].def.forEach((_type: any) => {
                        t[_type.name] = _type.type;
                    })
                    return ((props) => {
                        const [ c, stores ] = useHub()
                        const [ modalOpen, openModal ] = React.useState<boolean>(false);

                        const [ userData, setData ] = React.useState<object>({});

                          return <Paper style={{padding: 4, flex: 1, display: 'flex'}}>
                        <MutableDialog 
                            open={modalOpen} 
                            onSave={({item} : any) => {
                                if(item.id){
                                    const id = item.id;
                                    delete item.id;
                                    client!.actions.updateSchedule(id, {
                                        start: item.start,
                                        end: item.end,
                                        title: item.title
                                    }).then(() => {
                                        openModal(false)
                                    })
                                }else{
                                    const newItem : any = {
                                        start: item.start,
                                        end: item.end,
                                        people: item.people,
                                        resources: item.resources
                                    }
                                   // client!.realtimeSync?.getArray('calendar', type['Schedule']).push([newItem])
                   
                                    openModal(false)

                                    
                                    client!.actions.addSchedule(newItem).then(() => {
                                        openModal(false)
                                    })
                                }
                                console.log("Save calendar", item)
                            }}
                            onClose={() => {
                                openModal(false);
                                setData({})
                            }}
                            models={client?.models?.map((x: any) => ({
                                ...x,
                                data: stores[x.name]
                            }))}
                            data={userData}
                            structure={t} title={"Schedule"}/>
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
    }