import React, { useContext } from 'react'
import "./ChatSection.css"
import Darkmode from '../Darkmode/Darkmode'
import { LuSendHorizonal, LuCopy, LuRefreshCw } from "react-icons/lu";
import { dataContext } from '../../context/UserContext';
import { AuthContext } from '../../context/AuthContext';
import userImg from "../../assets/user.png"
import ai from "../../assets/ai.png"
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism'

function ChatSection() {

const { sent, input, setInput, showResult, messages, error, loading } = useContext(dataContext)
const { user } = useContext(AuthContext)

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!loading && input.trim()) {
        sent(input);
      }
    }
  }

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
  }

  const handleRegenerate = () => {
      if (messages.length > 0) {
          // Find last user message
          let lastUserMessage = "";
          for (let i = messages.length - 1; i >= 0; i--) {
              if (messages[i].role === 'user') {
                  lastUserMessage = messages[i].content;
                  break;
              }
          }
          if (lastUserMessage) {
              sent(lastUserMessage); // Regenerates response based on last input
          }
      }
  }

  return (
    <div className='chatsection'>
        <div className="topsection">
{!showResult ? <div className="headings">
    <span>HELLO {user ? user.name.toUpperCase() : "GUEST"},</span>
    <span>I'm Your Own Assistant</span>
    <span>What can I help you...?</span>
</div> : <div className='result'>
  {messages.map((msg, index) => (
    msg.role === 'user' ? (
      <div className="userbox" key={index}>
        <img src={userImg} alt="" width="60px"/>
        <p>{msg.content}</p>
      </div>
    ) : (
      <div className="aibox" key={index} style={{ position: 'relative' }}>
        <img src={ai} alt="" width="60px"/>
        <div className="markdown-body" style={{ flex: 1 }}>
          <ReactMarkdown
            components={{
              code({node, inline, className, children, ...props}) {
                const match = /language-(\w+)/.exec(className || '')
                return !inline && match ? (
                  <SyntaxHighlighter
                    {...props}
                    children={String(children).replace(/\n$/, '')}
                    style={atomDark}
                    language={match[1]}
                    PreTag="div"
                  />
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
          
          <div style={{ display: 'flex', gap: '15px', marginTop: '10px', opacity: 0.6 }}>
              <LuCopy style={{ cursor: 'pointer' }} onClick={() => handleCopy(msg.content)} title="Copy" />
              {index === messages.length - 1 && !loading && (
                  <LuRefreshCw style={{ cursor: 'pointer' }} onClick={handleRegenerate} title="Regenerate" />
              )}
          </div>
        </div>
      </div>
    )
  ))}
  
  {loading && <div className="aibox">
    <img src={ai} alt="" width="60px"/>
    <div className='loader' style={{ flex: 1 }}>
      <hr />
      <hr />
      <hr />
    </div>
  </div>}

  {error && <div className="aibox">
    <img src={ai} alt="" width="60px"/>
    <p style={{ color: 'red' }}>{error}</p>
  </div>}
      </div>}

        </div>
        <div className="bottomsection">
<textarea 
  onChange={(e)=>setInput(e.target.value)} 
  onKeyDown={handleKeyDown}
  placeholder='Enter a prompt' 
  value={input}
  rows={1}
/>
{input.trim()?<button id="sentbtn" disabled={loading} onClick={()=>{
sent(input)
}}><LuSendHorizonal /></button>:null}

<Darkmode/>
        </div>
    </div>
  )
}

export default ChatSection
