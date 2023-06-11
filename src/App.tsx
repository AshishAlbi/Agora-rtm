import { ToastContainer } from "react-toastify";
import "./App.css";
// import { Broadcast } from "./components/Home/Home";
import Routing from "./components/Routing";
import VideoPlayer from "./components/VideoPlayer";


function App() {

    return (
        <>
        <ToastContainer/>
        <Routing/>
        {/* <Broadcast/> */}
        {/* <VideoPlayer/> */}
    
        </>
    );
}

export default App;
