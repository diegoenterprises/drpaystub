import React from 'react';
import { Zoom, Reveal } from 'react-reveal';

import { Route, BrowserRouter as Router, Switch, withRouter, Link } from 'react-router-dom';
import './Home.scss';
import Hero from './Hero';
import Introduction from './Introduction';
import HowItWorks from '../../HowItWorks/HowItWorks';
import Testimonials from '../../Testimonials/Testimonials';
import FeaturedIn from '../../FeaturedIn/FeaturedIn';
import Blogs from '../../Blogs/Blogs';
import Features from '../../Features/Features';

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
                {/* <div className="position-relative">
                    <a className="settings bg-white d-block" href="/">
                    <i className="mdi mdi-cog ml-1 mdi-24px position-absolute mdi-spin text-primary">
                        $5/stub
                    </i>
                    </a>
                </div> */}
                <Hero />
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
