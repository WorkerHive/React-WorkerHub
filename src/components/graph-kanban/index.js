import React from 'react';

import moment from 'moment';
import Board from '@lourenci/react-kanban'
import '@lourenci/react-kanban/dist/styles.css'
import './index.css';

export default function GraphKanban(props){
    const [ columns, setColumns ] = React.useState([
        {
            id: 0,
            title: 'Blocked',
            cards: []
        },
        {
            id: 1,
            title: 'Backlog',
            cards: props.graph.nodes.filter((a) => a.status != "COMPLETED" && a.status != "BLOCKED").map((x) => ({
                id: x.id,
                title: x.data.label,
            }))
        },
        {
            id: 2,
            title: 'Doing',
            cards: []
        },
        {
            id: 3,
            title: 'Done',
            cards: []
        }
    ])

    const getColumns = () => {
        let template = []
        if(props.template){
            template = props.template || [];
        }

        return template.map((col) => {
            let col_id = col.id;

            let cards = props.graph.nodes.filter((a) => {
                return a.data.status == col.status
            }) || []

            return {
                ...col,
                cards: cards.sort((a, b) => {

                    if(!(a.data && a.data.dueDate)) a.data.dueDate = Infinity;
                    if(!(b.data && b.data.dueDate)) b.data.dueDate = Infinity

                    return a.data.dueDate - b.data.dueDate
                }).map((x) => {
                    let parents = props.graph.links.filter((a) => a.target == x.id).map((y) => props.graph.nodes.filter((a) => a.id == y.source)[0])
return {
                    id: x.id,
                    title: x.data.label,
                    description: parents.length > 0 && parents[0].data.label,
                    dueDate: x.data.dueDate,
                    members: x.members || []
}
                })
            }
        })
    }

  
    return (
        <Board 
            renderCard={(card) => {
                return (
                    <div onClick={() => {
                        if(props.onClick){
                            props.onClick(card)
                        }
                    }} className="react-kanban-card">
                        <div className="react-kanban-card__title">
                            {card.title}
                          
                        </div>
                        {card.dueDate != Infinity && <div style={{textAlign: 'left'}}>
                                ETA: {moment(new Date(card.dueDate * 1000)).format('DD/MM/yyyy')}
                            </div>}
                        <div>
                            {card.description}    
                        </div>
                      
                    </div>
                )
            }}
            onCardDragEnd={(card, source, destination) => {
                console.log(source, destination)
                let cols = columns.slice()

                let fromIx = cols.map((x) => x.id).indexOf(source.fromColumnId);
                let toIx = cols.map((x) => x.id).indexOf(destination.toColumnId)

                let spliced = cols[fromIx].cards.splice(source.fromPosition, 1)
                cols[toIx].cards.splice(destination.toPosition, 0, spliced[0])


                if(props.onStatusChange) props.onStatusChange(card, props.template.filter((a) => a.id == destination.toColumnId)[0].status)
                if(props.onChange)props.onChange(cols)
                setColumns(cols)
            }}
            onColumnDragEnd={(obj, source, destination) => {
                let cols = columns.slice()

                let spliced = cols.splice(source.fromPosition, 1)[0]
                cols.splice(destination.toPosition, 0, spliced)
                if(props.onChange)props.onChange(cols)
                setColumns(cols)
            }}
            children={{columns: getColumns()}} />
    )
}
