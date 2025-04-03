import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faUtensils,
  faChartPie,
  faPlusCircle,
  faUserPlus,
  faBell,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import './AdminLandingPage.css';

function AdminLandingPage() {
  return (
    <div className="admin-container">
      <h1 className="admin-title">Admin Dashboard</h1>
      <div className="admin-grid">
        {/* Message */}
        <Link to="/admin/message" className="admin-card">
          <FontAwesomeIcon icon={faEnvelope} className="admin-icon" />
          <p className="admin-card-text">Messages</p>
        </Link>

        {/* Cook Mode */}
        <Link to="/admin/cook-mode" className="admin-card">
          <FontAwesomeIcon icon={faUtensils} className="admin-icon" />
          <p className="admin-card-text">Cook Mode</p>
        </Link>

        {/* Ratio and Sizes */}
        <Link to="/admin/ratio-and-sizes" className="admin-card">
          <FontAwesomeIcon icon={faChartPie} className="admin-icon" />
          <p className="admin-card-text">Ratio and Sizes</p>
        </Link>

        {/* Add New Meal */}
        <Link to="/admin/add-new-meal" className="admin-card">
          <FontAwesomeIcon icon={faPlusCircle} className="admin-icon" />
          <p className="admin-card-text">Add New Meal/Update</p>
        </Link>

        {/* Create Account */}
        <Link to="/create-account" className="admin-card">
          <FontAwesomeIcon icon={faUserPlus} className="admin-icon" />
          <p className="admin-card-text">Add Cook/Staff</p>
        </Link>

        {/* Alert Cook About Visitor */}
        <Link to="/admin/visitors" className="admin-card">
          <FontAwesomeIcon icon={faBell} className="admin-icon" />
          <p className="admin-card-text">Alert Cook About Visitor</p>
        </Link>

        {/* Manage Users */}
        <Link to="/admin/mngUsers" className="admin-card">
          <FontAwesomeIcon icon={faUsers} className="admin-icon" />
          <p className="admin-card-text">Manage Users</p>
        </Link>
      </div>
    </div>
  );
}

export default AdminLandingPage;