import React from 'react';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { YContext, YContextProps } from './yjs/context'

/*
export default function (onlineAction : any){

    const ydoc = new Y.Doc();
    //let host = new URL(window.location).hostname;
  let host = "thetechcompany.workhub.services"
    const websocketProvider = new WebsocketProvider(`wss://${host}:1234`, 'workhub', ydoc)

    websocketProvider.on('status', (event : any) => {
      if(onlineAction) onlineAction(event.status)
    })
    const yArray = ydoc.getMap('')
  
    return ydoc;
  }
*/


export interface YProviderProps {
  children: any;
}

export { YContext }

export const YProvider : React.FC<YProviderProps> = (props) => {

  let [ ydoc, setYDoc ] = React.useState<Y.Doc>(new Y.Doc());
  let [ websocketProvider, setWebsocketProvider ] = React.useState<WebsocketProvider>();
  let [ status, setStatus ] = React.useState<string>('disconnected')

  React.useEffect(() => {
    let host = "thetechcompany.workhub.services"

    websocketProvider = new WebsocketProvider(`wss://${host}:1234`, 'workhub', ydoc)

    websocketProvider.on('status', (event : any) => {
      console.info('=> YJS Status', event.status)
      setStatus(event.status)
    })

    setWebsocketProvider(websocketProvider)
  }, [])
    
  //let host = new URL(window.location).hostname;

  return (
    <YContext.Provider value={{ydoc, status}}>
      {props.children}
    </YContext.Provider>
  )
}