import { prisma } from "~/utils/db.server";

import { v4 as uuidv4 } from "uuid";
import { redirectWithSuccess } from "remix-toast";

// Fetch all filaments
export async function getAllFilaments() {
  return await prisma.filament.findMany({
    // orderBy:{
    //   stock_level: 'asc'
    // }
    where:{
      isDeleted: false,
    },
    select: {
      id: true,
      brand: true,
      material: true,
      color:true,
      diameter: true,
      _count:{
        select:{
          rolls:{
            // where:{
            //   inUse:false,
            // },
          },
        },
      },
      rolls:true,
    },
    orderBy:[
      // {brand: "asc"},
      // {material: "asc"},
      // {color: "asc"},
      {rolls: {
        _count: "asc",
      }}
    ],
  });
}

export async function getFilamentByBarcode(barcode: string){
  const roll =  await prisma.roll.findFirstOrThrow({
    where: {
      barcode,
      inUse: false,
    },
    select: {
      filament: true,
    }
  });

  console.log('test', roll)

  const update = await prisma.roll.updateMany({
    where:{
      barcode,
    },
    data:{
      inUse: true,
    }
  })

  if (!roll.filament) {
    throw new Error("No filament found");
  }

  return roll.filament;
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

export async function addQRtoRoll(qrString: string, filamentId: number, weight: number){
  return await prisma.roll.create({
    data:{
      barcode: qrString,
      filamentId,
      weight,
    },
  })
}

export async function returnFilamentToStock(barcode: string, weight: number) {

  try{
    const result = await prisma.roll.update({
    where: {
      barcode,
      inUse: true,
    },
    data: {
      inUse: false,
      weight,
    },
   });

   return {success: true};
  }catch(e){
    console.error(e);
    return { success: false};
    // return {};
  }
}

export async function getAllUsers(){
  return await prisma.user.findMany({});
}

export async function getJobsByUserId(id: number){
  const result = await prisma.job.findMany({
    where:{
      user:{
        id,
      }
    }
  })

  return result
}

export async function getUserByUsername(username: string){
  return prisma.user.findUnique({
    where:{
      username,
    },
  });
}

export async function getUserIdByUsername(username: string){
  return await prisma.user.findUnique({
    where: {
      username,
    },
    select:{
      id: true,
    },
  });
}

export async function pullFromStockByBarcode(barcode: string){
  const filamentId = await prisma.roll.findMany({
    where:{
      barcode,
    },
    include:{
      filament: true,
    }
  });
  
  // const updateStock = await prisma.filament.update({
  //   where:{
  //     id: filamentId[0].filamentId,
  //   },
  //   data:{
  //     stock_level: {
  //       decrement: 1,
  //     }
  //   }
  // });

  // const removeRoll = await prisma.roll.delete({
  //   where:{
  //     barcode,
  //   }
  // });
  
  const result = filamentId[0];
  return result;
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

export async function getAllUnusedMaterials(){
  const materials = await prisma.filament.findMany({
    distinct: 'material',
    select: {
      material: true,
      rolls: {
        where: {
          inUse: false
        }
      }
    },
  })

  const result = materials.map(x => x.material);
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
    }
  })

  const result = colors.map(x => x.color);
  return [...result]
}

// Get a filament by ID
export async function getFilamentById(id: number) {
  return await prisma.filament.findUnique(
    { 
        where: { id },
        include:{
          rolls:true,
        }
    });
}

export async function getBarcodesByFilamentId(id: number){
  const result = await prisma.roll.findMany({
    where:{
      filamentId: id
    },
  });
  return result;
}

export async function markBarocdeInUse(barcode: string){
  return await prisma.roll.updateMany({
    where:{
      barcode,
    },
    data:{
      inUse: true,
    }
  })
}

export async function getFirstBarcodeForFilament(brand: string, material: string, color: string) {
    const test = await prisma.roll.findMany({
      where:{
        filament: {
          brand,
          color,
          material
        },
        inUse: false
      }
    });

    if (test.length === 0) throw new Error('Filament not found');

    const updatedRoll = await prisma.roll.findMany({
      where:{
        barcode: test[0].barcode,
        inUse: false,
      },
      select: {
        filamentId: true,
        barcode: true
      }
    });
    
    return  updatedRoll[0].barcode;
}

// Create a new filament
export async function createFilament({brand, material, color, diameter}: {brand: string, material: string, color: string, diameter:string}) {
 return await prisma.filament.create({
    data: {
      brand: brand.toUpperCase(),
      material: material.toUpperCase(),
      color: color.toUpperCase(),
      diameter: parseFloat(diameter)
    }
  });
}

export async function removeFilamentByQR( barcode: string, id: number){
  const rollDelete = await prisma.roll.delete({
    where:{
      barcode,
    }
  });

  const updateFilament = await prisma.filament.update({
    where:{
      id,
    },
    data:{
      stock_level:{
        decrement: 1,
      }
    }
  });

  return updateFilament;
}

// Update filament stock
// export async function updateFilamentStock(id: number, qrcode: string, weight: number, price: number) {

//   const filament = await prisma.filament.update({
//      where: { 
//       id
//      },
//      data: { 
//       stock_level: {
//         increment: 1
//      }}
//   });

//   const roll = await prisma.roll.create({
//     data:{
//       barcode: qrcode,
//       filamentId: id,
//       weight, 
//       price,
//       purchase_date: new Date(Date.now()),
//     }
//   })
// }

export async function addRollToFilament(id: number){
  return await prisma.filament.update({
    where:{
      id,
    },
    data:{
      rolls:{
        
      }
    }
  })
}

export async function createNewRoll(
  weight: number,
  price: number,
  id: number,
  quantity: number,
  url: string,
  showThrobber: any
) {
  const TIMEOUT = 5000;
  showThrobber(true);

  // Create rolls in parallel
  const rolls = await Promise.all(
    Array.from({ length: quantity }, () =>
      prisma.roll.create({
        data: {
          barcode: uuidv4(),
          weight,
          price,
          filamentId: id,
          purchase_date: new Date(),
          inUse: false,
        },
      })
    )
  );

  const qrCodes = rolls.map((roll) => roll.barcode);
  console.log(qrCodes);

  // Fire off print jobs immediately
  const fetchPromises = qrCodes.map((roll) => {
    return new Promise((resolve) => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort();
        resolve({ error: "Request timed out", roll });
      }, TIMEOUT);

      fetch(`${url}/api/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({ newId: roll }),
        signal: controller.signal,
      })
        .then((response) => {
          clearTimeout(timeoutId);
          if (!response.ok) {
            resolve({ error: "Problem with printer", roll });
          } else {
            resolve({ success: true, roll });
          }
        })
        .catch((error) => {
          resolve({ error: error.message, roll });
        });
    });
  });

  // Run fetch requests without waiting for completion
  const results = await Promise.allSettled(fetchPromises);
  console.log("Print results:", results);

  // Delay the throbber update to make sure it triggers UI re-render
  setTimeout(() => {console.log("false"); showThrobber(false);}, 0);

  return { rolls };
}





// Delete a filament
export async function deleteFilament(id: number) {
  console.log('id: ',id)

  // const deleteRolls = await prisma.roll.deleteMany({
  //   where:{
  //     filament:{
  //       id,
  //     },
  //   },
  // });

  const deleteFilament = await prisma.filament.updateMany({
    where:{
      id,
    },
    data:{
      isDeleted: true,
    }
  });

  return {deleteFilament};
}

export async function getColorsByMaterial( material: string){
  const result = await prisma.filament.findMany({
    where:{
      material,
      rolls: {
        some: {
          inUse: false,
        }
      }
    },
    select:{
      color: true,
    },
    distinct: "color"
  });
  console.log(result);
  const colors = new Set()
  result.map(r => colors.add(r.color))
  return [...colors];
}

export async function getBrandsByColor( material: string, color: string){
  const result = await prisma.filament.findMany({
    where:{
      material,
      color,
      rolls: {
          some: {inUse: false}
      }
    },
    select:{
      brand: true,
    },
    distinct: ['brand'],
  });

  console.log(result)
  
  const brands = result.map(item => item.brand)
  return [...brands];
}

export async function unAssignFilament( barcode: string){
  const result = await prisma.roll.update({
    where:{
      barcode,
    },
    data:{
      inUse: false,
    }
  })

  return result;
}

export async function createJob(classification: string, printer: string, barcodes: string[], details: string, userId: number) {
  return await prisma.$transaction(async (tx) => {
     const rolls = await tx.roll.findMany({
      where: {
        barcode: {
          in: barcodes,
        },
      },
      include: {
        filament: true,
      }
    });

    if (rolls.length !== barcodes.length) {
      throw new Error('One or more rolls not found');
    }

    const rollUpdates = await Promise.all(
      rolls.map(roll => 
        tx.roll.update({
          where: {
            id: roll.id,
          },
          data: {
            inUse: true,
          }
        })
      )
    );

    const filamentUpdates = await Promise.all(
      [...new Set(rolls.map(roll => roll.filamentId))].map(filamentId => {
        const count = rolls.filter(roll => roll.filamentId === filamentId).length;
        
        return tx.filament.update({
          where: {
            id: filamentId,
          },
          data: {
            stock_level: {
              decrement: count,
            }
          }
        });
      })
    );

    const job = await tx.job.create({
      data: {
        classification,
        printer,
        details,
        userId,
        date: new Date(Date.now()),
        barcode: barcodes.join(','),
        roll: {
          connect: rolls.map(roll => ({ id: roll.id })),
        }
      },
      include: {
        roll: true,
      }
    });

    return job;
  });
}

export async function checkUsername(username: string){
  const result = await prisma.user.findFirst({
    where:{
      username,
    },
  });


  console.log('result: ', result)

  return result
}

export async function checkEmail(email: string){
  return await prisma.user.findFirst({
    where:{
      email,
    },
  });
}

export async function checkPhone(phone: string){
  return await prisma.user.findFirst({
    where:{
      phone,
    },
  });
}

export async function createUser({actualUsername, email, phone, secret, admin}: {actualUsername: string, email: string, phone: string, secret: string, admin?: boolean}){
  return await prisma.user.create({
    data:{
      username: actualUsername,
      email,
      phone,
      secret,
      admin,
    },
  });
}

export async function deleteUserAccount(userId: number){

  // const removeJobs = await prisma.job.deleteMany({
  //   where:{
  //     userId,
  //   }
  // });

  // if(removeJobs){
    return await prisma.user.update({
    where:{
      id: userId,
    },
    data:{
      isDeleted: true,
    }
    })
  // }
  // return {message: "Could not remove users jobs"};
  
}

export async function getUserById(id: number){
  return await prisma.user.findFirstOrThrow({
    where:{
      id,
    }
  });
}