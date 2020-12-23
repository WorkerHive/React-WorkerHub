import React from 'react';
import IPFS from 'ipfs';
import { encode, decode } from 'uint8-to-base64'
import { P2PStack } from './p2p-stack';
import { withContext } from "with-context";
export const IPFSContext = React.createContext({})

export const withIPFS = withContext(IPFSContext, "ipfs")

export const IPFSProvider = (props) => {

    const [ isReady, setReady ] = React.useState(false)
    const [ ipfs, setIPFS ] = React.useState(null)
    const host = `${localStorage.getItem('workhub-api')}.workhub.services`;

    React.useEffect(() => {
        async function startIPFS(){
            let node = ipfs;
            if(ipfs){
                console.info("=> IPFS Already Started")
            }else{
                console.time('IPFS Started')

                try{
                    node = await IPFS.create({
                        repo: 'workhub',
                        config: {
                            Addresses: {
                                Swarm: [`/dns4/${host}/tcp/6969/wss/p2p-webrtc-star`],
                                Bootstrap: []
                            }
                        },
                        relay: {enabled: true, hop: {enabled: true}},
                        libp2p: P2PStack(decode(props.swarmKey))
                    })
                    console.log(await node.id())
                }catch(e){
                    console.error(e)
                }
                console.timeEnd('IPFS Started')
            }
            setIPFS(node)
            setReady(node != null)

        }    
        if(props.swarmKey) startIPFS()
        return function cleanup(){
            if(ipfs && ipfs.stop){
                console.log('Stopping IPFS')
                ipfs.stop().catch(err => console.error(err))
                ipfs = null
            }
        }
    }, [props.swarmKey])

    return (
        <IPFSContext.Provider value={{node: ipfs, isReady}}>
            {props.children}
        </IPFSContext.Provider>
    )
}

/*export const useIPFS = (swarmKey) => {
    console.log("SWARM KEY", swarmKey)
    swarmKey = decode(swarmKey)

    React.useEffect(() => {
        async function startIPFS(){
            if(ipfs){
                console.log('IPFS Already Started')
            }else{
                console.time('IPFS Started')
                try{
                    ipfs = await IPFS.create({
                        repo: 'workhub',
                        config: {
                            Addresses: {
                                Swarm: [
                                   //'/ip4/127.0.0.1/tcp/9090/ws/p2p-webrtc-star'
                                 '/dns4/thetechcompany.workhub.services/tcp/6969/ws/p2p-webrtc-star'
                                ],
                            }
                        },
                        relay: {enabled: true, hop: {enabled: true}},
                        libp2p: P2PStack(swarmKey)
                    })
                    
                    console.timeEnd('IPFS Started')

                    setInterval(async () => {
                        if(ipfs) console.log(await ipfs.swarm.peers())
                    }, 2000)
                }catch(err){
                    console.error('IPFS init error: ', err)
                    ipfs = null;
                }
            }
        }

        if(swarmKey) startIPFS()
      /*  return function cleanup(){
            if(ipfs && ipfs.stop){
                console.log('Stopping IPFS')
                ipfs.stop().catch(err => console.error(err))
                ipfs = null
            }
        }
    }, [ipfs])
    return {ipfs}
}*/

export const IPFSStack = async (swarmKey = 'L2tleS9zd2FybS9wc2svMS4wLjAvCi9iYXNlMTYvCmJlMGI3MmJkNGRmODAwNzkwYjU5ZWZhNzA3YjcxNzExYWIwYjNhNGI0OTAyMWNiNDUwMGQxMDZkMWUwZGVmNTg=') => {
    console.log("IPFS Node Starting")

    let node = await IPFS.create({
        repo: 'workhub-' + new Date().getTime(),
        config: {
          Addresses: {
            Swarm: [
                `/dns4/${localStorage.getItem('workhub-api')}.workhub.services/tcp/6969/wss/p2p-webrtc-star`,
               '/dns4/wrtc-star1.par.dwebops.pub/tcp/443/wss/p2p-webrtc-star'
            ],
            Bootstrap: []
          }
        },
      })
    console.log("IPFS Node Started")
    console.log(await node.id())
    //  node.swarm.connect('/dns4/thetechcompany.workhub.services/tcp/6969/ws/p2p-webrtc-star')
    console.log(await node.swarm.localAddrs())
    return node;
}