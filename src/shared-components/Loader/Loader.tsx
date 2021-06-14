import React from 'react';
import { Spin } from 'antd';

const Loader = () => {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <Spin size="large" />
    </div>
  );
};

export default React.memo(Loader);
