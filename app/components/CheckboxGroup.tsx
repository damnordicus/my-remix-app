import React from "react";

export default function CheckboxGroup({
  items,
  label,
  setSelected,
}: {
  items: string[];
  label: string;
  setSelected?: React.Dispatch<React.SetStateAction<string>>;
}) {
  function handleChange(e) {
    if (setSelected) {
      if (e.target.checked) {
        setSelected(e.target.value);
      } else {
        setSelected("");
      }
    }
  }

  const labelName = label.replaceAll(" ", "-").toLocaleLowerCase()

  return (
    <div className="flex-col">
      <h2 className="text-lg mb-1 text-center font-bold">{label}:</h2>
      {items.map((x, index) => {
          const labelId = `${labelName}-${index}`;
          return (
              <div key={labelId} className="flex justify-end gap-2">
                  <label key={x} htmlFor={labelId}>
                      {x}
                  </label><input
                      type="radio"
                      name={labelName}
                      id={labelId}
                      value={x}
                      className="mr-2"
                      onChange={(e) => handleChange(e)} />
              </div>
          );
      })}
    </div>
  );
}
