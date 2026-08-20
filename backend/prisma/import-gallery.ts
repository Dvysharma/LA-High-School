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

  // Process files
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
      const category = categories[i % categories.length];
      const url = `/gallery/${cleanFileName}`;
      
      await prisma.gallery.create({
        data: {
          type: 'image',
          url: url,
          category: category,
          orderIndex: i + 1
        }
      });

      successCount++;
      if (successCount % 10 === 0 || successCount === imageFiles.length) {
        console.log(`Successfully processed and seeded ${successCount}/${imageFiles.length} images.`);
      }
    } catch (error) {
      console.error(`Error processing image file "${originalFile}":`, error);
    }
  }

  console.log(`Gallery import and seeding complete! Total: ${successCount} images.`);
}

main()
  .catch((e) => {
    console.error('Fatal error during import:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
