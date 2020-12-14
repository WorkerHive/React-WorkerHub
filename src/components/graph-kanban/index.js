import React from 'react';

import Board from '@lourenci/react-kanban'
import '@lourenci/react-kanban/dist/styles.css'

export default function GraphKanban(props){
    const board = {
        columns: [
            {
                id: 1,
                title: "Backlog",
                cards: props.graph.nodes.filter((a) => a.status != "COMPLETED" && a.status != "BLOCKED").map((x) => ({
                    id: x.id,
                    title: x.data.label,
                }))
            },
            {
                id: 2,
                title: "Doing",
                cards: []
            },
            {
                id: 3,
                title: "Done",
                cards: []
            }
        ]
    }
    return (
        <Board initialBoard={board}/>
    )
}
