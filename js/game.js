
if (sessionStorage.getItem("stage") == null)
    window.location = "map.html"

//הגדרת משתנים
let bodyGame = document.getElementById("bodyGame") //htmlכל דף ה
let t = document.getElementById("table") //מה שמכיל את המשחק עצמו
let side = document.getElementById("side") //מה שמכיל את כל הצד
let playAudio = document.getElementById("playAudio") //הכפתור שמפעיל את המנגינה
let pauseAudio = document.getElementById("pauseAudio") //הכפתור שעוצר את המנגינה
let off = document.getElementById("off") //הכפתור שסוגר את המשחק
let score = document.getElementById("score") //הכיתוב של הניקוד
let timer = document.getElementById("timer") //הכיתוב של הטיימר
let level = document.getElementById("level") //הכיתוב של השלב
let backgroundSound = document.getElementById("backgroundSound") //מנגינת רקע
let boomSound = document.getElementById("boomSound") //בום
let lineBoom = document.getElementById("lineBoom") //בום של שורה/ עמודה שלמה
let sugarCrashSound = document.getElementById("sugarCrash") //בניצחון 'candy crash' המילים
let adding = document.getElementById("adding") //תיבת טקסט להודעות בסוף (ניצחון/ כישלון)
let popApp = document.getElementById("popApp") //תיבה שמכילה את הסבר השלב
let expline = document.getElementById("expline")//טקסט שמסביר את השלב
let startGame = document.getElementById("startGame") //הכפתור שמתחיל את המשחק
let boomSoundOk = true //האם להפעיל שמע
let arriveToDrop = true //האם הסוכריה הגיעה ליעד כלשהו
let stage //השלב
let size = 70 //הגודל של התמונות
let arriveToFinish = false //האם הגיעו כבר לכמות הנקודות הנדרשת
let arriveToLost = false //האם הגיעו כבר לכישלון
let canToMove = false //האם ניתן לגמור את המשחק
let waitToFinish //canToMove שומר את ההמתנה למשתנה
let scoreValue = 0 //כמות הנקודות

//פרטי השלבים
let parts = [
    { "Id": 1, "Name": "181", "height": "9", "width": "10", "isTimer": "true", "limit": "5", "countTypes": "4", "scoreTotal": "10000" },
    { "Id": 2, "Name": "182", "height": "8", "width": "12", "isTimer": "true", "limit": "4", "countTypes": "5", "scoreTotal": "15000" },
    { "Id": 3, "Name": "183", "height": "8", "width": "12", "isTimer": "false", "limit": "20", "countTypes": "4", "scoreTotal": "15000" },
    { "Id": 4, "Name": "184", "height": "9", "width": "9", "isTimer": "true", "limit": "3", "countTypes": "5", "scoreTotal": "17000" },
    { "Id": 5, "Name": "185", "height": "9", "width": "9", "isTimer": "false", "limit": "15", "countTypes": "6", "scoreTotal": "17000" },
    { "Id": 6, "Name": "186", "height": "8", "width": "6", "isTimer": "true", "limit": "3", "countTypes": "6", "scoreTotal": "18000" },
    { "Id": 7, "Name": "187", "height": "8", "width": "6", "isTimer": "true", "limit": "2", "countTypes": "6", "scoreTotal": "19000" },
    { "Id": 8, "Name": "188", "height": "6", "width": "6", "isTimer": "true", "limit": "2", "countTypes": "6", "scoreTotal": "20000" }]

//json-משתנים המכילים מאפיינים ע''פ השלב - מעודכן מתוך ה
let tableHeight //הגובה של הטבלה
let tableWidth //הרוחב של הטבלה
let scoreTotal //סך הניקוד שצריך להגיע אליו במהלך השלב
let countTypes //מספר הסוכריות האפשריות
let isTimer //האם ההגבלה היא על טיימר
let nuMmoves //מספר העברות אפשרי
let minute //דקות
let second = 0 //שניות
let setTime //משתנה שישמור את בדיקת הזמן

//הפעלת פונקציות אוטומטית
setTimeout(init, 1)

//הוספת אירועים - כפתורים
bodyGame.addEventListener("keypress", f_clickEnter)
playAudio.addEventListener("click", backgroundSoundPlay)
pauseAudio.addEventListener("click", backgroundSoundPause)
off.addEventListener("click", end)
startGame.addEventListener("click", coverStart)
startGame.addEventListener("mouseover", moveClick)

//התחלה
function init() //אתחול
{
    stage = sessionStorage.getItem("stage")
    minute = parseInt(parts[stage - 181]["limit"])
    tableHeight = parseInt(parts[stage - 181]["height"])
    tableWidth = parseInt(parts[stage - 181]["width"])
    scoreTotal = parseInt(parts[stage - 181]["scoreTotal"])
    nuMmoves = parseInt(parts[stage - 181]["limit"])
    isTimer = parts[stage - 181]["isTimer"]
    countTypes = parseInt(parts[stage - 181]["countTypes"])

    level.textContent = stage

    if (isTimer == "false")
        timer.innerText = nuMmoves;
    else
        writeTime()

    t.innerHTML = "";
    t.style.gridTemplateColumns = "repeat(" + tableWidth + ", 70px)"
    t.style.gridTemplateRows = "repeat(" + tableHeight + ", 70px)"
    for (let i = 0; i < tableHeight; i++)
        for (let j = 0; j < tableWidth; j++) {
            let btn = document.createElement("img")
            btn.setAttribute("class", "pic")
            btn.setAttribute("draggable", "true")
            btn.addEventListener("drop", drop)
            btn.addEventListener("dragover", allowDrop)
            btn.addEventListener("dragstart", dragStart)
            btn.setAttribute("id", "btn_" + i + "_" + j)
            table.appendChild(btn)
        }

    t.style.right = (1412 - tableWidth * 70) / 2 + "px"
    t.style.top = (737 - tableHeight * 70) / 3 + "px"
    let name = localStorage.getItem(sessionStorage.getItem("user")).split("_")[0]
    let tOrm
    if (isTimer == "true") tOrm = " minute."
    else tOrm = " movies."

    popApp.style.top = "200px"
    expline.textContent = "Hallo " + name + ", you need " + writeBigNumber(scoreTotal) + " score with " + minute + tOrm
}

function coverStart() //חשיפת הלחצן שמתחיל את המשחק
{
    popApp.style.top = "-200px"
    setTimeout(start, 1900)
}

function start() //התחלת המשחק
{
    for (let i = 0; i < tableHeight; i++)
        for (let j = 0; j < tableWidth; j++)
            rand(i, j)

    if (isTimer == "true") setTime = setInterval(updateTime, 1000)

    setTimeout(check, 2500);
}

//החלפת שתי סוכריות
function dragStart() //את המשתנים המתאימים לתמונה שגוררים dataTransfer-פונקציה שמכניסה למשתני ה
{
    event.dataTransfer.setData("src", event.srcElement.getAttribute("src"));
    event.dataTransfer.setData("id", event.srcElement.getAttribute("id"));
    arriveToDrop = false
    setTimeout(returnPicture.bind(null, event.srcElement.getAttribute("id"), event.srcElement.getAttribute("src")), 1000)
    event.srcElement.setAttribute("src", "../picture/empty_temporary.png")
}

function returnPicture(id, pic) //במקרה שהגרירה לא הסתיימה במקום מתאים, מחזיר את התמונה למקומה הראשון
{
    if (arriveToDrop == false)
        document.getElementById(id).src = pic
}

function allowDrop() //פונקציה המאפשרת גרירה
{
    event.preventDefault();
}

function drop() //פונקציה שבודקת האם ניתן להחליף ובמקרה שכן מחליפה
{
    arriveToDrop = true

    //יצירת משתנים - מיקום האובייקטים המוחלפים
    let idF = event.dataTransfer.getData("id");
    let idS = event.srcElement.id;

    let iF = parseInt(idF.split("_")[1]);
    let jF = parseInt(idF.split("_")[2]);
    let iS = parseInt(idS.split("_")[1]);
    let jS = parseInt(idS.split("_")[2]);

    document.getElementById(idF).src = event.dataTransfer.getData("src");
    document.getElementById(idF).style.borderColor = "rgba(18, 56, 79, 0)"
    document.getElementById(idS).style.borderColor = "rgba(18, 56, 79, 0)"

    if ((iF == iS && (jF == jS + 1 || jF == jS - 1)) || (jF == jS && (iF == iS + 1 || iF == iS - 1))) {
        canToMove = false
        change(idF, idS)
        setTimeout(checkLocation.bind(null, idF, idS), 201)
    }
}

function checkLocation(idF, idS) //בודק האם בוצע החלפה תקינה
{
    let iF = parseInt(idF.split("_")[1]);
    let jF = parseInt(idF.split("_")[2]);
    let iS = parseInt(idS.split("_")[1]);
    let jS = parseInt(idS.split("_")[2]);

    if (document.getElementById(idF).getAttribute("src") == "../picture/chokolet.gif") {
        crashChocolet(idS)
        boom(idF)
        nuMmoves--;
    }
    else if (document.getElementById(idS).getAttribute("src") == "../picture/chokolet.gif") {
        crashChocolet(idF)
        boom(idS)
        nuMmoves--;
    }

    else if (crashes(iF, jF, true) == false && crashes(iS, jS, true) == false) {
        document.getElementById(idF).style.borderColor = "rgba(18, 56, 79, 0)"
        document.getElementById(idS).style.borderColor = "rgba(18, 56, 79, 0)"
        setTimeout(change.bind(null, idF, idS), 100)
        canToMove = true
    }

    else {
        setTimeout(fill, 500)
        nuMmoves--;
    }

    if (isTimer == "false") {
        timer.innerText = nuMmoves;
        if (nuMmoves == 0) {
            dontWin()
        }
    }
}

//הלוגיקה של המשחק
function check() //פונקציה שבודקת האם קיימים רצפים בלוח
{
    canToMove = false

    let flag = false

    for (let j = 0; j < tableWidth; j++)
        for (let i = 0; i < tableHeight; i++)
            if (crashes(i, j, false) == true)
                flag = true

    for (let j = 0; j < tableWidth; j++)
        for (let i = 0; i < tableHeight; i++)
            if (crashes(i, j, true) == true)
                flag = true

    if (flag) setTimeout(fill, 700)
    else canToMove = true

    return flag
}

function crashes(i, j, crash) //פונקציה שבודקת האם קיים רצף סביב מיקום כלשהו
{
    if (document.getElementById("btn_" + i + "_" + j).getAttribute("src").split("_")[1] == "temporary.png") return true

    //מחפש רצף מאונך
    let flag1 = false//שומר האם נמצא רצף כלשהו
    let sum1 = 0;
    let arrC1 = new Array(6);
    arrC1[0] = j;

    for (let k = i - 2; k <= i + 2; k++)
        if (k >= 0 && k < tableHeight && document.getElementById("btn_" + i + "_" + j).getAttribute("src").split("_")[0] == document.getElementById("btn_" + k + "_" + j).getAttribute("src").split("_")[0])
            arrC1[++sum1] = k;

    if (sum1 >= 3) {
        if (sum1 == 5)
            flag1 = true;

        else {
            if (arrC1[sum1 - 2] == i && arrC1[sum1] == i + 2 && i + 3 < tableHeight && document.getElementById("btn_" + (i + 3) + "_" + j).getAttribute("src").split("_")[0] == document.getElementById("btn_" + i + "_" + j).getAttribute("src").split("_")[0]) return true //אם הרצף ממשיך אחר כך שיצא ולא יחשב

            if (sum1 == 4 && i - 2 >= 0 && document.getElementById("btn_" + i + "_" + j).getAttribute("src").split("_")[0] == document.getElementById("btn_" + (i - 2) + "_" + j).getAttribute("src").split("_")[0] && i + 2 < tableHeight && document.getElementById("btn_" + i + "_" + j).getAttribute("src").split("_")[0] == document.getElementById("btn_" + (i + 2) + "_" + j).getAttribute("src").split("_")[0]) {
                if (document.getElementById("btn_" + i + "_" + j).getAttribute("src").split("_")[0] == document.getElementById("btn_" + (i - 1) + "_" + j).getAttribute("src").split("_")[0])
                    arrC1[4] = -1;
                else
                    arrC1[1] = -1;
                sum1--
                flag1 = true
            }
            else if (sum1 == 4)
                flag1 = true
            else if (sum1 == 3 && !(i - 2 >= 0 && document.getElementById("btn_" + i + "_" + j).getAttribute("src").split("_")[0] != document.getElementById("btn_" + (i - 1) + "_" + j).getAttribute("src").split("_")[0] && document.getElementById("btn_" + i + "_" + j).getAttribute("src").split("_")[0] == document.getElementById("btn_" + (i - 2) + "_" + j).getAttribute("src").split("_")[0] || i + 2 < tableHeight && document.getElementById("btn_" + i + "_" + j).getAttribute("src").split("_")[0] != document.getElementById("btn_" + (i + 1) + "_" + j).getAttribute("src").split("_")[0] && document.getElementById("btn_" + i + "_" + j).getAttribute("src").split("_")[0] == document.getElementById("btn_" + (i + 2) + "_" + j).getAttribute("src").split("_")[0]))
                flag1 = true
        }
    }

    //מחפש רצף מאוזן
    let arrC2 = new Array(6);
    let flag2 = false
    let sum2 = 0
    arrC2[0] = i;
    for (let k = j - 2; k <= j + 2; k++)
        if (k >= 0 && k < tableWidth && document.getElementById("btn_" + i + "_" + j).getAttribute("src").split("_")[0] == document.getElementById("btn_" + i + "_" + k).getAttribute("src").split("_")[0])
            arrC2[++sum2] = k;

    if (sum2 == 5)
        flag2 = true;

    else if (sum2 >= 3) {
        if (arrC2[sum2 - 2] == j && arrC2[sum2] == j + 2 && j + 3 < tableWidth && document.getElementById("btn_" + i + "_" + (j + 3)).getAttribute("src").split("_")[0] == document.getElementById("btn_" + i + "_" + j).getAttribute("src").split("_")[0]) //אם הרצץ ממשיך אח"כ שיצא
        {
            if (flag1 == true && crash == true)
                crashesA(arrC1, sum1)
            return true
        }

        else if (sum2 == 3) {
            let x; //אינדקס שיעבור על מערך המיקומים שנמצאו
            for (x = 2; x < 4 && arrC2[x] - arrC2[x - 1] == 1; x++);
            if (x == 4)
                flag2 = true;
        }

        else if (sum2 == 4) {

            let x; //אינדקס שיעבור על מערך המיקומים שנמצאו 
            for (x = 2; x < 5 && sum2 == 4; x++) {
                if (arrC2[x] - arrC2[x - 1] != 1) {
                    if (x == 2) arrC2[1] = -1
                    else if (x == 4) arrC2[4] = -1
                    sum2 = 3;
                }
            }
            flag2 = true;
        }
    }

    if (flag1 == true && flag2 == true) {
        document.getElementById("btn_" + i + "_" + j).src = document.getElementById("btn_" + i + "_" + j).getAttribute("src").split("_")[0] + "_5.png"
        document.getElementById("btn_" + i + "_" + j).className = "empty"
        crashesA(arrC1, sum1)
        crashesB(arrC2, sum2)
    }

    else if (flag1 == true && crash == true) crashesA(arrC1, sum1)

    else if (flag2 == true && crash == true) crashesB(arrC2, sum2)

    return (flag1 == true || flag2 == true)
}

function crashesA(arrC, sum) //פונקציה שמקבלת מערך של מיקומים לגובה ומפוצצת אותם
{
    let j = arrC[0];
    for (let k = 1; k < 6; k++) {
        if (arrC[k] != -1 && arrC[k] != null && document.getElementById("btn_" + arrC[k] + "_" + j).className != "empty") {
            if (sum == 4 && k == 3) {
                pon = document.getElementById("btn_" + arrC[3] + "_" + arrC[0]).getAttribute("src").split(".")
                document.getElementById("btn_" + arrC[3] + "_" + arrC[0]).setAttribute("src", ".." + pon[2].split("_")[0] + "_41." + pon[3])
            }
            else if (sum == 5 && k == 3)
                document.getElementById("btn_" + arrC[3] + "_" + arrC[0]).setAttribute("src", "../picture/chokolet.gif")
            else if ((k != 3 || sum == 3))
                boom("btn_" + arrC[k] + "_" + j)
        }
    }
}

function crashesB(arrC, sum) //פונקציה שמקבלת מערך של מיקומים לאורך ומפוצצת אותם
{
    let i = arrC[0];

    for (let k = 1; k < 6; k++) {
        if (arrC[k] != -1 && arrC[k] != null && document.getElementById("btn_" + i + "_" + arrC[k]).className != "empty") {
            if (sum == 4 && k == 3) {
                pon = document.getElementById("btn_" + arrC[0] + "_" + arrC[3]).getAttribute("src").split(".")
                document.getElementById("btn_" + arrC[0] + "_" + arrC[3]).setAttribute("src", ".." + pon[2].split("_")[0] + "_42." + pon[3])
            }
            else if (sum == 5 && k == 3)
                document.getElementById("btn_" + arrC[0] + "_" + arrC[3]).setAttribute("src", "../picture/chokolet.gif")
            else
                boom("btn_" + i + "_" + arrC[k])
        }
    }
}

function boom(id) //פונקציה שמקבלת מיקום ומפוצצת אותו
{
    if (document.getElementById(id).getAttribute("src").split("_")[1] == "temporary.png") return

    if (document.getElementById(id).src.split("_")[1] == "5.png") {
        let i = parseInt(id.split("_")[1]);
        let j = parseInt(id.split("_")[2]);

        for (let i1 = i - 1; i1 <= i + 1; i1++)
            for (let j1 = j - 1; j1 <= j + 1; j1++)
                if (i1 >= 0 && i1 < tableHeight && j1 >= 0 && j1 < tableWidth && (i1 != i || j1 != j) && document.getElementById("btn_" + i1 + "_" + j1).getAttribute("src").split("_")[1] != "5.png" && document.getElementById("btn_" + i1 + "_" + j1).getAttribute("src").split("_")[1] != "41.png" && document.getElementById("btn_" + i1 + "_" + j1).getAttribute("src").split("_")[1] != "42.png")
                    boom("btn_" + i1 + "_" + j1)
        document.getElementById(id).src = document.getElementById(id).src.split("_")[0] + "_beat.gif"
    }

    else {
        scoreValue += 20
        score.textContent = writeBigNumber(scoreValue)
        updateSide()
        let c = document.getElementById(id)
        c.className = "empty"
        c.style.borderColor = "rgba(18, 56, 79, 0)"
        c.style.width = "0px"
        c.style.height = "0px"
        if (boomSoundOk == true)
            boomSound.play()

        if (document.getElementById(id).src.split("_")[1] == "41.png") {
            c.src = "../picture/boom_temporary.png"
            lineBoom.play()
            let iF = parseInt(id.split("_")[1]);
            let jF = parseInt(id.split("_")[2]);
            for (let i = 0; i < tableHeight; i++) {
                if (i != iF)
                    boom("btn_" + i + "_" + jF);
            }
        }
        else if (document.getElementById(id).src.split("_")[1] == "42.png") {
            c.src = "../picture/boom_temporary.png"
            lineBoom.play()
            let iF = parseInt(id.split("_")[1]);
            let jF = parseInt(id.split("_")[2]);
            for (let j = 0; j < tableWidth; j++) {
                if (j != jF) boom("btn_" + iF + "_" + j);
            }
        }

        else
            c.src = "../picture/boom_temporary.png"

        setTimeout(playGif.bind(null, c), 200)

    }

}

function crashChocolet(id) //פיצוץ כדור שוקולד
{
    let wait = 0
    let src = document.getElementById(id).getAttribute("src")

    if (src == "../picture/chokolet.gif") {
        for (let i = 0; i < tableHeight; i++)
            for (let j = 0; j < tableWidth; j++)
                boom("btn_" + i + "_" + j)
    }

    else if (src.split("_")[1] == "42.png" || src.split("_")[1] == "41.png" || src.split("_")[1] == "5.png") {
        for (let i = 0; i < tableHeight; i++)
            for (let j = 0; j < tableWidth; j++)
                if (document.getElementById("btn_" + i + "_" + j).getAttribute("src").split("_")[0] == src.split("_")[0]) {
                    document.getElementById("btn_" + i + "_" + j).src = src
                    setTimeout(boom.bind(null, "btn_" + i + "_" + j), wait)
                    wait += 1000
                }
    }

    else {
        for (let i = 0; i < tableHeight; i++)
            for (let j = 0; j < tableWidth; j++)
                if (document.getElementById("btn_" + i + "_" + j).getAttribute("src").split("_")[0] == src.split("_")[0])
                    boom("btn_" + i + "_" + j)
    }


    setTimeout(fill, 700)
}

function crashesCover(i, j) //פיצוץ סוכריה עטופה בשלב השני
{
    for (let i1 = i - 1; i1 <= i + 1; i1++)
        for (let j1 = j - 1; j1 <= j + 1; j1++)
            if (i1 >= 0 && i1 < tableHeight && j1 >= 0 && j1 < tableWidth)
                boom("btn_" + i1 + "_" + j1)

    setTimeout(fill, 500)
}

function fill() //פונקציה שעוברת על הלוח, 'דוחפת' את הכול למטה וממלאת את מה שנשאר למעלה 
{
    let flag5 = false

    for (let j = 0; j < tableWidth; j++) {
        let k = tableHeight - 1;
        let i = tableHeight - 1;

        for (; i >= 0; i--)
            if ((document.getElementById("btn_" + i + "_" + j).className != "empty" || document.getElementById("btn_" + i + "_" + j).src.split("_")[1] != ".png") && document.getElementById("btn_" + i + "_" + j).src.split("_")[1] != "temporary.png") {
                if (document.getElementById("btn_" + i + "_" + j).src.split("_")[1] == "beat.gif") {
                    setTimeout(crashesCover.bind(null, k, j), 1000)
                    flag5 = true
                }

                resetBtn(document.getElementById("btn_" + k + "_" + j))
                move((k--), j, i, j)
            }

        for (; k >= 0; k--) {
            resetBtn(document.getElementById("btn_" + k + "_" + j))
            rand(k, j)
        }
    }

    if (flag5 == false) setTimeout(check, 1000)
}

//פונקציות שקשורות לניהול המשחק - ניקוד, זמן וניצחון
function updateSide() //פונקציה שמעדכנת את גובה המקל ע''פ הניקוד שנצבר
{
    if (scoreValue >= parseInt(scoreTotal) && arriveToFinish == false)
        win()
    side.style.height = (440 - (440 - 150) * (scoreValue / scoreTotal)) + "px"
}

function updateTime() //מעדכן את הזמן שנשאר
{
    if (second == 0) {
        if (minute == 0) {
            if (arriveToLost == false) {
                dontWin();
                arriveToLost = true
            }
        }
        else {
            second = 59;
            minute--;
        }
    }
    else second--;

    writeTime()
}

function win() //פונקציה שמופעלת במקרה של ניצחון
{
    arriveToFinish = true
    adding.textContent = "sugar crash"
    adding.style.color = "red"
    adding.style.top = "-280px"
    sugarCrashSound.play()
    window.clearInterval(setTime)
    for (let i = 0; i < tableHeight; i++)
        for (let j = 0; j < tableWidth; j++)
            document.getElementById("btn_" + i + "_" + j).setAttribute("draggable", "false")

    if (waitToFinish != null)
        window.clearInterval(waitToFinish)

    waitToFinish = setInterval(checkFinish.bind(null, true), 100)
}

function dontWin()//פונקציה שמופעלת במקרה של אי ניצחון
{
    for (let i = 0; i < tableHeight; i++)
        for (let j = 0; j < tableWidth; j++)
            document.getElementById("btn_" + i + "_" + j).setAttribute("draggable", "false")

    adding.textContent = "you lost"
    adding.style.color = "red"
    adding.style.top = "-280px"

    waitToFinish = setInterval(checkFinish.bind(null, false), 100)

}

function checkFinish(win) //מופעל לאחר שאין יותר פיצוצים אוטומטיים
{

    if (canToMove == true) {

        window.clearInterval(waitToFinish)

        if (win == true) {
            if (parseInt(stage) == parseInt(localStorage.getItem((sessionStorage.getItem("user"))).split("_")[2]))
                localStorage.setItem((sessionStorage.getItem("user")), localStorage.getItem((sessionStorage.getItem("user"))).split("_")[0] +
                    "_" + parseInt(localStorage.getItem((sessionStorage.getItem("user"))).split("_")[1]) +
                    "_" + parseInt(parseInt(stage) + 1) +
                    "_" + parseInt(parseInt(localStorage.getItem((sessionStorage.getItem("user"))).split("_")[3]) + scoreValue) +
                    "_" + localStorage.getItem((sessionStorage.getItem("user"))).split("_")[4]
                )
            else
                localStorage.setItem((sessionStorage.getItem("user")),
                    localStorage.getItem((sessionStorage.getItem("user"))).split("_")[0] +
                    "_" + parseInt(localStorage.getItem((sessionStorage.getItem("user"))).split("_")[1]) +
                    "_" + parseInt(localStorage.getItem((sessionStorage.getItem("user"))).split("_")[2]) +
                    "_" + parseInt(parseInt(localStorage.getItem((sessionStorage.getItem("user"))).split("_")[3]) + scoreValue) +
                    "_" + localStorage.getItem((sessionStorage.getItem("user"))).split("_")[4]
                )
        }

        else {
            let userData = localStorage.getItem(sessionStorage.getItem("user")).split("_")

            if (parseInt(userData[4]) == 4) {
                localStorage.setItem(sessionStorage.getItem("user"),
                    userData[0] + "_" + userData[1] + "_" + (parseInt(userData[2]) - 1) + "_" + userData[3] + "_0")
            }

            else {
                localStorage.setItem(sessionStorage.getItem("user"),
                    userData[0] + "_" + userData[1] + "_" + userData[2] + "_" + userData[3] + "_" + (parseInt(userData[4]) + 1))
            }
        }


        setTimeout(exit, 300)
    }
}

function exit() //מוציא את לוח המשחק
{
    t.style.right = "-900px"
    setTimeout(moveMap, 2000)
}

function moveMap() //עובר לדף השלבים
{
    window.location = "map.html"
}

//כפתורים
function backgroundSoundPlay() //פונקציה שמפעילה את מנגינת הרקע
{
    backgroundSound.play()
    boomSoundOk = true
}

function backgroundSoundPause() //פונקציה שמפסיקה את מנגינת הרקע
{
    backgroundSound.pause()
    boomSoundOk = false
}

function f_clickEnter() //התחלת המשחק
{
    if (event.keyCode == 13)
        startGame.click()
}

//פונקציות שמשמשות את המשחק

function writeTime() //כתיבת הטיימר במקום המתאים
{
    timer.textContent = "0" + minute + ":" + second;
    if (second < 10) timer.textContent = "0" + minute + ":0" + second;
}

function rand(i, j) //פונקציה שמקבלת מיקום ומגרילה עבורו תמונה
{
    let c = document.getElementById("btn_" + i + "_" + j)
    let arr = ['red', 'green', 'violet', 'yellow', 'blue', 'orange']
    c.setAttribute("src", "../picture/" + arr[Math.floor(Math.random() * countTypes)] + "_.png")
    c.style.marginTop = (0 - tableHeight * 70) + "px"
    c.style.borderColor = "rgba(18, 56, 79, 0)"
    moveSlow("btn_" + i + "_" + j, (0 - tableHeight * 70), 0, "top")
    setTimeout(resetBtn.bind(null, c), 250)
}

function playGif(c) //+של 20 gifהפעלת ה
{
    c.style.width = size + "px"
    c.style.height = size + "px"
    c.src = "../picture/addScore_temporary.png"
    c.className = "empty"
}

function resetBtn(c) //אתחול כפתור
{
    c.className = "pic"
    c.style.width = size + "px"
    c.style.height = size + "px"
    c.style.transition = "width 0.2s ease-in-out, height 0.2s ease-in-out, marginRight 0.8s linear, marginLeft 0.8s ease-in-out"
    c.style.borderColor = "rgba(18, 56, 79, 0.867)"
    c.style.margin = "auto"
}

function move(i1, j1, i2, j2) { //פונקציה שמעבירה תמונה ממקום אחד לשני
    to = document.getElementById("btn_" + i1 + "_" + j1)
    from = document.getElementById("btn_" + i2 + "_" + j2)
    to.setAttribute("src", from.getAttribute("src"))

    to.marginTop = (i2 - i1) * 70 + "px"
    moveSlow(to.getAttribute("id"), ((i2 - i1) * 70), 0, "top")
    setTimeout(resetBtn.bind(null, to), (i1 - i2) * 250)
}

function change(idF, idS) //פונקציה שמחליפה בין התמונות של שתי מיקומים
{
    let iF = parseInt(idF.split("_")[1]);
    let jF = parseInt(idF.split("_")[2]);
    let iS = parseInt(idS.split("_")[1]);
    let jS = parseInt(idS.split("_")[2]);

    let temp = document.getElementById(idF).getAttribute("src");
    document.getElementById(idF).src = document.getElementById(idS).getAttribute("src");
    document.getElementById(idS).src = temp;

    if (iF == iS) {

        if (jF > jS) {
            moveSlow(idS, 70, 0, "right")
            moveSlow(idF, -70, 0, "right")
        }
        else {
            moveSlow(idF, 70, 0, "right")
            moveSlow(idS, -70, 0, "right")
        }

    }

    else {
        if (iF > iS) {
            moveSlow(idS, 70, 0, "top")
            moveSlow(idF, -70, 0, "top")
        }
        else {
            moveSlow(idF, 70, 0, "top")
            moveSlow(idS, -70, 0, "top")
        }
    }

    setTimeout(resetBtn.bind(null, document.getElementById(idF)), 200)
    setTimeout(resetBtn.bind(null, document.getElementById(idS)), 200)
}

function moveSlow(id, margin, final, direction) //transitionבאיטיות - תחליף ל marginמוריד את ה
{
    if (margin == final) {
        document.getElementById(id).style.margin = "auto"
        return
    }

    if (direction == "right") {
        document.getElementById(id).style.marginRight = margin + "px"
        if (final > 0 || final == 0 && margin <= 0) setTimeout(moveSlow.bind(null, id, margin + 5, final, direction), 0.005)
        else setTimeout(moveSlow.bind(null, id, margin - 5, final, direction), 0.005)
    }

    else {
        document.getElementById(id).style.marginTop = margin + "px"
        if (final > 0 || final == 0 && margin <= 0) setTimeout(moveSlow.bind(null, id, margin + 5, final, direction), 0.005)
        else setTimeout(moveSlow.bind(null, id, margin - 5, final, direction), 0.005)
    }


}