import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, LogOut, MessageCircle, Loader2 } from 'lucide-react';
import { useMsal } from "@azure/msal-react";
import "./LoginScreen.css";
// Mock Microsoft OAuth service (replace with actual MSAL implementation)
const mockMicrosoftAuth = {
  login: async () => {
    // Simulate OAuth flow
    await new Promise(resolve => setTimeout(resolve, 1500));
    return {
      accessToken: 'mock_jwt_token_' + Date.now(),
      user: {
        id: '12345',
        name: 'Madesh Palani',
        email: 'Madesh.palani@gmail.com',
        avatar: `https://ui-avatars.com/api/?name=Madesh+Palani&background=0078d4&color=fff`
      }
    };
  },
  logout: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
  }
};

const apiService = {
  sendMessage: async (message, msToken) => {
    try {
      // Call your OpenAPI backend (replace with your actual endpoint)
      const response = await fetch('https://your-backend-api.example.com/api/rag-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Pass only Microsoft JWT token for auth
          'Authorization': `Bearer ${msToken}`,
        },
        body: JSON.stringify({
          query: message
        }),
      });

      if (!response.ok) {
        throw new Error(`API call failed: ${response.statusText}`);
      }

      const data = await response.json();

      // Assume the backend returns something like: { answer: "..." }
      return {
        id: Date.now(),
        content: data.answer || "Sorry, I couldn't find an answer.",
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('API call error:', error);
      return {
        id: Date.now(),
        content: "Sorry, something went wrong while contacting the server.",
        timestamp: new Date().toISOString(),
      };
    }
  }
};


function LoginScreen({ onLogin, isLoading }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center transform hover:scale-105 transition-transform duration-300">
          <div className="mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <MessageCircle className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Assistant</h1>
            <p className="text-gray-600">Your intelligent conversational partner</p>
          </div>
          
          <button
            onClick={onLogin}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 23 23" fill="currentColor">
                  <path d="M11.5 0H0v11.5h11.5V0z" fill="#f25022"/>
                  <path d="M23 0H11.5v11.5H23V0z" fill="#7fba00"/>
                  <path d="M11.5 11.5H0V23h11.5V11.5z" fill="#00a4ef"/>
                  <path d="M23 11.5H11.5V23H23V11.5z" fill="#ffb900"/>
                </svg>
                Sign in with Microsoft
              </>
            )}
          </button>
          
          <p className="text-sm text-gray-500 mt-6">
            Secure authentication powered by Microsoft Identity Platform
          </p>
        </div>
      </div>
    </div>
  );
}

function ChatMessage({ message, isBot, isTyping }) {
  return (
    <div className={`flex gap-3 ${isBot ? 'justify-start' : 'justify-end'} animate-fadeIn`}>
      {isBot && (
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
          <Bot className="w-4 h-4 text-white" />
        </div>
      )}
      
      <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-sm ${
        isBot 
          ? 'bg-white border border-gray-100' 
          : 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white'
      }`}>
        {isTyping ? (
          <div className="flex items-center gap-1">
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
            <span className="text-sm text-gray-500 ml-2">AI is thinking...</span>
          </div>
        ) : (
          <p className={`text-sm ${isBot ? 'text-gray-800' : 'text-white'}`}>
            {message.content}
          </p>
        )}
      </div>
      
      {!isBot && (
        <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
          <User className="w-4 h-4 text-white" />
        </div>
      )}
    </div>
  );
}

function ChatScreen({ user, token, onLogout }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      content: `Hello ${user.name}! I'm your AI assistant. How can I help you today?`,
      isBot: true,
      timestamp: new Date().toISOString()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (e) => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      content: inputMessage,
      isBot: false,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setIsTyping(true);

    try {
      const response = await apiService.sendMessage(inputMessage, token);
      
      setIsTyping(false);
      
      const botMessage = {
        id: response.id,
        content: response.content,
        isBot: true,
        timestamp: response.timestamp
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      setIsTyping(false);
      const errorMessage = {
        id: Date.now(),
        content: "Sorry, I'm having trouble connecting right now. Please try again.",
        isBot: true,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">AI Assistant</h1>
              <p className="text-sm text-gray-500">Always here to help</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <img 
                src={user.avatar}
                alt={user.name}
                className="w-8 h-8 rounded-full"
              />
              <span className="text-sm font-medium text-gray-700 hidden sm:inline">
                {user.name}
              </span>
            </div>
            <button
              onClick={onLogout}
              className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200"
              title="Sign out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <ChatMessage 
            key={message.id} 
            message={message} 
            isBot={message.isBot}
          />
        ))}
        {isTyping && <ChatMessage isBot={true} isTyping={true} />}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="flex gap-3">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type your message..."
            disabled={isLoading}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage(e);
              }
            }}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading || !inputMessage.trim()}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function useMsalAuth() {
  const { instance } = useMsal();

  const login = async () => {
    const loginResponse = await instance.loginPopup({
      scopes: ["User.Read"],
    });

    const account = loginResponse.account;

    const tokenResponse = await instance.acquireTokenSilent({
      scopes: ["User.Read"],
      account,
    }).catch(() =>
      instance.acquireTokenPopup({
        scopes: ["User.Read"],
      })
    );

    return {
      accessToken: tokenResponse.accessToken,
      user: {
        id: account.localAccountId,
        name: account.name,
        email: account.username,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(account.name)}&background=0078d4&color=fff`,
      },
    };
  };

  const logout = () => {
    instance.logoutPopup();
  };

  return { login, logout };
}
export default function App() {
  const { login, logout } = useMsalAuth();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const authResult = await login();
      setUser(authResult.user);
      setToken(authResult.accessToken);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <LoginScreen onLogin={handleLogin} isLoading={isLoading} />;
  }

  return <ChatScreen user={user} token={token} onLogout={handleLogout} />;
}