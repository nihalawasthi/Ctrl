import React from 'react';
import Spline from "@splinetool/react-spline";

const Face = () => {
  return (
    <div className="face">
      <script type="module" src="https://unpkg.com/@splinetool/viewer@1.9.46/build/spline-viewer.js"></script>
      <Spline
        loading-anim-type="none"
        scene="https://prod.spline.design/P8-vuPN4WxsqK5uF/scene.splinecode"
        />
    </div>
  );
};

export default Face;
