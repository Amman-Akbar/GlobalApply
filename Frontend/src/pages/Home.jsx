import React from 'react'
import Hero from '../components/Home/Hero'
import Tabs from '../components/Home/Tabs'
import Banner from '../components/Home/Banner'
import AboutUs from '../components/Home/AboutUs'
import Testimonials from '../components/Home/Testimonials'
import LatestListings from '../components/Home/LatestListings'
import FeatureInstitutes from '../components/Home/FeatureInstitutes'
import ActiveListings from '../components/Home/ActiveListings'

const Home = () => {
  return (
    <>
      <Hero />
      <Banner />
      <FeatureInstitutes/>
      <Tabs/>
      <LatestListings/>
      <ActiveListings />
      <AboutUs/>
      <Testimonials/>
    </>
  )
}

export default Home