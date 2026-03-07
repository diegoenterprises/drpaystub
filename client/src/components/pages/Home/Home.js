import React from 'react';
import { Zoom, Reveal } from 'react-reveal';

import { Route, BrowserRouter as Router, Switch, withRouter, Link } from 'react-router-dom';
import './Home.scss';
import SEO from '../../SEO';
import Hero from './Hero';
import Introduction from './Introduction';
import HowItWorks from '../../HowItWorks/HowItWorks';
import Testimonials from '../../Testimonials/Testimonials';
import FeaturedIn from '../../FeaturedIn/FeaturedIn';
import Blogs from '../../Blogs/Blogs';
import Features from '../../Features/Features';
import Pricing from '../../Pricing/Pricing';

class Home extends React.Component {
    state = {};
   
   componentDidMount(){
   	if(typeof window !== 'undefined') {
   	 window.dataLayer.push({
         event: 'pageview'
    	});
	window.dataLayer.push({
         event: 'HomepageVisted'
        });
       }
   } 

    render() {
        return (
            <section className="home  bg-light d-table w-100">
                <SEO
                  title="Professional Paystub Generator"
                  description="Create professional, secure payroll check stubs in minutes. Bank-grade accuracy with federal & state tax calculations, digital signatures, and 6 premium templates. Trusted by thousands of businesses."
                  path="/"
                  keywords="paystub generator online, create pay stub, paycheck stub maker, professional paystub, instant paystub"
                />
                <Hero />
                <Introduction />
                <HowItWorks />
                <Testimonials />
                {/* <FeaturedIn /> */}
                <Blogs />
                <Features />
                <Pricing />
            </section>
        );
    }
}

export default Home;
