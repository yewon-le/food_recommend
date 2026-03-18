let currentPool = [];   // 마지막 추천 후보들 저장
let lastResult = "";    // 직전 결과 저장

// 🔥 질문 리스트
const questions = [
    {
        text: "오늘 기분은?",
        options: [
            { value: "happy", label: "😊 좋음" },
            { value: "tired", label: "😫 피곤" },
            { value: "hungry", label: "🤤 배고픔" }
        ]
    },
    {
        text: "매운거 가능?",
        options: [
            { value: "yes", label: "🔥 가능" },
            { value: "no", label: "❌ 못먹음" }
        ]
    },
    {
        text: "돈 얼마나 쓸래?",
        options: [
            { value: "low", label: "💰 적당" },
            { value: "high", label: "💸 많이" }
        ]
    },
    {
        text: "배고픔 정도?",
        options: [
            { value: "low", label: "🙂 보통" },
            { value: "high", label: "😵 매우 배고픔" }
        ]
    },
    {
        text: "분위기?",
        options: [
            { value: "date", label: "💖 데이트" },
            { value: "casual", label: "😎 편하게" }
        ]
    }
];

// 🔥 음식 데이터
// 🍱 전체 메뉴
const menuList = [
    // 한식
    "김치찌개","된장찌개","순두부찌개","부대찌개","청국장","제육볶음","불고기","비빔밥","돌솥비빔밥",
    "냉면","물냉면","비빔냉면","밀면","칼국수","잔치국수","비빔국수",
    "삼겹살","목살","항정살","갈비","LA갈비","닭갈비","찜닭","닭볶음탕","삼계탕",
    "해장국","국밥","순대국","돼지국밥","설렁탕","곰탕","갈비탕",
    "쭈꾸미볶음","오징어볶음","낙지볶음","보쌈","족발","편육",
    "떡국","만두국","떡만두국","김치전","해물파전","부추전",
    "곱창","막창","대창","염통","닭발","오돌뼈","두부김치",

    // 분식
    "떡볶이","로제떡볶이","마라떡볶이","짜장떡볶이",
    "순대","튀김","김말이","야채튀김","고구마튀김",
    "핫도그","치즈핫도그","컵밥","어묵","라볶이","쫄면",

    // 중식
    "짜장면","간짜장","삼선짜장","짬뽕","삼선짬뽕","짬짜면",
    "탕수육","깐풍기","라조기","양장피","마파두부","고추잡채",
    "유린기","멘보샤","마라탕","마라샹궈","훠궈",

    // 일식
    "초밥","회","연어덮밥","가츠동","규동","사케동",
    "돈카츠","치즈돈카츠","냉모밀","우동","냉우동","소바",
    "라멘","돈코츠라멘","탄탄멘","오코노미야끼","타코야끼","야끼니쿠",

    // 양식
    "파스타","크림파스타","토마토파스타","로제파스타","알리오올리오","봉골레파스타",
    "피자","고르곤졸라피자","페퍼로니피자","콤비네이션피자","불고기피자",
    "리조또","버섯리조또","해산물리조또",
    "스테이크","함박스테이크","찹스테이크",
    "햄버거","치즈버거","베이컨버거","샌드위치","파니니","브런치","샐러드",

    // 패스트푸드
    "치킨","양념치킨","후라이드치킨","간장치킨","마늘치킨","허니버터치킨",
    "버거세트","감자튀김","치즈스틱","핫윙","치킨너겟",

    // 아시아
    "쌀국수","팟타이","팟씨유","반미","나시고렝","카오팟",
    "똠얌꿍","탄탄면","카레","인도커리","난","버터치킨커리",

    // 디저트
    "케이크","치즈케이크","초코케이크","마카롱","와플","팬케이크",
    "빙수","팥빙수","망고빙수","아이스크림","젤라또",
    "크로플","타르트","도넛","브라우니","쿠키",

    // 야식
    "족발","보쌈","치킨","피자","떡볶이","라면","곱창","막창","닭발","야끼니쿠"
];


// 🔥 매운 음식
const spicyFoods = [
    "떡볶이","마라탕","불닭","짬뽕","쭈꾸미볶음","닭발",
    "마라샹궈","불닭볶음면","라면(매운맛)","낙지볶음"
];


// 💖 데이트용
const dateFoods = [
    "파스타","스테이크","초밥","리조또","브런치",
    "샐러드","와인안주","타파스","연어덮밥","봉골레파스타"
];


// 💸 가성비
const cheapFoods = [
    "김밥","라면","떡볶이","컵밥","어묵",
    "쫄면","편의점도시락","삼각김밥","핫도그","토스트"
];

// 🔥 상태
let currentStep = 0;
let answers = {};

// 질문 로드
function loadQuestion() {
    const q = questions[currentStep];

    document.getElementById("question-text").innerText = q.text;

    const select = document.getElementById("answer");
    select.innerHTML = "";

    q.options.forEach(opt => {
        const option = document.createElement("option");
        option.value = opt.value;
        option.innerText = opt.label;
        select.appendChild(option);
    });
}

// 다음 버튼
function nextQuestion() {
    const answer = document.getElementById("answer").value;
    answers[currentStep] = answer;

    currentStep++;

    if (currentStep < questions.length) {
        loadQuestion();
    } else {
        showResult();
    }
}

// 결과 출력 (🔥 두구두구 포함)
function showResult() {
    const resultBox = document.getElementById("result");

    function randomPick(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    const spicy = answers[1];
    const money = answers[2];
    const hunger = answers[3];
    const vibe = answers[4];

    let pool = [...menuList];

    if (spicy === "yes") {
        pool = pool.concat(spicyFoods, spicyFoods);
    }

    if (vibe === "date") {
        pool = pool.concat(dateFoods, dateFoods);
    }

    if (money === "low") {
        pool = pool.concat(cheapFoods, cheapFoods);
    }

    if (hunger === "high") {
        pool = pool.concat(menuList);
    }

    // 🔥 저장
    currentPool = pool;

    let finalResult = randomPick(pool);

    lastResult = finalResult;

    document.getElementById("question-box").style.display = "none";
    document.querySelector(".main-btn").style.display = "none";

    // 두구두구
    const rollingText = ["두", "두구", "두구두", "두구두구", "두구두구두구..."];
    let i = 0;

    const interval = setInterval(() => {
        resultBox.innerText = rollingText[i % rollingText.length];
        i++;
    }, 150);

    setTimeout(() => {
        clearInterval(interval);
        resultBox.innerText =
            "🎉 오늘 우리 메뉴는 🎉\n\n👉 " + finalResult;
    }, 2000);
    document.getElementById("reroll-btn").style.display = "inline-block";
}

function rerollMenu() {
    const resultBox = document.getElementById("result");

    function randomPick(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    let newResult = lastResult;

    // 🔥 이전 결과랑 다를 때까지 다시 뽑기
    while (newResult === lastResult) {
        newResult = randomPick(currentPool);
    }

    lastResult = newResult;

    resultBox.innerText =
        "💖 다시 골라봤어 💖\n\n👉 " + newResult;

}
setTimeout(() => {
    clearInterval(interval);

    resultBox.innerText =
        "🎉 오늘 우리 메뉴는 🎉\n\n👉 " + finalResult;

    // 🔥 여기!
    document.getElementById("reroll-btn").style.display = "inline-block";
    const btn = document.getElementById("reroll-btn");
    btn.style.display = "inline-block";

    setTimeout(() => {
        btn.classList.add("show");
    }, 50);
}, 2000);

// 시작
loadQuestion();