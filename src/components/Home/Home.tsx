import React, { useEffect, useState } from "react";
import { RtmMessage, createChannel, createClient } from "agora-rtm-react";
import homecss from "./Home.module.css";
import { OutlinedInput, Paper } from "@mui/material";
import { Buffer } from "buffer";
import { useNavigate } from "react-router-dom";

window.Buffer = Buffer;
const channelName="1234"
let uid: any;
let messageHistory: any = [];
let previousNumber:number|null=null;
const useClient = createClient("50d27d9f7d9e4193af467588ce26d63d");
const useChannel = createChannel(channelName);
const client = useClient();
const testChannel = useChannel(client);
type messageStore = {
  msg: { text: string };
  userName: string;
  uid: string;
  dateTime: string;
};
type homeProps = {
  name: any;
};

function Home(props: homeProps) {
  const navigate = useNavigate();
  const [messageSended, setMessageSended] = useState(0);
  const [input, setInput] = useState<string>("");
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState<messageStore[]>([]);
  useEffect(() => {
    if (props.name !== null) {
      localStorage.setItem("name", props.name);
    }
    uid = localStorage.getItem("name");
    console.log(`welcome ${uid}`);
    join();
    return () => {
      testChannel.leave();
      client.logout();
      testChannel.removeAllListeners();
      client.removeAllListeners();
    };
  }, []);
  useEffect(() => {
    fetch(" http://localhost:3000/messages")
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        // console.log("chat===========",data);
        setMessages(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [messageSended]);
  function generateNewNumber() {
    
    let newNumber = Math.floor(Math.random() * 100); // generate a random number between 0 and 99
    while (newNumber === previousNumber) { // check if the new number is the same as the previous number
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
        fetch("http://localhost:3000/messages", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ text, uid, dateTime , channelName }),
        })
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
      <Paper
        sx={{
          height: "85vh",
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
