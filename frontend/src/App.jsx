import "./App.css";
import React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Jobs from "./components/Jobs";
import Extra from "./components/Extra";
import About from "./components/About";
import Home from "./components/Home";
import Blog_Home from "./pages/Blog_Home";
import NotFound from "./pages/NotFound";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ProSidebarProvider } from "react-pro-sidebar";
import { Provider } from "react-redux";
import store from "./redux/store";
import LogIn from "./pages/LogIn";
import Register from "./pages/Register";
import AdminDashboard from "./admin/AdminDashboard";
import AdminRoute from "./components/AdminRoute";
import UserRoute from "./components/UserRoute";
import CreatePost from "./admin/CreatePost";
import Layout from "./admin/global/Layout";
import EditPost from "./admin/EditPost";
import UserDashboard from "./user/UserDashboard";
import SinglePost from "./pages/SinglePost";

//HOC
const AdminDashboardHOC = Layout(AdminDashboard);
const CreatePostHOC = Layout(CreatePost);
const EditPostHOC = Layout(EditPost);
const UserDashboardHOC = Layout(UserDashboard);

function App() {
  return (
    <div className="App">
      <ToastContainer />
      <Provider store={store}>
        <ProSidebarProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/blog" element={<Blog_Home />} />
              <Route path="/login" element={<LogIn />} />
              <Route path="/register" element={<Register />} />
              <Route path="/post/:id" element={<SinglePost />} />
              <Route
                path="/admin/dashboard"
                element={
                  <AdminRoute>
                    <AdminDashboardHOC />
                  </AdminRoute>
                }
              />
              <Route path="*" element={<NotFound />} />
              <Route
                path="/admin/post/create"
                element={
                  <AdminRoute>
                    <CreatePostHOC />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/post/edit/:id"
                element={
                  <AdminRoute>
                    <EditPostHOC />
                  </AdminRoute>
                }
              />
              <Route
                path="/user/dashboard"
                element={
                  <UserRoute>
                    <UserDashboardHOC />
                  </UserRoute>
                }
              />
              <Route path="/about" element={<About />} />
              <Route path="/jobs" element={<Jobs />} />
              <Route path="/companies" element={<Extra />} />
              {/* <Route path="/contact" element={<Contact/>}/> */}
              <Route path="/" element={<Home />} />
            </Routes>
          </BrowserRouter>
        </ProSidebarProvider>
      </Provider>
    </div>
  );
}

export default App;
