import {AnimatePresence} from "framer-motion"
import { Outlet, useLocation} from 'react-router-dom';
import '../App.scss';
import Header from './Header';
import {ParallaxProvider} from 'react-scroll-parallax'
import {Routes, Route} from "react-router-dom";
import Animation from "./Animation";
import MainContainer from "./MainContainer";
import ItemDetailContainer from "./ItemDetailContainer"
import ShopContainer from "./ShopContainer"

function App() {

  const location = useLocation()

  return (
    <ParallaxProvider >
      <Header />
      <AnimatePresence 
      initial={false} 
      mode="wait">
      {/* <Outlet /> */}
     <Routes location={location} key={location.pathname}>
      <Route index element={<Animation />}/>
      <Route path="home" element={<MainContainer />}/>
      <Route path="shop" element={<ShopContainer />}/>
      <Route path="shop/:pid" element={<ItemDetailContainer />}/>
     </Routes>
      </AnimatePresence>
      </ParallaxProvider>
  );
}

export default App;
