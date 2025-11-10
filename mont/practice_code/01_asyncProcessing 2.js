// 1. Promise를 사용한 비동기 처리
function getDataWithPromise() {
  fetch("https://api.example.com/user")
    .then(response => response.json())
    .then(data => {
      console.log("Promise 방식 데이터:", data);
    })
    .catch(error => {
      console.error("에러 발생:", error);
    });
}

// 2. async/await를 사용한 비동기 처리
async function getDataWithAsync() {
  try {
    const response = await fetch("https://api.example.com/user");
    const data = await response.json();
    console.log("async/await 방식 데이터:", data);
  } catch (error) {
    console.error("에러 발생:", error);
  }
}
