import Hero from '../../components/Hero/Hero';
import BestSellers from '../../components/BestSellers/BestSellers';
import WhyChooseUs from '../../components/WhyChooseUs/WhyChooseUs';
import CustomerReviews from '../../components/CustomerReviews/CustomerReviews';


const Home = () => {
  return (
    <div className="home">
      <Hero />
      <BestSellers />
      <WhyChooseUs />
      <CustomerReviews />
    </div>
  );
};

export default Home;
