import React from "react";
import { getAllThemes } from "../utils/courseInfoFormatter";

interface ThemeSelectorProps {
  onThemeSelect: (theme: any) => void;
  onStartChat: () => void;
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({ onThemeSelect, onStartChat }) => {
  // Get real themes from the csvjson.json data in the order they appear
  const themeNames = getAllThemes();
  
  // Create theme objects with descriptions based on the real data
  // Maintain the order from csvjson.json instead of alphabetical sorting
  const themes = themeNames.map(themeName => {
    let description = '';
    switch(themeName) {
      case 'Materials Fundamentals':
        description = 'Core materials science principles and fundamentals';
        break;
      case 'Characterisation':
        description = 'Materials analysis, testing, and characterization techniques';
        break;
      case 'Polymers':
        description = 'Polymer science, properties, and applications';
        break;
      case 'Modelling':
        description = 'Computational modeling and simulation of materials';
        break;
      case 'Crystallography':
        description = 'Crystal structures and crystallographic analysis';
        break;
      case 'Nanotechnology':
        description = 'Nano-scale materials and nanotechnological applications';
        break;
      case 'Electronics':
        description = 'Electronic materials and device applications';
        break;
      case 'Healthcare':
        description = 'Biomedical materials and healthcare applications';
        break;
      case 'Industrial materials':
        description = 'Industrial materials and manufacturing processes';
        break;
      default:
        description = 'Materials science and engineering applications';
    }
    
    return {
      id: themeName.toLowerCase().replace(/\s+/g, '-'),
      name: themeName,
      description: description
    };
  });

  return (
    <div className="theme-selector">
      <div className="welcome-message">
        <h3>Welcome to Lyon CourseBuddy!</h3>
        <p>Choose a theme that interests you, or start chatting directly.</p>
      </div>
      
      <div className="theme-buttons">
        {themes.map((theme) => (
          <button
            key={theme.id}
            onClick={() => onThemeSelect(theme)}
            className="theme-button"
          >
            <strong>{theme.name}</strong>
            <br />
            <small>{theme.description}</small>
          </button>
        ))}
      </div>
      
      <div className="chat-option">
        <button onClick={onStartChat} className="start-chat-button">
          Start General Chat
        </button>
      </div>
    </div>
  );
};

export default ThemeSelector; 