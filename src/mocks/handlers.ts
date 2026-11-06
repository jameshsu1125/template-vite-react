import { REST_PATH } from '@/settings/config';
import { faker } from '@faker-js/faker';
import { mergePath } from 'lesca-fetcher';
import { HttpResponse, http } from 'msw';

export const handlers = [
  http.get(mergePath(REST_PATH.test), () => {
    return HttpResponse.json(
      Array.from({ length: 10 }, (_, index) => ({
        userId: faker.number.int({ min: 1, max: 10 }),
        id: index + 1,
        title: faker.lorem.lines(1),
        completed: faker.datatype.boolean(),
      })),
    );
  }),
  http.get('/api', () => {
    return new HttpResponse(null, {
      status: 404,
      statusText: 'Out Of Service',
    });
  }),
];
