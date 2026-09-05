import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

// Source folder is Gallery in the workspace root
const sourceDir = path.resolve(__dirname, '../../Gallery');
// Target folder is frontend/public/gallery
const targetDir = path.resolve(__dirname, '../../frontend/public/gallery');

async function main() {
  console.log('Starting gallery image import and database seeding...');

  // Ensure target directory exists
  if (!fs.existsSync(targetDir)) {
    console.log(`Creating target directory: ${targetDir}`);
    fs.mkdirSync(targetDir, { recursive: true });
  }

  // Ensure source directory exists
  if (!fs.existsSync(sourceDir)) {
    console.error(`Error: Source directory "${sourceDir}" not found!`);
    process.exit(1);
  }

  // Read files from source
  const files = fs.readdirSync(sourceDir);
  
  // Filter for image files
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
  const imageFiles = files.filter(file => {
    const ext = path.extname(file).toLowerCase();
    const stats = fs.statSync(path.join(sourceDir, file));
    return stats.isFile() && imageExtensions.includes(ext);
  });

  console.log(`Found ${imageFiles.length} image files in source directory.`);

  if (imageFiles.length === 0) {
    console.log('No image files to process.');
    return;
  }

  // Categories to round-robin distribute the images
  const categories = ['Campus', 'Sports', 'Labs', 'Events'];

  // Delete existing database records in Gallery table
  console.log('Clearing existing database records in Gallery...');
  await prisma.gallery.deleteMany({});

  // 1. First seed the curated, accurately labeled images
  const curatedItems = [
    { category: 'Campus', url: '/images/school-campus.jpg', orderIndex: 1 },
    { category: 'Labs', url: '/images/computer-lab.jpg', orderIndex: 2 },
    { category: 'Sports', url: '/images/physical-exercise.jpg', orderIndex: 3 },
    { category: 'Events', url: '/images/dance-competition.jpg', orderIndex: 4 },
    { category: 'Campus', url: '/images/classroom.jpg', orderIndex: 5 },
    { category: 'Campus', url: '/images/library.jpg', orderIndex: 6 },
    { category: 'Sports', url: '/images/students-playing.jpg', orderIndex: 7 },
    { category: 'Events', url: '/images/award.jpg', orderIndex: 8 },
    { category: 'Events', url: '/images/art.jpg', orderIndex: 9 },
    { category: 'Events', url: '/images/dance.jpg', orderIndex: 10 },
    { category: 'Events', url: '/images/competition.jpg', orderIndex: 11 },
    { category: 'Campus', url: '/images/prayer.jpg', orderIndex: 12 },
    { category: 'Campus', url: '/images/teacher-teaching.jpg', orderIndex: 13 }
  ];

  for (const item of curatedItems) {
    await prisma.gallery.create({
      data: {
        type: 'image',
        url: item.url,
        category: item.category,
        orderIndex: item.orderIndex
      }
    });
  }
  console.log(`Seeded ${curatedItems.length} curated labeled gallery items.`);

  // 2. Process and copy files from Gallery folder
  let successCount = 0;
  for (let i = 0; i < imageFiles.length; i++) {
    const originalFile = imageFiles[i];
    const ext = path.extname(originalFile).toLowerCase();
    const cleanFileName = `gallery-image-${i + 1}${ext}`;
    
    const srcPath = path.join(sourceDir, originalFile);
    const destPath = path.join(targetDir, cleanFileName);

    try {
      // Copy file
      fs.copyFileSync(srcPath, destPath);

      // Create DB record
      const category = 'Campus'; // Default to campus/activities for general collection
      const url = `/gallery/${cleanFileName}`;
      
      await prisma.gallery.create({
        data: {
          type: 'image',
          url: url,
          category: category,
          orderIndex: curatedItems.length + i + 1
        }
      });

      successCount++;
      if (successCount % 20 === 0 || successCount === imageFiles.length) {
        console.log(`Successfully processed and seeded ${successCount}/${imageFiles.length} gallery images.`);
      }
    } catch (error) {
      console.error(`Error processing image file "${originalFile}":`, error);
    }
  }

  console.log(`Gallery import and seeding complete! Total: ${curatedItems.length + successCount} images.`);
}

main()
  .catch((e) => {
    console.error('Fatal error during import:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
