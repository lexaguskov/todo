import { useEffect, useState } from "react";
import { usePersistedState } from "./usePersistedState";

type UserInfo = {
  name: string;
}

const useGithubAuth = (server: string) => {
  const [authorized, setAuthorized] = usePersistedState('github-auth', false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  useEffect(() => {
    const run = async () => {
      try {
        const code = new URLSearchParams(window.location.search).get('code');
        if (!code) return;
        const res = await fetch(`${server}/authenticate/${code}`);
        const data = await res.json();

        if (data.access_token) {
          setAuthorized(data.access_token);
        }

        window.location.search = '';
      } catch (e) {
        console.error(e);
        setAuthorized(false);
      }
    }
    run();
  }, [server, setAuthorized]);

  useEffect(() => {
    if (!authorized) return;
    const run = async () => {
      try {
        const res = await fetch(`https://api.github.com/user`, {
          headers: {
            authorization: `Bearer ${authorized}`,
          },
        });
        const data = await res.json();
        if (!data.name) return;
        setUserInfo(data);
      } catch (e) {
        console.error(e);
        setUserInfo(null);
      }
    }
    run();
  }, [authorized]);

  return userInfo;
}

export default useGithubAuth;