const socket = io()
const searchBar = document.querySelector('form')
const search = document.querySelector('input')
const message = document.querySelector('#video-name')
const tempMessage = document.querySelector('#tempMessage')
const thumbsupindicator = document.querySelector('#thumbsUpcounter')
const thumbsdownindicator = document.querySelector('#thumbsDowncounter')

const watchvideo = document.getElementById('changeSrc')
const videoPlayer = document.getElementById('myiframe') 

var newvideoObj;
tempMessage.textContent="Watch a new video now, enter the name of the video"

searchBar.addEventListener('submit', (e) => {
    e.preventDefault() // previene que el navegador se reinicie cuando se ingresa un valor.
    const videoName = search.value
    
    console.log('Nombre ingresado: '+ videoName) 
    if (videoName.length === 0) {
        message.textContent = 'You must write a valid video-name'
    } else {
        // Get video by his name.
        fetch('http://127.0.0.1:3000/namevideo/'+videoName)
        .then((response) => response.json())
        .then((newvideo) => {
            newvideoObj = newvideo
            console.log(newvideoObj.path)
            message.textContent= newvideoObj.filename
            console.log("Loading...")
            // I changed SRC attribute in the iframe, so it shows the video that was selected by the user.
            tempMessage.textContent="loading ..."
            setTimeout(() => {
                search.value=''
                tempMessage.textContent=newvideoObj.filename
                message.textContent=""
                console.log("Playing video")
                document.getElementById("myiframe").src="/videos/"+ newvideoObj.filename
            }, 2000);

            // Show like & dislikes counter
            thumbsupindicator.textContent = newvideoObj.thumbsUp
            thumbsdownindicator.textContent = newvideoObj.thumbsDown

        }).catch( ()=> {
            console.error('There is not a video file with that name')
            message.textContent = 'There is not a video file with that name'
        })
    }
})


// Web Sockets
socket.on('countUpdated', (count) =>{
    console.log('the count has been updated!', count)
})

document.querySelector('#positiveReview').addEventListener('click', () => {
    console.log('Click')
    socket.emit('positiveReview')
    const currentPostive = newvideoObj.thumbsUp   
    const newValue = currentPostive+1
    console.log("Number of likes: ", newValue)

    // FETCH: update de number of likes.
    fetch('http://127.0.0.1:3000/player/'+ newvideoObj._id, {
        method: 'PATCH',
        mode: 'cors',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({"thumbsUp":newValue})
        })
        .then((res) => res.json())
        .then((newvideo) => {
            newvideoObj = newvideo
            thumbsupindicator.textContent = newvideoObj.thumbsUp
            //console.log('PostiveReview Updated: ', newvideoObj.thumbsUp)
        }).catch( () => {
            console.error('There is not a video file with that name')
            message.textContent = 'There is not a video file with that name'
        })

})

document.querySelector('#negativeReview').addEventListener('click', () => {
    console.log('Click')
    socket.emit('negativeReview')
    const currentNegative = newvideoObj.thumbsDown
    const newValue = currentNegative+1
    console.log("Number of Dislikes: ", newValue)

    // FETCH: update de number of Dislikes.
    fetch('http://127.0.0.1:3000/player/'+ newvideoObj._id, {
        method: 'PATCH',
        mode: 'cors',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({"thumbsDown":newValue})
        })
        .then((res) => res.json())
        .then((newvideo) => {
            newvideoObj = newvideo
            thumbsdownindicator.textContent = newvideoObj.thumbsDown
            //console.log('NegativeReview Updated: ', newvideoObj.thumbsDown)
        }).catch( () => {
            console.error('There is not a video file with that name')
            message.textContent = 'There is not a video file with that name'
        })
})

