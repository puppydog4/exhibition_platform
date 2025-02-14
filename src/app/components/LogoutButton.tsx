import { Button } from "@mui/material";
import { useAuth } from "../../context/authContext";

const LogoutButton = () => {
  const { signOut } = useAuth();

  return (
    <Button variant="contained" color="secondary" onClick={signOut}>
      Logout
    </Button>
  );
};

export default LogoutButton;
