import React, { useState, useEffect } from 'react';
import logo from '../assets/logo.png';
import axios from 'axios';

const InputBox = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [modelList, setModelList] = useState([]);
  const [answers, setAnswers] = useState({
    model: '',
    role: '',
    customRole: '',
    personality: '',
    reference: '',
    mod_name: '',
    extraInfo: '',
  });

  const questions = [
    {
      type: 'select',
      label: 'Choose a Base Model',
      key: 'model',
      options: modelList,
    },
    {
      type: 'select',
      label: 'Choose a role',
      key: 'role',
      options: ['Personal Assistant', 'Tutor', 'Companion', 'Social Connector', 'Other'],
    },
    {
      type: 'text',
      placeholder: 'Enter a custom role if "Other" is selected',
      key: 'customRole',
      condition: () => answers.role === 'Other',
    },
    {
      type: 'select',
      label: 'Do you want your AI to behave like a particular character or famous personality?',
      key: 'personalityPref',
      options: ['yes', 'no'],
    },
    {
      type: 'text',
      placeholder: 'Enter their full name',
      key: 'personality',
      condition: () => answers.personalityPref === 'yes',
    },
    {
      type: 'text',
      placeholder: 'Provide a reference (e.g., show, book, or context)',
      key: 'reference',
      condition: () => answers.personalityPref === 'yes',
    },
    {
      type: 'text',
      placeholder: (answers.role
        ? `What would you like to name your ${answers.role}?`
        : 'What would you like to name your role?'),
      key: 'mod_name',
    },
    {
      type: 'text',
      placeholder: 'Anything else you would like to specify?',
      key: 'extraInfo',
      condition: () => true, // Optional, appears at the end
    },
  ];

  // Fetch model list from API
  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/get_models');
        setModelList(response.data.models || []);
      } catch (error) {
        console.error('Error fetching model list:', error);
        setModelList(['example_model', 'fallback_model']);
      }
    };

    fetchModels();
  }, []);

  const handleInput = (e) => {
    const value = e.target.value;
    const currentKey = questions[currentStep].key;

    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [currentKey]: value,
    }));
  };

  const handleSelect = (e) => {
    const value = e.target.value;
    const currentKey = questions[currentStep].key;

    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [currentKey]: value,
    }));
  };

  const handleNext = () => {
    // Skip questions with conditions that are not met
    let nextStep = currentStep + 1;
    while (nextStep < questions.length && questions[nextStep].condition && !questions[nextStep].condition()) {
      nextStep++;
    }

    if (nextStep < questions.length) {
      setCurrentStep(nextStep);
    } else {
      console.log('Final Output:', answers);
      alert('All questions answered! Check the console for the final output.');
    }
  };

  const currentQuestion = questions[currentStep];

  return (
    <div className="tbox">
      <div className="input-box">
        <div className="icon">
          <img src={logo} alt="icon" />
        </div>

        {currentQuestion.type === 'text' ? (
          <input
            className="typeb"
            type="text"
            placeholder={currentQuestion.placeholder}
            value={answers[currentQuestion.key] || ''}
            onChange={handleInput}
          />
        ) : (
          <select
            className="typeb"
            value={answers[currentQuestion.key] || ''}
            onChange={handleSelect}
          >
            <option value="" disabled>
              {currentQuestion.label}
            </option>
            {currentQuestion.options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        )}

        {answers.role === 'Other' && currentQuestion.key === 'role' && (
          <input
            className="typeb"
            type="text"
            placeholder="Enter a custom role"
            value={answers.customRole || ''}
            onChange={handleInput}
          />
        )}

        <button
          style={{
            marginLeft: '10px',
            background: '#405CD3',
            color: 'white',
            border: 'none',
            padding: '10px',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
          onClick={handleNext}
          disabled={answers[currentQuestion.key] === ''}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default InputBox;
