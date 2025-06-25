'use client';

import { API_BASE_URL } from '@/config';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';

interface Project {
  id: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [search, setSearch] = useState('');
  const [filtered, setFiltered] = useState<Project[]>([]);
  const { getToken } = useAuth();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/projects`, {
          headers: {
            Authorization: `Bearer ${await getToken()}`
          }
        });
        setProjects(res.data);
        setFiltered(res.data);
      } catch (err) {
        console.error('Failed to fetch projects', err);
      }
    };

    fetchProjects();
  }, []);

  useEffect(() => {
    const term = search.toLowerCase();
    setFiltered(
      projects.filter((p) =>
        (p.description ?? 'Untitled Project').toLowerCase().includes(term)
      )
    );
  }, [search, projects]);

  return (
    <>
      {/* Hover trigger zone */}
      <div
        className="fixed top-0 left-0 h-full w-2 z-40"
        onMouseEnter={() => setIsOpen(true)}
      />

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white text-black p-4 z-50 shadow-lg transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        onMouseLeave={() => setIsOpen(false)}
      >
        {/* Heading */}
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Start building projects
        </h2>

        {/* Search Input */}
        <input
          type="text"
          placeholder="Search Projects..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-3 py-2 rounded border border-gray-300 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Projects List */}
        <div className="space-y-3 max-h-[calc(100vh-150px)] overflow-y-auto pr-2">
          {filtered.length === 0 ? (
            <p className="text-sm text-gray-500">No projects found</p>
          ) : (
            filtered.map((project) => (
              <div
                key={project.id}
                className="bg-gray-100 p-3 rounded-md hover:bg-gray-200 transition group cursor-pointer"
              >
                <p
                  className="text-sm font-medium text-ellipsis overflow-hidden whitespace-nowrap group-hover:text-blue-600"
                  title={project.description ?? 'Untitled Project'}
                >
                  {project.description ?? 'Untitled Project'}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Created on {formatDate(project.createdAt)}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
