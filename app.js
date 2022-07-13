// הגדרה של מופעה
class News { 
  constructor(size, category, data) {
    this.size = size; // אני רוצה שלפי הגודל של המסך הלוגיקה קצת תשתנה
    this.category = category; // נושא של ההופעה
    this.data = data; // מכיל לי את הנתונים שאני מכניס או את הנתונים מ-API
    this.dataDisplay; // המערך שממנו אני יציג את הנתונים

    if (this.data == undefined) {
      // בודק שלא הכנסתי לא ערך
      // this.getApi();// פונקציה לקבלת נתונים מה-API
    } else {
      //אם כן הכנסתי נתונים
      this.data = data.articles; //מגדיר מחדש אותו
      this.data.forEach((value, i) => {
        value.source.id = i; // נותן מספר לפי המיקום שלו במערך
      });
      this.dataDisplay = [...this.data]; //מעביר את הנתונים למערך של ההצגה
      if (this.size <= 450) {
        //בודק אם גודל המסך שלי קטן מ-450
        this.dataDisplay.length = 1; //  ל-1 קובע את אורך המערך/את כמות הנתונים
      } else {
        this.dataDisplay.length = 3; //  קובע את אורך המערך/את כמות הנתונים ל-3
      }
      this.display(this.dataDisplay); // פונקציה להדפסת הוויזואליה/התצוגה של האתר
    }
  }
  // פונקיצה לקבלת המידע מהאתר
  getApi() {
    const API_KEY = "124e05c3554842a4abd1ae7002f0bb35";
    fetch(
      `https://newsapi.org/v2/top-headlines?country=il&category=${this.category}&apiKey=${API_KEY}`
    )
      .then((response) => response.json())
      .then((data) => {
        this.data = data.articles;
        this.data.forEach((value, i) => {
          value.source.id = i;
        });
        this.dataDisplay = [...this.data];
        if (this.size <= 450) {
          this.dataDisplay.length = 1;
        } else {
          this.dataDisplay.length = 3;
        }
        this.display(this.dataDisplay);
      });
  }
  // פונקיצה להוזזת הנתונים ימינה
  toRight() {
    if (this.size <= 450) {
      if (this.data[this.dataDisplay[0].source.id + 1] != undefined) {
        // בודק שהערך הבאה שאני אמור להכניס יש לו ערך
        this.dataDisplay.push(this.data[this.dataDisplay[0].source.id + 1]); // דוחף את הנתון למערך של הנתונים להצגה מהסוף
        this.dataDisplay.shift();

        this.display(this.dataDisplay);
      }
    } else {
      if (this.data[this.dataDisplay[2].source.id + 1] != undefined) {
        this.dataDisplay.push(this.data[this.dataDisplay[2].source.id + 1]);
        this.dataDisplay.shift();

        this.display(this.dataDisplay);
      }
    }
  }
  // פונקיצה להוזזת הנתונים שמלאה
  toLeft() {
    if (this.data[this.dataDisplay[0].source.id - 1] != undefined) {
      this.dataDisplay.unshift(this.data[this.dataDisplay[0].source.id - 1]);
      this.dataDisplay.pop();

      this.display(this.dataDisplay);
    }
  }
  // פונקיצה להפיכת האות הראשונה לאות גדולה
  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  // פונקציה להדפסת הוויזואליה/התצוגה של האתר
  display(param) {
    let div = document.querySelector(`.${this.category}`); // בחירה של המעטפת
    div.className = // הגדרה של שם ומאפיינים עיצובים
      this.category +
      " section container-fluid d-flex flex-wrap justify-content-between my-3";
    div.innerHTML = `<h2 class="title-box col-12 ">${
      // הזרקה של כותרת ושל כפתורים להעברה לצדדים
      this.category
    }</h2> <button class="to-left" onclick=${
      "news" + this.capitalizeFirstLetter(this.category) + "." + this.toLeft
    }><i class="fa-solid fa-arrow-left"></i></button><button class="to-right" onclick=${
      "news" + this.capitalizeFirstLetter(this.category) + "." + this.toRight
    }><i class="fa-solid fa-arrow-right"></i></button>`;
    param.forEach((value, i) => {
      div.innerHTML += `<div class="box d-flex flex-column justify-content-around col-12 col-md-3 text-center mb-3">
      <a href=${value.url}>  <div>
          <img src="${value.urlToImage}" alt="">
          
          <h6>${value.title}</h6></div></a>
          <p class="d-flex justify-content-around align-items-center">  
              <i  class="fa-solid fa-thumbtack" value="${param[i].source.id}"></i>

              </p></div>
              `;
    });
    if (this.category != "saves") {
      // בודק אם הקטגוריה שונה מערכים שמורים
      newsSaveLater = document.querySelectorAll(`.fa-thumbtack`); //בוחר את כל האייקונים של השמירה
      newsSaveLater.forEach((element) => {
        element.addEventListener("click", () => {
          if (element.className.includes("save-news")) return;
          element.classList.add("save-news"); // נותן צבע ירוק מסביב לאייקון
          this.toLocalStorig(this.data[element.attributes[1].value]); //שמירה של הנתון באחסון המקומי
          getLocal(); // פונקציה שקוראת לנתונים מהאחסון המקומי והצגה שלהם
          function removeClass() {
            element.classList.remove("save-news"); // הסרה של הצבע מסביב לאייקון
          }
          setTimeout(removeClass, 3000);
        });
      });
    } else {
      //אם הוא מערכים שמורים
      removeItems = document.querySelectorAll(`.saves>.box>p>i`); // בוחר לי ספציפית את האייקונים
      removeItems.forEach((element) => {
        element.addEventListener("click", () => {
          localStorigData[0].articles.splice(element.attributes[1].value, 1); //מוחק לי אותם מהמערך לפי המיקום שלו
          localStorage.setItem(
            "localStorigData",
            JSON.stringify(localStorigData)
          ); //שמירה של המערך באחסון המקומי
          getLocal(); //פונקציה שקוראת לנתונים מהאחסון המקומי והצגה שלהם
        });
      });
    }
  }
  // פונקציה לשמירת הנתונים באחסון המקומי
  toLocalStorig(para) {
    if (localStorigData[0].articles.includes(para)) return; // בודק שהנתונחם לא קיימים לי במערך
    localStorigData[0].articles.push(para); // מכניס אותם למערך
    localStorage.setItem("localStorigData", JSON.stringify(localStorigData)); // שמירה של המערך באחסון המקומי
  }
}

let localStorigData = [{ articles: [] }]; //מערך המבוסס על הצורה שאני מקבל את הנתונים מה-API ואחראי על שמירה של הנתונים המגעים מהאחסון המקומי
let newsSaveLater; //אחראי לשמור לי את כל האייקונים של השמירה
let removeItems; // אחראי על שמירה של האייקונים של ההסרה

// הגדרה של משתנים לפי קטרוגיות שיירשו
let newsSaves;
let newsSport;
let newsBusiness;
let newsEntertainment;
let newsGeneral;
let newsHealth;
let newsScience;
let newsTechnology;

//פונקציה של קבלת והצגה של נתונים מהאחסון המקומי
function getLocal(size) {
  let getDataLocalStoreg = JSON.parse(localStorage.getItem("localStorigData")); //קבלת הנתונים מהאחסון המקומי
  if (getDataLocalStoreg != undefined) {
    // בדיקה שי לו ערך
    localStorigData = getDataLocalStoreg; // השווה של הנתונים
  }
  if (getDataLocalStoreg != undefined) {
    getDataLocalStoreg[0].articles.forEach((e, i) => {
      e.source.id = i; // מספור של הנתונים
    });
    newsSaves = new News(size, "saves", getDataLocalStoreg[0]); // יצירה של ירושה
    // newsSaves.display()
  }
}

//אירוע שמופעל כל פעם שמשנים את הגודל של המסך
window.addEventListener("resize", () => {
  //הגדרה של ירושות
  getLocal(window.innerWidth);
  newsSport = new News(window.innerWidth, "sport");
  newsBusiness = new News(window.innerWidth, "business");
  newsEntertainment = new News(window.innerWidth, "entertainment");
  newsGeneral = new News(window.innerWidth, "general");
  newsHealth = new News(window.innerWidth, "health");
  newsScience = new News(window.innerWidth, "science");
  newsTechnology = new News(window.innerWidth, "technology");
});
//הגדרה של ירושות שיפעלו אוטמטי/כשהדף עולה
getLocal(window.innerWidth);
newsSport = new News(window.innerWidth, "sport");
newsBusiness = new News(window.innerWidth, "business");
newsEntertainment = new News(window.innerWidth, "entertainment");
newsGeneral = new News(window.innerWidth, "general");
newsHealth = new News(window.innerWidth, "health");
newsScience = new News(window.innerWidth, "science");
newsTechnology = new News(window.innerWidth, "technology");

// weather API //

let weatherInput = document.querySelector(".input-container>input"); // השגה של תיבה להכנסת טקסט
let weatherPara = document.querySelectorAll(".para-container>p"); // השגה של השורות

// אירוע שבודק כל פעם את הטקסט שמוזן
weatherInput.addEventListener("keyup", function () {
  weahterApi();
});

//פונקציה שאחראית לתת לי נתונים של מזג אוויר והצגה שלהם באתר
function weahterApi() {
  let city = weatherInput.value; // קבלה של הערך מהתבית טקסט
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=2cf26a0cbe13cbe0caeb15ff772be510&units=metric`
  )
    .then((res) => res.json())
    .then((data) => {
      if (data.name == undefined) {
        // בודק אם אני לא מקבל נתונים
        document.querySelector("h3").innerText = `אין עיר בשם ${city}`; // מדפיס הודעה שאין שם של עיר כזאת
        document.querySelector("h3").style.cssText = "display: block;color:red"; // נותן צבע להדגשה
        // מעלים את כל השורות שלא מופיע בהם ערך
        weatherPara[0].style.display = "none";
        weatherPara[1].style.display = "none";
        weatherPara[2].style.display = "none";
        weatherPara[3].style.display = "none";
        
      } else {
        const img =
          "http://openweathermap.org/img/wn/" +
          data.weather[0].icon +
          "@2x.png"; // משיג את התמונה

        // מזריק את הנתונים
        weatherPara[0].innerHTML = `${data.name} :עיר `;
        weatherPara[2].innerHTML = `טמפרטורה: ${data.main.temp}`;
        weatherPara[1].innerHTML = `${data.sys.country} :מדינה`;
        weatherPara[3].innerHTML = `<img src =${img}>`;

        //מציג את הנתונים
        weatherPara[0].style.display = "block";
        weatherPara[1].style.display = "block";
        weatherPara[2].style.display = "block";
        weatherPara[3].style.display = "block";
        // מעלים את ההתראה
        document.querySelector("h3").style.cssText = "display: none;";
      }
    });
}

weahterApi();
