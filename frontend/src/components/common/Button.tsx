import React from 'react';



import { Button as AntButton } from 'antd';



import { ButtonProps as AntButtonProps } from 'antd/lib/button';







type ButtonVariant = 'primary' | 'secondary' | 'danger';







type CustomButtonProps = Omit<AntButtonProps, 'type' | 'variant'> & {
  variant?: ButtonVariant;
  htmlType?: 'button' | 'submit' | 'reset';
};







const Button: React.FC<CustomButtonProps> = ({
  variant = 'primary',
  htmlType = 'button',
  children,
  ...props
}) => {
  let buttonType: AntButtonProps['type'];
  let className = '';

  switch (variant) {
    case 'secondary':
      buttonType = 'default';
      className = 'bg-gray-200 text-gray-800 hover:bg-gray-300';
      break;
    case 'danger':
      buttonType = 'primary';
      className = 'bg-red-500 text-white hover:bg-red-600';
      break;
    default:
      buttonType = 'primary';
      className = 'bg-blue-500 text-white hover:bg-blue-600';
  }







  return (
    <AntButton
      {...props}
      type={buttonType}
      danger={variant === 'danger'}
      htmlType={htmlType}
      className={`${className} px-4 py-2 rounded-md transition-colors duration-200 ${props.className || ''}`}
    >
      {children}
    </AntButton>
  );
};







export default Button;








