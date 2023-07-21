import React from 'react'
import { Helmet } from 'react-helmet';
import { useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();

  return (
    <>
      {/* <!-- Sidebar --> */}
      <ul className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion" id="accordionSidebar">

        {/* <!-- Sidebar - Brand --> */}
        <a className="sidebar-brand d-flex align-items-center justify-content-center" href="/dashboard">
          <div className="sidebar-brand-icon rotate-n-15">
            <i className="fas fa-laugh-wink"></i>
          </div>
          <div className="sidebar-brand-text mx-3">1-Tap Admin</div>
        </a>

        {/* <!-- Divider --> */}
        <hr className="sidebar-divider my-0" />

        {/* <!-- Nav Item - Dashboard --> */}
        <li className={`nav-item ${location.pathname === '/dashboard' ? 'active' : ''}`}>
          <a className="nav-link" id="dashboard-atag" href="/dashboard">
            <i className="fas fa-fw fa-tachometer-alt"></i>
            <span style={{ fontSize: '16px' }}>Dashboard</span></a>
        </li>

        {/* <!-- Divider --> */}
        <hr className="sidebar-divider" />

        {/* <!-- Heading --> */}
        <div className="sidebar-heading">
          Resources
        </div>

        {/* <!-- Nav Item - Configuration --> */}
        <li className={`nav-item ${location.pathname === '/config' ? 'active' : ''}`}>
          <a className="nav-link" href="/config">
            <i className="fas fa-fw fa-cog"></i>
            <span style={{ fontSize: '16px' }}>Configuration</span>
          </a>
        </li>

        {/* <!-- Nav Item - Transactions --> */}
        <li className={`nav-item ${location.pathname === '/transactions' ? 'active' : ''}`}>
          <a className="nav-link" href="/transactions">
            <i className="fas fa-fw fa-table"></i>
            <span style={{ fontSize: '16px' }}>Transactions</span>
          </a>
        </li>

        {/* <!-- Nav Item - Chats --> */}
        <li className={`nav-item ${location.pathname === '/chats' ? 'active' : ''}`}>
          <a className="nav-link" href="/chats">
            <i className="fas fa-fw fa-comment"></i>
            <span style={{ fontSize: '16px' }}>Chats</span>
          </a>
        </li>

        {/* <!-- Nav Item - Users --> */}
        <li className={`nav-item ${location.pathname === '/users' ? 'active' : ''}`}>
          <a className="nav-link" href="/users">
            <i className="fas fa-fw fa-user"></i>
            <span style={{ fontSize: '16px' }}>Users</span>
          </a>
        </li>

        {/* <!-- Nav Item - Activities --> */}
        <li className={`nav-item ${location.pathname === '/activities' ? 'active' : ''}`}>
          <a className="nav-link" href="/activities">
            <i className="fas fa-fw fa-tags"></i>
            <span style={{ fontSize: '16px' }}>Activities</span>
          </a>
        </li>

        {/* <!-- Nav Item - Zalopay --> */}
        <li className={`nav-item ${location.pathname === '/zalopay' ? 'active' : ''}`}>
          <a className="nav-link" href="/zalopay">
            <i className="fas fa-fw fa-tags"></i>
            <span style={{ fontSize: '16px' }}>Zalopay</span>
          </a>
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