import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: ".env.local" });

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required to seed the database.");
}

const prisma = new PrismaClient({
  adapter: new PrismaPg(databaseUrl),
});

async function main() {
  console.log("Starting database seed...");

  try {
    // Create admin user with hardcoded credentials
    const adminEmail = "technest12@technest.com";
    const adminPassword = "TechNext123";

    // Check if admin user already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: adminEmail },
    });

    if (existingAdmin) {
      console.log("Admin user already exists");
      return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    // Create admin user
    const admin = await prisma.user.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        name: "Admin",
        role: "admin",
        phone: "+923329981207",
        city: "Islamabad",
      },
    });

    console.log("Admin user created successfully:", admin.email);

    // Create sample categories
    const categories = await Promise.all([
      prisma.category.upsert({
        where: { slug: "laptops" },
        update: {},
        create: {
          name: "Laptops",
          slug: "laptops",
        },
      }),
      prisma.category.upsert({
        where: { slug: "phones" },
        update: {},
        create: {
          name: "Phones",
          slug: "phones",
        },
      }),
      prisma.category.upsert({
        where: { slug: "monitors" },
        update: {},
        create: {
          name: "Monitors",
          slug: "monitors",
        },
      }),
      prisma.category.upsert({
        where: { slug: "keyboards" },
        update: {},
        create: {
          name: "Keyboards",
          slug: "keyboards",
        },
      }),
      prisma.category.upsert({
        where: { slug: "mice" },
        update: {},
        create: {
          name: "Mice",
          slug: "mice",
        },
      }),
    ]);

    console.log("Categories created successfully");

    // Create sample products
    if (categories.length > 0) {
      const laptopCategory = categories.find((category: { slug: string }) => category.slug === "laptops");
      if (laptopCategory) {
        await prisma.product.upsert({
          where: { slug: "macbook-pro-16" },
          update: {},
          create: {
            name: "MacBook Pro 16 inch",
            slug: "macbook-pro-16",
            description: "Powerful laptop for professionals and developers",
            sku: "MB-PRO-16-2024",
            categoryId: laptopCategory.id,
            price: 250000,
            originalPrice: 280000,
            brand: "Apple",
            images: ["https://via.placeholder.com/300x200?text=MacBook"],
            stock: 5,
            featured: true,
            active: true,
          },
        });

        console.log("Sample products created");
      }
    }

    console.log("Database seed completed successfully!");
  } catch (error) {
    console.error("Seed error:", error);
    throw error;
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
