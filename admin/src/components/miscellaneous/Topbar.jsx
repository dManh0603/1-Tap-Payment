/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import NotificationsDropdown from '../NotificationsDropdown'
import MessagesDropdown from '../MessagesDropdown'
import { useNavigate } from 'react-router-dom'
import { UserState } from '../../contexts/UserProvider'

const Topbar = () => {
  const navigate = useNavigate();
  const { user, setUser } = UserState();

  const logoutHandler = () => {
    localStorage.removeItem('userToken');
    setUser(null);
    navigate('/')
  }

  return (
    <>
      {/* <!-- Topbar --> */}
      <nav className="navbar navbar-expand navbar-light bg-white topbar mb-2 static-top shadow">

        {/* <!-- Sidebar Toggle (Topbar) --> */}
        <button id="sidebarToggleTop" className="btn btn-link d-md-none rounded-circle mr-3">
          <i className="fa fa-bars"></i>
        </button>

        {/* <!-- Topbar Search --> */}
        <form className="d-none d-sm-inline-block form-inline mr-auto ml-md-3 my-2 my-md-0 mw-100 navbar-search">
          <div className="input-group">
            <input style={{ fontSize: '16px' }} type="text" className="form-control bg-light border-0 small" placeholder="Search for..." aria-label="Search"
              aria-describedby="basic-addon2" />
            <div className="input-group-append">
              <button className="btn btn-primary" type="button">
                <i className="fas fa-search fa-sm"></i>
              </button>
            </div>
          </div>
        </form>

        {/* <!-- Topbar Navbar --> */}
        <ul className="navbar-nav ml-auto">

          {/* <!-- Nav Item - Search Dropdown (Visible Only XS) --> */}
          <li className="nav-item dropdown no-arrow d-sm-none">
            <a className="nav-link dropdown-toggle" href="#" id="searchDropdown" role="button" data-toggle="dropdown"
              aria-haspopup="true" aria-expanded="false">
              <i className="fas fa-search fa-fw"></i>
            </a>
            {/* <!-- Dropdown - Messages --> */}
            <div className="dropdown-menu dropdown-menu-right p-3 shadow animated--grow-in" aria-labelledby="searchDropdown">
              <form className="form-inline mr-auto w-100 navbar-search">
                <div className="input-group">
                  <input type="text" className="form-control bg-light border-0 small" placeholder="Search for..."
                    aria-label="Search" aria-describedby="basic-addon2" />
                  <div className="input-group-append">
                    <button className="btn btn-primary" type="button">
                      <i className="fas fa-search fa-sm"></i>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </li>

          {/* <!-- Nav Item - Alerts --> */}
          <NotificationsDropdown />

          {/* <!-- Nav Item - Messages --> */}
          <MessagesDropdown />

          <div className="topbar-divider d-none d-sm-block"></div>

          {/* <!-- Nav Item - User Information --> */}
          <li className="nav-item dropdown no-arrow">
            <a className="nav-link dropdown-toggle" href="#" id="userDropdown" role="button" data-toggle="dropdown"
              aria-haspopup="true" aria-expanded="false">
              <span style={{ fontSize: '16px' }} className="mr-2 d-none d-lg-inline text-gray-600 small">{user.name}</span>
              <img alt='image404' className="img-profile rounded-circle" src="/img/undraw_profile.svg" />
            </a>
            {/* <!-- Dropdown - User Information --> */}
            <div style={{ fontSize: '16px' }} className="dropdown-menu dropdown-menu-right shadow animated--grow-in" aria-labelledby="userDropdown">
              <a className="dropdown-item" href="#">
                <i className="fas fa-user fa-sm fa-fw mr-2 text-gray-400"></i>
                Profile
              </a>
              <a className="dropdown-item" href="#">
                <i className="fas fa-cogs fa-sm fa-fw mr-2 text-gray-400"></i>
                Settings
              </a>
              <a className="dropdown-item" href="#">
                <i className="fas fa-list fa-sm fa-fw mr-2 text-gray-400"></i>
                Activity Log
              </a>
              <div className="dropdown-divider"></div>
              <a className="dropdown-item" onClick={logoutHandler} data-toggle="modal" data-target="#logoutModal">
                <i className="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>
                Logout
              </a>
            </div>
          </li>

        </ul>

      </nav>
      {/* <!-- End of Topbar --> */}
    </>

  )
}

export default Topbar