import { useNavigate } from 'react-router-dom';
import './BackButton.css';

function BackButton() {
  const navigate = useNavigate();

  return (
    <button 
      className="back-button"
      onClick={() => navigate(-1)}
      aria-label="Повернутися назад"
      type="button"
    >
      <svg 
        width="50" 
        height="50" 
        viewBox="0 0 50 50" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <path 
          d="M39.5832 25H10.4165" 
          stroke="#4B4B4B" 
          strokeWidth="4" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
        />
        <path 
          d="M24.9998 39.5833L10.4165 25L24.9998 10.4166" 
          stroke="#4B4B4B" 
          strokeWidth="4" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
        />
      </svg>
    </button>
  );
}

export default BackButton;