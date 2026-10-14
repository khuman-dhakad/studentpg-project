import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = __ENV.BASE_URL || 'http://localhost:8080';
const SAMPLE_PG_ID = __ENV.SAMPLE_PG_ID || '6aca61861f0f9eb68c61d30a';

export const options = {
  stages: [
    { duration: '15s', target: 100 },
    { duration: '90s', target: 200 },  // Sustained 200 VUs for 1.5 minutes
    { duration: '15s', target: 0 },
  ],
  thresholds: {
    'http_req_failed': ['rate<0.01'],
    'http_req_duration': ['p(95)<400'],
  },
};

export default function () {
  const pgsRes = http.get(`${BASE_URL}/api/student/pgs?page=0&size=10`);
  check(pgsRes, { 'pgs ok': (r) => r.status === 200 });

  const detailRes = http.get(`${BASE_URL}/api/student/pgs/${SAMPLE_PG_ID}`);
  check(detailRes, { 'details ok': (r) => r.status === 200 });

  sleep(0.5);
}
