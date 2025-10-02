// Template Modal Component


const TemplateModal = ({ show, editingTemplate, workoutName, onClose, onSave, onChange }) => {
  if (!show) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 50,
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '24px',
        maxWidth: '320px',
        width: '100%'
      }}>
        <h3 style={{ fontSize: '18px', fontWeight: '600', margin: '0 0 16px 0' }}>
          {editingTemplate ? 'Edit Workout Template' : 'Create Workout Template'}
        </h3>
        <input
          type="text"
          placeholder="Enter workout name..."
          value={editingTemplate ? editingTemplate.name : workoutName}
          onChange={onChange}
          style={{
            width: '100%',
            padding: '12px',
            border: '1px solid #ddd',
            borderRadius: '8px',
            fontSize: '16px',
            marginBottom: '16px',
            outline: 'none',
            boxSizing: 'border-box'
          }}
          autoFocus
          onKeyPress={(e) => {
            if (e.key === 'Enter') onSave();
          }}
        />
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={onSave}
            disabled={!workoutName.trim() && (!editingTemplate || !editingTemplate.name.trim())}
            style={{
              flex: 1,
              background: '#007AFF',
              color: 'white',
              border: 'none',
              padding: '12px',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              opacity: (!workoutName.trim() && (!editingTemplate || !editingTemplate.name.trim())) ? 0.5 : 1
            }}
          >
            {editingTemplate ? 'Save Changes' : 'Save'}
          </button>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              background: '#f5f5f5',
              color: '#333',
              border: 'none',
              padding: '12px',
              borderRadius: '8px',
              fontSize: '16px',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
export default TemplateModal;
