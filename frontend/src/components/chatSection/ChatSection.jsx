import React, { useContext, useState, useEffect, useRef } from 'react'
import "./ChatSection.css"
import Darkmode from '../Darkmode/Darkmode'
import { LuSendHorizonal, LuCopy, LuRefreshCw } from "react-icons/lu";
import { FaRobot, FaReact, FaPython, FaDatabase, FaBug } from "react-icons/fa";
import RobotIcon from '../../assets/robot.svg';
import { dataContext } from '../../context/UserContext';
import { AuthContext } from '../../context/AuthContext';
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism'

const CodeBlock = ({ match, className, children, props }) => {
    const [isCopied, setIsCopied] = useState(false);
    const codeString = String(children).replace(/\n$/, '');
    
    const copyCode = () => {
        navigator.clipboard.writeText(codeString);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    return (
        <div className="code-block-wrapper">
            <div className="code-header">
                <span className="code-lang">{match[1]}</span>
                <button className="code-copy-btn" onClick={copyCode}>
                    {isCopied ? 'Copied ✓' : 'Copy'}
                </button>
            </div>
            <SyntaxHighlighter
                {...props}
                children={codeString}
                style={atomDark}
                language={match[1]}
                PreTag="div"
                customStyle={{ borderRadius: '0 0 8px 8px', margin: 0, padding: '15px', background: 'var(--btn-background-color)' }}
            />
        </div>
    );
};

function ChatSection() {
  const { sent, input, setInput, showResult, messages, error, loading } = useContext(dataContext)
  const { user } = useContext(AuthContext)
  
  const topSectionRef = useRef(null);
  const [copiedStates, setCopiedStates] = useState({});

  const scrollToBottom = () => {
    if (topSectionRef.current) {
      topSectionRef.current.scrollTo({
        top: topSectionRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading, error]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!loading && input.trim()) {
        sent(input);
      }
    }
  }

  const handleCopy = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedStates(prev => ({...prev, [index]: true}));
    setTimeout(() => {
        setCopiedStates(prev => ({...prev, [index]: false}));
    }, 2000);
  }

  const handleRegenerate = () => {
      if (messages.length > 0) {
          let lastUserMessage = "";
          for (let i = messages.length - 1; i >= 0; i--) {
              if (messages[i].role === 'user') {
                  lastUserMessage = messages[i].content;
                  break;
              }
          }
          if (lastUserMessage) {
              sent(lastUserMessage);
          }
      }
  }

  const handleCardClick = (prompt) => {
    setInput(prompt);
  }

  return (
    <div className='chatsection'>
        <div className="topsection" ref={topSectionRef}>
            {!showResult ? (
                <div className="empty-chat-screen">
                    <div className="welcome-texts">
                        <h1 className="gradient-text hello-text">HELLO {user ? user.name.toUpperCase() : 'GUEST'},</h1>
                        <h2 className="gradient-text sub-text">I'm Your Own Assistant</h2>
                        <p className="help-text">What can I help you...?</p>
                    </div>
                </div>
            ) : (
                <div className='result'>
                    {messages.map((msg, index) => (
                        msg.role === 'user' ? (
                            <div className="message-wrapper user-wrapper" key={index}>
                                <div className="userbox">
                                    <div className="user-text">
                                        <p>{msg.content}</p>
                                    </div>
                                    <div className="avatar user-avatar">{user ? user.name.charAt(0).toUpperCase() : 'G'}</div>
                                </div>
                            </div>
                        ) : (
                            <div className="message-wrapper ai-wrapper" key={index}>
                                <div className="aibox">
                                    <img src={RobotIcon} alt="AI" className="ai-robot-icon" />
                                    <div className="ai-content">
                                        <div className="markdown-body">
                                            <ReactMarkdown
                                                components={{
                                                    code({node, inline, className, children, ...props}) {
                                                        const match = /language-(\w+)/.exec(className || '')
                                                        return !inline && match ? (
                                                            <CodeBlock match={match} className={className} children={children} props={props} />
                                                        ) : (
                                                            <code {...props} className={className}>
                                                                {children}
                                                            </code>
                                                        )
                                                    }
                                                }}
                                            >
                                                {msg.content}
                                            </ReactMarkdown>
                                        </div>
                                        <div className="ai-actions">
                                            <button className="action-btn-text" onClick={() => handleCopy(msg.content, index)} title="Copy message">
                                                <LuCopy /> {copiedStates[index] ? 'Copied ✓' : 'Copy'}
                                            </button>
                                            {index === messages.length - 1 && !loading && (
                                                <button className="action-btn-text" onClick={handleRegenerate} title="Regenerate message">
                                                    <LuRefreshCw /> Regenerate
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    ))}
                    
                    {loading && (
                        <div className="message-wrapper ai-wrapper">
                            <div className="aibox">
                                <img src={RobotIcon} alt="AI" className="ai-robot-icon" />
                                <div className="loader">
                                    <div className="skeleton-line"></div>
                                    <div className="skeleton-line short"></div>
                                </div>
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="message-wrapper ai-wrapper">
                            <div className="aibox">
                                <img src={RobotIcon} alt="AI" className="ai-robot-icon" />
                                <div className="error-text">
                                    <p>{error}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>

        <div className="bottomsection">
            <div className="input-container">
                <Darkmode/>
                <textarea 
                    onChange={(e)=>setInput(e.target.value)} 
                    onKeyDown={handleKeyDown}
                    placeholder='Ask Shivang AI anything...' 
                    value={input}
                    rows={1}
                />
                <button 
                    id="sentbtn" 
                    disabled={loading || !input.trim()} 
                    onClick={() => sent(input)}
                >
                    <LuSendHorizonal />
                </button>
            </div>
        </div>
    </div>
  )
}

export default ChatSection
