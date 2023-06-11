import axios from "./common";
import { messageStore } from "../types/chatType";

export async function saveMessage(data: messageStore) {
  const response = await axios.post("save", data);
  return response?.data;
}

let client: any = "none";

export const setClient = (client: any) => {
  console.log("set client working");
  client = client;
};

export const getClient = () => {
  return client;
};

export const getResourceId = async (uid:any) => {
  const data = {
    cname: "testRecord",
    uid: uid,
    clientRequest: {
      region: "CN",
      resourceExpiredHour: 24,
    },
  };

  const response = await fetch(
    "https://api.agora.io/v1/apps/50d27d9f7d9e4193af467588ce26d63d/cloud_recording/acquire",
    {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, *cors, same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: "follow", // manual, *follow, error
      referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify(data), // body data type must match "Content-Type" header
    }
  );
  return response.json();
};
