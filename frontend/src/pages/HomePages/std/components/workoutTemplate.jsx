// Workout Templates Component


const WorkoutTemplates = ({ templates, onAdd, onEdit, onDelete }) => (
  <div style={{ marginBottom: '24px' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
      <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#333', margin: '0' }}>
        My Workout Templates
      </h2>
      <button
        onClick={onAdd}
        style={{
          background: 'none',
          border: 'none',
          color: '#007AFF',
          fontSize: '14px',
          fontWeight: '500',
          cursor: 'pointer'
        }}
      >
        + New
      </button>
    </div>
    
    {templates.length === 0 ? (
      <p style={{ color: '#888', textAlign: 'center', padding: '20px 0' }}>
        No templates yet. Create your first one!
      </p>
    ) : (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {templates.map((template) => (
          <div key={template.templateId} style={{
            background: 'white',
            border: '1px solid #eee',
            borderRadius: '12px',
            padding: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '20px' }}>🏋️</span>
              <div>
                <span style={{ fontSize: '16px', fontWeight: '500', color: '#333' }}>
                  {template.name}
                </span>
                <p style={{ fontSize: '12px', color: '#999', margin: '2px 0 0 0' }}>
                  {new Date(template.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                style={{
                  background: 'none',
                  border: 'none',
                  padding: '8px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '16px'
                }}
                onClick={() => onEdit(template)}
                title="Edit template"
              >
                ✏️
              </button>
              <button 
                style={{
                  background: 'none',
                  border: 'none',
                  padding: '8px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '16px'
                }}
                onClick={() => onDelete(template._id)}
                title="Delete template"
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);
export default WorkoutTemplates;