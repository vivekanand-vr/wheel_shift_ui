import Home from "../pages/Home";
import Dashboard from "../pages/Dashboard";
import Inventory from "../pages/Inventory";
import Clients from "../pages/Clients";
import Employees from "../pages/Employees";
import Sales from "../pages/Sales";
import Transactions from "../pages/Transactions";
import Inquiries from "../pages/Inquiries";
import Reservations from "../pages/Reservations";
import Locations from "../pages/Locations";
import Calendar from "../pages/Calendar";
import Tasks from "../pages/Tasks";

const protectedRoutes = [
    { path: "/", component: <Dashboard /> },
    { path: "/home", component: <Home /> },
    { path: "/dashboard", component: <Dashboard /> },
    { path: "/inventory", component: <Inventory /> },
    { path: "/customers", component: <Clients />},
    { path: "/employees", component: <Employees /> },
    { path: "/sales", component: <Sales /> },
    { path: "/transactions", component: <Transactions />},
    { path: "/inquiries", component: <Inquiries />},
    { path: "/reservations", component: <Reservations />},
    { path: "/locations", component: <Locations />},
    { path: "/calendar", component: <Calendar />},
    { path: "/tasks", component: <Tasks />},
  ];
  
  export default protectedRoutes;
  