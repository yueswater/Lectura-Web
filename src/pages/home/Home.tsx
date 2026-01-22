import Hero from '@/components/home/Hero';
import Footer from '@/components/layout/Footer';

const Home = () => {
    return (
        <div className="min-h-screen font-sans text-base-content bg-base-100">
            <Hero />
            <Footer />
        </div>
    );
};

export default Home;