import React, { useContext, useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { GiHamburgerMenu, GiPin } from "react-icons/gi";
import { FaPlus, FaTrash, FaEdit, FaSignOutAlt, FaRobot, FaUser, FaUserPlus, FaSearch, FaEllipsisV, FaThumbtack } from "react-icons/fa";
import { FaRegMessage } from "react-icons/fa6";
import { MdOutlineAdminPanelSettings, MdSettings } from "react-icons/md";
import "./Sidebar.css";
import { dataContext } from '../../context/UserContext';
import { AuthContext } from '../../context/AuthContext';

function Sidebar() {
  const [extend, setExtend] = useState(false);
  const { conversations, newChat, loadConversation, deleteConversation, renameConversation, activeConversationId } = useContext(dataContext);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [modalConfig, setModalConfig] = useState({ isOpen: false, type: '', data: null });
  const [inputValue, setInputValue] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarWidth, setSidebarWidth] = useState(() => {
    const saved = localStorage.getItem('shivang-ai-sidebar-width');
    const width = saved ? parseInt(saved, 10) : 320;
    return width >= 260 && width <= 420 ? width : 320;
  });
  const [isResizing, setIsResizing] = useState(false);
  const [activeMenu, setActiveMenu] = useState({ id: null, x: 0, y: 0 });
  
  const [pinnedIds, setPinnedIds] = useState(() => {
    const saved = localStorage.getItem('pinnedConversations');
    return saved ? JSON.parse(saved) : [];
  });

  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
      if (!event.target.closest('.chat-actions-dropdown') && !event.target.closest('.action-icon')) {
        setActiveMenu({ id: null, x: 0, y: 0 });
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        closeModal();
        setMenuOpen(false);
        setActiveMenu({ id: null, x: 0, y: 0 });
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const togglePin = (e, id) => {
    e.stopPropagation();
    setPinnedIds(prev => {
        const next = prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id];
        localStorage.setItem('pinnedConversations', JSON.stringify(next));
        return next;
    });
    setActiveMenu({ id: null, x: 0, y: 0 });
  };

  const openRenameModal = (e, item) => {
    e.stopPropagation();
    setInputValue(item.title);
    setModalConfig({ isOpen: true, type: 'RENAME', data: item });
    setActiveMenu({ id: null, x: 0, y: 0 });
  };

  const openDeleteModal = (e, item) => {
    e.stopPropagation();
    setModalConfig({ isOpen: true, type: 'DELETE', data: item });
    setActiveMenu({ id: null, x: 0, y: 0 });
  };

  const openProfileModal = () => {
    setMenuOpen(false);
    setModalConfig({ isOpen: true, type: 'PROFILE', data: user });
  };

  const handleCreateAccount = () => {
    setMenuOpen(false);
    setModalConfig({ isOpen: true, type: 'CREATE_ACCOUNT', data: null });
  };

  const handleLogout = () => {
    setMenuOpen(false);
    logout();
  };

  const closeModal = () => {
    setModalConfig({ isOpen: false, type: '', data: null });
    setInputValue('');
  };

  const handleModalConfirm = () => {
    const { type, data } = modalConfig;
    if (type === 'RENAME' && inputValue.trim()) {
      renameConversation(data._id, inputValue);
    } else if (type === 'DELETE') {
      deleteConversation(data._id);
    } else if (type === 'CREATE_ACCOUNT') {
      logout();
      navigate('/register');
    }
    closeModal();
  };

  const handlePointerDown = (e) => {
    e.target.setPointerCapture(e.pointerId);
    setIsResizing(true);
  };

  const handlePointerMove = (e) => {
    if (!isResizing) return;
    let newWidth = e.clientX;
    if (newWidth < 260) newWidth = 260;
    if (newWidth > 420) newWidth = 420;
    setSidebarWidth(newWidth);
  };

  const handlePointerUp = (e) => {
    if (!isResizing) return;
    setIsResizing(false);
    e.target.releasePointerCapture(e.pointerId);
    localStorage.setItem('shivang-ai-sidebar-width', sidebarWidth);
  };

  const filteredConversations = conversations.filter(c => c.title.toLowerCase().includes(searchQuery.toLowerCase()));

  const pinned = filteredConversations.filter(c => pinnedIds.includes(c._id));
  const unpinned = filteredConversations.filter(c => !pinnedIds.includes(c._id));

  const today = [];
  const yesterday = [];
  const previous7Days = [];
  const older = [];

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const yesterdayStart = todayStart - 86400000;
  const sevenDaysStart = todayStart - 7 * 86400000;

  unpinned.forEach(c => {
      const dateStr = c.updatedAt || c.createdAt;
      if (!dateStr) {
          older.push(c);
          return;
      }
      const time = new Date(dateStr).getTime();
      if (time >= todayStart) {
          today.push(c);
      } else if (time >= yesterdayStart) {
          yesterday.push(c);
      } else if (time >= sevenDaysStart) {
          previous7Days.push(c);
      } else {
          older.push(c);
      }
  });

  const renderConversationItem = (item) => {
    const isActive = activeConversationId === item._id;
    const isPinned = pinnedIds.includes(item._id);
    
    return (
      <div 
        className={`recent ${isActive ? 'active-chat' : ''}`} 
        key={item._id} 
        onClick={() => {
          loadConversation(item._id);
          if(window.innerWidth <= 768) setExtend(false);
        }}
        title={item.title}
      >
        <div className="chat-info">
            <FaRegMessage />
            {extend && <p>{item.title}</p>}
        </div>
        
        {extend && (
            <div className="chat-actions-container">
                <FaEllipsisV 
                    className="action-icon"
                    onClick={(e) => {
                        e.stopPropagation();
                        const rect = e.currentTarget.getBoundingClientRect();
                        setActiveMenu(
                            activeMenu.id === item._id 
                                ? { id: null, x: 0, y: 0 } 
                                : { id: item._id, x: rect.right, y: rect.bottom }
                        );
                    }}
                />
            </div>
        )}
      </div>
    );
  };

  return (
    <>
      <GiHamburgerMenu className="mobile-floating-btn" onClick={() => setExtend(true)} />
      <div className={`sidebar-overlay ${extend ? 'active' : ''}`} onClick={() => setExtend(false)}></div>
      <div 
        className={`sidebar ${extend ? 'extended' : ''} ${isResizing ? 'resizing' : ''}`}
        style={{ '--sidebar-width': `${sidebarWidth}px` }}
      >
        {extend && (
          <div 
            className="sidebar-resize-handle"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
          />
        )}
        <div className="sidebar-top">
          <div className="sidebar-header">
             <div className="logo-container">
               <FaRobot className="logo-icon" />
               {extend && (
                 <div className="logo-text">
                   <h2>Shivang AI</h2>
                   <span>AI Assistant</span>
                 </div>
               )}
             </div>
             <GiHamburgerMenu className="ham-menu" onClick={() => setExtend(prev => !prev)} />
          </div>

          <div className="newchat" onClick={newChat}>
            <FaPlus />
            {extend && <span>New Chat</span>}
          </div>

          {extend && (
            <div className="search-container">
              <FaSearch className="search-icon" />
              <input 
                type="text" 
                placeholder="Search conversations..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          )}
          
          <div className="conversations-list">
            {extend && pinned.length > 0 && <p className="section-title">Pinned</p>}
            {pinned.map(item => renderConversationItem(item))}

            {extend && today.length > 0 && <p className="section-title">Today</p>}
            {today.map(item => renderConversationItem(item))}

            {extend && yesterday.length > 0 && <p className="section-title">Yesterday</p>}
            {yesterday.map(item => renderConversationItem(item))}

            {extend && previous7Days.length > 0 && <p className="section-title">Previous 7 Days</p>}
            {previous7Days.map(item => renderConversationItem(item))}

            {extend && older.length > 0 && <p className="section-title">Older</p>}
            {older.map(item => renderConversationItem(item))}
          </div>
        </div>
        
        {user && (
          <div className="sidebar-bottom">
             <div className="user-profile-container" ref={menuRef}>
               <div className="user-profile" onClick={() => setMenuOpen(!menuOpen)}>
                 {extend ? (
                     <>
                        <div className="user-details">
                            <div className="avatar">{user.name.charAt(0).toUpperCase()}</div>
                            <div className="user-info-text">
                                <span className="user-name">{user.name}</span>
                                <span className="user-email">{user.email}</span>
                            </div>
                        </div>
                     </>
                 ) : (
                     <div className="avatar" title={user.name}>{user.name.charAt(0).toUpperCase()}</div>
                 )}
               </div>
               
               {/* Popover Menu */}
               {menuOpen && (
                 <div className={`profile-menu ${!extend ? 'menu-collapsed' : ''}`}>
                   <div className="menu-header">
                     <div className="avatar">{user.name.charAt(0).toUpperCase()}</div>
                     <div className="menu-header-info">
                       <span className="menu-name">{user.name}</span>
                       <span className="menu-email">{user.email}</span>
                       <span className="menu-role">{user.role}</span>
                     </div>
                   </div>
                   <div className="menu-divider"></div>
                   <div className="menu-item" onClick={openProfileModal}>
                     <FaUser /> My Profile
                   </div>
                   <div className="menu-item">
                     <MdSettings /> Settings
                   </div>
                   {user.role === 'admin' && (
                     <div className="menu-item" onClick={() => navigate('/admin')}>
                       <MdOutlineAdminPanelSettings /> Admin Dashboard
                     </div>
                   )}
                   <div className="menu-item" onClick={handleCreateAccount}>
                     <FaUserPlus /> Create New Account
                   </div>
                   <div className="menu-divider"></div>
                   <div className="menu-item text-danger" onClick={handleLogout}>
                     <FaSignOutAlt /> Logout
                   </div>
                 </div>
               )}
             </div>
          </div>
        )}
      </div>

      {/* Global Chat Actions Dropdown */}
      {activeMenu.id && (
        (() => {
          const activeMenuItem = conversations.find(c => c._id === activeMenu.id);
          if (!activeMenuItem) return null;
          const isActiveMenuPinned = pinnedIds.includes(activeMenu.id);
          return (
            <div 
                className="chat-actions-dropdown" 
                style={{ position: 'fixed', left: activeMenu.x - 120, top: activeMenu.y, zIndex: 1000 }}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="dropdown-item" onClick={(e) => togglePin(e, activeMenu.id)}>
                    <FaThumbtack /> {isActiveMenuPinned ? 'Unpin' : 'Pin'}
                </div>
                <div className="dropdown-item" onClick={(e) => openRenameModal(e, activeMenuItem)}>
                    <FaEdit /> Rename
                </div>
                <div className="dropdown-item text-danger" onClick={(e) => openDeleteModal(e, activeMenuItem)}>
                    <FaTrash /> Delete
                </div>
            </div>
          );
        })()
      )}

      {/* Reusable Modal Component */}
      {modalConfig.isOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            {modalConfig.type === 'RENAME' && (
              <>
                <h3>Rename Conversation</h3>
                <input 
                  type="text" 
                  value={inputValue} 
                  onChange={(e) => setInputValue(e.target.value)} 
                  autoFocus 
                  className="modal-input"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleModalConfirm();
                  }}
                />
              </>
            )}
            
            {modalConfig.type === 'DELETE' && (
              <>
                <h3>Delete Conversation?</h3>
                <p>Are you sure you want to delete <strong>{modalConfig.data?.title}</strong>?<br/>This action cannot be undone.</p>
              </>
            )}

            {modalConfig.type === 'PROFILE' && (
              <>
                <h3>My Profile</h3>
                <div className="profile-modal-info">
                  <div className="profile-modal-avatar">{modalConfig.data?.name?.charAt(0).toUpperCase()}</div>
                  <div className="profile-modal-details">
                    <p><strong>Name:</strong> {modalConfig.data?.name}</p>
                    <p><strong>Email:</strong> {modalConfig.data?.email}</p>
                    <p><strong>Role:</strong> {modalConfig.data?.role}</p>
                  </div>
                </div>
              </>
            )}

            {modalConfig.type === 'CREATE_ACCOUNT' && (
              <>
                <h3>Create New Account</h3>
                <p>You must log out of your current account to register a new one. Do you want to proceed?</p>
              </>
            )}

            <div className="modal-actions">
              {modalConfig.type !== 'PROFILE' && (
                <button className="btn-cancel" onClick={closeModal}>Cancel</button>
              )}
              {modalConfig.type === 'RENAME' && (
                <button className="btn-primary" onClick={handleModalConfirm}>Save</button>
              )}
              {modalConfig.type === 'DELETE' && (
                <button className="btn-primary btn-destructive" onClick={handleModalConfirm}>Delete</button>
              )}
              {modalConfig.type === 'PROFILE' && (
                <button className="btn-primary" onClick={closeModal}>Close</button>
              )}
              {modalConfig.type === 'CREATE_ACCOUNT' && (
                <button className="btn-primary" onClick={handleModalConfirm}>Proceed to Register</button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Sidebar;
