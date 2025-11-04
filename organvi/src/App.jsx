
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import Navbar from './components/Navbar/Navbar';
import Categories from './components/Categories/Categories';
import Footer from './components/Footer/Footer';
import Chatbot from './components/Chatbot/Chatbot';
import ScrollToTop from './components/ScrollToTop/ScrollToTop';
import Home from './pages/Home/Home';
import Products from './pages/Products/Products';
import CategoriesPage from './pages/Categories/Categories';
import AllCategoriesPage from './pages/AllCategories/AllCategories';
import ContactPage from './pages/ContactPage/ContactPage';
import Returns from './pages/Returns/Returns';
import Shipping from './pages/Shipping/Shipping';
import FAQ from './pages/FAQ/FAQ';
import About from './pages/About/About';
import LoginModel from './pages/LoginModal/LoginModal';
import Cart from './pages/Cart/Cart';
import AddCart from './components/Cart/AddCart';
import Pulses from './components/Pulses/Pulses';
import DryFruits from './components/Dry_Fruits/DryFruits';
import Sweetener from './components/Sweetner/Sweetner';
import Spices from './components/Spices/Spices';
import Likeproduct from './components/Like/Likeproduct';
import SearchPage from './pages/Search/Search';
import Account from './components/Account/Account';
import Dashboard from './components/Dashboard/Dashboard';
import OrderConfirmationPage from './pages/OrderConfirmation/OrderConfirmationPage';
import OrderTracking from './components/Order/OrderTracking';
import OrderHistory from './pages/OrderHistory/OrderHistory';
import OrderSuccess from './pages/OrderSuccess/OrderSuccess';
import MyOrders from './pages/MyOrders/MyOrders';
import OrderDetails from './pages/OrderDetails/OrderDetails';
import Admin from './pages/Admin/Admin';

function App() {
  return (
    <UserProvider>
      <Router>
        <ScrollToTop />
        <div className="App">
          <Navbar />
          <Categories />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/categories" element={<CategoriesPage />} />
              <Route path="/allcategories" element={<AllCategoriesPage />} />
              <Route path="/pulses" element={<Pulses />} />
              <Route path="/dryfruits" element={<DryFruits />} />
              <Route path="/sweetener" element={<Sweetener />} />
              <Route path="/spices" element={<Spices />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/returns" element={<Returns />} />
              <Route path="/shipping" element={<Shipping />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/about" element={<About />} />
              <Route path="/loginmodel" element={<LoginModel />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/addcart" element={<AddCart />} />
              <Route path="/like" element={<Likeproduct />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/account" element={<Account />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
              <Route path="/order-tracking/:orderId" element={<OrderTracking />} />
              <Route path="/order-history" element={<OrderHistory />} />
              <Route path="/payment-success" element={<OrderSuccess />} />
              <Route path="/account/orders" element={<MyOrders />} />
              <Route path="/account/orders/:id" element={<OrderDetails />} />
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </main>
          <Footer />
          <Chatbot />
        </div>
      </Router>
    </UserProvider>
  );
}

export default App;