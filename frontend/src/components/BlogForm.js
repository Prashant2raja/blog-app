import React from 'react';

export default function BlogForm({ title, setTitle, content, setContent, onSave, editingId, onCancel }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave();
  };

  return (
    <div className="form-card">
      <h2>{editingId ? 'Edit Your Blog' : 'Write a New Blog'}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="input-field"
          placeholder="Enter blog title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          className="textarea-field"
          placeholder="Write down your thoughts..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        <button type="submit" className="btn-primary">
          {editingId ? 'Update Entry' : 'Publish Blog'}
        </button>
        {editingId && (
          <button type="button" className="btn-primary btn-cancel" onClick={onCancel}>
            Cancel Edit
          </button>
        )}
      </form>
    </div>
  );
}