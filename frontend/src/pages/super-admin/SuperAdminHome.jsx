import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAxiosPrivate, useLogout } from "@/hooks";
import { Button } from "@chakra-ui/react";

const SuperAdminHome = () => {
  const navigate = useNavigate();
  const goBack = () => navigate(-1);
  const [users, setUsers] = useState();
  const axiosPrivate = useAxiosPrivate();
  const location = useLocation();
  const logout = useLogout();

  const signOut = async () => {
    await logout();
    navigate("/login");
  };

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const getUsers = async () => {
      try {
        const response = await axiosPrivate.get("/users", {
          signal: controller.signal,
        });
        isMounted && setUsers(response.data);
      } catch (err) {
        console.error(err);
        navigate("/login", { state: { from: location }, replace: true });
      }
    };

    getUsers();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  return (
    <div>
      <div>Super Admin Home</div>

      <article>
        <h2>Users List</h2>
        {users?.length ? (
          <ul>
            {users.map((user, i) => (
              <li key={i}>{user?.username}</li>
            ))}
          </ul>
        ) : (
          <p>No users to display</p>
        )}
      </article>

      <button onClick={goBack}>Go Back</button>
      <Button type="button" onClick={signOut}>
        Sign Out
      </Button>
    </div>
  );
};

export default SuperAdminHome;
