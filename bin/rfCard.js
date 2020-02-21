console.log("welcome rf reader");

// var mfrc522 = require("MFRC522-node");
const Mfrc522 = require("mfrc522-rpi");
const SoftSPI = require("rpi-softspi");


const socket = require('../socket/socket');

var index = {};
function sleep(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms)
  })
}

const softSPI = new SoftSPI({
  clock: 23, // pin number of SCLK
  mosi: 19, // pin number of MOSI
  miso: 21, // pin number of MISO
  client: 24 // pin number of CS
});

// GPIO 24 can be used for buzzer bin (PIN 18), Reset pin is (PIN 22).
// I believe that channing pattern is better for configuring pins which are optional methods to use.
const mfrc522 = new Mfrc522(softSPI).setResetPin(22).setBuzzerPin(18);

console.log('onStart');

(async () => {
  for (; ;) {
    //# reset card
    mfrc522.reset();

    //# Scan for cards
    let response = mfrc522.findCard();
    if (!response.status) {
      //   console.log("No Card");
      await sleep(500);
    } else {
      console.log("Card detected, CardType: " + response.bitSize);

      //# Get the UID of the card
      response = mfrc522.getUid();
      if (!response.status) {
        console.log("UID Scan Error");
        await sleep(500);
      }
      //# If we have the UID, continue
      const uid = response.data;

      let ReturnMac = ("00" + parseInt(uid[0]).toString(16)).slice(-2) + ":" +
        ("00" + parseInt(uid[1]).toString(16)).slice(-2) + ":" +
        ("00" + parseInt(uid[2]).toString(16)).slice(-2) + ":" +
        ("00" + parseInt(uid[3]).toString(16)).slice(-2);
      console.log("Card read UID: ", ReturnMac);
      //For Frenkie to send to Web 
      socket.readCard(ReturnMac);


      mfrc522.stopCrypto();
      await sleep(6000);
    }
  }
})();
module.exports = index;