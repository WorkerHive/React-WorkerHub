import React from 'react';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';

export default function (onlineAction){

    const ydoc = new Y.Doc();
    //let host = new URL(window.location).hostname;
  let host = "thetechcompany.workhub.services"
    const websocketProvider = new WebsocketProvider(`wss://${host}:1234`, 'workhub', ydoc)

    websocketProvider.on('status', event => {
      if(onlineAction) onlineAction(event.status)
    })
    const yArray = ydoc.getMap('')
  
    return ydoc;
  }

export const YContext = React.createContext()

export const YProvider = (props) => {
  let [ ydoc, setYDoc ] = React.useState(new Y.Doc());
  let [ websocketProvider, setWebsocketProvider ] = React.useState(null);
  let [ status, setStatus ] = React.useState('disconnected')

  React.useEffect(() => {
    let host = "thetechcompany.workhub.services"

    websocketProvider = new WebsocketProvider(`wss://${host}:1234`, 'workhub', ydoc)

    websocketProvider.on('status', event => {
      console.info('=> YJS Status', event.status)
      setStatus(event.status)
    })

    setWebsocketProvider(websocketProvider)
  }, [])
    
  //let host = new URL(window.location).hostname;

  return <YContext.Provider value={{ydoc, status}}>
      {props.children}
    </YContext.Provider>
}