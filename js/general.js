function writeBigNumber(num)
{
    num=num+""
    let writeNum=""

    for (let i = 0; i < num.length-1; i++)
    {
        writeNum+=num.charAt(i)
        if(i%3==(num.length%3+2)%3) 
            writeNum+=","      
    }

    writeNum+=num.charAt(num.length-1)

    return writeNum
}

function end()  //פונקציה שסוגרת את המשחק
{
    if(confirm("are you sure? "))
    {
        sessionStorage.clear()
        window.location = "home.html"
    }
}

function moveClick()
{
    event.srcElement.style.transform = "rotate(5deg)"
    setTimeout(moveClick1.bind(null,event.srcElement), 200)
}

function moveClick1(e)
{
    e.style.transform = "rotate(-5deg)"
    setTimeout(moveClick2.bind(null, e), 200)
}

function moveClick2(e)
{
    e.style.transform = ""
}