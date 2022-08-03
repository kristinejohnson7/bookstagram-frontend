import React from "react";
import "./FormBody.css";

export default function Form({ onChange, formValues }) {
  return (
    <>
      {formValues.map((input) => (
        <div key={input.key}>
          {!!input.error && <p className="inputErrorMsg">*{input.error}</p>}
          <label htmlFor={input.forLabel}>
            {input?.label}
            <input
              className="form-control"
              type={input.type}
              value={input.value}
              name={input.name}
              defaultValue={input?.defaultValue}
              onChange={onChange}
              placeholder={input.placeholder}
            />
          </label>
        </div>
      ))}
    </>
  );
}
