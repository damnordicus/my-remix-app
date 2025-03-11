import { User } from "@prisma/client";
import React from "react";
import { useSearchParams } from "react-router";

// TYPE GUARD FOR USER TYPE
function isUserObject(user: unknown): user is User {
  return (
    !!(user as User)?.id &&
    !!(user as User)?.username &&
    !!(user as User)?.phone &&
    !!(user as User)?.email
  );
}

export default function InputDropDown({
  labelText,
  options,
  setSelectedOption,
  selectedOption,
}: {
  labelText: string;
  options: unknown[];
  setSelectedOption: React.Dispatch<React.SetStateAction<string>>;
  selectedOption: string;
}) {
  const [searchParams, setSearchParams] = useSearchParams();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const item = e.target.value;
    setSelectedOption(item);

    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);

      if (item.length > 0) {
        newParams.set(labelText.toLowerCase(), item);
      } else {
        newParams.delete(labelText.toLowerCase());
      }

      return newParams;
    });
  };

  return (
    <div className="flex-col w-full mb-2">
      <label htmlFor="printerSelect" className="flex pl-4 pb-2 text-lg">
        {labelText}:
      </label>
      {options && options.length > 0 ? (
        <select
          name={labelText.toLowerCase()}
          className="flex ml-4 w-11/12 text-xl bg-slate-800/80 rounded-xl border border-slate-500 p-2"
          defaultValue={selectedOption || ''}
          onChange={(e) => handleChange(e)}
        >
          <option key={0} value=''></option>
          {options.map((item) => {
            if (isUserObject(item)) {
              return (
                <option key={item.id} value={item.username}>
                  {item.username}
                </option>
              );
            } else if (typeof item === "string") {
              return (
                <option key={item} value={item}>
                  {item}
                </option>
              );
            }
          })}
        </select>
      ) : (
        <p>No Options Found.</p>
      )}
    </div>
  );
}
