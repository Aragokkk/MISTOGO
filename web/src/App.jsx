import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import TableView from "./pages/Admin/TableView";

// Публічні сторінки
import Home from "./pages/Home/Home";
import Transport from "./pages/Transport/Transport";
import Cars from "./pages/Transport/Cars";
import Mopeds from "./pages/Transport/Mopeds";
import Scooters from "./pages/Transport/Scooters";
import Bikes from "./pages/Transport/Bikes";
import Zones from "./pages/Zones/Zones";
import Blog from "./pages/Blog/Blog";
import PostDetail from "./pages/Blog/PostDetail";
import FAQ from "./pages/FAQ/FAQ";
import Support from "./pages/Support/Support";
import Privacy from "./pages/Privacy/Privacy";
import Confidentiality from "./pages/Confidentiality/Confidentiality"; 

// Auth
import Auth from "./pages/Auth/Auth";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import ForgotPassword from "./pages/Auth/ForgotPassword";

// Кабінет
import User from "./pages/User/User";
import Profile from "./pages/User/Profile";
import Trips from "./pages/User/Trips";
import Payments from "./pages/User/Payments";
import Settings from "./pages/User/Settings";

// Адмін
import Admin from "./pages/Admin/Admin";
import Vehicles from "./pages/Admin/Vehicles";
import VehicleForm from "./pages/Admin/VehicleForm";
import Users from "./pages/Admin/Users";
import UserForm from "./pages/Admin/UserForm";
import Tarrifs from "./pages/Admin/Tarrifs";
import ZonesAdmin from "./pages/Admin/Zones";
import ZoneForm from "./pages/Admin/ZoneForm";
import Posts from "./pages/Admin/Posts";
import BlogPostForm from "./pages/Admin/BlogPostForm";
import TripForm from "./pages/Admin/TripForm";

// Службові
import NotFound from "./pages/System/NotFound";
import Unauthorized from "./pages/System/Unauthorized";

export default function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Публічні */}
        <Route path="/" element={<Home />} />
        <Route path="/transport" element={<Transport />} />
        <Route path="/transport/cars" element={<Cars />} />
        <Route path="/transport/mopeds" element={<Mopeds />} />
        <Route path="/transport/scooters" element={<Scooters />} />
        <Route path="/transport/bikes" element={<Bikes />} />
        <Route path="/zones" element={<Zones />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:id" element={<PostDetail />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/support" element={<Support />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/confidentiality" element={<Confidentiality />} /> 

        {/* Auth */}
        <Route path="/auth" element={<Auth />} />
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/register" element={<Register />} />
        <Route path="/auth/forgot" element={<ForgotPassword />} />

        {/* Кабінет */}
        <Route path="/user" element={<User />} />
        <Route path="/user/profile" element={<Profile />} />
        <Route path="/user/trips" element={<Trips />} />
        <Route path="/user/payments" element={<Payments />} />
        <Route path="/user/settings" element={<Settings />} />

        {/* Адмін */}
        <Route path="/admin" element={<Admin />} />
        
        {/* Vehicles */}
        <Route path="/admin/vehicles" element={<Vehicles />} />
        <Route path="/admin/vehicles/new" element={<VehicleForm />} />
        <Route path="/admin/vehicles/edit/:id" element={<VehicleForm />} />
        
        {/* Users */}
        <Route path="/admin/users" element={<Users />} />
        <Route path="/admin/users/new" element={<UserForm />} />
        <Route path="/admin/users/edit/:id" element={<UserForm />} />
        
        {/* Zones */}
        <Route path="/admin/zones" element={<ZonesAdmin />} />
        <Route path="/admin/zones/new" element={<ZoneForm />} />
        <Route path="/admin/zones/edit/:id" element={<ZoneForm />} />
        
        {/* Blog Posts */}
        <Route path="/admin/posts" element={<Posts />} />
        <Route path="/admin/posts/new" element={<BlogPostForm />} />
        <Route path="/admin/posts/edit/:id" element={<BlogPostForm />} />
        
        {/* Trips */}
        <Route path="/admin/trips/view/:id" element={<TripForm />} />
        
        {/* Other */}
        <Route path="/admin/tarrifs" element={<Tarrifs />} />
        <Route path="/admin/tables/:tableName" element={<TableView />} />

        {/* Службові */}
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </Router>
  );
}