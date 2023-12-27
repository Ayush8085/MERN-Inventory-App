import { useState } from "react";
import { MdKeyboardArrowRight } from "react-icons/md";
import { NavLink } from "react-router-dom";

const SidebarItem = ({ item, isOpen }) => {
  const [expandMenu, setExpandMenu] = useState(false);
  // console.log("ITEM: ", item);

  if (item.childrens) {
    return (
      <div>
        <div className="sidebar-item">
          {item.icon && <div className="icons">{item.icon}</div>}
          {isOpen && <div>{item.title}</div>}
          <MdKeyboardArrowRight onClick={() => setExpandMenu(!expandMenu)} />
        </div>
        <div className="menu-expanded">
          {expandMenu &&
            <div>
              {item.childrens.map((child) => (
                <NavLink to={child.path}>
                  <div className="sidebar-item">
                    {child.icon && <div className="icons">{child.icon}</div>}
                    {isOpen && <div>{child.title}</div>}
                  </div>
                </NavLink>
              ))}
            </div>
          }
        </div>
      </div>
    )
  }
  else {
    return (
      <NavLink to={item.path}>
        <div className="sidebar-item">
          {item.icon && <div className="icons">{item.icon}</div>}
          {isOpen && <div>{item.title}</div>}
        </div>
      </NavLink>
    )
  }


}

export default SidebarItem;