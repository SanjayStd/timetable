function datas(a){
    let subject_name = []
    let faculty_name = []
    
    for (let i = 0; i<a; i++){
        const subject = prompt("enter the subject name:")
        const faculty = prompt("Enter the faculty name:")
        
        subject_name.push(subject)
        faculty_name.push(faculty)
    }
    return {subject_name,faculty_name}
}

function random(arr) {
    let check = {}
    arr.forEach(item => check[item] = 0)
    
    for (let i = 1;i<9;i++){
        let available_element = arr.filter(item => check[item]<2)
        
        if (available_element.length === 0){
            console.log("given array is empty")
        }
        
        
        const randomelement = i+ "  " + available_element[Math.floor(Math.random()*available_element.length)]
        
        console.log(randomelement)
        
        check[randomelement]++
        
        
    }
    
}


var output = datas(prompt("Enter the no of subject:"))
console.log(output)

