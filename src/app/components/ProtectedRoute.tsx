import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../../context/authContext";
import { CircularProgress, Box } from "@mui/material";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) router.push("/login");
  }, [user, router]);

  if (!user) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
