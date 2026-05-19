import { prisma } from "@/lib/db";

/**
 * Inventory Management Service
 * Handles product stock, reservations, and stock movements
 */

export class InventoryService {
  /**
   * Get product inventory
   */
  static async getInventory(productId: string) {
    const inventory = await prisma.inventory.findUnique({
      where: { productId },
    });

    if (!inventory) {
      throw new Error(`Inventory not found for product ${productId}`);
    }

    return inventory;
  }

  /**
   * Initialize inventory for a new product
   */
  static async initializeInventory(productId: string, quantity: number) {
    return await prisma.inventory.create({
      data: {
        productId,
        quantity,
        reserved: 0,
        sold: 0,
      },
    });
  }

  /**
   * Update stock quantity (admin function)
   */
  static async updateStock(productId: string, newQuantity: number) {
    const inventory = await prisma.inventory.findUnique({
      where: { productId },
    });

    if (!inventory) {
      throw new Error(`Inventory not found for product ${productId}`);
    }

    return await prisma.inventory.update({
      where: { productId },
      data: { quantity: newQuantity },
    });
  }

  /**
   * Reserve stock for pending order
   */
  static async reserveStock(productId: string, quantity: number) {
    const inventory = await prisma.inventory.findUnique({
      where: { productId },
    });

    if (!inventory) {
      throw new Error(`Inventory not found for product ${productId}`);
    }

    const availableQuantity = inventory.quantity - inventory.reserved;

    if (availableQuantity < quantity) {
      throw new Error(
        `Insufficient stock. Available: ${availableQuantity}, Requested: ${quantity}`
      );
    }

    return await prisma.inventory.update({
      where: { productId },
      data: {
        reserved: {
          increment: quantity,
        },
      },
    });
  }

  /**
   * Release reserved stock (when order is cancelled)
   */
  static async releaseStock(productId: string, quantity: number) {
    const inventory = await prisma.inventory.findUnique({
      where: { productId },
    });

    if (!inventory) {
      throw new Error(`Inventory not found for product ${productId}`);
    }

    const newReserved = Math.max(0, inventory.reserved - quantity);

    return await prisma.inventory.update({
      where: { productId },
      data: { reserved: newReserved },
    });
  }

  /**
   * Confirm sale (move from reserved to sold)
   */
  static async confirmSale(productId: string, quantity: number) {
    const inventory = await prisma.inventory.findUnique({
      where: { productId },
    });

    if (!inventory) {
      throw new Error(`Inventory not found for product ${productId}`);
    }

    if (inventory.reserved < quantity) {
      throw new Error(
        `Cannot confirm sale: reserved stock is less than quantity`
      );
    }

    return await prisma.inventory.update({
      where: { productId },
      data: {
        quantity: {
          decrement: quantity,
        },
        reserved: {
          decrement: quantity,
        },
        sold: {
          increment: quantity,
        },
      },
    });
  }

  /**
   * Check if product is in stock
   */
  static async isInStock(productId: string, requestedQuantity: number = 1) {
    const inventory = await prisma.inventory.findUnique({
      where: { productId },
    });

    if (!inventory) {
      return false;
    }

    const availableQuantity = inventory.quantity - inventory.reserved;
    return availableQuantity >= requestedQuantity;
  }

  /**
   * Get available quantity (actual stock - reserved)
   */
  static async getAvailableQuantity(productId: string) {
    const inventory = await prisma.inventory.findUnique({
      where: { productId },
    });

    if (!inventory) {
      return 0;
    }

    return inventory.quantity - inventory.reserved;
  }

  /**
   * Get low stock products (< 5 units)
   */
  static async getLowStockProducts() {
    return await prisma.inventory.findMany({
      where: {
        quantity: {
          lt: 5,
        },
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            sku: true,
          },
        },
      },
    });
  }

  /**
   * Get out of stock products
   */
  static async getOutOfStockProducts() {
    return await prisma.inventory.findMany({
      where: {
        quantity: 0,
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            sku: true,
          },
        },
      },
    });
  }

  /**
   * Get all product inventory rows for admin tables
   */
  static async getAllProducts() {
    return await prisma.inventory.findMany({
      include: {
        product: {
          include: {
            category: true,
          },
        },
      },
      orderBy: {
        lastUpdated: "desc",
      },
    });
  }

  /**
   * Bulk update inventory (admin)
   */
  static async bulkUpdateInventory(
    updates: Array<{ productId: string; quantity: number }>
  ) {
    const promises = updates.map((update) =>
      this.updateStock(update.productId, update.quantity)
    );

    return await Promise.all(promises);
  }
}
