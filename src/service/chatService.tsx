import axios from "axios";
import { messageStore } from "../types/chatType";

export async function saveMessage(data:messageStore) {

    const response = await axios.post("http://127.0.0.1:8000/chat/save",data)
    return response?.data
} 

     
