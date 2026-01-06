import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Animated,
  Platform,
} from 'react-native';
import { MessageCircle, Send, Bot, User, Mic, MicOff } from 'lucide-react-native';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface AICoachProps {
  sport?: string;
  userLevel?: string;
}

export default function AICoach({ sport = 'General', userLevel = 'Beginner' }: AICoachProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: `नमस्ते! मैं आपका AI कोच हूं। ${sport} में आपकी मदद करने के लिए यहां हूं। आप ${userLevel} level के हैं, तो चलिए शुरू करते हैं!`,
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const typingAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isTyping) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(typingAnimation, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(typingAnimation, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      typingAnimation.setValue(0);
    }
  }, [isTyping]);

  const generateAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Cricket responses
    if (lowerMessage.includes('cricket') || lowerMessage.includes('क्रिकेट')) {
      if (lowerMessage.includes('batting') || lowerMessage.includes('बैटिंग')) {
        return 'बैटिंग के लिए मुख्य टिप्स:\n\n1. सही stance बनाए रखें\n2. गेंद को ध्यान से देखें\n3. Timing पर फोकस करें\n4. Regular practice करें\n\nक्या आप किसी specific shot के बारे में जानना चाहते हैं?';
      }
      if (lowerMessage.includes('bowling') || lowerMessage.includes('गेंदबाजी')) {
        return 'गेंदबाजी में सुधार के लिए:\n\n1. Run-up consistent रखें\n2. Seam position सही रखें\n3. Line और length पर control करें\n4. Variations practice करें\n\nकौन सी bowling style आप सीखना चाहते हैं?';
      }
      return 'क्रिकेट एक बेहतरीन खेल है! मैं आपको batting, bowling, fielding - सभी में मदद कर सकता हूं। आप किस area में improve करना चाहते हैं?';
    }
    
    // Kabaddi responses
    if (lowerMessage.includes('kabaddi') || lowerMessage.includes('कबड्डी')) {
      return 'कबड्डी के लिए जरूरी skills:\n\n1. Breath control - "कबड्डी कबड्डी" continuous बोलें\n2. Agility और speed develop करें\n3. Defensive techniques सीखें\n4. Team coordination बढ़ाएं\n\nRaiding या defending - किसमें help चाहिए?';
    }
    
    // Fitness responses
    if (lowerMessage.includes('fitness') || lowerMessage.includes('फिटनेस')) {
      return 'Sports fitness के लिए:\n\n1. Cardio exercises daily करें\n2. Strength training include करें\n3. Flexibility और mobility work करें\n4. Proper nutrition लें\n5. Adequate rest जरूरी है\n\nकौन सा sport आप खेलते हैं? उसके हिसाब से specific plan बना सकते हैं।';
    }
    
    // Diet responses
    if (lowerMessage.includes('diet') || lowerMessage.includes('आहार') || lowerMessage.includes('nutrition')) {
      return 'Sports nutrition के लिए:\n\n1. Pre-workout: Carbs + protein\n2. Post-workout: Protein rich food\n3. Hydration maintain करें\n4. Indian foods: दाल, चावल, रोटी, दूध\n5. Fruits और vegetables जरूर लें\n\nकोई specific dietary goal है?';
    }
    
    // Training responses
    if (lowerMessage.includes('training') || lowerMessage.includes('practice') || lowerMessage.includes('अभ्यास')) {
      return 'Effective training के लिए:\n\n1. Regular schedule बनाएं\n2. Skill-specific drills करें\n3. Progressive overload apply करें\n4. Recovery time दें\n5. Mental training भी करें\n\nकितने दिन per week train करते हैं?';
    }
    
    // Injury responses
    if (lowerMessage.includes('injury') || lowerMessage.includes('चोट') || lowerMessage.includes('pain')) {
      return '⚠️ चोट के लिए:\n\n1. तुरंत activity रोकें\n2. Ice apply करें (15-20 min)\n3. Rest करें\n4. Doctor से consult करें\n5. Proper rehabilitation करें\n\n⚠️ Serious injury के लिए medical help लें!';
    }
    
    // Motivation responses
    if (lowerMessage.includes('motivation') || lowerMessage.includes('प्रेरणा') || lowerMessage.includes('give up')) {
      return '💪 याद रखें:\n\n"हार का मतलब है कि आपने कोशिश की है।"\n\n1. Small goals set करें\n2. Progress track करें\n3. Celebrate small wins\n4. Consistent रहें\n5. Champions भी गिरते हैं, लेकिन उठते हैं!\n\nआप कर सकते हैं! 🇮🇳';
    }
    
    // Default responses
    const defaultResponses = [
      'बहुत अच्छा सवाल! मैं आपकी मदद करने की कोशिश करता हूं। कृपया अपना सवाल और detail में बताएं।',
      'मैं समझ गया। क्या आप इसके बारे में और जानकारी चाहते हैं?',
      'यह interesting है! आपका sports journey कैसा चल रहा है?',
      'Great! मैं आपको बेहतर guidance दे सकूं, इसके लिए थोड़ा और बताएं।',
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateAIResponse(userMessage.text),
        sender: 'ai',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500 + Math.random() * 1000);
  };

  const toggleVoiceInput = () => {
    if (Platform.OS === 'web') {
      // Web speech recognition would go here
      alert('Voice input coming soon on web!');
      return;
    }
    
    setIsListening(!isListening);
    // Voice recognition implementation would go here
    setTimeout(() => {
      setIsListening(false);
      setInputText('मैं voice input test कर रहा हूं');
    }, 2000);
  };

  const quickQuestions = [
    'मुझे fitness tips चाहिए',
    'Cricket batting कैसे improve करूं?',
    'Diet plan बताएं',
    'Injury से कैसे बचूं?',
    'Motivation चाहिए',
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Bot size={24} color="#FF6B35" strokeWidth={2} />
        <Text style={styles.headerTitle}>AI Sports Coach</Text>
        <Text style={styles.headerSubtitle}>आपका व्यक्तिगत कोच</Text>
      </View>

      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
      >
        {messages.map((message) => (
          <View
            key={message.id}
            style={[
              styles.messageContainer,
              message.sender === 'user' ? styles.userMessage : styles.aiMessage,
            ]}
          >
            <View style={styles.messageHeader}>
              {message.sender === 'user' ? (
                <User size={16} color="#FFFFFF" strokeWidth={2} />
              ) : (
                <Bot size={16} color="#FF6B35" strokeWidth={2} />
              )}
              <Text style={[
                styles.senderName,
                message.sender === 'user' ? styles.userSenderName : styles.aiSenderName,
              ]}>
                {message.sender === 'user' ? 'आप' : 'AI Coach'}
              </Text>
            </View>
            <Text style={[
              styles.messageText,
              message.sender === 'user' ? styles.userMessageText : styles.aiMessageText,
            ]}>
              {message.text}
            </Text>
            <Text style={[
              styles.timestamp,
              message.sender === 'user' ? styles.userTimestamp : styles.aiTimestamp,
            ]}>
              {message.timestamp.toLocaleTimeString('hi-IN', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </Text>
          </View>
        ))}

        {isTyping && (
          <View style={[styles.messageContainer, styles.aiMessage]}>
            <View style={styles.messageHeader}>
              <Bot size={16} color="#FF6B35" strokeWidth={2} />
              <Text style={styles.aiSenderName}>AI Coach</Text>
            </View>
            <View style={styles.typingContainer}>
              <Animated.View style={[
                styles.typingDot,
                { opacity: typingAnimation }
              ]} />
              <Animated.View style={[
                styles.typingDot,
                { opacity: typingAnimation }
              ]} />
              <Animated.View style={[
                styles.typingDot,
                { opacity: typingAnimation }
              ]} />
              <Text style={styles.typingText}>सोच रहा हूं...</Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Quick Questions */}
      <View style={styles.quickQuestionsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {quickQuestions.map((question, index) => (
            <TouchableOpacity
              key={index}
              style={styles.quickQuestionButton}
              onPress={() => setInputText(question)}
            >
              <Text style={styles.quickQuestionText}>{question}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={inputText}
          onChangeText={setInputText}
          placeholder="अपना सवाल यहां लिखें..."
          placeholderTextColor="#9CA3AF"
          multiline
          maxLength={500}
        />
        <TouchableOpacity
          style={[styles.voiceButton, isListening && styles.voiceButtonActive]}
          onPress={toggleVoiceInput}
        >
          {isListening ? (
            <MicOff size={20} color="#FFFFFF" strokeWidth={2} />
          ) : (
            <Mic size={20} color="#6B7280" strokeWidth={2} />
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
          onPress={sendMessage}
          disabled={!inputText.trim()}
        >
          <Send size={20} color="#FFFFFF" strokeWidth={2} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginTop: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  messageContainer: {
    marginBottom: 16,
    maxWidth: '85%',
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#FF6B35',
    borderRadius: 16,
    borderBottomRightRadius: 4,
    padding: 12,
  },
  aiMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderBottomLeftRadius: 4,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  senderName: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 6,
  },
  userSenderName: {
    color: '#FFFFFF',
  },
  aiSenderName: {
    color: '#FF6B35',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userMessageText: {
    color: '#FFFFFF',
  },
  aiMessageText: {
    color: '#111827',
  },
  timestamp: {
    fontSize: 11,
    marginTop: 6,
  },
  userTimestamp: {
    color: '#FED7D7',
    textAlign: 'right',
  },
  aiTimestamp: {
    color: '#9CA3AF',
  },
  typingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FF6B35',
    marginRight: 4,
  },
  typingText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 8,
    fontStyle: 'italic',
  },
  quickQuestionsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  quickQuestionButton: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  quickQuestionText: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    maxHeight: 100,
    marginRight: 8,
  },
  voiceButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  voiceButtonActive: {
    backgroundColor: '#EF4444',
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FF6B35',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#D1D5DB',
  },
});