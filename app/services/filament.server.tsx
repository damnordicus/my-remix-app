import { BriefcaseIcon } from "@heroicons/react/24/outline";
import { parse } from "path";
import { exit } from "process";
import { prisma } from "~/utils/db.server";

// Fetch all filaments
export async function getAllFilaments() {
  return await prisma.filament.findMany({
    select:{
        id: true,
        brand: true,
        material: true,
        color: true,
        diameter: true,
        stock_level: true,
        barcode: true,
    },
    orderBy:{
      stock_level: 'asc'
    }
  });
}

export async function getFilamentByBarcode(barcode: string){
  return await prisma.filament.findFirstOrThrow({
    where: {
      barcode:{
        has: barcode,
      }
    }
  });
}

export async function getFilamentByAttributes(selectedBrand: string, selectedMaterial: string, selectedColor: string){
  return await prisma.filament.findFirstOrThrow({
    where:{
      brand: selectedBrand,
      material: selectedMaterial,
      color: selectedColor,
    },
    select: {
      id: true,
    }
  })
}

export async function addQRtoRoll(qrString: string, filamentId: number){
  const updateFilament = await prisma.filament.update({
    where:{
      id: filamentId
    },
    data:{
      stock_level:{
        increment: 1,
      },
    },
  })

  return await prisma.roll.create({
    data:{
      barcode: qrString,
      filamentId,
      weight: 1000,
    },
  })
}

export async function returnFilamentToStock(parsedObject: object) {
  const existingFilament = await prisma.filament.findFirstOrThrow({
    where:{
      brand: parsedObject.brand,
      color: parsedObject.color,
      material: parsedObject.material,
    },
    select:{
      id: true,
      barcode: true,
    }
  });
  const existingId = existingFilament.id;
  const existingBarcodes = [...existingFilament.barcode, btoa(JSON.stringify(parsedObject))];

  return await prisma.filament.update({
    where:{
      brand: parsedObject.brand,
      color: parsedObject.color,
      material: parsedObject.material,
      id: existingId,
    },
    data:{
      stock_level: {
        increment: 1,
      },
      barcode:{
        set: existingBarcodes,
      }
    }
  })

}

export async function pullFromStockByBarcode(barcode: string, id: number){
  const filament = await prisma.filament.findUnique({
    where: {
      id,
    },
  });

  if(!filament){
    throw new Error("Filament not found");
  }

  const updatedBarcodes = filament.barcode.filter((existingBarcode) => existingBarcode !== barcode);

  const updatedFilament = await prisma.filament.updateMany({
    where: {
      barcode: {
        has: barcode, // Ensure the barcode exists in the array
      },
    },
    data: {
      barcode: updatedBarcodes,
      stock_level: {
        decrement: 1, // Decrease quantity, or you can set it to zero to remove the item
      },
    },
  });
  console.log('updated: ', updatedFilament)

  return updatedFilament;
}

export async function getAllBrands(){
  const brands = await prisma.filament.findMany({
    distinct: 'brand',
    select:{
      brand: true,
    }
  })
  const result = brands.map(x => x.brand);
  return [...result]
}

export async function getAllMaterials(){
  const materials = await prisma.filament.findMany({
    distinct: 'material',
    select: {
      material: true,
    },
  })

  const result = materials.map(x => x.material);
  return [...result]
}

export async function getAllColors(){
  const colors = await prisma.filament.findMany({
    distinct: 'color',
    select: {
      color: true,
    },
  })

  const result = colors.map(x => x.color);
  return [...result]
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
        stock_level: 0,
     }
    });
}

// Update filament stock
export async function updateFilamentStock(barcode: string, id: number) {

  const decoded = atob(barcode);
  const parsed = JSON.parse(decoded);

  const existingBarcodes = await prisma.filament.findFirstOrThrow({
    where: { id },
    select:{
      barcode: true,
    }
  })

  if(existingBarcodes.barcode.find(x => x === barcode)){
    return new Error("Roll is already in the inventory")
  }
  
  const updatedBarcodes = [...existingBarcodes.barcode, barcode];

  return await prisma.filament.update({
     where: { 
      id,
      brand: parsed.brand,
      material: parsed.material,
      color: parsed.color,
     },
     data: { 
      barcode: updatedBarcodes,
      stock_level: {
        increment: 1
     }}
 });
}

// Delete a filament
export async function deleteFilament(barcode: string, id: number) {

  // const decoded = atob(barcode);
  // const parsed = JSON.parse(decoded);

  const existingBarcodes = await prisma.filament.findFirstOrThrow({
    where:{
      id,
    },
    select:{
      barcode: true,
      brand: true,
      material: true,
      color: true,
    }
  })

  const updatedBarcodes = existingBarcodes.barcode.filter(x => x !== barcode);

  return await prisma.filament.update({
     where: {
       id,
      brand: existingBarcodes.brand,
      material: existingBarcodes.material,
      color: existingBarcodes.color,
    },
     data: {
        barcode: updatedBarcodes,
        stock_level:{
          decrement: 1,
        }
     }
 });
}
