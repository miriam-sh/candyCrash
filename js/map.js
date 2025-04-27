
if (sessionStorage.getItem("user") == null)
    window.location = "home.html"

//יצירת משתנים
let all = document.getElementById("all") //כל המסך
let stage = parseInt(localStorage.getItem((sessionStorage.getItem("user"))).split("_")[2]) //השלב המקסימלי של המשתמש
let off = document.getElementById("off") //הכפתור שסוגר את המשחק
let si = document.getElementById("si") //הכפתור שמראה את השיאים
let popap = document.getElementById("popUp") //לוח השיאים
let score = document.getElementById("score") //הכיתוב של הניקוד
let hearts = document.getElementById("hearts") //הכיתוב של הניקוד

//הוספת אירועים
all.addEventListener("keypress", next)
off.addEventListener("click", end)
si.addEventListener("mouseover", f_si)
si.addEventListener("mouseout", exit)

setTimeout(init, 1) //יאתחל את הלוח(צריך לחכות קצת כדי שיראו את הלוח זז)

//הפונקציות

function init() //פונקציית אתחול
{
    document.getElementById("popUpMap").style.right = "135px"
    score.textContent = writeBigNumber(localStorage.getItem(sessionStorage.getItem("user")).split("_")[3])
    setTimeout(stop, 3000)

    let tryCount = parseInt(localStorage.getItem(sessionStorage.getItem("user")).split("_")[4])

    for (let i = 5; i > 0; i--) {
        let h = document.createElement("img")
        h.className = "heart"
        hearts.appendChild(h)
        if (i > tryCount)
            h.setAttribute("src", "../picture/heartCover.png")
        else
            h.setAttribute("src", "../picture/heartEmpty.png")

    }
}

function stop() //סימון ב'אין כניסה' או הוספת אירוע ע''פ השלב המקסימלי
{
    for (let i = 181; i <= stage; i++)
        document.getElementById("s" + i).addEventListener("click", f_click)

    for (let i = stage + 1; i <= 188; i++)
        document.getElementById("s" + i).src = "../picture/stop.png"

    si.style.display = "block"
    popap.style.display = "block"
    // hearts.style.display = "grid"
}

function next() //שמירת השלב המקסימלי כשלב שנבחר
{
    if (event.keyCode == 13) {
        sessionStorage.setItem("stage", stage)
        beginGame()
    }
}

function f_click() //שמירת השלב שנבחר
{
    sessionStorage.setItem("stage", event.srcElement.id.substring(1, 4))
    beginGame()
}

function beginGame() //יציאה מהמפה
{
    document.getElementById("popUpMap").style.right = "-1420px"
    for (let i = stage + 1; i <= 188; i++)
        document.getElementById("s" + i).src = "../picture/empty_temporary.png"
    popap.style.display = " none"
    si.style.display = "none"
    // hearts.style.display = "none"
    setTimeout(move, 3000)
}

function move() //מעבר לדף המשחק
{
    window.location = "game.html"
}

function f_si() //כאשר עומדים על השיאים, לוח השיאים נפתח
{
    popap.innerHTML = ""
    popap.style.right = "-770px"
    //בודק כמה מהנתונים ששמורים קשורים  למשחק
    let count = 0;
    for (let i = 0; i < localStorage.length; i++) {
        if (localStorage.getItem("user" + i))
            count++
    }
    let arr = new Array(count)
    for (let i = 0; i < localStorage.length; i++) {
        if (localStorage.getItem("user" + i))
            arr[i] = "user" + i
    }
    //מיון 
    let temp
    let flag = true
    for (let i = arr.length - 1; i > 0 && flag == true; i--) {
        flag = false
        for (let j = 0; j < i; j++) {
            if (parseInt(localStorage.getItem(arr[j]).split("_")[3]) < parseInt(localStorage.getItem(arr[j + 1]).split("_")[3])) {
                flag = true
                temp = arr[j]
                arr[j] = arr[j + 1]
                arr[j + 1] = temp
            }
        }
    }
    for (let i = 0; i < 5; i++) {
        let btn = document.createElement("input")
        btn.setAttribute("type", "button")
        btn.setAttribute("class", "btn")
        btn.style.width = "700px"
        popap.appendChild(btn)

        if (i < localStorage.length)
            btn.setAttribute("value", (i + 1) + ".    name: " + localStorage.getItem(arr[i]).split("_")[0] + "     score: " + writeBigNumber(localStorage.getItem(arr[i]).split("_")[3]))

        if (arr[i] == sessionStorage.getItem("user"))
            btn.className = "btnMy"

    }

    setTimeout(f_siFinal, 800)
}

function f_siFinal() {
    popap.style.zIndex = "100"
    popap.style.right = "300px"
}

function exit()//כאשר יוצאים מהשיאים, לוח השיאים נסגר
{
    document.getElementById("popUp").style.right = "-770px"
    setTimeout(exitFinal, 800)
}

function exitFinal() {
    popap.style.zIndex = "10"
    popap.style.right = "300px"
}