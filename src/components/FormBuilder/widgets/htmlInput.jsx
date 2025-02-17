import { Input } from 'antd';
import React from 'react';

export default function HtmlInput(props) {
  const { value, disabled, readonly, options, onChange } = props;
  const handleChange = e => {
    const { value: newVal } = e.target;
    onChange(newVal && newVal.replace(/on(.*?=)/g, 'no$1'));
  };

  return (
    <Input
      disabled={disabled || readonly}
      {...options}
      onChange={handleChange}
      value={value && value.replace(/no(.*?=)/g, 'on$1')}
    />
  );
}
