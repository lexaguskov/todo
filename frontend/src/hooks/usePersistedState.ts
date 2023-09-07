import local from "localforage";
import { useEffect, useState } from "react";

export function usePersistedState<T>(
  name: string,
  initial: T,
): [T, (val: T) => void] {
  const [value, setValue] = useState<T>(initial);

  useEffect(() => {
    local.getItem<T>(name).then((val) => val !== null && setValue(val));
  }, [name]);

  useEffect(() => {
    local.setItem(name, value);
  }, [value, name]);

  return [value, setValue];
}
