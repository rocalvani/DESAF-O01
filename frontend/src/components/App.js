import {AnimatePresence} from "framer-motion"
import { useLocation} from 'react-router-dom';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
import WishProvider from "../context/WishContext";
import CheckoutContainer from "./CheckoutContainer";

function App() {

  const location = useLocation()

  return (
    <CookiesProvider>
      <UserProvider>
      <CartProvider>
        <WishProvider>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
    <ParallaxProvider >
      {location.pathname =="/" ? null : <Header />}
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
      <Route path="checkout/:cid" element={<CheckoutContainer />}/>
      <Route path="checkout/:cid/purchase" element={<EmailSent />}/>
      <Route path="users/:uid" element={<UserProfile />} />
      <Route path="admin" element={<AdminContainer />} />
     </Routes>
     {location.pathname == "/" ? null :      <FooterContainer/>
}
      </AnimatePresence>
      </ParallaxProvider>
      </WishProvider>
      </CartProvider>
      </UserProvider>
      </CookiesProvider>
  );
}

export default App;
