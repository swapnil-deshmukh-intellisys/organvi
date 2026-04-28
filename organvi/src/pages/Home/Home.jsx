import Hero from '../../components/Hero/Hero';
import OrganicRange from '../../components/OrganicRange/OrganicRange';
import BestSellers from '../../components/BestSellers/BestSellers';
import WhyOrganvi from '../../components/WhyOrganvi/WhyOrganvi';
import PromotionalBanners from '../../components/PromotionalBanners/PromotionalBanners';
// import CustomerReviews from '../../components/CustomerReviews/CustomerReviews';
import RecentBlogs from '../../components/RecentBlogs/RecentBlogs';


const Home = () => {
  return (
    <div className="home">
      <Hero />
      <OrganicRange />
      <BestSellers />
      <WhyOrganvi />
      <PromotionalBanners />
      {/* <CustomerReviews /> */}
      <RecentBlogs />
    </div>
  );
};

export default Home;
