import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';

const StyledWidgetContainer = styled.div`
  position: fixed;
  bottom: 30px;
  right: 90px;
  z-index: 99;

  @media (max-width: 1080px) {
    right: 70px;
  }

  @media (max-width: 768px) {
    bottom: 20px;
    right: 20px;
  }
`;

const FloatingButton = styled.button`
  ${({ theme }) => theme.mixins.flexCenter};
  gap: 10px;
  background-color: var(--light-navy);
  color: var(--green);
  border: 1px solid var(--green);
  border-radius: 30px;
  padding: 12px 20px;
  font-family: var(--font-mono);
  font-size: var(--fz-xs);
  cursor: pointer;
  box-shadow: 0 10px 30px -10px rgba(2, 12, 27, 0.7);
  transition: var(--transition);

  &:hover,
  &:focus {
    background-color: var(--green-tint);
    transform: translateY(-3px);
    box-shadow: 0 15px 30px -10px rgba(100, 255, 218, 0.3);
    outline: none;
  }

  .spark {
    font-size: 14px;
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0%,
    100% {
      opacity: 1;
      transform: scale(1);
    }
    50% {
      opacity: 0.6;
      transform: scale(1.15);
    }
  }
`;

const ChatDrawer = styled.div`
  display: ${props => (props.isOpen ? 'flex' : 'none')};
  flex-direction: column;
  position: fixed;
  bottom: 90px;
  right: 90px;
  width: 380px;
  height: 520px;
  max-width: calc(100vw - 40px);
  max-height: calc(100vh - 120px);
  background-color: var(--light-navy);
  border: 1px solid rgba(100, 255, 218, 0.25);
  border-radius: var(--border-radius);
  box-shadow: 0 20px 40px -15px rgba(2, 12, 27, 0.8);
  overflow: hidden;
  z-index: 100;
  animation: slideUp 0.25s ease-out;

  @media (max-width: 1080px) {
    right: 70px;
  }

  @media (max-width: 768px) {
    bottom: 80px;
    right: 20px;
    width: calc(100vw - 40px);
    height: 480px;
  }

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const ChatHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 18px;
  background-color: var(--navy);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);

  .header-info {
    display: flex;
    flex-direction: column;

    .title {
      color: var(--lightest-slate);
      font-size: var(--fz-md);
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .status {
      color: var(--green);
      font-family: var(--font-mono);
      font-size: var(--fz-xxs);
      display: flex;
      align-items: center;
      gap: 5px;

      &::before {
        content: '';
        display: inline-block;
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background-color: var(--green);
      }
    }
  }

  .close-btn {
    background: transparent;
    border: none;
    color: var(--slate);
    font-size: 20px;
    cursor: pointer;
    padding: 4px;
    line-height: 1;

    &:hover {
      color: var(--green);
    }
  }
`;

const MessagesBody = styled.div`
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;

  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 5px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: var(--dark-slate);
    border-radius: 4px;
  }
`;

const MessageBubble = styled.div`
  max-width: 85%;
  padding: 10px 14px;
  border-radius: 12px;
  font-size: var(--fz-sm);
  line-height: 1.45;
  word-break: break-word;

  ${props =>
    props.role === 'user'
      ? `
    align-self: flex-end;
    background-color: rgba(100, 255, 218, 0.15);
    color: var(--lightest-slate);
    border-bottom-right-radius: 2px;
    border: 1px solid rgba(100, 255, 218, 0.3);
  `
      : `
    align-self: flex-start;
    background-color: var(--navy);
    color: var(--light-slate);
    border-bottom-left-radius: 2px;
    border: 1px solid rgba(255, 255, 255, 0.06);
  `}

  p {
    margin: 0;
  }
`;

const ChipsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 4px;
`;

const QuestionChip = styled.button`
  background: rgba(100, 255, 218, 0.06);
  color: var(--green);
  border: 1px solid rgba(100, 255, 218, 0.2);
  border-radius: 14px;
  padding: 7px 12px;
  font-size: var(--fz-xs);
  text-align: left;
  cursor: pointer;
  transition: var(--transition);

  &:hover {
    background: rgba(100, 255, 218, 0.15);
    border-color: var(--green);
  }
`;

const TypingIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 12px;
  background-color: var(--navy);
  border-radius: 12px;
  align-self: flex-start;
  width: fit-content;

  span {
    width: 6px;
    height: 6px;
    background-color: var(--green);
    border-radius: 50%;
    animation: bounce 1.4s infinite ease-in-out both;

    &:nth-child(1) {
      animation-delay: -0.32s;
    }
    &:nth-child(2) {
      animation-delay: -0.16s;
    }
  }

  @keyframes bounce {
    0%,
    80%,
    100% {
      transform: scale(0);
      opacity: 0.3;
    }
    40% {
      transform: scale(1);
      opacity: 1;
    }
  }
`;

const InputFooter = styled.form`
  display: flex;
  padding: 12px;
  background-color: var(--navy);
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  gap: 8px;

  input {
    flex: 1;
    background: var(--light-navy);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 20px;
    padding: 8px 16px;
    color: var(--lightest-slate);
    font-size: var(--fz-sm);
    outline: none;
    transition: var(--transition);

    &:focus {
      border-color: var(--green);
    }

    &::placeholder {
      color: var(--slate);
    }
  }

  button {
    background: var(--green);
    color: var(--navy);
    border: none;
    border-radius: 50%;
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-weight: bold;
    transition: var(--transition);

    &:hover:not(:disabled) {
      transform: scale(1.05);
      background: var(--lightest-slate);
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
`;

const SUGGESTIONS = [
  'What is your role at Horal?',
  'What backend and database tech do you use?',
  'Are you open to remote roles?',
  'Tell me about your payment integrations',
];

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    {
      role: 'model',
      content:
        'Hi! I\'m Harry\'s AI assistant. Ask me anything about his experience, technical stack, or projects!',
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const sendMessage = async textToSend => {
    const query = textToSend || input.trim();
    if (!query || isLoading) {
      return;
    }

    const updatedMessages = [...messages, { role: 'user', content: query }];
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          history: updatedMessages.slice(0, -1),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      setMessages(prev => [
        ...prev,
        {
          role: 'model',
          content: data.reply || 'I couldn\'t process that. Please reach out to Harry directly!',
        },
      ]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        {
          role: 'model',
          content:
            'I\'m temporarily unable to connect to the AI service. Feel free to contact Harry directly at arinzelight2@gmail.com!',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <StyledWidgetContainer>
      <FloatingButton onClick={() => setIsOpen(!isOpen)} aria-label="Open AI Assistant Chat">
        <span className="spark">⚡</span>
        <span>{isOpen ? 'Close AI Chat' : 'Ask Harry AI'}</span>
      </FloatingButton>

      <ChatDrawer isOpen={isOpen}>
        <ChatHeader>
          <div className="header-info">
            <span className="title">
              <span>⚡</span> Ask Harry AI
            </span>
            <span className="status">Online • Gemini 1.5</span>
          </div>
          <button className="close-btn" onClick={() => setIsOpen(false)} aria-label="Close Chat">
            ×
          </button>
        </ChatHeader>

        <MessagesBody>
          {messages.map((msg, idx) => (
            <MessageBubble key={idx} role={msg.role}>
              <p>{msg.content}</p>
            </MessageBubble>
          ))}

          {messages.length === 1 && (
            <ChipsContainer>
              {SUGGESTIONS.map((suggestion, i) => (
                <QuestionChip key={i} onClick={() => sendMessage(suggestion)}>
                  ▹ {suggestion}
                </QuestionChip>
              ))}
            </ChipsContainer>
          )}

          {isLoading && (
            <TypingIndicator>
              <span />
              <span />
              <span />
            </TypingIndicator>
          )}
          <div ref={messagesEndRef} />
        </MessagesBody>

        <InputFooter
          onSubmit={e => {
            e.preventDefault();
            sendMessage();
          }}>
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask about my stack, projects..."
            disabled={isLoading}
          />
          <button type="submit" disabled={isLoading || !input.trim()} aria-label="Send Message">
            ↑
          </button>
        </InputFooter>
      </ChatDrawer>
    </StyledWidgetContainer>
  );
};

export default ChatWidget;
