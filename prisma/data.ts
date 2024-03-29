export const Authors = [
    {
        AuthorFullName: "Muhammad Azhy",
        Email:"example@gmail.com",
        Phone:"+12312341231212"
    }
]

export const Listeners = [
    {
        UserFullName:"Listener1",
        Username:"Listen",
        Email:"example@gmail.com",
        Phone:"+12312341231212",
        Password:"123456"
    }
]
/*
  UserFullName String       @db.VarChar(250)
  UserLogin    String       @unique @db.VarChar(50)
  Email        String       @db.VarChar(50)
  Phone        String       @db.VarChar(15)
  Password     String       @db.VarChar(50)
*/

export const Publishers =[
    {
        PublisherName:"Publisher1",
        Email:"example@gmail.com",
        Phone:"+12312341231212",
        Website:"example.com"
    }
]

export const Categories= [
    {
        Name: "History"
    },
    {
        Name: "Science"
    },
    {
        Name:"Gaming"
    }
]

export const Books =[
    {
        Title:"Habits",
        AuthorFullName:"Muhammad Azhy",
        Narrator:"Muhammad Azhy",
        NumberOfPages:78,
        Language:2,
        Summary:"This book is about Habits",
        PublisherName:"Publisher1",
        Category:"Science",
        Cover:"Media/png-transparent-habit-learning-education-student-mind-habits-text-class-people-thumbnail.png",
        Audio: "Media/Habits.m4a",
        Demo:"Media/Habit-Demo.m4a"

    }
]


//   ID            Int          @id @default(autoincrement())
//   PublisherID   Int
//   Title         String       @db.VarChar(250)
//   AuthorID      Int
//   Narrator      String       @db.VarChar(250)
//   NumberOfPages Int
//   Language      Int
//   Summary       String       @db.VarChar(250)
