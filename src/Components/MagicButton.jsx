import './MagicButton.css'

export default function MagicButton({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      className="magic-btn"
      type="button"
    >
      {children}
    </button>
  )
}
