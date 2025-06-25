import express from 'express';
import cors from 'cors';
import projectRoutes from './index' // ✅ now this is a Router

const app = express();
app.use(express.json());
app.use(cors());


app.use('/api', projectRoutes); // ✅ Works now

app.listen(8080, () => {
  console.log('Server listening on port 8080');
});