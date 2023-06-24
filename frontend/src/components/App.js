
import { Outlet } from 'react-router-dom';
import '../App.scss';
import Header from './Header';
import {ParallaxProvider} from 'react-scroll-parallax'

function App() {
  return (
    <ParallaxProvider >
      <Header />
      <Outlet />
      </ParallaxProvider>
  );
}

export default App;
