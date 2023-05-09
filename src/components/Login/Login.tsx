import { Button, Paper, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
type LoginProps = {
  name: any;
};
function Login(props: LoginProps) {
  const [nameErrors, setNameErrors] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const navigate = useNavigate();
  const handleInputChange = (event: any) => {
    const data = event.target.value;
    if (!data.trim().length) {
      setNameErrors("user name required");
    } else {
      setNameErrors(null);
      setUserName(data);
      props.name(data);
    }
  };
  const onJoin = () => {
    if (!userName?.trim().length) {
      setNameErrors("user name required");
      return;
    }
    navigate("/home");
  };
  useEffect(() => {
    localStorage.clear();
  }, []);
  return (
    <div>
      <Paper sx={{ height: "100vh", width: "100vw" ,display:"flex",flexDirection:"column",alignItems:"center"}}>
        <TextField
          error={nameErrors !== null}
          helperText={nameErrors}
          sx={{ width: "60%", marginTop: "1%" }}
          label="user name"
          onChange={(e) => {
            handleInputChange(e);
          }}
          name="userName"
        />
        <Button
          variant="contained"
          sx={{ width: "60%", marginTop: "1%" }}
          onClick={onJoin}
        >
          Join
        </Button>
      </Paper>
    </div>
  );
}

export default Login;
