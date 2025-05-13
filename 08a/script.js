// DOM elements
const createBtn = document.getElementById('createBtn');
const joinBtn = document.getElementById('joinBtn');
const roomIdInput = document.getElementById('roomId');
const currentRoomDiv = document.getElementById('currentRoom');
const messagesDiv = document.getElementById('messages');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');

// Signal exchange elements
const offerArea = document.getElementById('offerArea');
const offerText = document.getElementById('offerText');
const copyOfferBtn = document.getElementById('copyOfferBtn');
const answerArea = document.getElementById('answerArea');
const answerText = document.getElementById('answerText');
const submitAnswerBtn = document.getElementById('submitAnswerBtn');
const receivedOfferArea = document.getElementById('receivedOfferArea');
const receivedOfferText = document.getElementById('receivedOfferText');
const submitOfferBtn = document.getElementById('submitOfferBtn');
const generatedAnswerArea = document.getElementById('generatedAnswerArea');
const generatedAnswerText = document.getElementById('generatedAnswerText');
const copyAnswerBtn = document.getElementById('copyAnswerBtn');

// WebRTC configuration
const configuration = {
    iceServers: [
        { urls: 'stun:stun.l.google.com:19302' }
    ]
};

// Global variables
let peerConnection;
let dataChannel;
let roomId;
let isInitiator = false;

// Initialize UI
function init() {
    createBtn.addEventListener('click', createRoom);
    joinBtn.addEventListener('click', joinRoom);
    sendBtn.addEventListener('click', sendMessage);
    messageInput.addEventListener('keypress', event => {
        if (event.key === 'Enter') sendMessage();
    });
    
    // Copy buttons event listeners
    copyOfferBtn.addEventListener('click', () => copyToClipboard(offerText));
    copyAnswerBtn.addEventListener('click', () => copyToClipboard(generatedAnswerText));
    
    // Submit buttons event listeners
    submitAnswerBtn.addEventListener('click', handleAnswer);
    submitOfferBtn.addEventListener('click', () => {
        const offerString = receivedOfferText.value.trim();
        if (offerString) {
            handleOfferFromPeer(offerString);
        } else {
            addSystemMessage('Please paste an offer first');
        }
    });
    
    // Initially disable send button until connection is established
    sendBtn.disabled = true;
    messageInput.disabled = true;
    
    // Hide all signal areas initially
    hideAllSignalAreas();
}

// Create a new room
function createRoom() {
    isInitiator = true;
    roomId = generateRoomId();
    
    showRoom();
    setupPeerConnection();
}

// Join an existing room
function joinRoom() {
    roomId = roomIdInput.value.trim();
    
    if (!roomId) {
        alert('Please enter a Room ID');
        return;
    }
    
    isInitiator = false;
    showRoom();
    setupPeerConnection();
}

// Setup WebRTC peer connection
function setupPeerConnection() {
    // Create peer connection
    peerConnection = new RTCPeerConnection(configuration);
    
    // Set up ice candidate handling
    peerConnection.onicecandidate = handleIceCandidate;
    
    if (isInitiator) {
        // Create data channel if initiator
        dataChannel = peerConnection.createDataChannel('chat');
        setupDataChannel();
        
        // Create offer
        peerConnection.createOffer()
            .then(setLocalAndShowOffer)
            .catch(handleError);
            
        // Show offer area and answer input area
        offerArea.style.display = 'block';
        answerArea.style.display = 'block';
    } else {
        // Set up data channel handler for non-initiator
        peerConnection.ondatachannel = event => {
            dataChannel = event.channel;
            setupDataChannel();
        };
        
        // Show offer input area
        receivedOfferArea.style.display = 'block';
    }
}

// Hide all signal exchange areas
function hideAllSignalAreas() {
    offerArea.style.display = 'none';
    answerArea.style.display = 'none';
    receivedOfferArea.style.display = 'none';
    generatedAnswerArea.style.display = 'none';
}

// Copy content to clipboard
function copyToClipboard(element) {
    element.select();
    document.execCommand('copy');
    
    // Visual feedback
    const originalBgColor = element.style.backgroundColor;
    element.style.backgroundColor = '#d4edda';
    setTimeout(() => {
        element.style.backgroundColor = originalBgColor;
    }, 300);
    
    addSystemMessage('Copied to clipboard!');
}

// Set up data channel event handlers
function setupDataChannel() {
    dataChannel.onopen = () => {
        console.log('Data channel is open');
        sendBtn.disabled = false;
        messageInput.disabled = false;
        addSystemMessage('Connection established! You can start chatting.');
        
        // Hide all signal areas once connected
        hideAllSignalAreas();
    };
    
    dataChannel.onclose = () => {
        console.log('Data channel is closed');
        sendBtn.disabled = true;
        messageInput.disabled = true;
        addSystemMessage('Connection closed.');
    };
    
    dataChannel.onmessage = event => {
        const message = event.data;
        displayMessage(message, 'received');
    };
}

// Handle ICE candidates
function handleIceCandidate(event) {
    if (event.candidate) {
        console.log('ICE candidate generated', event.candidate);
    } else {
        console.log('ICE gathering completed');
    }
}

// Set local description and show offer
function setLocalAndShowOffer(offer) {
    peerConnection.setLocalDescription(offer)
        .then(() => {
            const offerString = JSON.stringify(offer);
            offerText.value = offerString;
            addSystemMessage('Offer created! Copy it and share with the person you want to chat with.');
        })
        .catch(handleError);
}

// Handle offer from peer
function handleOfferFromPeer(offerString) {
    try {
        const offer = JSON.parse(offerString);
        peerConnection.setRemoteDescription(new RTCSessionDescription(offer))
            .then(() => peerConnection.createAnswer())
            .then(answer => {
                return peerConnection.setLocalDescription(answer);
            })
            .then(() => {
                const answerString = JSON.stringify(peerConnection.localDescription);
                generatedAnswerText.value = answerString;
                generatedAnswerArea.style.display = 'block';
                receivedOfferArea.style.display = 'none';
                addSystemMessage('Answer created! Copy it and share with the room creator.');
            })
            .catch(handleError);
    } catch (e) {
        alert('Invalid offer format');
        console.error(e);
    }
}

// Handle answer from peer for initiator
function handleAnswer() {
    const answerString = answerText.value.trim();
    if (!answerString) {
        addSystemMessage('Please paste an answer first');
        return;
    }
    
    try {
        const answer = JSON.parse(answerString);
        peerConnection.setRemoteDescription(new RTCSessionDescription(answer))
            .then(() => {
                addSystemMessage('Answer accepted! Establishing connection...');
            })
            .catch(handleError);
    } catch (e) {
        alert('Invalid answer format');
        console.error(e);
    }
}

// Send message via data channel
function sendMessage() {
    const message = messageInput.value.trim();
    
    if (!message || !dataChannel || dataChannel.readyState !== 'open') return;
    
    dataChannel.send(message);
    displayMessage(message, 'sent');
    messageInput.value = '';
}

// Display message in the chat area
function displayMessage(message, type) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', type);
    messageElement.textContent = message;
    messagesDiv.appendChild(messageElement);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// Add system message (different styling)
function addSystemMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', 'system');
    messageElement.textContent = message;
    messageElement.style.backgroundColor = '#ffeb3b';
    messageElement.style.color = '#333';
    messageElement.style.textAlign = 'center';
    messageElement.style.margin = '10px auto';
    messagesDiv.appendChild(messageElement);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// Generate a random room ID
function generateRoomId() {
    return Math.random().toString(36).substring(2, 10);
}

// Show room information
function showRoom() {
    currentRoomDiv.style.display = 'block';
    currentRoomDiv.textContent = `Current Room: ${roomId}`;
    
    // Update UI
    createBtn.disabled = true;
    joinBtn.disabled = true;
    roomIdInput.disabled = true;
    
    addSystemMessage(isInitiator ? 
        'You created a room. Share the offer with someone to connect.' : 
        'Joining room. Please paste the offer to connect.');
}

// Error handler
function handleError(error) {
    console.error('Error:', error);
    addSystemMessage(`Error: ${error.message || 'Unknown error'}`);
}

// Initialize the application
window.addEventListener('load', init); 