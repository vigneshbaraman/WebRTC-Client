
const roomInput = document.getElementById('joinBtn');
const roomInput1 = document.getElementById('joinBtn1');

roomInput.addEventListener('click', (event) => {
 const roomId = "Room1";
 myRoom(roomId);
});      
roomInput1.addEventListener('click', (event) => {
 const roomId = "Room2";
  myRoom(roomId);
}); 


 
async function  myRoom(roomid){
const roomId = roomid;
      const role='user';
      const socket = new WebSocket("https://webrtc-server-w5k1.onrender.com/");
      let peerConnection;

      const config = {
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
      };

     


      socket.onopen = async () => {
        console.log("User WebSocket connected");
        socket.send(JSON.stringify({ type: 'join', roomId,role }));
      };

      let localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      document.getElementById('myVideo').srcObject = localStream;


      console.log(localStream);

          document.getElementById('myVideo').srcObject = localStream;
        
      socket.onmessage = async (event) => {
        console.log("check something is called")
        const { type, payload } = JSON.parse(event.data);

        if (type === 'offer') {
          // ✅ Always create a new peerConnection when receiving a new offer
          peerConnection = new RTCPeerConnection(config);

          // const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
          // stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));
          localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));

          peerConnection.onicecandidate = e => {
            if (e.candidate) {
              socket.send(JSON.stringify({ type: 'candidate', roomId, payload: e.candidate,role }));
            }
          };

          // ✅ Set remote and send answer
          await peerConnection.setRemoteDescription(new RTCSessionDescription(payload));
          const answer = await peerConnection.createAnswer();
          await peerConnection.setLocalDescription(answer);
          socket.send(JSON.stringify({ type: 'answer', roomId, payload: answer,role }));

          // Optional: show local video

    
        }

        if (type === 'candidate') {
          console.log("check candidate created");
          await peerConnection.addIceCandidate(new RTCIceCandidate(payload));
        }
      };
}





      