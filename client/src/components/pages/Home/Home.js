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
                  title="Professional Payroll Management Platform"
                  description="Cloud payroll management platform with bank-grade accuracy. Federal & state tax calculations, digital signatures, and 6 professional templates. Trusted by thousands of businesses."
                  path="/"
                  keywords="payroll management online, payroll documents, payroll compliance, professional payroll, instant payroll"
                />
                <Hero />
                <Pricing />
                <Introduction />
                <HowItWorks />
                <Testimonials />
                {/* <FeaturedIn /> */}
                <Blogs />
                <Features />
            </section>
        );
    }
}

export default Home;
