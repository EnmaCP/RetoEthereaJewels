import { useState } from "react";
import { useUser } from "./UserContext";
import { OrderHistory } from "./OrderHistory";
import "./UserProfilePage.css";
import setting from "../components/imagen/SettingIcon.png";
import userIcon from "../components/imagen/User2.png";
import packageIcon from "../components/imagen/package1.png";

export function UserProfilePage() {
  const { customer } = useUser();
  const [activeTab, setActiveTab] = useState("profile");
  
  // State for profile form (mock)
  const [formData, setFormData] = useState({
    username: customer?.username || "",
    email: customer?.email || "",
  });
  const [saveMessage, setSaveMessage] = useState("");

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API call
    setSaveMessage("Profile updated successfully!");
    setTimeout(() => setSaveMessage(""), 3000);
  };

  if (!customer) {
    return <div className="profile-loading">Loading profile...</div>;
  }

  return (
    <div className="profile-page-container">
      <div className="profile-header">
        <h1>My Account</h1>
        <p>Welcome back, {customer.username}</p>
      </div>

      <div className="profile-content">
        <div className="profile-sidebar">
          <ul className="profile-tabs">
            <li 
              className={activeTab === "profile" ? "active" : ""} 
              onClick={() => setActiveTab("profile")}
            > 
              <img src={userIcon} alt="Profile" className="tab-icon" style={{ width: '20px', height: '20px', marginRight: '10px', verticalAlign: 'middle' }} /> Profile Settings
            </li>
            <li 
              className={activeTab === "orders" ? "active" : ""} 
              onClick={() => setActiveTab("orders")}
            >
              <img src={packageIcon} alt="Orders" className="tab-icon" style={{ width: '20px', height: '20px', marginRight: '10px', verticalAlign: 'middle' }} /> Order History
            </li>
            <li 
              className={activeTab === "settings" ? "active" : ""} 
              onClick={() => setActiveTab("settings")}
            >
               <img src={setting} alt="Settings" className="tab-icon" style={{ width: '20px', height: '20px', marginRight: '10px', verticalAlign: 'middle' }} /> Account Settings
            </li>
          </ul>
        </div>

        <div className="profile-main">
          {activeTab === "profile" && (
            <div className="profile-section fade-in">
              <h2>Profile Information</h2>
              <p className="profile-desc">Update your account's profile information and email address.</p>
              
              <form className="profile-form" onSubmit={handleProfileSubmit}>
                <div className="form-group">
                  <label>Username</label>
                  <input 
                    type="text" 
                    value={formData.username} 
                    onChange={e => setFormData({...formData, username: e.target.value})}
                  />
                </div>
                
                <div className="form-group">
                  <label>Email Address</label>
                  <input 
                    type="email" 
                    value={formData.email} 
                    onChange={e => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                
                <div className="form-group">
                  <label>Role</label>
                  <input type="text" value={customer.role} disabled className="disabled-input" />
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn-save-profile">Save Changes</button>
                  {saveMessage && <span className="save-message">{saveMessage}</span>}
                </div>
              </form>
            </div>
          )}

          {activeTab === "orders" && (
            <div className="profile-section fade-in">
              <OrderHistory />
            </div>
          )}

          {activeTab === "settings" && (
            <div className="profile-section fade-in">
              <h2>Account Settings</h2>
              <p className="profile-desc">Manage your notification preferences and security settings.</p>
              
              <div className="settings-list">
                <div className="setting-item">
                  <div className="setting-info">
                    <h4>Email Notifications</h4>
                    <p>Receive emails about your order status.</p>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="slider"></span>
                  </label>
                </div>
                
                <div className="setting-item">
                  <div className="setting-info">
                    <h4>Promotional Emails</h4>
                    <p>Receive emails about new products and offers.</p>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" />
                    <span className="slider"></span>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
