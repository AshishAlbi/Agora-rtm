import React, { useEffect, useState } from "react";
import { messageStore } from "../../types/chatType";
import { RtmMessage, createChannel, createClient } from "agora-rtm-react";
import homecss from "./Home.module.css";
import { Button, OutlinedInput, Paper } from "@mui/material";
import { Buffer } from "buffer";
import { useNavigate } from "react-router-dom";
import { saveMessage } from "../../service/chatService";
import { toast } from "react-toastify";

window.Buffer = Buffer;
const channelName = "1234";
let uid: any;
let messageHistory: any = [];
let previousNumber: number | null = null;
const useClient = createClient("50d27d9f7d9e4193af467588ce26d63d");
const useChannel = createChannel(channelName);
const client = useClient();
const testChannel = useChannel(client);

type homeProps = {
  name: any;
};

function Home(props: homeProps) {
  const userAgent = navigator.userAgent;

  const device = {
    platform: getPlatform(userAgent),
    browser: getBrowserName(userAgent),
  };

  function getBrowserName(userAgent: any) {
    const browsers: any = {
      Chrome: /Chrome/i,
      Firefox: /Firefox/i,
      Safari: /Safari/i,
      Edge: /Edg/i,
      Opera: /Opera|OPR/i,
      IE: /Trident|MSIE/i,
    };

    for (const browser in browsers) {
      if (browsers[browser].test(userAgent)) {
        return browser;
      }
    }

    return "Unknown";
  }

  function getPlatform(userAgent: any) {
    const platforms: any = {
      Win: /Win/i,
      Mac: /Mac/i,
      Linux: /Linux/i,
      iOS: /iPhone|iPad|iPod/i,
      Android: /Android/i,
    };

    for (const platform in platforms) {
      if (platforms[platform].test(userAgent)) {
        return platform;
      }
    }

    return "Unknown";
  }

  const navigate = useNavigate();
  const [messageSended, setMessageSended] = useState(0);
  const [input, setInput] = useState<string>("");
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState<messageStore[]>([]);
  useEffect(() => {

if(navigator.userAgent.includes('Android')){
  window.addEventListener('visibilitychange',(event)=>{
    if(document.visibilityState === "hidden"){
      const sent = navigator.sendBeacon(
            "https://webhook.site/b6832121-398a-48b1-a475-93619c3f5047",
            JSON.stringify({
                title: `Refreshed working`,
                body: `close browser ${event.type}`,
            })
      );
    }
  postData({data:"closed"})
  })
}


    if ((navigator.maxTouchPoints > 2) || (navigator.userAgent.includes('iPhone')) ) {
      window.addEventListener(
        "unload",
        () => {
          const sent = navigator.sendBeacon(
            "https://webhook.site/1ac33a8b-d7bf-478e-8e33-85f4910a91f8",
            JSON.stringify({
                title: `Refreshed working`,
                body: "This refreshed with send beacon",
            })
        );
        },
        { capture: true }
      );
    }


    // if (navigator.userAgent.includes("iPhone") || navigator.userAgent.includes("Mac")) {
    //   window.addEventListener(
    //     "beforeunload",
    //     () => {
    //       postData({ data: "beforeunload event working" }).then((data) => {
    //         console.log(data);
    //       });
    //     },
    //     { capture: true }
    //   );
    // }

    console.log("^^Device", navigator.userAgent);
    if (props.name !== null) {
      localStorage.setItem("name", props.name);
    }

    uid = localStorage.getItem("name");
    console.log(`welcome ${uid}`);
    join();
    return () => {
      postData({ data: "return event" });
      testChannel.leave();
      client.logout();
      testChannel.removeAllListeners();
      client.removeAllListeners();
      navigate("/");
    };
  }, []);

  async function postData(data: any) {
    const url = "https://webhook.site/1ac33a8b-d7bf-478e-8e33-85f4910a91f8";
    const response = await fetch(url, {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      mode: "no-cors", // no-cors, *cors, same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: "follow", // manual, *follow, error
      referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify(data), // body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects
  }

  function generateNewNumber() {
    let newNumber = Math.floor(Math.random() * 100); // generate a random number between 0 and 99
    while (newNumber === previousNumber) {
      // check if the new number is the same as the previous number
      newNumber = Math.floor(Math.random() * 100); // generate a new random number if it is the same
    }
    previousNumber = newNumber; // store the new number as the previous number
    return newNumber; // return the new number
  }

  const join = async () => {
    await client.login({ uid: uid }).then(
      async () => {
        await testChannel.join();
        testChannel.on("ChannelMessage", (msg, uid) => {
          setMessageSended(generateNewNumber());
          console.log("message:", msg, "from:", uid);
          setText((previous: any) => {
            return [...previous, { msg, uid }];
          });
        });
      },
      () => {
        navigate("/");
      }
    );
  };
  const sendMessage = async (event: any) => {
    if (event.key === "Enter") {
      let text = event.target.value;
      if (text.trim().length) {
        let message = client.createMessage({ text, messageType: "TEXT" });
        let dateTime = new Date().toISOString();
        await testChannel.sendMessage(message);
        setText((previous: any) => {
          return [...previous, { msg: { text }, uid, dateTime }];
        });
        messageHistory.push({ text, uid, dateTime });
        const data = {
          text: input,
          uid: uid,
          channelName: channelName,
        };
        console.log("datatatatata", data);
        saveMessage(data)
          .then((res) => {
            console.log("message saved");
            setMessageSended(generateNewNumber());
          })
          .catch((err) => {
            console.log(err);
          });
        setInput("");
      }
    }
  };
  return (
    <div className={homecss.body}>
      {device.browser}
      <br />
      {device.platform}
      <br />
      {navigator.userAgent}
      =====
      {navigator.maxTouchPoints > 2 ? "true" : "false"}
      {/* <Button>log out</Button> */}
      <Paper
        sx={{
          height: "50vh",
          width: "80vw",
          padding: "2%",
          overflowY: "scroll",
        }}
        className={homecss.content}
      >
        <div className={homecss.messageBody}>
          {messages.map((test: any, i) => (
            <div key={i} className={homecss.sendedMessage}>
              <div
                className={
                  test.uid == uid
                    ? homecss.sendermessage
                    : homecss.reciverMessage
                }
              >
                {test.text}
              </div>
              <div className={homecss.senderName}>
                {test.uid !== uid ? test.uid : ""}
              </div>
            </div>
          ))}
        </div>
      </Paper>
      <OutlinedInput
        sx={{ width: "84vw" }}
        id="outlined-basic"
        placeholder="Type here...."
        value={input}
        className={homecss.inputField}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={sendMessage}
      />
    </div>
  );
}

export default Home;

// import { Button } from "@mui/material";
// import AgoraRTC from "agora-rtc-sdk-ng";
// import { useEffect, useRef, useState } from "react";
// import { getResourceId } from "../../service/chatService";

// interface OptionsType {
//     appId: string;
//     channel: string;
//     token: string | null;
//     uid: string;
//     role?: string;
// }

// interface ChannelParametersType {
//     localAudioTrack: any;
//     localVideoTrack: any;
//     remoteAudioTrack: any;
//     remoteVideoTrack: any;
//     remoteUid: string;
// }

// export const Broadcast = () => {
//     const localVideoRef = useRef<HTMLVideoElement>(null);
//     const remoteVideoRef = useRef<HTMLVideoElement>(null);

//     const [agoraEngine, setAgoraEngine] = useState<any>(
//         AgoraRTC.createClient({
//             mode: "live",
//             codec: "vp8",
//         })
//     );

//     const channelParameters: ChannelParametersType = {
//         localAudioTrack: null,
//         localVideoTrack: null,
//         remoteAudioTrack: null,
//         remoteVideoTrack: null,
//         remoteUid: "",
//     };

//     const [options, setOptions] = useState<OptionsType>({
//         appId: "50d27d9f7d9e4193af467588ce26d63d",
//         channel: "demo",
//         token: null,
//         role: "",
//         uid: generateRandomString(),
//     });

//     function generateRandomString() {
//         const characters =
//             "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
//         let randomString = "";

//         for (let i = 0; i < 10; i++) {
//             const randomIndex = Math.floor(Math.random() * characters.length);
//             randomString += characters.charAt(randomIndex);
//         }

//         return randomString;
//     }

//     const StartRecrd = async(uid:any) => {
//         const resourceId = await getResourceId(uid)
//         console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^resiurceId',resourceId);
//     }

//     useEffect(() => {
//         (async () => {
//             agoraEngine.on(
//                 "user-published",
//                 async (user: any, mediaType: string) => {
//                     await agoraEngine.subscribe(user, mediaType);
//                     console.log("^^^ subscribe success", user, mediaType);

//                     if (mediaType === "video") {
//                         const remoteVideoTrack = await agoraEngine.subscribe(
//                             user,
//                             mediaType
//                         );

//                         channelParameters.remoteVideoTrack = remoteVideoTrack;
//                         channelParameters.remoteAudioTrack = user.audioTrack;
//                         channelParameters.remoteUid = user.uid.toString();
//                         console.log("^^^^USerId",user.uid)

//                         if (options.role !== "host") {
//                             // Play the remote video track.
//                             channelParameters.remoteVideoTrack.play(
//                                 remoteVideoRef.current as HTMLVideoElement
//                             );
//                         }
//                     }

//                     if (mediaType === "audio") {
//                         channelParameters.remoteAudioTrack = user.audioTrack;
//                         channelParameters.remoteAudioTrack.play();
//                     }

//                     agoraEngine.on("user-unpublished", (user: any) => {
//                         console.log("^^^", user.uid + " has left the channel");
//                     });
//                 }
//             );
//         })();
//     }, [agoraEngine, options.role]);

//     const join = async () => {
//         if (options.role === "" || options.role === null) {
//             window.alert("Please select user role");
//             return;
//         }

//         await agoraEngine.join(
//             options.appId,
//             options.channel,
//             options.token,
//             options.uid
//         );

//         channelParameters.localAudioTrack =
//             await AgoraRTC.createMicrophoneAudioTrack();
//         channelParameters.localVideoTrack =
//             await AgoraRTC.createCameraVideoTrack();

//         if (options.role === "host") {
//             await agoraEngine.setClientRole("host");
//             await agoraEngine.publish([
//                 channelParameters.localAudioTrack,
//                 channelParameters.localVideoTrack,
//             ]);

//             channelParameters.localVideoTrack.play(
//                 localVideoRef.current as HTMLVideoElement
//             );

//             console.log("^^^ publish success!");
//         }
//     };

//     const leave = async () => {
//         if (channelParameters.localAudioTrack) {
//             channelParameters.localAudioTrack.close();
//         }

//         if (channelParameters.localVideoTrack) {
//             channelParameters.localVideoTrack.close();
//         }

//         await agoraEngine.leave();
//         console.log("^^^ You left the channel");
//     };

//     const handleOptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         setOptions({ ...options, role: e.target.value });
//         console.log("^^ Options changed", options);
//     };

//     return (
//         <>
//             <h2 className="left-align">Live streaming</h2>
//             <div className="row">
//                 <div style={{ display: "" }}>
//                     <input
//                         type="radio"
//                         name="joinAs"
//                         id="host"
//                         value="host"
//                         checked={options.role === "host"}
//                         onChange={handleOptionChange}
//                     />
//                     <label htmlFor="host"> Host </label>
//                     <input
//                         type="radio"
//                         name="joinAs"
//                         id="audience"
//                         value="audience"
//                         checked={options.role === "audience"}
//                         onChange={handleOptionChange}
//                     />
//                     <label htmlFor="audience">Audience</label>
//                     <button type="button" onClick={join}>
//                         Join
//                     </button>
//                     <button type="button" onClick={leave}>
//                         Leave
//                     </button>
//                 </div>
//             </div>
//             <div className="Video">
//                 <video ref={localVideoRef} autoPlay muted></video>
//                 <video ref={remoteVideoRef} autoPlay></video>
//             </div>
//             <Button onClick={()=>StartRecrd(232165)}>Record</Button>
//         </>
//     );
// };
