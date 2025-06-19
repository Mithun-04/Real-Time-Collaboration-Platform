import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import "../styles/notification.css";
import { TbRefresh } from "react-icons/tb";
import { Cookie, Send } from 'lucide-react';
import Cookies from "universal-cookie";
import { format } from "timeago.js";
import toast from "react-hot-toast";
import axios from "axios";

const Notification = forwardRef(function Notification({ selectedProjectId }, ref) {
  const [activeTab, setActiveTab] = useState("my-invitation");
  const [messageContent, setmesssageContent] = useState("");
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [Invitations, setInvitations] = useState([]);
  const [projectMembers, setProjectMembers] = useState([]);
  const [messages, setMessages] = useState([]);
  const scrollRef = useRef();


  const cookies = new Cookies();

  useEffect(() => {
    fetchInvitations();// Fetch invitations when component mounts
  }, []);

  useEffect(() =>{
    scrollRef.current?.scrollIntoView({behavior : "smooth"});
  },[messages]);

  useEffect(() => {
    setSearchResults([]);
    setSearchQuery('');
    setSelectedUsers([]);
  }, [activeTab]);

  useEffect(() => {
    if (selectedProjectId) {
      fetchProjectMembers(selectedProjectId);
      fetchMessages(selectedProjectId);
    }
  }, [selectedProjectId]);

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
      hash = name.charCodeAt(i) + ((hash << 6) - hash);
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
  const fetchMessages = async (projectId) => {
    if (!projectId) return;
    const token = cookies.get('token');
    if (!token) return;
    try {
      const response = await axios.get(`http://localhost:5000/api/projects/conversation/${projectId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setMessages(response.data.messages || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Error fetching messages');
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

  const fetchProjectMembers = async (projectId) => {
    // const token = cookies.get('token');  
    try {
      if (!projectId) {
        toast.error('No project selected');
        return;
      }
      const token = cookies.get('token');
      if (!token) {
        toast.error('You must be logged in to send invitations');
        return;
      }
      const response = await axios.get(`http://localhost:5000/api/projects/${projectId}/members`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
      console.log('Fetched project members:', response.data.data);
      setProjectMembers(response.data.data || []);
      // return response.data.data || [];
    } catch (error) {
      console.error('Error fetching project members:', error);
      toast.error('Error fetching project members');
    }
  };
  // Fetch invitations for the current user
  const fetchInvitations = async () => {
    const token = cookies.get('token');
    if (!token) return;
    try {
      const response = await axios.get('http://localhost:5000/api/invitations', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      console.log('Fetched invitations:', response.data.data);
      setInvitations(response.data.data || []);
    } catch (error) {
      console.error('Error fetching invitations:', error);
    }
  };

  const handleAcceptInvitation = async (invitationId) => {
    const token = cookies.get('token');
    if (!token) return;
    try {
      const response = await axios.post(
        'http://localhost:5000/api/invitations/accept',
        { invitationId },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        }
      )
      if (response.status === 200) {
        toast.success('Invitation accepted successfully!');
        setInvitations(prev => prev.filter(invite => invite._id !== invitationId));
      }
      else {
        toast.error('Failed to accept invitation');
      }
    }
    catch (error) {
      console.error('Error accepting invitation:', error);
      const errorMsg = error.response?.data?.message || 'Error accepting invitation';
      toast.error(errorMsg);
    }

  }

  const handleDecliceInvitation = async (invitationId) => {
    const token = cookies.get('token');
    if (!token) return;
    try {
      const response = await axios.post(
        'http://localhost:5000/api/invitations/decline',
        { invitationId },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        }
      )
      if (response.status === 200) {
        toast.success('Invitation declined successfully!');
        setInvitations(prev => prev.filter(invite => invite._id !== invitationId));
      }
      else {
        toast.error('Failed to decline invitation');
      }
    }
    catch (error) {
      console.error('Error accepting invitation:', error);
      const errorMsg = error.response?.data?.message || 'Error accepting invitation';
      toast.error(errorMsg);
    }

  }

  const handleRefresh = () => {
    if (activeTab === "my-invitation") {
      fetchInvitations();
    }
    else if (activeTab === "team-member") {
      fetchProjectMembers(selectedProjectId);
    }
  }
  const handleSend = async (projectId) => {
    try {
      if (!projectId) return;
      const token = cookies.get('token');
      if (!token) return;
      const response = await axios.post(`http://localhost:5000/api/projects/conversation/${projectId}`, {
        content: messageContent
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.status) {
        setmesssageContent('');
        setMessages([...messages , response.data?.data || []]);
      }
    } catch (error) {
      console.error('Error Sending messages:', error);
      toast.error('Error Sending messages');
    }

  }
  useImperativeHandle(ref, () => ({
    refreshNotifications: () => {
      fetchInvitations();
      fetchMessages(selectedProjectId);
    }
  }));

  return (
    <div className="notification-container">
      <div className="invitation-container">
        <div className="invitation-header">
          <div className="button-group">

            <button
              className={activeTab === "my-invitation" ? "active" : ""}
              onClick={() => {
                fetchInvitations(); // Fetch invitations when this tab is clicked
                setActiveTab("my-invitation")
              }}
            >
              My Invitations
            </button>
            <button
              className={activeTab === "invite" ? "active" : ""}
              onClick={() => setActiveTab("invite")}
            >
              Invite
            </button>
            <button
              className={activeTab === "team-member" ? "active" : ""}
              onClick={() => { setActiveTab("team-member"), fetchProjectMembers(selectedProjectId) }}
            >
              Team Members
            </button>
          </div>
          <div className="refresh-button">
            <TbRefresh
              className="refresh-icon"
              onClick={() => {
                handleRefresh(); // Refresh invitations or project members based on active tab
              }}
            />
          </div>
        </div>

        <div className="invitation-content">
          {activeTab === "my-invitation" && (
            <div className="invitations">
              {Invitations.length > 0 ? (
                Invitations.map(invite => (
                  <div className="invitation-item" key={invite._id}>
                    <div className="invitation-details">
                      <h2>{invite.projectId?.name || 'Project'}</h2>
                      <p>Manager : {invite.projectId?.manager?.name || 'Unknown'}</p>
                    </div>
                    <div className="invitation-actions">
                      <button className="accept-button" onClick={() => handleAcceptInvitation(invite._id)}>Accept</button>
                      <button className="decline-button" onClick={() => handleDecliceInvitation(invite._id)}>Decline</button>
                    </div>
                  </div>
                ))
              ) : (
                <div>No invitations found</div>
              )}
            </div>
          )}
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
                      <div className="user-avatar" style={{ backgroundColor: getColor(user.name), color: 'black' }}>
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
          {activeTab === "team-member" && <div className="team-member-container">
            <h2>Project Members</h2>
            {projectMembers.length > 0 ? (
              <div className="project-members-list">
                {projectMembers.map(member => (
                  <div className="project-member-item" key={member.userId}>
                    <div className="member-avatar" style={{ backgroundColor: getColor(member.name), color: 'black' }}>
                      {member.name[0]}
                    </div>
                    <div className="member-details">
                      <h3>{member.name}</h3>
                      {/* <p>{member.email}</p> */}
                      <p className={`role${(member.role === 'manager') ? ' manager' : ''}`}>{member.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div>No members in this project</div>
            )}
          </div>}
        </div>
      </div>

      <div className="meassage-container">
        <div className="message-header">
          <h2>Messages</h2>
        </div>
        <div className="message-content">
          {messages.length > 0 ? (
            messages.map((msg) => (
              <div className={`message-item${msg.senderId?.name === cookies.get('user')?.name ? ' own' : ''}`} key={msg._id} ref = {scrollRef}>
                <div className="message-top">
                  <div className="message-avatar" style={{ backgroundColor: getColor(msg.senderId?.name || '?'), color: 'black' }}>
                    {msg.senderId?.name ? msg.senderId.name[0] : '?'}
                  </div>
                  <div className="message-details">
                    <div className="message-sender">{msg.senderId?.name === cookies.get("user")?.name ? 'You' : msg.senderId?.name}</div>
                    <div className="message-text">{msg.content}</div>
                  </div>
                </div>
                <div className="message-bottom">
                  <span className="message-time">{format(msg.createdAt)}</span>
                </div>
              </div>
            ))
          ) : (
            <div>No messages found</div>
          )}
        </div>
        <div className="message-footer">
          <textarea type="text" placeholder="Type your message here..." className="message-input" value={messageContent} onChange={e => { setmesssageContent(e.target.value) }} />
          <button className="send-button" onClick={() => { handleSend(selectedProjectId) }}>
              Send
          </button>
        </div>
      </div>
    </div>
  );
});

export default Notification;
