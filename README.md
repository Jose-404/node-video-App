# node-video-App

### Instructions:

1. Install all the dependencies with npm install.
2. inside the repo, there's a folder called "videos-test", you can use the videos there to test the app, however if you want to use some other video, you can do it as long as it has a 10 MB size or lower.
3. It is important that you use mongodb to store the objects. In this case I'm using mongoose and robo3t as my viewer, to store all the video objects. You have to create a new database with the name "video-app-db", the full connection string will be something like this:"MONGODB_URL=mongodb://127.0.0.1:27017/video-app-db
4. The app is very basic and it was meant to accomplish the requirements for the final project:
>    * Upload a .mp4 video. It has a filter which allows only mp4 files
>    * Filter by tags. You must choose one category from the available options when you upload your video.
>    * There is a like and dislike button, all the info related to the video is storaged in the mongodb database.
>    * You can watch and download the video from media player.
>    * I didn't have time to do a proper backend testing from code, sorry.


### BASIC USE:

1. http://localhost:3000/ -> Upload a video, choose a category and then submit.
2. http://localhost:3000/player -> Here you have to enter the name of your video in the search bar (doesn't have to be the exact name, it can be something aprox., though, it may be problematic if you have two videos with very similar names, in that case it will be better to be specific), and then the media player will open up with your video.
3. http://localhost:3000/categories --> Here you can pick a category, press the "search" button and it will bring you all the objects in the database that belongs to that category.

### BUGS:

I tried to avoid repeated videos by adding the current datetime to the name of the video, which means that even if you upload two videos with the same name, it would have another "name" inside the database, so you can pick which one you wanna watch. However, the only way to do this is searching by categories and then taking the "filename" property from the listed objects and search for it inside the video-play page with the complete name.


## "Thanks for watching!"
