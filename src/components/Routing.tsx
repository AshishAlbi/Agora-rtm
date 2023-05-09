import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./Login/Login";
import React, { useCallback, useState } from "react";
import Home from "./Home/Home";

function Routing() {
  const [userName, setUserName] = useState<string | null>(null)
  const selectedName=useCallback((data:string) => {
      if(data !==undefined){
        setUserName(data)
      }
    },[],
  )
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login name={selectedName}/>} />
        <Route path="home" element={<Home name={userName} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Routing;
