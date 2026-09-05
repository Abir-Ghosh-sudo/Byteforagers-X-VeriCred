export default function Toast({message,type="success",onClose}){if(!message)return null;return <div className={`toast ${type}`}>{message}<button onClick={onClose}>×</button></div>}
