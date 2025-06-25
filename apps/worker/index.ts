import {authMiddleware} from '@repo/middleware/Client';
import cors from 'cors';
import express from 'express';  
import { Prismaclient } from '@repo/db/Client';
import { RedisClient } from '@repo/redis/Client';


const router = express.Router();

router.post('/prompt', authMiddleware, async (req, res) => {
      const {prompt, projectId} = req.body;
      const { userId } = req;
        console.log('Received prompt:', prompt, 'for project:', projectId, 'from user:', userId);
        await Prismaclient.prompt.create({
          data: {
            content: prompt,
            projectId: projectId,
            type: "USER",
          },
        });

        const allPrompts = await Prismaclient.prompt.findMany({
          where: { projectId: projectId },
            orderBy: { createdAt: 'asc' },
        });

})
