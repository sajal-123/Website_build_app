import express, { type Request, type Response } from 'express';
import { redisClient } from '@repo/redis/Client';
import { Prismaclient } from '@repo/db/Client';
import { authMiddleware } from '@repo/middleware/Client';
const router = express.Router();

// POST /project — Create a new project
router.post('/project', authMiddleware, async (req, res) => {
  const { prompt } = req.body;
  const { userId, userEmail } = req;
  console.log('Received prompt:', prompt, 'from user:', userId);

  try {
    // Ensure user exists
    let user = await Prismaclient.user.findUnique({ where: { id: userId } });

    if (!user) {
      user = await Prismaclient.user.create({
        data: {
          id: userId,
          email: userEmail ?? '',
        },
      });
      console.log('Created new user:', user);
    }

    const description = prompt?.split('\n')[0] || 'Untitled Project';

    const project = await Prismaclient.project.create({
      data: {
        description,
        userId: user.id,
      },
    });
    console.log('Created project:', project);

    res.status(201).json(project);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ error: 'Failed to create project' });
  }
});

// GET /projects — Fetch all projects for authenticated user
router.get('/projects', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const projects = await Prismaclient.project.findMany({
      where: { userId },
      include: {
        prompts: true,
      },
    });

    res.status(200).json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST /project/:projectId — Add a new prompt to a project
router.post('/project/:projectId', authMiddleware, async (req,res)=>{
  try {
    const { projectId } = req.params;
    const { prompt } = req.body;
    const userId = req.userId;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const existingProject = await Prismaclient.project.findFirst({
      where: {
        id: projectId,
        userId,
      },
    });

    if (!existingProject) {
      return res.status(404).json({ error: 'Project not found or unauthorized' });
    }

    const updatedProject = await Prismaclient.project.update({
      where: { id: projectId },
      data: {
        description: prompt.split('\n')[0],
        prompts: {
          create: {
            content: prompt,
          },
        },
      },
    });

    res.status(200).json({ projectId: updatedProject.id });
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
