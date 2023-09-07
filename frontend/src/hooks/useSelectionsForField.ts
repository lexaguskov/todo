import { useMemo } from "react";
import { awareness, useUsername } from "../lib/store";
import { useUsers } from "y-presence";
import { Presence } from "../lib/types";

const SELECTION_LIFETIME_SEC = 120;

const EMPTY_OBJ = {};
const useSelectionsForField = (key: string) => {
  const now = Math.floor(Date.now() / 1000);
  const [myName] = useUsername();
  const users = useUsers(awareness) || EMPTY_OBJ;

  return useMemo(
    () =>
      Array.from(users.keys()) // convert from Map to array of keys
        .map((id) => users.get(id)) // convert to values
        .filter(
          (a) =>
            a &&
            a?.name !== myName && // ignore our own selection
            a?.selection?.key === key && // only show selections for this field
            a?.selection?.timestamp > now - SELECTION_LIFETIME_SEC, // only show selections that are less than 2 minutes old
        ) as Presence[],
    [now, myName, users, key],
  );
};

export default useSelectionsForField;
