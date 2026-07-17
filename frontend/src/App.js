import React, { useState, useEffect, useCallback } from 'react';
import BlogForm from './components/BlogForm';
import BlogCard from './components/BlogCard';
import Pagination from './components/Pagination';
import './styles.css';

const API_BASE_URL = 'http://127.0.0.1:8000/api';
const ITEMS_PER_PAGE = 4; // Ensures 2 clean rows of 2 blogs on laptop layouts

export default function App() {
  const [blogs, setBlogs] = useState([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  
  // Form States
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editingId, setEditingId] = useState(null);

  const fetchBlogs = useCallback(async () => {
    const skip = (currentPage - 1) * ITEMS_PER_PAGE;
    try {
      const response = await fetch(`${API_BASE_URL}/blogs?skip=${skip}&limit=${ITEMS_PER_PAGE}`);
      const data = await response.json();
      setBlogs(data.blogs);
      setTotal(data.total);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    }
  }, [currentPage]);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  const handleSave = async () => {
    const payload = { title, content };
    try {
      if (editingId) {
        // Update Existing Blog
        await fetch(`${API_BASE_URL}/blogs/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        // Create New Blog
        await fetch(`${API_BASE_URL}/blogs`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        setCurrentPage(1); // Return to page 1 to view new post
      }
      resetForm();
      fetchBlogs();
    } catch (error) {
      console.error("Error saving blog:", error);
    }
  };

  const handleEditClick = (blog) => {
    setEditingId(blog.id);
    setTitle(blog.title);
    setContent(blog.content);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to remove this blog entry?")) return;
    try {
      await fetch(`${API_BASE_URL}/blogs/${id}`, { method: 'DELETE' });
      fetchBlogs();
    } catch (error) {
      console.error("Error removing blog:", error);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setContent('');
  };

  return (
    <div className="container">
      <h1>Daily Log Chronicles</h1>
      
      <BlogForm
        title={title}
        setTitle={setTitle}
        content={content}
        setContent={setContent}
        onSave={handleSave}
        editingId={editingId}
        onCancel={resetForm}
      />

      <div className="blog-grid">
        {blogs.map((blog) => (
          <BlogCard
            key={blog.id}
            blog={blog}
            onEdit={handleEditClick}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {total > 0 && (
        <Pagination
          currentPage={currentPage}
          total={total}
          limit={ITEMS_PER_PAGE}
          onPageChange={(page) => setCurrentPage(page)}
        />
      )}
    </div>
  );
}