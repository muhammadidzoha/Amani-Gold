import React from "react";
import propTypes from "prop-types";

const Input = ({
  htmlFor,
  title,
  type,
  id,
  name,
  placeholder,
  value,
  onChange,
  onBlur,
  style,
  styleLabel,
}) => {
  return (
    <div className="max-w-full">
      <label
        htmlFor={htmlFor}
        className={`block text-sm font-medium mb-3 dark:text-gold ${styleLabel}`}
      >
        {title}
      </label>
      <input
        type={type}
        id={id}
        name={name}
        onChange={onChange}
        onBlur={onBlur}
        value={value}
        className={`py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-gold focus:ring-gold disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600 ${style}`}
        placeholder={placeholder}
      />
    </div>
  );
};

Input.propTypes = {
  htmlFor: propTypes.string,
  title: propTypes.string,
  type: propTypes.string,
  id: propTypes.string,
  name: propTypes.string,
  value: propTypes.string,
  placeholder: propTypes.string,
  onChange: propTypes.func,
  onBlur: propTypes.func,
  style: propTypes.string,
  styleLabel: propTypes.string,
};

export default Input;
