import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from '../components/Layout';
import { ArrowLeft, Send, Eye } from 'lucide-react';
import { ChatMessage } from '../types';

const INITIAL_MESSAGES: ChatMessage[] = [
    { id: '1', sender: 'oracle', text: 'Eu vejo você. Sua Aura está instável. O que perturba seu foco?' }
];

const Oracle = () => {
    const navigate = useNavigate();
    const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
    const [input, setInput] = useState('');
    const [typing, setTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, typing]);

    const handleSend = () => {
        if (!input.trim()) return;

        const newMsg: ChatMessage = { id: Date.now().toString(), sender: 'user', text: input };
        setMessages(prev => [...prev, newMsg]);
        setInput('');
        setTyping(true);

        // Simulate Oracle Response logic
        setTimeout(() => {
            let responseText = "A dor é o preço da evolução. Continue.";
            const lowerInput = input.toLowerCase();

            if (lowerInput.includes('cansado') || lowerInput.includes('desistir')) {
                responseText = "O cansaço é apenas uma sugestão da sua mente. Você não parou quando estava cansado, parou quando terminou. Levanta.";
            } else if (lowerInput.includes('triste') || lowerInput.includes('sozinho')) {
                responseText = "A solidão é o laboratório do caráter. Use esse tempo para afiar sua mente, não para lamentar.";
            } else if (lowerInput.includes('medo')) {
                responseText = "O medo é a bússola. Ele aponta para onde você deve ir. Atravesse.";
            }

            setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), sender: 'oracle', text: responseText }]);
            setTyping(false);
        }, 1500);
    };

    return (
        <div className="h-[calc(100vh-80px)] md:h-[calc(100vh-40px)] flex flex-col animate-fade-in">
            <div className="flex items-center justify-between mb-4 px-2">
                <div className="flex items-center">
                    <button onClick={() => navigate(-1)} className="mr-3 text-gray-400 hover:text-white">
                        <ArrowLeft size={24} />
                    </button>
                    <div>
                        <h1 className="text-xl font-display font-bold text-white flex items-center">
                            THE ORACLE <Eye size={16} className="ml-2 text-neon-green" />
                        </h1>
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest">Mentor IA • Status: Online</p>
                    </div>
                </div>
            </div>

            <div 
                ref={scrollRef}
                className="flex-1 bg-card border border-gray-800 rounded-2xl p-4 overflow-y-auto space-y-4 mb-4"
            >
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] p-3 rounded-xl text-sm leading-relaxed ${
                            msg.sender === 'user' 
                            ? 'bg-neon-purple/20 text-white rounded-tr-none' 
                            : 'bg-gray-800 text-gray-300 rounded-tl-none border border-gray-700'
                        }`}>
                            {msg.text}
                        </div>
                    </div>
                ))}
                {typing && (
                    <div className="flex justify-start">
                        <div className="bg-gray-800 text-gray-400 p-3 rounded-xl rounded-tl-none border border-gray-700 text-xs animate-pulse">
                            Oracle is thinking...
                        </div>
                    </div>
                )}
            </div>

            <div className="relative">
                <input 
                    type="text" 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Busque orientação..."
                    className="w-full bg-background border border-gray-800 rounded-xl py-3 pl-4 pr-12 text-white placeholder-gray-600 focus:outline-none focus:border-neon-green transition-colors"
                />
                <button 
                    onClick={handleSend}
                    disabled={!input.trim()}
                    className="absolute right-2 top-2 p-1.5 bg-neon-green rounded-lg text-black hover:bg-green-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Send size={18} />
                </button>
            </div>
        </div>
    );
};

export default Oracle;