import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const InputBox = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [modelList, setModelList] = useState([]);
  const [answers, setAnswers] = useState({
    model: '',
    role: '',
    personality: '',
    reference: '',
    mod_name: '',
    extraInfo: '',
  });
  const [isCustomRole, setIsCustomRole] = useState(false); // Tracks if "Other" is selected

  const inputRef = useRef(null); // Ref to manage focus for custom input

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
      placeholder: 'Enter the role',
      key: 'role',
      condition: () => isCustomRole,
    },
    {
      type: 'select',
      label: 'Any particular character or famous personality?',
      key: 'personalityPref',
      options: ['yes', 'no'],
    },
    {
      type: 'text',
      placeholder: "Enter the character's full name",
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
      condition: () => true,
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

    if (value === 'Other') {
      setIsCustomRole(true); // Mark "Other" as custom
      setAnswers((prevAnswers) => ({
        ...prevAnswers,
        [currentKey]: '',
      }));
      setTimeout(() => {
        inputRef.current?.focus(); // Automatically focus custom input
      }, 0);
    } else {
      setIsCustomRole(false); // Reset custom role
      setAnswers((prevAnswers) => ({
        ...prevAnswers,
        [currentKey]: value,
      }));
    }
  };

  const handleNext = () => {
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

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleNext();
    }
  };

  const currentQuestion = questions[currentStep];

  return (
    <div className="tbox">
      <div className="input-box">
        {currentQuestion.type === 'text' ? (
          <input
            className="typeb"
            type="text"
            placeholder={currentQuestion.placeholder}
            value={answers[currentQuestion.key] || ''}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            ref={isCustomRole && currentQuestion.key === 'role' ? inputRef : null}
          />
        ) : currentQuestion.key === 'role' && isCustomRole ? (
          // Render custom role input box for "Other"
          <input
            className="typeb"
            type="text"
            placeholder="Enter a custom role"
            value={answers.role || ''}
            onChange={(e) =>
              setAnswers((prevAnswers) => ({
                ...prevAnswers,
                role: e.target.value,
              }))
            }
            onKeyDown={handleKeyDown}
            ref={inputRef}
          />
        ) : (
          // Render dropdown for all other cases
          <select
            className="typeb"
            value={isCustomRole ? 'Other' : answers[currentQuestion.key] || ''}
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

        <span>|</span>
        <div className="icon">
          <button
            onClick={handleNext}
            disabled={
              (isCustomRole && answers.role === '') ||
              (!isCustomRole && answers[currentQuestion.key] === '')
            }
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default InputBox;