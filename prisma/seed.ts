import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient()
import { Authors ,Books , Categories ,Publishers, Listeners } from './data';

async function main() {
    for (let Author of Authors) { 
      await prisma.author.create({data:Author})
    }
    for(let Category of Categories ){
        await prisma.category.create({data:Category})
    }
    for(let Publisher of Publishers){
        await prisma.publisher.create({data:Publisher})
    }
    for(let Listener of Listeners){
        await prisma.listeners.create({
            data:Listener
        })
    }
    for(let Book of Books){
        const author = await prisma.author.findFirst({where:{AuthorFullName:Book.AuthorFullName}})
        const publisher = await prisma.publisher.findFirst({where:{PublisherName:Book.PublisherName}})
        const books = await prisma.books.create({
            data:{
                PublisherID:publisher.ID,
                AuthorID:author.ID,
                Title:Book.Title,
                Narrator:Book.Narrator,
                NumberOfPages:Book.NumberOfPages,
                Language:Book.Language,
                Summary:Book.Summary,
            }
        })
        const files = await prisma.files.create({
            data:{
                BookID:books.ID,
                Cover:Book.Cover,
                Audio:Book.Audio,
                Demo:Book.Demo,
            }
        })
    }
}

main().catch(e=>{
    console.log(e);
    process.exit(1)
}).finally(()=>{
    prisma.$disconnect()
})


// model Books {
//   ID            Int          @id @default(autoincrement())
//   PublisherID   Int
//   Title         String       @db.VarChar(250)
//   AuthorID      Int
//   Narrator      String       @db.VarChar(250)
//   NumberOfPages Int
//   Language      Int
//   Summary       String       @db.VarChar(250)
//   Files         Files[]
//   Author        Author       @relation(fields: [AuthorID], references: [ID])
//   Publisher     Publisher    @relation(fields: [PublisherID], references: [ID])
//   libraries     Library[]
//   FavBooks      FavBooks[]
//   BookRatings   BookRating[]
//   Categories    Category[]
//   Cart          Cart[]
// }
