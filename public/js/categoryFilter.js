// Search button in category page.
const searchCategory = document.getElementById('categorySearch')
const results = document.querySelector('#result')

searchCategory.addEventListener('click' , (e) => {
    e.preventDefault()
    // FETCH: get the available videos by category.
    fetch('http://127.0.0.1:3000/category/'+selected_option)
        .then((res) => res.json())
        .then((obj) => {
            if (obj.length === 0) { 
                console.log("There're no videos within that category")
                results.textContent = "There're no videos within that category"
            } else {
                console.log('Results: ')
                obj.forEach(element => console.log(element))
                results.textContent = JSON.stringify(obj, null, '\t')   
            }
        }).catch( (err) => {
            console.log(err)
        })
})



