import React, { createContext, useState, useEffect, useContext } from 'react'
import { AuthContext } from './AuthContext'

export const dataContext = createContext()

function UserContext({ children }) {
    const { user } = useContext(AuthContext);
    const [input, setInput] = useState("")
    const [showResult, setShowResult] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [messages, setMessages] = useState([])
    const [conversations, setConversations] = useState([])
    const [activeConversationId, setActiveConversationId] = useState(null)

    useEffect(() => {
        if (user) {
            fetchConversations();
            const storedId = localStorage.getItem('activeConversationId');
            if (storedId) {
                loadConversation(storedId, true);
            }
        } else {
            setConversations([]);
            setMessages([]);
            setActiveConversationId(null);
            localStorage.removeItem('activeConversationId');
            setShowResult(false);
        }
    }, [user])

    async function fetchConversations() {
        if (!user) return;
        try {
            const response = await fetch('/api/conversations', { credentials: 'include' });
            if (response.ok) {
                const data = await response.json();
                setConversations(data);
            }
        } catch (err) {
            console.error("Failed to load conversations:", err);
        }
    }

    function newChat() {
        setActiveConversationId(null)
        localStorage.removeItem('activeConversationId');
        setShowResult(false)
        setLoading(false)
        setError(null)
        setMessages([])
    }

    async function loadConversation(id, isInitialLoad = false) {
        if (!user) return;
        try {
            setLoading(true);
            setError(null);
            
            const response = await fetch(`/api/conversations/${id}`, { credentials: 'include' });
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || "Failed to load conversation");
            }
            
            setActiveConversationId(id);
            localStorage.setItem('activeConversationId', id);
            setMessages(data.messages);
            setShowResult(data.messages.length > 0);
        } catch (err) {
            console.error(err);
            if (isInitialLoad) {
                newChat();
            } else {
                setError(err.message);
            }
        } finally {
            setLoading(false);
        }
    }

    async function deleteConversation(id) {
        if (!user) return;
        try {
            const response = await fetch(`/api/conversations/${id}`, {
                method: 'DELETE',
                credentials: 'include'
            });
            
            if (response.ok) {
                if (activeConversationId === id || localStorage.getItem('activeConversationId') === id) {
                    newChat();
                }
                await fetchConversations();
            }
        } catch (err) {
            console.error("Failed to delete conversation:", err);
        }
    }

    async function renameConversation(id, newTitle) {
        if (!user) return;
        try {
            const response = await fetch(`/api/conversations/${id}/rename`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ title: newTitle })
            });
            
            if (response.ok) {
                await fetchConversations();
            }
        } catch (err) {
            console.error("Failed to rename conversation:", err);
        }
    }

    async function sent(input) {
        if (!input.trim()) return;
        setError(null)
        setShowResult(true)
        setLoading(true)

        const newMessages = [...messages, { role: "user", content: input }];
        setMessages(newMessages);

        try {
            if (user) {
                let convId = activeConversationId;
                
                if (!convId) {
                    const createRes = await fetch('/api/conversations', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        credentials: 'include',
                        body: JSON.stringify({ messageContent: input })
                    });
                    const convData = await createRes.json();
                    if (!createRes.ok) throw new Error(convData.error || "Failed to create conversation");
                    
                    convId = convData._id;
                    setActiveConversationId(convId);
                    localStorage.setItem('activeConversationId', convId);
                    fetchConversations();
                }

                const msgRes = await fetch(`/api/conversations/${convId}/messages`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({ content: input })
                });

                const contentType = msgRes.headers.get('content-type');
                if (!contentType || !contentType.includes('application/json')) {
                    throw new Error("Unexpected server response. Please try again.");
                }
                const msgData = await msgRes.json();

                if (!msgRes.ok) {
                    throw new Error(msgData.error || "Failed to get AI response.");
                }

                setMessages(prev => [...prev, { role: "assistant", content: msgData.content }]);
            } else {
                const msgRes = await fetch('/api/chat/public', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ messages: newMessages })
                });
                const contentType = msgRes.headers.get('content-type');
                if (!contentType || !contentType.includes('application/json')) {
                    throw new Error("Unexpected server response. Please try again.");
                }
                const msgData = await msgRes.json();

                if (!msgRes.ok) throw new Error(msgData.error || "Failed to get AI response.");

                setMessages(prev => [...prev, { role: "assistant", content: msgData.content }]);
            }
        } catch (err) {
            console.error(err);
            setError(err.message || "Failed to process message. Please try again.")
        } finally {
            setLoading(false)
            setInput("")
        }
    }

    const data = {
        input,
        setInput,
        sent,
        loading,
        setLoading,
        showResult,
        setShowResult,
        messages,
        error,
        newChat,
        conversations,
        loadConversation,
        deleteConversation,
        renameConversation,
        activeConversationId
    }

    return (
        <dataContext.Provider value={data}>
            {children}
        </dataContext.Provider>
    )
}

export default UserContext
