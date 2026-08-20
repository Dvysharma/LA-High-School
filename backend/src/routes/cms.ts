import { Router, Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import * as jwt from 'jsonwebtoken';
import multer from 'multer';
import * as path from 'path';
import * as fs from 'fs';

const router = Router();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'la_school_super_secret_token_12345';

// --- AUTH MIDDLEWARE ---
export interface AuthRequest extends Request {
  userId?: number;
  username?: string;
}

const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction): any => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Access denied. Token missing.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number; username: string };
    req.userId = decoded.userId;
    req.username = decoded.username;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Token is invalid or expired.' });
  }
};

// --- FILE UPLOAD SETUP (MULTER) ---
// Save files locally to frontend's public uploads directory
const uploadDir = path.resolve(__dirname, '../../../frontend/public/uploads');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit (for videos)
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif|mp4|webm|pdf/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only images, videos (mp4/webm), and PDFs are allowed'));
  },
});

// POST /api/cms/upload (Auth required)
router.post('/upload', authenticateToken, upload.single('file'), (req: Request, res: Response): any => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    // Return the relative URL which will be resolved by the Next.js static asset server
    const url = `/uploads/${req.file.filename}`;
    res.json({ url });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'File upload failed' });
  }
});

// --- PAGE CONTENT ROUTE (GET / SET JSON contents) ---
// GET /api/cms/page/:key (Public)
router.get('/page/:key', async (req: Request, res: Response): Promise<any> => {
  try {
    const { key } = req.params;
    const page = await prisma.pageContent.findUnique({ where: { key } });
    if (!page) {
      return res.status(404).json({ error: `Page content for key '${key}' not found.` });
    }
    res.json(JSON.parse(page.value));
  } catch (error) {
    res.status(500).json({ error: 'Error fetching page content' });
  }
});

// POST /api/cms/page/:key (Auth required)
router.post('/page/:key', authenticateToken, async (req: Request, res: Response): Promise<any> => {
  try {
    const { key } = req.params;
    const value = JSON.stringify(req.body);

    const page = await prisma.pageContent.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });

    res.json({ message: `Page content for '${key}' updated successfully.`, data: JSON.parse(page.value) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error updating page content' });
  }
});

// --- FACULTY CRUD ROUTES ---
// GET /api/cms/faculty (Public)
router.get('/faculty', async (req: Request, res: Response) => {
  try {
    const faculty = await prisma.faculty.findMany();
    res.json(faculty);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching faculty' });
  }
});

// POST /api/cms/faculty (Auth)
router.post('/faculty', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { name, department, qualification, experience, photoUrl, bio } = req.body;
    const newFaculty = await prisma.faculty.create({
      data: { name, department, qualification, experience, photoUrl, bio },
    });
    res.json(newFaculty);
  } catch (error) {
    res.status(500).json({ error: 'Error creating faculty member' });
  }
});

// PUT /api/cms/faculty/:id (Auth)
router.put('/faculty/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const { name, department, qualification, experience, photoUrl, bio } = req.body;
    const updated = await prisma.faculty.update({
      where: { id },
      data: { name, department, qualification, experience, photoUrl, bio },
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Error updating faculty member' });
  }
});

// DELETE /api/cms/faculty/:id (Auth)
router.delete('/faculty/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.faculty.delete({ where: { id } });
    res.json({ success: true, message: 'Faculty member deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting faculty member' });
  }
});

// --- ALUMNI CRUD ROUTES ---
// GET /api/cms/alumni (Public)
router.get('/alumni', async (req: Request, res: Response) => {
  try {
    const alumni = await prisma.alumni.findMany();
    res.json(alumni);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching alumni' });
  }
});

// POST /api/cms/alumni (Auth)
router.post('/alumni', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { name, batch, currentPosition, company, achievement, photoUrl, linkedin } = req.body;
    const newAlumni = await prisma.alumni.create({
      data: { name, batch, currentPosition, company, achievement, photoUrl, linkedin },
    });
    res.json(newAlumni);
  } catch (error) {
    res.status(500).json({ error: 'Error creating alumni' });
  }
});

// PUT /api/cms/alumni/:id (Auth)
router.put('/alumni/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const { name, batch, currentPosition, company, achievement, photoUrl, linkedin } = req.body;
    const updated = await prisma.alumni.update({
      where: { id },
      data: { name, batch, currentPosition, company, achievement, photoUrl, linkedin },
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Error updating alumni' });
  }
});

// DELETE /api/cms/alumni/:id (Auth)
router.delete('/alumni/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.alumni.delete({ where: { id } });
    res.json({ success: true, message: 'Alumni deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting alumni' });
  }
});

// --- GALLERY ROUTES ---
// GET /api/cms/gallery (Public)
router.get('/gallery', async (req: Request, res: Response) => {
  try {
    const gallery = await prisma.gallery.findMany({
      orderBy: { orderIndex: 'asc' },
    });
    res.json(gallery);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching gallery' });
  }
});

// POST /api/cms/gallery (Auth)
router.post('/gallery', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { type, url, category, orderIndex } = req.body;
    const newItem = await prisma.gallery.create({
      data: { type, url, category, orderIndex: orderIndex || 0 },
    });
    res.json(newItem);
  } catch (error) {
    res.status(500).json({ error: 'Error adding gallery item' });
  }
});

// POST /api/cms/gallery/reorder (Auth)
router.post('/gallery/reorder', authenticateToken, async (req: Request, res: Response): Promise<any> => {
  try {
    const { items } = req.body; // Array of { id: number, orderIndex: number }
    if (!items || !Array.isArray(items)) {
      return res.status(400).json({ error: 'Invalid items array' });
    }

    const updates = items.map((item) =>
      prisma.gallery.update({
        where: { id: item.id },
        data: { orderIndex: item.orderIndex },
      })
    );
    await Promise.all(updates);

    res.json({ success: true, message: 'Gallery reordered' });
  } catch (error) {
    res.status(500).json({ error: 'Error reordering gallery' });
  }
});

// DELETE /api/cms/gallery/:id (Auth)
router.delete('/gallery/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.gallery.delete({ where: { id } });
    res.json({ success: true, message: 'Gallery item deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting gallery item' });
  }
});

// --- BLOG CRUD ROUTES ---
// GET /api/cms/blog (Public)
router.get('/blog', async (req: Request, res: Response) => {
  try {
    const blogs = await prisma.blog.findMany({
      orderBy: { publishedAt: 'desc' },
    });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching blogs' });
  }
});

// GET /api/cms/blog/:slug (Public)
router.get('/blog/:slug', async (req: Request, res: Response): Promise<any> => {
  try {
    const { slug } = req.params;
    const blog = await prisma.blog.findUnique({ where: { slug } });
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }
    res.json(blog);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching blog details' });
  }
});

// POST /api/cms/blog (Auth)
router.post('/blog', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { title, content, slug, category, featuredImage, draft } = req.body;
    const newBlog = await prisma.blog.create({
      data: { title, content, slug, category, featuredImage, draft: draft ?? true, publishedAt: new Date() },
    });
    res.json(newBlog);
  } catch (error) {
    res.status(500).json({ error: 'Error creating blog post' });
  }
});

// PUT /api/cms/blog/:id (Auth)
router.put('/blog/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const { title, content, slug, category, featuredImage, draft } = req.body;
    const updated = await prisma.blog.update({
      where: { id },
      data: { title, content, slug, category, featuredImage, draft },
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Error updating blog post' });
  }
});

// DELETE /api/cms/blog/:id (Auth)
router.delete('/blog/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.blog.delete({ where: { id } });
    res.json({ success: true, message: 'Blog post deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting blog post' });
  }
});

// --- EVENTS CRUD ROUTES ---
// GET /api/cms/event (Public)
router.get('/event', async (req: Request, res: Response) => {
  try {
    const events = await prisma.event.findMany({
      orderBy: { date: 'asc' },
    });
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching events' });
  }
});

// POST /api/cms/event (Auth)
router.post('/event', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { title, date, description, location } = req.body;
    const newEvent = await prisma.event.create({
      data: { title, date, description, location },
    });
    res.json(newEvent);
  } catch (error) {
    res.status(500).json({ error: 'Error creating event' });
  }
});

// PUT /api/cms/event/:id (Auth)
router.put('/event/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const { title, date, description, location } = req.body;
    const updated = await prisma.event.update({
      where: { id },
      data: { title, date, description, location },
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Error updating event' });
  }
});

// DELETE /api/cms/event/:id (Auth)
router.delete('/event/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.event.delete({ where: { id } });
    res.json({ success: true, message: 'Event deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting event' });
  }
});

// --- NEWS CRUD ROUTES ---
// GET /api/cms/news (Public)
router.get('/news', async (req: Request, res: Response) => {
  try {
    const news = await prisma.news.findMany({
      orderBy: { date: 'desc' },
    });
    res.json(news);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching news' });
  }
});

// POST /api/cms/news (Auth)
router.post('/news', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { title, date, content, imageUrl } = req.body;
    const newNews = await prisma.news.create({
      data: { title, date, content, imageUrl },
    });
    res.json(newNews);
  } catch (error) {
    res.status(500).json({ error: 'Error creating news item' });
  }
});

// PUT /api/cms/news/:id (Auth)
router.put('/news/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const { title, date, content, imageUrl } = req.body;
    const updated = await prisma.news.update({
      where: { id },
      data: { title, date, content, imageUrl },
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Error updating news item' });
  }
});

// DELETE /api/cms/news/:id (Auth)
router.delete('/news/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.news.delete({ where: { id } });
    res.json({ success: true, message: 'News item deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting news item' });
  }
});

// POST /api/cms/admission (Public)
router.post('/admission', (req: Request, res: Response) => {
  try {
    const { name, gmail, className, contactNumber, emailId, basicInfo } = req.body;
    console.log('New Admission Application Received:', { name, gmail, className, contactNumber, emailId, basicInfo });
    res.json({ success: true, message: 'Admission application received successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to process admission request.' });
  }
});

export default router;


