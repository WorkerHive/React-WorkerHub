import { Paper } from "@material-ui/core";
import { Calendar, Header, MutableDialog } from "@workerhive/react-ui";
import React from "react";

export const CALENDAR_VIEW =  {
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
                component: (data: any, params: any, type: any, client: any) => {
                
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
                                    client.actions.updateSchedule(id, {
                                        start: item.start,
                                        end: item.end,
                                        title: item.title
                                    }).then(() => {
                                        openModal(false)
                                    })
                                }else{
                                    client.actions.addSchedule({
                                        start: item.start,
                                        end: item.end,
                                        title: item.title
                                    }).then(() => {
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
                        <Calendar events={data.Schedule ? data.Schedule.map((x:any) => {
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