import React from 'react';

import { AccordionList } from "@workerhive/react-ui"
import { SettingsMap } from './settings-map'
import './index.css';

export interface SettingsProps{
    history: any;
}

export default function Settings (props: SettingsProps){
   const [ converters, setConverters ] = React.useState([])
  const [ stores, setStores ] = React.useState([])

  React.useEffect(() => {
   /* getStoreTypes().then((types : any) => {
      console.log("TYOES", types)
      setStoreTypes(types);
    })

    props.getStores();
 */

    /*getConverters().then((converters) => {
      console.log(converters)
      setConverters(converters)
    })*/
  }, [])

  const roles = [
    {
      name: "Admin"
    },
    {
      name: "Editor"
    },
    {
      name: "User"
    }
  ]

  const [ storeTypes, setStoreTypes ] = React.useState([]);

    return (
        <div className="settings-view">
            <AccordionList items={SettingsMap(props, storeTypes, converters, roles)} />
        </div>
    )
}