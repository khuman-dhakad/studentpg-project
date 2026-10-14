import http from 'k6/http';
import { check, group, sleep } from 'k6';
import { Counter, Rate, Trend } from 'k6/metrics';

// Custom Metrics
const errorRate = new Rate('custom_error_rate');
const listingDuration = new Trend('duration_public_listings');
const detailsDuration = new Trend('duration_pg_details');
const searchDuration = new Trend('duration_search_filter');
const suggestionsDuration = new Trend('duration_suggestions');

const BASE_URL = __ENV.BASE_URL || 'http://localhost:8080';
const SAMPLE_PG_ID = __ENV.SAMPLE_PG_ID || '6aca61861f0f9eb68c61d30a';

export const options = {
  scenarios: {
    target_1000_vus: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '10s', target: 100 },   // Warmup to 100 VUs
        { duration: '15s', target: 250 },   // Ramp to 250 VUs
        { duration: '20s', target: 500 },   // Ramp to 500 VUs
        { duration: '25s', target: 1000 },  // Peak target: 1,000 concurrent VUs
        { duration: '30s', target: 1000 },  // Sustain 1,000 concurrent VUs
        { duration: '15s', target: 250 },   // Controlled ramp-down
        { duration: '10s', target: 0 },     // Final drain
      ],
      gracefulRampDown: '5s',
    },
  },
  thresholds: {
    'http_req_failed': ['rate<0.02'],              // Error rate below 2% during peak
    'http_req_duration': ['p(95)<500', 'p(99)<1200'], // 95% of requests under 500ms
    'duration_public_listings': ['p(95)<400'],     // Cached listings under 400ms
    'duration_pg_details': ['p(95)<350'],          // Cached details under 350ms
  },
};

export default function () {
  const rand = Math.random();

  if (rand < 0.40) {
    // Scenario 1: Browse Public Listings (40%)
    group('Browse Listings', () => {
      const res = http.get(`${BASE_URL}/api/student/pgs?page=0&size=10`, {
        tags: { endpoint: 'get_pgs' },
      });
      listingDuration.add(res.timings.duration);
      const ok = check(res, {
        'status is 200': (r) => r.status === 200,
        'has content array': (r) => {
          try {
            const body = JSON.parse(r.body);
            return Array.isArray(body.content);
          } catch (e) {
            return false;
          }
        },
      });
      errorRate.add(!ok);
    });
  } else if (rand < 0.70) {
    // Scenario 2: Search and Filter (30%)
    group('Search & Filter', () => {
      const queryTerm = Math.random() < 0.5 ? 'Bho' : 'Bar';
      const suggestRes = http.get(`${BASE_URL}/api/student/pgs/suggestions?query=${queryTerm}`, {
        tags: { endpoint: 'suggestions' },
      });
      suggestionsDuration.add(suggestRes.timings.duration);
      const suggestOk = check(suggestRes, {
        'suggestions status 200': (r) => r.status === 200,
      });
      errorRate.add(!suggestOk);

      sleep(0.1 + Math.random() * 0.2); // Realistic human delay after seeing suggestions

      const searchRes = http.get(`${BASE_URL}/api/search?q=Barda&page=0&size=10`, {
        tags: { endpoint: 'search' },
      });
      searchDuration.add(searchRes.timings.duration);
      const searchOk = check(searchRes, {
        'search status is 200': (r) => r.status === 200,
      });
      errorRate.add(!searchOk);
    });
  } else if (rand < 0.95) {
    // Scenario 3: View PG Details (25%)
    group('View PG Details', () => {
      const res = http.get(`${BASE_URL}/api/student/pgs/${SAMPLE_PG_ID}`, {
        tags: { endpoint: 'pg_details' },
      });
      detailsDuration.add(res.timings.duration);
      const ok = check(res, {
        'details status is 200': (r) => r.status === 200,
        'details id matches': (r) => {
          try {
            const body = JSON.parse(r.body);
            return body.id === SAMPLE_PG_ID;
          } catch (e) {
            return false;
          }
        },
      });
      errorRate.add(!ok);
    });
  } else {
    // Scenario 4: Health Check (5%)
    group('Health Check', () => {
      const res = http.get(`${BASE_URL}/actuator/health`, {
        tags: { endpoint: 'health' },
      });
      check(res, {
        'health status is 200': (r) => r.status === 200,
      });
    });
  }

  // Realistic human think time between actions (200ms - 800ms)
  sleep(0.2 + Math.random() * 0.6);
}
