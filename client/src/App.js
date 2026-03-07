import React, { Suspense } from "react";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import "./App.scss";
import ScrollToTop from "react-scroll-up";

//redux
import { Provider } from "react-redux";
import Store from "./redux/store/index";

//pages
import Home from "./components/pages/Home/Home";
import Error from "./components/pages/Error";
import Contact from "./components/pages/Contact/Contact";

//pages
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import W2 from "./components/pages/W2Form/W2Form";
import "bootstrap/dist/js/bootstrap.min.js";
import "font-awesome/css/font-awesome.min.css";
import Blogs from "./components/pages/Blog/Blogs";
import SingleBlog from "./components/pages/Blog/SingleBlog";
import PayStubForm from "./components/pages/PayStubForm/PayStubForm";
import Review from "./components/pages/Reviews/Review";
import AboutUs from "./components/pages/About/About";
import Privacy from "./components/pages/PrivacyPolicy/PrivacyPolicy";
import TermsAndCondition from "./components/pages/Terms and conditions/TermsAndCondition";
import Success from "./components/pages/PayStubForm/Success";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import { Spinner } from "react-bootstrap";
import UserProfile from "./components/pages/Dashboard/Profile";
import VerifyEmailForm from "./components/VerifyEmail";
import Dashboard from "./components/pages/Dashboard/Dashboard";
import Paystub from "./components/pages/Dashboard/Paystub";
import ViewPaystub from "./components/pages/Dashboard/ViewPaystub";
import ForgotPasswordForm from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import ChangePassword from "./components/pages/Dashboard/ChangePassword";
import AdminDashboard from "./components/pages/Dashboard/AdminDashboard";
import AdminPage from "./components/pages/Admin/AdminPage";
import SuccessForm from "./components/Success";
import FailureForm from "./components/Failure";
import TemplateShowcase from "./components/pages/TemplateShowcase/TemplateShowcase";
import W2Wizard from "./components/pages/W2Wizard/W2Wizard";

const MainLayout = () => {
  const storage = localStorage.getItem("tokens");
  return (
    <>
      <Header />
      <Switch>
        {/* Home */}
        <Route exact path="/" component={Home} />
        <Route exact path="/home" component={Home} />
        {!storage && <Route exact path="/login" component={LoginForm} />}
        {!storage && (
          <Route exact path="/register" component={RegisterForm} />
        )}
        {!storage && (
          <Route exact path="/verify-email" component={VerifyEmailForm} />
        )}
        {!storage && (
          <Route
            exact
            path="/forgot-password"
            component={ForgotPasswordForm}
          />
        )}
        <Route exact path="/reset-password/:email/:token" component={ResetPassword} />
        <Route exact path="/success" component={SuccessForm} />
        <Route exact path="/failure" component={FailureForm} />

        <Route exact path="/error" component={Error} />
        <Route
          exact
          path="/dashboard"
          component={Dashboard}
        />

        <Route exact path="/dashboard/profile" component={UserProfile} />
        <Route exact path="/dashboard/paystub" component={Paystub} />
        <Route exact path="/dashboard/paystub/:id" component={ViewPaystub} />
        <Route exact path="/dashboard/change-password" component={ChangePassword} />
        <Route exact path="/dashboard/admin" component={AdminDashboard} />

        <Route exact path="/contact" component={Contact} />
        <Route exact path="/blogs" component={Blogs} />
        <Route exact path="/blogs/:id" component={SingleBlog} />
        <Route exact path="/paystubs" component={PayStubForm} />
        <Route exact path="/paystubs/success/:id" component={Success} />
        <Route exact path="/reviews" component={Review} />
        <Route exact path="/about" component={AboutUs} />
        <Route exact path="/privacyPolicy" component={Privacy} />
        <Route exact path="/w2form" component={W2} />
        <Route exact path="/w2-wizard" component={W2Wizard} />

        <Route
          exact
          path="/terms-and-conditions"
          component={TermsAndCondition}
        />
        <Route exact path="/templates" component={TemplateShowcase} />
        <Route exact path="/w2forms" component={W2} />
      </Switch>
      <Footer />
    </>
  );
};

const App = () => {
  return (
    <Provider store={Store().store}>
      <Router>
        <Switch>
          <Route exact path="/admin" component={AdminPage} />
          <Route path="/" component={MainLayout} />
        </Switch>
        <ScrollToTop showUnder={160}>
          <span className="scrollToTop">
            <i className="fa fa-chevron-up"></i>
          </span>
        </ScrollToTop>
      </Router>
    </Provider>
  );
};

export default App;
