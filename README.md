# Generate RFC 2198 RED using Insertable streams

This Javascript module provides an implementation of
[RFC2198](https://tools.ietf.org/html/rfc2198) in Javascript
that can be used together with the
[WebRTC Insertable Streams API](https://github.com/w3c/webrtc-encoded-transform)
to provide a variable-redundancy version of RED. This allows for
example controlling the amount of redundancy depending on the amount of
packet loss.

See [the WebRTCHacks post](https://webrtchacks.com/red-improving-audio-quality-with-redundancy/) for the motivation and performance of audio/red.

## API
```
const red = new RFC2198Encoder();
```
will construct an encoder with a default redundancy level of 1.
A redundancy level of 0 means only the original packet (encoded as RED), 1 means
one redundant packet and so on. The encoder does not limit the amount of redundancy.
However, it will only create packets up to 1180 bytes long.

The encoders `addRedundancy method needs to be used as a bound function in a TransformStream:
```
const senderStreams = sender.createEncodedStreams();
const transformStream = new TransformStream({
  transform: red.addRedundancy.bind(red),
});
senderStreams.readable
  .pipeThrough(transformStream)
  .pipeTo(senderStreams.writable);
```
This will by default add redundancy to the Opus packet. In order for this to work properly
the payload types for Opus and its associated RED codec need to be swapped during signaling.
The RED encoder must be made aware of the original RED payload type (which will be the Opus
payload type on the other side) by calling the `setPayloadType`
```
const parameters = pc.getSenders()[0].getParameters();
const redParameters = parameters.codecs.find(c => c.mimeType == 'audio/red');
red.setOpusPayloadType(redParameters.payloadType);
```

The amount of redundancy can be changed at runtime by calling
```
red.setRedundancy(redundancy);
```
Typically this can be done as a result of measuring a certain level of packet loss


## TODO
Another mode of operation is to let Chrome generate RED with the default distance of 1.
This can be parsed, the last frame extracted and then additional redundancy can be added.
