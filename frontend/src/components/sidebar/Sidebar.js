import menu from "../../data/sidebar";
import SidebarItem from "./SidebarItem";
import { MdOutlineInventory, MdMenuOpen } from "react-icons/md";
import './sidebar.css';
import { useState } from "react";
import { useNavigate } from "react-router-dom";


const Sidebar = ({ children }) => {
    const [isOpen, setIsOpen] = useState(true);
    const toggle = () => setIsOpen(!isOpen);
    const navigate = useNavigate();
    
    const goHome = () => {
        navigate("/")
    }

    return (
        <div className="layout">
            <div className="sidebar" style={{ width: isOpen ? ("230px") : ("80px") }}>
                <div className="top_section">
                    <div className="logo" style={{ display: isOpen ? 'block' : 'none' }}>
                        <MdOutlineInventory onClick={goHome}/>
                    </div>
                    <div className="hamburger" style={{ marginLeft: isOpen ? "100px" : "0px" }}>
                        <MdMenuOpen onClick={toggle} />
                    </div>
                </div>
                <div>
                    {menu.map((item, index) => (
                        <SidebarItem key={index} item={item} isOpen={isOpen} />
                    ))}
                </div>
            </div>
            <main style={{
                paddingLeft: isOpen ? "0px" : "10px",
                transition: "all .5s"
            }}>
                {children}
            </main>
        </div>
    )
}

export default Sidebar;