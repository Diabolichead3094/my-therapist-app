import React, { useState, useEffect } from 'react';
import { Settings, MessageSquare, TrendingUp, BookOpen, Heart, Brain, AlertCircle, Calendar, Target, Smile, Frown, Meh, Cloud, Sun, CloudRain, ChevronRight, Key, Save, X, Send, Mic, Menu, Home, BarChart3, History, User, LogOut, Shield, Download, Plus, Check, Circle } from 'lucide-react';

const AITherapistApp = () => {
  const [activeSection, setActiveSection] = useState('chat');
  const [apiProvider, setApiProvider] = useState('openai');
  const [apiKey, setApiKey] = useState('');
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [moodEntries, setMoodEntries] = useState([]);
  const [goals, setGoals] = useState([]);
  const [showSettings, setShowSettings] = useState(false);
  const [sentimentData, setSentimentData] = useState([]);
  const [currentMood, setCurrentMood] = useState(3);
  const [journalEntry, setJournalEntry] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Initialize with sample data
  useEffect(() => {
    // Sample sentiment data
    const sampleSentiment = [
      { date: '2024-01-01', score: 0.6, emotion: 'hopeful' },
      { date: '2024-01-02', score: 0.4, emotion: 'anxious' },
      { date: '2024-01-03', score: 0.7, emotion: 'content' },
      { date: '2024-01-04', score: 0.5, emotion: 'neutral' },
      { date: '2024-01-05', score: 0.8, emotion: 'happy' },
    ];
    setSentimentData(sampleSentiment);

    // Sample goals
    const sampleGoals = [
      { id: 1, text: 'Practice mindfulness 10 minutes daily', completed: false, progress: 60 },
      { id: 2, text: 'Journal thoughts before bed', completed: false, progress: 40 },
      { id: 3, text: 'Take a walk in nature weekly', completed: true, progress: 100 },
    ];
    setGoals(sampleGoals);
  }, []);

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;
    
    const userMessage = { role: 'user', content: inputMessage };
    setMessages([...messages, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      // Check if API key is set
      if (!apiKey) {
        const aiResponse = {
          role: 'assistant',
          content: "Please set your API key in the settings menu to start chatting. Click the Settings button in the sidebar."
        };
        setMessages(prev => [...prev, aiResponse]);
        setIsTyping(false);
        return;
      }

      // For demo purposes - in production, this would call your API route
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          apiKey: apiKey,
          provider: apiProvider
        })
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();
      
      let aiContent = '';
      if (apiProvider === 'openai') {
        aiContent = data.choices[0].message.content;
      } else if (apiProvider === 'claude') {
        aiContent = data.completion;
      }

      const aiResponse = {
        role: 'assistant',
        content: aiContent
      };
      
      setMessages(prev => [...prev, aiResponse]);
      
      // Update sentiment data
      const newSentiment = {
        date: new Date().toISOString().split('T')[0],
        score: Math.random() * 0.4 + 0.4,
        emotion: ['anxious', 'hopeful', 'content', 'happy'][Math.floor(Math.random() * 4)]
      };
      setSentimentData(prev => [...prev.slice(-6), newSentiment]);
      
    } catch (error) {
      // Fallback for demo
      const aiResponse = {
        role: 'assistant',
        content: "I hear you and I'm here to support you. Your feelings are valid. Can you tell me more about what's been on your mind lately?"
      };
      setMessages(prev => [...prev, aiResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  const saveMoodEntry = () => {
    if (journalEntry.trim()) {
      const newEntry = {
        date: new Date().toLocaleString(),
        mood: currentMood,
        entry: journalEntry
      };
      setMoodEntries([...moodEntries, newEntry]);
      setJournalEntry('');
    }
  };

  const addGoal = () => {
    const newGoal = {
      id: goals.length + 1,
      text: 'New therapy goal',
      completed: false,
      progress: 0
    };
    setGoals([...goals, newGoal]);
  };

  const toggleGoal = (id) => {
    setGoals(goals.map(goal => 
      goal.id === id ? { ...goal, completed: !goal.completed, progress: goal.completed ? 0 : 100 } : goal
    ));
  };

  const getMoodIcon = (mood) => {
    if (mood <= 2) return <Frown className="w-6 h-6 text-red-500" />;
    if (mood <= 4) return <Meh className="w-6 h-6 text-yellow-500" />;
    return <Smile className="w-6 h-6 text-green-500" />;
  };

  const renderSidebar = () => (
    <div className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-gradient-to-b from-purple-900 to-indigo-900 text-white transition-all duration-300`}>
      <div className="p-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className={`text-2xl font-bold ${sidebarOpen ? 'block' : 'hidden'}`}>MindSpace</h1>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-white hover:bg-white/10 p-2 rounded">
            <Menu className="w-5 h-5" />
          </button>
        </div>
        
        <nav className="space-y-2">
          {[
            { id: 'chat', icon: MessageSquare, label: 'Therapy Chat' },
            { id: 'dashboard', icon: BarChart3, label: 'Progress Dashboard' },
            { id: 'mood', icon: Heart, label: 'Mood Tracker' },
            { id: 'goals', icon: Target, label: 'Goals' },
            { id: 'resources', icon: BookOpen, label: 'Resources' },
            { id: 'insights', icon: Brain, label: 'Insights' },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-all ${
                activeSection === item.id ? 'bg-white/20' : 'hover:bg-white/10'
              }`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {sidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
        <button
          onClick={() => setShowSettings(true)}
          className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-white/10"
        >
          <Settings className="w-5 h-5 flex-shrink-0" />
          {sidebarOpen && <span>Settings</span>}
        </button>
        <button className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-white/10">
          <Shield className="w-5 h-5 flex-shrink-0" />
          {sidebarOpen && <span>Privacy</span>}
        </button>
      </div>
    </div>
  );

  const renderChat = () => (
    <div className="flex-1 flex flex-col bg-gray-50">
      <div className="bg-white shadow-sm px-6 py-4 flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-800">Therapy Session</h2>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-500">Session #5</span>
          <button className="text-gray-500 hover:text-gray-700">
            <History className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-12">
            <Brain className="w-16 h-16 mx-auto text-purple-300 mb-4" />
            <h3 className="text-xl font-medium text-gray-700 mb-2">Welcome to your safe space</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              I'm here to listen and support you. Everything you share is confidential. How are you feeling today?
            </p>
          </div>
        )}
        
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-2xl px-4 py-3 rounded-2xl ${
              msg.role === 'user' 
                ? 'bg-purple-600 text-white' 
                : 'bg-white shadow-md text-gray-800'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white shadow-md px-4 py-3 rounded-2xl">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="bg-white border-t px-6 py-4">
        <div className="flex items-center space-x-4">
          <button className="text-gray-500 hover:text-purple-600">
            <Mic className="w-6 h-6" />
          </button>
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Share your thoughts..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-purple-500"
          />
          <button
            onClick={sendMessage}
            className="bg-purple-600 text-white p-2 rounded-full hover:bg-purple-700 transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );

  const renderDashboard = () => (
    <div className="flex-1 bg-gray-50 p-6 overflow-y-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Your Progress Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <Heart className="w-8 h-8 text-red-500" />
            <span className="text-2xl font-bold text-gray-800">85%</span>
          </div>
          <h3 className="text-gray-600 font-medium">Mood Improvement</h3>
          <p className="text-sm text-gray-500 mt-1">+15% this month</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <Calendar className="w-8 h-8 text-blue-500" />
            <span className="text-2xl font-bold text-gray-800">12</span>
          </div>
          <h3 className="text-gray-600 font-medium">Sessions Completed</h3>
          <p className="text-sm text-gray-500 mt-1">3 this week</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <Target className="w-8 h-8 text-green-500" />
            <span className="text-2xl font-bold text-gray-800">7/10</span>
          </div>
          <h3 className="text-gray-600 font-medium">Goals Achieved</h3>
          <p className="text-sm text-gray-500 mt-1">70% completion rate</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="w-8 h-8 text-purple-500" />
            <span className="text-2xl font-bold text-gray-800">+23%</span>
          </div>
          <h3 className="text-gray-600 font-medium">Overall Progress</h3>
          <p className="text-sm text-gray-500 mt-1">Great momentum!</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Sentiment Trend</h3>
          <div className="h-64 flex items-end justify-between space-x-2">
            {sentimentData.map((data, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center">
                <div 
                  className={`w-full rounded-t transition-all ${
                    data.score > 0.7 ? 'bg-green-400' : 
                    data.score > 0.5 ? 'bg-yellow-400' : 'bg-red-400'
                  }`}
                  style={{ height: `${data.score * 100}%` }}
                />
                <span className="text-xs text-gray-500 mt-2">{data.date.slice(-5)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Emotion Distribution</h3>
          <div className="space-y-4">
            {[
              { emotion: 'Happy', percentage: 35, color: 'bg-green-400' },
              { emotion: 'Content', percentage: 28, color: 'bg-blue-400' },
              { emotion: 'Anxious', percentage: 22, color: 'bg-yellow-400' },
              { emotion: 'Sad', percentage: 15, color: 'bg-red-400' },
            ].map((item, idx) => (
              <div key={idx}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700">{item.emotion}</span>
                  <span className="text-gray-500">{item.percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`${item.color} h-2 rounded-full transition-all`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderMoodTracker = () => (
    <div className="flex-1 bg-gray-50 p-6 overflow-y-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Mood Tracker</h2>
      
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">How are you feeling today?</h3>
        
        <div className="flex justify-center space-x-6 mb-6">
          {[1, 2, 3, 4, 5].map(mood => (
            <button
              key={mood}
              onClick={() => setCurrentMood(mood)}
              className={`transition-all ${currentMood === mood ? 'scale-125' : 'hover:scale-110'}`}
            >
              {mood <= 2 ? <Frown className={`w-12 h-12 ${currentMood === mood ? 'text-red-600' : 'text-red-400'}`} /> :
               mood <= 4 ? <Meh className={`w-12 h-12 ${currentMood === mood ? 'text-yellow-600' : 'text-yellow-400'}`} /> :
               <Smile className={`w-12 h-12 ${currentMood === mood ? 'text-green-600' : 'text-green-400'}`} />}
            </button>
          ))}
        </div>
        
        <textarea
          value={journalEntry}
          onChange={(e) => setJournalEntry(e.target.value)}
          placeholder="What's on your mind? (optional)"
          className="w-full p-4 border border-gray-300 rounded-lg resize-none h-32 focus:outline-none focus:border-purple-500"
        />
        
        <button
          onClick={saveMoodEntry}
          className="mt-4 bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
        >
          Save Entry
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent Entries</h3>
        <div className="space-y-4">
          {moodEntries.slice(-5).reverse().map((entry, idx) => (
            <div key={idx} className="border-b border-gray-200 pb-4 last:border-0">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-500">{entry.date}</span>
                {getMoodIcon(entry.mood)}
              </div>
              <p className="text-gray-700">{entry.entry}</p>
            </div>
          ))}
          {moodEntries.length === 0 && (
            <p className="text-gray-500 text-center py-8">No mood entries yet. Start tracking your mood today!</p>
          )}
        </div>
      </div>
    </div>
  );

  const renderGoals = () => (
    <div className="flex-1 bg-gray-50 p-6 overflow-y-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Therapy Goals</h2>
      
      <button
        onClick={addGoal}
        className="mb-6 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
      >
        <Plus className="w-5 h-5" />
        <span>Add New Goal</span>
      </button>

      <div className="space-y-4">
        {goals.map(goal => (
          <div key={goal.id} className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start space-x-3">
                <button
                  onClick={() => toggleGoal(goal.id)}
                  className={`mt-1 ${goal.completed ? 'text-green-500' : 'text-gray-400'}`}
                >
                  {goal.completed ? <Check className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
                </button>
                <div>
                  <h3 className={`text-lg font-medium ${goal.completed ? 'text-gray-500 line-through' : 'text-gray-800'}`}>
                    {goal.text}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">Started 2 weeks ago</p>
                </div>
              </div>
              <span className={`text-sm font-medium ${goal.completed ? 'text-green-600' : 'text-purple-600'}`}>
                {goal.progress}% Complete
              </span>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${goal.completed ? 'bg-green-500' : 'bg-purple-500'}`}
                style={{ width: `${goal.progress}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderResources = () => (
    <div className="flex-1 bg-gray-50 p-6 overflow-y-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Wellness Resources</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { title: 'Breathing Exercises', icon: Cloud, color: 'bg-blue-500', description: 'Calm your mind with guided breathing' },
          { title: 'Mindfulness Meditation', icon: Brain, color: 'bg-purple-500', description: '10-minute daily meditation guides' },
          { title: 'Coping Strategies', icon: Shield, color: 'bg-green-500', description: 'Effective techniques for difficult moments' },
          { title: 'Sleep Hygiene', icon: CloudRain, color: 'bg-indigo-500', description: 'Improve your sleep quality' },
          { title: 'Gratitude Practice', icon: Heart, color: 'bg-red-500', description: 'Daily gratitude exercises' },
          { title: 'Crisis Support', icon: AlertCircle, color: 'bg-orange-500', description: '24/7 emergency resources' },
        ].map((resource, idx) => (
          <div key={idx} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <div className={`${resource.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
              <resource.icon className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">{resource.title}</h3>
            <p className="text-gray-600 text-sm mb-4">{resource.description}</p>
            <button className="text-purple-600 font-medium flex items-center space-x-1 hover:text-purple-700">
              <span>Explore</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderInsights = () => (
    <div className="flex-1 bg-gray-50 p-6 overflow-y-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Your Insights</h2>
      
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Common Themes</h3>
        <div className="flex flex-wrap gap-3">
          {['Anxiety', 'Work Stress', 'Relationships', 'Self-care', 'Sleep', 'Family', 'Health'].map(theme => (
            <span key={theme} className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
              {theme}
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Key Triggers</h3>
          <ul className="space-y-3">
            <li className="flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-orange-500" />
              <span className="text-gray-700">Work deadlines and pressure</span>
            </li>
            <li className="flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-orange-500" />
              <span className="text-gray-700">Social situations</span>
            </li>
            <li className="flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-orange-500" />
              <span className="text-gray-700">Financial concerns</span>
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Effective Coping Strategies</h3>
          <ul className="space-y-3">
            <li className="flex items-center space-x-3">
              <Check className="w-5 h-5 text-green-500" />
              <span className="text-gray-700">Deep breathing exercises</span>
            </li>
            <li className="flex items-center space-x-3">
              <Check className="w-5 h-5 text-green-500" />
              <span className="text-gray-700">Regular physical activity</span>
            </li>
            <li className="flex items-center space-x-3">
              <Check className="w-5 h-5 text-green-500" />
              <span className="text-gray-700">Journaling thoughts</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 mt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-800">Progress Report</h3>
          <button className="text-purple-600 hover:text-purple-700 flex items-center space-x-2">
            <Download className="w-5 h-5" />
            <span>Export PDF</span>
          </button>
        </div>
        <p className="text-gray-600">
          You've shown significant improvement in managing anxiety over the past month. Your consistent use of coping strategies
          and regular therapy sessions have contributed to a 23% overall improvement in your well-being scores.
        </p>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-800">Settings</h3>
          <button onClick={() => setShowSettings(false)} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">AI Provider</label>
            <select
              value={apiProvider}
              onChange={(e) => setApiProvider(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
            >
              <option value="openai">OpenAI</option>
              <option value="claude">Claude (Anthropic)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">API Key</label>
            <div className="flex space-x-2">
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your API key"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
              />
              <button className="text-gray-500 hover:text-gray-700">
                <Key className="w-5 h-5" />
              </button>
            </div>
            <p className="mt-2 text-xs text-gray-500">Your API key is encrypted and stored securely</p>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">Privacy Settings</h4>
            <div className="space-y-2">
              <label className="flex items-center space-x-3">
                <input type="checkbox" className="rounded text-purple-600" defaultChecked />
                <span className="text-sm text-gray-700">Enable end-to-end encryption</span>
              </label>
              <label className="flex items-center space-x-3">
                <input type="checkbox" className="rounded text-purple-600" defaultChecked />
                <span className="text-sm text-gray-700">Auto-delete sessions after 30 days</span>
              </label>
              <label className="flex items-center space-x-3">
                <input type="checkbox" className="rounded text-purple-600" />
                <span className="text-sm text-gray-700">Enable voice transcription</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={() => setShowSettings(false)}
              className="px-6 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => setShowSettings(false)}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-screen flex bg-gray-100">
      {renderSidebar()}
      
      <div className="flex-1 flex flex-col">
        {activeSection === 'chat' && renderChat()}
        {activeSection === 'dashboard' && renderDashboard()}
        {activeSection === 'mood' && renderMoodTracker()}
        {activeSection === 'goals' && renderGoals()}
        {activeSection === 'resources' && renderResources()}
        {activeSection === 'insights' && renderInsights()}
      </div>

      {showSettings && renderSettings()}
    </div>
  );
};

export default AITherapistApp;
