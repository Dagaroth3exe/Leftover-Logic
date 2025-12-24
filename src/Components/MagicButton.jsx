import './MagicButton.css'

export default function MagicButton({ children, onClick, type = 'button' }) {
  return (
    <button
      onClick={onClick}
      className="magic-btn"
      type={type}
    >
      {children}
    </button>
  )
}
