import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import faqDatabase from "../chatbot/faqs.json";
import { keywordMatch } from "../utils/keywordMatch";

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { text: "Hello! Looking for the sweetest Alphonsos? I'm here to help!", isBot: true }
  ]);
  const dialogueEndRef = useRef(null);

  useEffect(() => {
    dialogueEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userQuery = input.trim();
    setMessages((prev) => [...prev, { text: userQuery, isBot: false }]);
    setInput("");

    setTimeout(() => {
      const systemicReply = keywordMatch(userQuery, faqDatabase);
      setMessages((prev) => [...prev, { text: systemicReply, isBot: true }]);
    }, 450);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-body">
      {open && (
        <div className="bg-white shadow-2xl rounded-2xl w-80 md:w-96 h-[420px] mb-4 border border-gray-100 flex flex-col overflow-hidden animate-fade-in">
          {/* Header element */}
          <div className="bg-mango p-4 text-white font-bold flex justify-between items-center shadow-sm">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green rounded-full animate-ping" />
              <span>Mango Assistant 🥭</span>
            </div>
            <button onClick={() => setOpen(false)} className="hover:opacity-80"><X size={18} /></button>
          </div>
          
          {/* Messages Log Panel */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50/50">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.isBot ? "justify-start" : "justify-end"}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.isBot ? "bg-white text-gray-700 rounded-tl-none border border-gray-100" : "bg-mango text-white rounded-tr-none"}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={dialogueEndRef} />
          </div>

          {/* User Input controls */}
          <div className="p-3 bg-white border-t flex gap-2">
            <input 
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type your questions here..."
              className="flex-1 text-sm bg-gray-50 border border-gray-200 rounded-xl px-3 outline-none focus:border-mango"
            />
            <button onClick={handleSend} className="bg-mango hover:bg-mango-dark text-white p-2 rounded-xl transition">
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
      
      <button 
        className="w-14 h-14 bg-mango text-white rounded-full shadow-lg flex items-center justify-center text-2xl hover:bg-mango-dark transition-transform hover:scale-105"
        onClick={() => setOpen(!open)}
      >
        {open ? <X /> : <MessageCircle />}
      </button>
    </div>
  );
}