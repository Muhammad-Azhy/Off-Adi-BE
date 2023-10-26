import Express from "express";
import { PrismaClient } from "@prisma/client";
import { verifyToken } from "../../middlewere";
const prisma = new PrismaClient();
const router = Express.Router();

router.get("/Cart/:ID", verifyToken,async(req,res)=>{
    const myID = req.params.ID

    
    if(!myID){
        return res.send("Your ID is missing...")
    }
    const cart = await prisma.cart.findFirst({
        where:{
            UserID:+myID
        },
        select:{
            books:{
                select:{
                    ID: true,      
                    Title:true,
                    Author:true,
                    Summary:true,
                    NumberOfPages:true,
                    Files:{
                      select:{
                        Cover:true
                      }
                    }
                }
            }
        }
    })
    if(!cart){
      return res.send("No books in Cart")
    }
    return res.send(cart)
})
router.put("/Cart/:BookID", verifyToken ,async (req,res)=>{
  try{const BookID = req.params.BookID;
    const decodedToken = (req as any).decodedToken;
    const myID = decodedToken.ID;
      let userCart = await prisma.cart.findFirst({
      where: {
        UserID: +myID,
      },
    });
    
     if(!userCart){
      
        userCart = await prisma.cart.create({
          data:{
            UserID:+myID
          }
        })
    }
    const addedBook = await prisma.cart.update({
      where: {
        ID: +userCart.ID
      },
      data: {
        books: {
          connect: {
            ID: +BookID,
          },
        },
      },
      select: {
        books: true, // Optionally select the books in the cart after adding the new book.
      },
    });
    res.send(addedBook.books)
  } catch(err){console.log(err)}
    
});
router.delete("/Cart/:BookID", verifyToken ,async (req,res)=>{
  const BookID = req.params.BookID;
     const decodedToken = (req as any).decodedToken;
    const myID = decodedToken.ID;
      let userCart = await prisma.cart.findFirst({
      where: {
        UserID: +myID,
      },
    });
    if(!userCart){
        userCart = await prisma.cart.create({
          data:{
            UserID:myID
          }
        })
    }
    await prisma.cart.update({
      where:{ID:userCart.ID},
      data:{
        books:{
          disconnect:{
          ID:+BookID
        }}
      }
    }).then(x=>{
      return res.send("Book Removed. . .");
    })
})
router.post("/Cart/:BookID", verifyToken , async (req,res)=>{
 
    const BookID = req.params.BookID;
    const decodedToken = (req as any).decodedToken;
    const ID = decodedToken.ID
    const listener = await prisma.listeners.findFirst({where:{ID:+ID}})
    if(!listener){
        return res.send("Id not valid user not found...")
    }
    const book = await prisma.books.findFirst({where:{ID:+BookID}});
    if(!book)
        return res.send("Book not found...")
    let library = await prisma.library.findFirst({where:{ListenerID:+ID}})
    if(!library){
       library = await prisma.library.create({data:{ListenerID:listener.ID }})
    }
    await prisma.library.update({
        where:{ID:library.ID},
        data:{book:{connect:{ID:+BookID}}}
    })
    await prisma.cart.update({where:{
      UserID:ID
    }, data:{
      books:{disconnect:{ID:+BookID}}
    }})
    res.send("Bought book")
})
// router.post("/Cart", verifyToken , async (req,res)=>{
//     const BookIDs = req.body.BookIDs;
//     const decodedToken = (req as any).decodedToken;
//     const ID = decodedToken.ID;
//     const listener = await prisma.listeners.findFirst({where:{ID:+ID}})
//     if(!listener){
//         return res.send("Id not valid user not found...")
//     }
//     let library = await prisma.library.findFirst({where:{ListenerID:+ID}})
//     if(!library){
//        library = await prisma.library.create({data:{ListenerID:listener.ID }})
//     }
//     BookIDs.map( async ID =>{
//         const book = await prisma.books.findFirst({where:{ID:ID}});
//     if(!book)
//         return res.send("Book not found...")
//     await prisma.library.update({
//         where:{ID:library.ID},
//         data:{book:{connect:{ID:+ID}}}
//     })
//     })
// }
export default router;