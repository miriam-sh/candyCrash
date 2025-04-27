
//הגדרת משתנים
let txtName = document.getElementById("name") //שם משתמש
let NameLable = document.getElementById("nameLable") //הערות על שם המשתמש
let txtCode = document.getElementById("code") //סיסמה
let CodeLable = document.getElementById("codeLable") //הערות על סיסמה
let toPlay = document.getElementById("toPlay") //לכניסה למשחק
let newUser = document.getElementById("newUser") //יצירת משתמש חדש
let newName = document.getElementById("newName") //הכנסת שם משתמש חדש
let newNameLable = document.getElementById("newNameLable") //הערות על שם המשתמש החדש
let newCode = document.getElementById("newCode") //הכנסת סיסמה חדשה
let newCodeLable = document.getElementById("newCodeLable") //הערות על הכנסת סיסמה חדשה
let save = document.getElementById("save") //שמירת הנתונים
let canPlay = false //משתנה שששומר האם ניתן לגשת למשחק
let intervalCount = 0

//הפעלת פונקציות
setTimeout(init, 1)
txtName.addEventListener("focus", resetTxt)
txtName.addEventListener("keypress", moveCode)
txtName.addEventListener("blur", checkIsBeN)
txtCode.addEventListener("focus", resetTxt)
txtCode.addEventListener("keypress", toPlayClick)
txtCode.addEventListener("blur", checkIsBeC)
toPlay.addEventListener("click", play)
newUser.addEventListener("click", dontHidden)
newName.addEventListener("focus", resetTxt)
newName.addEventListener("keypress", moveNewCode)
newName.addEventListener("blur", checkNewN)
newCode.addEventListener("focus", resetTxt)
newCode.addEventListener("keypress", toSaveData)
save.addEventListener("click", saveData)
toPlay.addEventListener("mouseover", moveClick)
newUser.addEventListener("mouseover", moveClick)
save.addEventListener("mouseover", moveClick)

setInterval(LableChange, 500)

//הפונקציות

function init() //פונקציית אתחול
{
    document.getElementById("popUp").style.right = "300px"
    newName.style.display = "none"
    newCode.style.display = "none"
    save.style.display = "none"

    txtName.focus()
}

//שמירת הנתונים על כל משתמש הינה בסדר הבא: 0-שם משתמש, 1-סיסמה, 2-שלב מקסימלי, 3-מספר נקודות שנצברו 4-מספר כשלונות ברצף שנצברו

function checkIsBeN() //בדיקה האם קיים במאגר כזה שם משתמש
{
    if (txtName.value == "")
        NameLable.textContent = "you dont get your user name"

    else {
        let i
        for (i = 0; i < localStorage.length && txtName.value != localStorage.getItem("user" + i).split("_")[0]; i++);

        if (i == localStorage.length) {
            NameLable.textContent = "this user not found, may create new user"
            canPlay = false
        }

        else {
            sessionStorage.setItem("user", "user" + i)
            NameLable.textContent = ""
        }
    }
}

function moveCode() {
    if (event.keyCode == 13) {
        txtName.blur()
        txtCode.focus()
    }
}

function checkIsBeC() //בדיקה האם יש התאמה בין שם המשתמש לסיסמה
{
    if (txtName.value != "" && NameLable.textContent == "") {
        if (localStorage.getItem(sessionStorage.getItem("user")).split("_")[1] != txtCode.value) {
            CodeLable.textContent = "this password not correct, may try again"
            canPlay = false
        }
        else {
            CodeLable.textContent = ""
            canPlay = true
        }
    }
    else {
        CodeLable.textContent = "get user name before"
        NameLable.textContent = "get user name"
        canPlay = false
    }
}

function toPlayClick() {
    if (event.keyCode == 13) {
        txtCode.blur()
        toPlay.click()
    }

}

function play() //בדיקה האם ניתן להיכנס למשחק
{
    if (canPlay == true)
    {
        document.getElementById("popUp").style.right = "-860px"
        setTimeout(move, 3000)
    }
    else {
        // CodeLable.textContent = "get password before"
        // NameLable.textContent = "get user name before"
    }
}

function move() //מעבר למשחק
{
    window.location = "../html/map.html"
}

function dontHidden() //חשיפת התיבות להכנסת משתמש חדש והסתרת התיבות הרגילות
{
    //הסתרת התיבות הרגילות
    txtName.style.display = "none"
    NameLable.style.display = "none"
    txtCode.style.display = "none"
    CodeLable.style.display = "none"
    toPlay.style.display = "none"
    let br = document.getElementsByClassName("brFirst")
    for (let i = 0; i < br.length; i++)
        br[i].style.display = "none"

    //חשיפת התיבות להכנסת משתמש חדש
    newName.style.display = "block"
    newNameLable.style.display = "block"
    newCode.style.display = "block"
    newCodeLable.style.display = "block"
    save.style.display = "block"

    newUser.removeEventListener("mouseover", moveClick)
    newName.focus()
}

function checkNewN() //בדיקת שם משתמש
{
    let i
    for (i = 0; i < localStorage.length && newName.value != localStorage.getItem("user" + i).split("_")[0]; i++);
    if (i != localStorage.length)
        newNameLable.textContent = "this user name is catch, please get other user name"
    else
        newNameLable.textContent = ""
}

function moveNewCode() {
    if (event.keyCode == 13) {
        newName.blur()
        newCode.focus()
    }
}

function toSaveData() {
    if (event.keyCode == 13) {
        newCode.blur()
        save.click()
    }
}

function saveData() //שמירת הנתונים
{
    if (newName.value != "" && newCode.value != "") {
        sessionStorage.setItem("user", "user" + localStorage.length)
        localStorage.setItem(("user" + localStorage.length), newName.value + "_" + newCode.value + "_181_0_0")

        //חשיפת התיבות הרגילות כאשר כבר מוכנס אליהם הנתונים שנשמרו עכשיו
        txtName.style.display = "block"
        NameLable.style.display = "block"
        txtCode.style.display = "block"
        CodeLable.style.display = "block"
        toPlay.style.display = "block"
        let br = document.getElementsByClassName("brFirst")
        for (let i = 0; i < br.length; i++)
            br[i].style.display = "block"
        txtCode.focus()
        txtName.value = newName.value
        txtCode.value = newCode.value
        canPlay = true

        NameLable.textContent = ""
        CodeLable.textContent = ""

        //הסתרת התיבות למשתמש חדש
        newName.style.display = "none"
        newNameLable.style.display = "none"
        newCode.style.display = "none"
        newCodeLable.style.display = "none"
        save.style.display = "none"
    }
}

function resetTxt() {
    event.srcElement.value = ""
    document.getElementById(event.srcElement.getAttribute("id") + "Lable").textContent = ""
}

function LableChange(Lable, text) {
    let lables = document.getElementsByClassName("lables")

    if (intervalCount % 2 == 0)
        for (let i = 0; i < lables.length; i++)
            lables[i].style.color = "rgba(255, 255, 255, 0)"
    else
        for (let i = 0; i < lables.length; i++)
            lables[i].style.color = "white"

    intervalCount++
}
