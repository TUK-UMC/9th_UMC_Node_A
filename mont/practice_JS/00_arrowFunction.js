// 화살표 함수 기본형
const helloworld = () => console.log("Hello World!");
helloworld();

// setTimeout을 이용한 응용형
const timerObj = {
  count: 0,
  startTimer() {
    setTimeout(() => {
      this.count++;         // 바깥 scope까지 사용 가능한 this
      console.log(`1초 후 count 값: ${this.count}`);
    }, 1000);
  }
};
