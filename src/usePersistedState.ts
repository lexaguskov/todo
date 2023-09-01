import local from "localforage";
import { useEffect, useState } from "react";

export function usePersistedState<T>(name: string, initial: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [value, setValue] = useState<T>(initial);

  useEffect(() => {
    local.getItem(name).then((val) => val !== null && setValue(val as T));
  }, [name]);

  useEffect(() => {
    local.setItem(name, value);
  }, [value, name]);

  return [value, setValue];
}
