import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { 
  Car,
  Calendar, 
  Users, 
  ShoppingCart, 
  Settings, 
  HelpCircle,
  Home,
  Menu,
  X,
  MessageSquare,
  BookmarkCheck,
  IndianRupee,
  MapPinCheckInside,
  SquareCheckBig,
  SquareUser,
  Truck
} from 'lucide-react';

const Sidebar = () => {
  const [activeMenu, setActiveMenu] = React.useState(true);
  const [screenSize, setScreenSize] = React.useState(window.innerWidth);

  React.useEffect(() => {
    const handleResize = () => setScreenSize(window.innerWidth);
    window.addEventListener('resize', handleResize);
    
    if (screenSize <= 900) {
      setActiveMenu(false);
    } else {
      setActiveMenu(true);
    }
    
    return () => window.removeEventListener('resize', handleResize);
  }, [screenSize]);

  const handleCloseSideBar = () => {
    if (activeMenu !== undefined && screenSize <= 900) {
      setActiveMenu(false);
    }
  };

  const activeLink = 'flex items-center gap-3 pl-4 pt-3 pb-2.5 rounded-lg text-white bg-blue-600 text-md m-2';
  const normalLink = 'flex items-center gap-3 pl-4 pt-3 pb-2.5 rounded-lg text-md text-gray-700 hover:bg-blue-50 m-2';

  const links = [
    {
      title: 'Dashboard',
      links: [
        { name: 'home', icon: <Home size={20} />, text: 'Home' },
        { name: 'inventory', icon: <Truck size={20} />, text: 'Inventory' },
      ],
    },
    {
      title: 'Management',
      links: [
        { name: 'sales', icon: <ShoppingCart size={20} />, text: 'Sales' },
        { name: 'customers', icon: <Users size={20} />, text: 'Customers' },
        { name: 'employees', icon: <SquareUser size={20} />, text: 'Employees' },
        { name: 'transactions', icon: <IndianRupee size={20} />, text: 'Transactions'}, 
        { name: 'inquiries', icon: <MessageSquare size={20} />, text: 'Inquiries' },
        { name: 'reservations', icon: <BookmarkCheck size={20} />, text: 'Reservations'},
        { name: 'locations', icon: <MapPinCheckInside size={20} />, text: 'Locations' }
      ],
    },
    {
      title: 'Apps',
      links: [
        { name: 'calendar', icon: <Calendar size={20} />, text: 'Calendar' },
        { name: 'tasks', icon: <SquareCheckBig size={20} />, text: 'Tasks' },
      ],
    },
    {
      title: 'Settings',
      links: [
        { name: 'settings', icon: <Settings size={20} />, text: 'Settings' },
        { name: 'help', icon: <HelpCircle size={20} />, text: 'Help' },
      ],
    },
  ];

  return (
    <div className="flex">
      {/* Sidebar */}
      <div 
        className={`${
          activeMenu ? 'w-64' : 'w-20'
        } duration-300 h-screen bg-white shadow-md border-2 border-r-slate-300 relative`}
      >
        <div className={`h-screen ${activeMenu ? 'overflow-auto' : 'overflow-hidden'}`}>
          {/* Logo and Toggle */}
          <div className="flex items-center justify-between p-4 border border-b-slate-300">
            {activeMenu ? (
              <Link to="/" className="text-xl font-bold text-blue-600">Wheel Shift</Link>
            ) : (
              <Link to="/" className="text-xl font-bold text-blue-600">
                <Car size={24} />
              </Link>
            )}
            <button
              type="button"
              onClick={() => setActiveMenu(!activeMenu)}
              className="text-blue-600 rounded-full p-2 hover:bg-blue-50"
            >
              {activeMenu ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          {/* Navigation */}
          <div className="mt-5">
            {links.map((category) => (
              <div key={category.title} className="mb-5">
                {activeMenu && (
                  <p className="text-gray-400 m-3 mt-4 uppercase text-xs font-semibold">
                    {category.title}
                  </p>
                )}
                {category.links.map((link) => (
                  <NavLink
                    to={`/${link.name}`}
                    key={link.name}
                    onClick={handleCloseSideBar}
                    className={({ isActive }) => (isActive ? activeLink : normalLink)}
                  >
                    <span>{link.icon}</span>
                    {activeMenu && <span className="capitalize">{link.text}</span>}
                  </NavLink>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;