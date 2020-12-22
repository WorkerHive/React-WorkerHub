import MPLEX from 'libp2p-mplex';
import {NOISE} from 'libp2p-noise';
import Protector, {generate} from 'libp2p/src/pnet';
import WebRTCStar from 'libp2p-webrtc-star'

const transportKey = WebRTCStar.prototype[Symbol.toStringTag]

export const P2PStack = (swarmKey) => ({
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