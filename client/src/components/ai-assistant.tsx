import { useState } from "react";

export default function AIAssistant() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState([
    {
      type: "assistant",
      content: "Hi! I'm your AI assistant for healthcare navigation. Ask me about claims, coverage, or pregnancy care!"
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    
    // Add user message
    const newMessages = [
      ...messages,
      { type: "user", content: inputMessage }
    ];
    
    setMessages(newMessages);
    setInputMessage("");
    setIsTyping(true);
    
    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "Based on your policy, that service is covered at 100% after your deductible.",
        "I can help you submit a pre-authorization for that procedure. Would you like me to start the process?",
        "Your current pregnancy week qualifies you for additional prenatal screenings. Let me show you what's available.",
        "I found 3 in-network providers near you. Would you like me to check their availability?",
        "Your claim is currently under review. Typical processing time is 3-5 business days."
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      setMessages(prev => [
        ...prev,
        { type: "assistant", content: randomResponse }
      ]);
      setIsTyping(false);
    }, 1500);
  };

  const handleQuickAction = (question: string) => {
    setInputMessage(question);
    handleSendMessage();
  };

  const toggleChat = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-xl p-6 border border-green-200">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
          <i className="fas fa-robot text-white"></i>
        </div>
        <div>
          <h3 className="font-semibold text-neutral-800">AI Policy Navigator</h3>
          <p className="text-sm text-neutral-500">
            {isExpanded ? 'Chat with AI' : 'Ask me about coverage'}
          </p>
        </div>
      </div>
      
      {!isExpanded && (
        <div className="bg-white rounded-lg p-4 mb-4">
          <p className="text-sm text-neutral-700">
            "Based on your current coverage, your next ultrasound will be fully covered. Would you like me to pre-authorize it?"
          </p>
        </div>
      )}
      
      {isExpanded && (
        <div className="space-y-4">
          {/* Chat Messages */}
          <div className="bg-white rounded-lg p-4 max-h-64 overflow-y-auto space-y-3">
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs p-3 rounded-lg text-sm ${
                  message.type === 'user' 
                    ? 'bg-green-500 text-white' 
                    : 'bg-neutral-100 text-neutral-800'
                }`}>
                  {message.content}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-neutral-100 p-3 rounded-lg text-sm">
                  <i className="fas fa-ellipsis-h animate-pulse"></i>
                </div>
              </div>
            )}
          </div>
          
          {/* Quick Actions */}
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={() => handleQuickAction("What's covered in my policy?")}
              className="px-3 py-1 bg-white border border-green-200 text-green-700 rounded-full text-xs hover:bg-green-50 transition-colors"
            >
              What's covered?
            </button>
            <button 
              onClick={() => handleQuickAction("Check my claim status")}
              className="px-3 py-1 bg-white border border-green-200 text-green-700 rounded-full text-xs hover:bg-green-50 transition-colors"
            >
              Claim status
            </button>
            <button 
              onClick={() => handleQuickAction("Find providers near me")}
              className="px-3 py-1 bg-white border border-green-200 text-green-700 rounded-full text-xs hover:bg-green-50 transition-colors"
            >
              Find providers
            </button>
          </div>
          
          {/* Message Input */}
          <div className="flex space-x-2">
            <input 
              type="text" 
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask about your policy..."
              className="flex-1 p-3 border border-green-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
            <button 
              onClick={handleSendMessage}
              disabled={!inputMessage.trim()}
              className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <i className="fas fa-paper-plane text-sm"></i>
            </button>
          </div>
        </div>
      )}
      
      <button 
        onClick={toggleChat}
        className="w-full bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors mt-4"
      >
        <i className={`fas ${isExpanded ? 'fa-chevron-up' : 'fa-comments'} mr-2`}></i>
        {isExpanded ? 'Minimize Chat' : 'Open AI Chat'}
      </button>
    </div>
  );
}