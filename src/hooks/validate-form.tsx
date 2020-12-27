import { useState } from "react";

export const useFormState = (initValues: any) => {
  const [data, setData] = useState(initValues);
  return [
    data,
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.type === "file") {
        setData({
          ...data,
          [e.target.name]: e.target.files?.item(0),
        });
        return;
      }
      setData({
        ...data,
        [e.target.name]: e.target.value,
      });
    },
  ];
};
