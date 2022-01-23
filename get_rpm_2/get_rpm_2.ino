#define ANALOG_PIN A0
#define NOISE_FILTER 20000 // 最大20000rpmまで測定可能
#define RPM_COEFFICIENT 2 // GB350の場合
#define ANALOG_DIFF_THRESHOLD 150

int isNoise(long duration_us) {
  return duration_us < NOISE_FILTER;
}

int getRpm(long duration_us) {
  double duration_s = duration_us / 1000.0 / 1000.0;
  return RPM_COEFFICIENT * 60 / duration_s;
}

unsigned long getPulse () {
  unsigned long preTime = micros();
  int preValue = analogRead(ANALOG_PIN);
  while (1) {
    int value = analogRead(ANALOG_PIN);
    if (preValue - value > ANALOG_DIFF_THRESHOLD) {
      unsigned long currentTime = micros();
      unsigned long duration = currentTime - preTime;
      if (!isNoise(duration)) {
        preTime = currentTime;
        return duration;
      }
    }
    preValue = value;
  }
}

void setup() {
  Serial.begin(9600);
}

void loop() {
  unsigned long duration_us = getPulse();
  Serial.println(getRpm(duration_us));
//  Serial.println(duration_us);
}
