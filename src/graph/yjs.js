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