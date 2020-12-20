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
            file={{data: props.data}}
            onLoadSuccess={onDocumentLoad}>
             {
              Array.from(
                new Array(numPages),
                (el, index) => (
                  <Page
                    key={`page_${index + 1}`}
                    pageNumber={index + 1}
                  />
                ),
              )
            }
        </Document>
    )
}