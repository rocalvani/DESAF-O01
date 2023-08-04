import {AnimatePresence} from "framer-motion"
import { useLocation} from 'react-router-dom';
import '../App.scss';
import Header from './Header';
import {ParallaxProvider} from 'react-scroll-parallax'
import {Routes, Route} from "react-router-dom";
import Animation from "./Animation";
import MainContainer from "./MainContainer";
import ItemDetailContainer from "./ItemDetailContainer"
import ShopContainer from "./ShopContainer"
import LogIn from "./LogIn"
import SignUp from "./SignUp"
import Reset from "./Reset"
import ResetForm from "./ResetForm"
import CartContainer from "./CartContainer";
import UserProvider from "../context/UserContext";
import { CookiesProvider } from "react-cookie";
import CartProvider from "../context/CartContext";
import EmailSent from "./EmailSent"
import UserProfile from "./UserProfile";
import LogOut from "./LogOut";
import AdminContainer from "./AdminContainer";
import FooterContainer from "./FooterContainer";

function App() {

  const location = useLocation()

  return (
    <CookiesProvider>
      <UserProvider>
      <CartProvider>
    <ParallaxProvider >
      <Header />
      <AnimatePresence 
      initial={false} 
      mode="wait">
      {/* <Outlet /> */}
     <Routes location={location} key={location.pathname}>
      <Route index element={<Animation />}/>
      <Route path="home" element={<MainContainer />}/>
      <Route path="login" element={<LogIn />}/>
      <Route path="signup" element={<SignUp />}/>
      <Route path="reset" element={<Reset />}/>
      <Route path="reset/:rid" element={<ResetForm />}/>
      <Route path="logout" element={<LogOut/>} />
      <Route path="shop" element={<ShopContainer />}/>
      <Route path="shop/:pid" element={<ItemDetailContainer />}/>
      <Route path="checkout/:cid" element={<CartContainer />}/>
      <Route path="checkout/:cid/purchase" element={<EmailSent />}/>
      <Route path="users/:uid" element={<UserProfile />} />
      <Route path="admin" element={<AdminContainer />} />
     </Routes>
     <FooterContainer/>
      </AnimatePresence>
      </ParallaxProvider>
      </CartProvider>
      </UserProvider>
      </CookiesProvider>
  );
}

export default App;
