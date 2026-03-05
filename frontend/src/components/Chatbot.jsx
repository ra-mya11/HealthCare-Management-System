import React, { useState } from 'react';
import './Chatbot.css';
import ShapChart from './ShapChart';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [healthData, setHealthData] = useState({
    age: '',
    bloodPressure: '',
    bmi: '',
    cholesterol: '',
    sugarLevel: ''
  });
  const [prediction, setPrediction] = useState(null);

  const handleSubmit = async () => {
    const userMessage = `Analyzing health data: Age ${healthData.age}, BP ${healthData.bloodPressure}, BMI ${healthData.bmi}`;
    setMessages([...messages, { type: 'user', text: userMessage }]);

    try {
      const response = await fetch('http://localhost:8080/api/chatbot/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          age: parseFloat(healthData.age),
          bloodPressure: parseFloat(healthData.bloodPressure),
          bmi: parseFloat(healthData.bmi),
          cholesterol: parseFloat(healthData.cholesterol),
          sugarLevel: parseFloat(healthData.sugarLevel)
        })
      });

      const data = await response.json();
      setPrediction(data);
      
      setMessages(prev => [...prev, {
        type: 'bot',
        text: data.explanationText,
        prediction: data
      }]);
    } catch (error) {
      setMessages(prev => [...prev, {
        type: 'bot',
        text: 'Error analyzing health data. Please try again.'
      }]);
    }
  };

  return (
    <>
      <div className={`chatbot-container ${isOpen ? 'open' : ''}`}>
        <div className="chatbot-header">
          <h3>Health AI Assistant</h3>
          <button onClick={() => setIsOpen(false)}>✕</button>
        </div>

        <div className="chatbot-messages">
          {messages.map((msg, idx) => (
            <div key={idx} className={`message ${msg.type}`}>
              <p>{msg.text}</p>
              {msg.prediction && (
                <div className="prediction-details">
                  <div className="risk-badge">
                    Risk: {msg.prediction.riskPercentage}%
                  </div>
                  <ShapChart 
                    featureImportance={msg.prediction.featureImportance}
                    shapValues={msg.prediction.shapValues}
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="chatbot-input">
          <input
            type="number"
            placeholder="Age"
            value={healthData.age}
            onChange={(e) => setHealthData({...healthData, age: e.target.value})}
          />
          <input
            type="number"
            placeholder="Blood Pressure"
            value={healthData.bloodPressure}
            onChange={(e) => setHealthData({...healthData, bloodPressure: e.target.value})}
          />
          <input
            type="number"
            placeholder="BMI"
            value={healthData.bmi}
            onChange={(e) => setHealthData({...healthData, bmi: e.target.value})}
          />
          <input
            type="number"
            placeholder="Cholesterol"
            value={healthData.cholesterol}
            onChange={(e) => setHealthData({...healthData, cholesterol: e.target.value})}
          />
          <input
            type="number"
            placeholder="Sugar Level"
            value={healthData.sugarLevel}
            onChange={(e) => setHealthData({...healthData, sugarLevel: e.target.value})}
          />
          <button onClick={handleSubmit}>Analyze</button>
        </div>
      </div>

      <button 
        className="chatbot-toggle"
        onClick={() => setIsOpen(!isOpen)}
      >
        💬
      </button>
    </>
  );
};

export default Chatbot;
