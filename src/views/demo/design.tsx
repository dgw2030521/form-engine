/**
 * @description:
 * @author: dongguowei
 * @created: 2025/02/06
 */

import React from 'react';

import Generator from '@/components/FormBuilder';
import { getRandomString } from '@/utils/commonTools';

export default function DemoDesign() {
  const defaultValue = {
    type: 'object',
    properties: {
      inputName: {
        title: '输入框',
        type: 'string',
      },
    },
  };

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <Generator
        defaultValue={defaultValue}
        getId={name => {
          return `${name.split('_')[0]}_${getRandomString(6)}`;
        }}
      />
    </div>
  );
}
