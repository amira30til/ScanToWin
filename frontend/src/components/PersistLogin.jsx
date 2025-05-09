import { useRefreshToken } from "@/hooks";
import { useMutation } from "@tanstack/react-query";
import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import useAuthStore from "@/store";
import Spinner from "@/components/Spinner";

const PersistLogin = () => {
  const [isLoading, setIsLoading] = useState(true);
  const refresh = useRefreshToken();
  const auth = useAuthStore((state) => state.auth);

  const refreshMutation = useMutation({
    mutationFn: async () => await refresh(),
    onError: (error) => console.error(error),
    onSettled: () => setIsLoading(false),
  });

  useEffect(() => {
    // Always try to refresh if we don't have an access token
    !auth?.accessToken ? refreshMutation.mutate() : setIsLoading(false);
  }, []);

  return <>{isLoading ? <Spinner /> : <Outlet />}</>;
};

export default PersistLogin;
