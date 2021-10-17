# node-video-App


Instructions:

1. Install all the dependencies with npm install.
2. inside the repo, there's a folder called "videos-test", you can use the videos there to test the app, however if you want to use some other video, you can do it as long as it has a 10 MB size or lower.
3. It is important that you use mongodb to store the objects. In this case I'm using mongoose and robo3t as my viewer, to store all the video objects. You have to create a new database with the name "video-app-db", the full connection string will be something like this:"MONGODB_URL=mongodb://127.0.0.1:27017/video-app-db
4. The app is very basic and it was meant to accomplish the requirements for the final project:
        - Upload a .mp4 video. It has a filter which allows only mp4 files
        - Filter by tags. You must choose one category from the available options when you upload your video.
        - There is a like and dislike button, all the info related to the video is storaged in the mongodb database.
        - You can watch and download the video from media player.
        - I didn't have time to do properly backend testing from code.


BASIC USE:
