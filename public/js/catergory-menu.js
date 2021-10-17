// Category Menu
const socket = io()

socket.on('category-selected', (category) => {
    console.log('category selected!', category)
})

var selected_option;

document.querySelector('#category').addEventListener('change', (e) => {
	e.preventDefault()
    const element  = e.target
	selected_option = element.options[element.selectedIndex].text
	console.log('Category Selected :  ', selected_option)
    socket.emit('categorySelected', selected_option)
	
})

