import { useState, useEffect, useRef } from "react";
import { useToast } from "../hooks/use-toast";

interface VoiceAssistantProps {
  onSubmitClaim?: () => void;
  onViewPolicy?: () => void;
  userData?: any;
  claims?: any[];
}

export default function VoiceAssistant({ onSubmitClaim, onViewPolicy, userData, claims }: VoiceAssistantProps) {
  const [isListening, setIsListening] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [response, setResponse] = useState("Hi! I'm your voice assistant. Say 'Help' to hear what I can do for you.");
  const [isSupported, setIsSupported] = useState(false);
  
  const recognitionRef = useRef<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Check if Web Speech API is supported
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setIsSupported(true);
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';
      
      recognitionRef.current.onresult = (event: any) => {
        const speechResult = event.results[0][0].transcript.toLowerCase();
        setTranscript(speechResult);
        processVoiceCommand(speechResult);
      };
      
      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        
        let errorMessage = "Please try speaking again.";
        if (event.error === 'not-allowed') {
          errorMessage = "Microphone access denied. Please allow microphone permissions in your browser settings and reload the page.";
        } else if (event.error === 'no-speech') {
          errorMessage = "No speech detected. Please speak clearly and try again.";
        } else if (event.error === 'network') {
          errorMessage = "Network error. Please check your internet connection.";
        }
        
        toast({
          title: "Voice Recognition Issue",
          description: errorMessage,
          variant: "destructive",
        });
      };
      
      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setIsListening(true);
      setTranscript("");
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  const processVoiceCommand = (command: string) => {
    let responseText = "";
    
    if (command.includes("help") || command.includes("what can you do")) {
      responseText = "I can help you with: submitting claims, viewing policy details, checking claim status, or answering questions about your coverage. Try saying 'submit claim', 'view policy', or 'claim status'.";
    }
    else if (command.includes("submit claim") || command.includes("new claim") || command.includes("file claim")) {
      responseText = "Opening the claim submission form for you.";
      setTimeout(() => onSubmitClaim?.(), 1000);
    }
    else if (command.includes("view policy") || command.includes("show policy") || command.includes("policy details")) {
      responseText = "Showing your policy details.";
      setTimeout(() => onViewPolicy?.(), 1000);
    }
    else if (command.includes("claim status") || command.includes("my claims")) {
      const activeClaims = claims?.filter(c => c.status === 'under_review' || c.status === 'submitted')?.length || 0;
      responseText = `You have ${activeClaims} active claims. Your most recent claim is ${claims?.[0]?.status || 'none found'}.`;
    }
    else if (command.includes("coverage") || command.includes("how much coverage")) {
      const usedAmount = userData?.policy?.usedAmount || "0";
      const totalCoverage = userData?.policy?.totalCoverage || "15000";
      responseText = `You have used $${usedAmount} out of your $${totalCoverage} total coverage.`;
    }
    else if (command.includes("pregnancy") || command.includes("how far along") || command.includes("pregnancy week")) {
      const week = userData?.user?.pregnancyWeek || "24";
      responseText = `You are currently ${week} weeks pregnant. Your due date is approaching!`;
    }
    else if (command.includes("next appointment") || command.includes("upcoming appointment")) {
      responseText = "Your next appointment is an ultrasound scheduled for December 28th at Women's Health Center.";
    }
    else if (command.includes("emergency") || command.includes("urgent care")) {
      responseText = "For medical emergencies, call 911 immediately. For urgent care questions about your coverage, you can submit an emergency claim through the system.";
    }
    else {
      responseText = "I didn't understand that command. Try saying 'help' to hear what I can do, or try commands like 'submit claim', 'view policy', or 'claim status'.";
    }
    
    setResponse(responseText);
    speak(responseText);
  };

  if (!isSupported) {
    return (
      <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-200">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-gray-400 rounded-lg flex items-center justify-center">
            <i className="fas fa-microphone-slash text-white"></i>
          </div>
          <div>
            <h3 className="font-semibold text-neutral-800">Voice Assistant</h3>
            <p className="text-sm text-neutral-500">Not supported in this browser</p>
          </div>
        </div>
        <p className="text-sm text-neutral-600">
          Voice features require a modern browser with microphone access. Please try Chrome, Firefox, or Safari.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-200">
      <div className="flex items-center space-x-3 mb-4">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
          isListening ? 'bg-red-500 animate-pulse' : 'bg-accent'
        }`}>
          <i className={`fas ${isListening ? 'fa-microphone' : 'fa-microphone-alt'} text-white`}></i>
        </div>
        <div>
          <h3 className="font-semibold text-neutral-800">Voice Assistant</h3>
          <p className="text-sm text-neutral-500">
            {isListening ? 'Listening...' : 'Voice-activated help'}
          </p>
        </div>
      </div>
      
      {!isListening && !isExpanded && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
          <div className="flex items-start space-x-2">
            <i className="fas fa-info-circle text-blue-500 text-sm mt-0.5"></i>
            <div className="text-xs text-blue-700">
              <p className="font-medium mb-1">Need microphone access?</p>
              <p>Click the microphone icon in your browser's address bar to allow voice features.</p>
            </div>
          </div>
        </div>
      )}
      
      <div className="bg-white rounded-lg p-4 mb-4">
        <p className="text-sm text-neutral-700 mb-2">
          <strong>Assistant:</strong> {response}
        </p>
        {transcript && (
          <p className="text-sm text-neutral-500">
            <strong>You said:</strong> "{transcript}"
          </p>
        )}
      </div>
      
      {isExpanded && (
        <div className="bg-white rounded-lg p-4 mb-4 space-y-3">
          <div className="text-sm text-neutral-700">
            <h4 className="font-medium mb-2">Voice Commands:</h4>
            <ul className="space-y-1 text-xs">
              <li>• "Submit claim" - Open claim submission</li>
              <li>• "View policy" - Show policy details</li>
              <li>• "Claim status" - Check your claims</li>
              <li>• "Coverage" - Check coverage usage</li>
              <li>• "Pregnancy week" - Get pregnancy info</li>
              <li>• "Next appointment" - Upcoming appointments</li>
              <li>• "Help" - Show all commands</li>
            </ul>
          </div>
        </div>
      )}
      
      <div className="flex space-x-2">
        <button 
          onClick={isListening ? stopListening : startListening}
          disabled={!isSupported}
          className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
            isListening 
              ? 'bg-red-500 hover:bg-red-600 text-white' 
              : 'bg-accent hover:bg-purple-800 text-white'
          }`}
        >
          <i className={`fas ${isListening ? 'fa-stop' : 'fa-microphone'} mr-2`}></i>
          {isListening ? 'Stop' : 'Start Voice'}
        </button>
        
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="px-3 py-2 border border-purple-300 rounded-lg hover:bg-purple-50 transition-colors"
        >
          <i className={`fas ${isExpanded ? 'fa-chevron-up' : 'fa-list'}`}></i>
        </button>
      </div>
      
      {isListening && (
        <div className="mt-3 text-center">
          <div className="inline-flex items-center space-x-2 text-sm text-neutral-600">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
            <span>Listening for voice commands...</span>
          </div>
        </div>
      )}
    </div>
  );
}