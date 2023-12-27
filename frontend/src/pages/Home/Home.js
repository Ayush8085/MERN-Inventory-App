import { Link } from "react-router-dom";
import { MdOutlineInventory } from "react-icons/md";
// import HomeImg from "../../assets/home-img.jpg";

import './Home.css';

const Home = () => {
    return (
        <div className="home">

            {/* NAV SECTION */}
            <nav>
                <div className="left-nav">
                    <MdOutlineInventory />
                </div>

                <ul className="right-nav">
                    <li>
                        <button>
                            <Link to='/login'>Login</Link>
                        </button>
                    </li>
                    <li>
                        <button>
                            <Link to='/register'>Register</Link>
                        </button>
                    </li>
                    <li>
                        <button>
                            <Link to='/dashboard'>Dashboard</Link>
                        </button>
                    </li>
                </ul>
            </nav>

            {/* HERO SECTION */}
            <section>
                <div className="left-section">
                    <h3>Hero section</h3>
                </div>

                <div className="right-section">
                    {/* <img src={HomeImg} alt="Home image" /> */}
                </div>
            </section>

        </div>
    );
};

export default Home;