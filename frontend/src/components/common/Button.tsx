import React from 'react';
import { Button as AntButton, ButtonProps as AntButtonProps } from 'antd';

type ButtonVariant = 'primary' | 'secondary' | 'danger';

interface ButtonStyleConfig {
  type: 'primary' | 'default';
  className: string;
  danger?: boolean;
}

type CustomButtonProps = Omit<AntButtonProps, 'type' | 'danger' | 'variant'> & {
  variant: ButtonVariant;
};

const variantStyles: Record<ButtonVariant, ButtonStyleConfig> = {
  primary: {
    type: 'primary',
    className: 'bg-blue-500 hover:bg-blue-600'
  },
  secondary: {
    type: 'default',
    className: 'bg-gray-500 hover:bg-gray-600 text-white'
  },
  danger: {
    type: 'primary',
    danger: true,
    className: 'bg-red-500 hover:bg-red-600'
  }
} as const;

export const Button: React.FC<CustomButtonProps> = ({
  variant,
  className = '',
  children,
  ...props
}) => {
  const variantStyle = variantStyles[variant];

  return (
    <AntButton
      {...props}
      type={variantStyle.type}
      danger={variantStyle.danger}
      className={`${variantStyle.className} ${className}`}
    >
      {children}
    </AntButton>
  );
};








