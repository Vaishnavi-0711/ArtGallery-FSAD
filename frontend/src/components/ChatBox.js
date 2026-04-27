import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';

const roleColor = { ADMIN: '#e53e3e', ARTIST: '#6f42c1', VISITOR: '#3182ce', CURATOR: '#38a169' };

const ChatBox = () => {
  const { user }                    = useAuth();
  const [open, setOpen]             = useState(false);
  const [contacts, setContacts]     = useState([]);
  const [selected, setSelected]     = useState(null);
  const [messages, setMessages]     = useState({});
  const [input, setInput]           = useState('');
  const [connected, setConnected]   = useState(false);
  const clientRef                   = useRef(null);
  const subscriptionsRef            = useRef({});
  const bottomRef                   = useRef(null);

  const getRoomId = (a, b) => [a, b].sort().join('__');

  const subscribeToRoom = useCallback((client, roomId) => {
    if (subscriptionsRef.current[roomId]) return;
    const sub = client.subscribe(`/topic/chat/${roomId}`, msg => {
      const body = JSON.parse(msg.body);
      setMessages(prev => ({
        ...prev,
        [roomId]: [...(prev[roomId] || []), body]
      }));
    });
    subscriptionsRef.current[roomId] = sub;
  }, []);

  // Load contacts
  useEffect(() => {
    if (!user || !['VISITOR', 'ARTIST', 'ADMIN'].includes(user.role)) return;
    API.get(`/chat/users?role=${user.role}`).then(r => setContacts(r.data)).catch(() => {});
  }, [user]);

  // Connect WebSocket
  useEffect(() => {
    if (!user || !['VISITOR', 'ARTIST', 'ADMIN'].includes(user.role)) return;

    const client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
      reconnectDelay: 5000,
      onConnect: () => setConnected(true),
      onDisconnect: () => setConnected(false),
    });

    client.activate();
    clientRef.current = client;
    return () => { client.deactivate(); subscriptionsRef.current = {}; };
  }, [user]);

  // Subscribe to rooms once connected and contacts loaded
  useEffect(() => {
    const client = clientRef.current;
    if (!connected || !client || contacts.length === 0 || !user) return;
    contacts.forEach(c => {
      const roomId = getRoomId(user.name, c.name);
      subscribeToRoom(client, roomId);
    });
  }, [connected, contacts, user, subscribeToRoom]);

  // Auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, selected]);

  const sendMessage = () => {
    if (!input.trim() || !selected || !clientRef.current?.connected) return;
    const roomId = getRoomId(user.name, selected.name);
    // Subscribe to this room if not already (in case contacts loaded after connect)
    subscribeToRoom(clientRef.current, roomId);
    const msg = { senderName: user.name, senderRole: user.role, content: input.trim(), roomId };
    clientRef.current.publish({ destination: `/app/chat/${roomId}`, body: JSON.stringify(msg) });
    setInput('');
  };

  if (!user || !['VISITOR', 'ARTIST', 'ADMIN'].includes(user.role)) return null;

  const roomId          = selected ? getRoomId(user.name, selected.name) : null;
  const currentMessages = roomId ? (messages[roomId] || []) : [];

  return (
    <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999 }}>
      {open && (
        <div style={{ width: '340px', height: '500px', background: '#fff', borderRadius: '18px', boxShadow: '0 12px 40px rgba(0,0,0,0.18)', display: 'flex', flexDirection: 'column', overflow: 'hidden', border: '1px solid #e2e8f0', marginBottom: '12px' }}>

          {/* Header */}
          <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '14px 16px', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {selected && (
                <button onClick={() => setSelected(null)}
                  style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff', borderRadius: '6px', padding: '3px 8px', cursor: 'pointer', fontSize: '0.8rem' }}>←</button>
              )}
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>
                  {selected ? selected.name : '💬 Messages'}
                </div>
                {selected
                  ? <div style={{ fontSize: '0.7rem', opacity: 0.8 }}>{selected.role}</div>
                  : <div style={{ fontSize: '0.7rem', opacity: 0.8 }}>{connected ? '🟢 Connected' : '🔴 Connecting...'}</div>
                }
              </div>
            </div>
            <button onClick={() => setOpen(false)}
              style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff', borderRadius: '6px', padding: '3px 8px', cursor: 'pointer', fontSize: '1rem' }}>✕</button>
          </div>

          {!selected ? (
            /* Contact list */
            <div style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
              {contacts.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#a0aec0', padding: '40px 16px', fontSize: '0.85rem' }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>💬</div>
                  No contacts available
                </div>
              ) : contacts.map(c => {
                const rId   = getRoomId(user.name, c.name);
                const unread = (messages[rId] || []).length;
                return (
                  <div key={c.id} onClick={() => setSelected(c)}
                    style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', borderRadius: '12px', cursor: 'pointer', marginBottom: '4px', transition: 'background 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#f7fafc'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: `linear-gradient(135deg, ${roleColor[c.role]}, ${roleColor[c.role]}99)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '1rem', flexShrink: 0 }}>
                      {c.name[0].toUpperCase()}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: '0.88rem', color: '#2d3748' }}>{c.name}</div>
                      <div style={{ fontSize: '0.72rem', color: roleColor[c.role], fontWeight: 500 }}>{c.role}</div>
                    </div>
                    {unread > 0 && (
                      <div style={{ background: '#667eea', color: '#fff', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700 }}>{unread}</div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            /* Chat messages */
            <>
              <div style={{ flex: 1, overflowY: 'auto', padding: '12px', background: '#f7fafc', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {currentMessages.length === 0 && (
                  <div style={{ textAlign: 'center', color: '#a0aec0', marginTop: '60px', fontSize: '0.85rem' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '8px' }}>👋</div>
                    Say hello to {selected.name}!
                  </div>
                )}
                {currentMessages.map((m, i) => {
                  const isMe = m.senderName === user.name;
                  return (
                    <div key={i} style={{ display: 'flex', justifyContent: isMe ? 'flex-end' : 'flex-start', alignItems: 'flex-end', gap: '6px' }}>
                      {!isMe && (
                        <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: roleColor[m.senderRole] || '#6c757d', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.75rem', fontWeight: 700, flexShrink: 0 }}>
                          {m.senderName?.[0]?.toUpperCase()}
                        </div>
                      )}
                      <div style={{ maxWidth: '72%', padding: '9px 13px', borderRadius: isMe ? '16px 16px 4px 16px' : '16px 16px 16px 4px', background: isMe ? 'linear-gradient(135deg, #667eea, #764ba2)' : '#fff', color: isMe ? '#fff' : '#2d3748', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', fontSize: '0.85rem', wordBreak: 'break-word' }}>
                        <div>{m.content}</div>
                        <div style={{ fontSize: '0.62rem', opacity: 0.65, marginTop: '3px', textAlign: 'right' }}>
                          {m.timestamp ? new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={bottomRef} />
              </div>

              {/* Input */}
              <div style={{ padding: '10px 12px', background: '#fff', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '8px', alignItems: 'center', flexShrink: 0 }}>
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendMessage()}
                  placeholder={connected ? 'Type a message...' : 'Connecting...'}
                  disabled={!connected}
                  style={{ flex: 1, border: '1px solid #e2e8f0', borderRadius: '22px', padding: '9px 16px', fontSize: '0.85rem', outline: 'none', background: connected ? '#fff' : '#f7fafc' }}
                />
                <button onClick={sendMessage} disabled={!connected || !input.trim()}
                  style={{ background: connected && input.trim() ? 'linear-gradient(135deg, #667eea, #764ba2)' : '#e2e8f0', border: 'none', borderRadius: '50%', width: '38px', height: '38px', color: '#fff', cursor: connected && input.trim() ? 'pointer' : 'default', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'background 0.2s' }}>
                  ➤
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Floating toggle button */}
      <button onClick={() => setOpen(o => !o)}
        style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'linear-gradient(135deg, #667eea, #764ba2)', border: 'none', color: '#fff', fontSize: '1.5rem', cursor: 'pointer', boxShadow: '0 4px 20px rgba(102,126,234,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: 'auto', transition: 'transform 0.2s' }}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
        {open ? '✕' : '💬'}
      </button>
    </div>
  );
};

export default ChatBox;
