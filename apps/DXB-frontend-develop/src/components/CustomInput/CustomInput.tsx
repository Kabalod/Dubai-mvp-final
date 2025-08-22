import React from "react";
import { Input, InputProps } from "antd";
import classNames from "classnames";
import styles from "./CustomInput.module.scss";

export type CustomInputProps = InputProps & {
  variant?: "default" | "ghost";
};

const CustomInput: React.FC<CustomInputProps> = ({ variant = "default", className, ...props }) => {
  const rootClass = classNames(styles.customInput, styles[variant], className);
  return <Input className={rootClass} {...props} />;
};

// Attach common subcomponents to keep API parity with antd
// Password input
(CustomInput as any).Password = Input.Password;
// OTP input (available in antd v5)
(CustomInput as any).OTP = (Input as any).OTP;

export type { InputProps };
export default CustomInput;


