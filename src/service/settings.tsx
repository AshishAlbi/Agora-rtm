import { createClient, createMicrophoneAndCameraTracks } from "agora-rtc-react";

const appId = "";
export const config:any = { mode: "rtc", codec: "vp8", appId: appId, token: null };
export const useClient = createClient(config);
export const useMediaDevice = createMicrophoneAndCameraTracks();
