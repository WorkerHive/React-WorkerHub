import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';

export default function (){

    const ydoc = new Y.Doc();
    const host = "thetechcompany.workhub.services"
    //const host = new URL(window.location).hostname;
    const websocketProvider = new WebsocketProvider(`wss://${host}:1234`, 'plan-editor', ydoc)
  
    const yArray = ydoc.getMap('')
  
    return ydoc;
  }