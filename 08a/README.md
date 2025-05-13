# WebRTC Chat Example

A simple peer-to-peer chat application using WebRTC technology without requiring any server after the initial connection setup. This demo implements direct browser-to-browser communication.

## Features

- Create or join chat rooms
- Real-time messaging
- Direct peer-to-peer communication
- No server required for message exchange
- Simple and intuitive UI
- Easy offer/answer exchange with copy/paste functionality

## How to Use

1. Open the `index.html` file in a browser
2. To create a new chat room:
   - Click the "Create Room" button
   - Your offer will appear in a text area - click "Copy Offer" to copy it
   - Share this offer with the person you want to chat with
   - Wait for them to join and provide an answer
   - When you receive their answer, paste it in the "Paste Answer Here" box
   - Click "Submit Answer" to establish the connection
   - Start chatting!

3. To join an existing room:
   - Enter the Room ID provided by the creator
   - Click "Join Room"
   - Paste the offer from the room creator in the "Paste Offer Here" box
   - Click "Submit Offer" to generate your answer
   - Your answer will appear in a text area - click "Copy Answer" to copy it
   - Share this answer with the room creator
   - Once they submit your answer, the connection will be established
   - Start chatting!

## Technical Details

- Uses WebRTC's RTCPeerConnection and RTCDataChannel for direct peer-to-peer communication
- Implements the WebRTC signaling process (offer/answer exchange)
- Uses STUN servers for NAT traversal
- Handles ICE candidates for connectivity
- Simple and clean UI with responsive design

## How to Run Locally

To run this application locally, you need to serve it through a web server due to security restrictions in modern browsers. You can use any of these methods:

1. Using Python's built-in server:
   ```
   # Python 3
   python -m http.server
   
   # Python 2
   python -m SimpleHTTPServer
   ```

2. Using Node.js (with the `http-server` package):
   ```
   # Install http-server
   npm install -g http-server
   
   # Run server
   http-server
   ```

3. Using any other web server like Apache, Nginx, etc.

Then open your browser and navigate to the server address (typically http://localhost:8000 or similar).

## Limitations

- This example is for demonstration purposes
- No persistent storage for messages
- No user authentication
- For a production environment, additional security measures would be needed
- Some network configurations may prevent WebRTC connections (very strict firewalls, symmetric NATs, etc.)

## Future Improvements

- Add video/audio communication
- Implement persistent storage for messages
- Add user authentication
- Support for group chats
- File sharing capabilities 