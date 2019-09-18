import React from 'react';
import './App.css';
import { SlidingWindowScrollHook } from "./SlidingWindowScrollHook";
import SlidingWindowScroll from "./SlidingWindowScroll";
import MY_ENDLESS_LIST from './Constants';
function App() {
  return (
    <div className="App">
     <h1>15个元素实现无限滚动</h1>
      {/* <SlidingWindowScroll list={MY_ENDLESS_LIST} height={195}/> */}
      <SlidingWindowScrollHook list={MY_ENDLESS_LIST} height={195}/>
    </div>
  );
}

export default App;
