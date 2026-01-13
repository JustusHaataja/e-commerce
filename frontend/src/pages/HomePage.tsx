import Hero from '../components/Hero';
import Category from '../components/Category';
import MonthlyPicks from '../components/MonthlyPicks';
import TipsBlog from '../components/TipsBlog';

const HomePage = () => {
    return (
        <div 
            style={{ gridTemplateColumns: "1fr" }}
        >
            <Hero />
            <Category />
            <MonthlyPicks />
            <TipsBlog />
        </div>
    )
}

export default HomePage