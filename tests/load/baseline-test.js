import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = __ENV.BASE_URL || 'http://localhost:8080';
const SAMPLE_PG_ID = __ENV.SAMPLE_PG_ID || '6aca61861f0f9eb68c61d30a';

export const options = {
  stages: [
    { duration: '10s', target: 10 },
    { duration: '15s', target: 25 },
    { duration: '15s', target: 50 },
    { duration: '20s', target: 100 },
    { duration: '10s', target: 0 },
  ],
  thresholds: {
    'http_req_failed': ['rate<0.01'],
    'http_req_duration': ['p(95)<400'],
  },
};

export default function () {
  const pgsRes = http.get(`${BASE_URL}/api/student/pgs?page=0&size=10`);
  check(pgsRes, {
    'pgs status 200': (r) => r.status === 200,
  });

  const detailRes = http.get(`${BASE_URL}/api/student/pgs/${SAMPLE_PG_ID}`);
  check(detailRes, {
    'detail status 200': (r) => r.status === 200,
  });

  const searchRes = http.get(`${BASE_URL}/api/search?q=Barda`);
  check(searchRes, {
    'search status 200': (r) => r.status === 200,
  });

  sleep(0.3 + Math.random() * 0.4);
}
