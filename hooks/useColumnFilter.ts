"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";

export function useColumnFilter(key: string, defaultValue = "") {
  const router = useRouter();
  const params = useSearchParams();
  const [value, setValue] = useState(params.get(key) ?? defaultValue);

  const update = useDebouncedCallback((val: string) => {
    const newParams = new URLSearchParams(params.toString());

    if (val) newParams.set(key, val);
    else newParams.delete(key);

    router.replace(`?${newParams.toString()}`);
  }, 400);

  const reset = () => {
    setValue(defaultValue);
  };

  return {
    value,
    setValue: (v: string) => {
      setValue(v);
      update(v);
    },
    reset
  };
}
