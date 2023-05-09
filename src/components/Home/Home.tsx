import React, { useEffect, useState } from "react";
import { RtmMessage, createChannel, createClient } from "agora-rtm-react";
import homecss from "./Home.module.css";
import { OutlinedInput, Paper, } from "@mui/material";
import { Buffer } from "buffer";
import { useNavigate } from "react-router-dom";

window.Buffer = Buffer;
let uid: any;
let messageHistory:any=[]
const useClient = createClient("9cc667ea671c444fb10859b008f0b6cd");
const useChannel = createChannel("1234");
const client = useClient();
const testChannel = useChannel(client);
type messageStore = {
  msg: { text: string };
  userName: string;
  uid: string;
  dateTime:string;
};
type homeProps = {
  name: any;
};

function Home(props: homeProps) {
  const navigate = useNavigate();
  const [input, setInput] = useState<string>("");
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

  const join = async () => {
    await client.login({ uid: uid }).then(
      async () => {
        await testChannel.join();
        testChannel.on("ChannelMessage", (msg, uid) => {
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
        let dateTime = new Date().toISOString()
        await testChannel.sendMessage(message);
        setText((previous: any) => {
          return [...previous, { msg: { text }, uid,dateTime }];
        });
        messageHistory.push({text,uid,dateTime})    
        console.log(messageHistory);
            
        setInput("");
      }
    }
  };
  return (
    <div className={homecss.body}>
      <Paper
        sx={{
          height: "70vh",
          width:"80vw",
          padding: "2%",
          overflowY:"scroll"
        }}
        className={homecss.content}
      >
        <div >
          {text.map((test: messageStore, i) => (
            <div
              key={i}
              className={homecss.sendedMessage}
            >
              <div className={ test.uid == uid ? homecss.sendermessage : homecss.reciverMessage }>{test.msg["text"]}</div>
              <div className={homecss.senderName}>
                {test.uid !== uid ? test.uid : ""}
              </div>
            </div>
          ))}
        </div>
      </Paper>
      <OutlinedInput
        sx={{ width:"84vw"}}
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
