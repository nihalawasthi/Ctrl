import React from 'react';
import './styles/style.css';
import Face from './components/Face';
import FaceText from './components/FaceText';
import InputBox from './components/InputBox';

function App() {
  return (
    <div>
      <Face />
      <FaceText />
      <InputBox />
    </div>
  );
}

export default App;
