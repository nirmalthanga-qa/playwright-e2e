import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  stages: [
    { duration: '30s', target: 20 },
    { duration: '1m', target: 20 },
    { duration: '10s', target: 0 },
 ],
//   thresholds: {
//     http_req_duration: ['p(95)<200'],
//   },
};
export default function () {
  let res = http.get('https://www.medicaid.gov/');
  check(res, {
    'status was 200': (r) => r.status == 200,
    'response time was < 200ms': (r) => r.timings.duration < 200,
  });
  sleep(1);
}