'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useAuth } from '@clerk/nextjs';
import axios from 'axios';
import { API_BASE_URL } from '@/config';

export default function Prompt() {
  const [prompt, setPrompt] = useState('');
  const { getToken } = useAuth();

  const examples = [
    'Build a SaaS dashboard',
    'Create a blog website',
    'Generate a chatbot app',
    'Design a portfolio page',
  ];

  const handleSubmit = async () => {
    try {
      const token = await getToken();
      const res = await axios.post(
        `${API_BASE_URL}/project`,
        { prompt },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log('Project created:', res.data);
    } catch (error) {
      console.error('Failed to submit prompt:', error);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <h2 className="text-3xl font-bold mb-2">What do you want to build?</h2>
      <p className="text-muted-foreground mb-6 max-w-lg">
        Describe your idea and let us help you scaffold the project instantly.
      </p>

      <div className="flex items-center gap-2 w-full max-w-xl">
        <Input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g. Build a modern e-commerce site"
        />
        <Button onClick={handleSubmit}>
          <ArrowRight className="h-4 w-4 rotate-320" />
        </Button>
      </div>

      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4 w-full max-w-xl">
        {examples.map((example, i) => (
          <Card
            key={i}
            className="cursor-pointer p-4 hover:shadow-md transition"
            onClick={() => setPrompt(example)}
          >
            {example}
          </Card>
        ))}
      </div>
    </main>
  );
}
