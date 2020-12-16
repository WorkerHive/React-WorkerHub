import React from 'react';

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
            console.log(props.graph.nodes)
            let cards = props.graph.nodes.filter((a) => {
                return a.data.status == col.status
            }) || []

            console.log(props.graph.links)
            return {
                ...col,
                cards: cards.map((x) => {
                    let parents = props.graph.links.filter((a) => a.target == x.id).map((y) => props.graph.nodes.filter((a) => a.id == y.source)[0])
return {
                    id: x.id,
                    title: x.data.label,
                    description: parents.length > 0 && parents[0].data.label
}
                })
            }
        })
    }

  
    return (
        <Board 
            onCardDragEnd={(card, source, destination) => {
                console.log(source, destination)
                let cols = columns.slice()

                let fromIx = cols.map((x) => x.id).indexOf(source.fromColumnId);
                let toIx = cols.map((x) => x.id).indexOf(destination.toColumnId)

                let spliced = cols[fromIx].cards.splice(source.fromPosition, 1)
                //spliced.column = destination.toColumnId
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
