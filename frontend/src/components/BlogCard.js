import React from 'react';

export default function BlogCard({ blog, onEdit, onDelete }) {
  const formattedDate = new Date(blog.created_at).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="blog-card">
      <div>
        <div className="blog-date">{formattedDate}</div>
        <h3 className="blog-title">{blog.title}</h3>
        <p className="blog-content">{blog.content}</p>
      </div>
      <div className="card-actions">
        <button className="action-link edit-link" onClick={() => onEdit(blog)}>
          Edit
        </button>
        <button className="action-link delete-link" onClick={() => onDelete(blog.id)}>
          Delete
        </button>
      </div>
    </div>
  );
}