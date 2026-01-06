import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Bot,
  User,
  Send,
  Mic,
  MicOff,
  ArrowLeft,
  Lightbulb,
  Target,
  TrendingUp,
} from 'lucide-react-native';
import { useSendChatMessage, useChatSessions } from '../hooks/useAICoach';

interface Message {
  id: string;
  role: 'user' | 'ai_coach';
  content: string;
  timestamp: string;
  recommendations?: string[];
}

interface AICoachChatScreenProps {
  navigation: any;
}

export default function AICoachChatScreen({ navigation }: AICoachChatScreenProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'ai_coach',
      content: 'Hello! I\'m your AI Coach. I\'m here to help you with your fitness journey, training plans, performance analysis, and motivation. What would you like to discuss today?',
      timestamp: new Date().toISOString(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  const scrollViewRef = useRef<ScrollView>(null);
  const sendChatMessage = useSendChatMessage();
  const chatSessions = useChatSessions({ limit: 1 });

  // Load recent session if available
  useEffect(() => {
    if (chatSessions.data?.data && chatSessions.data.data.length > 0) {
      const recentSession = chatSessions.data.data[0];
      const sessionMessages = recentSession.messages.map((msg, index) => ({
        id: `${recentSession._id}-${index}`,
        role: msg.role,
        content: msg.content,
        timestamp: msg.timestamp,
        recommendations: recentSession.recommendations,
      }));
      setMessages(sessionMessages);
      setCurrentSessionId(recentSession._id);
    }
  }, [chatSessions.data]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputText.trim() || sendChatMessage.isPending) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: inputText.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    const messageText = inputText.trim();
    setInputText('');

    try {
      const response = await sendChatMessage.mutateAsync({
        message: messageText,
        sessionType: 'chat',
      });

      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        role: 'ai_coach',
        content: response.message,
        timestamp: new Date().toISOString(),
        recommendations: response.recommendations,
      };

      setMessages(prev => [...prev, aiMessage]);
      setCurrentSessionId(response.sessionId);
    } catch (error: any) {
      console.error('Chat error:', error);
      
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        role: 'ai_coach',
        content: 'Sorry, I encountered an error. Please try again or check your connection.',
        timestamp: new Date().toISOString(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
      Alert.alert('Error', 'Failed to send message. Please try again.');
    }
  };

  const handleQuickQuestion = (question: string) => {
    setInputText(question);
  };

  const toggleVoiceInput = () => {
    if (Platform.OS === 'web') {
      Alert.alert('Voice Input', 'Voice input is coming soon on web!');
      return;
    }
    
    setIsListening(!isListening);
    // Voice recognition implementation would go here
    // For now, just simulate voice input
    setTimeout(() => {
      setIsListening(false);
      setInputText('I want to improve my fitness level');
    }, 2000);
  };

  const quickQuestions = [
    {
      icon: <Target size={16} color="#FF6B35" strokeWidth={2} />,
      text: 'Create a training plan',
    },
    {
      icon: <TrendingUp size={16} color="#10B981" strokeWidth={2} />,
      text: 'Analyze my performance',
    },
    {
      icon: <Lightbulb size={16} color="#F59E0B" strokeWidth={2} />,
      text: 'Give me motivation',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <ArrowLeft size={24} color="#111827" strokeWidth={2} />
        </TouchableOpacity>
        
        <View style={styles.headerContent}>
          <Bot size={24} color="#FF6B35" strokeWidth={2} />
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>AI Coach</Text>
            <Text style={styles.headerSubtitle}>
              {sendChatMessage.isPending ? 'Thinking...' : 'Ready to help'}
            </Text>
          </View>
        </View>
      </View>

      <KeyboardAvoidingView 
        style={styles.chatContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Messages */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((message) => (
            <View key={message.id} style={styles.messageWrapper}>
              <View
                style={[
                  styles.messageContainer,
                  message.role === 'user' ? styles.userMessage : styles.aiMessage,
                ]}
              >
                <View style={styles.messageHeader}>
                  {message.role === 'user' ? (
                    <User size={16} color="#FFFFFF" strokeWidth={2} />
                  ) : (
                    <Bot size={16} color="#FF6B35" strokeWidth={2} />
                  )}
                  <Text style={[
                    styles.senderName,
                    message.role === 'user' ? styles.userSenderName : styles.aiSenderName,
                  ]}>
                    {message.role === 'user' ? 'You' : 'AI Coach'}
                  </Text>
                </View>
                
                <Text style={[
                  styles.messageText,
                  message.role === 'user' ? styles.userMessageText : styles.aiMessageText,
                ]}>
                  {message.content}
                </Text>
                
                {message.recommendations && message.recommendations.length > 0 && (
                  <View style={styles.recommendationsContainer}>
                    <Text style={styles.recommendationsTitle}>Recommendations:</Text>
                    {message.recommendations.map((rec, index) => (
                      <Text key={index} style={styles.recommendationText}>
                        • {rec}
                      </Text>
                    ))}
                  </View>
                )}
                
                <Text style={[
                  styles.timestamp,
                  message.role === 'user' ? styles.userTimestamp : styles.aiTimestamp,
                ]}>
                  {new Date(message.timestamp).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </Text>
              </View>
            </View>
          ))}
          
          {sendChatMessage.isPending && (
            <View style={styles.messageWrapper}>
              <View style={[styles.messageContainer, styles.aiMessage]}>
                <View style={styles.messageHeader}>
                  <Bot size={16} color="#FF6B35" strokeWidth={2} />
                  <Text style={styles.aiSenderName}>AI Coach</Text>
                </View>
                <View style={styles.typingContainer}>
                  <ActivityIndicator size="small" color="#FF6B35" />
                  <Text style={styles.typingText}>Thinking...</Text>
                </View>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Quick Questions */}
        <View style={styles.quickQuestionsContainer}>
          <Text style={styles.quickQuestionsTitle}>Quick Questions:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {quickQuestions.map((question, index) => (
              <TouchableOpacity
                key={index}
                style={styles.quickQuestionButton}
                onPress={() => handleQuickQuestion(question.text)}
              >
                {question.icon}
                <Text style={styles.quickQuestionText}>{question.text}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Input Container */}
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.textInput}
              value={inputText}
              onChangeText={setInputText}
              placeholder="Ask me anything about your training..."
              placeholderTextColor="#9CA3AF"
              multiline
              maxLength={500}
              editable={!sendChatMessage.isPending}
            />
            
            <TouchableOpacity
              style={[styles.voiceButton, isListening && styles.voiceButtonActive]}
              onPress={toggleVoiceInput}
              disabled={sendChatMessage.isPending}
            >
              {isListening ? (
                <MicOff size={20} color="#FFFFFF" strokeWidth={2} />
              ) : (
                <Mic size={20} color="#6B7280" strokeWidth={2} />
              )}
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.sendButton,
                (!inputText.trim() || sendChatMessage.isPending) && styles.sendButtonDisabled
              ]}
              onPress={handleSendMessage}
              disabled={!inputText.trim() || sendChatMessage.isPending}
            >
              {sendChatMessage.isPending ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Send size={20} color="#FFFFFF" strokeWidth={2} />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    marginRight: 12,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerText: {
    marginLeft: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  chatContainer: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  messageWrapper: {
    marginBottom: 16,
  },
  messageContainer: {
    maxWidth: '85%',
    padding: 12,
    borderRadius: 16,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#FF6B35',
    borderBottomRightRadius: 4,
  },
  aiMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 4,
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
    marginBottom: 4,
  },
  userMessageText: {
    color: '#FFFFFF',
  },
  aiMessageText: {
    color: '#111827',
  },
  recommendationsContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  recommendationsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
  },
  recommendationText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
    paddingLeft: 8,
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
  typingText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 8,
    fontStyle: 'italic',
  },
  quickQuestionsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  quickQuestionsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  quickQuestionButton: {
    flexDirection: 'row',
    alignItems: 'center',
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
    marginLeft: 6,
  },
  inputContainer: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
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
    backgroundColor: '#FFFFFF',
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
