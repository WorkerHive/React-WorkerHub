import React from 'react';

import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
} from '@material-ui/core';

import {
    ExpandMore
} from "@material-ui/icons";

export default function AccordionList(props){
    return (
        <div>
            {props.items.map((x) => (
                <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMore />}>
                        {x.title}
                    </AccordionSummary>
                    <AccordionDetails>
                        {x.body}
                    </AccordionDetails>
                </Accordion>
            ))}
        </div>
    )
}