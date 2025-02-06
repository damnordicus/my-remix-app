import { BriefcaseIcon } from "@heroicons/react/24/outline";
import { prisma } from "~/utils/db.server";

// Fetch all filaments
export async function getAllFilaments() {
  return await prisma.filament.findMany({
    select:{
        id: true,
        brand: true,
        material: true,
        color: true,
        weight_grams: true,
        diameter: true,
        price: true,
        purchase_date: true,
        stock_level: true,
    },
    orderBy:{
      stock_level: 'asc'
    }
  });
}

export async function getAllBrands(){
  const brands = await prisma.filament.findMany({
    distinct: 'brand',
    select:{
      brand: true,
    }
  })
  return [...brands]
}

export async function getAllMaterials(){
  const materials = await prisma.filament.findMany({
    distinct: 'material',
    select: {
      material: true,
    },
  })
  return [...materials]
}

export async function getAllColors(){
  const colors = await prisma.filament.findMany({
    distinct: 'color',
    select: {
      color: true,
    },
  })
  return [...colors]
}

// Get a filament by ID
export async function getFilamentById(id: number) {
  return await prisma.filament.findUnique(
    { 
        where: { id }, 
    });
}

// Create a new filament
export async function createFilament( brand: string, material: string, color: string, diameter: number, weight_grams: number, price: number, purchase_date: Date) {
 return await prisma.filament.create({
     data: {
        brand: brand.toUpperCase(),
        material: material.toUpperCase(),
        color: color.toUpperCase(),
        diameter,
        weight_grams,
        price,
        purchase_date,
        stock_level: 0,
     }
    });
}

// Update filament stock
export async function updateFilamentStock(id: number, newLevel: number) {
  return await prisma.filament.update({
     where: { id },
     data: { 
      stock_level: {
        increment: !newLevel ? 0 : newLevel
     }}
 });
}

// Delete a filament
export async function deleteFilament(id: number) {
  return await prisma.filament.delete({
     where: { id }
 });
}
