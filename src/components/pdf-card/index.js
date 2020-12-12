import React from 'react';

import { Document, Page } from 'react-pdf';

export default function PDFCard(props){
    
    const [ numPages, setNumPages ] = React.useState(null)
    const [ pageNumber, setPageNumber ] = React.useState(1)

    const onDocumentLoad = ({numPages}) => {
        setNumPages(numPages)
    }

    return (
        <Document
            file={props.file}
            onLoadSuccess={onDocumentLoad}>
            
            <Page pageNumber={pageNumber} />
        </Document>
    )
}