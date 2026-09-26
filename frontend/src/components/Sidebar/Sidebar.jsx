import React, { useContext, useState } from 'react'
import { GiHamburgerMenu } from "react-icons/gi";
import { FaPlus, FaTrash, FaEdit, FaSignOutAlt } from "react-icons/fa";
import { FaRegMessage } from "react-icons/fa6";
import "./Sidebar.css"
import { dataContext } from '../../context/UserContext';
import { AuthContext } from '../../context/AuthContext';

function Sidebar() {
  const [extend, setExtend] = useState(false)
  const { conversations, newChat, loadConversation, deleteConversation, renameConversation, activeConversationId } = useContext(dataContext)
  const { user, logout } = useContext(AuthContext);

  const handleRename = (e, item) => {
    e.stopPropagation();
    const newTitle = prompt("Enter new title for chat:", item.title);
    if (newTitle && newTitle.trim() !== "") {
        renameConversation(item._id, newTitle);
    }
  };

  return (
    <div className='sidebar' style={{ display: 'flex', flexDirection: 'column', height: '100vh', justifyContent: 'space-between' }}>
      <div>
          <GiHamburgerMenu id="ham" onClick={() => {
            setExtend(prev => !prev)
          }} />
          <div className="newchat" onClick={() => {
            newChat()
          }}>
            <FaPlus />
            {extend ? <p>New Chat</p> : null}
          </div>
          
          {extend && <p style={{marginLeft: '20px', color: 'var(--color)', opacity: 0.8, marginTop: '20px'}}>Recent</p>}
          
          <div style={{ maxHeight: '60vh', overflowY: 'auto', scrollbarWidth: 'none' }}>
              {conversations.map((item) => {
                const isActive = activeConversationId === item._id;
                return (
                  <div 
                    className="recent" 
                    key={item._id} 
                    style={{ 
                        backgroundColor: isActive ? 'var(--btn-background-color)' : 'transparent',
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        padding: '10px',
                        borderRadius: '50px',
                        marginBottom: '10px'
                    }}
                  >
                    <div 
                        style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, cursor: 'pointer', overflow: 'hidden' }}
                        onClick={() => loadConversation(item._id)}
                    >
                        <FaRegMessage />
                        {extend ? <p style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{item.title}</p> : null}
                    </div>
                    
                    {extend && (
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <FaEdit 
                                style={{ cursor: 'pointer', color: 'var(--color)', opacity: 0.6 }} 
                                onClick={(e) => handleRename(e, item)}
                            />
                            <FaTrash 
                                style={{ cursor: 'pointer', color: 'var(--color)', opacity: 0.6 }} 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (window.confirm("Are you sure you want to delete this chat?")) {
                                        deleteConversation(item._id);
                                    }
                                }}
                            />
                        </div>
                    )}
                  </div>
                )
              })}
          </div>
      </div>
      
      {user && (
          <div style={{ padding: '20px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
             {extend ? (
                 <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ color: 'var(--color)', fontWeight: 'bold' }}>{user.name}</span>
                        <span style={{ color: 'var(--color)', fontSize: '12px', opacity: 0.7 }}>{user.email}</span>
                    </div>
                    <FaSignOutAlt style={{ cursor: 'pointer', color: 'var(--color)' }} onClick={logout} />
                 </div>
             ) : (
                 <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <FaSignOutAlt style={{ cursor: 'pointer', color: 'var(--color)', fontSize: '20px' }} onClick={logout} />
                 </div>
             )}
          </div>
      )}
    </div>
  )
}

export default Sidebar
