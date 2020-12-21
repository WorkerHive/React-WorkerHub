import React from 'react';
import MPLEX from 'libp2p-mplex';
import IPFS from 'ipfs';
import {NOISE} from 'libp2p-noise';
import Protector, {generate} from 'libp2p/src/pnet';
import WebRTCStar from 'libp2p-webrtc-star'
import { encode, decode } from 'uint8-to-base64'

const transportKey = WebRTCStar.prototype[Symbol.toStringTag]

const P2PStack = (swarmKey) => ({
    modules: {
        transport: [WebRTCStar],
        streamMuxer: [MPLEX],
        connEncryption: [NOISE],
        connProtector: new Protector(Buffer.from(swarmKey))
    },
    config: {
        transport: {
            [transportKey]: {
                enabled: true
            }
        },
        peerDiscovery: {
            autoDial: true,
            [WebRTCStar.tag]: {
                enabled: true
            }
        }
    }
})

let ipfs = null;

export const useIPFS = (swarmKey) => {
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
        }*/
    }, [ipfs])
    return {ipfs}
}

export const IPFSStack = async (swarmKey = 'L2tleS9zd2FybS9wc2svMS4wLjAvCi9iYXNlMTYvCmJlMGI3MmJkNGRmODAwNzkwYjU5ZWZhNzA3YjcxNzExYWIwYjNhNGI0OTAyMWNiNDUwMGQxMDZkMWUwZGVmNTg=') => {
    console.log("IPFS Node Starting")

    let node = await IPFS.create({
        repo: 'workhub-' + new Date().getTime(),
        config: {
          Addresses: {
            Swarm: [
                '/dns4/thetechcompany.workhub.services/tcp/6969/ws/p2p-webrtc-star',
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