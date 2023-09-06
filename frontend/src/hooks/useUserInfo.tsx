import { useEffect, useState } from "react";
import { SERVER_HOSTNAME } from "../lib/config";
type UserInfo = {
  displayName: string;
  username: string;
  id: string;
  profileUrl: string;
  photos: { value: string }[];
};

const useUserInfo = () => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  useEffect(() => {
    const run = async () => {
      try {
        const res = await fetch(`${SERVER_HOSTNAME}/user`, {
          credentials: "include",
        });
        const data = await res.json();
        if (!data.id) return;
        setUserInfo(data);
      } catch (e) {
        console.error(e);
        setUserInfo(null);
      }
    };
    run();
  }, []);

  return userInfo;
};

export default useUserInfo;
