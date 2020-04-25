# party
Open source local party game

# API

## Socket Communication

### Custom Events
All communication events are handled through [Custom Events](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent).

### Setup
All communcation between your game and players are handled through a [`SocketClient`](/source/client/socket-client.ts).

To use the `SocketClient` in your game add the following script tag before your main code:
```html
<script type="module" src="/socket-client.js">
```
This will provide access to the `SocketClient` class globally (= added to `window` object).

Create a new `SocketClient` instance in your main code with
```javascript
const sc = new SocketClient();
```

### Creating events
To create custom events use the `send` function of the `SocketClient`
```javascript
sc.send({
    type: 'custom_event',
    data: { ... }
});
```
where `type` is the name of your custom event and `data` is an object that can contain any keys with values.

### Listening to events
To listen to your custom events add an event listener
```javascript
sc.addEventListener('custom_event', (event) => {
    // Print out the 'data' field of the custom event
    console.log(event.detail); 
});
```
just like you would with any [`EventTarget`](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget).