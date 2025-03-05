import { User } from "@prisma/client";
import React from "react";

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
}: {
  labelText: string;
  options: unknown[];
  setSelectedOption: React.Dispatch<React.SetStateAction<string>>;
}) {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const item = e.target.value;
    setSelectedOption(item);
  };

  return (
    <div className="flex-col w-full">
      <label htmlFor="printerSelect" className="flex pl-4 pb-2 text-lg">
        {labelText}:
      </label>
      {options && options.length > 0 ? (
        <select
          name={labelText.toLowerCase()}
          className="flex ml-4 text-base w-11/12 py-3 pl-4 bg-slate-800/80 rounded-xl border border-slate-500"
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
