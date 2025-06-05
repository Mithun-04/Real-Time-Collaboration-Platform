import { useState } from "react";
import "../styles/notification.css";
import { TbRefresh } from "react-icons/tb";
import Cookies from "universal-cookie";
import toast from "react-hot-toast";
import axios from "axios";

export default function Notification({ selectedProjectId }) {
  const [activeTab, setActiveTab] = useState("my-invitation");
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);

  const cookies = new Cookies();

  const colors = [
    '#FFB6C1', // Light Pink
    '#87CEFA', // Light Blue
    '#90EE90', // Light Green
    '#FFD700', // Gold
    '#FFA07A', // Light Salmon
    '#9370DB', // Medium Purple
    '#FF7F50', // Coral
    '#40E0D0', // Turquoise
    '#F08080', // Light Coral
    '#B0C4DE'  // Light Steel Blue
  ];

  // Hash function to pick a color based on project name
  function getColor(name) {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 8) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  }
  // Mock API call to search users - replace with your actual API endpoint
  const searchUsers = async (query) => {
    if (!query) {
      setSearchResults([]);
      return;
    }

    try {
      // Replace this with your actual API call
      const response = await fetch(`http://localhost:5000/api/users/search?query=${query}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      const data = await response.json();
      console.log('Search results:', data);
      setSearchResults((data || []))
    } catch (error) {
      console.error('Error searching users:', error);
      setSearchResults([]);
    }
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    searchUsers(query);
  };

  // Handle user selection
  const handleUserSelect = (user) => {
    if (!selectedUsers.some(selected => selected.name === user.name)) {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  // Handle user removal from selected list
  const handleUserRemove = (userName) => {
    setSelectedUsers(selectedUsers.filter(user => user.name !== userName));
  };

  // Handle invite button click
  const handleInvite = async () => {
    if (selectedUsers.length === 0) {
      alert('Please select at least one user to invite');
      return;
    }

    const token = cookies.get('token');
    if (!token) {
      toast.error('You must be logged in to send invitations');
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:5000/api/projects/${selectedProjectId}/invite`,
        selectedUsers,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      if (response.status == 200) {

        toast.success('Invitations sent successfully!');
      }
      setSelectedUsers([]); // Clear selection after successful invite
      setSearchQuery(''); // Clear search
      setSearchResults([]); // Clear search results
    } catch (error) {
      console.error('Error sending invitations:', error);
      const errorMsg = error.response?.data?.message || 'Error sending invitations';
      toast.error(errorMsg);
    }
  };

  return (
    <div className="notification-container">
      <div className="invitation-container">
        <div className="invitation-header">
          <div className="button-group">

            <button
              className={activeTab === "my-invitation" ? "active" : ""}
              onClick={() => setActiveTab("my-invitation")}
            >
              My Invitation
            </button>
            <button
              className={activeTab === "invite" ? "active" : ""}
              onClick={() => setActiveTab("invite")}
            >
              Invite
            </button>
            <button
              className={activeTab === "team-member" ? "active" : ""}
              onClick={() => setActiveTab("team-member")}
            >
              Team Member
            </button>
          </div>
          <div className="refresh-button">
            <TbRefresh
              className="refresh-icon"
              onClick={() => {
                // Add your refresh logic here
                console.log("Refresh clicked");
              }}
            />
          </div>
        </div>

        <div className="invitation-content">
          {activeTab === "my-invitation" && <div className="invitations">
            <div className="invitation-item">
              <div className="invitation-details">
                <h2>Project Name</h2>
                <p>Manager : Someone</p>
              </div>
              <div className="invitation-actions">
                <button className="accept-button">Accept</button>
                <button className="decline-button">Decline</button>
              </div>
            </div>
            <div className="invitation-item">
              <div className="invitation-details">
                <h2>Project Name</h2>
                <p>Manager : Someone</p>
              </div>
              <div className="invitation-actions">
                <button className="accept-button">Accept</button>
                <button className="decline-button">Decline</button>
              </div>
            </div>
            <div className="invitation-item">
              <div className="invitation-details">
                <h2>Project Name</h2>
                <p>Manager : Someone</p>
              </div>
              <div className="invitation-actions">
                <button className="accept-button">Accept</button>
                <button className="decline-button">Decline</button>
              </div>
            </div>
            <div className="invitation-item">
              <div className="invitation-details">
                <h2>Project Name</h2>
                <p>Manager : Someone</p>
              </div>
              <div className="invitation-actions">
                <button className="accept-button">Accept</button>
                <button className="decline-button">Decline</button>
              </div>
            </div>
          </div>}
          {activeTab === "invite" && <div className="invite-container" style={{ padding: '20px' }}>
            <div className="search-bar-container" style={{ marginBottom: '20px' }}>
              <input
                type="text"
                placeholder="Search by name or email"
                className="search-bar"
                value={searchQuery}
                onChange={handleSearchChange}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '5px',
                  border: '1px solid #ccc',
                }}
              />
            </div>

            {/* Search Results */}
            {searchQuery && (
              <div className="search-results">
                {searchResults.length > 0 ? (
                  searchResults.map(user => (
                    <div
                      key={user.name}
                      className={`search-result-item${selectedUsers.some(selected => selected.name === user.name) ? ' selected' : ''}`}
                      onClick={() => handleUserSelect(user)}
                    >
                      <div className="user-avatar" style={{ backgroundColor: getColor(user.name) }}>
                        {user.name[0]}
                      </div>
                      <div className="user-name">{user.name}</div>
                    </div>
                  ))
                ) : (
                  <div className="no-users-found">
                    No users found
                  </div>
                )}
              </div>
            )}

            {/* Selected Users List */}
            <div className="selected-users">
              <h3>Selected Users ({selectedUsers.length})</h3>
              {selectedUsers.length > 0 ? (
                <div className="selected-users-list">
                  {selectedUsers.map(user => (
                    <div
                      key={user.name}
                      className="selected-user-item"
                    >
                      <span>{user.name}</span>
                      <button
                        className="remove-user-btn"
                        onClick={() => handleUserRemove(user.name)}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-users-selected">No users selected</div>
              )}
            </div>

            {/* Invite Button */}
            <button
              onClick={handleInvite}
              style={{
                background: '#ff3b6c',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '5px',
                cursor: 'pointer',
                width: '100%',
              }}
            >
              Invite
            </button>
          </div>
          }
          {activeTab === "team-member" && <div>Team members list...</div>}
        </div>
      </div>

      <div className="meassage-container">
        {/* You can add conditional messaging UI here too */}
      </div>
    </div>
  );
}
