import React from 'react'
import { Helmet } from 'react-helmet';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();

  return (
    <>
      {/* <!-- Sidebar --> */}
      <ul className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion" id="accordionSidebar">

        {/* <!-- Sidebar - Brand --> */}
        <Link className="sidebar-brand d-flex align-items-center justify-content-center" to="/">
          <div className="sidebar-brand-icon rotate-n-15">
            <i className="fas fa-laugh-wink"></i>
          </div>
          <div className="sidebar-brand-text mx-3">1-Tap Admin</div>
        </Link>

        {/* <!-- Divider --> */}
        <hr className="sidebar-divider my-0" />

        {/* <!-- Nav Item - Dashboard --> */}
        <li className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}>
          <Link className="nav-link" id="dashboard-atag" to="/">
            <i className="fas fa-fw fa-tachometer-alt"></i>
            <span style={{ fontSize: '16px' }}>Dashboard</span></Link>
        </li>

        {/* <!-- Divider --> */}
        <hr className="sidebar-divider" />

        {/* <!-- Heading --> */}
        <div className="sidebar-heading">
          Resources
        </div>

        {/* <!-- Nav Item - Configuration --> */}
        <li className={`nav-item ${location.pathname === '/config' ? 'active' : ''}`}>
          <Link className="nav-link" to="/config">
            <i className="fas fa-fw fa-cog"></i>
            <span style={{ fontSize: '16px' }}>Configuration</span>
          </Link>
        </li>

        {/* <!-- Nav Item - Transactions --> */}
        <li className={`nav-item ${location.pathname === '/transactions' ? 'active' : ''}`}>
          <Link className="nav-link" to="/transactions">
            <i className="fas fa-fw fa-table"></i>
            <span style={{ fontSize: '16px' }}>Transactions</span>
          </Link>
        </li>

        {/* <!-- Nav Item - Chats --> */}
        <li className={`nav-item ${location.pathname === '/chats' ? 'active' : ''}`}>
          <Link className="nav-link" to="/chats">
            <i className="fas fa-fw fa-comment"></i>
            <span style={{ fontSize: '16px' }}>Chats</span>
          </Link>
        </li>

        {/* <!-- Nav Item - Users --> */}
        <li className={`nav-item ${location.pathname === '/users' ? 'active' : ''}`}>
          <Link className="nav-link" to="/users">
            <i className="fas fa-fw fa-user"></i>
            <span style={{ fontSize: '16px' }}>Users</span>
          </Link>
        </li>

        {/* <!-- Nav Item - Activities --> */}
        <li className={`nav-item ${location.pathname === '/activities' ? 'active' : ''}`}>
          <Link className="nav-link" to="/activities">
            <i className="fas fa-fw fa-tags"></i>
            <span style={{ fontSize: '16px' }}>Activities</span>
          </Link>
        </li>

        {/* <!-- Nav Item - Zalopay --> */}
        <li className={`nav-item ${location.pathname === '/zalopay' ? 'active' : ''}`}>
          <Link className="nav-link" to="/zalopay">
            <i className="fas fa-fw fa-money-bill"></i>
            <span style={{ fontSize: '16px' }}>Zalopay</span>
          </Link>
        </li>

        {/* <!-- Divider --> */}
        <hr className="sidebar-divider d-none d-md-block" />

        {/* <!-- Sidebar Toggler (Sidebar) --> */}
        <div className="text-center d-none d-md-inline">
          <button className="rounded-circle border-0" id="sidebarToggle"></button>
        </div>
      </ul>
      <Helmet>
        <script src="/js/sb-admin-2.min.js"></script>
      </Helmet>
    </>
  )
}

export default Sidebar